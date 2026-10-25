import type { L3 } from "./lang"
import { categoryContent } from "./categories"

export const footerContent = {
  groups: {
    products: { fr: "Produits", en: "Products", ar: "المنتجات" } as L3,
    explore: { fr: "Explorer", en: "Explore", ar: "استكشف" } as L3,
    support: { fr: "Support", en: "Support", ar: "الدعم" } as L3,
  },
  /** Colonne PRODUITS : les 5 catégories officielles. */
  productLinks: categoryContent.map((c) => ({ label: c.name, href: `/produits/${c.slug}` })),
  exploreLinks: [
    { label: { fr: "À propos", en: "About", ar: "من نحن" } as L3, href: "/a-propos" },
    { label: { fr: "Technologie : Smart Tech", en: "Technology: Smart Tech", ar: "التكنولوجيا: Smart Tech" } as L3, href: "/smart-tech" },
    { label: { fr: "Actualités : Nouveautés", en: "News: What's New", ar: "الأخبار: الجديد" } as L3, href: "/actualites" },
    { label: { fr: "Comparateur", en: "Compare", ar: "المقارنة" } as L3, href: "/comparateur" },
  ],
  supportLinks: [
    { label: { fr: "Assistance", en: "Assistance", ar: "المساعدة" } as L3, href: "/support" },
    { label: { fr: "Notices & Manuels", en: "Manuals & Guides", ar: "الأدلة والكتيّبات" } as L3, href: "/support#notices" },
    { label: { fr: "FAQ", en: "FAQ", ar: "الأسئلة الشائعة" } as L3, href: "/support#faq" },
    { label: { fr: "Pièces Détachées", en: "Spare Parts", ar: "قطع الغيار" } as L3, href: "/support#pieces" },
    { label: { fr: "Centres de Service", en: "Service Centres", ar: "مراكز الخدمة" } as L3, href: "/support#centres" },
  ],
}

/** Bloc newsletter (website brief 2026). */
export const newsletterContent = {
  eyebrow: { fr: "Restez au cœur de nos nouveautés", en: "Stay at the heart of what's new", ar: "كونوا في قلب جديدنا" } as L3,
  title: { fr: "AUREX, toujours à vos côtés.", en: "AUREX, always by your side.", ar: "AUREX، دائمًا بجانبكم." } as L3,
  text: {
    fr: "De notre réalité, à votre foyer. L'électroménager durable et accessible, pensé pour simplifier le quotidien de chaque famille algérienne.",
    en: "From our reality, to your home. Durable, accessible appliances designed to simplify the everyday life of every Algerian family.",
    ar: "من واقعنا، إلى بيتكم. أجهزة منزلية متينة وفي المتناول، مصمّمة لتبسيط الحياة اليومية لكل عائلة جزائرية.",
  } as L3,
  placeholder: { fr: "Votre adresse e-mail", en: "Your email address", ar: "عنوان بريدكم الإلكتروني" } as L3,
  cta: { fr: "Restez informé(e)", en: "Stay informed", ar: "ابقوا على اطلاع" } as L3,
  invalid: { fr: "Veuillez saisir une adresse e-mail valide.", en: "Please enter a valid email address.", ar: "يرجى إدخال بريد إلكتروني صالح." } as L3,
  error: {
    fr: "Inscription momentanément indisponible. Merci de réessayer.",
    en: "Subscription is temporarily unavailable. Please try again.",
    ar: "التسجيل غير متاح مؤقتًا. يرجى المحاولة مجددًا.",
  } as L3,
  successTitle: {
    fr: "Vous faites désormais partie de l'expérience AUREX.",
    en: "You are now part of the AUREX experience.",
    ar: "أصبحتم الآن جزءًا من تجربة AUREX.",
  } as L3,
  successText: {
    fr: "Un e-mail de confirmation vient de vous être adressé. À très vite pour partager le meilleur de nos équipements.",
    en: "A confirmation email has just been sent to you. See you soon to share the best of our appliances.",
    ar: "تم إرسال رسالة تأكيد إلى بريدكم. إلى لقاء قريب لنشارككم الأفضل من أجهزتنا.",
  } as L3,
}
