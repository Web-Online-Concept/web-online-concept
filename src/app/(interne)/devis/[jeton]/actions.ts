"use server";

import { clientService } from "@/lib/supabase/service";

export type EtatAcceptation = { statut: "initial" | "accepte" | "erreur"; message?: string };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function accepterDevis(_e: EtatAcceptation, formData: FormData): Promise<EtatAcceptation> {
  const jeton = String(formData.get("jeton") ?? "");
  const nom = String(formData.get("nom") ?? "").trim().slice(0, 120);
  if (!UUID.test(jeton)) return { statut: "erreur", message: "Lien invalide." };
  if (nom.length < 2) return { statut: "erreur", message: "Indiquez vos nom et prénom." };
  if (formData.get("accord") !== "oui") return { statut: "erreur", message: "Cochez la case pour confirmer votre accord." };

  const sb = clientService();
  if (!sb) return { statut: "erreur", message: "Service momentanément indisponible." };
  const { data: d } = await sb.from("devis").select("id, statut, date_validite, client").eq("jeton_acceptation", jeton).maybeSingle();
  if (!d) return { statut: "erreur", message: "Ce devis est introuvable." };
  if (d.statut === "accepte") return { statut: "accepte" };
  if (d.statut !== "envoye") return { statut: "erreur", message: "Ce devis ne peut plus être accepté en ligne." };
  const jour = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(new Date());
  if (d.date_validite && d.date_validite < jour) {
    return { statut: "erreur", message: "La date de validité de ce devis est dépassée. Contactez Web Online Concept pour une nouvelle proposition." };
  }
  const { error } = await sb
    .from("devis")
    .update({
      statut: "accepte",
      accepte_le: new Date().toISOString(),
      accepte_par: nom,
      // Particulier : demande expresse de démarrage avant la fin du délai de rétractation (case facultative)
      debut_anticipe: (d.client as { type?: string } | null)?.type === "particulier" && formData.get("anticipe") === "oui",
    })
    .eq("id", d.id)
    .eq("statut", "envoye");
  if (error) return { statut: "erreur", message: "L'enregistrement a échoué. Réessayez dans un instant." };
  return { statut: "accepte" };
}
