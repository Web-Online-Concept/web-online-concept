import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { clientPublic } from "@/lib/supabase/public";
import { LOCALES, type Langue } from "@/lib/i18n/chemins";

// Articles du blog : le français dans public.articles, l'anglais et l'espagnol dans public.articles_traductions.
// Un article n'apparaît dans une langue que s'il y est traduit.

export type Article = {
  slug: string;
  titre: string;
  extrait: string;
  contenu: string;
  categorie: string;
  image_url: string | null;
  publie_le: string | null;
  // Adresse (slug) de l'article dans chaque langue où il existe
  slugs: Partial<Record<Langue, string>>;
};

type LigneFr = {
  slug: string;
  titre: string;
  extrait: string;
  contenu: string;
  categorie: string;
  image_url: string | null;
  publie_le: string | null;
  articles_traductions: { langue: Langue; slug: string }[] | null;
};

type LigneTraduite = {
  langue: Langue;
  slug: string;
  titre: string;
  extrait: string;
  contenu: string;
  categorie: string;
  image_url: string | null;
  articles: (Omit<LigneFr, "titre" | "extrait" | "contenu" | "categorie">) | null;
};

function slugsDe(fr: string, traductions: { langue: Langue; slug: string }[] | null) {
  const s: Partial<Record<Langue, string>> = { fr };
  for (const t of traductions ?? []) s[t.langue] = t.slug;
  return s;
}

const recents = (a: Article, b: Article) => (b.publie_le ?? "").localeCompare(a.publie_le ?? "");

export async function articlesPublies(l: Langue): Promise<Article[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("articles");
  const sb = clientPublic();
  if (!sb) return [];
  try {
    if (l === "fr") {
      const { data, error } = await sb
        .from("articles")
        .select("slug, titre, extrait, contenu, categorie, image_url, publie_le, articles_traductions(langue, slug)")
        .eq("publie", true)
        .returns<LigneFr[]>();
      if (error || !data) return [];
      return data.map(({ articles_traductions, ...a }) => ({ ...a, slugs: slugsDe(a.slug, articles_traductions) })).sort(recents);
    }
    const { data, error } = await sb
      .from("articles_traductions")
      .select(
        "langue, slug, titre, extrait, contenu, categorie, image_url, articles!inner(slug, image_url, publie_le, publie, articles_traductions(langue, slug))",
      )
      .eq("langue", l)
      .eq("articles.publie", true)
      .returns<LigneTraduite[]>();
    if (error || !data) return [];
    return data
      .filter((t) => t.articles)
      .map((t) => ({
        slug: t.slug,
        titre: t.titre,
        extrait: t.extrait,
        contenu: t.contenu,
        categorie: t.categorie,
        image_url: t.image_url ?? t.articles!.image_url,
        publie_le: t.articles!.publie_le,
        slugs: slugsDe(t.articles!.slug, t.articles!.articles_traductions),
      }))
      .sort(recents);
  } catch {
    return [];
  }
}

// Article d'une langue d'après son adresse. Si l'adresse est celle d'une autre langue (lien partagé avant
// traduction, changement de langue), renvoie seulement l'adresse correcte pour rediriger.
export async function articleParSlug(l: Langue, slug: string): Promise<{ article?: Article; redirection?: string }> {
  const articles = await articlesPublies(l);
  const article = articles.find((a) => a.slug === slug);
  if (article) return { article };
  const ailleurs = articles.find((a) => Object.values(a.slugs).includes(slug));
  return ailleurs ? { redirection: ailleurs.slug } : {};
}

export function dateLocale(iso: string | null, l: Langue) {
  if (!iso) return "";
  return new Intl.DateTimeFormat(LOCALES[l], { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(
    new Date(iso),
  );
}

// Temps de lecture estimé (environ 220 mots par minute), au moins une minute
export function tempsLecture(contenu: string) {
  const mots = contenu.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(mots / 220));
}

// Identifiant d'ancre lisible à partir d'un titre (« 1. Laisser entrer les robots » → « laisser-entrer-les-robots »)
export function ancre(texte: string) {
  return texte
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/^\d+[.)]\s*/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
