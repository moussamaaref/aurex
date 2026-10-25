import type { L3 } from "./lang"

/** Page Support — Espace Clients & SAV (website brief 2026). */
export const support = {
  hero: {
    eyebrow: { fr: "AUREX CUSTOMER CARE", en: "AUREX CUSTOMER CARE", ar: "خدمة زبائن AUREX" } as L3,
    title: { fr: "Nous sommes là pour vous.", en: "We're Here for You.", ar: "نحن هنا من أجلكم." } as L3,
    text: {
      fr: "Votre relation avec AUREX ne s'arrête pas à l'achat. Du choix du bon appareil à l'assistance dont vous avez besoin, nous sommes là pour vous aider à avancer en toute confiance.",
      en: "Your relationship with AUREX doesn't end with a purchase. From choosing the right appliance to getting the support you need, we're here to help you move forward with confidence.",
      ar: "علاقتكم بـ AUREX لا تنتهي عند الشراء. من اختيار الجهاز المناسب إلى الحصول على الدعم الذي تحتاجونه، نحن هنا لمساعدتكم على المضيّ بثقة.",
    } as L3,
    cta1: { fr: "Obtenir de l'aide", en: "Get Support", ar: "احصلوا على الدعم" } as L3,
    cta2: { fr: "Découvrir notre garantie", en: "Discover Our Warranty", ar: "اكتشفوا ضماننا" } as L3,
  },
  warranty: {
    title: { fr: "Garantie & sérénité — une confiance qui dure", en: "Warranty & Peace of Mind — Confidence That Stays", ar: "الضمان وراحة البال — ثقة تدوم" } as L3,
    items: [
      {
        icon: "shield-check",
        title: { fr: "Garantie écrite de 24 mois", en: "24-Month Written Warranty", ar: "ضمان مكتوب لمدة 24 شهرًا" } as L3,
        text: {
          fr: "Une garantie écrite de 24 mois, qui détaille les conditions, la couverture et les exclusions.",
          en: "A written 24-month warranty detailing the conditions, coverage and exclusions.",
          ar: "ضمان مكتوب لمدة 24 شهرًا يوضّح الشروط والتغطية والاستثناءات.",
        } as L3,
      },
      {
        icon: "wrench",
        title: { fr: "Réseau de maintenance local", en: "Local Maintenance Network", ar: "شبكة صيانة محلية" } as L3,
        text: {
          fr: "Un réseau de maintenance agréé et la façon d'accéder à l'assistance selon votre région.",
          en: "An approved maintenance network and how to access assistance by region.",
          ar: "شبكة صيانة معتمدة وكيفية الحصول على المساعدة بحسب منطقتكم.",
        } as L3,
      },
      {
        icon: "cog",
        title: { fr: "Pièces détachées d'origine", en: "Original Spare Parts", ar: "قطع غيار أصلية" } as L3,
        text: {
          fr: "Des informations sur les pièces de rechange d'origine, et comment les commander ou se renseigner sur leur disponibilité.",
          en: "Information on original spare parts and how to order them or enquire about their availability.",
          ar: "معلومات عن قطع الغيار الأصلية وكيفية طلبها أو الاستفسار عن توفّرها.",
        } as L3,
      },
    ],
    detailsTitle: { fr: "Votre garantie écrite", en: "Your written warranty", ar: "ضمانكم المكتوب" } as L3,
    detailsText: {
      fr: "Chaque appareil AUREX est couvert par une garantie écrite de 24 mois. Les conditions, la couverture et les exclusions applicables figurent dans le document de garantie remis avec votre appareil. Pour toute question sur votre couverture, contactez notre équipe en indiquant votre appareil et sa référence.",
      en: "Every AUREX appliance is covered by a 24-month written warranty. The applicable conditions, coverage and exclusions are set out in the warranty document delivered with your appliance. For any question about your coverage, contact our team with your appliance and its reference.",
      ar: "كل جهاز من AUREX مشمول بضمان مكتوب لمدة 24 شهرًا. تجدون الشروط والتغطية والاستثناءات المطبّقة في وثيقة الضمان المرفقة بجهازكم. لأي سؤال عن تغطيتكم، تواصلوا مع فريقنا مع ذكر جهازكم ومرجعه.",
    } as L3,
  },
  help: {
    eyebrow: { fr: "SERVICE CLIENT", en: "CUSTOMER CARE", ar: "خدمة الزبائن" } as L3,
    title: { fr: "Comment pouvons-nous vous aider ?", en: "How Can We Help You?", ar: "كيف يمكننا مساعدتكم؟" } as L3,
    text: {
      fr: "Choisissez ce dont vous avez besoin, nous vous orienterons vers le bon support.",
      en: "Choose what you need, and we'll guide you to the right support.",
      ar: "اختاروا ما تحتاجونه وسنوجّهكم إلى الدعم المناسب.",
    } as L3,
    cards: [
      {
        num: "01",
        id: "maintenance",
        icon: "wrench",
        title: { fr: "Réparation & maintenance", en: "Repair & Maintenance", ar: "الإصلاح والصيانة" } as L3,
        text: {
          fr: "Pour les demandes liées aux dysfonctionnements et à la maintenance.",
          en: "For requests related to malfunctions and maintenance.",
          ar: "للطلبات المتعلقة بالأعطال والصيانة.",
        } as L3,
        cta: { fr: "Demander une maintenance", en: "Request Maintenance", ar: "اطلبوا صيانة" } as L3,
        href: "#demande",
        requestType: "maintenance",
      },
      {
        num: "02",
        id: "warranty",
        icon: "shield-check",
        title: { fr: "Garantie & couverture", en: "Warranty & Coverage", ar: "الضمان والتغطية" } as L3,
        text: {
          fr: "Comprendre les conditions de la garantie, sa durée et ce qu'elle inclut.",
          en: "Understand the warranty terms, its duration and what it includes.",
          ar: "فهم شروط الضمان ومدّته وما يشمله.",
        } as L3,
        cta: { fr: "Découvrir la garantie", en: "Explore Warranty", ar: "اكتشفوا الضمان" } as L3,
        href: "#garantie",
      },
      {
        num: "03",
        id: "manuals",
        icon: "book",
        title: { fr: "Notices & guides", en: "Manuals & Guides", ar: "الأدلة والكتيّبات" } as L3,
        text: {
          fr: "Pour retrouver le manuel d'utilisation de votre appareil.",
          en: "To find your appliance's user manual.",
          ar: "للعثور على دليل استخدام جهازكم.",
        } as L3,
        cta: { fr: "Trouver ma notice", en: "Find My Manual", ar: "اعثروا على دليلي" } as L3,
        href: "#notices",
      },
      {
        num: "04",
        id: "care",
        icon: "help",
        title: { fr: "Entretien & dépannage", en: "Product Care & Troubleshooting", ar: "العناية والإصلاح الأولي" } as L3,
        text: {
          fr: "Prendre soin de votre appareil et comprendre les petits problèmes.",
          en: "Look after your appliance and understand minor issues.",
          ar: "اعتنوا بجهازكم وافهموا المشاكل البسيطة.",
        } as L3,
        cta: { fr: "Trouver une solution", en: "Find a Solution", ar: "اعثروا على حل" } as L3,
        href: "#faq",
      },
      {
        num: "05",
        id: "parts",
        icon: "cog",
        title: { fr: "Pièces détachées d'origine", en: "Original Spare Parts", ar: "قطع غيار أصلية" } as L3,
        text: {
          fr: "Se renseigner sur les pièces d'origine et leur disponibilité.",
          en: "Enquire about original spare parts and their availability.",
          ar: "الاستفسار عن قطع الغيار الأصلية وتوفّرها.",
        } as L3,
        cta: { fr: "Se renseigner sur les pièces", en: "Ask About Spare Parts", ar: "استفسروا عن قطع الغيار" } as L3,
        href: "#demande",
        requestType: "spare-parts",
      },
      {
        num: "06",
        id: "contact",
        icon: "headset",
        title: { fr: "Contacter le service client", en: "Contact Customer Care", ar: "تواصلوا مع خدمة الزبائن" } as L3,
        text: {
          fr: "Pour les cas nécessitant une assistance directe ou une demande générale.",
          en: "For cases needing direct assistance or a general enquiry.",
          ar: "للحالات التي تتطلب مساعدة مباشرة أو استفسارًا عامًا.",
        } as L3,
        cta: { fr: "Nous contacter", en: "Get in Touch", ar: "تواصلوا معنا" } as L3,
        href: "#contact",
      },
    ],
  },
  manuals: {
    title: { fr: "Trouver ma notice", en: "Find My Manual", ar: "اعثروا على دليلي" } as L3,
    text: {
      fr: "Recherchez par catégorie ou par référence d'appareil. Les documents disponibles au téléchargement figurent sur la fiche produit.",
      en: "Search by category or appliance reference. Available downloadable documents are listed on the product page.",
      ar: "ابحثوا بحسب الفئة أو مرجع الجهاز. تجدون الوثائق القابلة للتحميل المتاحة في صفحة المنتج.",
    } as L3,
    allCategories: { fr: "Toutes les catégories", en: "All categories", ar: "كل الفئات" } as L3,
    open: { fr: "Voir la fiche et les documents", en: "View page and documents", ar: "عرض الصفحة والوثائق" } as L3,
  },
  myAppliance: {
    title: { fr: "Mon appareil AUREX", en: "My AUREX Appliance", ar: "جهازي من AUREX" } as L3,
    intro: {
      fr: "Un espace numérique pour retrouver tout ce dont vous avez besoin sur votre appareil AUREX : informations, notice, conseils d'entretien et premières solutions, sans parcourir plusieurs pages.",
      en: "My AUREX Appliance is a digital space that lets customers access everything they need about their AUREX appliance, without browsing multiple pages or files.",
      ar: "«جهازي من AUREX» فضاء رقمي يتيح للزبائن الوصول إلى كل ما يحتاجونه عن جهازهم، دون تصفّح صفحات وملفات متعددة.",
    } as L3,
    headline: { fr: "Trouvez votre appareil AUREX", en: "Find Your AUREX Appliance", ar: "اعثروا على جهازكم من AUREX" } as L3,
    text: {
      fr: "Saisissez le nom ou la référence de votre produit pour accéder à ses informations et aux documents disponibles.",
      en: "Enter your product name or reference to access its information and available documents",
      ar: "أدخلوا اسم منتجكم أو مرجعه للوصول إلى معلوماته والوثائق المتاحة.",
    } as L3,
    placeholder: { fr: "Nom ou référence du produit", en: "Product name or reference", ar: "اسم المنتج أو مرجعه" } as L3,
    cta: { fr: "Trouver mon appareil", en: "Find My Appliance", ar: "اعثروا على جهازي" } as L3,
    openProduct: { fr: "Fiche produit", en: "Product page", ar: "صفحة المنتج" } as L3,
    openDocs: { fr: "Documents", en: "Documents", ar: "الوثائق" } as L3,
    noResult: {
      fr: "Nous n'avons pas trouvé votre appareil. Vérifiez la référence ou contactez notre équipe Service Client.",
      en: "We couldn't find your appliance. Check the reference or contact our Customer Care team.",
      ar: "لم نتمكن من العثور على جهازكم. تحقّقوا من المرجع أو تواصلوا مع فريق خدمة الزبائن.",
    } as L3,
  },
  form: {
    id: "demande",
    title: { fr: "Demander une assistance", en: "Request Support", ar: "طلب مساعدة" } as L3,
    text: {
      fr: "Remplissez ce formulaire : notre équipe vous répondra par le canal adapté.",
      en: "Fill in this form and our team will get back to you through the appropriate channel.",
      ar: "املؤوا هذا النموذج وسيعود إليكم فريقنا عبر القناة المناسبة.",
    } as L3,
    fields: {
      name: { fr: "Nom et prénom", en: "Name and surname", ar: "الاسم واللقب" } as L3,
      phone: { fr: "Numéro de téléphone", en: "Phone number", ar: "رقم الهاتف" } as L3,
      wilaya: { fr: "Wilaya", en: "State (wilaya)", ar: "الولاية" } as L3,
      commune: { fr: "Commune", en: "Municipality", ar: "البلدية" } as L3,
      deviceClass: { fr: "Catégorie de l'appareil", en: "Device class", ar: "فئة الجهاز" } as L3,
      reference: { fr: "Référence de l'appareil", en: "Device reference", ar: "مرجع الجهاز" } as L3,
      type: { fr: "Type de demande", en: "Request type", ar: "نوع الطلب" } as L3,
      message: { fr: "Décrivez le problème", en: "Describe the problem", ar: "صِفوا المشكلة" } as L3,
      file: {
        fr: "Photo ou vidéo du problème, ou de l'étiquette de référence (facultatif)",
        en: "Optional image or video of the problem or device reference label",
        ar: "صورة أو فيديو للمشكلة أو لملصق مرجع الجهاز (اختياري)",
      } as L3,
    },
    types: [
      { value: "maintenance", label: { fr: "Maintenance", en: "Maintenance", ar: "صيانة" } as L3 },
      { value: "warranty", label: { fr: "Garantie", en: "Warranty", ar: "ضمان" } as L3 },
      { value: "spare-parts", label: { fr: "Pièces détachées", en: "Spare parts", ar: "قطع غيار" } as L3 },
      { value: "inquiry", label: { fr: "Renseignement", en: "Inquiry", ar: "استفسار" } as L3 },
    ],
    select: { fr: "Sélectionner", en: "Select", ar: "اختر" } as L3,
    submit: { fr: "Envoyer ma demande", en: "Submit My Request", ar: "إرسال طلبي" } as L3,
    sending: { fr: "Envoi…", en: "Sending…", ar: "جارٍ الإرسال…" } as L3,
    required: { fr: "Merci de renseigner les champs obligatoires.", en: "Please fill in the required fields.", ar: "يرجى ملء الحقول الإلزامية." } as L3,
    error: {
      fr: "L'envoi a échoué. Merci de réessayer ou de nous contacter directement.",
      en: "Sending failed. Please try again or contact us directly.",
      ar: "فشل الإرسال. يرجى المحاولة مجددًا أو التواصل معنا مباشرة.",
    } as L3,
    successTitle: { fr: "Votre demande a bien été envoyée", en: "Your request has been sent", ar: "تم إرسال طلبكم" } as L3,
    referenceLabel: { fr: "Numéro de référence", en: "Reference number", ar: "رقم المرجع" } as L3,
    nextStep: {
      fr: "Notre équipe étudie votre demande et vous recontactera par téléphone ou par les moyens de communication AUREX disponibles. Conservez ce numéro pour tout suivi.",
      en: "Our team is reviewing your request and will get back to you by phone or through the available AUREX channels. Keep this number for any follow-up.",
      ar: "يدرس فريقنا طلبكم وسيعود إليكم عبر الهاتف أو قنوات AUREX المتاحة. احتفظوا بهذا الرقم لأي متابعة.",
    } as L3,
    localNote: {
      fr: "Mode aperçu : la demande est enregistrée sur cet appareil uniquement.",
      en: "Preview mode: the request is saved on this device only.",
      ar: "وضع المعاينة: الطلب محفوظ على هذا الجهاز فقط.",
    } as L3,
  },
  contact: {
    title: { fr: "Contacter le service client", en: "Contact Customer Care", ar: "تواصلوا مع خدمة الزبائن" } as L3,
    text: {
      fr: "Voici les moyens de communication AUREX actuellement disponibles.",
      en: "Here are the AUREX communication channels currently available.",
      ar: "فيما يلي قنوات التواصل المتاحة حاليًا لدى AUREX.",
    } as L3,
    phone: { fr: "Téléphone", en: "Phone", ar: "الهاتف" } as L3,
    email: { fr: "E-mail", en: "Email", ar: "البريد الإلكتروني" } as L3,
    address: { fr: "Adresse", en: "Address", ar: "العنوان" } as L3,
    none: {
      fr: "Les coordonnées seront publiées ici dès leur validation. En attendant, utilisez le formulaire de demande ci-dessus.",
      en: "Contact details will be published here once validated. In the meantime, please use the request form above.",
      ar: "ستُنشر بيانات التواصل هنا فور اعتمادها. وفي الأثناء، يرجى استخدام نموذج الطلب أعلاه.",
    } as L3,
  },
  faq: {
    title: { fr: "Questions fréquentes", en: "Frequently Asked Questions", ar: "الأسئلة الشائعة" } as L3,
    items: [
      {
        q: {
          fr: "Comment utiliser mon appareil au mieux ?",
          en: "How do I get the most out of my appliance?",
          ar: "كيف أستفيد من جهازي على أفضل وجه؟",
        } as L3,
        a: {
          fr: "Consultez la notice de votre appareil : elle présente les fonctions disponibles, les programmes et les conseils d'utilisation. Vous la retrouvez via « Trouver ma notice » ou sur la fiche produit.",
          en: "Check your appliance's manual: it presents the available functions, programmes and usage tips. You can find it through “Find My Manual” or on the product page.",
          ar: "راجعوا دليل جهازكم: فهو يعرض الوظائف والبرامج المتاحة ونصائح الاستخدام. تجدونه عبر «اعثروا على دليلي» أو في صفحة المنتج.",
        } as L3,
      },
      {
        q: {
          fr: "Où trouver la notice de mon appareil ?",
          en: "Where can I find my appliance's manual?",
          ar: "أين أجد دليل جهازي؟",
        } as L3,
        a: {
          fr: "Recherchez votre appareil par nom ou référence dans « Mon appareil AUREX » ; la fiche produit regroupe les documents disponibles.",
          en: "Search for your appliance by name or reference in “My AUREX Appliance”; the product page gathers the available documents.",
          ar: "ابحثوا عن جهازكم بالاسم أو المرجع في «جهازي من AUREX»؛ وتجمع صفحة المنتج الوثائق المتاحة.",
        } as L3,
      },
      {
        q: {
          fr: "Quelle est la durée de la garantie ?",
          en: "How long is the warranty?",
          ar: "ما مدة الضمان؟",
        } as L3,
        a: {
          fr: "Les appareils AUREX sont couverts par une garantie écrite de 24 mois. Les conditions, la couverture et les exclusions sont détaillées dans le document de garantie.",
          en: "AUREX appliances are covered by a 24-month written warranty. The conditions, coverage and exclusions are detailed in the warranty document.",
          ar: "أجهزة AUREX مشمولة بضمان مكتوب لمدة 24 شهرًا. الشروط والتغطية والاستثناءات مفصّلة في وثيقة الضمان.",
        } as L3,
      },
      {
        q: {
          fr: "Comment demander une intervention ou une assistance ?",
          en: "How do I request a repair or assistance?",
          ar: "كيف أطلب تدخلاً أو مساعدة؟",
        } as L3,
        a: {
          fr: "Utilisez le formulaire « Demander une assistance » en indiquant votre appareil, sa référence et le problème rencontré. Un numéro de référence vous est communiqué pour le suivi.",
          en: "Use the “Request Support” form, indicating your appliance, its reference and the issue. A reference number is provided for follow-up.",
          ar: "استخدموا نموذج «طلب مساعدة» مع ذكر جهازكم ومرجعه والمشكلة. سيُمنح لكم رقم مرجع للمتابعة.",
        } as L3,
      },
      {
        q: {
          fr: "Comment identifier mon modèle pour une pièce détachée ?",
          en: "How do I identify my model for a spare part?",
          ar: "كيف أحدّد موديل جهازي لطلب قطعة غيار؟",
        } as L3,
        a: {
          fr: "La référence figure sur l'étiquette de l'appareil. Indiquez-la dans le formulaire (type « Pièces détachées ») et, si possible, joignez une photo de l'étiquette.",
          en: "The reference is on the appliance label. Enter it in the form (type “Spare parts”) and, if possible, attach a photo of the label.",
          ar: "يوجد المرجع على ملصق الجهاز. أدخلوه في النموذج (نوع «قطع غيار») وأرفقوا إن أمكن صورة للملصق.",
        } as L3,
      },
    ],
  },
  centres: {
    title: { fr: "Centres de service", en: "Service Centres", ar: "مراكز الخدمة" } as L3,
    text: {
      fr: "Retrouvez le réseau AUREX près de chez vous, par wilaya.",
      en: "Find the AUREX network near you, by wilaya.",
      ar: "اعثروا على شبكة AUREX قرب منطقتكم بحسب الولاية.",
    } as L3,
    cta: { fr: "Voir les points de service", en: "See service points", ar: "عرض نقاط الخدمة" } as L3,
  },
  final: {
    title: { fr: "Votre maison compte. Notre support aussi.", en: "Your Home Matters. So Does Our Support.", ar: "بيتكم يهمّنا. ودعمنا كذلك." } as L3,
    text: {
      fr: "Chaque foyer a son propre rythme. Quand vous avez besoin d'un coup de main avec votre appareil AUREX, nous sommes là pour vous aider à trouver la bonne voie.",
      en: "Every home has its own rhythm. When you need a hand with your AUREX appliance, we're here to help you find the right way forward.",
      ar: "لكل بيت إيقاعه الخاص. وعندما تحتاجون إلى يد المساعدة مع جهازكم من AUREX، نحن هنا لنساعدكم على إيجاد الطريق الصحيح.",
    } as L3,
    cta: { fr: "Nous contacter", en: "Get in Touch", ar: "تواصلوا معنا" } as L3,
  },
}

/** 58 wilayas (liste officielle). */
export const wilayas = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira",
  "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda",
  "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla",
  "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
  "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar",
  "Ouled Djellal", "Béni Abbès", "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa",
]
