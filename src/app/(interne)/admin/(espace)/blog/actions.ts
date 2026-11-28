"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { exigerAdmin } from "@/lib/admin/acces";
import { texteOuNull } from "@/lib/admin/lignes";
import { slugifier, traduireArticle, type ChampsArticle } from "@/lib/admin/traduction";

const TYPES_IMAGE: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" };

export async function enregistrerArticle(formData: FormData) {
  const sb = await exigerAdmin();
  const id = texteOuNull(formData, "id");
  const base = id ? `/admin/blog/${id}` : "/admin/blog/nouveau";
  const erreur = (m: string) => redirect(`${base}?erreur=${encodeURIComponent(m)}`);

  const titre = String(formData.get("titre") ?? "").trim();
  if (!titre) erreur("Le titre est obligatoire.");
  const slug = slugifier(String(formData.get("slug") ?? "").trim() || titre);
  if (!slug) erreur("L'adresse de l'article est invalide.");
  const publie = formData.get("publie") === "oui";

  const champs: Record<string, unknown> = {
    titre,
    slug,
    extrait: String(formData.get("extrait") ?? "").trim(),
    categorie: String(formData.get("categorie") ?? "").trim() || "IA",
    contenu: String(formData.get("contenu") ?? ""),
    publie,
  };

  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    const ext = TYPES_IMAGE[image.type];
    if (!ext) erreur("Image refusée : utilisez un fichier JPG, PNG, WebP ou AVIF.");
    if (image.size > 3.5 * 1024 * 1024) erreur("Image trop lourde : 3,5 Mo au maximum.");
    const chemin = `blog/${slug}-${Date.now()}.${ext}`;
    const { error } = await sb.storage.from("medias").upload(chemin, image, { contentType: image.type, cacheControl: "31536000" });
    if (error) erreur(`Envoi de l'image impossible : ${error.message}`);
    champs.image_url = sb.storage.from("medias").getPublicUrl(chemin).data.publicUrl;
  } else if (formData.get("retirer_image") === "oui") {
    champs.image_url = null;
  }

  let articleId = id;
  if (articleId) {
    const { data: avant } = await sb.from("articles").select("publie_le").eq("id", articleId).maybeSingle();
    if (publie && !avant?.publie_le) champs.publie_le = new Date().toISOString();
    const { error } = await sb.from("articles").update(champs).eq("id", articleId);
    if (error) erreur(error.code === "23505" ? "Un autre article utilise déjà cette adresse." : error.message);
  } else {
    if (publie) champs.publie_le = new Date().toISOString();
    const { data, error } = await sb.from("articles").insert(champs).select("id").single();
    if (error || !data) erreur(error?.code === "23505" ? "Un autre article utilise déjà cette adresse." : (error?.message ?? "Création impossible"));
    articleId = data!.id;
  }
  updateTag("articles");
  redirect(`/admin/blog/${articleId}?enregistre=1`);
}

export async function supprimerArticle(formData: FormData) {
  const sb = await exigerAdmin();
  await sb.from("articles").delete().eq("id", String(formData.get("id")));
  updateTag("articles");
  redirect("/admin/blog");
}

// ---------- Traductions (anglais, espagnol) ----------

const LANGUES_TRAD = ["en", "es"] as const;
type LangueTrad = (typeof LANGUES_TRAD)[number];
const langueTrad = (v: FormDataEntryValue | null): LangueTrad | null => (LANGUES_TRAD.includes(v as LangueTrad) ? (v as LangueTrad) : null);

export async function enregistrerTraduction(formData: FormData) {
  const sb = await exigerAdmin();
  const id = String(formData.get("article_id") ?? "");
  const langue = langueTrad(formData.get("langue"));
  const base = `/admin/blog/${id}?langue=${langue ?? "fr"}`;
  const erreur = (m: string) => redirect(`${base}&erreur=${encodeURIComponent(m)}`);
  if (!id || !langue) redirect("/admin/blog");

  const titre = String(formData.get("titre") ?? "").trim();
  if (!titre) erreur("Le titre est obligatoire.");
  const slug = slugifier(String(formData.get("slug") ?? "").trim() || titre);
  if (!slug) erreur("L'adresse de l'article est invalide.");

  const champs: Record<string, unknown> = {
    article_id: id,
    langue,
    titre,
    slug,
    extrait: String(formData.get("extrait") ?? "").trim(),
    categorie: String(formData.get("categorie") ?? "").trim(),
    contenu: String(formData.get("contenu") ?? ""),
    modifie_le: new Date().toISOString(),
  };

  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    const ext = TYPES_IMAGE[image.type];
    if (!ext) erreur("Image refusée : utilisez un fichier JPG, PNG, WebP ou AVIF.");
    if (image.size > 3.5 * 1024 * 1024) erreur("Image trop lourde : 3,5 Mo au maximum.");
    const chemin = `blog/${slug}-${Date.now()}.${ext}`;
    const { error } = await sb.storage.from("medias").upload(chemin, image, { contentType: image.type, cacheControl: "31536000" });
    if (error) erreur(`Envoi de l'image impossible : ${error.message}`);
    champs.image_url = sb.storage.from("medias").getPublicUrl(chemin).data.publicUrl;
  } else if (formData.get("retirer_image") === "oui") {
    champs.image_url = null;
  }

  const { error } = await sb.from("articles_traductions").upsert(champs, { onConflict: "article_id,langue" });
  if (error) erreur(error.code === "23505" ? "Un autre article utilise déjà cette adresse dans cette langue." : error.message);
  updateTag("articles");
  redirect(`${base}&enregistre=1`);
}

export async function supprimerTraduction(formData: FormData) {
  const sb = await exigerAdmin();
  const id = String(formData.get("article_id") ?? "");
  const langue = langueTrad(formData.get("langue"));
  if (id && langue) await sb.from("articles_traductions").delete().eq("article_id", id).eq("langue", langue);
  updateTag("articles");
  redirect(`/admin/blog/${id}?langue=${langue ?? "fr"}&supprime=1`);
}

export type EtatProposition = { statut: "initial" | "ok" | "erreur"; champs?: ChampsArticle & { slug: string }; message?: string; jeton?: number };

// Propose une traduction de la version française (enregistrée) : rien n'est écrit en base
export async function proposerTraduction(_e: EtatProposition, formData: FormData): Promise<EtatProposition> {
  const sb = await exigerAdmin();
  const id = String(formData.get("article_id") ?? "");
  const langue = langueTrad(formData.get("langue"));
  if (!id || !langue) return { statut: "erreur", message: "Article ou langue inconnus." };
  const { data: a } = await sb.from("articles").select("titre, extrait, categorie, contenu").eq("id", id).maybeSingle();
  if (!a) return { statut: "erreur", message: "Article introuvable." };
  if (!String(a.contenu ?? "").trim()) return { statut: "erreur", message: "La version française est vide : écrivez-la d'abord." };
  try {
    const t = await traduireArticle(
      { titre: a.titre ?? "", extrait: a.extrait ?? "", categorie: a.categorie ?? "", contenu: a.contenu ?? "" },
      langue,
    );
    return { statut: "ok", champs: { ...t, slug: slugifier(t.titre) }, jeton: Date.now() };
  } catch (e) {
    console.error("[traduction]", e);
    return { statut: "erreur", message: "La traduction automatique n'a pas abouti. Réessayez dans un instant, ou traduisez à la main." };
  }
}
