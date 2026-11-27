import type { MetadataRoute } from "next";
import { articlesPublies } from "@/lib/articles";
import { REALISATIONS, SITE } from "@/lib/contenu";
import { chemin, LANGUES, LOCALES, SEGMENTS, type Langue, type Page } from "@/lib/i18n/chemins";

// Plan du site : chaque page dans chaque langue, avec ses versions linguistiques (hreflang)
type Versions = Partial<Record<Langue, string>>;

function entrees(v: Versions, lastModified?: string): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    LANGUES.filter((l) => v[l]).map((l) => [LOCALES[l], `${SITE.url}${v[l]}`]),
  );
  if (v.fr) languages["x-default"] = `${SITE.url}${v.fr}`;
  return LANGUES.filter((l) => v[l]).map((l) => ({
    url: `${SITE.url}${v[l]}`,
    ...(lastModified ? { lastModified } : {}),
    alternates: { languages },
  }));
}

const partout = (page?: Page, suite?: string) =>
  Object.fromEntries(LANGUES.map((l) => [l, chemin(l, page, suite)])) as Versions;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = [undefined, ...(Object.keys(SEGMENTS) as Page[])];
  const articles = await articlesPublies("fr");
  return [
    ...pages.flatMap((p) => entrees(partout(p))),
    ...REALISATIONS.flatMap((r) => entrees(partout("realisations", r.slug))),
    ...articles.flatMap((a) =>
      entrees(
        Object.fromEntries(Object.entries(a.slugs).map(([l, s]) => [l, chemin(l as Langue, "blog", s)])),
        a.publie_le ?? undefined,
      ),
    ),
  ];
}
