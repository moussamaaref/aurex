-- AUREX Supabase database
-- Run this complete file once in Supabase SQL Editor.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'editor' check (role in ('admin', 'editor', 'viewer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  slug text primary key,
  label text not null,
  description text not null default '',
  image text not null default '',
  sort_order integer not null default 0,
  subcategories jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  name text not null,
  reference text not null unique,
  category_slug text not null references public.categories(slug) on update cascade,
  subcategory text,
  image text not null default '',
  images jsonb not null default '[]'::jsonb,
  badges jsonb not null default '[]'::jsonb,
  capacity text,
  energy_class text not null default '',
  connectivity boolean not null default false,
  technologies jsonb not null default '[]'::jsonb,
  noise_level text,
  dimensions jsonb,
  description text not null default '',
  features jsonb not null default '[]'::jsonb,
  color text,
  is_new boolean not null default false,
  stock integer not null default 0 check (stock >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.technologies (
  id text primary key,
  name text not null,
  icon text not null default '',
  image text not null default '',
  benefit text not null default '',
  description text not null default '',
  category text not null default '',
  compatible_categories jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.news (
  id text primary key,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  published_at date,
  category text not null default '',
  image text not null default '',
  slug text not null unique,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.faq (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.distributors (
  id text primary key,
  name text not null,
  address text not null default '',
  wilaya text not null default '',
  commune text not null default '',
  phone text not null default '',
  email text,
  latitude numeric(9,6) not null,
  longitude numeric(9,6) not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pages (
  slug text primary key,
  title text not null default '',
  description text not null default '',
  content jsonb not null default '{}'::jsonb,
  seo_title text,
  seo_description text,
  seo_keywords text,
  is_published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id text primary key default 'global',
  logo_url text,
  favicon_url text,
  primary_color text not null default '#0A2463',
  accent_color text not null default '#1E5EF3',
  surface_color text not null default '#F9FAFB',
  contact_email text,
  contact_phone text,
  contact_address text,
  social_links jsonb not null default '{}'::jsonb,
  languages jsonb not null default '["fr","ar","en"]'::jsonb,
  maintenance_mode boolean not null default false,
  logo_text text not null default 'aurex',
  logo_text_color text not null default '#168BC3',
  logo_icon_bg text not null default 'var(--color-primary)',
  logo_accent text not null default 'var(--color-accent)',
  logo_icon_url text,
  show_logo_icon boolean not null default true,
  show_logo_image boolean not null default true,
  show_logo_text boolean not null default false,
  updated_at timestamptz not null default now()
);

-- Backward-compatible JSON collections used by the current CMS.
create table if not exists public.aurex_collections (
  collection_key text primary key check (collection_key in ('products', 'categories', 'technologies', 'news', 'faq', 'distributors', 'heroSlides', 'stats', 'marquee', 'campaign', 'homeSections', 'smartPage', 'techPage', 'newsPage', 'aboutPage', 'supportPage')),
  items jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.aurex_settings (
  id text primary key default 'global',
  pages jsonb not null default '{}'::jsonb,
  theme jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity text not null,
  entity_id text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products(category_slug);
create index if not exists products_active_idx on public.products(is_active);
create index if not exists news_published_idx on public.news(is_published, published_at desc);
create index if not exists distributors_location_idx on public.distributors(wilaya, commune);
create index if not exists audit_logs_created_idx on public.audit_logs(created_at desc);

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists categories_updated_at on public.categories;
create trigger categories_updated_at before update on public.categories for each row execute function public.set_updated_at();
drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products for each row execute function public.set_updated_at();
drop trigger if exists technologies_updated_at on public.technologies;
create trigger technologies_updated_at before update on public.technologies for each row execute function public.set_updated_at();
drop trigger if exists news_updated_at on public.news;
create trigger news_updated_at before update on public.news for each row execute function public.set_updated_at();
drop trigger if exists faq_updated_at on public.faq;
create trigger faq_updated_at before update on public.faq for each row execute function public.set_updated_at();
drop trigger if exists distributors_updated_at on public.distributors;
create trigger distributors_updated_at before update on public.distributors for each row execute function public.set_updated_at();
drop trigger if exists pages_updated_at on public.pages;
create trigger pages_updated_at before update on public.pages for each row execute function public.set_updated_at();
drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at before update on public.site_settings for each row execute function public.set_updated_at();
drop trigger if exists aurex_collections_updated_at on public.aurex_collections;
create trigger aurex_collections_updated_at before update on public.aurex_collections for each row execute function public.set_updated_at();
drop trigger if exists aurex_settings_updated_at on public.aurex_settings;
create trigger aurex_settings_updated_at before update on public.aurex_settings for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  );
$$;

-- Crée automatiquement une ligne profiles (role editor) à chaque inscription.
-- L'admin ajuste ensuite le rôle vers admin si nécessaire.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), 'editor')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.technologies enable row level security;
alter table public.news enable row level security;
alter table public.faq enable row level security;
alter table public.distributors enable row level security;
alter table public.pages enable row level security;
alter table public.site_settings enable row level security;
alter table public.aurex_collections enable row level security;
alter table public.aurex_settings enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists profiles_self_read on public.profiles;
create policy profiles_self_read on public.profiles for select using (id = auth.uid() or public.is_admin());
drop policy if exists profiles_admin_write on public.profiles;
create policy profiles_admin_write on public.profiles for all using (public.is_admin()) with check (public.is_admin());

-- Public site reads only published/active records.
drop policy if exists categories_public_read on public.categories;
create policy categories_public_read on public.categories for select using (is_active = true or public.is_admin());
drop policy if exists products_public_read on public.products;
create policy products_public_read on public.products for select using (is_active = true or public.is_admin());
drop policy if exists technologies_public_read on public.technologies;
create policy technologies_public_read on public.technologies for select using (is_active = true or public.is_admin());
drop policy if exists news_public_read on public.news;
create policy news_public_read on public.news for select using (is_published = true or public.is_admin());
drop policy if exists faq_public_read on public.faq;
create policy faq_public_read on public.faq for select using (is_active = true or public.is_admin());
drop policy if exists distributors_public_read on public.distributors;
create policy distributors_public_read on public.distributors for select using (is_active = true or public.is_admin());
drop policy if exists pages_public_read on public.pages;
create policy pages_public_read on public.pages for select using (is_published = true or public.is_admin());
drop policy if exists settings_public_read on public.site_settings;
create policy settings_public_read on public.site_settings for select using (true);
drop policy if exists collections_public_read on public.aurex_collections;
create policy collections_public_read on public.aurex_collections for select using (true);
drop policy if exists settings_json_public_read on public.aurex_settings;
create policy settings_json_public_read on public.aurex_settings for select using (true);

-- Only authenticated admin/editor accounts can mutate content.
drop policy if exists categories_admin_write on public.categories;
create policy categories_admin_write on public.categories for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists products_admin_write on public.products;
create policy products_admin_write on public.products for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists technologies_admin_write on public.technologies;
create policy technologies_admin_write on public.technologies for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists news_admin_write on public.news;
create policy news_admin_write on public.news for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists faq_admin_write on public.faq;
create policy faq_admin_write on public.faq for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists distributors_admin_write on public.distributors;
create policy distributors_admin_write on public.distributors for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists pages_admin_write on public.pages;
create policy pages_admin_write on public.pages for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists settings_admin_write on public.site_settings;
create policy settings_admin_write on public.site_settings for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists collections_admin_write on public.aurex_collections;
create policy collections_admin_write on public.aurex_collections for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists settings_json_admin_write on public.aurex_settings;
create policy settings_json_admin_write on public.aurex_settings for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists audit_admin_read on public.audit_logs;
create policy audit_admin_read on public.audit_logs for select using (public.is_admin());
drop policy if exists audit_admin_insert on public.audit_logs;
create policy audit_admin_insert on public.audit_logs for insert with check (public.is_admin());

insert into public.site_settings (id)
values ('global')
on conflict (id) do nothing;

insert into public.aurex_settings (id)
values ('global')
on conflict (id) do nothing;

-- Create this bucket in Storage for product/category/news images.
insert into storage.buckets (id, name, public)
values ('aurex-media', 'aurex-media', true)
on conflict (id) do update set public = true;

drop policy if exists aurex_media_public_read on storage.objects;
create policy aurex_media_public_read on storage.objects for select
using (bucket_id = 'aurex-media');

drop policy if exists aurex_media_admin_insert on storage.objects;
create policy aurex_media_admin_insert on storage.objects for insert
with check (bucket_id = 'aurex-media' and public.is_admin());

drop policy if exists aurex_media_admin_update on storage.objects;
create policy aurex_media_admin_update on storage.objects for update
using (bucket_id = 'aurex-media' and public.is_admin())
with check (bucket_id = 'aurex-media' and public.is_admin());

drop policy if exists aurex_media_admin_delete on storage.objects;
create policy aurex_media_admin_delete on storage.objects for delete
using (bucket_id = 'aurex-media' and public.is_admin());
