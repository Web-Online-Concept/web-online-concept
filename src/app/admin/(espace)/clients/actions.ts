"use server";

import { redirect } from "next/navigation";
import { exigerAdmin } from "@/lib/admin/acces";

export type Entreprise = {
  nom: string;
  siren: string;
  siret: string;
  adresse: string;
  code_postal: string;
  ville: string;
  tva_intra: string;
};

function cleTva(siren: string) {
  const n = Number(siren);
  const cle = (12 + 3 * (n % 97)) % 97;
  return `FR${String(cle).padStart(2, "0")}${siren}`;
}

// Recherche dans l'annuaire public des entreprises (api.gouv.fr)
export async function rechercherEntreprise(saisie: string): Promise<{ ok: true; e: Entreprise } | { ok: false; message: string }> {
  await exigerAdmin();
  const siren = saisie.replace(/\s/g, "").slice(0, 9);
  if (!/^\d{9}$/.test(siren)) return { ok: false, message: "Le SIREN doit compter 9 chiffres." };
  try {
    const rep = await fetch(`https://recherche-entreprises.api.gouv.fr/search?q=${siren}&page=1&per_page=1`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!rep.ok) return { ok: false, message: "L'annuaire des entreprises ne répond pas. Saisissez les informations à la main." };
    const json = await rep.json();
    const r = json.results?.[0];
    if (!r || r.siren !== siren) return { ok: false, message: "Aucune entreprise trouvée pour ce SIREN." };
    const s = r.siege ?? {};
    const voie = [s.numero_voie, s.indice_repetition, s.type_voie, s.libelle_voie].filter(Boolean).join(" ");
    return {
      ok: true,
      e: {
        nom: r.nom_raison_sociale || r.nom_complet || "",
        siren,
        siret: s.siret ?? "",
        adresse: voie || s.adresse || "",
        code_postal: s.code_postal ?? "",
        ville: s.libelle_commune ?? "",
        tva_intra: cleTva(siren),
      },
    };
  } catch {
    return { ok: false, message: "L'annuaire des entreprises est injoignable. Saisissez les informations à la main." };
  }
}

const CHAMPS = ["nom", "siren", "siret", "tva_intra", "adresse", "code_postal", "ville", "pays", "contact_nom", "email", "telephone", "notes"] as const;

export async function enregistrerClient(formData: FormData) {
  const sb = await exigerAdmin();
  const id = String(formData.get("id") ?? "");
  const valeurs: Record<string, string | null> = {};
  for (const c of CHAMPS) {
    const v = String(formData.get(c) ?? "").trim();
    valeurs[c] = v === "" ? null : v;
  }
  if (!valeurs.nom) throw new Error("Le nom du client est obligatoire.");
  valeurs.pays = valeurs.pays ?? "France";
  const type = formData.get("type") === "particulier" ? "particulier" : "entreprise";

  if (id) {
    const { error } = await sb.from("clients").update({ ...valeurs, type }).eq("id", id);
    if (error) throw new Error(error.message);
    redirect(`/admin/clients/${id}?enregistre=1`);
  }
  const { data, error } = await sb.from("clients").insert({ ...valeurs, type }).select("id").single();
  if (error) throw new Error(error.message);
  const retour = String(formData.get("retour") ?? "");
  redirect(retour ? `${retour}${retour.includes("?") ? "&" : "?"}client=${data.id}` : `/admin/clients/${data.id}?enregistre=1`);
}

export async function basculerArchive(formData: FormData) {
  const sb = await exigerAdmin();
  const id = String(formData.get("id"));
  const archive = formData.get("archive") === "1";
  await sb.from("clients").update({ archive }).eq("id", id);
  redirect(`/admin/clients/${id}`);
}
