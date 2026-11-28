-- Archives des messages du back-office (appliquée le 28/11/2026 avec l'accord de Florent)
alter table public.messages
  add column if not exists archive boolean not null default false;
comment on column public.messages.archive is 'Message rangé dans les archives du back-office';
