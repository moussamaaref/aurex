import type { Product } from "../data"
import type { Lang } from "../content/lang"
import { ml } from "./ml"
import {
  OFFICIAL_CONNECTIVITY,
  capacityById,
  catalogInfoOf,
  classOptionById,
  colorById,
  familyById,
  rangeById,
  subFamilyById,
} from "./catalog"

const l3 = (v: { fr: string; en: string; ar: string } | undefined, lang: Lang) => (v ? v[lang] || v.fr : "")

/** Libellés officiels d'un produit (famille, sous-famille, gamme, capacités, couleurs, connectivité, classification). */
export function productFacts(p: Product, lang: Lang) {
  const info = catalogInfoOf(p)
  return {
    family: l3(familyById(info.family)?.name, lang),
    subFamily: l3(subFamilyById(info.sousFamille)?.name, lang),
    range: rangeById(info.range)?.name ?? "",
    capacities: info.capacities.map((id) => capacityById(id)?.label ?? "").filter(Boolean),
    colors: info.colors.map((id) => l3(colorById(id)?.name, lang)).filter(Boolean),
    connectivity: OFFICIAL_CONNECTIVITY.filter((c) => (c.id === "wifi" ? info.wifi : info.bluetooth)).map((c) => c.name),
    classifications: info.classifications.map((id) => l3(classOptionById(id)?.name, lang)).filter(Boolean),
  }
}

/** 2 à 6 caractéristiques principales pour les cartes produit : uniquement des données réelles du produit. */
export function keySpecsOf(p: Product, lang: Lang, max = 6): string[] {
  const f = productFacts(p, lang)
  const own = (p.specs ?? [])
    .map((s) => `${ml(s.label)} ${ml(s.value)}`.trim())
    .filter((s) => s.length > 0)
    .slice(0, 3)
  const list = [...own, ...f.capacities, ...f.classifications.slice(0, 3), f.range, ...f.colors, ...f.connectivity].filter(Boolean)
  return [...new Set(list)].slice(0, max)
}
