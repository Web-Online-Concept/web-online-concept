import { CAPACITES, ENGAGEMENTS, FAQ, PROJETS_SUR_MESURE, SITE, SITES_CLIENTS } from "@/lib/contenu";

// Présentation du studio au format llms.txt, lue par les assistants et moteurs d'IA
export function GET() {
  const lignes = [
    `# ${SITE.nom}`,
    "",
    `> Studio de développement web et d'intelligence artificielle à Toulouse, depuis 2009. ${SITE.sousTitre}`,
    "",
    "Interlocuteur unique, de la première idée à la mise en ligne et au suivi. Le studio travaille sur recommandation et sur demande privée, partout en France.",
    "",
    "## Capacités",
    ...CAPACITES.map((c) => `- ${c.titre} : ${c.texte}`),
    "",
    "## Engagements",
    ...ENGAGEMENTS.map((e) => `- ${e.titre} : ${e.texte}`),
    "",
    "## Projets sur mesure",
    ...PROJETS_SUR_MESURE.map((r) => `- [${r.nom}](${SITE.url}/realisations/${r.slug}) : ${r.type}. ${r.accroche}`),
    "",
    "## Sites créés et suivis pour des clients",
    ...SITES_CLIENTS.map((r) => `- [${r.nom}](${SITE.url}/realisations/${r.slug}) : ${r.resume?.activite ?? r.type}${r.resume?.lieu ? ` (${r.resume.lieu})` : ""}.`),
    "",
    "## Questions fréquentes",
    ...FAQ.map((q) => `- ${q.question} ${q.reponse}`),
    "",
    "## Pages",
    `- [Capacités](${SITE.url}/capacites)`,
    `- [Méthode](${SITE.url}/methode)`,
    `- [Réalisations](${SITE.url}/realisations)`,
    `- [À propos](${SITE.url}/a-propos)`,
    `- [Questions fréquentes](${SITE.url}/faq)`,
    `- [Contact](${SITE.url}/contact)`,
    "",
  ];
  return new Response(lignes.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
