"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { exigerAdmin } from "@/lib/admin/acces";
import { texteOuNull } from "@/lib/admin/lignes";

function slugifier(t: string) {
  return t
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

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
