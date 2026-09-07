export interface Product {
  id: string
  name: string
  reference: string
  category: string
  subcategory?: string
  image: string
  images?: string[]
  price?: number
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

export const categories: Category[] = [
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

export const products: Product[] = [
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
    price: 89900,
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
    price: 124900,
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
    price: 64900,
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
    price: 67500,
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
    price: 58900,
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
    price: 79900,
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
    price: 32900,
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
]

export const technologies: Technology[] = [
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

export const newsItems = [
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

export const faqItems = [
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
