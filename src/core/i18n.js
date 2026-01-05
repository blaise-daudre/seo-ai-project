import { state } from "./state.js"
import fr from "../data/translations/fr.js"
import en from "../data/translations/en.js"

const translations = { fr, en }

export function t(key) {
  return translations[state.lang]?.[key] ?? key
}