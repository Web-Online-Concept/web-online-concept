-- Formulaire de contact enrichi : type de besoin, téléphone facultatif, origine du contact
alter table public.messages
  add column if not exists besoin text,
  add column if not exists telephone text,
  add column if not exists source text;
