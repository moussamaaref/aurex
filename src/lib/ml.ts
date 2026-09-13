import i18n from "../i18n"

export type Lang = "fr" | "ar" | "en"

/** Valeur texte CMS : soit une chaîne legacy (français), soit un objet localisé. */
export type Localized = string | { fr?: string; ar?: string; en?: string } | null | undefined

export function currentLang(): Lang {
  const l = i18n.language
  return l === "ar" || l === "en" ? l : "fr"
}

/** Vrai si la valeur est un objet localisé {fr,ar,en}. */
export function isLocalized(v: unknown): v is { fr?: string; ar?: string; en?: string } {
  return !!v && typeof v === "object" && !Array.isArray(v) && ("fr" in v || "ar" in v || "en" in v)
}

/** Résout une valeur localisée dans la langue donnée (fallback fr, puis première dispo). */
export function ml(v: Localized | number | boolean, lang?: Lang): string {
  if (v == null) return ""
  if (typeof v === "string") return v
  if (typeof v === "number" || typeof v === "boolean") return String(v)
  const l = lang ?? currentLang()
  return v[l] || v.fr || v.ar || v.en || ""
}

/** Résout en français (interface d'administration). */
export function mlFr(v: Localized): string {
  return ml(v, "fr")
}

/** Convertit une valeur legacy en objet localisé éditable {fr,ar,en}. */
export function toLocalized(v: unknown): { fr: string; ar: string; en: string } {
  if (typeof v === "string") return { fr: v, ar: "", en: "" }
  if (isLocalized(v)) return { fr: v.fr ?? "", ar: v.ar ?? "", en: v.en ?? "" }
  return { fr: "", ar: "", en: "" }
}
