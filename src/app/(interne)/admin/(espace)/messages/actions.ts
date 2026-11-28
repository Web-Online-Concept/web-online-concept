"use server";

import { redirect } from "next/navigation";
import { exigerAdmin } from "@/lib/admin/acces";

// Retour à la liste en gardant le filtre en cours (« non lus »)
const retour = (formData: FormData) => (formData.get("filtre") === "non-lus" ? "/admin/messages?filtre=non-lus" : "/admin/messages");

export async function basculerLu(formData: FormData) {
  const sb = await exigerAdmin();
  const id = String(formData.get("id"));
  const lu = formData.get("lu") === "oui";
  await sb.from("messages").update({ lu }).eq("id", id);
  redirect(retour(formData));
}

export async function toutMarquerLu(formData: FormData) {
  const sb = await exigerAdmin();
  await sb.from("messages").update({ lu: true }).eq("lu", false);
  redirect(retour(formData));
}

export async function supprimerMessage(formData: FormData) {
  const sb = await exigerAdmin();
  await sb.from("messages").delete().eq("id", String(formData.get("id")));
  redirect(retour(formData));
}
