import { ml, type Localized } from "./ml"
import { catalogInfoOf } from "./catalog"

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

/** Ancienne liste supprimée (classification officielle : src/lib/catalog.ts). */
export const defaultFamilles: Famille[] = []

/** Ancienne liste supprimée (classification officielle : src/lib/catalog.ts). */
export const defaultSousFamilles: SousFamille[] = []

/** Ancienne liste supprimée (classification officielle : src/lib/catalog.ts). */
export const defaultGammes: Gamme[] = []

/** Ancienne liste supprimée (classification officielle : src/lib/catalog.ts). */
export const defaultCapacites: Capacite[] = []

/** Ancienne liste supprimée (classification officielle : src/lib/catalog.ts). */
export const defaultCouleurs: Couleur[] = []

/** Correspondance taxonomique des produits historiques (avant saisie back-office). */
export const PRODUCT_TAXONOMY_FALLBACK: Record<
  string,
  { famille: string; sousFamille: string; gamme: string; capacites: string[]; couleurs: string[] }
> = {}

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
    return list.find((e) => String(e.slug ?? "").toLowerCase() === s)
  }
  if (typeof raw === "object") {
    const l = ml(raw as Localized).toLowerCase().trim()
    const s = slugify(l)
    return list.find((e) => String(e.slug ?? "").toLowerCase() === s || ml(e.name).toLowerCase().trim() === l)
  }
  return undefined
}

function legacySubMatch<T extends { slug: string; name: Localized }>(list: T[], p: LegacyProduct): T | undefined {
  const sub = ml(p.subcategory).trim()
  if (!sub) return undefined
  const l = sub.toLowerCase()
  const s = slugify(sub)
  return list.find((e) => String(e.slug ?? "").toLowerCase() === s || ml(e.name).toLowerCase().trim() === l)
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
      const found = list.find((e) => String(e.slug ?? "").toLowerCase() === s)
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
 *  Sous-famille officielle obligatoire dans le champ « sousFamille » (ex. machines-cafe) ; les produits hors
 *  périmètre (réfrigérateurs, climatiseurs, fours encastrables, chauffe-bains) restent acceptés mais jamais affichés. */
export function validateProductTaxonomy(p: Record<string, unknown>): string[] {
  const errors: string[] = []
  const str = (v: unknown) => String(v ?? "").trim()
  if (!str(p.name)) errors.push("Nom obligatoire")
  if (!str(p.reference)) errors.push("Référence obligatoire")
  const info = catalogInfoOf({
    id: str(p.id),
    name: p.name,
    famille: str(p.famille ?? p.famille_id),
    sousFamille: str(p.sousFamille ?? p.sous_famille ?? p.sous_famille_id),
    gamme: str(p.gamme ?? p.gamme_id),
  })
  if (!info.sousFamille && !info.excluded) errors.push("Sous-famille officielle obligatoire (voir AUREX Web Site Brief : ex. machines-cafe, robots-petrins, aspirateurs, fours-pose-libre)")
  return errors
}

/* ---------------- Catégories officielles (AUREX Web Site Brief final) ----------------
   4 familles. Les anciens slugs (CMS / URLs historiques) sont ramenés vers ces familles par CATEGORY_ALIASES ;
   les rubriques abandonnées (réfrigération, climatisation, traitement de l'air…) n'ont plus de catégorie. */

export const CATEGORY_SLUGS = {
  cuisine: "cuisine-encastrable",
  linge: "lavage-entretien",
  eau: "eau-confort",
  petit: "petit-electromenager",
} as const

export const CATEGORY_ALIASES: Record<string, string> = {
  cuisson: CATEGORY_SLUGS.cuisine,
  encastrable: CATEGORY_SLUGS.cuisine,
  lavage: CATEGORY_SLUGS.linge,
  "lave-vaisselle": CATEGORY_SLUGS.linge,
  "entretien-maison": CATEGORY_SLUGS.linge,
  "soin-linge-entretien": CATEGORY_SLUGS.linge,
  "chauffe-eau": CATEGORY_SLUGS.eau,
  fontaines: CATEGORY_SLUGS.eau,
  "petit-electro-coffee": CATEGORY_SLUGS.petit,
  // Hors périmètre : plus de catégorie
  "refrigeration-conservation": "",
  refrigerateurs: "",
  autres: "",
  climatisation: "",
  "traitement-air": "",
}

/** Slug canonique d'une catégorie (ancien ou nouveau slug → slug officiel ; "" si la rubrique n'existe plus). */
export function canonicalCategory(slug: unknown): string {
  const s = String(slug ?? "").toLowerCase().trim()
  return s in CATEGORY_ALIASES ? CATEGORY_ALIASES[s] : s
}
