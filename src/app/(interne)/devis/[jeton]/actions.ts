"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { notifierDevisAccepte } from "@/lib/notification";
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
  const { data: d } = await sb.from("devis").select("id, numero, objet, total_ttc, statut, date_validite, client").eq("jeton_acceptation", jeton).maybeSingle();
  if (!d) return { statut: "erreur", message: "Ce devis est introuvable." };
  if (d.statut === "accepte") return { statut: "accepte" };
  if (d.statut !== "envoye") return { statut: "erreur", message: "Ce devis ne peut plus être accepté en ligne." };
  const jour = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(new Date());
  if (d.date_validite && d.date_validite < jour) {
    return { statut: "erreur", message: "La date de validité de ce devis est dépassée. Contactez Web Online Concept pour une nouvelle proposition." };
  }
  const client = d.client as { nom?: string; type?: string } | null;
  const particulier = client?.type === "particulier";
  // Particulier : demande expresse de démarrage avant la fin du délai de rétractation (case facultative)
  const debutAnticipe = particulier && formData.get("anticipe") === "oui";
  const { error } = await sb
    .from("devis")
    .update({
      statut: "accepte",
      accepte_le: new Date().toISOString(),
      accepte_par: nom,
      debut_anticipe: debutAnticipe,
    })
    .eq("id", d.id)
    .eq("statut", "envoye");
  if (error) return { statut: "erreur", message: "L'enregistrement a échoué. Réessayez dans un instant." };

  // Alerte e-mail au studio, après la réponse au client
  const h = await headers();
  const origine = `${h.get("x-forwarded-proto") ?? "https"}://${h.get("x-forwarded-host") ?? h.get("host")}`;
  after(() =>
    notifierDevisAccepte({
      numero: d.numero ?? "",
      client: client?.nom ?? nom,
      signataire: nom,
      objet: d.objet,
      total: Number(d.total_ttc),
      particulier,
      debutAnticipe,
      accepteLe: new Date(),
      lienAdmin: `${origine}/admin/devis/${d.id}`,
    }),
  );
  return { statut: "accepte" };
}
