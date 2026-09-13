-- Colonnes site_settings manquantes en prod (erreur 400 sur upsert)
-- A executer dans Supabase > SQL Editor
alter table public.site_settings add column if not exists logo_icon_url text;
alter table public.site_settings add column if not exists logo_text text not null default 'aurex';
alter table public.site_settings add column if not exists logo_text_color text not null default '#168BC3';
alter table public.site_settings add column if not exists logo_icon_bg text not null default 'var(--color-primary)';
alter table public.site_settings add column if not exists logo_accent text not null default 'var(--color-accent)';
alter table public.site_settings add column if not exists show_logo_icon boolean not null default true;
alter table public.site_settings add column if not exists show_logo_image boolean not null default true;
alter table public.site_settings add column if not exists show_logo_text boolean not null default false;

-- Elargir le check aurex_collections aux nouvelles collections
alter table public.site_settings add column if not exists favicon_url text;
alter table public.aurex_collections drop constraint if exists aurex_collections_collection_key_check;
alter table public.aurex_collections add constraint aurex_collections_collection_key_check
  check (collection_key in ('products','categories','technologies','news','faq','distributors','heroSlides','stats','marquee','campaign','homeSections'));

-- Verification
select column_name from information_schema.columns
where table_schema = 'public' and table_name = 'site_settings' order by 1;
select conname, pg_get_constraintdef(oid) from pg_constraint
where conrelid = 'public.aurex_collections'::regclass and conname like '%collection_key%';
