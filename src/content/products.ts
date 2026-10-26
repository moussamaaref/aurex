import type { L3 } from "./lang"

/** Menu et filtres Produits (website brief 2026). « Smart Home » est retiré. */
export const productsUi = {
  smartTitle: { fr: "Produits Bluetooth & Wi-Fi", en: "Bluetooth & Wi-Fi products", ar: "منتجات Bluetooth وWi-Fi" } as L3,
  filters: {
    famille: { fr: "Famille", en: "Family", ar: "العائلة" } as L3,
    allFamilles: { fr: "Toutes les familles", en: "All families", ar: "كل العائلات" } as L3,
    sousFamille: { fr: "Sous-famille", en: "Sub-family", ar: "العائلة الفرعية" } as L3,
    allSousFamilles: { fr: "Toutes les sous-familles", en: "All sub-families", ar: "كل العائلات الفرعية" } as L3,
    classification: { fr: "Classification / Caractéristiques", en: "Classification / Features", ar: "التصنيف / الخصائص" } as L3,
    allClassifications: { fr: "Toutes", en: "All", ar: "الكل" } as L3,
    gamme: { fr: "Gamme", en: "Range", ar: "التشكيلة" } as L3,
    allGammes: { fr: "Toutes les gammes", en: "All ranges", ar: "كل التشكيلات" } as L3,
    capacite: { fr: "Capacité", en: "Capacity", ar: "السعة" } as L3,
    allCapacites: { fr: "Toutes les capacités", en: "All capacities", ar: "كل السعات" } as L3,
    couleur: { fr: "Couleur", en: "Colour", ar: "اللون" } as L3,
    allCouleurs: { fr: "Toutes les couleurs", en: "All colours", ar: "كل الألوان" } as L3,
    connectivite: { fr: "Connectivité", en: "Connectivity", ar: "الاتصال" } as L3,
    wifi: { fr: "Wi-Fi", en: "Wi-Fi", ar: "Wi-Fi" } as L3,
    bluetooth: { fr: "Bluetooth", en: "Bluetooth", ar: "Bluetooth" } as L3,
  },
}

/** Familles de la barre latérale = les 5 catégories (lien direct vers la page catégorie). */
export const usageProFirst = ["aspirateurs", "fontaines-eau", "lave-linge", "cumulus", "chauffe-bain", "refrigerateurs", "congelateurs"]

/** Fiche produit : Fonctionnalités (ce que fait l'appareil) / Spécifications (valeurs). */
export const specUi = {
  features: { fr: "Fonctionnalités", en: "Features", ar: "الوظائف" } as L3,
  specs: { fr: "Spécifications", en: "Specifications", ar: "المواصفات" } as L3,
  reference: { fr: "Référence", en: "Reference", ar: "المرجع" } as L3,
  capacity: { fr: "Capacité", en: "Capacity", ar: "السعة" } as L3,
  energyClass: { fr: "Classe énergétique", en: "Energy class", ar: "الفئة الطاقوية" } as L3,
  dimensions: { fr: "Dimensions (L × H × P)", en: "Dimensions (W × H × D)", ar: "الأبعاد (ع × ارتفاع × عمق)" } as L3,
  color: { fr: "Couleur", en: "Colour", ar: "اللون" } as L3,
  connectivity: { fr: "Connectivité", en: "Connectivity", ar: "الاتصال" } as L3,
  noise: { fr: "Niveau sonore", en: "Noise level", ar: "مستوى الضجيج" } as L3,
  installation: { fr: "Type d'installation", en: "Installation type", ar: "نوع التركيب" } as L3,
  none: { fr: "Non connecté", en: "Not connected", ar: "غير متصل" } as L3,
}
