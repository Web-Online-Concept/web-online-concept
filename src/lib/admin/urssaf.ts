// Calcul des cotisations mensuelles, à l'identique de l'URSSAF :
// chaque part est calculée sur le CA encaissé puis arrondie à l'euro.

export type Taux = {
  date_effet: string;
  libelle_categorie: string;
  cotisations: number;
  versement_liberatoire: number;
  formation: number;
  plafond_ca: number;
};

export type CalculMois = {
  mois: string; // AAAA-MM-01
  caOutil: number;
  caHorsOutil: number;
  ca: number;
  caDeclarable: number; // arrondi à l'euro, comme sur le formulaire de l'URSSAF
  cotisations: number;
  versementLiberatoire: number;
  formation: number;
  total: number;
  taux: Taux | null;
  echeance: string; // dernier jour du mois suivant
};

export function tauxApplicable(listes: Taux[], mois: string): Taux | null {
  const tri = [...listes].sort((a, b) => (a.date_effet < b.date_effet ? 1 : -1));
  return tri.find((t) => t.date_effet <= mois) ?? null;
}

export function echeance(mois: string) {
  const [a, m] = mois.split("-").map(Number);
  const fin = new Date(Date.UTC(a, m + 1, 0)); // dernier jour du mois suivant
  return fin.toISOString().slice(0, 10);
}

export function calculerMois(mois: string, caOutil: number, caHorsOutil: number, listes: Taux[]): CalculMois {
  const taux = tauxApplicable(listes, mois);
  const ca = Math.round((caOutil + caHorsOutil) * 100) / 100;
  const caDeclarable = Math.round(ca);
  const part = (t: number) => (caDeclarable > 0 ? Math.round((caDeclarable * Number(t)) / 100) : 0);
  const cotisations = taux ? part(taux.cotisations) : 0;
  const versementLiberatoire = taux ? part(taux.versement_liberatoire) : 0;
  const formation = taux ? part(taux.formation) : 0;
  return {
    mois,
    caOutil,
    caHorsOutil,
    ca,
    caDeclarable,
    cotisations,
    versementLiberatoire,
    formation,
    total: cotisations + versementLiberatoire + formation,
    taux,
    echeance: echeance(mois),
  };
}
