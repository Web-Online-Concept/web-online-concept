const euros = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
const eurosRonds = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export function fmtEuros(n: number | string | null | undefined, arrondi = false) {
  const v = Number(n ?? 0);
  return (arrondi ? eurosRonds : euros).format(v);
}

export function fmtDate(iso: string | null | undefined) {
  if (!iso) return "";
  const d = iso.length === 10 ? new Date(iso + "T12:00:00Z") : new Date(iso);
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Paris" }).format(d);
}

export const MOIS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

export function libelleMois(iso: string) {
  const [a, m] = iso.split("-").map(Number);
  return `${MOIS[m - 1]} ${a}`;
}

// Date du jour à Paris, au format AAAA-MM-JJ
export function aujourdhui() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(new Date());
}

export const STATUTS_FACTURE: Record<string, string> = {
  brouillon: "Brouillon",
  emise: "Émise",
  payee: "Payée",
  annulee: "Annulée",
};

export const STATUTS_DEVIS: Record<string, string> = {
  brouillon: "Brouillon",
  envoye: "Envoyé",
  accepte: "Accepté",
  refuse: "Refusé",
  expire: "Expiré",
};

// « de mars 2026 », « d'avril 2026 », « d'août 2026 »
export function deMois(iso: string) {
  const l = libelleMois(iso);
  return /^[aeiouéèâ]/i.test(l) ? `d'${l}` : `de ${l}`;
}
