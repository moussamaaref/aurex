-- Contenu éditorial du site géré depuis /admin : collections « stories » et « siteContent ».
-- La table aurex_collections limite les clés autorisées : on étend la contrainte.
alter table public.aurex_collections drop constraint if exists aurex_collections_collection_key_check;
alter table public.aurex_collections add constraint aurex_collections_collection_key_check
  check (collection_key in (
    'products','categories','technologies','news','faq','distributors',
    'heroSlides','stats','marquee','campaign','homeSections',
    'smartPage','techPage','newsPage','aboutPage','supportPage',
    'familles','sousFamilles','gammes','capacites','couleurs',
    'stories','siteContent'
  ));
