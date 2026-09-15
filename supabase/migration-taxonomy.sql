-- =====================================================================
-- AUREX — hiérarchie produit : Catégorie → Famille → Sous-famille → Gamme
-- + Capacités et Couleurs (many-to-many via tables de jonction).
--
-- MIGRATION ADDITIVE ET NON DESTRUCTIVE :
-- - aucune colonne / table existante n'est supprimée ;
-- - les anciennes colonnes (category_slug, subcategory, capacity, color)
--   sont conservées comme repli jusqu'à validation complète ;
-- - ré-exécutable sans risque (IF NOT EXISTS / ON CONFLICT DO NOTHING).
-- À exécuter dans Supabase > SQL Editor.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) Tables taxonomiques
-- ---------------------------------------------------------------------

create table if not exists public.familles (
  slug text primary key,
  category_slug text not null references public.categories(slug) on update cascade on delete restrict,
  name text not null default '',
  name_ar text not null default '',
  name_en text not null default '',
  description text not null default '',
  image text not null default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sous_familles (
  slug text primary key,
  famille_slug text not null references public.familles(slug) on update cascade on delete restrict,
  name text not null default '',
  name_ar text not null default '',
  name_en text not null default '',
  description text not null default '',
  image text not null default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gammes (
  slug text primary key,
  sous_famille_slug text not null references public.sous_familles(slug) on update cascade on delete restrict,
  name text not null default '',
  name_ar text not null default '',
  name_en text not null default '',
  description text not null default '',
  image text not null default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.capacites (
  slug text primary key,
  name text not null default '',
  name_ar text not null default '',
  name_en text not null default '',
  value text,
  unit text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.couleurs (
  slug text primary key,
  name text not null default '',
  name_ar text not null default '',
  name_en text not null default '',
  hex_code text,
  image text not null default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Jonctions many-to-many (un produit = une ou plusieurs capacités / couleurs)
create table if not exists public.product_capacites (
  product_id text not null references public.products(id) on update cascade on delete cascade,
  capacite_slug text not null references public.capacites(slug) on update cascade on delete restrict,
  sort_order integer not null default 0,
  primary key (product_id, capacite_slug)
);

create table if not exists public.product_couleurs (
  product_id text not null references public.products(id) on update cascade on delete cascade,
  couleur_slug text not null references public.couleurs(slug) on update cascade on delete restrict,
  sort_order integer not null default 0,
  primary key (product_id, couleur_slug)
);

-- ---------------------------------------------------------------------
-- 2) Nouvelles colonnes sur products (anciennes colonnes conservées)
-- ---------------------------------------------------------------------

alter table public.products add column if not exists slug text;
alter table public.products add column if not exists famille_id text references public.familles(slug) on update cascade;
alter table public.products add column if not exists sous_famille_id text references public.sous_familles(slug) on update cascade;
alter table public.products add column if not exists gamme_id text references public.gammes(slug) on update cascade;
alter table public.products add column if not exists short_description text not null default '';
alter table public.products add column if not exists is_featured boolean not null default false;

-- ---------------------------------------------------------------------
-- 3) Données de référence (mêmes slugs que le front : src/lib/taxonomy.ts)
-- ---------------------------------------------------------------------

insert into public.familles (slug, category_slug, name, sort_order) values
  ('lave-linge', 'lavage', 'Lave-linge', 1),
  ('lave-vaisselle', 'lave-vaisselle', 'Lave-vaisselle', 1),
  ('petrins', 'petit-electromenager', 'Pétrins', 1),
  ('cafetieres', 'petit-electromenager', 'Cafetières', 2),
  ('cumulus', 'chauffe-eau', 'Cumulus', 1),
  ('chauffe-bain', 'chauffe-eau', 'Chauffe-bain', 2),
  ('aspirateurs', 'entretien-maison', 'Aspirateurs', 1),
  ('purificateurs-air', 'entretien-maison', 'Purificateurs d''air', 2),
  ('fontaines-eau', 'fontaines', 'Fontaines à eau', 1),
  ('fours', 'cuisson', 'Fours', 1),
  ('hottes', 'cuisson', 'Hottes aspirantes', 2),
  ('micro-ondes', 'cuisson', 'Micro-ondes', 3),
  ('cuisinieres', 'cuisson', 'Cuisinières', 4),
  ('refrigerateurs', 'autres', 'Réfrigérateurs', 1),
  ('climatiseurs', 'autres', 'Climatiseurs', 2)
on conflict (slug) do nothing;

insert into public.sous_familles (slug, famille_slug, name, sort_order) values
  ('lave-linge-frontal', 'lave-linge', 'Lave-linge frontal', 1),
  ('lave-linge-top', 'lave-linge', 'Lave-linge top', 2),
  ('lave-vaisselle-encastrable', 'lave-vaisselle', 'Encastrable', 1),
  ('lave-vaisselle-pose-libre', 'lave-vaisselle', 'Pose libre', 2),
  ('petrins-planetaire', 'petrins', 'Planétaire', 1),
  ('cafetieres-filtre', 'cafetieres', 'Filtre', 1),
  ('cafetieres-expresso', 'cafetieres', 'Expresso', 2),
  ('cumulus-electrique', 'cumulus', 'Électrique', 1),
  ('chauffe-bain-gaz', 'chauffe-bain', 'Gaz', 1),
  ('aspirateurs-sac', 'aspirateurs', 'Avec sac', 1),
  ('aspirateurs-sans-sac', 'aspirateurs', 'Sans sac', 2),
  ('aspirateurs-sans-fil', 'aspirateurs', 'Sans fil', 3),
  ('purificateurs-hepa', 'purificateurs-air', 'HEPA', 1),
  ('fontaines-domestiques', 'fontaines-eau', 'Domestiques', 1),
  ('fours-encastrables', 'fours', 'Encastrables', 1),
  ('fours-pose', 'fours', 'À poser', 2),
  ('hottes-decoratives', 'hottes', 'Décoratives', 1),
  ('micro-ondes-pose', 'micro-ondes', 'À poser', 1),
  ('cuisinieres-gaz', 'cuisinieres', 'Gaz', 1),
  ('cuisinieres-electriques', 'cuisinieres', 'Électriques', 2),
  ('cuisinieres-mixtes', 'cuisinieres', 'Mixtes', 3),
  ('refrigerateurs-combines', 'refrigerateurs', 'Combinés', 1),
  ('refrigerateurs-americains', 'refrigerateurs', 'Américains', 2),
  ('climatiseurs-split', 'climatiseurs', 'Split', 1),
  ('climatiseurs-mobiles', 'climatiseurs', 'Mobiles', 2)
on conflict (slug) do nothing;

insert into public.gammes (slug, sous_famille_slug, name, sort_order) values
  ('spinova', 'lave-linge-frontal', 'Spinova', 1),
  ('spinova-plus', 'lave-linge-frontal', 'Spinova+', 2),
  ('lavexa', 'lave-linge-frontal', 'Lavexa', 3),
  ('lavexa-plus', 'lave-linge-frontal', 'Lavexa+', 4),
  ('estrela', 'lave-vaisselle-encastrable', 'Estrela', 1),
  ('estrela-s', 'lave-vaisselle-encastrable', 'Estrela S', 2),
  ('gustiva', 'petrins-planetaire', 'Gustiva', 1),
  ('florenza', 'cafetieres-expresso', 'Florenza', 1),
  ('t-vox', 'aspirateurs-sans-sac', 'T-Vox', 1),
  ('eronex', 'aspirateurs-sans-fil', 'Eronex', 1),
  ('dustor', 'aspirateurs-sac', 'Dustor', 1),
  ('liva', 'aspirateurs-sans-sac', 'Liva', 2),
  ('excellence', 'fours-encastrables', 'Excellence', 1),
  ('freshcool', 'refrigerateurs-combines', 'FreshCool', 1),
  ('inverter-plus', 'climatiseurs-split', 'Inverter+', 1),
  ('pure-air', 'purificateurs-hepa', 'Pure Air', 1)
on conflict (slug) do nothing;

insert into public.capacites (slug, name, value, unit, sort_order) values
  ('7-kg', '7 KG', '7', 'KG', 1),
  ('8-kg', '8 KG', '8', 'KG', 2),
  ('9-kg', '9 KG', '9', 'KG', 3),
  ('10-5-kg', '10.5 KG', '10.5', 'KG', 4),
  ('12-kg', '12 KG', '12', 'KG', 5),
  ('30-l', '30 L', '30', 'L', 6),
  ('50-l', '50 L', '50', 'L', 7),
  ('85-l', '85 L', '85', 'L', 8),
  ('70-l', '70 L', '70', 'L', 9),
  ('350-l', '350 L', '350', 'L', 10),
  ('14-couverts', '14 couverts', '14', 'couverts', 11),
  ('24000-btu', '24 000 BTU', '24000', 'BTU', 12),
  ('65-m2', '65 m²', '65', 'm²', 13)
on conflict (slug) do nothing;

insert into public.couleurs (slug, name, hex_code, sort_order) values
  ('blanc', 'Blanc', '#FFFFFF', 1),
  ('noir', 'Noir', '#111111', 2),
  ('silver', 'Silver', '#C0C0C0', 3),
  ('inox', 'Inox', '#B8BCC0', 4),
  ('inox-noir', 'Inox/Noir', '#3A3F44', 5),
  ('gris', 'Gris', '#6B7280', 6)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------
-- 4) Migration des produits existants (explicite + générique)
-- ---------------------------------------------------------------------

-- 4a) Correspondances explicites des produits historiques
update public.products set
  famille_id = m.famille_id,
  sous_famille_id = m.sous_famille_id,
  gamme_id = m.gamme_id
from (values
  ('ex9000-wm', 'lave-linge', 'lave-linge-frontal', 'spinova-plus'),
  ('ex5000-wm', 'lave-linge', 'lave-linge-frontal', 'lavexa'),
  ('ex8000-oven', 'fours', 'fours-encastrables', 'excellence'),
  ('ex5500-dw', 'lave-vaisselle', 'lave-vaisselle-encastrable', 'estrela'),
  ('ex6000-ac', 'climatiseurs', 'climatiseurs-split', 'inverter-plus'),
  ('ex7000-fridge', 'refrigerateurs', 'refrigerateurs-combines', 'freshcool'),
  ('ex4000-purifier', 'purificateurs-air', 'purificateurs-hepa', 'pure-air')
) as m(id, famille_id, sous_famille_id, gamme_id)
where public.products.id = m.id;

-- 4b) Règle générique : sous-catégorie textuelle → gamme de même nom
update public.products p set
  gamme_id = g.slug,
  sous_famille_id = g.sous_famille_slug,
  famille_id = sf.famille_slug
from public.gammes g
join public.sous_familles sf on sf.slug = g.sous_famille_slug
where p.gamme_id is null
  and p.subcategory is not null
  and lower(trim(p.subcategory)) = lower(g.name);

-- 4c) Slug produit : id comme valeur par défaut (le BO génère de vrais slugs)
update public.products set slug = id where slug is null or slug = '';

-- 4d) Jonctions capacités : correspondance sur le texte legacy (insensible casse/espaces)
insert into public.product_capacites (product_id, capacite_slug)
select distinct p.id, c.slug
from public.products p
join public.capacites c
  on lower(regexp_replace(trim(p.capacity), '\s+', ' ', 'g')) = lower(c.name)
where p.capacity is not null and trim(p.capacity) <> ''
on conflict do nothing;

-- 4e) Jonctions couleurs : correspondance sur le texte legacy
insert into public.product_couleurs (product_id, couleur_slug)
select distinct p.id, c.slug
from public.products p
join public.couleurs c
  on lower(trim(p.color)) = lower(c.name)
where p.color is not null and trim(p.color) <> ''
on conflict do nothing;

-- ---------------------------------------------------------------------
-- 5) Index
-- ---------------------------------------------------------------------

create index if not exists familles_category_idx on public.familles(category_slug);
create index if not exists sous_familles_famille_idx on public.sous_familles(famille_slug);
create index if not exists gammes_sous_famille_idx on public.gammes(sous_famille_slug);
create index if not exists products_famille_idx on public.products(famille_id);
create index if not exists products_sous_famille_idx on public.products(sous_famille_id);
create index if not exists products_gamme_idx on public.products(gamme_id);
create index if not exists products_slug_idx on public.products(slug);

-- ---------------------------------------------------------------------
-- 6) Triggers updated_at
-- ---------------------------------------------------------------------

drop trigger if exists familles_updated_at on public.familles;
create trigger familles_updated_at before update on public.familles for each row execute function public.set_updated_at();
drop trigger if exists sous_familles_updated_at on public.sous_familles;
create trigger sous_familles_updated_at before update on public.sous_familles for each row execute function public.set_updated_at();
drop trigger if exists gammes_updated_at on public.gammes;
create trigger gammes_updated_at before update on public.gammes for each row execute function public.set_updated_at();
drop trigger if exists capacites_updated_at on public.capacites;
create trigger capacites_updated_at before update on public.capacites for each row execute function public.set_updated_at();
drop trigger if exists couleurs_updated_at on public.couleurs;
create trigger couleurs_updated_at before update on public.couleurs for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 7) RLS + policies (même modèle que le reste du catalogue)
-- ---------------------------------------------------------------------

alter table public.familles enable row level security;
alter table public.sous_familles enable row level security;
alter table public.gammes enable row level security;
alter table public.capacites enable row level security;
alter table public.couleurs enable row level security;
alter table public.product_capacites enable row level security;
alter table public.product_couleurs enable row level security;

drop policy if exists familles_public_read on public.familles;
create policy familles_public_read on public.familles for select using (is_active = true or public.is_admin());
drop policy if exists familles_admin_write on public.familles;
create policy familles_admin_write on public.familles for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists sous_familles_public_read on public.sous_familles;
create policy sous_familles_public_read on public.sous_familles for select using (is_active = true or public.is_admin());
drop policy if exists sous_familles_admin_write on public.sous_familles;
create policy sous_familles_admin_write on public.sous_familles for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists gammes_public_read on public.gammes;
create policy gammes_public_read on public.gammes for select using (is_active = true or public.is_admin());
drop policy if exists gammes_admin_write on public.gammes;
create policy gammes_admin_write on public.gammes for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists capacites_public_read on public.capacites;
create policy capacites_public_read on public.capacites for select using (is_active = true or public.is_admin());
drop policy if exists capacites_admin_write on public.capacites;
create policy capacites_admin_write on public.capacites for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists couleurs_public_read on public.couleurs;
create policy couleurs_public_read on public.couleurs for select using (is_active = true or public.is_admin());
drop policy if exists couleurs_admin_write on public.couleurs;
create policy couleurs_admin_write on public.couleurs for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists product_capacites_public_read on public.product_capacites;
create policy product_capacites_public_read on public.product_capacites for select using (true);
drop policy if exists product_capacites_admin_write on public.product_capacites;
create policy product_capacites_admin_write on public.product_capacites for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists product_couleurs_public_read on public.product_couleurs;
create policy product_couleurs_public_read on public.product_couleurs for select using (true);
drop policy if exists product_couleurs_admin_write on public.product_couleurs;
create policy product_couleurs_admin_write on public.product_couleurs for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- 8) Collections CMS : autoriser les nouvelles clés taxonomiques
-- ---------------------------------------------------------------------

alter table public.aurex_collections drop constraint if exists aurex_collections_collection_key_check;
alter table public.aurex_collections add constraint aurex_collections_collection_key_check
  check (collection_key in ('products','categories','technologies','news','faq','distributors','heroSlides','stats','marquee','campaign','homeSections','smartPage','techPage','newsPage','aboutPage','supportPage','familles','sousFamilles','gammes','capacites','couleurs'));

-- =====================================================================
-- CONTRÔLES
-- =====================================================================
-- Aucun produit perdu :
--   select count(*) from public.products;
-- Relations renseignées :
--   select id, category_slug, famille_id, sous_famille_id, gamme_id from public.products;
-- Jonctions :
--   select count(*) from public.product_capacites;
--   select count(*) from public.product_couleurs;
-- Produits sans taxonomie (à traiter dans le BO) :
--   select id, name from public.products where famille_id is null;
