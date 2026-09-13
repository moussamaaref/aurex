import fs from 'fs'

const homeSections = {
  id: "home-sections",
  categoriesEyebrow: "Catalogue",
  categoriesTitle: "Nos catégories",
  lineupEyebrow: "Product Line-Up 2026",
  lineupTitle: "Une gamme pensée pour chaque usage.",
  lineupIntro: "Le Product Line-Up 2026 de DAYCONN AUREX propose une gamme complète et diversifiée de produits d'électroménager, conçue pour répondre aux différents besoins des consommateurs algériens.",
  lineupOutro: "À travers ce catalogue, DAYCONN AUREX affirme une offre structurée autour de plusieurs univers, combinant diversité, variété des configurations et adaptation aux usages domestiques.",
  lineupWashingTitle: "Lavage",
  lineupWashingDesc: "Spinova, Lavexa, Lavexa+ et Spinova+, complétés par les lave-vaisselle Estrela et Estrela S.",
  lineupSmallTitle: "Petit électroménager",
  lineupSmallDesc: "Pétrins et cafetières mono, multi et à capsules des gammes Gustiva et Florenza.",
  lineupWaterTitle: "Chauffe-eau",
  lineupWaterDesc: "Cumulus et chauffe-bain en 30, 50 et 85 litres pour différents besoins en eau chaude.",
  lineupHomeCareTitle: "Entretien de la maison",
  lineupHomeCareDesc: "Aspirateurs professionnels, eau et poussière, avec ou sans sac et sans fil : T-Vox, Eronex, Dustor et Liva.",
  lineupFountainsTitle: "Fontaines",
  lineupFountainsDesc: "Des références adaptées aux usages domestiques et aux différents environnements.",
  lineupCookingTitle: "Cuisson",
  lineupCookingDesc: "Fours encastrables, hottes, fours à poser, micro-ondes et cuisinières électriques, gaz ou mixtes.",
  featuredSubtitle: "À la une",
  featuredTitle: "Produits vedettes",
  smartEyebrow: "AUREX SmartConnect",
  smartTitle: "Votre maison,\nintelligente.",
  smartDesc: "L'application AUREX Connect vous permet de contrôler, programmer et surveiller tous vos appareils SmartConnect depuis votre smartphone, où que vous soyez.",
  smartCta: "Découvrir Smart Home",
  smartImage: "",
  smartFeat1Title: "Application mobile",
  smartFeat1Desc: "iOS & Android",
  smartFeat2Title: "Commande vocale",
  smartFeat2Desc: "Compatible Alexa & Google",
  smartFeat3Title: "Automatisations",
  smartFeat3Desc: "Scénarios personnalisés",
  smartFeat4Title: "Suivi énergie",
  smartFeat4Desc: "Consommation en temps réel",
  smartBadgeTitle: "Lave-linge EX9000",
  smartBadgeSubtitle: "Cycle terminé — 09:24",
  smartEnergyLabel: "Énergie",
  smartEnergyValue: "-32%",
  techSubtitle: "Innovations",
  techTitle: "Nos technologies",
  newsSubtitle: "Actualités",
  newsTitle: "Dernières nouvelles",
  supportSubtitle: "Service après-vente",
  supportTitle: "Besoin d'aide ?\nNous sommes là.",
  supportDesc: "Notices d'utilisation, fiches techniques, garanties, pièces détachées — tout est accessible en ligne. Notre réseau de techniciens agréés est présent dans toute l'Algérie.",
  supportCta1: "Accéder au support",
  supportCta2: "Télécharger une notice",
  supportFeatNoticesTitle: "Notices & manuels",
  supportFeatNoticesDesc: "Téléchargement PDF gratuit",
  supportFeatAssistanceTitle: "Assistance technique",
  supportFeatAssistanceDesc: "Techniciens agréés",
  supportFeatPartsTitle: "Pièces détachées",
  supportFeatPartsDesc: "Pièces d'origine AUREX",
  supportFeatFaqTitle: "FAQ",
  supportFeatFaqDesc: "Réponses rapides",
  is_active: true,
}

const sqlEscape = (s) => s.replace(/'/g, "''")
const items = JSON.stringify([homeSections])

const sql = `-- Remplir homeSections (pre-remplissage FR) + corriger typo campaign
-- A executer dans Supabase > SQL Editor
update public.aurex_collections
set items = '${sqlEscape(items)}'::jsonb, updated_at = now()
where collection_key = 'homeSections';

update public.aurex_collections
set items = (items::jsonb || '[]'::jsonb),
    updated_at = now()
where false;

-- Corriger la coquille "20267" -> "2026" dans le badge campaign
update public.aurex_collections
set items = replace(items::text, 'été 20267', 'été 2026')::jsonb, updated_at = now()
where collection_key = 'campaign';

select collection_key, updated_at, left(items::text, 120) from public.aurex_collections
where collection_key in ('homeSections', 'campaign');
`
fs.writeFileSync('supabase/update-home-content.sql', sql, 'utf8')
console.log('written supabase/update-home-content.sql', sql.length, 'chars')
