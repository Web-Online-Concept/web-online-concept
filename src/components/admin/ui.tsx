import Link from "next/link";
import { Icone, type NomIcone } from "@/components/admin/Icones";

// Briques communes du back-office : en-tête de page, cartes, boutons, champs, pastilles de statut, listes.

export function TitrePage({
  titre,
  description,
  retour,
  children,
}: {
  titre: React.ReactNode;
  description?: React.ReactNode;
  retour?: { href: string; libelle: string };
  children?: React.ReactNode;
}) {
  return (
    <header className="mb-6 sm:mb-8">
      {retour && (
        <Link
          href={retour.href}
          className="-ml-1 mb-3 inline-flex items-center gap-1 rounded-lg px-1 py-0.5 text-sm font-medium text-[#4A6178] transition-colors hover:text-nuit"
        >
          <Icone nom="retour" className="h-4 w-4" />
          {retour.libelle}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div className="min-w-0">
          <h1 className="text-[26px] font-semibold leading-tight tracking-tight text-nuit sm:text-[30px]">{titre}</h1>
          {description && <div className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-[#4A6178]">{description}</div>}
        </div>
        {children && <div className="flex w-full flex-wrap gap-2 sm:w-auto [&>*]:flex-1 sm:[&>*]:flex-none">{children}</div>}
      </div>
    </header>
  );
}

export function Carte({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`rounded-2xl border border-[#E3E9F0] bg-white p-5 shadow-[0_1px_2px_rgba(10,26,47,0.04)] sm:p-6 ${className}`}>
      {children}
    </section>
  );
}

// Titre de carte, avec un lien ou une action à droite
export function TitreCarte({ children, action, sousTitre }: { children: React.ReactNode; action?: React.ReactNode; sousTitre?: React.ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
      <div>
        <h2 className="text-[17px] font-semibold text-nuit">{children}</h2>
        {sousTitre && <p className="mt-0.5 text-sm text-[#4A6178]">{sousTitre}</p>}
      </div>
      {action}
    </div>
  );
}

export function LienCarte({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1 text-sm font-medium text-bleu transition-colors hover:text-[#1638A8]">
      {children}
      <Icone nom="chevron" className="h-4 w-4" />
    </Link>
  );
}

export const classeBouton =
  "inline-flex items-center justify-center gap-2 rounded-full bg-bleu px-5 py-2.5 text-[15px] font-medium text-white shadow-[0_10px_24px_-14px_rgba(31,94,255,0.9)] transition-colors hover:bg-[#3A72FF] disabled:opacity-60";
export const classeBoutonSecondaire =
  "inline-flex items-center justify-center gap-2 rounded-full border border-[#D5DEE8] bg-white px-5 py-2.5 text-[15px] font-medium text-nuit transition-colors hover:border-nuit disabled:opacity-60";
export const classeBoutonDanger =
  "inline-flex items-center justify-center gap-2 rounded-full border border-[#F4C7C3] bg-white px-5 py-2.5 text-[15px] font-medium text-[#B42318] transition-colors hover:border-[#B42318] disabled:opacity-60";
export const classeBoutonDiscret =
  "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-[#4A6178] transition-colors hover:bg-ciel hover:text-nuit";
export const classeChamp =
  "w-full min-w-0 rounded-xl border border-[#D5DEE8] bg-white px-3.5 py-2.5 text-[15px] text-nuit outline-none transition-[border-color,box-shadow] placeholder:text-[#93A6BB] focus:border-bleu focus:ring-4 focus:ring-bleu/12 disabled:bg-ciel";

export function BoutonLien({
  href,
  children,
  variante = "principal",
  icone,
}: {
  href: string;
  children: React.ReactNode;
  variante?: "principal" | "secondaire";
  icone?: NomIcone;
}) {
  return (
    <Link href={href} className={variante === "principal" ? classeBouton : classeBoutonSecondaire}>
      {icone && <Icone nom={icone} className="h-[18px] w-[18px]" />}
      {children}
    </Link>
  );
}

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
      {aide && <p className="text-xs leading-relaxed text-[#4A6178]">{aide}</p>}
    </div>
  );
}

const couleursStatut: Record<string, string> = {
  brouillon: "bg-[#EEF2F7] text-[#4A6178]",
  emise: "bg-[#E8EFFF] text-[#1638A8]",
  envoye: "bg-[#E8EFFF] text-[#1638A8]",
  payee: "bg-[#E3F8EC] text-[#0E7A45]",
  accepte: "bg-[#E3F8EC] text-[#0E7A45]",
  publie: "bg-[#E3F8EC] text-[#0E7A45]",
  annulee: "bg-[#FEF3F2] text-[#B42318]",
  refuse: "bg-[#FEF3F2] text-[#B42318]",
  expire: "bg-[#FFF4E5] text-[#9A5B00]",
  retard: "bg-[#FFF4E5] text-[#9A5B00]",
};

export function Pastille({ statut, libelle }: { statut: string; libelle: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${couleursStatut[statut] ?? couleursStatut.brouillon}`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {libelle}
    </span>
  );
}

// Rangée de filtres (années, statuts) : défile horizontalement sur téléphone
export function Filtres({ libelle, options }: { libelle: string; options: { href: string; libelle: string; actif: boolean; compte?: number }[] }) {
  return (
    <nav aria-label={libelle} className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
      {options.map((o) => (
        <Link
          key={o.href}
          href={o.href}
          aria-current={o.actif ? "page" : undefined}
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            o.actif ? "bg-nuit text-white" : "bg-white text-[#2C4558] ring-1 ring-[#E3E9F0] hover:ring-[#B8C6D6]"
          }`}
        >
          {o.libelle}
          {o.compte !== undefined && (
            <span className={`rounded-full px-1.5 text-xs tabular-nums ${o.actif ? "bg-white/15 text-white" : "bg-ciel text-[#4A6178]"}`}>{o.compte}</span>
          )}
        </Link>
      ))}
    </nav>
  );
}

// Chiffre clé : pictogramme, libellé, valeur, précision
export function Chiffre({
  libelle,
  valeur,
  detail,
  icone,
  href,
  ton = "bleu",
}: {
  libelle: string;
  valeur: React.ReactNode;
  detail?: React.ReactNode;
  icone: NomIcone;
  href?: string;
  ton?: "bleu" | "vert" | "orange" | "cyan";
}) {
  const tons = {
    bleu: "bg-[#E8EFFF] text-bleu",
    vert: "bg-[#E3F8EC] text-[#0E7A45]",
    orange: "bg-[#FFF4E5] text-[#9A5B00]",
    cyan: "bg-[#E0F7FB] text-[#0B8E9E]",
  };
  const corps = (
    <>
      <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${tons[ton]}`}>
        <Icone nom={icone} className="h-5 w-5" />
      </span>
      <p className="mt-4 text-sm text-[#4A6178]">{libelle}</p>
      <p className="mt-1 text-[24px] font-semibold leading-tight tracking-tight text-nuit tabular-nums">{valeur}</p>
      {detail && <div className="mt-1.5 text-sm text-[#4A6178]">{detail}</div>}
    </>
  );
  const classe = "block rounded-2xl border border-[#E3E9F0] bg-white p-5 shadow-[0_1px_2px_rgba(10,26,47,0.04)]";
  return href ? (
    <Link href={href} className={`${classe} transition-[border-color,box-shadow] hover:border-[#C8D4E3] hover:shadow-[0_14px_30px_-22px_rgba(10,26,47,0.5)]`}>
      {corps}
    </Link>
  ) : (
    <div className={classe}>{corps}</div>
  );
}

export function Chargement() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-label="Chargement">
      <div className="h-9 w-56 animate-pulse rounded-lg bg-[#E1E7EF]" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="h-32 animate-pulse rounded-2xl bg-white" />
        <div className="h-32 animate-pulse rounded-2xl bg-white" />
        <div className="h-32 animate-pulse rounded-2xl bg-white" />
      </div>
      <div className="h-64 animate-pulse rounded-2xl bg-white" />
    </div>
  );
}

export function Vide({ children, icone = "coche", action }: { children: React.ReactNode; icone?: NomIcone; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl bg-ciel px-5 py-10 text-center">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#4A6178] shadow-[0_1px_2px_rgba(10,26,47,0.06)]">
        <Icone nom={icone} className="h-5 w-5" />
      </span>
      <div className="max-w-sm text-[15px] leading-relaxed text-[#4A6178]">{children}</div>
      {action}
    </div>
  );
}

export function Alerte({ children, ton = "info" }: { children: React.ReactNode; ton?: "info" | "erreur" | "succes" }) {
  const c =
    ton === "erreur"
      ? "bg-[#FEF3F2] text-[#B42318] ring-[#F4C7C3]"
      : ton === "succes"
        ? "bg-[#E3F8EC] text-[#0E7A45] ring-[#BFEBD2]"
        : "bg-[#E8EFFF] text-[#1638A8] ring-[#C9D8FF]";
  const icone: NomIcone = ton === "erreur" ? "alerte" : ton === "succes" ? "coche" : "horloge";
  return (
    <div role={ton === "erreur" ? "alert" : "status"} className={`flex items-start gap-2.5 rounded-xl px-4 py-3 text-[15px] ring-1 ${c}`}>
      <Icone nom={icone} className="mt-0.5 h-[18px] w-[18px] shrink-0" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

// Liste de documents (devis, factures) : tableau sur ordinateur, cartes empilées sur téléphone
export const COLONNES_DOCS = "md:grid-cols-[8.5rem_minmax(0,1fr)_7rem_8.5rem_7.5rem]";

export function EnTeteDocuments({ colonnes = ["Numéro", "Client et objet", "Date", "Montant", "Statut"] }: { colonnes?: string[] }) {
  return (
    <div aria-hidden="true" className={`hidden gap-4 border-b border-[#EEF2F7] px-3 pb-2.5 text-xs font-medium text-[#4A6178] md:grid ${COLONNES_DOCS}`}>
      <span>{colonnes[0]}</span>
      <span>{colonnes[1]}</span>
      <span>{colonnes[2]}</span>
      <span className="text-right">{colonnes[3]}</span>
      <span className="text-right">{colonnes[4]}</span>
    </div>
  );
}

export function LigneDocument({
  href,
  numero,
  client,
  objet,
  date,
  montant,
  statut,
}: {
  href: string;
  numero: React.ReactNode;
  client?: string | null;
  objet?: string | null;
  date: string;
  montant: string;
  statut: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 rounded-xl px-3 py-3.5 transition-colors hover:bg-ciel md:gap-y-0 ${COLONNES_DOCS}`}
      >
        <span className="font-semibold text-nuit tabular-nums">{numero}</span>
        <span className="justify-self-end md:hidden">{statut}</span>
        <span className="col-span-2 min-w-0 text-[15px] md:col-span-1">
          <span className="block truncate text-nuit">{client}</span>
          {objet && <span className="block truncate text-sm text-[#4A6178]">{objet}</span>}
        </span>
        <span className="text-sm text-[#4A6178] tabular-nums md:text-[15px]">{date}</span>
        <span className="justify-self-end text-[15px] font-medium text-nuit tabular-nums">{montant}</span>
        <span className="hidden justify-self-end md:block">{statut}</span>
      </Link>
    </li>
  );
}
