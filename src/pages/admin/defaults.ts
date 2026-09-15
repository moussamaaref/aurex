import { categories, faqItems, newsItems, products, technologies } from "../../data"
import {
  defaultCapacites,
  defaultCouleurs,
  defaultFamilles,
  defaultGammes,
  defaultSousFamilles,
} from "../../lib/taxonomy"
import { mlFr } from "../../lib/ml"
import type { CollectionKey } from "./types"

// ---------------------------------------------------------------------------
// Default items — DOIVENT être déclarés AVANT collectionTemplate
// ---------------------------------------------------------------------------

export const defaultSupportPageItem: Record<string, unknown> = {
  id: "support-page",
  supHeroEyebrow: "AUREX SmartConnect",
  supHeroTitle: "",
  supHeroDesc: "",
  supHeroCta1: "",
  supHeroCta2: "",
  supHeroImage: "",
  supBadgeTitle: "",
  supBadgeSubtitle: "",
  supChartLabel: "",
  supChartValue: "",
  supStep1Title: "",
  supStep1Desc: "",
  supStep2Title: "",
  supStep2Desc: "",
  supStep3Title: "",
  supStep3Desc: "",
  supFeatSubtitle: "",
  supFeatTitle: "",
  supFeatDesc: "",
  supFeatures: [],
  supCompatEyebrow: "SmartConnect",
  supCompatTitle: "",
  supTestiQuote: "",
  supTestiAuthor: "",
  supTestiCity: "",
  supAppSubtitle: "",
  supAppTitle: "",
  supAppDesc: "",
  supAppSecure: "",
  is_active: true,
}

export const defaultAboutPageItem: Record<string, unknown> = {
  id: "about-page",
  aboutHeroSubtitle: "",
  aboutHeroTitle: "",
  aboutHeroDesc: "",
  aboutHeroImage: "",
  aboutStat1Value: "30+",
  aboutStat1Label: "",
  aboutStat2Value: "120+",
  aboutStat2Label: "",
  aboutStat3Value: "48",
  aboutStat3Label: "",
  aboutStat4Value: "500+",
  aboutStat4Label: "",
  aboutIntroTitle: "",
  aboutIntroParagraphs: [],
  aboutTagline: "",
  aboutMissionSubtitle: "",
  aboutMissionTitle: "",
  aboutMissionDesc1: "",
  aboutMissionDesc2: "",
  aboutMissionCta1: "",
  aboutMissionCta2: "",
  aboutMissionImage: "",
  aboutQualityBadge: "",
  aboutQualityBadgeSub: "",
  aboutValuesSubtitle: "",
  aboutValuesTitle: "",
  aboutValuesItems: [],
  aboutHistorySubtitle: "",
  aboutHistoryTitle: "",
  aboutHistoryMilestones: [],
  aboutCtaTitle: "",
  aboutCtaDesc: "",
  aboutCtaButton1: "",
  aboutCtaButton2: "",
  is_active: true,
}

export const defaultNewsPageItem: Record<string, unknown> = {
  id: "news-page",
  newsHeroEyebrow: "",
  newsHeroTitle: "",
  newsHeroDesc: "",
  newsStatArticles: "Articles",
  newsStatCategories: "Catégories",
  newsSectionEyebrow: "",
  newsSectionTitle: "",
  newsFilterAll: "",
  newsFeaturedBadge: "",
  newsFeaturedReadTime: "5 min de lecture",
  newsCardReadTime: "3 min",
  newsEmpty: "",
  newsSupportEyebrow: "",
  newsSupportTitle: "",
  newsSupportButton: "",
  is_active: true,
}

export const defaultTechPageItem: Record<string, unknown> = {
  id: "tech-page",
  techHeroSubtitle: "",
  techHeroTitle: "",
  techHeroDesc: "",
  stat1Value: "12+",
  stat1Label: "",
  stat2Value: "40%",
  stat2Label: "",
  stat3Value: "3×",
  stat3Label: "",
  stat4Value: "10 ans",
  stat4Label: "",
  filterAll: "",
  filterConnectivity: "",
  filterEco: "",
  filterHygiene: "",
  filterConservation: "",
  ctaTitle: "",
  ctaDesc: "",
  ctaButton: "",
  is_active: true,
}

export const defaultSmartPageItem: Record<string, unknown> = {
  id: "smart-page",
  heroEyebrow: "AUREX SmartConnect",
  heroTitle: "",
  heroDesc: "",
  heroCta1: "",
  heroCta2: "",
  heroImage: "",
  badgeTitle: "",
  badgeSubtitle: "",
  chartLabel: "",
  chartValue: "",
  step1Title: "",
  step1Desc: "",
  step2Title: "",
  step2Desc: "",
  step3Title: "",
  step3Desc: "",
  featSubtitle: "",
  featTitle: "",
  featDesc: "",
  features: [],
  compatEyebrow: "SmartConnect",
  compatTitle: "",
  testiQuote: "",
  testiAuthor: "",
  testiCity: "",
  appSubtitle: "",
  appTitle: "",
  appDesc: "",
  appSecure: "",
  is_active: true,
}

export const defaultHomeSectionsItem: Record<string, unknown> = {
  id: "home-sections",
  categoriesEyebrow: "Catalogue",
  categoriesTitle: "Nos catégories",
  lineupEyebrow: "Product Line-Up 2026",
  lineupTitle: "Une gamme pensée pour chaque usage.",
  lineupIntro:
    "Le Product Line-Up 2026 de DAYCONN AUREX propose une gamme complète et diversifiée de produits d'électroménager, conçue pour répondre aux différents besoins des consommateurs algériens.",
  lineupOutro:
    "À travers ce catalogue, DAYCONN AUREX affirme une offre structurée autour de plusieurs univers, combinant diversité, variété des configurations et adaptation aux usages domestiques.",
  lineupWashingTitle: "Lavage",
  lineupWashingDesc:
    "Spinova, Lavexa, Lavexa+ et Spinova+, complétés par les lave-vaisselle Estrela et Estrela S.",
  lineupSmallTitle: "Petit électroménager",
  lineupSmallDesc:
    "Pétrins et cafetières mono, multi et à capsules des gammes Gustiva et Florenza.",
  lineupWaterTitle: "Chauffe-eau",
  lineupWaterDesc:
    "Cumulus et chauffe-bain en 30, 50 et 85 litres pour différents besoins en eau chaude.",
  lineupHomeCareTitle: "Entretien de la maison",
  lineupHomeCareDesc:
    "Aspirateurs professionnels, eau et poussière, avec ou sans sac et sans fil : T-Vox, Eronex, Dustor et Liva.",
  lineupFountainsTitle: "Fontaines",
  lineupFountainsDesc:
    "Des références adaptées aux usages domestiques et aux différents environnements.",
  lineupCookingTitle: "Cuisson",
  lineupCookingDesc:
    "Fours encastrables, hottes, fours à poser, micro-ondes et cuisinières électriques, gaz ou mixtes.",
  featuredSubtitle: "À la une",
  featuredTitle: "Produits vedettes",
  smartEyebrow: "AUREX SmartConnect",
  smartTitle: "Votre maison,\nintelligente.",
  smartDesc:
    "L'application AUREX Connect vous permet de contrôler, programmer et surveiller tous vos appareils SmartConnect depuis votre smartphone, où que vous soyez.",
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
  supportDesc:
    "Notices d'utilisation, fiches techniques, garanties, pièces détachées — tout est accessible en ligne. Notre réseau de techniciens agréés est présent dans toute l'Algérie.",
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

export function collectionTemplate(key: CollectionKey): Record<string, unknown> | string {
  switch (key) {
    case "products":
      return {
        id: `nouveau-produit-${Date.now()}`,
        name: "",
        slug: "",
        reference: "",
        category_slug: "",
        famille: "",
        sousFamille: "",
        gamme: "",
        capacites: [],
        couleurs: [],
        subcategory: "",
        image: "",
        images: [],
        badges: [],
        capacity: "",
        energy_class: "",
        connectivity: false,
        technologies: [],
        noise_level: "",
        dimensions: { w: 0, h: 0, d: 0 },
        description: "",
        short_description: "",
        features: [],
        color: "",
        is_new: false,
        is_featured: false,
        stock: 0,
        is_active: true,
      }
    case "categories":
      return {
        slug: "",
        label: "",
        description: "",
        image: "",
        color: "",
        sort_order: 0,
        subcategories: [],
        is_active: true,
      }
    case "familles":
      return {
        slug: "",
        category_slug: "",
        name: "",
        description: "",
        image: "",
        sort_order: 0,
        is_active: true,
      }
    case "sousFamilles":
      return {
        slug: "",
        famille_id: "",
        name: "",
        description: "",
        image: "",
        sort_order: 0,
        is_active: true,
      }
    case "gammes":
      return {
        slug: "",
        sous_famille_id: "",
        name: "",
        description: "",
        image: "",
        sort_order: 0,
        is_active: true,
      }
    case "capacites":
      return {
        slug: "",
        name: "",
        value: "",
        unit: "",
        sort_order: 0,
        is_active: true,
      }
    case "couleurs":
      return {
        slug: "",
        name: "",
        hex_code: "",
        image: "",
        sort_order: 0,
        is_active: true,
      }
    case "technologies":
      return {
        id: `nouvelle-technologie-${Date.now()}`,
        name: "",
        icon: "",
        image: "",
        benefit: "",
        description: "",
        category: "",
        compatible_categories: [],
        is_active: true,
      }
    case "news":
      return {
        id: `nouvelle-actualite-${Date.now()}`,
        title: "",
        excerpt: "",
        content: "",
        published_at: new Date().toISOString().slice(0, 10),
        category: "",
        image: "",
        slug: "",
        is_published: true,
      }
    case "faq":
      return { question: "", answer: "", sort_order: 0, is_active: true }
    case "distributors":
      return {
        id: `nouveau-distributeur-${Date.now()}`,
        name: "",
        address: "",
        wilaya: "",
        commune: "",
        phone: "",
        email: "",
        latitude: 0,
        longitude: 0,
        is_active: true,
      }
    case "heroSlides":
      return {
        id: `hero-${Date.now()}`,
        tag: "Nouveauté 2026",
        title: "Une propreté\nnouvelle génération.",
        subtitle:
          "La nouvelle gamme AUREX — technologies de pointe\npour chaque foyer algérien.",
        cta: "Découvrir la gamme",
        ctaSec: "Smart Home",
        ctaHref: "/produits",
        ctaSecHref: "/smart-home",
        image: "/Spinova3.jpeg",
        is_active: true,
      }
    case "stats":
      return { value: 0, suffix: "", label: "", is_active: true }
    case "marquee":
      return ""
    case "campaign":
      return {
        id: "campaign-main",
        badge: "",
        title: "",
        description: "",
        cta: "",
        href: "/produits/climatisation",
        darkImage: "",
        darkTag: "",
        darkTitle: "",
        darkSpecs: "",
        darkHref: "/produits/lavage/ex9000-wm",
        lightImage: "",
        lightTag: "",
        lightTitle: "",
        lightSpecs: "",
        lightHref: "/produits/refrigerateurs/ex7000-fridge",
        is_active: true,
      }
    case "homeSections":
      return { ...defaultHomeSectionsItem, id: `home-sections-${Date.now()}` }
    case "smartPage":
      return { ...defaultSmartPageItem, id: `smart-page-${Date.now()}` }
    case "techPage":
      return { ...defaultTechPageItem, id: `tech-page-${Date.now()}` }
    case "newsPage":
      return { ...defaultNewsPageItem, id: `news-page-${Date.now()}` }
    case "aboutPage":
      return { ...defaultAboutPageItem, id: `about-page-${Date.now()}` }
    case "supportPage":
      return { ...defaultSupportPageItem, id: `support-page-${Date.now()}` }
  }
}

export function defaultCollections(): Record<CollectionKey, unknown[]> {
  return {
    products,
    categories,
    familles: defaultFamilles.map((f) => ({
      slug: f.slug,
      category_slug: f.categorySlug,
      name: mlFr(f.name),
      description: "",
      image: "",
      sort_order: 0,
      is_active: true,
    })),
    sousFamilles: defaultSousFamilles.map((s) => ({
      slug: s.slug,
      famille_id: s.familleSlug,
      name: mlFr(s.name),
      description: "",
      image: "",
      sort_order: 0,
      is_active: true,
    })),
    gammes: defaultGammes.map((g) => ({
      slug: g.slug,
      sous_famille_id: g.sousFamilleSlug,
      name: mlFr(g.name),
      description: "",
      image: "",
      sort_order: 0,
      is_active: true,
    })),
    capacites: defaultCapacites.map((c) => ({
      slug: c.slug,
      name: mlFr(c.name),
      value: c.value ?? "",
      unit: c.unit ?? "",
      sort_order: 0,
      is_active: true,
    })),
    couleurs: defaultCouleurs.map((c) => ({
      slug: c.slug,
      name: mlFr(c.name),
      hex_code: c.hex_code ?? "",
      image: "",
      sort_order: 0,
      is_active: true,
    })),
    technologies,
    news: newsItems,
    faq: faqItems,
    distributors: [],
    heroSlides: [
      { id: "hero-0", tag: "Nouveauté 2026", title: "Une propreté\nnouvelle génération.", subtitle: "La nouvelle gamme AUREX — technologies de pointe\npour chaque foyer algérien.", cta: "Découvrir la gamme", ctaSec: "Smart Home", ctaHref: "/produits", ctaSecHref: "/smart-home", image: "/Spinova3.jpeg", is_active: true },
      { id: "hero-1", tag: "AUREX SmartConnect", title: "Le plaisir\nd'un café parfait.", subtitle: "Pilotez tous vos appareils depuis votre smartphone,\noù que vous soyez.", cta: "Smart Home", ctaSec: "Voir les produits", ctaHref: "/smart-home", ctaSecHref: "/produits", image: "/Gustiva.jpeg", is_active: true },
      { id: "hero-2", tag: "Réfrigération", title: "Fraîcheur\nsupérieure.", subtitle: "Technologie FreshCool brevetée — vos aliments\nresten frais jusqu'à 3× plus longtemps.", cta: "Voir les réfrigérateurs", ctaSec: "Technologies", ctaHref: "/produits/refrigerateurs", ctaSecHref: "/technologies", image: "/Vacuum.jpeg", is_active: true },
    ],
    stats: [
      { value: 120, suffix: "+", label: "Produits", is_active: true },
      { value: 6, suffix: "", label: "Gammes", is_active: true },
      { value: 48, suffix: "", label: "Points de vente", is_active: true },
      { value: 10, suffix: " ans", label: "Garantie", is_active: true },
    ],
    marquee: ["Garantie 10 ans", "Livraison 48h", "Installation offerte", "SmartConnect", "Classe A+++", "SAV national", "Paiement en 3x"],
    campaign: [{ id: "campaign-main", badge: "Offre exclusive — été 2026", title: "Climatiseurs\nEX6000 Inverter+", description: "Jusqu'à -20 % sur les splits, installation offerte jusqu'au 30 sept. 2026.", cta: "Profiter de l'offre", href: "/produits/climatisation", darkImage: "", darkTag: "Nouveauté", darkTitle: "Lave-linge EX9000", darkSpecs: "9 kg — A+++ — SmartConnect", darkHref: "/produits/lavage/ex9000-wm", lightImage: "", lightTag: "Best Seller", lightTitle: "Réfrigérateur EX7000", lightSpecs: "350 L — A++ — No Frost", lightHref: "/produits/refrigerateurs/ex7000-fridge", is_active: true }],
    homeSections: [{ ...defaultHomeSectionsItem }],
    smartPage: [{ ...defaultSmartPageItem }],
    techPage: [{ ...defaultTechPageItem }],
    newsPage: [{ ...defaultNewsPageItem }],
    aboutPage: [{ ...defaultAboutPageItem }],
    supportPage: [{ ...defaultSupportPageItem }],
  }
}
