import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { calculerMois, type CalculMois, type Taux } from "./urssaf";

export type Declaration = {
  mois: string;
  ca_declare: number;
  montant_paye: number | null;
  declare_le: string | null;
  note: string | null;
};

export async function listeTaux(sb: SupabaseClient): Promise<Taux[]> {
  const { data } = await sb.from("taux_urssaf").select("*").order("date_effet");
  return (data ?? []).map((t) => ({
    ...t,
    cotisations: Number(t.cotisations),
    versement_liberatoire: Number(t.versement_liberatoire),
    formation: Number(t.formation),
    plafond_ca: Number(t.plafond_ca),
  }));
}

// CA encaissé par mois (outil + reprise hors outil), calcul URSSAF et déclarations pour une année
export async function urssafAnnee(sb: SupabaseClient, annee: number) {
  const debut = `${annee}-01-01`;
  const fin = `${annee}-12-31`;
  const [enc, hors, decl, taux] = await Promise.all([
    sb.from("encaissements").select("date_encaissement, montant").gte("date_encaissement", debut).lte("date_encaissement", fin),
    sb.from("ca_hors_outil").select("mois, montant").gte("mois", debut).lte("mois", fin),
    sb.from("declarations_urssaf").select("*").gte("mois", debut).lte("mois", fin),
    listeTaux(sb),
  ]);
  const parMoisOutil = new Map<string, number>();
  for (const e of enc.data ?? []) {
    const m = String(e.date_encaissement).slice(0, 7) + "-01";
    parMoisOutil.set(m, (parMoisOutil.get(m) ?? 0) + Number(e.montant));
  }
  const parMoisHors = new Map<string, number>();
  for (const h of hors.data ?? []) parMoisHors.set(String(h.mois), Number(h.montant));
  const declarations = new Map<string, Declaration>();
  for (const d of decl.data ?? []) {
    declarations.set(String(d.mois), {
      ...d,
      ca_declare: Number(d.ca_declare),
      montant_paye: d.montant_paye === null ? null : Number(d.montant_paye),
    });
  }
  const mois: CalculMois[] = [];
  for (let i = 1; i <= 12; i++) {
    const m = `${annee}-${String(i).padStart(2, "0")}-01`;
    mois.push(calculerMois(m, round2(parMoisOutil.get(m) ?? 0), parMoisHors.get(m) ?? 0, taux));
  }
  const caAnnee = round2(mois.reduce((s, m) => s + m.ca, 0));
  const tauxCourant = taux.length ? taux[taux.length - 1] : null;
  return { mois, declarations, caAnnee, plafond: tauxCourant?.plafond_ca ?? 83600, taux };
}

export function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export type LigneDoc = {
  id?: string;
  position: number;
  designation: string;
  description: string | null;
  quantite: number;
  unite: string | null;
  prix_unitaire: number;
  taux_tva: number;
  total_ht?: number;
};

export async function listeClients(sb: SupabaseClient, avecArchives = false) {
  let q = sb.from("clients").select("id, nom, type, siren, ville, email, archive").order("nom");
  if (!avecArchives) q = q.eq("archive", false);
  const { data } = await q;
  return data ?? [];
}
