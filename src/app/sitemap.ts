import type { MetadataRoute } from "next";
import { articlesPublies } from "@/lib/articles";
import { REALISATIONS, SITE } from "@/lib/contenu";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/realisations", "/capacites", "/methode", "/a-propos", "/blog", "/contact", "/mentions-legales", "/confidentialite"];
  const articles = await articlesPublies();
  return [
    ...pages.map((p) => ({ url: `${SITE.url}${p}` })),
    ...REALISATIONS.map((r) => ({ url: `${SITE.url}/realisations/${r.slug}` })),
    ...articles.map((a) => ({ url: `${SITE.url}/blog/${a.slug}`, lastModified: a.publie_le ?? undefined })),
  ];
}
