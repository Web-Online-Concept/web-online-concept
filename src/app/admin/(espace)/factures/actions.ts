"use server";

import { redirect } from "next/navigation";
import { exigerAdmin } from "@/lib/admin/acces";
import { archiverFacture } from "@/lib/admin/documents";
import { lireLignes, texteOuNull } from "@/lib/admin/lignes";

function message(e: unknown) {
  return encodeURIComponent(e instanceof Error ? e.message : String(e));
}

export async function enregistrerFacture(formData: FormData) {
  const sb = await exigerAdmin();
  const id = texteOuNull(formData, "id");
  const intention = String(formData.get("intention") ?? "enregistrer");
  const clientId = texteOuNull(formData, "client_id");
  if (!clientId) redirect(`${id ? `/admin/factures/${id}` : "/admin/factures/nouvelle"}?erreur=${message("Choisissez un client.")}`);
  const lignes = lireLignes(formData);
  const champs = {
    client_id: clientId,
    objet: String(formData.get("objet") ?? "").trim(),
    date_emission: texteOuNull(formData, "date_emission"),
    date_echeance: texteOuNull(formData, "date_echeance"),
    notes: texteOuNull(formData, "notes"),
  };

  let factureId = id;
  if (factureId) {
    const { error } = await sb.from("factures").update(champs).eq("id", factureId).eq("statut", "brouillon");
    if (error) redirect(`/admin/factures/${factureId}?erreur=${message(error.message)}`);
    await sb.from("facture_lignes").delete().eq("facture_id", factureId);
  } else {
    const type = formData.get("type") === "avoir" ? "avoir" : "facture";
    const { data, error } = await sb
      .from("factures")
      .insert({ ...champs, type, devis_id: texteOuNull(formData, "devis_id"), facture_origine_id: texteOuNull(formData, "facture_origine_id") })
      .select("id")
      .single();
    if (error || !data) redirect(`/admin/factures/nouvelle?erreur=${message(error?.message ?? "Création impossible")}`);
    factureId = data.id;
  }
  if (lignes.length) {
    const { error } = await sb
      .from("facture_lignes")
      .insert(lignes.map((l, i) => ({ ...l, description: l.description || null, unite: l.unite || null, position: i, facture_id: factureId })));
    if (error) redirect(`/admin/factures/${factureId}?erreur=${message(error.message)}`);
  }

  if (intention === "emettre") {
    const { error } = await sb.rpc("emettre_facture", { p_id: factureId });
    if (error) redirect(`/admin/factures/${factureId}?erreur=${message(error.message)}`);
    try {
      await archiverFacture(sb, factureId!);
    } catch (e) {
      redirect(`/admin/factures/${factureId}?erreur=${message(e)}`);
    }
    await apresEmissionAvoir(factureId!);
    redirect(`/admin/factures/${factureId}?emise=1`);
  }
  redirect(`/admin/factures/${factureId}?enregistre=1`);
}

// Un avoir qui annule la totalité de sa facture d'origine la marque « annulée »
async function apresEmissionAvoir(id: string) {
  const sb = await exigerAdmin();
  const { data: a } = await sb.from("factures").select("type, total_ttc, facture_origine_id").eq("id", id).single();
  if (!a || a.type !== "avoir" || !a.facture_origine_id) return;
  const { data: o } = await sb.from("factures").select("total_ttc, montant_encaisse").eq("id", a.facture_origine_id).single();
  if (o && Math.abs(Number(a.total_ttc)) >= Number(o.total_ttc) && Number(o.montant_encaisse) === 0) {
    await sb.from("factures").update({ statut: "annulee" }).eq("id", a.facture_origine_id);
  }
}

export async function supprimerBrouillon(formData: FormData) {
  const sb = await exigerAdmin();
  const id = String(formData.get("id"));
  await sb.from("devis").update({ facture_id: null }).eq("facture_id", id);
  const { error } = await sb.from("factures").delete().eq("id", id).eq("statut", "brouillon");
  if (error) redirect(`/admin/factures/${id}?erreur=${message(error.message)}`);
  redirect("/admin/factures");
}

export async function ajouterEncaissement(formData: FormData) {
  const sb = await exigerAdmin();
  const id = String(formData.get("facture_id"));
  const montant = Number(String(formData.get("montant") ?? "").replace(",", "."));
  const date = texteOuNull(formData, "date_encaissement");
  if (!date || !Number.isFinite(montant) || montant === 0) {
    redirect(`/admin/factures/${id}?erreur=${message("Indiquez une date et un montant.")}`);
  }
  const { error } = await sb.from("encaissements").insert({
    facture_id: id,
    date_encaissement: date,
    montant: Math.round(montant * 100) / 100,
    mode: String(formData.get("mode") ?? "virement"),
    notes: texteOuNull(formData, "notes"),
  });
  if (error) redirect(`/admin/factures/${id}?erreur=${message(error.message)}`);
  redirect(`/admin/factures/${id}`);
}

export async function supprimerEncaissement(formData: FormData) {
  const sb = await exigerAdmin();
  const id = String(formData.get("facture_id"));
  await sb.from("encaissements").delete().eq("id", String(formData.get("encaissement_id")));
  redirect(`/admin/factures/${id}`);
}

export async function creerAvoir(formData: FormData) {
  const sb = await exigerAdmin();
  const id = String(formData.get("id"));
  const { data: f } = await sb.from("factures").select("*").eq("id", id).single();
  if (!f || f.statut === "brouillon" || f.type !== "facture") redirect(`/admin/factures/${id}`);
  const { data: lignes } = await sb.from("facture_lignes").select("*").eq("facture_id", id).order("position");
  const { data: avoir, error } = await sb
    .from("factures")
    .insert({ type: "avoir", client_id: f.client_id, facture_origine_id: id, objet: `Avoir sur facture ${f.numero}` })
    .select("id")
    .single();
  if (error || !avoir) redirect(`/admin/factures/${id}?erreur=${message(error?.message ?? "Création de l'avoir impossible")}`);
  if (lignes?.length) {
    await sb.from("facture_lignes").insert(
      lignes.map((l) => ({
        facture_id: avoir.id,
        position: l.position,
        designation: l.designation,
        description: l.description,
        quantite: l.quantite,
        unite: l.unite,
        prix_unitaire: -Number(l.prix_unitaire),
        taux_tva: l.taux_tva,
      })),
    );
  }
  redirect(`/admin/factures/${avoir.id}`);
}

export async function marquerEnvoyee(formData: FormData) {
  const sb = await exigerAdmin();
  const id = String(formData.get("id"));
  await sb.from("factures").update({ envoyee_le: new Date().toISOString() }).eq("id", id);
  redirect(`/admin/factures/${id}`);
}
