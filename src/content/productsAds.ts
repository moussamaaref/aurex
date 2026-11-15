import type { L3 } from "./lang"

/** Product Advertising Spot (hero de la page Produits) : visuels publicitaires uniquement, aucun texte de présentation.
 *  Chaque campagne = une image seule (aucun texte ni bouton) ; toute la bannière mène à la fiche du produit ciblé.
 *  Éditable dans /admin > Contenu du site > Produits. Emplacements vides (image vide) = ignorés.
 *  Cible : `productId` (id exact d'un produit) ou, à défaut, `sousFamille` (premier produit de cette sous-famille). */
export interface ProductAd {
  image: string
  imageAlt: L3
  /** id exact du produit à mettre en avant (prioritaire) */
  productId: string
  /** à défaut : identifiant de sous-famille officielle (ex. machines-cafe) */
  sousFamille: string
  /** cadrage du visuel dans la bannière (ex. "center", "center 30%", "left center") */
  position: string
}

export const productsAdsUi = {
  region: { fr: "Campagnes AUREX", en: "AUREX campaigns", ar: "حملات AUREX" } as L3,
}

export const productsAds: ProductAd[] = [
  {
    image: "/Gustiva.webp",
    imageAlt: {
      fr: "Machine à café AUREX sur un plan de travail en marbre",
      en: "AUREX coffee machine on a marble worktop",
      ar: "آلة قهوة AUREX على سطح عمل رخامي",
    },
    productId: "",
    sousFamille: "machines-cafe",
    position: "center",
  },
  {
    image: "/Spinova3.webp",
    imageAlt: {
      fr: "Lave-linge AUREX à hublot",
      en: "AUREX front-loading washing machine",
      ar: "غسّالة AUREX بتحميل أمامي",
    },
    productId: "",
    sousFamille: "lave-linge",
    position: "center",
  },
  {
    image: "/Vacuum.webp",
    imageAlt: {
      fr: "Aspirateur AUREX dans un salon lumineux",
      en: "AUREX vacuum cleaner in a bright living room",
      ar: "مكنسة AUREX في صالون مشرق",
    },
    productId: "",
    sousFamille: "aspirateurs",
    position: "center",
  },
  { image: "", imageAlt: { fr: "", en: "", ar: "" }, productId: "", sousFamille: "", position: "center" },
  { image: "", imageAlt: { fr: "", en: "", ar: "" }, productId: "", sousFamille: "", position: "center" },
  { image: "", imageAlt: { fr: "", en: "", ar: "" }, productId: "", sousFamille: "", position: "center" },
]
