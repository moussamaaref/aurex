import i18n from "../i18n"
import { isLocalized, ml, type Localized } from "./ml"

/**
 * Texte CMS avec repli traduction.
 * - Objet {fr,ar,en} : affiche la langue courante (avec fallback FR).
 * - Chaîne legacy (français) : ne s'applique qu'en FR, sinon la traduction
 *   gagne (pour ne pas imposer du français en AR/EN).
 */
export function tx(remote: Localized, fallback: string): string {
  if (isLocalized(remote)) {
    const lang = i18n.language === "ar" || i18n.language === "en" ? i18n.language : "fr"
    return remote[lang] || remote.fr || fallback
  }
  if (i18n.language === "fr") return remote || fallback
  return fallback
}
