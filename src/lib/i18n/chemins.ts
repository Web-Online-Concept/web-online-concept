// Langues du site et adresses traduites.
// Fichier sans alias d'import : il est aussi lu par next.config.ts pour générer les réécritures.
//
// Organisation : les pages vivent dans src/app/[lang]/<nom interne>/ (noms de dossier en français).
// Le français est servi sans préfixe (/realisations), l'anglais et l'espagnol avec le leur
// et des adresses traduites (/en/work, /es/proyectos). next.config.ts réécrit chaque adresse publique
// vers le dossier interne correspondant.

export const LANGUES = ["fr", "en", "es"] as const;
export type Langue = (typeof LANGUES)[number];
export const LANGUE_DEFAUT: Langue = "fr";

export function estLangue(x: unknown): x is Langue {
  return typeof x === "string" && (LANGUES as readonly string[]).includes(x);
}

// Codes complets (Open Graph, hreflang, données structurées, dates)
export const LOCALES: Record<Langue, string> = { fr: "fr-FR", en: "en-US", es: "es-ES" };
export const LOCALES_OG: Record<Langue, string> = { fr: "fr_FR", en: "en_US", es: "es_ES" };
export const NOMS_LANGUES: Record<Langue, string> = { fr: "Français", en: "English", es: "Español" };

// Nom du dossier interne → segment public dans chaque langue
export const SEGMENTS = {
  realisations: { fr: "realisations", en: "work", es: "proyectos" },
  capacites: { fr: "capacites", en: "capabilities", es: "capacidades" },
  methode: { fr: "methode", en: "method", es: "metodo" },
  "a-propos": { fr: "a-propos", en: "about", es: "nosotros" },
  blog: { fr: "blog", en: "blog", es: "blog" },
  faq: { fr: "faq", en: "faq", es: "preguntas-frecuentes" },
  contact: { fr: "contact", en: "contact", es: "contacto" },
  "mentions-legales": { fr: "mentions-legales", en: "legal-notice", es: "aviso-legal" },
  confidentialite: { fr: "confidentialite", en: "privacy", es: "privacidad" },
} as const satisfies Record<string, Record<Langue, string>>;

export type Page = keyof typeof SEGMENTS;
const PAGES = Object.keys(SEGMENTS) as Page[];

function prefixe(l: Langue) {
  return l === LANGUE_DEFAUT ? "" : `/${l}`;
}

// Adresse publique d'une page : chemin("en", "realisations", "memoday") → "/en/work/memoday"
export function chemin(l: Langue, page?: Page, suite?: string) {
  if (!page) return prefixe(l) || "/";
  return `${prefixe(l)}/${SEGMENTS[page][l]}${suite ? `/${suite}` : ""}`;
}

// Lecture d'une adresse publique : "/es/proyectos/memoday" → { langue: "es", page: "realisations", suite: "memoday" }
export function analyserChemin(pathname: string): { langue: Langue; page?: Page; suite?: string } {
  const morceaux = pathname.split("/").filter(Boolean);
  let langue: Langue = LANGUE_DEFAUT;
  if (morceaux[0] && estLangue(morceaux[0]) && morceaux[0] !== LANGUE_DEFAUT) langue = morceaux.shift() as Langue;
  else if (morceaux[0] === LANGUE_DEFAUT) morceaux.shift();
  const [segment, ...reste] = morceaux;
  if (!segment) return { langue };
  const page = PAGES.find((p) => SEGMENTS[p][langue] === segment || p === segment);
  return { langue, page, suite: reste.length ? reste.join("/") : undefined };
}

// Réécritures pour next.config.ts : adresse publique → dossier interne
export function reecritures() {
  const regles: { source: string; destination: string }[] = [{ source: "/", destination: `/${LANGUE_DEFAUT}` }];
  for (const l of LANGUES) {
    for (const p of PAGES) {
      const source = `${prefixe(l)}/${SEGMENTS[p][l]}`;
      const destination = `/${l}/${p}`;
      if (source === destination) continue;
      regles.push({ source: `${source}/:suite*`, destination: `${destination}/:suite*` });
    }
  }
  return regles;
}
