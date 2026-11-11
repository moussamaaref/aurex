import type { L3 } from "../content/lang"

/* =====================================================================
   Classification officielle AUREX (« AUREX Web Site Brief final », §11 et sections 2 à 10).
   Ces listes REMPLACENT intégralement les anciennes familles, sous-familles, classifications,
   gammes, capacités, couleurs et connectivités : aucune fusion, aucune ancienne option conservée.
   Toute nouvelle option exige la validation du département Marketing AUREX.
   ===================================================================== */

/* ---------------- Familles (4) ---------------- */
export type FamilyId = "cuisine-encastrable" | "lavage-entretien" | "eau-confort" | "petit-electromenager"

export const OFFICIAL_FAMILIES: Array<{ id: FamilyId; name: L3 }> = [
  { id: "cuisine-encastrable", name: { fr: "Cuisine & Encastrable", en: "Kitchen & Built-in", ar: "المطبخ والأجهزة المدمجة" } },
  { id: "lavage-entretien", name: { fr: "Lavage & Entretien", en: "Laundry & Home Care", ar: "الغسيل والصيانة" } },
  { id: "eau-confort", name: { fr: "Eau & Confort", en: "Water & Comfort", ar: "الماء والراحة" } },
  { id: "petit-electromenager", name: { fr: "Petit Électroménager", en: "Small Appliances", ar: "الأجهزة الصغيرة" } },
]

/* ---------------- Sous-familles (14), chacune rattachée à sa famille ---------------- */
export type SubFamilyId =
  | "plaques-cuisson" | "hottes" | "cuisinieres" | "micro-ondes" | "fours-pose-libre"
  | "lave-linge" | "lave-vaisselle" | "defroisseurs-vapeur" | "aspirateurs"
  | "distributeurs-eau" | "chauffe-eau"
  | "robots-petrins" | "centrifugeuses" | "machines-cafe"

export const OFFICIAL_SUBFAMILIES: Array<{ id: SubFamilyId; family: FamilyId; name: L3 }> = [
  { id: "plaques-cuisson", family: "cuisine-encastrable", name: { fr: "Plaques de cuisson", en: "Hobs", ar: "مواقد الطهي" } },
  { id: "hottes", family: "cuisine-encastrable", name: { fr: "Hottes", en: "Cooker hoods", ar: "شفّاطات" } },
  { id: "cuisinieres", family: "cuisine-encastrable", name: { fr: "Cuisinières", en: "Cookers", ar: "طباخات" } },
  { id: "micro-ondes", family: "cuisine-encastrable", name: { fr: "Micro-ondes", en: "Microwaves", ar: "أفران ميكروويف" } },
  { id: "fours-pose-libre", family: "cuisine-encastrable", name: { fr: "Fours en pose libre", en: "Freestanding ovens", ar: "أفران قائمة بذاتها" } },
  { id: "lave-linge", family: "lavage-entretien", name: { fr: "Lave-linge", en: "Washing machines", ar: "غسّالات الملابس" } },
  { id: "lave-vaisselle", family: "lavage-entretien", name: { fr: "Lave-vaisselle", en: "Dishwashers", ar: "غسّالات الأطباق" } },
  { id: "defroisseurs-vapeur", family: "lavage-entretien", name: { fr: "Défroisseurs vapeur", en: "Steam garment steamers", ar: "مكاوي البخار العمودية" } },
  { id: "aspirateurs", family: "lavage-entretien", name: { fr: "Aspirateurs", en: "Vacuum cleaners", ar: "مكانس كهربائية" } },
  { id: "distributeurs-eau", family: "eau-confort", name: { fr: "Distributeurs d'eau", en: "Water dispensers", ar: "موزّعات المياه" } },
  { id: "chauffe-eau", family: "eau-confort", name: { fr: "Chauffe-eau", en: "Water heaters", ar: "سخّانات المياه" } },
  { id: "robots-petrins", family: "petit-electromenager", name: { fr: "Robots pétrins", en: "Stand mixers / kneaders", ar: "عجّانات" } },
  { id: "centrifugeuses", family: "petit-electromenager", name: { fr: "Centrifugeuses", en: "Juicers", ar: "عصّارات" } },
  { id: "machines-cafe", family: "petit-electromenager", name: { fr: "Machines à café", en: "Coffee machines", ar: "آلات القهوة" } },
]

/* ---------------- Classification / Caractéristiques ---------------- */
export interface ClassOption { id: string; name: L3 }
export interface ClassGroup { id: string; title: L3; options: ClassOption[] }

const o = (id: string, fr: string, en: string, ar: string): ClassOption => ({ id, name: { fr, en, ar } })

export const CLASSIFICATION_GROUPS: ClassGroup[] = [
  { id: "installation", title: { fr: "Installation et type", en: "Installation and type", ar: "التركيب والنوع" }, options: [o("pose-libre", "Pose libre", "Freestanding", "قائم بذاته")] },
  {
    id: "energie",
    title: { fr: "Énergie / Alimentation", en: "Energy / Power supply", ar: "الطاقة / التغذية" },
    options: [o("gaz", "Gaz", "Gas", "غاز"), o("electrique", "Électrique", "Electric", "كهربائي"), o("mixte", "Mixte", "Dual fuel", "مختلط")],
  },
  {
    id: "foyers",
    title: { fr: "Nombre de foyers", en: "Number of burners", ar: "عدد المواقد" },
    options: [o("2-foyers", "2 foyers", "2 burners", "موقدان"), o("4-foyers", "4 foyers", "4 burners", "4 مواقد"), o("5-foyers", "5 foyers", "5 burners", "5 مواقد")],
  },
  {
    id: "chargement",
    title: { fr: "Type de chargement", en: "Loading type", ar: "نوع التحميل" },
    options: [o("front", "Front", "Front-loading", "تحميل أمامي"), o("libre", "Libre", "Freestanding", "حر"), o("ouverture-dessus", "Ouverture par le dessus", "Top-loading", "فتح علوي")],
  },
  {
    id: "aspiration",
    title: { fr: "Type d'aspiration", en: "Suction type", ar: "نوع الشفط" },
    options: [o("avec-sac", "Avec sac", "Bagged", "بكيس"), o("sans-sac", "Sans sac", "Bagless", "بدون كيس"), o("sans-fil", "Sans fil", "Cordless", "لاسلكي")],
  },
  {
    id: "machine-cafe",
    title: { fr: "Type de machine à café", en: "Coffee machine type", ar: "نوع آلة القهوة" },
    options: [o("espresso", "Espresso", "Espresso", "إسبريسو"), o("filtre", "Filtre", "Filter", "فلتر"), o("capsules", "Capsules", "Capsules", "كبسولات")],
  },
  {
    id: "cuisson",
    title: { fr: "Fonctions de cuisson", en: "Cooking functions", ar: "وظائف الطهي" },
    options: [o("vapeur", "Avec fonction vapeur", "With steam function", "بوظيفة البخار"), o("grill", "Avec grill", "With grill", "بشواية"), o("convection", "Avec convection", "With convection", "بالحمل الحراري")],
  },
  {
    id: "temperature-eau",
    title: { fr: "Température de l'eau", en: "Water temperature", ar: "درجة حرارة الماء" },
    options: [o("eau-froide", "Eau froide", "Cold water", "ماء بارد"), o("eau-chaude", "Eau chaude", "Hot water", "ماء ساخن"), o("eau-ambiante", "Eau à température ambiante", "Room-temperature water", "ماء بدرجة حرارة الغرفة")],
  },
  {
    id: "hotte",
    title: { fr: "Type de hotte", en: "Hood type", ar: "نوع الشفّاط" },
    options: [o("casquette", "Casquette", "Canopy", "كاسكيت"), o("decorative", "Decorative", "Decorative", "ديكوري"), o("pyramid", "Pyramid", "Pyramid", "هرمي")],
  },
  { id: "moteur", title: { fr: "Type de moteur", en: "Motor type", ar: "نوع المحرّك" }, options: [o("mono", "Mono", "Single", "أحادي"), o("multi", "Multi", "Multi", "متعدد")] },
  {
    id: "consommable",
    title: { fr: "Type de consommable", en: "Consumable type", ar: "نوع المستهلكات" },
    options: [o("poudre-caps", "Poudre/CAPS", "Powder/CAPS", "مسحوق/كبسولات"), o("caps", "Caps", "Caps", "كبسولات")],
  },
]

export const ALL_CLASS_OPTIONS = CLASSIFICATION_GROUPS.flatMap((g) => g.options.map((opt) => ({ ...opt, group: g.id })))

/* ---------------- Gammes (14) : orthographe officielle ---------------- */
export type RangeId =
  | "gustiva" | "florenza" | "ephoria" | "la-mattina" | "spinova" | "lavexa" | "spinova-plus" | "lavexa-plus"
  | "estrela" | "estrela-s" | "t-vos" | "dustor" | "liva" | "eronex"

export const OFFICIAL_RANGES: Array<{ id: RangeId; name: string }> = [
  { id: "gustiva", name: "Gustiva" },
  { id: "florenza", name: "Florenza" },
  { id: "ephoria", name: "Ephoria" },
  { id: "la-mattina", name: "La Mattina" },
  { id: "spinova", name: "Spinova" },
  { id: "lavexa", name: "Lavexa" },
  { id: "spinova-plus", name: "Spinova +" },
  { id: "lavexa-plus", name: "Lavexa +" },
  { id: "estrela", name: "Estrela" },
  { id: "estrela-s", name: "Estrela S" },
  { id: "t-vos", name: "T-VOS" },
  { id: "dustor", name: "DUSTOR" },
  { id: "liva", name: "LIVA" },
  { id: "eronex", name: "ERONEX" },
]

/* ---------------- Capacités : unités toujours visibles ---------------- */
export type CapacityKind = "volume" | "lavage" | "couverts" | "puissance"
export interface OfficialCapacity { id: string; label: string; kind: CapacityKind; value: number }

const cap = (value: number, unit: string, kind: CapacityKind, id: string): OfficialCapacity => ({ id, label: `${value} ${unit}`, kind, value })

export const OFFICIAL_CAPACITIES: OfficialCapacity[] = [
  cap(8, "L", "volume", "8-l"), cap(20, "L", "volume", "20-l"), cap(25, "L", "volume", "25-l"), cap(30, "L", "volume", "30-l"),
  cap(50, "L", "volume", "50-l"), cap(60, "L", "volume", "60-l"), cap(65, "L", "volume", "65-l"), cap(80, "L", "volume", "80-l"),
  cap(85, "L", "volume", "85-l"), cap(100, "L", "volume", "100-l"),
  cap(10.5, "kg", "lavage", "10-5-kg"), cap(12, "kg", "lavage", "12-kg"),
  cap(14, "couverts", "couverts", "14-couverts"), cap(15, "couverts", "couverts", "15-couverts"),
  cap(120, "W", "puissance", "120-w"), cap(500, "W", "puissance", "500-w"), cap(1200, "W", "puissance", "1200-w"),
  cap(1400, "W", "puissance", "1400-w"), cap(2000, "W", "puissance", "2000-w"),
]

/** Une capacité n'a de sens que pour certaines sous-familles (évite « 14 couverts » sur une hotte, etc.). */
const CAPACITY_KINDS_BY_SUBFAMILY: Record<SubFamilyId, CapacityKind[]> = {
  "plaques-cuisson": ["puissance"],
  hottes: ["puissance"],
  cuisinieres: ["volume"],
  "micro-ondes": ["volume", "puissance"],
  "fours-pose-libre": ["volume", "puissance"],
  "lave-linge": ["lavage"],
  "lave-vaisselle": ["couverts"],
  "defroisseurs-vapeur": ["puissance", "volume"],
  aspirateurs: ["volume", "puissance"],
  "distributeurs-eau": ["puissance", "volume"],
  "chauffe-eau": ["volume"],
  "robots-petrins": ["volume", "puissance"],
  centrifugeuses: ["puissance", "volume"],
  "machines-cafe": ["puissance", "volume"],
}

/* ---------------- Couleurs (4) ---------------- */
export const OFFICIAL_COLORS: Array<{ id: string; name: L3 }> = [
  { id: "blanc", name: { fr: "Blanc", en: "White", ar: "أبيض" } },
  { id: "gris", name: { fr: "Gris", en: "Grey", ar: "رمادي" } },
  { id: "noir", name: { fr: "Noir", en: "Black", ar: "أسود" } },
  { id: "gris-fonce", name: { fr: "Gris foncé", en: "Dark grey", ar: "رمادي داكن" } },
]

/* ---------------- Connectivité (2) ---------------- */
export const OFFICIAL_CONNECTIVITY: Array<{ id: "wifi" | "bluetooth"; name: string }> = [
  { id: "wifi", name: "Wi-Fi" },
  { id: "bluetooth", name: "Bluetooth" },
]

/* =====================================================================
   Rattachement d'un produit du CMS à la classification officielle.
   Aucune donnée n'est inventée : tout provient des champs réels du produit.
   Hors périmètre de cette mise à jour (§9) : réfrigérateurs, congélateurs, climatiseurs,
   fours encastrables, chauffe-bains (et tout produit sans sous-famille officielle).
   ===================================================================== */

export interface CatalogProductLike {
  id?: string
  name?: unknown
  category?: string
  famille?: string | null
  sousFamille?: string | null
  gamme?: string | null
  capacites?: string[] | null
  couleurs?: string[] | null
  capacity?: unknown
  color?: unknown
  wifi?: boolean
  bluetooth?: boolean
  classifications?: string[] | null
}

export interface CatalogInfo {
  sousFamille?: SubFamilyId
  family?: FamilyId
  /** Produit hors périmètre officiel : jamais affiché. */
  excluded: boolean
  range?: RangeId
  capacities: string[]
  colors: string[]
  wifi: boolean
  bluetooth: boolean
  classifications: string[]
}

const norm = (v: unknown): string =>
  String(typeof v === "string" ? v : v && typeof v === "object" ? ((v as { fr?: string }).fr ?? "") : (v ?? ""))
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
const slug = (v: unknown) => norm(v).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")

const SUBFAMILY_IDS = new Set<string>(OFFICIAL_SUBFAMILIES.map((s) => s.id))

/** Famille CMS (ancien système) → sous-famille officielle ; `null` = hors périmètre. */
function mapSubFamily(p: CatalogProductLike): { id?: SubFamilyId; excluded: boolean } {
  const fam = slug(p.famille)
  const sf = slug(p.sousFamille)
  const name = norm(p.name)

  if (SUBFAMILY_IDS.has(fam)) return { id: fam as SubFamilyId, excluded: false }
  if (SUBFAMILY_IDS.has(sf)) return { id: sf as SubFamilyId, excluded: false }

  if (["refrigerateurs", "congelateurs", "climatiseurs", "purificateurs-air", "chauffe-bain"].includes(fam)) return { excluded: true }
  if (/refrigerat|congelat|climatis|chauffe-?bain|purificat/.test(name)) return { excluded: true }
  if (fam === "fours") {
    if (/encastr/.test(sf) || /encastr/.test(name)) return { excluded: true }
    return { id: "fours-pose-libre", excluded: false }
  }
  const direct: Record<string, SubFamilyId> = {
    hottes: "hottes", cuisinieres: "cuisinieres", "micro-ondes": "micro-ondes", "plaques-cuisson": "plaques-cuisson",
    "lave-linge": "lave-linge", "lave-vaisselle": "lave-vaisselle", "defroisseurs-vapeur": "defroisseurs-vapeur",
    defroisseurs: "defroisseurs-vapeur", aspirateurs: "aspirateurs", "fontaines-eau": "distributeurs-eau",
    "distributeurs-eau": "distributeurs-eau", cumulus: "chauffe-eau", "chauffe-eau": "chauffe-eau",
    petrins: "robots-petrins", centrifugeuses: "centrifugeuses", cafetieres: "machines-cafe",
  }
  if (direct[fam]) return { id: direct[fam], excluded: false }

  // Repli sur le nom du produit quand la famille CMS est absente.
  if (/encastrable/.test(name) && /four/.test(name)) return { excluded: true }
  const byName: Array<[RegExp, SubFamilyId]> = [
    [/four/, "fours-pose-libre"], [/hotte/, "hottes"], [/cuisiniere/, "cuisinieres"], [/micro-?onde/, "micro-ondes"],
    [/plaque/, "plaques-cuisson"], [/lave-?linge/, "lave-linge"], [/lave-?vaisselle/, "lave-vaisselle"],
    [/defroiss/, "defroisseurs-vapeur"], [/aspirateur/, "aspirateurs"], [/fontaine|distributeur/, "distributeurs-eau"],
    [/cumulus|chauffe-eau/, "chauffe-eau"], [/petrin|robot/, "robots-petrins"], [/centrifug|extracteur/, "centrifugeuses"],
    [/cafetiere|machine a cafe|expresso/, "machines-cafe"],
  ]
  for (const [re, id] of byName) if (re.test(name)) return { id, excluded: false }
  return { excluded: false }
}

const RANGE_ALIASES: Record<string, RangeId> = {
  gustiva: "gustiva", florenza: "florenza", ephoria: "ephoria", "la-mattina": "la-mattina", lamattina: "la-mattina",
  spinova: "spinova", lavexa: "lavexa", "spinova-plus": "spinova-plus", "spinova+": "spinova-plus", "lavexa-plus": "lavexa-plus", "lavexa+": "lavexa-plus",
  estrela: "estrela", "estrela-s": "estrela-s", "t-vos": "t-vos", "t-vox": "t-vos", tvos: "t-vos", dustor: "dustor", liva: "liva", eronex: "eronex",
}

function mapCapacities(p: CatalogProductLike, sub?: SubFamilyId): string[] {
  const allowed = sub ? CAPACITY_KINDS_BY_SUBFAMILY[sub] : []
  const wanted = new Set<string>()
  const candidates: string[] = [...(p.capacites ?? []).map((c) => slug(c))]
  const legacy = norm(p.capacity).replace(",", ".")
  const m = legacy.match(/(\d+(?:\.\d+)?)\s*(l|kg|w|couverts?)/)
  if (m) candidates.push(slug(`${m[1].replace(".", "-")}-${m[2].replace(/^couvert$/, "couverts")}`))
  for (const id of candidates) {
    const found = OFFICIAL_CAPACITIES.find((c) => c.id === id)
    if (found && allowed.includes(found.kind)) wanted.add(found.id)
  }
  return OFFICIAL_CAPACITIES.filter((c) => wanted.has(c.id)).map((c) => c.id)
}

function mapColors(p: CatalogProductLike): string[] {
  const ids = new Set<string>()
  for (const c of p.couleurs ?? []) {
    const s = slug(c)
    if (OFFICIAL_COLORS.some((x) => x.id === s)) ids.add(s)
  }
  if (ids.size === 0) {
    const s = slug(p.color)
    if (OFFICIAL_COLORS.some((x) => x.id === s)) ids.add(s)
  }
  return OFFICIAL_COLORS.filter((c) => ids.has(c.id)).map((c) => c.id)
}

function mapClassifications(p: CatalogProductLike, sub?: SubFamilyId): string[] {
  const out = new Set<string>()
  const sf = slug(p.sousFamille)
  const gm = slug(p.gamme)
  const fam = slug(p.famille)
  const name = norm(p.name)

  if (/pose-libre|fours-pose|micro-ondes-libre|micro-ondes-pose|^libre$/.test(sf) || sub === "fours-pose-libre" || /pose libre/.test(name)) out.add("pose-libre")

  // Énergie / alimentation
  if (/elec-gaz|mixte/.test(`${gm} ${sf}`) || /elec-gaz/.test(name.replace(/\s+/g, "-"))) out.add("mixte")
  else if (/gaz-gaz|cuisinieres-gaz|^gaz$/.test(`${gm}`) || /cuisinieres-gaz|chauffe-bain-gaz/.test(sf)) out.add("gaz")
  else if (/elec-elec|electrique|cuisinieres-electriques/.test(`${gm} ${sf}`) || gm === "elec") out.add("electrique")

  // Nombre de foyers
  const feux = sf.match(/(\d)-feux/) ?? slug(p.name).match(/(\d)-feux/)
  if (feux && ["2", "4", "5"].includes(feux[1])) out.add(`${feux[1]}-foyers`)

  // Type de chargement
  if (sf === "lave-linge-frontal") out.add("front")
  if (sf === "lave-linge-top") out.add("ouverture-dessus")

  // Aspiration
  if (sub === "aspirateurs") {
    if (/sans-fil/.test(`${gm} ${sf}`)) out.add("sans-fil")
    else if (/avec-sac|aspirateurs-sac$/.test(`${gm} ${sf}`)) out.add("avec-sac")
    else if (/sans-sac/.test(`${gm} ${sf}`)) out.add("sans-sac")
  }

  // Machines à café
  if (sf === "cafetieres-expresso") out.add("espresso")
  if (sf === "cafetieres-filtre") out.add("filtre")
  if (gm === "poudre-caps") out.add("poudre-caps")
  if (fam === "cafetieres" && /capsule/.test(name) && !out.has("poudre-caps")) out.add("capsules")

  // Hottes
  if (sf === "hottes-casquette") out.add("casquette")
  if (sf === "hottes-decoratives") out.add("decorative")
  if (sf === "hottes-pyramid") out.add("pyramid")

  // Moteur (robots pétrins)
  if (sf === "petrins-mono") out.add("mono")
  if (sf === "petrins-multi") out.add("multi")

  // Classifications saisies explicitement dans le CMS (identifiants officiels uniquement)
  for (const c of p.classifications ?? []) if (ALL_CLASS_OPTIONS.some((x) => x.id === c)) out.add(c)

  return ALL_CLASS_OPTIONS.filter((x) => out.has(x.id)).map((x) => x.id)
}

const cache = new WeakMap<object, CatalogInfo>()

export function catalogInfoOf(p: CatalogProductLike): CatalogInfo {
  const hit = cache.get(p)
  if (hit) return hit
  const { id: sub, excluded } = mapSubFamily(p)
  const range = RANGE_ALIASES[slug(p.gamme)]
  const info: CatalogInfo = {
    sousFamille: sub,
    family: sub ? OFFICIAL_SUBFAMILIES.find((s) => s.id === sub)?.family : undefined,
    excluded,
    range,
    capacities: mapCapacities(p, sub),
    colors: mapColors(p),
    // Wi-Fi / Bluetooth uniquement si le produit les possède réellement (champs explicites).
    wifi: p.wifi === true,
    bluetooth: p.bluetooth === true,
    classifications: mapClassifications(p, sub),
  }
  cache.set(p, info)
  return info
}

/** Un produit n'est affiché que s'il appartient à une sous-famille officielle et n'est pas exclu. */
export function isCatalogProduct(p: CatalogProductLike): boolean {
  const info = catalogInfoOf(p)
  return !info.excluded && !!info.sousFamille
}

export const familyById = (id?: string) => OFFICIAL_FAMILIES.find((f) => f.id === id)
export const subFamilyById = (id?: string) => OFFICIAL_SUBFAMILIES.find((s) => s.id === id)
export const rangeById = (id?: string) => OFFICIAL_RANGES.find((r) => r.id === id)
export const capacityById = (id: string) => OFFICIAL_CAPACITIES.find((c) => c.id === id)
export const colorById = (id: string) => OFFICIAL_COLORS.find((c) => c.id === id)
export const classOptionById = (id: string) => ALL_CLASS_OPTIONS.find((c) => c.id === id)
