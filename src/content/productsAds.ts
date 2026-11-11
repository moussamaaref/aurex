import type { L3 } from "./lang"

/** Product Advertising Spot (hero de la page Produits) : visuels publicitaires uniquement, aucun texte de présentation.
 *  Chaque campagne = une image + un CTA « Découvrir le produit » qui mène directement à la fiche du produit.
 *  Éditable dans /admin > Contenu du site > Produits. Emplacements vides (image vide) = ignorés.
 *  Cible : `productId` (id exact d'un produit) ou, à défaut, `sousFamille` (premier produit de cette sous-famille). */
export interface ProductAd {
  image: string
  imageAlt: L3
  /** id exact du produit à mettre en avant (prioritaire) */
  productId: string
  /** à défaut : identifiant de sous-famille officielle (ex. machines-cafe) */
  sousFamille: string
}

export const productsAdsUi = {
  cta: { fr: "Découvrir le produit", en: "Discover the product", ar: "اكتشفوا المنتج" } as L3,
  prev: { fr: "Visuel précédent", en: "Previous visual", ar: "الصورة السابقة" } as L3,
  next: { fr: "Visuel suivant", en: "Next visual", ar: "الصورة التالية" } as L3,
  pause: { fr: "Mettre en pause", en: "Pause", ar: "إيقاف مؤقت" } as L3,
  play: { fr: "Relancer", en: "Play", ar: "تشغيل" } as L3,
  region: { fr: "Campagnes AUREX", en: "AUREX campaigns", ar: "حملات AUREX" } as L3,
}

export const productsAds: ProductAd[] = [
  {
    image: "/Gustiva.jpeg",
    imageAlt: {
      fr: "Machine à café AUREX sur un plan de travail en marbre",
      en: "AUREX coffee machine on a marble worktop",
      ar: "آلة قهوة AUREX على سطح عمل رخامي",
    },
    productId: "",
    sousFamille: "machines-cafe",
  },
  {
    image: "/Spinova3.jpeg",
    imageAlt: {
      fr: "Lave-linge AUREX à hublot",
      en: "AUREX front-loading washing machine",
      ar: "غسّالة AUREX بتحميل أمامي",
    },
    productId: "",
    sousFamille: "lave-linge",
  },
  {
    image: "/Vacuum.jpeg",
    imageAlt: {
      fr: "Aspirateur AUREX dans un salon lumineux",
      en: "AUREX vacuum cleaner in a bright living room",
      ar: "مكنسة AUREX في صالون مشرق",
    },
    productId: "",
    sousFamille: "aspirateurs",
  },
  { image: "", imageAlt: { fr: "", en: "", ar: "" }, productId: "", sousFamille: "" },
  { image: "", imageAlt: { fr: "", en: "", ar: "" }, productId: "", sousFamille: "" },
  { image: "", imageAlt: { fr: "", en: "", ar: "" }, productId: "", sousFamille: "" },
]
