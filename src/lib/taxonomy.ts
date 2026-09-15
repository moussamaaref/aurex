import { ml, type Localized } from "./ml"

/* =====================================================================
   Hiérarchie produit officielle AUREX :
   Catégorie → Famille → Sous-famille → Gamme → Produit (+ Capacités, Couleurs)
   ===================================================================== */

/** Slug normalisé (ids stables pour URLs, filtres et relations). */
export function slugify(value: unknown): string {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export interface Famille {
  slug: string
  categorySlug: string
  name: Localized
  description?: Localized
  image?: string
  sort_order?: number
  is_active?: boolean
}

export interface SousFamille {
  slug: string
  familleSlug: string
  name: Localized
  description?: Localized
  image?: string
  sort_order?: number
  is_active?: boolean
}

export interface Gamme {
  slug: string
  sousFamilleSlug: string
  name: Localized
  description?: Localized
  image?: string
  sort_order?: number
  is_active?: boolean
}

export interface Capacite {
  slug: string
  name: Localized
  value?: string
  unit?: string
  sort_order?: number
  is_active?: boolean
}

export interface Couleur {
  slug: string
  name: Localized
  hex_code?: string | null
  image?: string
  sort_order?: number
  is_active?: boolean
}

/** Champs taxonomiques portés par un produit (avenants aux champs legacy). */
export interface ProductTaxonomy {
  famille?: string | null
  sousFamille?: string | null
  gamme?: string | null
  capacites?: string[] | null
  couleurs?: string[] | null
  slug?: string | null
}

/** Valeur d'attribut multi (capacités / couleurs) résolue pour affichage. */
export interface TaxoValue {
  id: string
  label: Localized
}

const L = (fr: string): Localized => ({ fr, ar: "", en: "" })

/* ---------------- Données de référence (fallback si CMS vide) ---------------- */

export const defaultFamilles: Famille[] = [
  { slug: "lave-linge", categorySlug: "lavage", name: L("Lave-linge") },
  { slug: "lave-vaisselle", categorySlug: "lave-vaisselle", name: L("Lave-vaisselle") },
  { slug: "petrins", categorySlug: "petit-electromenager", name: L("Pétrins") },
  { slug: "cafetieres", categorySlug: "petit-electromenager", name: L("Cafetières") },
  { slug: "cumulus", categorySlug: "chauffe-eau", name: L("Cumulus") },
  { slug: "chauffe-bain", categorySlug: "chauffe-eau", name: L("Chauffe-bain") },
  { slug: "aspirateurs", categorySlug: "entretien-maison", name: L("Aspirateurs") },
  { slug: "purificateurs-air", categorySlug: "entretien-maison", name: L("Purificateurs d'air") },
  { slug: "fontaines-eau", categorySlug: "fontaines", name: L("Fontaines à eau") },
  { slug: "fours", categorySlug: "cuisson", name: L("Fours") },
  { slug: "hottes", categorySlug: "cuisson", name: L("Hottes aspirantes") },
  { slug: "micro-ondes", categorySlug: "cuisson", name: L("Micro-ondes") },
  { slug: "cuisinieres", categorySlug: "cuisson", name: L("Cuisinières") },
  { slug: "refrigerateurs", categorySlug: "autres", name: L("Réfrigérateurs") },
  { slug: "climatiseurs", categorySlug: "autres", name: L("Climatiseurs") },
]

export const defaultSousFamilles: SousFamille[] = [
  { slug: "lave-linge-frontal", familleSlug: "lave-linge", name: L("Lave-linge frontal") },
  { slug: "lave-linge-top", familleSlug: "lave-linge", name: L("Lave-linge top") },
  { slug: "lave-vaisselle-encastrable", familleSlug: "lave-vaisselle", name: L("Encastrable") },
  { slug: "lave-vaisselle-pose-libre", familleSlug: "lave-vaisselle", name: L("Pose libre") },
  { slug: "petrins-planetaire", familleSlug: "petrins", name: L("Planétaire") },
  { slug: "cafetieres-filtre", familleSlug: "cafetieres", name: L("Filtre") },
  { slug: "cafetieres-expresso", familleSlug: "cafetieres", name: L("Expresso") },
  { slug: "cumulus-electrique", familleSlug: "cumulus", name: L("Électrique") },
  { slug: "chauffe-bain-gaz", familleSlug: "chauffe-bain", name: L("Gaz") },
  { slug: "aspirateurs-sac", familleSlug: "aspirateurs", name: L("Avec sac") },
  { slug: "aspirateurs-sans-sac", familleSlug: "aspirateurs", name: L("Sans sac") },
  { slug: "aspirateurs-sans-fil", familleSlug: "aspirateurs", name: L("Sans fil") },
  { slug: "purificateurs-hepa", familleSlug: "purificateurs-air", name: L("HEPA") },
  { slug: "fontaines-domestiques", familleSlug: "fontaines-eau", name: L("Domestiques") },
  { slug: "fours-encastrables", familleSlug: "fours", name: L("Encastrables") },
  { slug: "fours-pose", familleSlug: "fours", name: L("À poser") },
  { slug: "hottes-decoratives", familleSlug: "hottes", name: L("Décoratives") },
  { slug: "micro-ondes-pose", familleSlug: "micro-ondes", name: L("À poser") },
  { slug: "cuisinieres-gaz", familleSlug: "cuisinieres", name: L("Gaz") },
  { slug: "cuisinieres-electriques", familleSlug: "cuisinieres", name: L("Électriques") },
  { slug: "cuisinieres-mixtes", familleSlug: "cuisinieres", name: L("Mixtes") },
  { slug: "refrigerateurs-combines", familleSlug: "refrigerateurs", name: L("Combinés") },
  { slug: "refrigerateurs-americains", familleSlug: "refrigerateurs", name: L("Américains") },
  { slug: "climatiseurs-split", familleSlug: "climatiseurs", name: L("Split") },
  { slug: "climatiseurs-mobiles", familleSlug: "climatiseurs", name: L("Mobiles") },
  { slug: "cuisinieres-4-feux", familleSlug: "cuisinieres", name: L("4 Feux") },
  { slug: "hottes-casquette", familleSlug: "hottes", name: L("Casquette") },
  { slug: "hottes-pyramid", familleSlug: "hottes", name: L("Pyramide") },
  { slug: "micro-ondes-libre", familleSlug: "micro-ondes", name: L("Pose libre") },
  { slug: "cafetieres-multi", familleSlug: "cafetieres", name: L("Multi") },
  { slug: "petrins-mono", familleSlug: "petrins", name: L("Mono") },
  { slug: "petrins-multi", familleSlug: "petrins", name: L("Multi") },
  { slug: "aspirateurs-professionnels", familleSlug: "aspirateurs", name: L("Professionnels") },
  { slug: "aspirateurs-poussiere", familleSlug: "aspirateurs", name: L("Poussière") },
  { slug: "aspirateurs-bali", familleSlug: "aspirateurs", name: L("Bali") },
  { slug: "fontaines-mecanique", familleSlug: "fontaines-eau", name: L("Mécanique") },
  { slug: "fontaines-digital", familleSlug: "fontaines-eau", name: L("Digitale") },
]

export const defaultGammes: Gamme[] = [
  { slug: "spinova", sousFamilleSlug: "lave-linge-frontal", name: L("Spinova") },
  { slug: "spinova-plus", sousFamilleSlug: "lave-linge-frontal", name: L("Spinova+") },
  { slug: "lavexa", sousFamilleSlug: "lave-linge-frontal", name: L("Lavexa") },
  { slug: "lavexa-plus", sousFamilleSlug: "lave-linge-frontal", name: L("Lavexa+") },
  { slug: "estrela", sousFamilleSlug: "lave-vaisselle-encastrable", name: L("Estrela") },
  { slug: "estrela-s", sousFamilleSlug: "lave-vaisselle-encastrable", name: L("Estrela S") },
  { slug: "gustiva", sousFamilleSlug: "petrins-planetaire", name: L("Gustiva") },
  { slug: "florenza", sousFamilleSlug: "cafetieres-expresso", name: L("Florenza") },
  { slug: "t-vox", sousFamilleSlug: "aspirateurs-sans-sac", name: L("T-Vox") },
  { slug: "eronex", sousFamilleSlug: "aspirateurs-sans-fil", name: L("Eronex") },
  { slug: "dustor", sousFamilleSlug: "aspirateurs-sac", name: L("Dustor") },
  { slug: "liva", sousFamilleSlug: "aspirateurs-sans-sac", name: L("Liva") },
  { slug: "excellence", sousFamilleSlug: "fours-encastrables", name: L("Excellence") },
  { slug: "freshcool", sousFamilleSlug: "refrigerateurs-combines", name: L("FreshCool") },
  { slug: "inverter-plus", sousFamilleSlug: "climatiseurs-split", name: L("Inverter+") },
  { slug: "pure-air", sousFamilleSlug: "purificateurs-hepa", name: L("Pure Air") },
  { slug: "big", sousFamilleSlug: "fours-pose", name: L("Big") },
  { slug: "gaz-gaz", sousFamilleSlug: "fours-encastrables", name: L("Gaz-Gaz") },
  { slug: "elec-gaz-four", sousFamilleSlug: "fours-encastrables", name: L("Elec-Gaz") },
  { slug: "elec-elec", sousFamilleSlug: "fours-encastrables", name: L("Elec-Elec") },
  { slug: "elec-gaz-cuisiniere", sousFamilleSlug: "cuisinieres-4-feux", name: L("Elec-Gaz") },
  { slug: "inox-casquette", sousFamilleSlug: "hottes-casquette", name: L("Inox") },
  { slug: "glass", sousFamilleSlug: "hottes-decoratives", name: L("Glass") },
  { slug: "inox-pyramid", sousFamilleSlug: "hottes-pyramid", name: L("Inox") },
  { slug: "digitale-micro-ondes", sousFamilleSlug: "micro-ondes-libre", name: L("Digitale") },
  { slug: "mecanique-micro-ondes", sousFamilleSlug: "micro-ondes-libre", name: L("Mécanique") },
  { slug: "tactile-lave-linge", sousFamilleSlug: "lave-linge-frontal", name: L("Tactile") },
  { slug: "rotative-lave-linge", sousFamilleSlug: "lave-linge-frontal", name: L("Rotative") },
  { slug: "digitale-lave-vaisselle", sousFamilleSlug: "lave-vaisselle-pose-libre", name: L("Digitale") },
  { slug: "poudre-caps", sousFamilleSlug: "cafetieres-multi", name: L("Poudre + capsules") },
  { slug: "rotative-petrins", sousFamilleSlug: "petrins-mono", name: L("Rotative") },
  { slug: "digitale-petrins", sousFamilleSlug: "petrins-mono", name: L("Digitale") },
  { slug: "rotative-petrins-multi", sousFamilleSlug: "petrins-multi", name: L("Rotative") },
  { slug: "elec", sousFamilleSlug: "cumulus-electrique", name: L("Elec") },
  { slug: "gaz", sousFamilleSlug: "chauffe-bain-gaz", name: L("Gaz") },
  { slug: "sans-sac", sousFamilleSlug: "aspirateurs-poussiere", name: L("Sans sac") },
  { slug: "avec-sac", sousFamilleSlug: "aspirateurs-poussiere", name: L("Avec sac") },
  { slug: "sans-fil", sousFamilleSlug: "aspirateurs-bali", name: L("Sans fil") },
  { slug: "mecanique", sousFamilleSlug: "fontaines-mecanique", name: L("Mécanique") },
  { slug: "digitale", sousFamilleSlug: "fontaines-digital", name: L("Digitale") },
]

export const defaultCapacites: Capacite[] = [
  { slug: "7-kg", name: L("7 KG"), value: "7", unit: "KG" },
  { slug: "8-kg", name: L("8 KG"), value: "8", unit: "KG" },
  { slug: "9-kg", name: L("9 KG"), value: "9", unit: "KG" },
  { slug: "10-5-kg", name: L("10.5 KG"), value: "10.5", unit: "KG" },
  { slug: "12-kg", name: L("12 KG"), value: "12", unit: "KG" },
  { slug: "30-l", name: L("30 L"), value: "30", unit: "L" },
  { slug: "50-l", name: L("50 L"), value: "50", unit: "L" },
  { slug: "85-l", name: L("85 L"), value: "85", unit: "L" },
  { slug: "70-l", name: L("70 L"), value: "70", unit: "L" },
  { slug: "350-l", name: L("350 L"), value: "350", unit: "L" },
  { slug: "14-couverts", name: L("14 couverts"), value: "14", unit: "couverts" },
  { slug: "24000-btu", name: L("24 000 BTU"), value: "24000", unit: "BTU" },
  { slug: "65-m2", name: L("65 m²"), value: "65", unit: "m²" },
  { slug: "65-l", name: L("65 L"), value: "65", unit: "L" },
  { slug: "60-l", name: L("60 L"), value: "60", unit: "L" },
  { slug: "25-l", name: L("25 L"), value: "25", unit: "L" },
  { slug: "20-l", name: L("20 L"), value: "20", unit: "L" },
  { slug: "8-l", name: L("8 L"), value: "8", unit: "L" },
  { slug: "15-couverts", name: L("15 couverts"), value: "15", unit: "couverts" },
  { slug: "80-l", name: L("80 L"), value: "80", unit: "L" },
  { slug: "100-l", name: L("100 L"), value: "100", unit: "L" },
  { slug: "1400-w", name: L("1400 W"), value: "1400", unit: "W" },
  { slug: "2000-w", name: L("2000 W"), value: "2000", unit: "W" },
  { slug: "1200-w", name: L("1200 W"), value: "1200", unit: "W" },
  { slug: "120-w", name: L("120 W"), value: "120", unit: "W" },
  { slug: "500-w", name: L("500 W"), value: "500", unit: "W" },
  { slug: "60-cm", name: L("60 cm"), value: "60", unit: "cm" },
]

export const defaultCouleurs: Couleur[] = [
  { slug: "blanc", name: L("Blanc"), hex_code: "#FFFFFF" },
  { slug: "noir", name: L("Noir"), hex_code: "#111111" },
  { slug: "silver", name: L("Silver"), hex_code: "#C0C0C0" },
  { slug: "inox", name: L("Inox"), hex_code: "#B8BCC0" },
  { slug: "inox-noir", name: L("Inox/Noir"), hex_code: "#3A3F44" },
  { slug: "gris", name: L("Gris"), hex_code: "#6B7280" },
  { slug: "gris-fonce", name: L("Gris foncé"), hex_code: "#4B5563" },
  { slug: "noir-jaune", name: L("Noir et jaune"), hex_code: null },
  { slug: "noir-rouge", name: L("Noir et rouge"), hex_code: null },
  { slug: "blanc-noir", name: L("Blanc et noir"), hex_code: null },
  { slug: "blanc-gris", name: L("Blanc et gris"), hex_code: null },
]

/** Correspondance taxonomique des produits historiques (avant saisie back-office). */
export const PRODUCT_TAXONOMY_FALLBACK: Record<
  string,
  { famille: string; sousFamille: string; gamme: string; capacites: string[]; couleurs: string[] }
> = {
  "ex9000-wm": { famille: "lave-linge", sousFamille: "lave-linge-frontal", gamme: "spinova-plus", capacites: ["9-kg"], couleurs: ["blanc"] },
  "ex5000-wm": { famille: "lave-linge", sousFamille: "lave-linge-frontal", gamme: "lavexa", capacites: ["7-kg"], couleurs: ["blanc"] },
  "ex8000-oven": { famille: "fours", sousFamille: "fours-encastrables", gamme: "excellence", capacites: ["70-l"], couleurs: ["inox-noir"] },
  "ex5500-dw": { famille: "lave-vaisselle", sousFamille: "lave-vaisselle-encastrable", gamme: "estrela", capacites: ["14-couverts"], couleurs: ["inox"] },
  "ex6000-ac": { famille: "climatiseurs", sousFamille: "climatiseurs-split", gamme: "inverter-plus", capacites: ["24000-btu"], couleurs: ["blanc"] },
  "ex7000-fridge": { famille: "refrigerateurs", sousFamille: "refrigerateurs-combines", gamme: "freshcool", capacites: ["350-l"], couleurs: ["inox"] },
  "ex4000-purifier": { famille: "purificateurs-air", sousFamille: "purificateurs-hepa", gamme: "pure-air", capacites: ["65-m2"], couleurs: ["blanc"] },
}

/* ---------------- Résolution (champs explicites → fallback → legacy) ---------------- */

type LegacyProduct = ProductTaxonomy & {
  id?: string
  subcategory?: Localized
  capacity?: Localized
  color?: Localized
}

function asArray(v: unknown): string[] {
  return Array.isArray(v) ? v.map((x) => String(x)).filter(Boolean) : []
}

function matchEntry<T extends { slug: string; name: Localized }>(list: T[], raw: unknown): T | undefined {
  if (!raw) return undefined
  if (typeof raw === "string") {
    const s = raw.toLowerCase().trim()
    return list.find((e) => e.slug.toLowerCase() === s)
  }
  if (typeof raw === "object") {
    const l = ml(raw as Localized).toLowerCase().trim()
    const s = slugify(l)
    return list.find((e) => e.slug.toLowerCase() === s || ml(e.name).toLowerCase().trim() === l)
  }
  return undefined
}

function legacySubMatch<T extends { slug: string; name: Localized }>(list: T[], p: LegacyProduct): T | undefined {
  const sub = ml(p.subcategory).trim()
  if (!sub) return undefined
  const l = sub.toLowerCase()
  const s = slugify(sub)
  return list.find((e) => e.slug.toLowerCase() === s || ml(e.name).toLowerCase().trim() === l)
}

export function resolveFamille<T extends Famille>(p: LegacyProduct, familles: T[]): T | undefined {
  return (
    matchEntry(familles, p.famille) ??
    (p.id ? matchEntry(familles, PRODUCT_TAXONOMY_FALLBACK[p.id]?.famille) : undefined)
  )
}

export function resolveSousFamille<T extends SousFamille>(p: LegacyProduct, sousFamilles: T[]): T | undefined {
  return (
    matchEntry(sousFamilles, p.sousFamille) ??
    (p.id ? matchEntry(sousFamilles, PRODUCT_TAXONOMY_FALLBACK[p.id]?.sousFamille) : undefined) ??
    legacySubMatch(sousFamilles, p)
  )
}

export function resolveGamme<T extends Gamme>(p: LegacyProduct, gammes: T[]): T | undefined {
  return (
    matchEntry(gammes, p.gamme) ??
    (p.id ? matchEntry(gammes, PRODUCT_TAXONOMY_FALLBACK[p.id]?.gamme) : undefined) ??
    legacySubMatch(gammes, p)
  )
}

function toTaxoValues(ids: string[], list: Array<{ slug: string; name: Localized }>): TaxoValue[] {
  return ids
    .map((id) => {
      const s = String(id).toLowerCase().trim()
      const found = list.find((e) => e.slug.toLowerCase() === s)
      if (found) return { id: found.slug, label: found.name }
      return null
    })
    .filter((v): v is TaxoValue => v !== null)
}

/** Capacités : ids explicites → fallback historique → chaîne legacy (pseudo-valeur). */
export function resolveCapacites<T extends { slug: string; name: Localized }>(
  p: LegacyProduct,
  capacites: T[],
): TaxoValue[] {
  const explicit = toTaxoValues(asArray(p.capacites), capacites)
  if (explicit.length > 0) return explicit
  if (p.id) {
    const fb = toTaxoValues(PRODUCT_TAXONOMY_FALLBACK[p.id]?.capacites ?? [], capacites)
    if (fb.length > 0) return fb
  }
  const legacy = ml(p.capacity).trim()
  if (legacy) {
    const byLabel = capacites.find((c) => ml(c.name).toLowerCase().trim() === legacy.toLowerCase())
    if (byLabel) return [{ id: byLabel.slug, label: byLabel.name }]
    return [{ id: `legacy:${slugify(legacy) || "na"}`, label: legacy }]
  }
  return []
}

/** Couleurs : ids explicites → fallback historique → chaîne legacy (pseudo-valeur). */
export function resolveCouleurs<T extends { slug: string; name: Localized }>(
  p: LegacyProduct,
  couleurs: T[],
): TaxoValue[] {
  const explicit = toTaxoValues(asArray(p.couleurs), couleurs)
  if (explicit.length > 0) return explicit
  if (p.id) {
    const fb = toTaxoValues(PRODUCT_TAXONOMY_FALLBACK[p.id]?.couleurs ?? [], couleurs)
    if (fb.length > 0) return fb
  }
  const legacy = ml(p.color).trim()
  if (legacy) {
    const byLabel = couleurs.find((c) => ml(c.name).toLowerCase().trim() === legacy.toLowerCase())
    if (byLabel) return [{ id: byLabel.slug, label: byLabel.name }]
    return [{ id: `legacy:${slugify(legacy) || "na"}`, label: legacy }]
  }
  return []
}

/* ---------------- URLs hiérarchiques ---------------- */

export interface ProductPath {
  categorySlug: string
  familleSlug?: string
  sousFamilleSlug?: string
  gammeSlug?: string
  productSlug: string
}

export function productSlugOf(p: { id?: string; slug?: string | null; name?: Localized }): string {
  const explicit = typeof p.slug === "string" && p.slug.trim() ? p.slug.trim() : ""
  if (explicit) return slugify(explicit) || String(p.id ?? "")
  const fromName = slugify(ml(p.name))
  return fromName || String(p.id ?? "")
}

/** Chemin hiérarchique complet si la taxonomie est connue, sinon chemin legacy. */
export function productPath(
  p: LegacyProduct & { id?: string; category?: string; slug?: string | null; name?: Localized },
  ctx: { famille?: string; sousFamille?: string; gamme?: string; categorySlug?: string },
): string {
  const categorySlug = (ctx.categorySlug ?? String(p.category ?? "").toLowerCase().trim()).toLowerCase()
  const slug = productSlugOf(p)
  if (ctx.famille && ctx.sousFamille && ctx.gamme && categorySlug) {
    return `/produits/${categorySlug}/${ctx.famille}/${ctx.sousFamille}/${ctx.gamme}/${slug}`
  }
  return `/produits/${categorySlug || "autres"}/${p.id ?? slug}`
}

/** Validation produit (back-office) : retourne la liste des erreurs FR.
 *  Gamme non bloquante (données réelles parfois sans gamme) : le front masque le niveau absent. */
export function validateProductTaxonomy(p: Record<string, unknown>): string[] {
  const errors: string[] = []
  const str = (v: unknown) => String(v ?? "").trim()
  if (!str(p.category ?? p.category_slug)) errors.push("Catégorie obligatoire")
  if (!str(p.famille)) errors.push("Famille obligatoire")
  if (!str(p.sousFamille ?? p.sous_famille)) errors.push("Sous-famille obligatoire")
  if (!str(p.name)) errors.push("Nom obligatoire")
  if (!str(p.reference)) errors.push("Référence obligatoire")
  return errors
}
