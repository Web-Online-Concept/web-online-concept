"use server";

import { redirect } from "next/navigation";
import { exigerAdmin } from "@/lib/admin/acces";

// Retour à la liste en gardant le filtre en cours (« non lus » ou « archives »)
const retour = (formData: FormData) => {
  const f = formData.get("filtre");
  return f === "non-lus" || f === "archives" ? `/admin/messages?filtre=${f}` : "/admin/messages";
};

export async function basculerLu(formData: FormData) {
  const sb = await exigerAdmin();
  const id = String(formData.get("id"));
  const lu = formData.get("lu") === "oui";
  await sb.from("messages").update({ lu }).eq("id", id);
  redirect(retour(formData));
}

export async function toutMarquerLu(formData: FormData) {
  const sb = await exigerAdmin();
  await sb.from("messages").update({ lu: true }).eq("lu", false).eq("archive", false);
  redirect(retour(formData));
}

// Archiver un message le marque aussi comme lu ; le désarchiver le remet dans les messages reçus
export async function basculerArchive(formData: FormData) {
  const sb = await exigerAdmin();
  const id = String(formData.get("id"));
  const archive = formData.get("archive") === "oui";
  await sb.from("messages").update(archive ? { archive: true, lu: true } : { archive: false }).eq("id", id);
  redirect(retour(formData));
}

export async function archiverLus(formData: FormData) {
  const sb = await exigerAdmin();
  await sb.from("messages").update({ archive: true }).eq("lu", true).eq("archive", false);
  redirect(retour(formData));
}

export async function supprimerMessage(formData: FormData) {
  const sb = await exigerAdmin();
  await sb.from("messages").delete().eq("id", String(formData.get("id")));
  redirect(retour(formData));
}
