-- Langue de la page Contact d'où vient chaque message (appliquée le 28/11/2026)
alter table public.messages
  add column if not exists langue text not null default 'fr'
  check (langue in ('fr', 'en', 'es'));
comment on column public.messages.langue is 'Langue de la page Contact d''où vient le message (fr, en, es)';
