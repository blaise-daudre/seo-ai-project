import { t } from "./core/i18n.js"
import { homeI18n } from "./pages/home.i18n.js"
import { homeSEO } from "./pages/home.seo.js"
import { applySEO } from "./core/seo.js"

// SEO
applySEO(homeSEO)

// Contenu
document.getElementById("title").textContent = t(homeI18n.title)
document.getElementById("intro").textContent = t(homeI18n.intro)