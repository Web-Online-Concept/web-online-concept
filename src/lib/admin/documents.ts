import "server-only";
import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { genererPdf, type DocumentPdf, type LignePdf, type Partie } from "@/lib/pdf/document";

type Ligne = {
  id: string;
  position: number;
  designation: string;
  description: string | null;
  quantite: number;
  unite: string | null;
  prix_unitaire: number;
  taux_tva: number;
  total_ht: number;
};

function normaliserLignes(lignes: Ligne[] | null): Ligne[] {
  return (lignes ?? [])
    .map((l) => ({
      ...l,
      quantite: Number(l.quantite),
      prix_unitaire: Number(l.prix_unitaire),
      taux_tva: Number(l.taux_tva),
      total_ht: Number(l.total_ht),
    }))
    .sort((a, b) => a.position - b.position);
}

export async function chargerFacture(sb: SupabaseClient, id: string) {
  const { data: f } = await sb.from("factures").select("*").eq("id", id).maybeSingle();
  if (!f) return null;
  const [{ data: lignes }, { data: params }, { data: client }, { data: encaissements }, origine, avoirs] = await Promise.all([
    sb.from("facture_lignes").select("*").eq("facture_id", id),
    sb.from("parametres").select("*").eq("id", 1).single(),
    sb.from("clients").select("*").eq("id", f.client_id).single(),
    sb.from("encaissements").select("*").eq("facture_id", id).order("date_encaissement"),
    f.facture_origine_id ? sb.from("factures").select("id, numero").eq("id", f.facture_origine_id).single() : Promise.resolve({ data: null }),
    sb.from("factures").select("id, numero, statut, total_ttc").eq("facture_origine_id", id),
  ]);
  return {
    facture: f,
    lignes: normaliserLignes(lignes as Ligne[]),
    emetteur: (f.emetteur ?? params) as Partie,
    client: (f.client ?? client) as Partie,
    clientFiche: client,
    encaissements: encaissements ?? [],
    origine: origine.data as { id: string; numero: string } | null,
    avoirs: avoirs.data ?? [],
  };
}

export async function chargerDevis(sb: SupabaseClient, id: string) {
  const { data: d } = await sb.from("devis").select("*").eq("id", id).maybeSingle();
  if (!d) return null;
  const [{ data: lignes }, { data: params }, { data: client }] = await Promise.all([
    sb.from("devis_lignes").select("*").eq("devis_id", id),
    sb.from("parametres").select("*").eq("id", 1).single(),
    sb.from("clients").select("*").eq("id", d.client_id).single(),
  ]);
  return {
    devis: d,
    lignes: normaliserLignes(lignes as Ligne[]),
    emetteur: (d.emetteur ?? params) as Partie,
    client: (d.client ?? client) as Partie,
    clientFiche: client,
  };
}

function versLignesPdf(lignes: Ligne[]): LignePdf[] {
  return lignes.map((l) => ({
    designation: l.designation,
    description: l.description,
    quantite: l.quantite,
    unite: l.unite,
    prix_unitaire: l.prix_unitaire,
    total_ht: l.total_ht,
  }));
}

export async function pdfFacture(sb: SupabaseClient, id: string) {
  const c = await chargerFacture(sb, id);
  if (!c) return null;
  const f = c.facture;
  const doc: DocumentPdf = {
    genre: f.type === "avoir" ? "avoir" : "facture",
    numero: f.numero,
    objet: f.objet,
    date_emission: f.date_emission,
    date_echeance: f.date_echeance,
    reference_origine: c.origine?.numero ?? null,
    total_ht: Number(f.total_ht),
    total_tva: Number(f.total_tva),
    total_ttc: Number(f.total_ttc),
    notes: f.notes,
    emetteur: c.emetteur,
    client: c.client,
  };
  const octets = await genererPdf(doc, versLignesPdf(c.lignes), f.statut === "brouillon");
  return { octets, nom: `${f.type === "avoir" ? "Avoir" : "Facture"}-${f.numero ?? "brouillon"}.pdf`, facture: f };
}

export async function pdfDevis(sb: SupabaseClient, id: string, origine?: string) {
  const c = await chargerDevis(sb, id);
  if (!c) return null;
  const d = c.devis;
  const doc: DocumentPdf = {
    genre: "devis",
    numero: d.numero,
    objet: d.objet,
    date_emission: d.date_emission,
    date_validite: d.date_validite,
    total_ht: Number(d.total_ht),
    total_tva: Number(d.total_tva),
    total_ttc: Number(d.total_ttc),
    notes: d.notes,
    emetteur: c.emetteur,
    client: c.client,
    lien_acceptation: d.numero && origine ? `${origine}/devis/${d.jeton_acceptation}` : null,
    accepte: d.accepte_le ? { le: d.accepte_le, par: d.accepte_par ?? "", debut_anticipe: Boolean(d.debut_anticipe) } : null,
  };
  const octets = await genererPdf(doc, versLignesPdf(c.lignes), !d.numero);
  return { octets, nom: `Devis-${d.numero ?? "brouillon"}.pdf`, devis: d };
}

// Archive le PDF définitif d'une facture émise (stockage privé + empreinte SHA-256)
export async function archiverFacture(sb: SupabaseClient, id: string) {
  const r = await pdfFacture(sb, id);
  if (!r || r.facture.statut === "brouillon") return;
  const annee = String(r.facture.date_emission).slice(0, 4);
  // Le numéro seul ne suffit pas : un numéro peut avoir servi à une facture de test retirée avant la mise en service
  const chemin = `factures/${annee}/${r.facture.numero}-${String(id).slice(0, 8)}.pdf`;
  const { error } = await sb.storage.from("documents").upload(chemin, r.octets, { contentType: "application/pdf", upsert: false });
  if (error && !/exists/i.test(error.message)) throw new Error(`Archivage du PDF impossible : ${error.message}`);
  const sha = createHash("sha256").update(r.octets).digest("hex");
  await sb.from("factures").update({ pdf_chemin: chemin, pdf_sha256: sha }).eq("id", id);
}

export async function lirePdfArchive(sb: SupabaseClient, chemin: string) {
  const { data } = await sb.storage.from("documents").download(chemin);
  if (!data) return null;
  return new Uint8Array(await data.arrayBuffer());
}
