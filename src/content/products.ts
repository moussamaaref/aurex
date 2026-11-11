import type { L3 } from "./lang"

/** Menu et filtres Produits (website brief 2026). « Smart Home » est retiré. */
export const productsUi = {
  smartEmptyTitle: { fr: "Les appareils connectés arrivent bientôt", en: "Connected appliances are coming soon", ar: "الأجهزة المتصلة قادمة قريبًا" } as L3,
  smartEmptyText: {
    fr: "Aucun produit Bluetooth ou Wi-Fi n'est encore référencé. Découvrez en attendant toute la gamme AUREX.",
    en: "No Bluetooth or Wi-Fi product is listed yet. In the meantime, discover the whole AUREX range.",
    ar: "لا يوجد بعد أي منتج بلوتوث أو Wi-Fi. في الأثناء، اكتشفوا كامل تشكيلة AUREX.",
  } as L3,
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

/** Sous-familles mises au premier plan avec ?usage=pro (appareils haute performance). */
export const usageProFirst = ["aspirateurs", "distributeurs-eau", "lave-linge", "chauffe-eau", "robots-petrins"]

/** Fiche produit : Fonctionnalités (ce que fait l'appareil) / Spécifications (valeurs). */
export const specUi = {
  family: { fr: "Famille", en: "Family", ar: "العائلة" } as L3,
  subFamily: { fr: "Sous-famille", en: "Sub-family", ar: "العائلة الفرعية" } as L3,
  range: { fr: "Gamme", en: "Range", ar: "التشكيلة" } as L3,
  classification: { fr: "Classification", en: "Classification", ar: "التصنيف" } as L3,
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

/** Médias et documentation de la fiche produit. */
export const docUi = {
  findDistributor: { fr: "Trouver un distributeur", en: "Find a distributor", ar: "ابحثوا عن موزّع" } as L3,
  question: { fr: "Une question sur ce produit ?", en: "A question about this product?", ar: "سؤال عن هذا المنتج؟" } as L3,
  media: { fr: "Vidéo & 360°", en: "Video & 360°", ar: "فيديو و360°" } as L3,
  view360: { fr: "Vue 360°", en: "360° view", ar: "عرض 360°" } as L3,
  soon: {
    fr: "Contenu disponible prochainement.",
    en: "Content available soon.",
    ar: "المحتوى متوفر قريبًا.",
  } as L3,
  types: {
    "user-manual": { fr: "Notice d'utilisation", en: "User manual", ar: "دليل الاستخدام" } as L3,
    "technical-sheet": { fr: "Fiche technique", en: "Technical sheet", ar: "البطاقة التقنية" } as L3,
    warranty: { fr: "Certificat de garantie", en: "Warranty certificate", ar: "شهادة الضمان" } as L3,
    troubleshooting: { fr: "Guide de dépannage", en: "Troubleshooting guide", ar: "دليل الإصلاح الأولي" } as L3,
  },
}
