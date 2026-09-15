import {
  defaultCapacites,
  defaultCouleurs,
  defaultFamilles,
  defaultGammes,
  defaultSousFamilles,
  productPath,
  productSlugOf,
  resolveCapacites,
  resolveCouleurs,
  resolveFamille,
  resolveGamme,
  resolveSousFamille,
  type Capacite,
  type Couleur,
  type Famille,
  type Gamme,
  type SousFamille,
} from "../lib/taxonomy"
import { ml } from "../lib/ml"

export interface Product {
  id: string
  name: string
  slug?: string
  reference: string
  category: string
  /** Hiérarchie taxonomique (nouveau modèle ; legacy conservé en repli). */
  famille?: string
  sousFamille?: string
  gamme?: string
  capacites?: string[]
  couleurs?: string[]
  subcategory?: string
  image: string
  images?: string[]
  badges: Array<"Nouveau" | "Promotion" | "Best Seller" | "Exclusivité">
  capacity?: string
  energyClass: string
  connectivity: boolean
  technologies: string[]
  noiseLevel?: string
  dimensions?: { w: number; h: number; d: number }
  description: string
  features: string[]
  color?: string
  isNew?: boolean
}

export interface Category {
  slug: string
  label: string
  description: string
  image: string
  count: number
  subcategories?: string[]
  color?: string
}

export interface Technology {
  id: string
  name: string
  icon: string
  image: string
  benefit: string
  description: string
  category: string
  compatibleCategories: string[]
}

const defaultCategories: Category[] = [
  {
    slug: "lavage",
    label: "Lavage",
    description: "Machines à laver Spinova, Lavexa, Lavexa+ et Spinova+.",
    image:
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&h=700&fit=crop&auto=format",
    count: 2,
    subcategories: ["Spinova", "Lavexa", "Lavexa+", "Spinova+"],
  },
  {
    slug: "lave-vaisselle",
    label: "Lave-vaisselle",
    description: "Les solutions Estrela et Estrela S pour la vaisselle.",
    image:
      "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&h=700&fit=crop&auto=format",
    count: 1,
    subcategories: ["Estrela", "Estrela S"],
  },
  {
    slug: "petit-electromenager",
    label: "Petit électroménager",
    description: "Pétrins et cafetières Gustiva et Florenza.",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=700&fit=crop&auto=format",
    count: 0,
    subcategories: ["Pétrins", "Cafetières mono", "Cafetières multi", "Cafetières à capsules"],
  },
  {
    slug: "chauffe-eau",
    label: "Chauffe-eau",
    description: "Cumulus et chauffe-bain en 30, 50 et 85 litres.",
    image:
      "https://images.unsplash.com/photo-1586208958839-06c17cacdf08?w=600&h=700&fit=crop&auto=format",
    count: 0,
    subcategories: ["Cumulus", "Chauffe-bain", "30 L", "50 L", "85 L"],
  },
  {
    slug: "entretien-maison",
    label: "Entretien de la maison",
    description: "Aspirateurs T-Vox, Eronex, Dustor et Liva.",
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&h=700&fit=crop&auto=format",
    count: 1,
    subcategories: ["Professionnels", "Eau et poussière", "Avec sac", "Sans sac", "Sans fil"],
  },
  {
    slug: "fontaines",
    label: "Fontaines",
    description: "Des fontaines adaptées aux usages domestiques.",
    image:
      "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=600&h=700&fit=crop&auto=format",
    count: 0,
    subcategories: ["Fontaines à eau", "Fontaines domestiques"],
  },
  {
    slug: "cuisson",
    label: "Cuisson",
    description: "Fours, hottes, micro-ondes et cuisinières.",
    image:
      "https://images.unsplash.com/photo-1586208958839-06c17cacdf08?w=600&h=700&fit=crop&auto=format",
    count: 1,
    subcategories: ["Fours encastrables", "Hottes aspirantes", "Fours à poser", "Micro-ondes", "Cuisinières"],
  },
  {
    slug: "autres",
    label: "Autres appareils",
    description: "Découvrez les appareils complémentaires AUREX.",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=700&fit=crop&auto=format",
    count: 2,
    subcategories: ["Réfrigérateurs", "Climatisation"],
  },
]

const defaultProducts: Product[] = [
  {
    id: "ex9000-wm",
    name: "Lave-linge EX9000 Smart",
    reference: "EX-WM-9000-60-SB",
    category: "lavage",
    subcategory: "Spinova+",
    image:
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&h=700&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1604335398980-ededcadcc37d?w=800&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=800&h=900&fit=crop&auto=format",
    ],
    badges: ["Nouveau", "Best Seller"],
    capacity: "9 kg",
    energyClass: "A+++",
    connectivity: true,
    technologies: ["EcoWash", "SteamCare", "SmartConnect"],
    noiseLevel: "45 dB",
    dimensions: { w: 60, h: 85, d: 60 },
    description:
      "Le lave-linge EX9000 Smart conjugue performance et connectivité. Avec ses 15 programmes intelligents et sa technologie EcoWash, il consomme jusqu'à 40 % d'énergie en moins tout en garantissant un lavage parfait.",
    features: [
      "15 programmes intelligents",
      "Contrôle via app AUREX",
      "Technologie SteamCare",
      "Moteur Inverter Direct Drive 10 ans de garantie",
      "Programmation à distance",
      "Détection automatique du poids du linge",
    ],
    color: "Blanc",
    isNew: true,
  },
  {
    id: "ex7000-fridge",
    name: "Réfrigérateur No Frost EX7000",
    reference: "EX-RF-7000-350-NF",
    category: "refrigerateurs",
    subcategory: "Réfrigérateurs",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=700&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1588854337115-1c67d9247e4d?w=800&h=900&fit=crop&auto=format",
    ],
    badges: ["Nouveau"],
    capacity: "350 L",
    energyClass: "A++",
    connectivity: true,
    technologies: ["FreshCool", "SmartConnect", "NoFrost"],
    dimensions: { w: 60, h: 185, d: 65 },
    description:
      "Le réfrigérateur EX7000 offre une capacité généreuse avec une technologie No Frost évoluée. Son système FreshCool maintient l'humidité optimale pour conserver les aliments plus longtemps.",
    features: [
      "Froid ventilé No Frost total",
      "Technologie FreshCool brevetée",
      "Affichage LED digital",
      "Tiroir FreshZone 0°C",
      "Super refroidissement",
      "Connecté via app AUREX",
    ],
    color: "Inox",
    isNew: true,
  },
  {
    id: "ex5000-wm",
    name: "Lave-linge EX5000 Eco",
    reference: "EX-WM-5000-70-EW",
    category: "lavage",
    subcategory: "Lavexa",
    image:
      "https://images.unsplash.com/photo-1604335398980-ededcadcc37d?w=600&h=700&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1604335398980-ededcadcc37d?w=800&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=800&h=900&fit=crop&auto=format",
    ],
    badges: ["Nouveau"],
    capacity: "7 kg",
    energyClass: "A++",
    connectivity: false,
    technologies: ["EcoWash", "QuickWash"],
    noiseLevel: "50 dB",
    dimensions: { w: 60, h: 85, d: 50 },
    description:
      "Le lave-linge EX5000 Eco offre des programmes essentiels, une consommation maîtrisée et un fonctionnement silencieux pour un lavage quotidien fiable.",
    features: [
      "12 programmes de lavage",
      "Programme rapide 15 minutes",
      "Moteur EcoDrive",
      "Départ différé",
      "Détection automatique de charge",
      "Tambour grande capacité",
    ],
    color: "Blanc",
  },
  {
    id: "ex8000-oven",
    name: "Four multifonction EX8000",
    reference: "EX-OV-8000-70-PYR",
    category: "cuisson",
    subcategory: "Fours encastrables",
    image:
      "https://images.unsplash.com/photo-1639405069836-f82aa6dcb900?w=600&h=700&fit=crop&auto=format",
    badges: ["Best Seller"],
    capacity: "70 L",
    energyClass: "A+",
    connectivity: false,
    technologies: ["PyroCook", "HeatDistrib"],
    dimensions: { w: 60, h: 60, d: 55 },
    description:
      "Four encastrable multifonction EX8000 avec pyrolyse automatique. Ses 12 modes de cuisson et sa distribution homogène de la chaleur garantissent des résultats professionnels à la maison.",
    features: [
      "12 modes de cuisson",
      "Pyrolyse automatique",
      "Sonde de température",
      "Éclairage LED 360°",
      "Porte froide triple vitrage",
      "Minuterie digitale",
    ],
    color: "Inox/Noir",
  },
  {
    id: "ex5500-dw",
    name: "Lave-vaisselle EX5500",
    reference: "EX-DW-5500-14-ENK",
    category: "lave-vaisselle",
    subcategory: "Estrela",
    image:
      "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&h=700&fit=crop&auto=format",
    badges: ["Promotion"],
    capacity: "14 couverts",
    energyClass: "A+++",
    connectivity: false,
    technologies: ["AquaSave", "SilentWash"],
    noiseLevel: "42 dB",
    dimensions: { w: 60, h: 82, d: 55 },
    description:
      "Lave-vaisselle encastrable ultra-silencieux EX5500 avec technologie AquaSave. Son programme Eco consomme seulement 9,5 L d'eau par cycle.",
    features: [
      "Ultra-silencieux 42 dB",
      "8 programmes de lavage",
      "Technologie AquaSave",
      "Panier flexible AdjustFlex",
      "Indicateur de sel et rinçage",
      "Programme rapide 30 min",
    ],
    color: "Inox",
  },
  {
    id: "ex6000-ac",
    name: "Climatiseur Inverter EX6000",
    reference: "EX-AC-6000-24-INV",
    category: "autres",
    subcategory: "Climatisation",
    image:
      "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=600&h=700&fit=crop&auto=format",
    badges: ["Nouveau", "Exclusivité"],
    capacity: "24 000 BTU",
    energyClass: "A+++",
    connectivity: true,
    technologies: ["InverterPlus", "SmartConnect", "TurboMode"],
    noiseLevel: "24 dB",
    dimensions: { w: 89, h: 30, d: 22 },
    description:
      "Climatiseur split inverter EX6000 avec technologie InverterPlus de dernière génération. Économies d'énergie allant jusqu'à 60 % par rapport aux modèles conventionnels.",
    features: [
      "Technologie Inverter+ dernière génération",
      "Économies jusqu'à 60 %",
      "Ultra-silencieux 24 dB",
      "Contrôle Wi-Fi intégré",
      "Mode Turbo 10 minutes",
      "Auto-nettoyage",
    ],
    color: "Blanc",
    isNew: true,
  },
  {
    id: "ex4000-purifier",
    name: "Purificateur d'air EX4000",
    reference: "EX-AP-4000-HEPA",
    category: "entretien-maison",
    subcategory: "Sans sac",
    image:
      "https://images.unsplash.com/photo-1519558260268-cde7e03a0152?w=600&h=700&fit=crop&auto=format",
    badges: ["Nouveau"],
    capacity: "jusqu'à 65 m²",
    energyClass: "A++",
    connectivity: true,
    technologies: ["SmartConnect", "FiltreHEPA"],
    noiseLevel: "22 dB",
    description:
      "Purificateur d'air EX4000 avec filtre HEPA H13 et charbon actif. Élimine 99,97 % des particules fines, allergènes, bactéries et composés organiques volatils.",
    features: [
      "Filtre HEPA H13 + charbon actif",
      "Détection qualité de l'air en temps réel",
      "Mode automatique intelligent",
      "Capteur qualité de l'air PM2.5",
      "Contrôle via app AUREX",
      "Remplacement filtre 12 mois",
    ],
    color: "Blanc",
    isNew: true,
  },
  // ── Catalogue REX (référence, catégorie, famille, sous-famille, gamme, capacité, couleur) ──
  {
    id: "rex-mo65",
    name: "Four pose libre Big — 65 L",
    slug: "rex-mo65",
    reference: "REX-MO65",
    category: "cuisson",
    famille: "fours",
    sousFamille: "fours-pose",
    gamme: "big",
    capacites: ["65-l"],
    couleurs: ["gris"],
    subcategory: "libre",
    image:
      "https://images.unsplash.com/photo-1639405069836-f82aa6dcb900?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "65 L",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Four pose libre Big — 65 L (réf. REX-MO65).",
    features: [],
    color: "gris",
  },
  {
    id: "rex-gc60gg4-s",
    name: "Cuisinière 4 feux Elec-Gaz — 60 L",
    slug: "rex-gc60gg4-s",
    reference: "REX-GC60GG4-S",
    category: "cuisson",
    famille: "cuisinieres",
    sousFamille: "cuisinieres-4-feux",
    gamme: "elec-gaz-cuisiniere",
    capacites: ["60-l"],
    couleurs: ["gris"],
    subcategory: "4 Feux",
    image:
      "https://images.unsplash.com/photo-1639405069836-f82aa6dcb900?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "60 L",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Cuisinière 4 feux Elec-Gaz — 60 L (réf. REX-GC60GG4-S).",
    features: [],
    color: "gris",
  },
  {
    id: "rex-gc50gg4-s",
    name: "Cuisinière 4 feux Elec-Gaz — 50 L",
    slug: "rex-gc50gg4-s",
    reference: "REX-GC50GG4-S",
    category: "cuisson",
    famille: "cuisinieres",
    sousFamille: "cuisinieres-4-feux",
    gamme: "elec-gaz-cuisiniere",
    capacites: ["50-l"],
    couleurs: ["gris"],
    subcategory: "4 Feux",
    image:
      "https://images.unsplash.com/photo-1639405069836-f82aa6dcb900?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "50 L",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Cuisinière 4 feux Elec-Gaz — 50 L (réf. REX-GC50GG4-S).",
    features: [],
    color: "gris",
  },
  {
    id: "rex-ob60gg-gs",
    name: "Four encastrable Gaz-Gaz — 60 L",
    slug: "rex-ob60gg-gs",
    reference: "REX-OB60GG-GS",
    category: "cuisson",
    famille: "fours",
    sousFamille: "fours-encastrables",
    gamme: "gaz-gaz",
    capacites: ["60-l"],
    couleurs: [],
    subcategory: "encastrable",
    image:
      "https://images.unsplash.com/photo-1639405069836-f82aa6dcb900?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "60 L",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Four encastrable Gaz-Gaz — 60 L (réf. REX-OB60GG-GS).",
    features: [],
  },
  {
    id: "rex-ob60gg-gl",
    name: "Four encastrable Gaz-Gaz — 60 L",
    slug: "rex-ob60gg-gl",
    reference: "REX-OB60GG-GL",
    category: "cuisson",
    famille: "fours",
    sousFamille: "fours-encastrables",
    gamme: "gaz-gaz",
    capacites: ["60-l"],
    couleurs: [],
    subcategory: "encastrable",
    image:
      "https://images.unsplash.com/photo-1639405069836-f82aa6dcb900?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "60 L",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Four encastrable Gaz-Gaz — 60 L (réf. REX-OB60GG-GL).",
    features: [],
  },
  {
    id: "rex-ob60eg-gs",
    name: "Four encastrable Elec-Gaz — 60 L",
    slug: "rex-ob60eg-gs",
    reference: "REX-OB60EG-GS",
    category: "cuisson",
    famille: "fours",
    sousFamille: "fours-encastrables",
    gamme: "elec-gaz-four",
    capacites: ["60-l"],
    couleurs: [],
    subcategory: "encastrable",
    image:
      "https://images.unsplash.com/photo-1639405069836-f82aa6dcb900?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "60 L",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Four encastrable Elec-Gaz — 60 L (réf. REX-OB60EG-GS).",
    features: [],
  },
  {
    id: "rex-ob60eg-gg",
    name: "Four encastrable Elec-Gaz — 60 L",
    slug: "rex-ob60eg-gg",
    reference: "REX-OB60EG-GG",
    category: "cuisson",
    famille: "fours",
    sousFamille: "fours-encastrables",
    gamme: "elec-gaz-four",
    capacites: ["60-l"],
    couleurs: [],
    subcategory: "encastrable",
    image:
      "https://images.unsplash.com/photo-1639405069836-f82aa6dcb900?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "60 L",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Four encastrable Elec-Gaz — 60 L (réf. REX-OB60EG-GG).",
    features: [],
  },
  {
    id: "rex-ob60fe-gs",
    name: "Four encastrable Elec-Elec — 60 L",
    slug: "rex-ob60fe-gs",
    reference: "REX-OB60FE-GS",
    category: "cuisson",
    famille: "fours",
    sousFamille: "fours-encastrables",
    gamme: "elec-elec",
    capacites: ["60-l"],
    couleurs: [],
    subcategory: "encastrable",
    image:
      "https://images.unsplash.com/photo-1639405069836-f82aa6dcb900?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "60 L",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Four encastrable Elec-Elec — 60 L (réf. REX-OB60FE-GS).",
    features: [],
  },
  {
    id: "rex-ob60fe-gl",
    name: "Four encastrable Elec-Elec — 60 L",
    slug: "rex-ob60fe-gl",
    reference: "REX-OB60FE-GL",
    category: "cuisson",
    famille: "fours",
    sousFamille: "fours-encastrables",
    gamme: "elec-elec",
    capacites: ["60-l"],
    couleurs: [],
    subcategory: "encastrable",
    image:
      "https://images.unsplash.com/photo-1639405069836-f82aa6dcb900?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "60 L",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Four encastrable Elec-Elec — 60 L (réf. REX-OB60FE-GL).",
    features: [],
  },
  {
    id: "rex-chk60x",
    name: "Hotte casquette Inox — 60 cm",
    slug: "rex-chk60x",
    reference: "REX-CHK60X",
    category: "cuisson",
    famille: "hottes",
    sousFamille: "hottes-casquette",
    gamme: "inox-casquette",
    capacites: ["60-cm"],
    couleurs: ["gris"],
    subcategory: "Casquette",
    image:
      "https://images.unsplash.com/photo-1639405069836-f82aa6dcb900?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "60 cm",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Hotte casquette Inox — 60 cm (réf. REX-CHK60X).",
    features: [],
    color: "gris",
  },
  {
    id: "rex-chf60bl",
    name: "Hotte décorative Glass — 60 cm",
    slug: "rex-chf60bl",
    reference: "REX-CHF60BL",
    category: "cuisson",
    famille: "hottes",
    sousFamille: "hottes-decoratives",
    gamme: "glass",
    capacites: ["60-cm"],
    couleurs: ["noir"],
    subcategory: "Decorative",
    image:
      "https://images.unsplash.com/photo-1639405069836-f82aa6dcb900?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "60 cm",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Hotte décorative Glass — 60 cm (réf. REX-CHF60BL).",
    features: [],
    color: "Noir",
  },
  {
    id: "rex-chgs60x",
    name: "Hotte pyramide Inox — 60 cm",
    slug: "rex-chgs60x",
    reference: "REX-CHGS60X",
    category: "cuisson",
    famille: "hottes",
    sousFamille: "hottes-pyramid",
    gamme: "inox-pyramid",
    capacites: ["60-cm"],
    couleurs: ["gris"],
    subcategory: "Pyramid",
    image:
      "https://images.unsplash.com/photo-1639405069836-f82aa6dcb900?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "60 cm",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Hotte pyramide Inox — 60 cm (réf. REX-CHGS60X).",
    features: [],
    color: "gris",
  },
  {
    id: "rex-chcf60x",
    name: "Hotte pyramide Inox — 60 cm",
    slug: "rex-chcf60x",
    reference: "REX-CHCF60X",
    category: "cuisson",
    famille: "hottes",
    sousFamille: "hottes-pyramid",
    gamme: "inox-pyramid",
    capacites: ["60-cm"],
    couleurs: ["gris"],
    subcategory: "Pyramid",
    image:
      "https://images.unsplash.com/photo-1639405069836-f82aa6dcb900?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "60 cm",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Hotte pyramide Inox — 60 cm (réf. REX-CHCF60X).",
    features: [],
    color: "gris",
  },
  {
    id: "rex-m30ag9d-bm",
    name: "Micro-ondes pose libre Digitale — 30 L",
    slug: "rex-m30ag9d-bm",
    reference: "REX-M30AG9D-BM",
    category: "cuisson",
    famille: "micro-ondes",
    sousFamille: "micro-ondes-libre",
    gamme: "digitale-micro-ondes",
    capacites: ["30-l"],
    couleurs: ["noir"],
    subcategory: "libre",
    image:
      "https://images.unsplash.com/photo-1639405069836-f82aa6dcb900?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "30 L",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Micro-ondes pose libre Digitale — 30 L (réf. REX-M30AG9D-BM).",
    features: [],
    color: "Noir",
  },
  {
    id: "rex-m25ag8d-b",
    name: "Micro-ondes pose libre Digitale — 25 L",
    slug: "rex-m25ag8d-b",
    reference: "REX-M25AG8D-B",
    category: "cuisson",
    famille: "micro-ondes",
    sousFamille: "micro-ondes-libre",
    gamme: "digitale-micro-ondes",
    capacites: ["25-l"],
    couleurs: ["noir"],
    subcategory: "libre",
    image:
      "https://images.unsplash.com/photo-1639405069836-f82aa6dcb900?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "25 L",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Micro-ondes pose libre Digitale — 25 L (réf. REX-M25AG8D-B).",
    features: [],
    color: "Noir",
  },
  {
    id: "rex-m20am7d-w",
    name: "Micro-ondes pose libre Digitale — 20 L",
    slug: "rex-m20am7d-w",
    reference: "REX-M20AM7D-W",
    category: "cuisson",
    famille: "micro-ondes",
    sousFamille: "micro-ondes-libre",
    gamme: "digitale-micro-ondes",
    capacites: ["20-l"],
    couleurs: ["blanc"],
    subcategory: "libre",
    image:
      "https://images.unsplash.com/photo-1639405069836-f82aa6dcb900?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "20 L",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Micro-ondes pose libre Digitale — 20 L (réf. REX-M20AM7D-W).",
    features: [],
    color: "Blanc",
  },
  {
    id: "rex-m20mm7d-w",
    name: "Micro-ondes pose libre Mécanique — 20 L",
    slug: "rex-m20mm7d-w",
    reference: "REX-M20MM7D-W",
    category: "cuisson",
    famille: "micro-ondes",
    sousFamille: "micro-ondes-libre",
    gamme: "mecanique-micro-ondes",
    capacites: ["20-l"],
    couleurs: ["blanc"],
    subcategory: "libre",
    image:
      "https://images.unsplash.com/photo-1639405069836-f82aa6dcb900?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "20 L",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Micro-ondes pose libre Mécanique — 20 L (réf. REX-M20MM7D-W).",
    features: [],
    color: "Blanc",
  },
  {
    id: "rex-wm10b714ve",
    name: "Lave-linge frontal Tactile — 10.5 kg",
    slug: "rex-wm10b714ve",
    reference: "REX-WM10B714VE",
    category: "lavage",
    famille: "lave-linge",
    sousFamille: "lave-linge-frontal",
    gamme: "tactile-lave-linge",
    capacites: ["10-5-kg"],
    couleurs: ["gris-fonce"],
    subcategory: "Front",
    image:
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "10.5 kg",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Lave-linge frontal Tactile — 10.5 kg (réf. REX-WM10B714VE).",
    features: [],
    color: "gris fance",
  },
  {
    id: "rex-wm10a214ve",
    name: "Lave-linge frontal Rotative — 10.5 kg",
    slug: "rex-wm10a214ve",
    reference: "REX-WM10A214VE",
    category: "lavage",
    famille: "lave-linge",
    sousFamille: "lave-linge-frontal",
    gamme: "rotative-lave-linge",
    capacites: ["10-5-kg"],
    couleurs: ["gris-fonce"],
    subcategory: "Front",
    image:
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "10.5 kg",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Lave-linge frontal Rotative — 10.5 kg (réf. REX-WM10A214VE).",
    features: [],
    color: "gris fance",
  },
  {
    id: "rex-wm12b714ve",
    name: "Lave-linge frontal Tactile — 12 kg",
    slug: "rex-wm12b714ve",
    reference: "REX-WM12B714VE",
    category: "lavage",
    famille: "lave-linge",
    sousFamille: "lave-linge-frontal",
    gamme: "tactile-lave-linge",
    capacites: ["12-kg"],
    couleurs: ["gris-fonce"],
    subcategory: "Front",
    image:
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "12 kg",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Lave-linge frontal Tactile — 12 kg (réf. REX-WM12B714VE).",
    features: [],
    color: "gris fance",
  },
  {
    id: "rex-wm12a214ve",
    name: "Lave-linge frontal Rotative — 12 kg",
    slug: "rex-wm12a214ve",
    reference: "REX-WM12A214VE",
    category: "lavage",
    famille: "lave-linge",
    sousFamille: "lave-linge-frontal",
    gamme: "rotative-lave-linge",
    capacites: ["12-kg"],
    couleurs: ["gris-fonce"],
    subcategory: "Front",
    image:
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "12 kg",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Lave-linge frontal Rotative — 12 kg (réf. REX-WM12A214VE).",
    features: [],
    color: "gris fance",
  },
  {
    id: "rex-dw15-b",
    name: "Lave-vaisselle pose libre Digitale — 15 couverts",
    slug: "rex-dw15-b",
    reference: "REX-DW15-B",
    category: "lavage",
    famille: "lave-vaisselle",
    sousFamille: "lave-vaisselle-pose-libre",
    gamme: "digitale-lave-vaisselle",
    capacites: ["15-couverts"],
    couleurs: ["blanc"],
    subcategory: "Pose libre",
    image:
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "15 couverts",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Lave-vaisselle pose libre Digitale — 15 couverts (réf. REX-DW15-B).",
    features: [],
    color: "Blanc",
  },
  {
    id: "rex-dw15-s",
    name: "Lave-vaisselle pose libre Digitale — 15 couverts",
    slug: "rex-dw15-s",
    reference: "REX-DW15-S",
    category: "lavage",
    famille: "lave-vaisselle",
    sousFamille: "lave-vaisselle-pose-libre",
    gamme: "digitale-lave-vaisselle",
    capacites: ["15-couverts"],
    couleurs: ["gris"],
    subcategory: "Pose libre",
    image:
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "15 couverts",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Lave-vaisselle pose libre Digitale — 15 couverts (réf. REX-DW15-S).",
    features: [],
    color: "gris",
  },
  {
    id: "rex-cm5386",
    name: "Cafetière multi Poudre + capsules — Noir",
    slug: "rex-cm5386",
    reference: "REX-CM5386",
    category: "petit-electromenager",
    famille: "cafetieres",
    sousFamille: "cafetieres-multi",
    gamme: "poudre-caps",
    capacites: [],
    couleurs: ["noir"],
    subcategory: "multi",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=700&fit=crop&auto=format",
    badges: [],
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Cafetière multi Poudre + capsules — Noir (réf. REX-CM5386).",
    features: [],
    color: "Noir",
  },
  {
    id: "rex-cm5670",
    name: "Cafetière multi Poudre + capsules — Noir",
    slug: "rex-cm5670",
    reference: "REX-CM5670",
    category: "petit-electromenager",
    famille: "cafetieres",
    sousFamille: "cafetieres-multi",
    gamme: "poudre-caps",
    capacites: [],
    couleurs: ["noir"],
    subcategory: "multi",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=700&fit=crop&auto=format",
    badges: [],
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Cafetière multi Poudre + capsules — Noir (réf. REX-CM5670).",
    features: [],
    color: "Noir",
  },
  {
    id: "rex-sm3068",
    name: "Pétrin mono Rotative — 8 L",
    slug: "rex-sm3068",
    reference: "REX-SM3068",
    category: "petit-electromenager",
    famille: "petrins",
    sousFamille: "petrins-mono",
    gamme: "rotative-petrins",
    capacites: ["8-l"],
    couleurs: ["gris"],
    subcategory: "Mono",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "8 L",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Pétrin mono Rotative — 8 L (réf. REX-SM3068).",
    features: [],
    color: "gris",
  },
  {
    id: "rex-sm3068g",
    name: "Pétrin mono Digitale — 8 L",
    slug: "rex-sm3068g",
    reference: "REX-SM3068G",
    category: "petit-electromenager",
    famille: "petrins",
    sousFamille: "petrins-mono",
    gamme: "digitale-petrins",
    capacites: ["8-l"],
    couleurs: ["gris"],
    subcategory: "Mono",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "8 L",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Pétrin mono Digitale — 8 L (réf. REX-SM3068G).",
    features: [],
    color: "gris",
  },
  {
    id: "rex-sm3068a",
    name: "Pétrin multi Rotative — 8 L",
    slug: "rex-sm3068a",
    reference: "REX-SM3068A",
    category: "petit-electromenager",
    famille: "petrins",
    sousFamille: "petrins-multi",
    gamme: "rotative-petrins-multi",
    capacites: ["8-l"],
    couleurs: ["gris"],
    subcategory: "Multi",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "8 L",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Pétrin multi Rotative — 8 L (réf. REX-SM3068A).",
    features: [],
    color: "gris",
  },
  {
    id: "rex-ewh-d30",
    name: "Cumulus électrique Elec — 30 L",
    slug: "rex-ewh-d30",
    reference: "REX-EWH-D30",
    category: "chauffe-eau",
    famille: "cumulus",
    sousFamille: "cumulus-electrique",
    gamme: "elec",
    capacites: ["30-l"],
    couleurs: ["blanc"],
    subcategory: "ELEC",
    image:
      "https://images.unsplash.com/photo-1586208958839-06c17cacdf08?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "30 L",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Cumulus électrique Elec — 30 L (réf. REX-EWH-D30).",
    features: [],
    color: "blanc",
  },
  {
    id: "rex-ewh-d50",
    name: "Cumulus électrique Elec — 50 L",
    slug: "rex-ewh-d50",
    reference: "REX-EWH-D50",
    category: "chauffe-eau",
    famille: "cumulus",
    sousFamille: "cumulus-electrique",
    gamme: "elec",
    capacites: ["50-l"],
    couleurs: ["blanc"],
    subcategory: "ELEC",
    image:
      "https://images.unsplash.com/photo-1586208958839-06c17cacdf08?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "50 L",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Cumulus électrique Elec — 50 L (réf. REX-EWH-D50).",
    features: [],
    color: "blanc",
  },
  {
    id: "rex-ewh-d85",
    name: "Cumulus électrique Elec — 85 L",
    slug: "rex-ewh-d85",
    reference: "REX-EWH-D85",
    category: "chauffe-eau",
    famille: "cumulus",
    sousFamille: "cumulus-electrique",
    gamme: "elec",
    capacites: ["85-l"],
    couleurs: ["blanc"],
    subcategory: "ELEC",
    image:
      "https://images.unsplash.com/photo-1586208958839-06c17cacdf08?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "85 L",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Cumulus électrique Elec — 85 L (réf. REX-EWH-D85).",
    features: [],
    color: "blanc",
  },
  {
    id: "rex-gwh-d30",
    name: "Chauffe-bain gaz — 30 L",
    slug: "rex-gwh-d30",
    reference: "REX-GWH-D30",
    category: "chauffe-eau",
    famille: "chauffe-bain",
    sousFamille: "chauffe-bain-gaz",
    gamme: "gaz",
    capacites: ["30-l"],
    couleurs: ["blanc"],
    subcategory: "GAZ",
    image:
      "https://images.unsplash.com/photo-1586208958839-06c17cacdf08?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "30 L",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Chauffe-bain gaz — 30 L (réf. REX-GWH-D30).",
    features: [],
    color: "blanc",
  },
  {
    id: "rex-gwh-d50",
    name: "Chauffe-bain gaz — 50 L",
    slug: "rex-gwh-d50",
    reference: "REX-GWH-D50",
    category: "chauffe-eau",
    famille: "chauffe-bain",
    sousFamille: "chauffe-bain-gaz",
    gamme: "gaz",
    capacites: ["50-l"],
    couleurs: ["blanc"],
    subcategory: "GAZ",
    image:
      "https://images.unsplash.com/photo-1586208958839-06c17cacdf08?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "50 L",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Chauffe-bain gaz — 50 L (réf. REX-GWH-D50).",
    features: [],
    color: "blanc",
  },
  {
    id: "tb321-80l",
    name: "Aspirateur professionnel — 80 L",
    slug: "tb321-80l",
    reference: "TB321-80L",
    category: "entretien-maison",
    famille: "aspirateurs",
    sousFamille: "aspirateurs-professionnels",
    capacites: ["80-l"],
    couleurs: ["noir-jaune"],
    subcategory: "Aspirateur professionnel",
    image:
      "https://images.unsplash.com/photo-1519558260268-cde7e03a0152?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "80 L",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Aspirateur professionnel — 80 L (réf. TB321-80L).",
    features: [],
    color: "noir et jaune",
  },
  {
    id: "tb321-100l",
    name: "Aspirateur professionnel — 100 L",
    slug: "tb321-100l",
    reference: "TB321-100L",
    category: "entretien-maison",
    famille: "aspirateurs",
    sousFamille: "aspirateurs-professionnels",
    capacites: ["100-l"],
    couleurs: ["noir-jaune"],
    subcategory: "Aspirateur professionnel",
    image:
      "https://images.unsplash.com/photo-1519558260268-cde7e03a0152?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "100 L",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Aspirateur professionnel — 100 L (réf. TB321-100L).",
    features: [],
    color: "noir et jaune",
  },
  {
    id: "hjw-1601",
    name: "Aspirateur poussière Sans sac — 1400 W",
    slug: "hjw-1601",
    reference: "HJW-1601",
    category: "entretien-maison",
    famille: "aspirateurs",
    sousFamille: "aspirateurs-poussiere",
    gamme: "sans-sac",
    capacites: ["1400-w"],
    couleurs: ["noir-rouge"],
    subcategory: "Aspirateur poussière",
    image:
      "https://images.unsplash.com/photo-1519558260268-cde7e03a0152?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "1400 W",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Aspirateur poussière Sans sac — 1400 W (réf. HJW-1601).",
    features: [],
    color: "noir et rouge",
  },
  {
    id: "hjx-2202",
    name: "Aspirateur poussière Sans sac — 2000 W",
    slug: "hjx-2202",
    reference: "HJX-2202",
    category: "entretien-maison",
    famille: "aspirateurs",
    sousFamille: "aspirateurs-poussiere",
    gamme: "sans-sac",
    capacites: ["2000-w"],
    couleurs: ["noir-rouge"],
    subcategory: "Aspirateur poussière",
    image:
      "https://images.unsplash.com/photo-1519558260268-cde7e03a0152?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "2000 W",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Aspirateur poussière Sans sac — 2000 W (réf. HJX-2202).",
    features: [],
    color: "noir et rouge",
  },
  {
    id: "hjw-1703",
    name: "Aspirateur poussière Avec sac — 1200 W",
    slug: "hjw-1703",
    reference: "HJW-1703",
    category: "entretien-maison",
    famille: "aspirateurs",
    sousFamille: "aspirateurs-poussiere",
    gamme: "avec-sac",
    capacites: ["1200-w"],
    couleurs: ["noir-rouge"],
    subcategory: "Aspirateur poussière",
    image:
      "https://images.unsplash.com/photo-1519558260268-cde7e03a0152?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "1200 W",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Aspirateur poussière Avec sac — 1200 W (réf. HJW-1703).",
    features: [],
    color: "noir et rouge",
  },
  {
    id: "hjc-1903",
    name: "Aspirateur Bali Sans fil — 120 W",
    slug: "hjc-1903",
    reference: "HJC-1903",
    category: "entretien-maison",
    famille: "aspirateurs",
    sousFamille: "aspirateurs-bali",
    gamme: "sans-fil",
    capacites: ["120-w"],
    couleurs: ["noir-rouge"],
    subcategory: "Aspirateur Bali",
    image:
      "https://images.unsplash.com/photo-1519558260268-cde7e03a0152?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "120 W",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Aspirateur Bali Sans fil — 120 W (réf. HJC-1903).",
    features: [],
    color: "noir et rouge",
  },
  {
    id: "800",
    name: "Fontaine mécanique — 500 W",
    slug: "800",
    reference: "800",
    category: "fontaines",
    famille: "fontaines-eau",
    sousFamille: "fontaines-mecanique",
    gamme: "mecanique",
    capacites: ["500-w"],
    couleurs: ["blanc-noir"],
    subcategory: "Mécanique",
    image:
      "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "500W",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Fontaine mécanique — 500 W (réf. 800).",
    features: [],
    color: "blanc et noir",
  },
  {
    id: "802",
    name: "Fontaine mécanique — 500 W",
    slug: "802",
    reference: "802",
    category: "fontaines",
    famille: "fontaines-eau",
    sousFamille: "fontaines-mecanique",
    gamme: "mecanique",
    capacites: ["500-w"],
    couleurs: ["blanc-gris"],
    subcategory: "Mécanique",
    image:
      "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "500W",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Fontaine mécanique — 500 W (réf. 802).",
    features: [],
    color: "blanc et gris",
  },
  {
    id: "802-2",
    name: "Fontaine digitale — 500 W",
    slug: "802-2",
    reference: "802",
    category: "fontaines",
    famille: "fontaines-eau",
    sousFamille: "fontaines-digital",
    gamme: "digitale",
    capacites: ["500-w"],
    couleurs: ["gris"],
    subcategory: "Digital",
    image:
      "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "500W",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Fontaine digitale — 500 W (réf. 802).",
    features: [],
    color: "gris",
  },
  {
    id: "168",
    name: "Fontaine mécanique — 500 W",
    slug: "168",
    reference: "168",
    category: "fontaines",
    famille: "fontaines-eau",
    sousFamille: "fontaines-mecanique",
    gamme: "mecanique",
    capacites: ["500-w"],
    couleurs: ["blanc"],
    subcategory: "Mécanique",
    image:
      "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=600&h=700&fit=crop&auto=format",
    badges: [],
    capacity: "500W",
    energyClass: "A",
    connectivity: false,
    technologies: [],
    description: "Fontaine mécanique — 500 W (réf. 168).",
    features: [],
    color: "Blanc",
  },
]

const defaultTechnologies: Technology[] = [
  {
    id: "smart-connect",
    name: "SmartConnect",
    icon: "⟳",
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=600&fit=crop&auto=format",
    benefit: "Contrôlez vos appareils depuis votre smartphone",
    description:
      "AUREX SmartConnect est notre plateforme de connectivité qui permet de piloter, programmer et surveiller tous vos appareils compatibles depuis l'application AUREX, où que vous soyez.",
    category: "Connectivité",
    compatibleCategories: [
      "lavage",
      "refrigerateurs",
      "climatisation",
      "traitement-air",
    ],
  },
  {
    id: "eco-wash",
    name: "EcoWash",
    icon: "◈",
    image:
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&h=600&fit=crop&auto=format",
    benefit: "Jusqu'à 40 % d'économies d'énergie",
    description:
      "EcoWash est notre technologie de lavage à froid brevetée. En analysant le type et la quantité de linge, elle adapte la durée et la température du programme pour minimiser la consommation d'énergie et d'eau.",
    category: "Éco-efficacité",
    compatibleCategories: ["lavage"],
  },
  {
    id: "steam-care",
    name: "SteamCare",
    icon: "◇",
    image:
      "https://images.unsplash.com/photo-1604335398980-ededcadcc37d?w=800&h=600&fit=crop&auto=format",
    benefit: "Désinfection vapeur sans produits chimiques",
    description:
      "SteamCare utilise la vapeur pour éliminer les bactéries et allergènes sans produits chimiques. Idéal pour les textiles sensibles et les vêtements de bébé.",
    category: "Hygiène",
    compatibleCategories: ["lavage"],
  },
  {
    id: "fresh-cool",
    name: "FreshCool",
    icon: "❄",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop&auto=format",
    benefit: "Conservation optimale des aliments",
    description:
      "FreshCool maintient une humidité idéale dans chaque zone du réfrigérateur. Les fruits et légumes restent frais jusqu'à 3 fois plus longtemps par rapport aux réfrigérateurs classiques.",
    category: "Conservation",
    compatibleCategories: ["refrigerateurs"],
  },
  {
    id: "inverter-plus",
    name: "InverterPlus",
    icon: "◉",
    image:
      "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=800&h=600&fit=crop&auto=format",
    benefit: "60 % d'économies d'énergie",
    description:
      "La technologie InverterPlus module en permanence la puissance du compresseur pour maintenir une température stable. Le compresseur ne s'arrête jamais brutalement, ce qui réduit les à-coups électriques et prolonge la durée de vie.",
    category: "Éco-efficacité",
    compatibleCategories: ["climatisation"],
  },
  {
    id: "aqua-save",
    name: "AquaSave",
    icon: "◌",
    image:
      "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&h=600&fit=crop&auto=format",
    benefit: "Jusqu'à 50 % d'eau économisée",
    description:
      "AquaSave recycle l'eau de rinçage pour le prochain cycle de lavage. Couplé à un capteur de turbidité, le système n'utilise que la quantité d'eau strictement nécessaire.",
    category: "Éco-efficacité",
    compatibleCategories: ["lave-vaisselle"],
  },
]

const defaultNewsItems = [
  {
    id: "launch-ex9000",
    title:
      "AUREX lance la série EX9000 Smart — l'électroménager connecté nouvelle génération",
    excerpt:
      "La nouvelle gamme EX9000 intègre des fonctionnalités IA inédites pour anticiper vos besoins et optimiser votre consommation d'énergie.",
    date: "15 août 2026",
    category: "Lancement produit",
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=500&fit=crop&auto=format",
    slug: "lancement-ex9000",
  },
  {
    id: "award-2026",
    title: "AUREX remporte le prix de l'Innovation à l'Algerian Tech Expo 2026",
    excerpt:
      "Notre technologie InverterPlus appliquée à la climatisation a été récompensée pour ses performances énergétiques exceptionnelles.",
    date: "3 juillet 2026",
    category: "Récompense",
    image:
      "https://images.unsplash.com/photo-1639405069836-f82aa6dcb900?w=800&h=500&fit=crop&auto=format",
    slug: "prix-innovation-2026",
  },
  {
    id: "service-centers",
    title: "AUREX ouvre 12 nouveaux centres de service agréés en Algérie",
    excerpt:
      "En réponse à la croissance de notre parc installé, AUREX renforce son réseau SAV national avec 12 nouveaux centres dans les wilayas prioritaires.",
    date: "20 juin 2026",
    category: "SAV",
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=500&fit=crop&auto=format",
    slug: "nouveaux-centres-sav",
  },
]

const defaultFaqItems = [
  {
    q: "Comment enregistrer mon produit AUREX pour la garantie ?",
    a: "Rendez-vous sur le formulaire d'enregistrement dans la section Support de notre site. Munissez-vous de votre numéro de série (au dos ou en dessous de l'appareil) et de votre preuve d'achat.",
  },
  {
    q: "Quelle est la durée de la garantie sur mes produits AUREX ?",
    a: "AUREX offre une garantie standard de 2 ans sur tous les produits, extensible à 5 ans sur le compresseur des réfrigérateurs et climatiseurs, et 10 ans sur le moteur Inverter des lave-linge.",
  },
  {
    q: "Comment télécharger la notice d'utilisation de mon appareil ?",
    a: "Accédez à la section Support > Notices, saisissez la référence de votre produit (ex. EX-WM-9000-60-SB) ou scannez le QR code présent sur l'appareil.",
  },
  {
    q: "L'application AUREX est-elle disponible sur iOS et Android ?",
    a: "Oui, l'application AUREX Connect est disponible gratuitement sur l'App Store et Google Play. Elle est compatible avec tous les appareils AUREX portant le label SmartConnect.",
  },
  {
    q: "Comment trouver un technicien agréé AUREX près de chez moi ?",
    a: "Utilisez le localisateur de service dans la section Support > Assistance. Entrez votre wilaya pour afficher les centres de service agréés avec leurs coordonnées et horaires.",
  },
  {
    q: "Comment commander des pièces détachées d'origine AUREX ?",
    a: "Les pièces d'origine AUREX sont disponibles auprès de nos centres de service agréés et de nos distributeurs partenaires. Vous pouvez aussi soumettre une demande via Support > Pièces détachées.",
  },
]

function loadManagedCollection<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const stored = window.localStorage.getItem(`aurex-data-${key}`)
    return stored ? (JSON.parse(stored) as T) : fallback
  } catch {
    return fallback
  }
}

function normalizeCategories(value: unknown): Category[] {
  if (!Array.isArray(value)) return defaultCategories
  return value.filter((item): item is Category => Boolean(item && typeof item === "object")).map((item) => ({
    ...item,
    slug: String(item.slug ?? "").toLowerCase().trim(),
    subcategories: Array.isArray(item.subcategories) ? item.subcategories : [],
  }))
}

function normalizeProducts(value: unknown): Product[] {
  if (!Array.isArray(value)) return defaultProducts
  return value.filter((item): item is Product => Boolean(item && typeof item === "object")).map((item) => {
    const raw = item as unknown as Record<string, unknown>
    // Le CMS enregistre `category_slug` (format Supabase) : le mapper vers `category`
    // en minuscules pour que le filtrage par slug d'URL fonctionne toujours.
    const slug = String(raw.category ?? raw.category_slug ?? "").toLowerCase().trim()
    const asStrArray = (v: unknown): string[] | undefined =>
      Array.isArray(v) ? v.map((x) => String(x)).filter(Boolean) : undefined
    const strOrUndef = (v: unknown): string | undefined =>
      typeof v === "string" && v ? v : undefined
    return {
      ...item,
      id: String(item.id ?? ""),
      category: slug,
      // Champs taxonomiques (nouveau modèle + variantes snake_case Supabase).
      famille: strOrUndef(raw.famille ?? raw.famille_id) ?? item.famille,
      sousFamille: strOrUndef(raw.sousFamille ?? raw.sous_famille ?? raw.sous_famille_id) ?? item.sousFamille,
      gamme: strOrUndef(raw.gamme ?? raw.gamme_id) ?? item.gamme,
      capacites: asStrArray(raw.capacites) ?? item.capacites,
      couleurs: asStrArray(raw.couleurs) ?? item.couleurs,
      slug: strOrUndef(raw.slug) ?? item.slug,
      badges: Array.isArray(item.badges) ? item.badges : [],
      technologies: Array.isArray(item.technologies) ? item.technologies : [],
      features: Array.isArray(item.features) ? item.features : [],
      images: Array.isArray(item.images) && item.images.length > 0 ? item.images : [item.image].filter(Boolean),
    }
  })
}

function normalizeTechnologies(value: unknown): Technology[] {
  if (!Array.isArray(value)) return defaultTechnologies
  return value.filter((item): item is Technology => Boolean(item && typeof item === "object")).map((item) => {
    const raw = item as unknown as Record<string, unknown>
    const compat = Array.isArray(item.compatibleCategories)
      ? item.compatibleCategories
      : Array.isArray(raw.compatible_categories)
        ? (raw.compatible_categories as string[])
        : []
    return { ...item, compatibleCategories: compat }
  })
}

function normalizeArray<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? value : fallback
}

function normalizeNews<T extends Record<string, unknown>>(value: unknown, fallback: T[]): T[] {
  if (!Array.isArray(value)) return fallback
  return value
    .filter((item): item is T => Boolean(item && typeof item === "object"))
    .map((item) => ({
      ...item,
      // Le CMS enregistre `published_at` (format Supabase) : le mapper vers `date` du front.
      date: item.date ?? item.published_at ?? "",
    }))
}

/** Normalise une collection taxonomique (slugs minuscules, variantes snake_case). */
function normalizeTaxonomy<T extends { slug: string }>(value: unknown, fallback: T[]): T[] {
  if (!Array.isArray(value)) return fallback
  const pick = (raw: Record<string, unknown>, ...keys: string[]): unknown => {
    for (const k of keys) if (raw[k] !== undefined && raw[k] !== null && raw[k] !== "") return raw[k]
    return undefined
  }
  const items = value
    .filter((item): item is T => Boolean(item && typeof item === "object"))
    .map((item) => {
      const raw = { ...(item as unknown as Record<string, unknown>) }
      raw.slug = String(raw.slug ?? "").toLowerCase().trim()
      // Clés parentes toujours définies ("" si absentes) pour des comparaisons sûres.
      raw.categorySlug = String(pick(raw, "categorySlug", "category_slug", "category_id") ?? "").toLowerCase().trim()
      raw.familleSlug = String(pick(raw, "familleSlug", "famille_id") ?? "").toLowerCase().trim()
      raw.sousFamilleSlug = String(pick(raw, "sousFamilleSlug", "sous_famille", "sous_famille_id") ?? "").toLowerCase().trim()
      return raw as unknown as T
    })
    .filter((item) => Boolean(item.slug))
  return items.length > 0 ? items : fallback
}

export const categories: Category[] = normalizeCategories(loadManagedCollection("categories", defaultCategories))
export const products: Product[] = normalizeProducts(loadManagedCollection("products", defaultProducts))
export const familles: Famille[] = normalizeTaxonomy(loadManagedCollection("familles", defaultFamilles), defaultFamilles)
export const sousFamilles: SousFamille[] = normalizeTaxonomy(loadManagedCollection("sousFamilles", defaultSousFamilles), defaultSousFamilles)
export const gammes: Gamme[] = normalizeTaxonomy(loadManagedCollection("gammes", defaultGammes), defaultGammes)
export const capacites: Capacite[] = normalizeTaxonomy(loadManagedCollection("capacites", defaultCapacites), defaultCapacites)
export const couleurs: Couleur[] = normalizeTaxonomy(loadManagedCollection("couleurs", defaultCouleurs), defaultCouleurs)
export const technologies: Technology[] = normalizeTechnologies(loadManagedCollection("technologies", defaultTechnologies))
export const newsItems = normalizeNews(loadManagedCollection("news", defaultNewsItems), defaultNewsItems)
export const faqItems = normalizeArray(loadManagedCollection("faq", defaultFaqItems), defaultFaqItems)

/* ---------------- Helpers taxonomiques liés aux collections chargées ---------------- */

export type { Famille, SousFamille, Gamme, Capacite, Couleur }
export { productSlugOf } from "../lib/taxonomy"
export type { TaxoValue } from "../lib/taxonomy"

export function productFamille(p: Product): Famille | undefined {
  return resolveFamille(p, familles)
}

export function productSousFamille(p: Product): SousFamille | undefined {
  return resolveSousFamille(p, sousFamilles)
}

export function productGamme(p: Product): Gamme | undefined {
  return resolveGamme(p, gammes)
}

export function productCapacites(p: Product) {
  return resolveCapacites(p, capacites)
}

export function productCouleurs(p: Product) {
  return resolveCouleurs(p, couleurs)
}

/** Libellé de catégorie (résolu, avec repli legacy). */
export function categoryLabelOf(categorySlug: string): string {
  const wanted = String(categorySlug ?? "").toLowerCase()
  const found = categories.find((c) => String(c.slug ?? "").toLowerCase() === wanted)
  return found ? ml(found.label) : String(categorySlug ?? "")
}

/** URL canonique d'un produit : hiérarchique si complète, sinon legacy. */
export function productUrl(p: Product): string {
  const catSlug = String(p.category ?? "").toLowerCase()
  const fam = productFamille(p)
  const sfam = productSousFamille(p)
  const gamme = productGamme(p)
  // Cohérence hiérarchique : la famille doit appartenir à la catégorie du produit.
  const coherentFam =
    fam && String(fam.categorySlug ?? "").toLowerCase() === catSlug ? fam : undefined
  const coherentSfam =
    sfam &&
    coherentFam &&
    String(sfam.familleSlug ?? "").toLowerCase() === String(coherentFam.slug ?? "").toLowerCase()
      ? sfam
      : undefined
  const coherentGamme =
    gamme &&
    coherentSfam &&
    String(gamme.sousFamilleSlug ?? "").toLowerCase() ===
      String(coherentSfam.slug ?? "").toLowerCase()
      ? gamme
      : undefined
  return productPath(p, {
    categorySlug: p.category,
    famille: coherentFam?.slug,
    sousFamille: coherentSfam?.slug,
    gamme: coherentGamme?.slug,
  })
}

/** Retrouve un produit par id, slug explicite ou slug dérivé du nom. */
export function findProduct(slugOrId: string | undefined): Product | undefined {
  if (!slugOrId) return undefined
  const s = decodeURIComponent(slugOrId).toLowerCase().trim()
  return (
    products.find((p) => String(p.id ?? "").toLowerCase() === s) ??
    products.find((p) => productSlugOf(p).toLowerCase() === s)
  )
}
