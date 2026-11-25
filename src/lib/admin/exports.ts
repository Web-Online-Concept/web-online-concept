import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { genererRapport } from "@/lib/pdf/tableau";
import { urssafAnnee } from "./donnees";
import { libelleMois, STATUTS_FACTURE } from "./format";

type Valeur = string | number | null;
type TypeColonne = "texte" | "euros" | "date";
type ColonneExport = { titre: string; largeur: number; type?: TypeColonne };

export type Tableau = {
  fichier: string;
  titre: string;
  sousTitre: string;
  colonnes: ColonneExport[];
  lignes: Valeur[][];
  totaux?: Valeur[];
  notes?: string[];
};

export const EXPORTS = ["recettes", "urssaf", "factures"] as const;
export type TypeExport = (typeof EXPORTS)[number];

const MODES: Record<string, string> = {
  virement: "Virement",
  cheque: "Chèque",
  especes: "Espèces",
  carte: "Carte",
  paypal: "PayPal",
  autre: "Autre",
};

const r2 = (n: number) => Math.round(n * 100) / 100;

function jourFr(iso: string) {
  const [a, m, j] = iso.slice(0, 10).split("-");
  return `${j}/${m}/${a}`;
}

function dateParis(horodatage: string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(new Date(horodatage));
}

const eurosPdf = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n).replace(/[  ]/g, " ");

// --- Livre des recettes : encaissements dans l'ordre chronologique ---------
async function livreRecettes(sb: SupabaseClient, annee: number): Promise<Tableau> {
  const debut = `${annee}-01-01`;
  const fin = `${annee}-12-31`;
  const [{ data: enc }, { data: hors }] = await Promise.all([
    sb
      .from("encaissements")
      .select("date_encaissement, montant, mode, facture:factures(numero, type, objet, client)")
      .gte("date_encaissement", debut)
      .lte("date_encaissement", fin)
      .order("date_encaissement"),
    sb.from("ca_hors_outil").select("mois, montant, note").gte("mois", debut).lte("mois", fin),
  ]);
  type Rec = { date: string; piece: string; client: string; nature: string; mode: string; montant: number };
  const recettes: Rec[] = [];
  for (const e of enc ?? []) {
    const f = e.facture as unknown as { numero: string | null; type: string; objet: string | null; client: { nom?: string } | null } | null;
    recettes.push({
      date: String(e.date_encaissement),
      piece: f?.numero ?? "",
      client: f?.client?.nom ?? "",
      nature: (f?.type === "avoir" ? "Remboursement : " : "") + (f?.objet || "Prestation"),
      mode: MODES[e.mode] ?? e.mode,
      montant: Number(e.montant),
    });
  }
  for (const h of hors ?? []) {
    recettes.push({
      date: String(h.mois),
      piece: "",
      client: "Divers",
      nature: `Recettes de ${libelleMois(String(h.mois))} encaissées hors outil${h.note ? ` (${h.note})` : ""}`,
      mode: "",
      montant: Number(h.montant),
    });
  }
  recettes.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  const total = r2(recettes.reduce((s, r) => s + r.montant, 0));
  return {
    fichier: `livre-des-recettes-${annee}`,
    titre: "Livre des recettes",
    sousTitre: `Année ${annee}`,
    colonnes: [
      { titre: "Date", largeur: 10, type: "date" },
      { titre: "Pièce", largeur: 12 },
      { titre: "Client", largeur: 22 },
      { titre: "Nature de la recette", largeur: 36 },
      { titre: "Règlement", largeur: 10 },
      { titre: "Montant", largeur: 12, type: "euros" },
    ],
    lignes: recettes.map((r) => [r.date, r.piece, r.client, r.nature, r.mode, r.montant]),
    totaux: ["Total", "", "", `${recettes.length} recette${recettes.length > 1 ? "s" : ""}`, "", total],
    notes: [
      "Recettes encaissées, classées par date d'encaissement. Montants en euros. TVA non applicable, art. 293 B du CGI.",
      "Les lignes « hors outil » regroupent par mois les recettes encaissées avant la mise en service du logiciel de facturation.",
    ],
  };
}

// --- Récapitulatif URSSAF -------------------------------------------------
async function recapUrssaf(sb: SupabaseClient, annee: number): Promise<Tableau> {
  const { mois, declarations, plafond, taux } = await urssafAnnee(sb, annee);
  const t = taux.length ? taux[taux.length - 1] : null;
  const somme = { ca: 0, decl: 0, cot: 0, vl: 0, cfp: 0, total: 0, paye: 0 };
  const lignes = mois.map((m) => {
    const d = declarations.get(m.mois);
    somme.ca += m.ca;
    somme.decl += d?.ca_declare ?? 0;
    somme.cot += m.cotisations;
    somme.vl += m.versementLiberatoire;
    somme.cfp += m.formation;
    somme.total += m.total;
    somme.paye += d?.montant_paye ?? 0;
    return [
      libelleMois(m.mois),
      m.ca,
      d ? d.ca_declare : null,
      m.cotisations,
      m.versementLiberatoire,
      m.formation,
      m.total,
      d?.montant_paye ?? null,
      d?.declare_le ? dateParis(d.declare_le) : null,
    ] as Valeur[];
  });
  const notes = [
    t
      ? `Taux appliqués : cotisations ${t.cotisations} %, versement libératoire ${t.versement_liberatoire} %, formation professionnelle ${t.formation} % (${t.libelle_categorie}). Plafond annuel : ${eurosPdf(plafond)}.`
      : "Aucun taux URSSAF paramétré.",
    "Chaque part est calculée sur le chiffre d'affaires encaissé du mois arrondi à l'euro, puis arrondie à l'euro.",
  ];
  for (const [m, d] of declarations) if (d.note) notes.push(`${libelleMois(m)} : ${d.note}`);
  return {
    fichier: `urssaf-${annee}`,
    titre: "Récapitulatif URSSAF",
    sousTitre: `Année ${annee}`,
    colonnes: [
      { titre: "Mois", largeur: 14 },
      { titre: "CA encaissé", largeur: 11, type: "euros" },
      { titre: "CA déclaré", largeur: 11, type: "euros" },
      { titre: "Cotisations", largeur: 11, type: "euros" },
      { titre: "Impôt (VL)", largeur: 10, type: "euros" },
      { titre: "Formation", largeur: 9, type: "euros" },
      { titre: "Total calculé", largeur: 11, type: "euros" },
      { titre: "Payé", largeur: 10, type: "euros" },
      { titre: "Déclaré le", largeur: 10, type: "date" },
    ],
    lignes,
    totaux: ["Total", r2(somme.ca), r2(somme.decl), somme.cot, somme.vl, somme.cfp, somme.total, r2(somme.paye), null],
    notes,
  };
}

// --- Registre des factures et avoirs --------------------------------------
async function registreFactures(sb: SupabaseClient, annee: number): Promise<Tableau> {
  const { data } = await sb
    .from("factures")
    .select("numero, type, date_emission, date_echeance, objet, total_ttc, montant_encaisse, statut, client")
    .not("numero", "is", null)
    .gte("date_emission", `${annee}-01-01`)
    .lte("date_emission", `${annee}-12-31`)
    .order("numero");
  const factures = data ?? [];
  const total = r2(factures.reduce((s, f) => s + Number(f.total_ttc), 0));
  const encaisse = r2(factures.reduce((s, f) => s + Number(f.montant_encaisse), 0));
  return {
    fichier: `registre-factures-${annee}`,
    titre: "Registre des factures",
    sousTitre: `Année ${annee}`,
    colonnes: [
      { titre: "Numéro", largeur: 11 },
      { titre: "Type", largeur: 7 },
      { titre: "Date", largeur: 9, type: "date" },
      { titre: "Échéance", largeur: 9, type: "date" },
      { titre: "Client", largeur: 20 },
      { titre: "Objet", largeur: 22 },
      { titre: "Montant", largeur: 10, type: "euros" },
      { titre: "Encaissé", largeur: 10, type: "euros" },
      { titre: "Statut", largeur: 8 },
    ],
    lignes: factures.map((f) => [
      f.numero,
      f.type === "avoir" ? "Avoir" : "Facture",
      f.date_emission,
      f.date_echeance,
      (f.client as { nom?: string } | null)?.nom ?? "",
      f.objet ?? "",
      Number(f.total_ttc),
      Number(f.montant_encaisse),
      STATUTS_FACTURE[f.statut] ?? f.statut,
    ]),
    totaux: ["Total", "", "", "", `${factures.length} pièce${factures.length > 1 ? "s" : ""}`, "", total, encaisse, ""],
    notes: ["Numérotation continue, sans rupture. Une facture émise n'est jamais modifiée ni supprimée : elle est corrigée par un avoir."],
  };
}

export async function construireTableau(sb: SupabaseClient, type: TypeExport, annee: number) {
  if (type === "recettes") return livreRecettes(sb, annee);
  if (type === "urssaf") return recapUrssaf(sb, annee);
  return registreFactures(sb, annee);
}

// --- Rendus --------------------------------------------------------------
function enTexte(v: Valeur, type: TypeColonne | undefined, pdf: boolean) {
  if (v === null || v === "") return "";
  if (type === "euros" && typeof v === "number") return pdf ? eurosPdf(v) : v.toFixed(2).replace(".", ",");
  if (type === "date" && typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v)) return jourFr(v);
  return String(v);
}

export function tableauCsv(t: Tableau) {
  const echapper = (s: string) => (/[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);
  const ligne = (vals: Valeur[]) => vals.map((v, i) => echapper(enTexte(v, t.colonnes[i].type, false))).join(";");
  const contenu = [t.colonnes.map((c) => echapper(c.titre)).join(";"), ...t.lignes.map(ligne), ...(t.totaux ? [ligne(t.totaux)] : [])].join("\r\n");
  return "﻿" + contenu + "\r\n";
}

export async function tableauPdf(t: Tableau, pied: string) {
  return genererRapport({
    titre: t.titre,
    sousTitre: t.sousTitre,
    colonnes: t.colonnes.map((c) => ({ titre: c.titre, largeur: c.largeur, droite: c.type === "euros" })),
    lignes: t.lignes.map((l) => l.map((v, i) => enTexte(v, t.colonnes[i].type, true))),
    totaux: t.totaux?.map((v, i) => enTexte(v, t.colonnes[i].type, true)),
    notes: t.notes,
    pied,
  });
}

export async function piedDePage(sb: SupabaseClient) {
  const { data: p } = await sb.from("parametres").select("nom_commercial, raison_sociale, siret").eq("id", 1).maybeSingle();
  const edite = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Paris" }).format(new Date());
  return `${p?.nom_commercial ?? "Web Online Concept"} : ${p?.raison_sociale ?? ""}, SIRET ${p?.siret ?? ""}. Édité le ${edite}.`;
}
