import { t } from "./i18n.js"

export function applySEO(seoConfig) {
  document.title = t(seoConfig.title)

  const metaDesc = document.querySelector('meta[name="description"]')
  if (metaDesc) {
    metaDesc.setAttribute("content", t(seoConfig.description))
  }
}