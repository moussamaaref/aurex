import type { L3 } from "./lang"

/** Contenu de l'accueil (website brief 2026). Ordre des sections :
 *  Hero (4 slides) → Product Line-Up → Pourquoi AUREX → Nos catégories → SAV →
 *  Promotional & Highlights → Smart Tech → Newsletter (pied de page). */

export interface HeroSlideContent {
  id: string
  image: string
  badge?: L3
  title: L3
  subtitle: L3
  tag?: L3
  primary: { label: L3; href: string }
  secondary: { label: L3; href: string }
}

export const heroSlides: HeroSlideContent[] = [
  {
    id: "promise",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=2000&h=1100&fit=crop&auto=format",
    badge: {
      fr: "Design moderne • Garantie 24 mois • Smart value",
      en: "Modern design • 24-month warranty • Smart value",
      ar: "تصميم عصري • ضمان 24 شهرًا • قيمة ذكية",
    },
    title: { fr: "Conçu pour durer. Pensé pour plaire.", en: "Built to last. Designed to please.", ar: "صُنع ليدوم. صُمّم ليُعجب." },
    subtitle: {
      fr: "L'élégance que vous désirez, la durabilité qui vous rassure et le prix qui respecte votre budget.",
      en: "The elegance you desire, the durability that reassures you, and the price that respects your budget.",
      ar: "الأناقة التي تريدونها، والمتانة التي تطمئنكم، والسعر الذي يحترم ميزانيتكم.",
    },
    primary: { label: { fr: "Découvrir nos collections", en: "Discover our collections", ar: "اكتشفوا مجموعاتنا" }, href: "/produits" },
    secondary: { label: { fr: "Pourquoi AUREX ?", en: "Why AUREX?", ar: "لماذا AUREX؟" }, href: "/#pourquoi-aurex" },
  },
  {
    id: "reliability",
    image: "/Spinova3.jpeg",
    tag: { fr: "Moteurs haute puissance", en: "High power engines", ar: "محرّكات عالية القدرة" },
    title: {
      fr: "Des appareils qui apportent une tranquillité durable à votre foyer.",
      en: "Devices that bring lasting peace of mind to your home.",
      ar: "أجهزة تمنح بيتكم راحة بال تدوم.",
    },
    subtitle: {
      fr: "Conçus pour résister à un usage quotidien intensif, tout en fonctionnant en toute discrétion. Le choix de toute famille qui veut avoir l'esprit tranquille, sans regret.",
      en: "Designed to withstand intensive daily use—all while operating in complete silence. It is the choice for any family seeking peace of mind, with no regrets.",
      ar: "مصمّمة لتحمّل الاستخدام اليومي المكثّف، مع عمل هادئ تمامًا. إنها خيار كل عائلة تبحث عن راحة البال، دون ندم.",
    },
    primary: { label: { fr: "Explorer la gamme 2026", en: "Explore 2026 Lineup", ar: "استكشفوا تشكيلة 2026" }, href: "/produits" },
    secondary: {
      label: { fr: "Service après-vente et garantie", en: "After-sales service and warranty", ar: "خدمة ما بعد البيع والضمان" },
      href: "/support",
    },
  },
  {
    id: "smart",
    image: "/Gustiva.jpeg",
    tag: { fr: "Connecté en Wi-Fi & Bluetooth", en: "Wi-Fi & Bluetooth Connected", ar: "متصل عبر Wi-Fi وBluetooth" },
    title: { fr: "Smart Tech — contrôle d'un seul geste.", en: "Smart Tech — One Touch Control.", ar: "Smart Tech — تحكّم بلمسة واحدة." },
    subtitle: {
      fr: "Suivez les réglages de votre appareil et profitez d'une technologie pratique qui s'adapte à votre temps et à votre confort, où que vous soyez.",
      en: "Monitor your device settings and enjoy practical technology that works for your time and convenience, wherever you are.",
      ar: "تابعوا إعدادات جهازكم واستفيدوا من تكنولوجيا عملية تخدم وقتكم وراحتكم أينما كنتم.",
    },
    primary: {
      label: { fr: "Explorer les appareils Smart Tech", en: "Explore Smart Tech devices", ar: "استكشفوا أجهزة Smart Tech" },
      href: "/smart-tech",
    },
    secondary: {
      label: { fr: "Télécharger l'application AUREX", en: "Download the AUREX app", ar: "حمّلوا تطبيق AUREX" },
      href: "/smart-tech#application",
    },
  },
  {
    id: "pro",
    image: "/Vacuum.jpeg",
    badge: { fr: "Standards approuvés pour les organisations", en: "Approved standards for organizations", ar: "معايير معتمدة للمؤسسات" },
    title: {
      fr: "Des solutions fiables pour les environnements exigeants.",
      en: "Reliable Solutions for High-Demand Environments.",
      ar: "حلول موثوقة للبيئات كثيرة المتطلبات.",
    },
    subtitle: {
      fr: "Conçues pour offrir une puissance sans compromis, une durabilité maximale et un support sans faille.",
      en: "Engineered to deliver uncompromised power, maximum durability, and seamless support.",
      ar: "مصمّمة لتقديم قدرة بلا تنازلات ومتانة قصوى ودعم متواصل.",
    },
    primary: {
      label: { fr: "Découvrir les solutions professionnelles", en: "Discover Professional Solutions", ar: "اكتشفوا الحلول المهنية" },
      href: "/produits?usage=pro",
    },
    secondary: { label: { fr: "Nous contacter", en: "Contact Us", ar: "اتصلوا بنا" }, href: "/support#contact" },
  },
]

export const lineUp = {
  title: { fr: "Product Line-Up 2026", en: "Product Line-Up 2026", ar: "تشكيلة منتجات 2026" } as L3,
  subtitle: {
    fr: "Des appareils conçus pour répondre aux besoins du quotidien.",
    en: "Appliances designed to meet everyday needs.",
    ar: "أجهزة مصمّمة لتلبية احتياجات الحياة اليومية.",
  } as L3,
  cardCta: { fr: "Découvrir le produit", en: "Discover the product", ar: "اكتشفوا المنتج" } as L3,
  seeAll: { fr: "Voir tous nos produits", en: "See all our products", ar: "عرض كل منتجاتنا" } as L3,
}

export const why = {
  heading: { fr: "Conçus pour faire la différence", en: "Built for Difference", ar: "صُنعت لتصنع الفارق" } as L3,
  headline: {
    fr: "Inspirés par notre réalité. Conçus pour votre quotidien.",
    en: "Inspired by our reality. Designed for your everyday.",
    ar: "مستوحاة من واقعنا. مصمّمة لحياتكم اليومية.",
  } as L3,
  intro: {
    fr: "Dans chaque foyer algérien, les besoins et les détails rythment la vie de tous les jours. Forte de son expérience dans le domaine de l'électroménager et de sa compréhension de ces détails, AUREX propose sa propre vision : des appareils qui allient un style contemporain, des fonctionnalités pratiques et la valeur que mérite chaque choix. Car le bon appareil n'est pas un simple ajout à la maison : il fait partie d'une vie vécue au quotidien.",
    en: "In every Algerian home, needs and details create the rhythm of daily life. Understanding these details and having accumulated experience in the field of home electrical appliances, AUREX sets out to present its own vision: devices that combine a contemporary look, practical functionality, and the value that each selection process deserves. Because the right device is not just an addition to the home, but a part of a life lived every day.",
    ar: "في كل بيت جزائري، تصنع الاحتياجات والتفاصيل إيقاع الحياة اليومية. وانطلاقًا من فهمها لهذه التفاصيل وخبرتها المتراكمة في مجال الأجهزة المنزلية، تقدّم AUREX رؤيتها الخاصة: أجهزة تجمع بين مظهر عصري ووظائف عملية وقيمة يستحقها كل اختيار. فالجهاز المناسب ليس مجرد إضافة إلى البيت، بل جزء من حياة تُعاش كل يوم.",
  } as L3,
  cta: { fr: "Découvrir l'approche AUREX", en: "Discover the AUREX Approach", ar: "اكتشفوا نهج AUREX" } as L3,
  image: "/Gustiva.jpeg",
  imageAlt: {
    fr: "Cuisine contemporaine équipée d'appareils AUREX",
    en: "Contemporary kitchen equipped with AUREX appliances",
    ar: "مطبخ عصري مجهّز بأجهزة AUREX",
  } as L3,
  pillars: [
    {
      icon: "shield-check",
      title: { fr: "Qualité et fiabilité sur lesquelles vous pouvez compter", en: "Quality and reliability you can count on", ar: "جودة وموثوقية يمكنكم الاعتماد عليها" } as L3,
      text: {
        fr: "Des appareils conçus avec des matériaux robustes et des technologies éprouvées, vous garantissant des performances élevées et une grande durabilité.",
        en: "Appliances built with robust materials and proven technologies, ensuring high performance and long-lasting durability.",
        ar: "أجهزة مصنوعة من مواد متينة وتقنيات مجرّبة، تضمن أداءً عاليًا ومتانة طويلة الأمد.",
      } as L3,
    },
    {
      icon: "panels-top-left",
      title: { fr: "Un design moderne qui s'harmonise avec votre intérieur", en: "A modern design that blends with your interior", ar: "تصميم عصري ينسجم مع ديكور بيتكم" } as L3,
      text: {
        fr: "Des touches esthétiques contemporaines adaptées à divers styles de cuisines et de décorations (en particulier pour les modèles encastrables).",
        en: "Contemporary aesthetic touches suited to a variety of kitchen and décor styles (especially for built-in models).",
        ar: "لمسات جمالية عصرية تناسب مختلف أنماط المطابخ والديكور (خاصة للموديلات المدمجة).",
      } as L3,
    },
    {
      icon: "scale",
      title: { fr: "Meilleur rapport qualité-prix", en: "Best value for money", ar: "أفضل قيمة مقابل السعر" } as L3,
      text: {
        fr: "Un équilibre parfait entre technologie de pointe et prix compétitifs adaptés au budget familial.",
        en: "A perfect balance between advanced technology and competitive prices suited to the family budget.",
        ar: "توازن مثالي بين التكنولوجيا المتقدمة والأسعار التنافسية المناسبة لميزانية الأسرة.",
      } as L3,
    },
    {
      icon: "hand-heart",
      title: { fr: "Une garantie et un service qui vous accompagnent", en: "A warranty and service that stay with you", ar: "ضمان وخدمة ترافقكم" } as L3,
      text: {
        fr: "Nous vous offrons une véritable garantie et des pièces de rechange disponibles, avec une équipe de service client toujours prête à vous accompagner.",
        en: "We offer a genuine warranty and available spare parts, with a customer service team always ready to support you.",
        ar: "نقدّم لكم ضمانًا حقيقيًا وقطع غيار متوفرة، مع فريق خدمة زبائن جاهز دائمًا لمرافقتكم.",
      } as L3,
    },
  ],
}

export const categoriesSection = {
  eyebrow: { fr: "De notre réalité, à votre foyer", en: "From our reality, to your home", ar: "من واقعنا، إلى بيتكم" } as L3,
  title: { fr: "Nos catégories", en: "Our categories", ar: "فئاتنا" } as L3,
}

export const sav = {
  eyebrow: { fr: "SERVICE APRÈS-VENTE", en: "AFTER-SALES CARE", ar: "خدمة ما بعد البيع" } as L3,
  headline: {
    fr: "À vos côtés, pas à pas… pour votre entière tranquillité",
    en: "With you step by step.. To keep you completely comfortable",
    ar: "معكم خطوة بخطوة.. لتبقوا مرتاحين تمامًا",
  } as L3,
  principle: {
    fr: "L'appareil fait partie du foyer. Le support qui l'accompagne fait partie de l'expérience.",
    en: "The appliance is part of the home. The support behind it is part of the experience.",
    ar: "الجهاز جزء من البيت. والدعم الذي يقف خلفه جزء من التجربة.",
  } as L3,
  text: {
    fr: "Chez AUREX, nous savons qu'un foyer est bien plus qu'un lieu : c'est là que la vie quotidienne se déroule. Notre engagement va donc au-delà de l'appareil que vous choisissez. Besoin de conseils, d'informations produit ou d'assistance : nous sommes là pour vous aider à avancer en toute confiance. Parce que prendre soin de votre maison, c'est aussi être là pour vous.",
    en: "At AUREX, we understand that a home is more than a place — it's where everyday life happens. That's why our commitment goes beyond the appliance you choose. Whether you need guidance, product information or assistance, we're here to help you move forward with confidence. Because taking care of your home also means being there for you.",
    ar: "في AUREX ندرك أن البيت أكثر من مكان — إنه حيث تجري الحياة اليومية. لذلك يتجاوز التزامنا الجهاز الذي تختارونه. سواء احتجتم إلى إرشاد أو معلومات عن المنتج أو مساعدة، نحن هنا لنساعدكم على المضيّ بثقة. لأن العناية ببيتكم تعني أيضًا أن نكون بجانبكم.",
  } as L3,
  primary: { label: { fr: "Obtenir une assistance immédiate", en: "Get Immediate Assistance", ar: "احصلوا على مساعدة فورية" } as L3, href: "/support#demande" },
  secondary: { label: { fr: "Consulter le guide de votre appareil", en: "Browse Your Device Guide", ar: "تصفّحوا دليل جهازكم" } as L3, href: "/support#mon-appareil" },
  cards: [
    {
      num: "01",
      icon: "book",
      title: { fr: "Notices & guides", en: "Manuals & Guides", ar: "الأدلة والكتيّبات" } as L3,
      text: {
        fr: "Trouvez les bons conseils pour comprendre votre appareil et profiter pleinement de ses fonctions.",
        en: "Find the right guidance to understand your appliance and make the most of its features.",
        ar: "اعثروا على الإرشادات المناسبة لفهم جهازكم والاستفادة القصوى من وظائفه.",
      } as L3,
      cta: { fr: "Explorer les notices", en: "Explore Manuals", ar: "تصفّحوا الأدلة" } as L3,
      href: "/support#notices",
    },
    {
      num: "02",
      icon: "headset",
      title: { fr: "Support technique", en: "Technical Support", ar: "الدعم التقني" } as L3,
      text: {
        fr: "Un souci avec votre appareil ? Nous vous orientons vers le bon canal d'assistance.",
        en: "Need help with your appliance? We'll guide you towards the right support.",
        ar: "تحتاجون مساعدة مع جهازكم؟ سنوجّهكم إلى قناة الدعم المناسبة.",
      } as L3,
      cta: { fr: "Obtenir de l'aide", en: "Get Assistance", ar: "احصلوا على المساعدة" } as L3,
      href: "/support#demande",
    },
    {
      num: "03",
      icon: "cog",
      title: { fr: "Pièces détachées", en: "Spare Parts", ar: "قطع الغيار" } as L3,
      text: {
        fr: "Vous cherchez une pièce de rechange ? Contactez notre équipe pour trouver la bonne pièce pour votre modèle.",
        en: "Looking for a replacement part? Contact our support team for guidance on the right part for your model.",
        ar: "تبحثون عن قطعة غيار؟ تواصلوا مع فريق الدعم لمعرفة القطعة المناسبة لموديلكم.",
      } as L3,
      cta: { fr: "Trouver une pièce", en: "Find Spare Parts", ar: "ابحثوا عن قطعة غيار" } as L3,
      href: "/support#pieces",
    },
    {
      num: "04",
      icon: "help",
      title: { fr: "Questions fréquentes", en: "Frequently Asked Questions", ar: "الأسئلة الشائعة" } as L3,
      text: {
        fr: "Retrouvez des réponses utiles sur votre appareil, la garantie et le service après-vente.",
        en: "Find helpful answers to common questions about your appliance, warranty and after-sales support.",
        ar: "اعثروا على إجابات مفيدة حول جهازكم والضمان وخدمة ما بعد البيع.",
      } as L3,
      cta: { fr: "Trouver des réponses", en: "Find Answers", ar: "اعثروا على الإجابات" } as L3,
      href: "/support#faq",
    },
  ],
}

export const promo = {
  exclusive: {
    label: { fr: "OFFRE EXCLUSIVE", en: "EXCLUSIVE OFFER", ar: "عرض حصري" } as L3,
    title: { fr: "Votre maison mérite une meilleure offre.", en: "Your Home Deserves a Better Deal.", ar: "بيتكم يستحق عرضًا أفضل." } as L3,
    text: {
      fr: "Découvrez nos dernières offres sur une sélection d'appareils électroménagers.",
      en: "Discover our latest offers on selected home appliances.",
      ar: "اكتشفوا أحدث عروضنا على مجموعة مختارة من الأجهزة المنزلية.",
    } as L3,
    cta: { fr: "Découvrir l'offre", en: "Explore the Offer", ar: "اكتشفوا العرض" } as L3,
    href: "/produits?badge=promotion",
    image: "/Spinova3.jpeg",
  },
  fresh: {
    label: { fr: "NOUVEAU", en: "NEW", ar: "جديد" } as L3,
    title: { fr: "Découvrez votre prochain indispensable du quotidien", en: "Meet Your Next Everyday Essential", ar: "تعرّفوا على رفيقكم القادم في الحياة اليومية" } as L3,
    text: {
      fr: "Découvrez le dernier-né de la collection AUREX.",
      en: "Discover the latest addition to the AUREX collection.",
      ar: "اكتشفوا أحدث إضافة إلى مجموعة AUREX.",
    } as L3,
    cta: { fr: "Découvrir les nouveautés", en: "Discover What's New", ar: "اكتشفوا الجديد" } as L3,
    href: "/actualites",
  },
  best: {
    label: { fr: "BEST-SELLER", en: "BEST SELLER", ar: "الأكثر مبيعًا" } as L3,
    title: { fr: "Un favori, et pour de bonnes raisons.", en: "A Favourite for a Reason.", ar: "المفضّل لأسباب وجيهة." } as L3,
    text: {
      fr: "Découvrez un favori de nos clients, conçu pour un usage quotidien.",
      en: "Discover a customer favourite made for everyday use.",
      ar: "اكتشفوا أحد المفضّلات لدى زبائننا، مصمّمًا للاستخدام اليومي.",
    } as L3,
    cta: { fr: "Découvrir les best-sellers", en: "Explore Best Sellers", ar: "اكتشفوا الأكثر مبيعًا" } as L3,
    href: "/produits?badge=best-seller",
  },
}

export const heroUi = {
  pause: {
    pause: { fr: "Mettre le diaporama en pause", en: "Pause slideshow", ar: "إيقاف العرض مؤقتًا" } as L3,
    play: { fr: "Relancer le diaporama", en: "Play slideshow", ar: "تشغيل العرض" } as L3,
  },
}
