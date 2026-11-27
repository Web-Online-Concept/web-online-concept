"use server";

import { redirect } from "next/navigation";
import { exigerAdmin } from "@/lib/admin/acces";
import { lireMontant, texteOuNull } from "@/lib/admin/lignes";

const MOIS_VALIDE = /^\d{4}-\d{2}-01$/;

function retour(mois: string, extra: string) {
  redirect(`/admin/urssaf?annee=${mois.slice(0, 4)}&${extra}`);
}

export async function enregistrerDeclaration(formData: FormData) {
  const sb = await exigerAdmin();
  const mois = String(formData.get("mois") ?? "");
  if (!MOIS_VALIDE.test(mois)) redirect("/admin/urssaf?erreur=" + encodeURIComponent("Mois invalide."));
  const ca = lireMontant(formData, "ca_declare");
  if (ca === null || ca < 0) retour(mois, "mois=" + mois + "&erreur=" + encodeURIComponent("Indiquez le chiffre d'affaires déclaré."));
  const date = texteOuNull(formData, "declare_le");
  const { error } = await sb.from("declarations_urssaf").upsert({
    mois,
    ca_declare: ca,
    montant_paye: lireMontant(formData, "montant_paye"),
    declare_le: date ? `${date}T12:00:00+01:00` : new Date().toISOString(),
    note: texteOuNull(formData, "note"),
  });
  if (error) retour(mois, "mois=" + mois + "&erreur=" + encodeURIComponent(error.message));
  retour(mois, "ok=declaration");
}

export async function supprimerDeclaration(formData: FormData) {
  const sb = await exigerAdmin();
  const mois = String(formData.get("mois") ?? "");
  if (!MOIS_VALIDE.test(mois)) redirect("/admin/urssaf");
  await sb.from("declarations_urssaf").delete().eq("mois", mois);
  retour(mois, "ok=suppression");
}

export async function enregistrerHorsOutil(formData: FormData) {
  const sb = await exigerAdmin();
  const mois = String(formData.get("mois") ?? "");
  if (!MOIS_VALIDE.test(mois)) redirect("/admin/urssaf?erreur=" + encodeURIComponent("Mois invalide."));
  const montant = lireMontant(formData, "montant");
  if (!montant) {
    await sb.from("ca_hors_outil").delete().eq("mois", mois);
  } else {
    const { error } = await sb.from("ca_hors_outil").upsert({ mois, montant, note: texteOuNull(formData, "note") });
    if (error) retour(mois, "erreur=" + encodeURIComponent(error.message));
  }
  retour(mois, "ok=hors-outil");
}
