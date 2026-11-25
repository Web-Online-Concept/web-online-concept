"use server";

import { redirect } from "next/navigation";
import { exigerAdmin } from "@/lib/admin/acces";

export async function basculerLu(formData: FormData) {
  const sb = await exigerAdmin();
  const id = String(formData.get("id"));
  const lu = formData.get("lu") === "oui";
  await sb.from("messages").update({ lu }).eq("id", id);
  redirect("/admin/messages");
}

export async function supprimerMessage(formData: FormData) {
  const sb = await exigerAdmin();
  await sb.from("messages").delete().eq("id", String(formData.get("id")));
  redirect("/admin/messages");
}
