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
-- 9) Catalogue REX (import 2026 — idempotent)
-- Famille / sous-famille / gamme / capacité / couleur explicites.
-- La référence '802' existe en deux variantes : la seconde est stockée
-- '802-2' en id/slug (référence commerciale conservée '802').
-- =====================================================================

insert into public.sous_familles (slug, famille_slug, name, sort_order) values
  ('cuisinieres-4-feux', 'cuisinieres', '4 Feux', 4),
  ('hottes-casquette', 'hottes', 'Casquette', 2),
  ('hottes-pyramid', 'hottes', 'Pyramide', 3),
  ('micro-ondes-libre', 'micro-ondes', 'Pose libre', 2),
  ('cafetieres-multi', 'cafetieres', 'Multi', 3),
  ('petrins-mono', 'petrins', 'Mono', 2),
  ('petrins-multi', 'petrins', 'Multi', 3),
  ('aspirateurs-professionnels', 'aspirateurs', 'Professionnels', 4),
  ('aspirateurs-poussiere', 'aspirateurs', 'Poussière', 5),
  ('aspirateurs-bali', 'aspirateurs', 'Bali', 6),
  ('fontaines-mecanique', 'fontaines-eau', 'Mécanique', 2),
  ('fontaines-digital', 'fontaines-eau', 'Digitale', 3)
on conflict (slug) do nothing;

insert into public.gammes (slug, sous_famille_slug, name, sort_order) values
  ('big', 'fours-pose', 'Big', 1),
  ('gaz-gaz', 'fours-encastrables', 'Gaz-Gaz', 2),
  ('elec-gaz-four', 'fours-encastrables', 'Elec-Gaz', 3),
  ('elec-elec', 'fours-encastrables', 'Elec-Elec', 4),
  ('elec-gaz-cuisiniere', 'cuisinieres-4-feux', 'Elec-Gaz', 1),
  ('inox-casquette', 'hottes-casquette', 'Inox', 1),
  ('glass', 'hottes-decoratives', 'Glass', 1),
  ('inox-pyramid', 'hottes-pyramid', 'Inox', 1),
  ('digitale-micro-ondes', 'micro-ondes-libre', 'Digitale', 1),
  ('mecanique-micro-ondes', 'micro-ondes-libre', 'Mécanique', 2),
  ('tactile-lave-linge', 'lave-linge-frontal', 'Tactile', 5),
  ('rotative-lave-linge', 'lave-linge-frontal', 'Rotative', 6),
  ('digitale-lave-vaisselle', 'lave-vaisselle-pose-libre', 'Digitale', 1),
  ('poudre-caps', 'cafetieres-multi', 'Poudre + capsules', 1),
  ('rotative-petrins', 'petrins-mono', 'Rotative', 1),
  ('digitale-petrins', 'petrins-mono', 'Digitale', 2),
  ('rotative-petrins-multi', 'petrins-multi', 'Rotative', 1),
  ('elec', 'cumulus-electrique', 'Elec', 1),
  ('gaz', 'chauffe-bain-gaz', 'Gaz', 1),
  ('sans-sac', 'aspirateurs-poussiere', 'Sans sac', 1),
  ('avec-sac', 'aspirateurs-poussiere', 'Avec sac', 2),
  ('sans-fil', 'aspirateurs-bali', 'Sans fil', 1),
  ('mecanique', 'fontaines-mecanique', 'Mécanique', 1),
  ('digitale', 'fontaines-digital', 'Digitale', 1)
on conflict (slug) do nothing;

insert into public.capacites (slug, name, value, unit, sort_order) values
  ('65-l', '65 L', '65', 'L', 14),
  ('60-l', '60 L', '60', 'L', 15),
  ('25-l', '25 L', '25', 'L', 16),
  ('20-l', '20 L', '20', 'L', 17),
  ('8-l', '8 L', '8', 'L', 18),
  ('15-couverts', '15 couverts', '15', 'couverts', 19),
  ('80-l', '80 L', '80', 'L', 20),
  ('100-l', '100 L', '100', 'L', 21),
  ('1400-w', '1400 W', '1400', 'W', 22),
  ('2000-w', '2000 W', '2000', 'W', 23),
  ('1200-w', '1200 W', '1200', 'W', 24),
  ('120-w', '120 W', '120', 'W', 25),
  ('500-w', '500 W', '500', 'W', 26),
  ('60-cm', '60 cm', '60', 'cm', 27)
on conflict (slug) do nothing;

insert into public.couleurs (slug, name, hex_code, sort_order) values
  ('gris-fonce', 'Gris foncé', '#4B5563', 7),
  ('noir-jaune', 'Noir et jaune', null, 8),
  ('noir-rouge', 'Noir et rouge', null, 9),
  ('blanc-noir', 'Blanc et noir', null, 10),
  ('blanc-gris', 'Blanc et gris', null, 11)
on conflict (slug) do nothing;

-- Produits REX (colonnes legacy remplies aussi pour compatibilité)
insert into public.products
  (id, slug, name, reference, category_slug, famille_id, sous_famille_id, gamme_id,
   subcategory, capacity, color, image, energy_class, description, is_active)
values
  ('rex-mo65', 'rex-mo65', 'Four pose libre Big — 65 L', 'REX-MO65', 'cuisson', 'fours', 'fours-pose', 'big', 'libre', '65 L', 'gris', '', 'A', 'Four pose libre Big — 65 L (réf. REX-MO65).', true),
  ('rex-gc60gg4-s', 'rex-gc60gg4-s', 'Cuisinière 4 feux Elec-Gaz — 60 L', 'REX-GC60GG4-S', 'cuisson', 'cuisinieres', 'cuisinieres-4-feux', 'elec-gaz-cuisiniere', '4 Feux', '60 L', 'gris', '', 'A', 'Cuisinière 4 feux Elec-Gaz — 60 L (réf. REX-GC60GG4-S).', true),
  ('rex-gc50gg4-s', 'rex-gc50gg4-s', 'Cuisinière 4 feux Elec-Gaz — 50 L', 'REX-GC50GG4-S', 'cuisson', 'cuisinieres', 'cuisinieres-4-feux', 'elec-gaz-cuisiniere', '4 Feux', '50 L', 'gris', '', 'A', 'Cuisinière 4 feux Elec-Gaz — 50 L (réf. REX-GC50GG4-S).', true),
  ('rex-ob60gg-gs', 'rex-ob60gg-gs', 'Four encastrable Gaz-Gaz — 60 L', 'REX-OB60GG-GS', 'cuisson', 'fours', 'fours-encastrables', 'gaz-gaz', 'encastrable', '60 L', null, '', 'A', 'Four encastrable Gaz-Gaz — 60 L (réf. REX-OB60GG-GS).', true),
  ('rex-ob60gg-gl', 'rex-ob60gg-gl', 'Four encastrable Gaz-Gaz — 60 L', 'REX-OB60GG-GL', 'cuisson', 'fours', 'fours-encastrables', 'gaz-gaz', 'encastrable', '60 L', null, '', 'A', 'Four encastrable Gaz-Gaz — 60 L (réf. REX-OB60GG-GL).', true),
  ('rex-ob60eg-gs', 'rex-ob60eg-gs', 'Four encastrable Elec-Gaz — 60 L', 'REX-OB60EG-GS', 'cuisson', 'fours', 'fours-encastrables', 'elec-gaz-four', 'encastrable', '60 L', null, '', 'A', 'Four encastrable Elec-Gaz — 60 L (réf. REX-OB60EG-GS).', true),
  ('rex-ob60eg-gg', 'rex-ob60eg-gg', 'Four encastrable Elec-Gaz — 60 L', 'REX-OB60EG-GG', 'cuisson', 'fours', 'fours-encastrables', 'elec-gaz-four', 'encastrable', '60 L', null, '', 'A', 'Four encastrable Elec-Gaz — 60 L (réf. REX-OB60EG-GG).', true),
  ('rex-ob60fe-gs', 'rex-ob60fe-gs', 'Four encastrable Elec-Elec — 60 L', 'REX-OB60FE-GS', 'cuisson', 'fours', 'fours-encastrables', 'elec-elec', 'encastrable', '60 L', null, '', 'A', 'Four encastrable Elec-Elec — 60 L (réf. REX-OB60FE-GS).', true),
  ('rex-ob60fe-gl', 'rex-ob60fe-gl', 'Four encastrable Elec-Elec — 60 L', 'REX-OB60FE-GL', 'cuisson', 'fours', 'fours-encastrables', 'elec-elec', 'encastrable', '60 L', null, '', 'A', 'Four encastrable Elec-Elec — 60 L (réf. REX-OB60FE-GL).', true),
  ('rex-chk60x', 'rex-chk60x', 'Hotte casquette Inox — 60 cm', 'REX-CHK60X', 'cuisson', 'hottes', 'hottes-casquette', 'inox-casquette', 'Casquette', '60 cm', 'gris', '', 'A', 'Hotte casquette Inox — 60 cm (réf. REX-CHK60X).', true),
  ('rex-chf60bl', 'rex-chf60bl', 'Hotte décorative Glass — 60 cm', 'REX-CHF60BL', 'cuisson', 'hottes', 'hottes-decoratives', 'glass', 'Decorative', '60 cm', 'Noir', '', 'A', 'Hotte décorative Glass — 60 cm (réf. REX-CHF60BL).', true),
  ('rex-chgs60x', 'rex-chgs60x', 'Hotte pyramide Inox — 60 cm', 'REX-CHGS60X', 'cuisson', 'hottes', 'hottes-pyramid', 'inox-pyramid', 'Pyramid', '60 cm', 'gris', '', 'A', 'Hotte pyramide Inox — 60 cm (réf. REX-CHGS60X).', true),
  ('rex-chcf60x', 'rex-chcf60x', 'Hotte pyramide Inox — 60 cm', 'REX-CHCF60X', 'cuisson', 'hottes', 'hottes-pyramid', 'inox-pyramid', 'Pyramid', '60 cm', 'gris', '', 'A', 'Hotte pyramide Inox — 60 cm (réf. REX-CHCF60X).', true),
  ('rex-m30ag9d-bm', 'rex-m30ag9d-bm', 'Micro-ondes pose libre Digitale — 30 L', 'REX-M30AG9D-BM', 'cuisson', 'micro-ondes', 'micro-ondes-libre', 'digitale-micro-ondes', 'libre', '30 L', 'Noir', '', 'A', 'Micro-ondes pose libre Digitale — 30 L (réf. REX-M30AG9D-BM).', true),
  ('rex-m25ag8d-b', 'rex-m25ag8d-b', 'Micro-ondes pose libre Digitale — 25 L', 'REX-M25AG8D-B', 'cuisson', 'micro-ondes', 'micro-ondes-libre', 'digitale-micro-ondes', 'libre', '25 L', 'Noir', '', 'A', 'Micro-ondes pose libre Digitale — 25 L (réf. REX-M25AG8D-B).', true),
  ('rex-m20am7d-w', 'rex-m20am7d-w', 'Micro-ondes pose libre Digitale — 20 L', 'REX-M20AM7D-W', 'cuisson', 'micro-ondes', 'micro-ondes-libre', 'digitale-micro-ondes', 'libre', '20 L', 'Blanc', '', 'A', 'Micro-ondes pose libre Digitale — 20 L (réf. REX-M20AM7D-W).', true),
  ('rex-m20mm7d-w', 'rex-m20mm7d-w', 'Micro-ondes pose libre Mécanique — 20 L', 'REX-M20MM7D-W', 'cuisson', 'micro-ondes', 'micro-ondes-libre', 'mecanique-micro-ondes', 'libre', '20 L', 'Blanc', '', 'A', 'Micro-ondes pose libre Mécanique — 20 L (réf. REX-M20MM7D-W).', true),
  ('rex-wm10b714ve', 'rex-wm10b714ve', 'Lave-linge frontal Tactile — 10.5 kg', 'REX-WM10B714VE', 'lavage', 'lave-linge', 'lave-linge-frontal', 'tactile-lave-linge', 'Front', '10.5 kg', 'gris fance', '', 'A', 'Lave-linge frontal Tactile — 10.5 kg (réf. REX-WM10B714VE).', true),
  ('rex-wm10a214ve', 'rex-wm10a214ve', 'Lave-linge frontal Rotative — 10.5 kg', 'REX-WM10A214VE', 'lavage', 'lave-linge', 'lave-linge-frontal', 'rotative-lave-linge', 'Front', '10.5 kg', 'gris fance', '', 'A', 'Lave-linge frontal Rotative — 10.5 kg (réf. REX-WM10A214VE).', true),
  ('rex-wm12b714ve', 'rex-wm12b714ve', 'Lave-linge frontal Tactile — 12 kg', 'REX-WM12B714VE', 'lavage', 'lave-linge', 'lave-linge-frontal', 'tactile-lave-linge', 'Front', '12 kg', 'gris fance', '', 'A', 'Lave-linge frontal Tactile — 12 kg (réf. REX-WM12B714VE).', true),
  ('rex-wm12a214ve', 'rex-wm12a214ve', 'Lave-linge frontal Rotative — 12 kg', 'REX-WM12A214VE', 'lavage', 'lave-linge', 'lave-linge-frontal', 'rotative-lave-linge', 'Front', '12 kg', 'gris fance', '', 'A', 'Lave-linge frontal Rotative — 12 kg (réf. REX-WM12A214VE).', true),
  ('rex-dw15-b', 'rex-dw15-b', 'Lave-vaisselle pose libre Digitale — 15 couverts', 'REX-DW15-B', 'lavage', 'lave-vaisselle', 'lave-vaisselle-pose-libre', 'digitale-lave-vaisselle', 'Pose libre', '15 couverts', 'Blanc', '', 'A', 'Lave-vaisselle pose libre Digitale — 15 couverts (réf. REX-DW15-B).', true),
  ('rex-dw15-s', 'rex-dw15-s', 'Lave-vaisselle pose libre Digitale — 15 couverts', 'REX-DW15-S', 'lavage', 'lave-vaisselle', 'lave-vaisselle-pose-libre', 'digitale-lave-vaisselle', 'Pose libre', '15 couverts', 'gris', '', 'A', 'Lave-vaisselle pose libre Digitale — 15 couverts (réf. REX-DW15-S).', true),
  ('rex-cm5386', 'rex-cm5386', 'Cafetière multi Poudre + capsules — Noir', 'REX-CM5386', 'petit-electromenager', 'cafetieres', 'cafetieres-multi', 'poudre-caps', 'multi', null, 'Noir', '', 'A', 'Cafetière multi Poudre + capsules — Noir (réf. REX-CM5386).', true),
  ('rex-cm5670', 'rex-cm5670', 'Cafetière multi Poudre + capsules — Noir', 'REX-CM5670', 'petit-electromenager', 'cafetieres', 'cafetieres-multi', 'poudre-caps', 'multi', null, 'Noir', '', 'A', 'Cafetière multi Poudre + capsules — Noir (réf. REX-CM5670).', true),
  ('rex-sm3068', 'rex-sm3068', 'Pétrin mono Rotative — 8 L', 'REX-SM3068', 'petit-electromenager', 'petrins', 'petrins-mono', 'rotative-petrins', 'Mono', '8 L', 'gris', '', 'A', 'Pétrin mono Rotative — 8 L (réf. REX-SM3068).', true),
  ('rex-sm3068g', 'rex-sm3068g', 'Pétrin mono Digitale — 8 L', 'REX-SM3068G', 'petit-electromenager', 'petrins', 'petrins-mono', 'digitale-petrins', 'Mono', '8 L', 'gris', '', 'A', 'Pétrin mono Digitale — 8 L (réf. REX-SM3068G).', true),
  ('rex-sm3068a', 'rex-sm3068a', 'Pétrin multi Rotative — 8 L', 'REX-SM3068A', 'petit-electromenager', 'petrins', 'petrins-multi', 'rotative-petrins-multi', 'Multi', '8 L', 'gris', '', 'A', 'Pétrin multi Rotative — 8 L (réf. REX-SM3068A).', true),
  ('rex-ewh-d30', 'rex-ewh-d30', 'Cumulus électrique Elec — 30 L', 'REX-EWH-D30', 'chauffe-eau', 'cumulus', 'cumulus-electrique', 'elec', 'ELEC', '30 L', 'blanc', '', 'A', 'Cumulus électrique Elec — 30 L (réf. REX-EWH-D30).', true),
  ('rex-ewh-d50', 'rex-ewh-d50', 'Cumulus électrique Elec — 50 L', 'REX-EWH-D50', 'chauffe-eau', 'cumulus', 'cumulus-electrique', 'elec', 'ELEC', '50 L', 'blanc', '', 'A', 'Cumulus électrique Elec — 50 L (réf. REX-EWH-D50).', true),
  ('rex-ewh-d85', 'rex-ewh-d85', 'Cumulus électrique Elec — 85 L', 'REX-EWH-D85', 'chauffe-eau', 'cumulus', 'cumulus-electrique', 'elec', 'ELEC', '85 L', 'blanc', '', 'A', 'Cumulus électrique Elec — 85 L (réf. REX-EWH-D85).', true),
  ('rex-gwh-d30', 'rex-gwh-d30', 'Chauffe-bain gaz — 30 L', 'REX-GWH-D30', 'chauffe-eau', 'chauffe-bain', 'chauffe-bain-gaz', 'gaz', 'GAZ', '30 L', 'blanc', '', 'A', 'Chauffe-bain gaz — 30 L (réf. REX-GWH-D30).', true),
  ('rex-gwh-d50', 'rex-gwh-d50', 'Chauffe-bain gaz — 50 L', 'REX-GWH-D50', 'chauffe-eau', 'chauffe-bain', 'chauffe-bain-gaz', 'gaz', 'GAZ', '50 L', 'blanc', '', 'A', 'Chauffe-bain gaz — 50 L (réf. REX-GWH-D50).', true),
  ('tb321-80l', 'tb321-80l', 'Aspirateur professionnel — 80 L', 'TB321-80L', 'entretien-maison', 'aspirateurs', 'aspirateurs-professionnels', null, 'Aspirateur professionnel', '80 L', 'noir et jaune', '', 'A', 'Aspirateur professionnel — 80 L (réf. TB321-80L).', true),
  ('tb321-100l', 'tb321-100l', 'Aspirateur professionnel — 100 L', 'TB321-100L', 'entretien-maison', 'aspirateurs', 'aspirateurs-professionnels', null, 'Aspirateur professionnel', '100 L', 'noir et jaune', '', 'A', 'Aspirateur professionnel — 100 L (réf. TB321-100L).', true),
  ('hjw-1601', 'hjw-1601', 'Aspirateur poussière Sans sac — 1400 W', 'HJW-1601', 'entretien-maison', 'aspirateurs', 'aspirateurs-poussiere', 'sans-sac', 'Aspirateur poussière', '1400 W', 'noir et rouge', '', 'A', 'Aspirateur poussière Sans sac — 1400 W (réf. HJW-1601).', true),
  ('hjx-2202', 'hjx-2202', 'Aspirateur poussière Sans sac — 2000 W', 'HJX-2202', 'entretien-maison', 'aspirateurs', 'aspirateurs-poussiere', 'sans-sac', 'Aspirateur poussière', '2000 W', 'noir et rouge', '', 'A', 'Aspirateur poussière Sans sac — 2000 W (réf. HJX-2202).', true),
  ('hjw-1703', 'hjw-1703', 'Aspirateur poussière Avec sac — 1200 W', 'HJW-1703', 'entretien-maison', 'aspirateurs', 'aspirateurs-poussiere', 'avec-sac', 'Aspirateur poussière', '1200 W', 'noir et rouge', '', 'A', 'Aspirateur poussière Avec sac — 1200 W (réf. HJW-1703).', true),
  ('hjc-1903', 'hjc-1903', 'Aspirateur Bali Sans fil — 120 W', 'HJC-1903', 'entretien-maison', 'aspirateurs', 'aspirateurs-bali', 'sans-fil', 'Aspirateur Bali', '120 W', 'noir et rouge', '', 'A', 'Aspirateur Bali Sans fil — 120 W (réf. HJC-1903).', true),
  ('800', '800', 'Fontaine mécanique — 500 W', '800', 'fontaines', 'fontaines-eau', 'fontaines-mecanique', 'mecanique', 'Mécanique', '500W', 'blanc et noir', '', 'A', 'Fontaine mécanique — 500 W (réf. 800).', true),
  ('802', '802', 'Fontaine mécanique — 500 W', '802', 'fontaines', 'fontaines-eau', 'fontaines-mecanique', 'mecanique', 'Mécanique', '500W', 'blanc et gris', '', 'A', 'Fontaine mécanique — 500 W (réf. 802).', true),
  ('802-2', '802-2', 'Fontaine digitale — 500 W', '802-2', 'fontaines', 'fontaines-eau', 'fontaines-digital', 'digitale', 'Digital', '500W', 'gris', '', 'A', 'Fontaine digitale — 500 W (variante digitale de la réf. 802).', true),
  ('168', '168', 'Fontaine mécanique — 500 W', '168', 'fontaines', 'fontaines-eau', 'fontaines-mecanique', 'mecanique', 'Mécanique', '500W', 'Blanc', '', 'A', 'Fontaine mécanique — 500 W (réf. 168).', true)
on conflict (id) do nothing;

insert into public.product_capacites (product_id, capacite_slug) values
  ('rex-mo65', '65-l'), ('rex-gc60gg4-s', '60-l'), ('rex-gc50gg4-s', '50-l'),
  ('rex-ob60gg-gs', '60-l'), ('rex-ob60gg-gl', '60-l'),
  ('rex-ob60eg-gs', '60-l'), ('rex-ob60eg-gg', '60-l'),
  ('rex-ob60fe-gs', '60-l'), ('rex-ob60fe-gl', '60-l'),
  ('rex-chk60x', '60-cm'), ('rex-chf60bl', '60-cm'), ('rex-chgs60x', '60-cm'), ('rex-chcf60x', '60-cm'),
  ('rex-m30ag9d-bm', '30-l'), ('rex-m25ag8d-b', '25-l'), ('rex-m20am7d-w', '20-l'), ('rex-m20mm7d-w', '20-l'),
  ('rex-wm10b714ve', '10-5-kg'), ('rex-wm10a214ve', '10-5-kg'),
  ('rex-wm12b714ve', '12-kg'), ('rex-wm12a214ve', '12-kg'),
  ('rex-dw15-b', '15-couverts'), ('rex-dw15-s', '15-couverts'),
  ('rex-sm3068', '8-l'), ('rex-sm3068g', '8-l'), ('rex-sm3068a', '8-l'),
  ('rex-ewh-d30', '30-l'), ('rex-ewh-d50', '50-l'), ('rex-ewh-d85', '85-l'),
  ('rex-gwh-d30', '30-l'), ('rex-gwh-d50', '50-l'),
  ('tb321-80l', '80-l'), ('tb321-100l', '100-l'),
  ('hjw-1601', '1400-w'), ('hjx-2202', '2000-w'), ('hjw-1703', '1200-w'), ('hjc-1903', '120-w'),
  ('800', '500-w'), ('802', '500-w'), ('802-2', '500-w'), ('168', '500-w')
on conflict do nothing;

insert into public.product_couleurs (product_id, couleur_slug) values
  ('rex-mo65', 'gris'), ('rex-gc60gg4-s', 'gris'), ('rex-gc50gg4-s', 'gris'),
  ('rex-chk60x', 'gris'), ('rex-chf60bl', 'noir'), ('rex-chgs60x', 'gris'), ('rex-chcf60x', 'gris'),
  ('rex-m30ag9d-bm', 'noir'), ('rex-m25ag8d-b', 'noir'), ('rex-m20am7d-w', 'blanc'), ('rex-m20mm7d-w', 'blanc'),
  ('rex-wm10b714ve', 'gris-fonce'), ('rex-wm10a214ve', 'gris-fonce'),
  ('rex-wm12b714ve', 'gris-fonce'), ('rex-wm12a214ve', 'gris-fonce'),
  ('rex-dw15-b', 'blanc'), ('rex-dw15-s', 'gris'),
  ('rex-cm5386', 'noir'), ('rex-cm5670', 'noir'),
  ('rex-sm3068', 'gris'), ('rex-sm3068g', 'gris'), ('rex-sm3068a', 'gris'),
  ('rex-ewh-d30', 'blanc'), ('rex-ewh-d50', 'blanc'), ('rex-ewh-d85', 'blanc'),
  ('rex-gwh-d30', 'blanc'), ('rex-gwh-d50', 'blanc'),
  ('tb321-80l', 'noir-jaune'), ('tb321-100l', 'noir-jaune'),
  ('hjw-1601', 'noir-rouge'), ('hjx-2202', 'noir-rouge'), ('hjw-1703', 'noir-rouge'), ('hjc-1903', 'noir-rouge'),
  ('800', 'blanc-noir'), ('802', 'blanc-gris'), ('802-2', 'gris'), ('168', 'blanc')
on conflict do nothing;
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
