-- Website brief 2026 : newsletter + demandes de support (formulaire « Request Support »).
-- Insertion publique (anon) autorisée, lecture réservée aux utilisateurs authentifiés (back-office).

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  lang text default 'fr',
  created_at timestamptz not null default now()
);

create table if not exists public.support_requests (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  full_name text not null,
  phone text not null,
  wilaya text,
  commune text,
  device_class text,
  device_reference text,
  request_type text not null check (request_type in ('maintenance','warranty','spare-parts','inquiry')),
  message text,
  attachment_name text,
  attachment_url text,
  lang text default 'fr',
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;
alter table public.support_requests enable row level security;

drop policy if exists "newsletter insert public" on public.newsletter_subscribers;
create policy "newsletter insert public" on public.newsletter_subscribers for insert to anon, authenticated with check (true);
drop policy if exists "newsletter read auth" on public.newsletter_subscribers;
create policy "newsletter read auth" on public.newsletter_subscribers for select to authenticated using (true);

drop policy if exists "support insert public" on public.support_requests;
create policy "support insert public" on public.support_requests for insert to anon, authenticated with check (true);
drop policy if exists "support read auth" on public.support_requests;
create policy "support read auth" on public.support_requests for select to authenticated using (true);

-- Bucket privé pour les pièces jointes (photo / vidéo / étiquette de référence).
insert into storage.buckets (id, name, public) values ('support-uploads', 'support-uploads', false)
  on conflict (id) do nothing;
drop policy if exists "support uploads insert" on storage.objects;
create policy "support uploads insert" on storage.objects for insert to anon, authenticated with check (bucket_id = 'support-uploads');

-- Le back-office (utilisateurs authentifiés) peut faire évoluer le statut d'une demande.
drop policy if exists "support update auth" on public.support_requests;
create policy "support update auth" on public.support_requests for update to authenticated using (true) with check (true);
