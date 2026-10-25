import type { L3 } from "./lang"

/** Titres et descriptions par page (base SEO du website brief 2026). Le CMS (table pages) reste prioritaire. */
const brand = "AUREX"

export const seoByRoute: Record<string, { title: L3; description: L3 }> = {
  home: {
    title: {
      fr: `${brand} — Électroménager conçu pour durer, pensé pour plaire | Algérie`,
      en: `${brand} — Home appliances built to last, designed to please | Algeria`,
      ar: `${brand} — أجهزة منزلية صُنعت لتدوم وصُمّمت لتُعجب | الجزائر`,
    },
    description: {
      fr: "AUREX : électroménager au design moderne et à la valeur équilibrée pour les foyers algériens. Cuisine & encastrable, soin du linge, eau & confort, petit électro & coffee, réfrigération. Garantie écrite de 24 mois.",
      en: "AUREX: home appliances with modern design and balanced value for Algerian homes. Kitchen & built-in, laundry care, water & comfort, small appliances & coffee, refrigeration. 24-month written warranty.",
      ar: "AUREX: أجهزة منزلية بتصميم عصري وقيمة متوازنة للبيوت الجزائرية. المطبخ والأجهزة المدمجة، العناية بالغسيل، الماء والراحة، الأجهزة الصغيرة والقهوة، التبريد. ضمان مكتوب 24 شهرًا.",
    },
  },
  produits: {
    title: { fr: `Product Line-Up 2026 — Produits ${brand}`, en: `Product Line-Up 2026 — ${brand} products`, ar: `تشكيلة منتجات 2026 — منتجات ${brand}` },
    description: {
      fr: "Explorez la sélection de produits AUREX : fours encastrables, lave-linge, réfrigérateurs, chauffe-eau, machines à café et plus. Filtrez par famille, gamme, capacité et connectivité.",
      en: "Explore the AUREX product selection: built-in ovens, washing machines, refrigerators, water heaters, coffee machines and more. Filter by family, range, capacity and connectivity.",
      ar: "استكشفوا تشكيلة منتجات AUREX: أفران مدمجة وغسالات وثلاجات وسخانات مياه وآلات قهوة وغيرها. صفّوا بحسب العائلة والتشكيلة والسعة والاتصال.",
    },
  },
  "a-propos": {
    title: { fr: `À propos — ${brand}`, en: `About — ${brand}`, ar: `من نحن — ${brand}` },
    description: {
      fr: "AUREX comprend les besoins quotidiens des foyers algériens : design contemporain, fonctionnalités pratiques et valeur équilibrée. Une marque DAYCONN, soutenue par le Groupe Média Arcodym.",
      en: "AUREX understands the everyday needs of Algerian homes: contemporary design, practical functionality and balanced value. A DAYCONN brand, supported by the Media Arcodym Group.",
      ar: "تفهم AUREX الاحتياجات اليومية للبيوت الجزائرية: تصميم عصري ووظائف عملية وقيمة متوازنة. علامة تابعة لـ DAYCONN بدعم من مجموعة Media Arcodym.",
    },
  },
  "smart-tech": {
    title: { fr: `Smart Tech — ${brand}`, en: `Smart Tech — ${brand}`, ar: `Smart Tech — ${brand}` },
    description: {
      fr: "Smart Tech AUREX : appareils connectés en Wi-Fi et Bluetooth, contrôle à distance des fonctions disponibles, suivi de l'état et notifications.",
      en: "AUREX Smart Tech: Wi-Fi and Bluetooth connected appliances, remote control of available functions, status tracking and notifications.",
      ar: "Smart Tech من AUREX: أجهزة متصلة عبر Wi-Fi وBluetooth، تحكم عن بعد في الوظائف المتاحة، ومتابعة الحالة والإشعارات.",
    },
  },
  actualites: {
    title: { fr: `Nouveautés & À la une — ${brand}`, en: `What's New & Featured — ${brand}`, ar: `الجديد والأبرز — ${brand}` },
    description: {
      fr: "Lancements, nouveaux modèles et stories produit AUREX : découvrez les derniers appareils à travers leurs détails et leur design réfléchi.",
      en: "AUREX launches, new models and product stories: discover the latest appliances through their details and thoughtful design.",
      ar: "إطلاقات AUREX ونماذجها الجديدة وقصص منتجاتها: اكتشفوا أحدث الأجهزة من خلال تفاصيلها وتصميمها المدروس.",
    },
  },
  support: {
    title: { fr: `Support — Espace Clients & SAV | ${brand}`, en: `Support — Customer Space & After-Sales | ${brand}`, ar: `الدعم — فضاء الزبائن وخدمة ما بعد البيع | ${brand}` },
    description: {
      fr: "Garantie écrite de 24 mois, notices, pièces détachées d'origine, demande de maintenance et contact : le service après-vente AUREX vous accompagne.",
      en: "24-month written warranty, manuals, original spare parts, maintenance requests and contact: AUREX after-sales support is with you.",
      ar: "ضمان مكتوب 24 شهرًا وأدلة وقطع غيار أصلية وطلب صيانة وتواصل: خدمة ما بعد البيع من AUREX ترافقكم.",
    },
  },
}

export function seoFor(pathname: string, lang: "fr" | "en" | "ar") {
  const seg = pathname === "/" ? "home" : pathname.split("/").filter(Boolean)[0] ?? "home"
  const entry = seoByRoute[seg]
  return entry ? { title: entry.title[lang] ?? entry.title.fr, description: entry.description[lang] ?? entry.description.fr } : null
}
