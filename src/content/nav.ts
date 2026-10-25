import type { L3 } from "./lang"

/** Navigation principale (website brief 2026) :
 *  À propos → Produits → Smart Tech → Nouveautés → Support. */
export const navItems = [
  { key: "about", href: "/a-propos", hasMega: false },
  { key: "products", href: "/produits", hasMega: true },
  { key: "smartTech", href: "/smart-tech", hasMega: false },
  { key: "news", href: "/actualites", hasMega: false },
  { key: "support", href: "/support", hasMega: false },
] as const

export type NavKey = (typeof navItems)[number]["key"]

export const navLabels: Record<NavKey, L3> = {
  about: { fr: "À propos", en: "About", ar: "من نحن" },
  products: { fr: "Produits", en: "Products", ar: "المنتجات" },
  smartTech: { fr: "Smart Tech", en: "Smart Tech", ar: "Smart Tech" },
  news: { fr: "Nouveautés", en: "What's New", ar: "جديدنا" },
  support: { fr: "Support", en: "Support", ar: "الدعم" },
}

export const navDetails: Record<Exclude<NavKey, "products">, { title: L3; description: L3; action: L3 }> = {
  about: {
    title: { fr: "Inspirés par notre réalité.", en: "Inspired by our reality.", ar: "مستوحاة من واقعنا." },
    description: {
      fr: "Découvrez la marque AUREX, sa vision, ses engagements et sa compréhension du foyer algérien.",
      en: "Discover the AUREX brand, its vision, its commitments and its understanding of the Algerian home.",
      ar: "اكتشفوا علامة AUREX ورؤيتها والتزاماتها وفهمها للبيت الجزائري.",
    },
    action: { fr: "Découvrir AUREX", en: "Discover AUREX", ar: "اكتشفوا AUREX" },
  },
  smartTech: {
    title: { fr: "Smart Tech — contrôle d'un seul geste.", en: "Smart Tech — One Touch Control.", ar: "Smart Tech — تحكّم بلمسة واحدة." },
    description: {
      fr: "Des appareils connectés en Wi-Fi et Bluetooth, pilotables depuis votre smartphone selon leurs fonctions disponibles.",
      en: "Wi-Fi and Bluetooth connected appliances you can manage from your smartphone, depending on their available functions.",
      ar: "أجهزة متصلة عبر Wi-Fi وBluetooth يمكن التحكم بها من هاتفكم بحسب الوظائف المتاحة.",
    },
    action: { fr: "Explorer Smart Tech", en: "Explore Smart Tech", ar: "استكشفوا Smart Tech" },
  },
  news: {
    title: { fr: "Chaque détail a une raison d'être.", en: "Every Detail Has a Purpose.", ar: "لكل تفصيل غاية." },
    description: {
      fr: "Lancements, nouveaux modèles et mises en avant éditoriales : découvrez ce qui est nouveau chez AUREX.",
      en: "Launches, new models and editorial highlights: discover what's new at AUREX.",
      ar: "إطلاقات ونماذج جديدة ومقالات مميّزة: اكتشفوا جديد AUREX.",
    },
    action: { fr: "Explorer les actualités", en: "Explore the news", ar: "تصفّحوا الأخبار" },
  },
  support: {
    title: { fr: "Espace Clients & SAV", en: "Customer Space & After-Sales", ar: "فضاء الزبائن وخدمة ما بعد البيع" },
    description: {
      fr: "Garantie, notices, pièces détachées, maintenance et contact : nous vous accompagnons pas à pas.",
      en: "Warranty, manuals, spare parts, maintenance and contact: we are with you step by step.",
      ar: "الضمان والأدلة وقطع الغيار والصيانة والتواصل: نرافقكم خطوة بخطوة.",
    },
    action: { fr: "Obtenir de l'aide", en: "Get support", ar: "احصلوا على المساعدة" },
  },
}

/** Colonne latérale du méga-menu Produits (à la place de « Smart Home »). */
export const productsSide = {
  lineup: {
    title: { fr: "Product Line-Up 2026", en: "Product Line-Up 2026", ar: "تشكيلة منتجات 2026" } as L3,
    text: {
      fr: "Explorez notre sélection de produits AUREX",
      en: "Explore our selection of AUREX products",
      ar: "استكشفوا تشكيلتنا المختارة من منتجات AUREX",
    } as L3,
    href: "/produits",
  },
  compare: { label: { fr: "Comparateur", en: "Compare", ar: "المقارنة" } as L3, href: "/comparateur" },
  notices: { label: { fr: "Notices & SAV", en: "Manuals & After-Sales", ar: "الأدلة وخدمة ما بعد البيع" } as L3, href: "/support" },
}

export const megaLabels = {
  categories: { fr: "Catégories de produits", en: "Product categories", ar: "فئات المنتجات" } as L3,
  seeAll: { fr: "Voir tous nos produits", en: "See all our products", ar: "عرض كل منتجاتنا" } as L3,
  featured: { fr: "À la une", en: "Featured", ar: "الأبرز" } as L3,
}
