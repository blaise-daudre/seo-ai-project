import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

console.log("🚀🚀🚀 SSG RUNNING ON NETLIFY 🚀🚀🚀");

const siteUrl = "https://dixo-test.netlify.app";

// Base path fiable (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generate() {
  // 1️⃣ Récupération des données depuis Xano
  const response = await fetch(
    "https://xzxj-px3y-030z.p7.xano.io/api:aoU5pHZJ/seo/profesionnals"
  );

  if (!response.ok) {
    throw new Error(`Erreur API Xano : ${response.status}`);
  }

  const view = await response.json();

  if (!Array.isArray(view)) {
    throw new Error("La réponse Xano n'est pas un tableau");
  }

  // 2️⃣ Chargement du template HTML
  const templatePath = path.join(
    __dirname,
    "../templates/professional.html"
  );
  const template = fs.readFileSync(templatePath, "utf-8");

  // 3️⃣ Génération des pages
  view.forEach(item => {
    if (!item.slug || !item.title) {
      console.warn("⚠️ Fiche ignorée (slug ou title manquant)", item);
      return;
    }

    const firstName = item.first_name ?? "";
    const lastName = item.last_name ?? "";
    const bio = item.bio ?? "";
    const description = bio.slice(0, 160);

    const pageUrl = `${siteUrl}/avocats/${item.slug}.html`;

    const html = template
      // SEO
      .replaceAll("{{title}}", item.title)
      .replace("{{meta_description}}", description)
      .replaceAll("{{canonical_url}}", pageUrl)

      // Contenu
      .replaceAll("{{first_name}}", firstName)
      .replaceAll("{{last_name}}", lastName)
      .replaceAll("{{bio}}", bio)

      // Open Graph
      .replaceAll("{{og_title}}", item.title)
      .replaceAll("{{og_description}}", description)
      .replaceAll("{{og_url}}", pageUrl)
      .replaceAll(
        "{{og_image}}",
        `${siteUrl}/assets/og-default-avocat.jpg`
      );

    const outputPath = path.join(
      __dirname,
      `../dist/avocats/${item.slug}.html`
    );

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, html, "utf-8");

    console.log("✅ Page générée :", outputPath);
  });
}

generate().catch(err => {
  console.error("❌ Erreur SSG :", err.message);
  process.exit(1);
});