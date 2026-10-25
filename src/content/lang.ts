import { useTranslation } from "react-i18next"

export type Lang = "fr" | "en" | "ar"

/** Contenu éditorial trilingue (website brief 2026). */
export type L3<T = string> = { fr: T; en: T; ar: T }

/** Choisit la langue courante (repli FR). */
export function pick<T>(v: L3<T>, lang: Lang): T {
  return v[lang] ?? v.fr
}

/** Hook : renvoie un sélecteur `p()` lié à la langue active (re-rend au changement de langue). */
export function useP() {
  const { i18n } = useTranslation()
  const lang: Lang = i18n.language === "ar" || i18n.language === "en" ? i18n.language : "fr"
  return { lang, p: <T,>(v: L3<T>): T => pick(v, lang), isRtl: lang === "ar" }
}
