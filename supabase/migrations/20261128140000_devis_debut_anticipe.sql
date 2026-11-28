-- Devis accepté en ligne par un particulier : demande expresse de démarrage avant la fin du délai de rétractation (appliquée le 28/11/2026)
alter table public.devis add column if not exists debut_anticipe boolean not null default false;
comment on column public.devis.debut_anticipe is 'Client particulier : a demandé, à l''acceptation en ligne, que les travaux commencent avant la fin du délai de rétractation de 14 jours';
