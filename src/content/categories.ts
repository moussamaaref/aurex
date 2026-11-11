import type { L3 } from "./lang"

/** Les 4 familles officielles AUREX (AUREX Web Site Brief final). */
export interface CategoryContent {
  slug: string
  num: string
  name: L3
  /** Accroche marketing (carte catégorie). */
  highlight: L3
  /** CTA de la carte catégorie. */
  cta: L3
  /** Objectif de communication (page catégorie). */
  objective: L3
  /** Gamme de produits couverte. */
  range: L3<string[]>
  image: string
}

export const categoryContent: CategoryContent[] = [
  {
    slug: "cuisine-encastrable",
    num: "01",
    name: { fr: "Cuisine & Encastrable", en: "Kitchen & Built-in", ar: "المطبخ والأجهزة المدمجة" },
    highlight: { fr: "Pensés pour votre façon de cuisiner.", en: "Made for the way you cook.", ar: "مصمّمة لطريقتك في الطهي." },
    cta: {
      fr: "Équipez votre cuisine pour un confort durable",
      en: "Equip your kitchen for lasting comfort",
      ar: "جهّزوا مطبخكم لراحة تدوم",
    },
    objective: {
      fr: "Présenter les appareils de cuisson AUREX comme des solutions pratiques, pensées autour des habitudes culinaires quotidiennes et des besoins de la cuisine moderne.",
      en: "Present AUREX cooking appliances as practical solutions designed around everyday cooking habits and the needs of the modern kitchen.",
      ar: "تقديم أجهزة الطهي من AUREX كحلول عملية مصمّمة حول عادات الطهي اليومية واحتياجات المطبخ العصري.",
    },
    range: {
      fr: ["Plaques de cuisson", "Hottes", "Cuisinières", "Micro-ondes", "Fours en pose libre"],
      en: ["Hobs", "Cooker hoods", "Cookers", "Microwaves", "Freestanding ovens"],
      ar: ["مواقد الطهي", "شفّاطات", "طباخات", "أفران ميكروويف", "أفران قائمة بذاتها"],
    },
    image: "https://images.unsplash.com/photo-1586208958839-06c17cacdf08?w=800&h=900&fit=crop&auto=format",
  },
  {
    slug: "lavage-entretien",
    num: "02",
    name: { fr: "Lavage & Entretien", en: "Laundry & Home Care", ar: "الغسيل والصيانة" },
    highlight: { fr: "Conçus autour de vos besoins du quotidien.", en: "Built around your everyday needs.", ar: "مبنية حول احتياجاتك اليومية." },
    cta: {
      fr: "Offrez à votre maison le soin qu'elle mérite",
      en: "Give Your Home the Care It Deserves",
      ar: "امنحوا بيتكم العناية التي يستحقها",
    },
    objective: {
      fr: "Valoriser le rôle des appareils AUREX pour simplifier les tâches ménagères récurrentes et accompagner l'entretien de la maison au quotidien.",
      en: "Highlight the role of AUREX appliances in simplifying recurring household tasks and supporting everyday home care.",
      ar: "إبراز دور أجهزة AUREX في تبسيط المهام المنزلية المتكرّرة ودعم العناية اليومية بالمنزل.",
    },
    range: {
      fr: ["Lave-linge", "Lave-vaisselle", "Défroisseurs vapeur", "Aspirateurs"],
      en: ["Washing machines", "Dishwashers", "Steam garment steamers", "Vacuum cleaners"],
      ar: ["غسّالات الملابس", "غسّالات الأطباق", "مكاوي البخار العمودية", "مكانس كهربائية"],
    },
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&h=900&fit=crop&auto=format",
  },
  {
    slug: "eau-confort",
    num: "03",
    name: { fr: "Eau & Confort", en: "Water & Comfort", ar: "الماء والراحة" },
    highlight: { fr: "Les indispensables du quotidien, rendus pratiques.", en: "Everyday essentials, made practical.", ar: "أساسيات الحياة اليومية، بكل عملية." },
    cta: { fr: "Des solutions de confort pour toutes les saisons", en: "All-Season Comfort Solutions", ar: "حلول راحة لكل الفصول" },
    objective: {
      fr: "Présenter les appareils liés à l'eau comme des indispensables domestiques pratiques qui répondent aux besoins de tous les jours.",
      en: "Present water-related appliances as practical household essentials that respond to everyday needs.",
      ar: "تقديم الأجهزة المرتبطة بالماء كضروريات منزلية عملية تلبّي الاحتياجات اليومية.",
    },
    range: {
      fr: ["Distributeurs d'eau", "Chauffe-eau"],
      en: ["Water dispensers", "Water heaters"],
      ar: ["موزّعات المياه", "سخّانات المياه"],
    },
    image: "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=800&h=900&fit=crop&auto=format",
  },
  {
    slug: "petit-electromenager",
    num: "04",
    name: { fr: "Petit Électroménager", en: "Small Appliances", ar: "الأجهزة الصغيرة" },
    highlight: { fr: "Les petits détails qui font la différence.", en: "Little things that make a difference", ar: "التفاصيل الصغيرة التي تصنع الفارق." },
    cta: { fr: "Rendez chaque routine plus facile", en: "Make Every Routine Effortless", ar: "اجعلوا كل روتين أسهل" },
    objective: {
      fr: "Mettre en avant la valeur quotidienne du petit électroménager de cuisine à travers des routines familières : pâtisserie, jus, café.",
      en: "Highlight the everyday value of small kitchen appliances through familiar preparation routines, from baking and juicing to coffee preparation.",
      ar: "إبراز القيمة اليومية للأجهزة الصغيرة في المطبخ من خلال روتين مألوف: من الخَبز وعصر العصائر إلى تحضير القهوة.",
    },
    range: {
      fr: ["Robots pétrins", "Centrifugeuses", "Machines à café"],
      en: ["Stand mixers / kneaders", "Juicers", "Coffee machines"],
      ar: ["عجّانات", "عصّارات", "آلات القهوة"],
    },
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=900&fit=crop&auto=format",
  },
]

export const categorySlugs = categoryContent.map((c) => c.slug)

export function categoryContentOf(slug: string) {
  return categoryContent.find((c) => c.slug === slug)
}
