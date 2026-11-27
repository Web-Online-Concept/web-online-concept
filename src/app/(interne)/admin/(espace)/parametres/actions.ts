"use server";

import { redirect } from "next/navigation";
import { exigerAdmin } from "@/lib/admin/acces";
import { lireMontant, texteOuNull } from "@/lib/admin/lignes";

const TEXTES = [
  "nom_commercial",
  "raison_sociale",
  "siren",
  "siret",
  "code_ape",
  "adresse",
  "code_postal",
  "ville",
  "pays",
  "email",
  "telephone",
  "site_web",
  "mention_tva",
  "conditions_paiement",
  "penalites_retard",
] as const;

const erreur = (m: string) => redirect(`/admin/parametres?erreur=${encodeURIComponent(m)}`);

export async function enregistrerParametres(formData: FormData) {
  const sb = await exigerAdmin();
  const champs: Record<string, unknown> = {};
  for (const c of TEXTES) {
    const v = String(formData.get(c) ?? "").trim();
    if (!v) erreur("Tous les champs de l'entreprise sont obligatoires, sauf l'IBAN et le BIC.");
    champs[c] = v;
  }
  champs.iban = texteOuNull(formData, "iban")?.toUpperCase().replace(/\s+/g, " ") ?? null;
  champs.bic = texteOuNull(formData, "bic")?.toUpperCase().replace(/\s+/g, "") ?? null;
  const delai = Number(formData.get("delai_paiement_jours"));
  const validite = Number(formData.get("validite_devis_jours"));
  if (!Number.isInteger(delai) || delai < 0 || delai > 60) erreur("Délai de paiement : entre 0 et 60 jours (plafond légal).");
  if (!Number.isInteger(validite) || validite < 1 || validite > 365) erreur("Validité des devis : entre 1 et 365 jours.");
  champs.delai_paiement_jours = delai;
  champs.validite_devis_jours = validite;
  const { error } = await sb.from("parametres").update(champs).eq("id", 1);
  if (error) erreur(error.message);
  redirect("/admin/parametres?ok=entreprise");
}

export async function ajouterTaux(formData: FormData) {
  const sb = await exigerAdmin();
  const date = String(formData.get("date_effet") ?? "");
  if (!/^\d{4}-\d{2}-01$/.test(date)) erreur("La date d'effet doit être un premier jour de mois.");
  const cotisations = lireMontant(formData, "cotisations");
  const vl = lireMontant(formData, "versement_liberatoire");
  const cfp = lireMontant(formData, "formation");
  const plafond = lireMontant(formData, "plafond_ca");
  if ([cotisations, vl, cfp, plafond].some((v) => v === null || v < 0)) erreur("Renseignez tous les taux et le plafond.");
  const { error } = await sb.from("taux_urssaf").upsert(
    {
      date_effet: date,
      libelle_categorie: String(formData.get("libelle_categorie") ?? "").trim() || "Prestations de services commerciales ou artisanales (BIC)",
      cotisations,
      versement_liberatoire: vl,
      formation: cfp,
      plafond_ca: plafond,
    },
    { onConflict: "date_effet" },
  );
  if (error) erreur(error.message);
  redirect("/admin/parametres?ok=taux");
}

export async function supprimerTaux(formData: FormData) {
  const sb = await exigerAdmin();
  const { count } = await sb.from("taux_urssaf").select("id", { count: "exact", head: true });
  if ((count ?? 0) <= 1) erreur("Gardez au moins un jeu de taux.");
  await sb.from("taux_urssaf").delete().eq("id", Number(formData.get("id")));
  redirect("/admin/parametres?ok=taux");
}
