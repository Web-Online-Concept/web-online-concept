import Link from "next/link";

export function TitrePage({ titre, children }: { titre: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-[28px] font-semibold tracking-tight">{titre}</h1>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export function Carte({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-[#E1E7EF] bg-white p-6 ${className}`}>{children}</section>;
}

export function BoutonLien({
  href,
  children,
  variante = "principal",
}: {
  href: string;
  children: React.ReactNode;
  variante?: "principal" | "secondaire";
}) {
  return (
    <Link
      href={href}
      className={
        variante === "principal"
          ? "rounded-full bg-bleu px-5 py-2.5 text-[15px] font-medium text-white hover:bg-[#3A72FF]"
          : "rounded-full border border-[#CBD5E1] bg-white px-5 py-2.5 text-[15px] font-medium text-nuit hover:border-nuit"
      }
    >
      {children}
    </Link>
  );
}

export const classeBouton =
  "rounded-full bg-bleu px-5 py-2.5 text-[15px] font-medium text-white hover:bg-[#3A72FF] disabled:opacity-60";
export const classeBoutonSecondaire =
  "rounded-full border border-[#CBD5E1] bg-white px-5 py-2.5 text-[15px] font-medium text-nuit hover:border-nuit disabled:opacity-60";
export const classeBoutonDanger =
  "rounded-full border border-[#F4C7C3] bg-white px-5 py-2.5 text-[15px] font-medium text-[#B42318] hover:border-[#B42318] disabled:opacity-60";
export const classeChamp =
  "w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-[15px] text-nuit outline-none focus:border-bleu focus:ring-2 focus:ring-bleu/20 disabled:bg-ciel";

export function Champ({
  libelle,
  htmlFor,
  aide,
  children,
  className = "",
}: {
  libelle: string;
  htmlFor: string;
  aide?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-[#2C4558]">
        {libelle}
      </label>
      {children}
      {aide && <p className="text-xs text-[#4A6178]">{aide}</p>}
    </div>
  );
}

const couleursStatut: Record<string, string> = {
  brouillon: "bg-[#EEF2F7] text-[#4A6178]",
  emise: "bg-[#E8EFFF] text-[#1638A8]",
  envoye: "bg-[#E8EFFF] text-[#1638A8]",
  payee: "bg-[#E3F8EC] text-[#0E7A45]",
  accepte: "bg-[#E3F8EC] text-[#0E7A45]",
  annulee: "bg-[#FEF3F2] text-[#B42318]",
  refuse: "bg-[#FEF3F2] text-[#B42318]",
  expire: "bg-[#FFF4E5] text-[#9A5B00]",
  retard: "bg-[#FFF4E5] text-[#9A5B00]",
};

export function Pastille({ statut, libelle }: { statut: string; libelle: string }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${couleursStatut[statut] ?? couleursStatut.brouillon}`}>
      {libelle}
    </span>
  );
}

export function Chargement() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true">
      <div className="h-9 w-56 animate-pulse rounded-lg bg-[#E1E7EF]" />
      <div className="h-40 animate-pulse rounded-2xl bg-white" />
      <div className="h-64 animate-pulse rounded-2xl bg-white" />
    </div>
  );
}

export function Vide({ children }: { children: React.ReactNode }) {
  return <p className="rounded-xl bg-ciel px-5 py-8 text-center text-[15px] text-[#4A6178]">{children}</p>;
}

export function Alerte({ children, ton = "info" }: { children: React.ReactNode; ton?: "info" | "erreur" | "succes" }) {
  const c =
    ton === "erreur"
      ? "bg-[#FEF3F2] text-[#B42318]"
      : ton === "succes"
        ? "bg-[#E3F8EC] text-[#0E7A45]"
        : "bg-[#E8EFFF] text-[#1638A8]";
  return <p className={`rounded-xl px-4 py-3 text-[15px] ${c}`}>{children}</p>;
}
