import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import fr from "./locales/fr"
import en from "./locales/en"
import ar from "./locales/ar"

const storedLang =
  typeof localStorage !== "undefined" ? localStorage.getItem("aurex-lang") : null
const initialLang = storedLang === "en" || storedLang === "ar" ? storedLang : "fr"

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: initialLang,
  fallbackLng: "fr",
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
