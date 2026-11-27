"use server";

import { redirect } from "next/navigation";
import { exigerAdmin } from "@/lib/admin/acces";
import { lireLignes, texteOuNull } from "@/lib/admin/lignes";

function message(e: unknown) {
  return encodeURIComponent(e instanceof Error ? e.message : String(e));
}

export async function enregistrerDevis(formData: FormData) {
  const sb = await exigerAdmin();
  const id = texteOuNull(formData, "id");
  const intention = String(formData.get("intention") ?? "enregistrer");
  const clientId = texteOuNull(formData, "client_id");
  if (!clientId) redirect(`${id ? `/admin/devis/${id}` : "/admin/devis/nouveau"}?erreur=${message("Choisissez un client.")}`);
  const lignes = lireLignes(formData);
  const champs = {
    client_id: clientId,
    objet: String(formData.get("objet") ?? "").trim(),
    date_emission: texteOuNull(formData, "date_emission"),
    date_validite: texteOuNull(formData, "date_validite"),
    notes: texteOuNull(formData, "notes"),
  };

  let devisId = id;
  if (devisId) {
    const { error } = await sb.from("devis").update(champs).eq("id", devisId).is("numero", null);
    if (error) redirect(`/admin/devis/${devisId}?erreur=${message(error.message)}`);
    await sb.from("devis_lignes").delete().eq("devis_id", devisId);
  } else {
    const { data, error } = await sb.from("devis").insert(champs).select("id").single();
    if (error || !data) redirect(`/admin/devis/nouveau?erreur=${message(error?.message ?? "Création impossible")}`);
    devisId = data.id;
  }
  if (lignes.length) {
    const { error } = await sb
      .from("devis_lignes")
      .insert(lignes.map((l, i) => ({ ...l, description: l.description || null, unite: l.unite || null, position: i, devis_id: devisId })));
    if (error) redirect(`/admin/devis/${devisId}?erreur=${message(error.message)}`);
  }
  if (intention === "emettre") {
    const { error } = await sb.rpc("emettre_devis", { p_id: devisId });
    if (error) redirect(`/admin/devis/${devisId}?erreur=${message(error.message)}`);
    redirect(`/admin/devis/${devisId}?emis=1`);
  }
  redirect(`/admin/devis/${devisId}?enregistre=1`);
}

export async function changerStatutDevis(formData: FormData) {
  const sb = await exigerAdmin();
  const id = String(formData.get("id"));
  const statut = String(formData.get("statut"));
  if (!["refuse", "envoye", "expire"].includes(statut)) redirect(`/admin/devis/${id}`);
  await sb.from("devis").update({ statut }).eq("id", id).not("numero", "is", null);
  redirect(`/admin/devis/${id}`);
}

export async function marquerAccepte(formData: FormData) {
  const sb = await exigerAdmin();
  const id = String(formData.get("id"));
  await sb
    .from("devis")
    .update({ statut: "accepte", accepte_le: new Date().toISOString(), accepte_par: "Accord reçu hors ligne" })
    .eq("id", id)
    .not("numero", "is", null);
  redirect(`/admin/devis/${id}`);
}

export async function convertirEnFacture(formData: FormData) {
  const sb = await exigerAdmin();
  const id = String(formData.get("id"));
  const { data: d } = await sb.from("devis").select("*").eq("id", id).single();
  if (!d) redirect("/admin/devis");
  if (d.facture_id) redirect(`/admin/factures/${d.facture_id}`);
  const { data: lignes } = await sb.from("devis_lignes").select("*").eq("devis_id", id).order("position");
  const { data: f, error } = await sb
    .from("factures")
    .insert({ client_id: d.client_id, devis_id: id, objet: d.objet, notes: d.numero ? `Selon devis ${d.numero}.` : null })
    .select("id")
    .single();
  if (error || !f) redirect(`/admin/devis/${id}?erreur=${message(error?.message ?? "Conversion impossible")}`);
  if (lignes?.length) {
    await sb.from("facture_lignes").insert(
      lignes.map((l) => ({
        facture_id: f.id,
        position: l.position,
        designation: l.designation,
        description: l.description,
        quantite: l.quantite,
        unite: l.unite,
        prix_unitaire: l.prix_unitaire,
        taux_tva: l.taux_tva,
      })),
    );
  }
  await sb.from("devis").update({ facture_id: f.id }).eq("id", id);
  redirect(`/admin/factures/${f.id}`);
}

export async function dupliquerDevis(formData: FormData) {
  const sb = await exigerAdmin();
  const id = String(formData.get("id"));
  const { data: d } = await sb.from("devis").select("client_id, objet, notes").eq("id", id).single();
  if (!d) redirect("/admin/devis");
  const { data: nouveau } = await sb.from("devis").insert(d).select("id").single();
  const { data: lignes } = await sb.from("devis_lignes").select("*").eq("devis_id", id).order("position");
  if (nouveau && lignes?.length) {
    await sb.from("devis_lignes").insert(
      lignes.map((l) => ({
        devis_id: nouveau.id,
        position: l.position,
        designation: l.designation,
        description: l.description,
        quantite: l.quantite,
        unite: l.unite,
        prix_unitaire: l.prix_unitaire,
        taux_tva: l.taux_tva,
      })),
    );
  }
  redirect(`/admin/devis/${nouveau?.id ?? id}`);
}

export async function supprimerDevisBrouillon(formData: FormData) {
  const sb = await exigerAdmin();
  const id = String(formData.get("id"));
  await sb.from("devis").delete().eq("id", id).is("numero", null);
  redirect("/admin/devis");
}
