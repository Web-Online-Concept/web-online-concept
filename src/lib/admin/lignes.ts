import "server-only";

export type LigneSaisie = {
  designation: string;
  description: string;
  quantite: number;
  unite: string;
  prix_unitaire: number;
};

// Lit et valide les lignes envoyées par l'éditeur (champ caché JSON)
export function lireLignes(formData: FormData): LigneSaisie[] {
  let brut: unknown;
  try {
    brut = JSON.parse(String(formData.get("lignes") ?? "[]"));
  } catch {
    throw new Error("Lignes illisibles.");
  }
  if (!Array.isArray(brut)) throw new Error("Lignes illisibles.");
  return brut
    .map((l) => ({
      designation: String(l?.designation ?? "").trim().slice(0, 300),
      description: String(l?.description ?? "").trim().slice(0, 2000),
      quantite: Number(String(l?.quantite ?? "0").replace(",", ".")),
      unite: String(l?.unite ?? "").trim().slice(0, 20),
      prix_unitaire: Number(String(l?.prix_unitaire ?? "0").replace(",", ".")),
    }))
    .filter((l) => l.designation !== "")
    .map((l) => ({
      ...l,
      quantite: Number.isFinite(l.quantite) ? Math.round(l.quantite * 1000) / 1000 : 0,
      prix_unitaire: Number.isFinite(l.prix_unitaire) ? Math.round(l.prix_unitaire * 100) / 100 : 0,
    }));
}

export function texteOuNull(formData: FormData, cle: string) {
  const v = String(formData.get(cle) ?? "").trim();
  return v === "" ? null : v;
}

// Lit un montant saisi à la française (« 1 234,56 ») ; null si vide ou invalide
export function lireMontant(formData: FormData, cle: string): number | null {
  const v = String(formData.get(cle) ?? "")
    .replace(/[\s  €]/g, "")
    .replace(",", ".");
  if (v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : null;
}
