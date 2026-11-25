import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { clientPublic } from "@/lib/supabase/public";

export type Article = {
  slug: string;
  titre: string;
  extrait: string;
  contenu: string;
  categorie: string;
  image_url: string | null;
  publie_le: string | null;
};

export async function articlesPublies(): Promise<Article[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("articles");
  const sb = clientPublic();
  if (!sb) return [];
  try {
    const { data, error } = await sb
      .from("articles")
      .select("slug, titre, extrait, contenu, categorie, image_url, publie_le")
      .eq("publie", true)
      .order("publie_le", { ascending: false });
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

export async function articleParSlug(slug: string): Promise<Article | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("articles");
  const sb = clientPublic();
  if (!sb) return null;
  try {
    const { data } = await sb
      .from("articles")
      .select("slug, titre, extrait, contenu, categorie, image_url, publie_le")
      .eq("publie", true)
      .eq("slug", slug)
      .maybeSingle();
    return data ?? null;
  } catch {
    return null;
  }
}

export function dateFr(iso: string | null) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(
    new Date(iso),
  );
}
