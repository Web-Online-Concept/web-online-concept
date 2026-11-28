import "server-only";
import { generateText } from "ai";

// Traduction d'un article du blog (français vers anglais ou espagnol) par un modèle d'IA, via Vercel AI Gateway.
// Sur Vercel, l'authentification se fait d'elle-même (OIDC) : aucune clé à gérer. Le résultat est une proposition :
// rien n'est enregistré tant que Florent ne l'a pas relue et validée.

export type ChampsArticle = { titre: string; extrait: string; categorie: string; contenu: string };

const MODELE = process.env.MODELE_TRADUCTION || "anthropic/claude-sonnet-5.5";

const CATEGORIES: Record<"en" | "es", Record<string, string>> = {
  en: { IA: "AI", Développement: "Development", Applications: "Apps", Méthode: "Method", Réalisations: "Projects", Actualité: "News" },
  es: { IA: "IA", Développement: "Desarrollo", Applications: "Aplicaciones", Méthode: "Método", Réalisations: "Proyectos", Actualité: "Actualidad" },
};

const CONSIGNES: Record<"en" | "es", string> = {
  en: "Translate into natural, idiomatic US English, as a native copywriter would write it for a business audience.",
  es: "Traduce al español de España, natural y fluido, como lo escribiría un redactor nativo para un público profesional. Trata siempre al lector de « usted ».",
};

export async function traduireArticle(source: ChampsArticle, langue: "en" | "es"): Promise<ChampsArticle> {
  const { text } = await generateText({
    model: MODELE,
    maxOutputTokens: 12000,
    instructions: [
      "You translate blog articles for Web Online Concept, a web development and AI studio that writes in the first person plural (« nous »).",
      CONSIGNES[langue],
      "Rules:",
      "- Keep the Markdown structure exactly: headings, lists, bold, italics, links, images, tables, line breaks.",
      "- Never change URLs, image paths or code. Translate link texts and image alt texts.",
      "- Keep brand and product names as they are (Web Online Concept, MemoDay, ChatGPT, Claude, Perplexity, Google…).",
      "- Adapt French typography to the target language (no space before ? ! : ;).",
      "- Do not add, remove or summarise anything.",
      'Answer with a single JSON object and nothing else: {"titre": "...", "extrait": "...", "categorie": "...", "contenu": "..."}',
    ].join("\n"),
    prompt: JSON.stringify(source),
  });
  const brut = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const debut = brut.indexOf("{");
  const fin = brut.lastIndexOf("}");
  const objet = JSON.parse(brut.slice(debut, fin + 1)) as Partial<ChampsArticle>;
  return {
    titre: String(objet.titre ?? "").trim(),
    extrait: String(objet.extrait ?? "").trim(),
    categorie: CATEGORIES[langue][source.categorie] ?? String(objet.categorie ?? source.categorie).trim(),
    contenu: String(objet.contenu ?? ""),
  };
}

export function slugifier(t: string) {
  return t
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
