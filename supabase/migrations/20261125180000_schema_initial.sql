-- Web Online Concept : schéma initial (site + back-office factures/URSSAF)
-- Accès : un seul administrateur, identifié par son e-mail.

-- ---------------------------------------------------------------------------
-- Outils communs
-- ---------------------------------------------------------------------------
create or replace function public.est_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((auth.jwt() ->> 'email') = 'web.online.concept@gmail.com', false);
$$;

create or replace function public.maj_horodatage()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.modifie_le := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Paramètres de l'entreprise (une seule ligne)
-- ---------------------------------------------------------------------------
create table public.parametres (
  id smallint primary key default 1 check (id = 1),
  nom_commercial text not null default 'Web Online Concept',
  raison_sociale text not null default 'Florent Regnault EI',
  siren text not null default '510583800',
  siret text not null default '51058380000048',
  code_ape text not null default '6201Z',
  adresse text not null default '5 rue Paul Estival',
  code_postal text not null default '31200',
  ville text not null default 'Toulouse',
  pays text not null default 'France',
  email text not null default 'contact@web-online-concept.com',
  telephone text not null default '06 03 36 93 42',
  site_web text not null default 'https://www.web-online-concept.com',
  iban text,
  bic text,
  mention_tva text not null default 'TVA non applicable, art. 293 B du CGI',
  conditions_paiement text not null default 'Paiement à 30 jours à compter de la date de facture, par virement bancaire.',
  penalites_retard text not null default 'En cas de retard de paiement, des pénalités sont exigibles au taux de trois fois le taux d''intérêt légal, ainsi qu''une indemnité forfaitaire pour frais de recouvrement de 40 € (art. L.441-10 et D.441-5 du Code de commerce). Pas d''escompte pour paiement anticipé.',
  delai_paiement_jours int not null default 30,
  validite_devis_jours int not null default 30,
  modifie_le timestamptz not null default now()
);
insert into public.parametres (id) values (1);
create trigger parametres_horodatage before update on public.parametres
  for each row execute function public.maj_horodatage();

-- ---------------------------------------------------------------------------
-- Taux URSSAF (avec date d'effet) et plafond micro-entreprise
-- ---------------------------------------------------------------------------
create table public.taux_urssaf (
  id bigint generated always as identity primary key,
  date_effet date not null unique,
  libelle_categorie text not null,
  cotisations numeric(5,2) not null,
  versement_liberatoire numeric(5,2) not null,
  formation numeric(5,2) not null,
  plafond_ca numeric(12,2) not null,
  cree_le timestamptz not null default now()
);
insert into public.taux_urssaf (date_effet, libelle_categorie, cotisations, versement_liberatoire, formation, plafond_ca)
values ('2026-01-01', 'Prestations de services commerciales ou artisanales (BIC)', 21.20, 1.70, 0.10, 83600);

-- ---------------------------------------------------------------------------
-- Clients
-- ---------------------------------------------------------------------------
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'entreprise' check (type in ('entreprise', 'particulier')),
  nom text not null,
  siren text,
  siret text,
  tva_intra text,
  adresse text,
  code_postal text,
  ville text,
  pays text not null default 'France',
  contact_nom text,
  email text,
  telephone text,
  notes text,
  archive boolean not null default false,
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now()
);
create trigger clients_horodatage before update on public.clients
  for each row execute function public.maj_horodatage();

-- ---------------------------------------------------------------------------
-- Numérotation continue par type et par année
-- ---------------------------------------------------------------------------
create table public.compteurs (
  type text not null check (type in ('facture', 'avoir', 'devis')),
  annee int not null,
  dernier int not null default 0,
  primary key (type, annee)
);

create or replace function public.prochain_numero(p_type text, p_date date)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_annee int := extract(year from p_date)::int;
  v_n int;
begin
  if not public.est_admin() then
    raise exception 'Accès refusé';
  end if;
  insert into public.compteurs (type, annee, dernier) values (p_type, v_annee, 1)
  on conflict (type, annee) do update set dernier = public.compteurs.dernier + 1
  returning dernier into v_n;
  return case p_type when 'facture' then 'F' when 'avoir' then 'A' else 'D' end
    || '-' || v_annee || '-' || lpad(v_n::text, 4, '0');
end;
$$;

-- ---------------------------------------------------------------------------
-- Devis
-- ---------------------------------------------------------------------------
create table public.devis (
  id uuid primary key default gen_random_uuid(),
  numero text unique,
  client_id uuid not null references public.clients (id),
  objet text not null default '',
  date_emission date,
  date_validite date,
  statut text not null default 'brouillon'
    check (statut in ('brouillon', 'envoye', 'accepte', 'refuse', 'expire')),
  total_ht numeric(12,2) not null default 0,
  total_tva numeric(12,2) not null default 0,
  total_ttc numeric(12,2) not null default 0,
  notes text,
  emetteur jsonb,
  client jsonb,
  jeton_acceptation uuid not null default gen_random_uuid() unique,
  accepte_le timestamptz,
  accepte_par text,
  envoye_le timestamptz,
  facture_id uuid,
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now()
);
create trigger devis_horodatage before update on public.devis
  for each row execute function public.maj_horodatage();

create table public.devis_lignes (
  id uuid primary key default gen_random_uuid(),
  devis_id uuid not null references public.devis (id) on delete cascade,
  position int not null default 0,
  designation text not null,
  description text,
  quantite numeric(12,3) not null default 1,
  unite text,
  prix_unitaire numeric(12,2) not null default 0,
  taux_tva numeric(5,2) not null default 0,
  total_ht numeric(12,2) generated always as (round(quantite * prix_unitaire, 2)) stored
);
create index devis_lignes_devis_idx on public.devis_lignes (devis_id);

-- ---------------------------------------------------------------------------
-- Factures et avoirs
-- ---------------------------------------------------------------------------
create table public.factures (
  id uuid primary key default gen_random_uuid(),
  numero text unique,
  type text not null default 'facture' check (type in ('facture', 'avoir')),
  facture_origine_id uuid references public.factures (id),
  client_id uuid not null references public.clients (id),
  devis_id uuid references public.devis (id),
  objet text not null default '',
  date_emission date,
  date_echeance date,
  statut text not null default 'brouillon'
    check (statut in ('brouillon', 'emise', 'payee', 'annulee')),
  total_ht numeric(12,2) not null default 0,
  total_tva numeric(12,2) not null default 0,
  total_ttc numeric(12,2) not null default 0,
  montant_encaisse numeric(12,2) not null default 0,
  notes text,
  emetteur jsonb,
  client jsonb,
  pdf_chemin text,
  pdf_sha256 text,
  emise_le timestamptz,
  envoyee_le timestamptz,
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now()
);
create index factures_client_idx on public.factures (client_id);
create index factures_date_idx on public.factures (date_emission);
create trigger factures_horodatage before update on public.factures
  for each row execute function public.maj_horodatage();

alter table public.devis
  add constraint devis_facture_fk foreign key (facture_id) references public.factures (id);

create table public.facture_lignes (
  id uuid primary key default gen_random_uuid(),
  facture_id uuid not null references public.factures (id) on delete cascade,
  position int not null default 0,
  designation text not null,
  description text,
  quantite numeric(12,3) not null default 1,
  unite text,
  prix_unitaire numeric(12,2) not null default 0,
  taux_tva numeric(5,2) not null default 0,
  total_ht numeric(12,2) generated always as (round(quantite * prix_unitaire, 2)) stored
);
create index facture_lignes_facture_idx on public.facture_lignes (facture_id);

-- Une facture émise ne se modifie plus (sauf suivi : encaissement, PDF, envoi)
create or replace function public.proteger_facture()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    if old.statut <> 'brouillon' then
      raise exception 'Une facture émise ne peut pas être supprimée : établissez un avoir.';
    end if;
    return old;
  end if;
  if old.statut <> 'brouillon' and (
       new.numero is distinct from old.numero
    or new.type is distinct from old.type
    or new.client_id is distinct from old.client_id
    or new.objet is distinct from old.objet
    or new.date_emission is distinct from old.date_emission
    or new.date_echeance is distinct from old.date_echeance
    or new.total_ht is distinct from old.total_ht
    or new.total_tva is distinct from old.total_tva
    or new.total_ttc is distinct from old.total_ttc
    or new.emetteur is distinct from old.emetteur
    or new.client is distinct from old.client
    or new.facture_origine_id is distinct from old.facture_origine_id
  ) then
    raise exception 'Une facture émise ne peut plus être modifiée : établissez un avoir.';
  end if;
  return new;
end;
$$;
create trigger factures_protection before update or delete on public.factures
  for each row execute function public.proteger_facture();

create or replace function public.proteger_lignes_facture()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_statut text;
begin
  select statut into v_statut from public.factures
   where id = coalesce(new.facture_id, old.facture_id);
  if v_statut is not null and v_statut <> 'brouillon' then
    raise exception 'Les lignes d''une facture émise ne peuvent plus être modifiées.';
  end if;
  return coalesce(new, old);
end;
$$;
create trigger facture_lignes_protection before insert or update or delete on public.facture_lignes
  for each row execute function public.proteger_lignes_facture();

-- Totaux recalculés à chaque changement de ligne
create or replace function public.recalculer_totaux()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_id uuid;
begin
  if tg_table_name = 'facture_lignes' then
    v_id := coalesce(new.facture_id, old.facture_id);
    update public.factures f set
      total_ht = coalesce(s.ht, 0),
      total_tva = coalesce(s.tva, 0),
      total_ttc = coalesce(s.ht, 0) + coalesce(s.tva, 0)
    from (select sum(total_ht) ht, sum(round(total_ht * taux_tva / 100, 2)) tva
            from public.facture_lignes where facture_id = v_id) s
    where f.id = v_id and f.statut = 'brouillon';
  else
    v_id := coalesce(new.devis_id, old.devis_id);
    update public.devis d set
      total_ht = coalesce(s.ht, 0),
      total_tva = coalesce(s.tva, 0),
      total_ttc = coalesce(s.ht, 0) + coalesce(s.tva, 0)
    from (select sum(total_ht) ht, sum(round(total_ht * taux_tva / 100, 2)) tva
            from public.devis_lignes where devis_id = v_id) s
    where d.id = v_id;
  end if;
  return null;
end;
$$;
create trigger facture_lignes_totaux after insert or update or delete on public.facture_lignes
  for each row execute function public.recalculer_totaux();
create trigger devis_lignes_totaux after insert or update or delete on public.devis_lignes
  for each row execute function public.recalculer_totaux();

-- ---------------------------------------------------------------------------
-- Encaissements (base du calcul URSSAF : chiffre d'affaires encaissé)
-- ---------------------------------------------------------------------------
create table public.encaissements (
  id uuid primary key default gen_random_uuid(),
  facture_id uuid not null references public.factures (id),
  date_encaissement date not null,
  montant numeric(12,2) not null,
  mode text not null default 'virement'
    check (mode in ('virement', 'cheque', 'especes', 'carte', 'paypal', 'autre')),
  notes text,
  cree_le timestamptz not null default now()
);
create index encaissements_date_idx on public.encaissements (date_encaissement);
create index encaissements_facture_idx on public.encaissements (facture_id);

create or replace function public.maj_encaisse()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_id uuid := coalesce(new.facture_id, old.facture_id);
  v_total numeric;
  v_encaisse numeric;
  v_statut text;
begin
  select total_ttc, statut into v_total, v_statut from public.factures where id = v_id;
  select coalesce(sum(montant), 0) into v_encaisse from public.encaissements where facture_id = v_id;
  update public.factures set
    montant_encaisse = v_encaisse,
    statut = case
      when v_statut in ('brouillon', 'annulee') then v_statut
      when abs(v_encaisse) >= abs(v_total) and v_total <> 0 then 'payee'
      else 'emise'
    end
  where id = v_id;
  return null;
end;
$$;
create trigger encaissements_maj after insert or update or delete on public.encaissements
  for each row execute function public.maj_encaisse();

-- ---------------------------------------------------------------------------
-- Émission d'une facture (ou d'un avoir) : numéro, figeage des informations
-- ---------------------------------------------------------------------------
create or replace function public.emettre_facture(p_id uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  f public.factures%rowtype;
  v_date date;
  v_numero text;
  v_delai int;
begin
  if not public.est_admin() then
    raise exception 'Accès refusé';
  end if;
  select * into f from public.factures where id = p_id for update;
  if not found then raise exception 'Facture introuvable'; end if;
  if f.statut <> 'brouillon' then raise exception 'Cette facture est déjà émise.'; end if;
  if not exists (select 1 from public.facture_lignes where facture_id = p_id) then
    raise exception 'Ajoutez au moins une ligne avant d''émettre.';
  end if;
  v_date := coalesce(f.date_emission, current_date);
  select delai_paiement_jours into v_delai from public.parametres where id = 1;
  v_numero := public.prochain_numero(f.type, v_date);
  update public.factures set
    numero = v_numero,
    date_emission = v_date,
    date_echeance = coalesce(f.date_echeance, v_date + v_delai),
    statut = 'emise',
    emise_le = now(),
    emetteur = (select to_jsonb(p) - 'id' - 'modifie_le' from public.parametres p where p.id = 1),
    client = (select to_jsonb(c) - 'notes' - 'archive' - 'cree_le' - 'modifie_le' from public.clients c where c.id = f.client_id)
  where id = p_id;
  return v_numero;
end;
$$;

create or replace function public.emettre_devis(p_id uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  d public.devis%rowtype;
  v_date date;
  v_numero text;
  v_validite int;
begin
  if not public.est_admin() then
    raise exception 'Accès refusé';
  end if;
  select * into d from public.devis where id = p_id for update;
  if not found then raise exception 'Devis introuvable'; end if;
  if d.numero is not null then return d.numero; end if;
  if not exists (select 1 from public.devis_lignes where devis_id = p_id) then
    raise exception 'Ajoutez au moins une ligne avant d''émettre.';
  end if;
  v_date := coalesce(d.date_emission, current_date);
  select validite_devis_jours into v_validite from public.parametres where id = 1;
  v_numero := public.prochain_numero('devis', v_date);
  update public.devis set
    numero = v_numero,
    date_emission = v_date,
    date_validite = coalesce(d.date_validite, v_date + v_validite),
    statut = 'envoye',
    emetteur = (select to_jsonb(p) - 'id' - 'modifie_le' from public.parametres p where p.id = 1),
    client = (select to_jsonb(c) - 'notes' - 'archive' - 'cree_le' - 'modifie_le' from public.clients c where c.id = d.client_id)
  where id = p_id;
  return v_numero;
end;
$$;

-- ---------------------------------------------------------------------------
-- URSSAF : CA encaissé hors outil (reprise 2026) et suivi des déclarations
-- ---------------------------------------------------------------------------
create table public.ca_hors_outil (
  mois date primary key check (extract(day from mois) = 1),
  montant numeric(12,2) not null,
  note text
);

create table public.declarations_urssaf (
  mois date primary key check (extract(day from mois) = 1),
  ca_declare numeric(12,2) not null,
  montant_paye numeric(12,2),
  declare_le timestamptz,
  note text
);

-- ---------------------------------------------------------------------------
-- Site public : messages du formulaire de contact et articles du blog
-- ---------------------------------------------------------------------------
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  email text not null,
  objet text not null default '',
  message text not null,
  lu boolean not null default false,
  cree_le timestamptz not null default now()
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  titre text not null,
  extrait text not null default '',
  contenu text not null default '',
  categorie text not null default 'IA',
  image_url text,
  publie boolean not null default false,
  publie_le timestamptz,
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now()
);
create trigger articles_horodatage before update on public.articles
  for each row execute function public.maj_horodatage();

-- ---------------------------------------------------------------------------
-- Sécurité : tout est réservé à l'administrateur, sauf les articles publiés
-- ---------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array['parametres', 'taux_urssaf', 'clients', 'compteurs', 'devis', 'devis_lignes',
                           'factures', 'facture_lignes', 'encaissements', 'ca_hors_outil',
                           'declarations_urssaf', 'messages', 'articles']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy admin_tout on public.%I for all to authenticated using ((select public.est_admin())) with check ((select public.est_admin()))', t);
  end loop;
end;
$$;

create policy articles_publies on public.articles
  for select to anon, authenticated using (publie = true);

revoke execute on function public.prochain_numero(text, date) from public, anon;
revoke execute on function public.emettre_facture(uuid) from public, anon;
revoke execute on function public.emettre_devis(uuid) from public, anon;
grant execute on function public.prochain_numero(text, date) to authenticated;
grant execute on function public.emettre_facture(uuid) to authenticated;
grant execute on function public.emettre_devis(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Stockage : PDF des devis/factures (privé) et images du blog (public)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public) values ('documents', 'documents', false)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('medias', 'medias', true)
  on conflict (id) do nothing;

create policy documents_admin on storage.objects for all to authenticated
  using (bucket_id = 'documents' and (select public.est_admin()))
  with check (bucket_id = 'documents' and (select public.est_admin()));
create policy medias_admin on storage.objects for all to authenticated
  using (bucket_id = 'medias' and (select public.est_admin()))
  with check (bucket_id = 'medias' and (select public.est_admin()));

-- ---------------------------------------------------------------------------
-- Reprise 2026 : CA déjà déclaré à l'URSSAF avant l'outil (janvier-septembre)
-- ---------------------------------------------------------------------------
insert into public.ca_hors_outil (mois, montant, note) values
  ('2026-01-01', 120, 'Reprise historique URSSAF'),
  ('2026-02-01', 500, 'Reprise historique URSSAF'),
  ('2026-03-01', 160, 'Reprise historique URSSAF'),
  ('2026-04-01', 600, 'Reprise historique URSSAF'),
  ('2026-05-01', 200, 'Reprise historique URSSAF'),
  ('2026-06-01', 400, 'Reprise historique URSSAF'),
  ('2026-07-01', 460, 'Reprise historique URSSAF'),
  ('2026-08-01', 600, 'Reprise historique URSSAF'),
  ('2026-09-01', 700, 'Reprise historique URSSAF');

insert into public.declarations_urssaf (mois, ca_declare, montant_paye, declare_le, note) values
  ('2026-01-01', 120, 16, '2026-02-28', 'Calculé au taux « ventes » : à vérifier avec l''URSSAF'),
  ('2026-02-01', 500, 116, '2026-03-31', null),
  ('2026-03-01', 160, 22, '2026-04-30', 'Calculé au taux « ventes » : à vérifier avec l''URSSAF'),
  ('2026-04-01', 600, 81, '2026-05-31', 'Calculé au taux « ventes » : à vérifier avec l''URSSAF'),
  ('2026-05-01', 200, 45, '2026-06-30', null),
  ('2026-06-01', 400, 92, '2026-07-31', null),
  ('2026-07-01', 460, 106, '2026-08-31', null),
  ('2026-08-01', 600, 138, '2026-09-30', null),
  ('2026-09-01', 700, 161, '2026-10-31', null);
