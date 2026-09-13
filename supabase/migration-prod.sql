-- =====================================================================
-- AUREX — migration prod idempotente (a executer UNE fois dans
-- Supabase > SQL Editor, puis re-executer apres chaque ajout de
-- collection ou de colonne site_settings).
-- Verifie chaque etape avec les SELECT de controle en fin de fichier.
-- =====================================================================

-- 1) Colonnes site_settings (logo, couleurs, contacts, reseaux)
alter table public.site_settings add column if not exists logo_url text;
alter table public.site_settings add column if not exists favicon_url text;
alter table public.site_settings add column if not exists primary_color text not null default '#0A2463';
alter table public.site_settings add column if not exists accent_color text not null default '#1E5EF3';
alter table public.site_settings add column if not exists surface_color text not null default '#F9FAFB';
alter table public.site_settings add column if not exists contact_email text;
alter table public.site_settings add column if not exists contact_phone text;
alter table public.site_settings add column if not exists contact_address text;
alter table public.site_settings add column if not exists social_links jsonb not null default '{}'::jsonb;
alter table public.site_settings add column if not exists languages jsonb not null default '["fr","ar","en"]'::jsonb;
alter table public.site_settings add column if not exists maintenance_mode boolean not null default false;
alter table public.site_settings add column if not exists logo_text text not null default 'aurex';
alter table public.site_settings add column if not exists logo_text_color text not null default '#168BC3';
alter table public.site_settings add column if not exists logo_icon_bg text not null default 'var(--color-primary)';
alter table public.site_settings add column if not exists logo_accent text not null default 'var(--color-accent)';
alter table public.site_settings add column if not exists logo_icon_url text;
alter table public.site_settings add column if not exists show_logo_icon boolean not null default true;
alter table public.site_settings add column if not exists show_logo_image boolean not null default true;
alter table public.site_settings add column if not exists show_logo_text boolean not null default false;

-- 2) Suppression definitive de la colonne prix (decision : aucun prix affiche)
alter table public.products drop column if exists price;

-- 3) Check aurex_collections : les 17 cles gerees par /admin
alter table public.aurex_collections drop constraint if exists aurex_collections_collection_key_check;
alter table public.aurex_collections add constraint aurex_collections_collection_key_check
  check (collection_key in ('products','categories','technologies','news','faq','distributors','heroSlides','stats','marquee','campaign','homeSections','smartPage','techPage','newsPage','aboutPage','supportPage'));

-- 4) Trigger : profil editor auto a chaque inscription
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

-- =====================================================================
-- CONTROLES (doivent retourner 0 ligne manquante + le check complet)
-- =====================================================================
select column_name from information_schema.columns
where table_schema = 'public' and table_name = 'site_settings'
  and column_name in ('logo_icon_url','logo_text','show_logo_text')
order by 1;

select conname, pg_get_constraintdef(oid) from pg_constraint
where conrelid = 'public.aurex_collections'::regclass and conname like '%collection_key%';

select column_name from information_schema.columns
where table_schema = 'public' and table_name = 'products' and column_name = 'price';

select trigger_name from information_schema.triggers
where trigger_name = 'on_auth_user_created';
