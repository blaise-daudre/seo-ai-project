import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 🔧 base path fiable
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generate() {
  // 1️⃣ Récupérer les données depuis Xano
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

  // 2️⃣ Charger le template HTML
  const templatePath = path.join(
    __dirname,
    "../templates/professional.html"
  );
  const template = fs.readFileSync(templatePath, "utf-8");

  // 3️⃣ Génération des pages
  view.forEach(item => {
    if (!item.slug) {
      console.warn("⚠️ slug manquant, fiche ignorée", item);
      return;
    }

    const bio = item.bio ?? "";

    const html = template
      .replaceAll("{{title}}", item.title ?? "")
      .replace("{{meta_description}}", bio.slice(0, 160))
      .replace("{{first_name}}", item.first_name ?? "")
      .replace("{{last_name}}", item.last_name ?? "")
      .replace("{{bio}}", bio);

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