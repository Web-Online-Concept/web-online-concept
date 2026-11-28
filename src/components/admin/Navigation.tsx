"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { seDeconnecter } from "@/app/(interne)/admin/connexion/actions";
import { Icone, type NomIcone } from "@/components/admin/Icones";

export type Compteurs = { messages?: number; retards?: number };

type Lien = { href: string; libelle: string; icone: NomIcone; compteur?: keyof Compteurs };

const GROUPES: { titre?: string; liens: Lien[] }[] = [
  { liens: [{ href: "/admin", libelle: "Tableau de bord", icone: "tableau" }] },
  {
    titre: "Activité",
    liens: [
      { href: "/admin/devis", libelle: "Devis", icone: "devis" },
      { href: "/admin/factures", libelle: "Factures", icone: "factures", compteur: "retards" },
      { href: "/admin/clients", libelle: "Clients", icone: "clients" },
    ],
  },
  {
    titre: "Comptabilité",
    liens: [
      { href: "/admin/urssaf", libelle: "URSSAF", icone: "urssaf" },
      { href: "/admin/exports", libelle: "Exports", icone: "exports" },
    ],
  },
  {
    titre: "Site",
    liens: [
      { href: "/admin/messages", libelle: "Messages", icone: "messages", compteur: "messages" },
      { href: "/admin/blog", libelle: "Blog", icone: "blog" },
    ],
  },
];

// Barre d'onglets du téléphone : les quatre rubriques du quotidien, le reste sous « Plus »
const ONGLETS: Lien[] = [
  { href: "/admin", libelle: "Accueil", icone: "tableau" },
  { href: "/admin/factures", libelle: "Factures", icone: "factures", compteur: "retards" },
  { href: "/admin/devis", libelle: "Devis", icone: "devis" },
  { href: "/admin/messages", libelle: "Messages", icone: "messages", compteur: "messages" },
];
const AUTRES: Lien[] = [
  { href: "/admin/clients", libelle: "Clients", icone: "clients" },
  { href: "/admin/urssaf", libelle: "URSSAF", icone: "urssaf" },
  { href: "/admin/exports", libelle: "Exports", icone: "exports" },
  { href: "/admin/blog", libelle: "Blog", icone: "blog" },
  { href: "/admin/parametres", libelle: "Paramètres", icone: "parametres" },
];

const estActif = (chemin: string, href: string) => (href === "/admin" ? chemin === "/admin" : chemin === href || chemin.startsWith(href + "/"));

function Compte({ n, sombre = false }: { n?: number; sombre?: boolean }) {
  if (!n) return null;
  return (
    <span
      className={`ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums ${
        sombre ? "bg-cyan text-nuit" : "bg-[#E8EFFF] text-bleu"
      }`}
    >
      {n > 99 ? "99+" : n}
    </span>
  );
}

// Lien de la barre latérale : la page en cours prend la pastille à bord dégradé du menu du site
function LienLateral({ lien, actif, compteurs }: { lien: Lien; actif: boolean; compteurs: Compteurs }) {
  return (
    <Link
      href={lien.href}
      aria-current={actif ? "page" : undefined}
      className={`group relative flex items-center gap-3 rounded-xl p-px text-[15px] transition-colors ${
        actif ? "bg-[linear-gradient(90deg,#1F5EFF,#00B4D8_55%,#2BD47D)] text-white shadow-[0_0_24px_-10px_rgba(0,180,216,0.9)]" : "text-[#B8C6D6] hover:text-white"
      }`}
    >
      <span className={`flex w-full items-center gap-3 rounded-[11px] px-3 py-2.5 ${actif ? "bg-[#0D2240]" : "group-hover:bg-white/5"}`}>
        <Icone nom={lien.icone} className={`h-5 w-5 shrink-0 ${actif ? "text-cyan" : ""}`} />
        {lien.libelle}
        <Compte n={lien.compteur ? compteurs[lien.compteur] : undefined} sombre />
      </span>
    </Link>
  );
}

export default function Navigation({ compteurs = {} }: { compteurs?: Compteurs }) {
  return <Barres chemin={usePathname() ?? ""} compteurs={compteurs} />;
}

// Version d'attente (pendant le chargement des compteurs) : sans lecture de l'adresse
export function NavigationAttente() {
  return <Barres chemin="" compteurs={{}} />;
}

function Barres({ chemin, compteurs }: { chemin: string; compteurs: Compteurs }) {
  const [plus, setPlus] = useState(false);
  const autreActif = AUTRES.some((l) => estActif(chemin, l.href));

  // La feuille « Plus » se ferme à chaque changement de page et avec Échap
  useEffect(() => setPlus(false), [chemin]);
  useEffect(() => {
    if (!plus) return;
    const echap = (e: KeyboardEvent) => e.key === "Escape" && setPlus(false);
    document.addEventListener("keydown", echap);
    return () => document.removeEventListener("keydown", echap);
  }, [plus]);

  return (
    <>
      {/* Ordinateur : barre latérale */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col overflow-y-auto bg-nuit text-white lg:flex">
        <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(31,94,255,0.32),transparent_68%)]" />
        <Link href="/admin" aria-label="Tableau de bord" className="relative px-6 pb-6 pt-7">
          <Image src="/logo/logo-horizontal-couleur-fond-sombre.svg" alt="" width={180} height={58} className="h-10 w-auto" priority />
        </Link>
        <nav aria-label="Back-office" className="relative flex flex-1 flex-col gap-6 px-3">
          {GROUPES.map((g, i) => (
            <div key={i}>
              {g.titre && <p className="mb-1.5 px-3 text-xs font-medium text-[#6F86A0]">{g.titre}</p>}
              <ul className="flex flex-col gap-1">
                {g.liens.map((l) => (
                  <li key={l.href}>
                    <LienLateral lien={l} actif={estActif(chemin, l.href)} compteurs={compteurs} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="relative mt-6 flex flex-col gap-1 border-t border-white/10 px-3 py-4">
          <LienLateral lien={{ href: "/admin/parametres", libelle: "Paramètres", icone: "parametres" }} actif={estActif(chemin, "/admin/parametres")} compteurs={compteurs} />
          <a href="/" target="_blank" rel="noopener" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] text-[#B8C6D6] transition-colors hover:bg-white/5 hover:text-white">
            <Icone nom="site" className="h-5 w-5" />
            Voir le site
          </a>
          <form action={seDeconnecter}>
            <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] text-[#B8C6D6] transition-colors hover:bg-white/5 hover:text-white">
              <Icone nom="sortie" className="h-5 w-5" />
              Se déconnecter
            </button>
          </form>
        </div>
      </aside>

      {/* Téléphone et tablette : bandeau du haut */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-nuit px-5 text-white lg:hidden">
        <Link href="/admin" aria-label="Tableau de bord">
          <Image src="/logo/logo-horizontal-couleur-fond-sombre.svg" alt="" width={150} height={48} className="h-9 w-auto" priority />
        </Link>
        <a href="/" target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-sm text-[#D5DEE8]">
          <Icone nom="site" className="h-4 w-4" />
          Le site
        </a>
      </header>

      {/* Téléphone et tablette : barre d'onglets en bas */}
      <nav
        aria-label="Back-office"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E3E9F0] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {ONGLETS.map((l) => {
            const actif = estActif(chemin, l.href);
            const n = l.compteur ? compteurs[l.compteur] : undefined;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={actif ? "page" : undefined}
                  className={`relative flex flex-col items-center gap-1 pb-2 pt-2.5 text-[11px] font-medium ${actif ? "text-bleu" : "text-[#4A6178]"}`}
                >
                  {actif && <span aria-hidden="true" className="absolute inset-x-5 top-0 h-[3px] rounded-b-full bg-[linear-gradient(90deg,#1F5EFF,#00B4D8,#2BD47D)]" />}
                  <span className="relative">
                    <Icone nom={l.icone} className="h-6 w-6" />
                    {!!n && (
                      <span className="absolute -right-2.5 -top-1.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-bleu px-1 text-[10px] font-semibold text-white ring-2 ring-white">
                        {n > 99 ? "99+" : n}
                      </span>
                    )}
                  </span>
                  {l.libelle}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => setPlus((p) => !p)}
              aria-expanded={plus}
              aria-controls="admin-plus"
              className={`relative flex w-full flex-col items-center gap-1 pb-2 pt-2.5 text-[11px] font-medium ${plus || autreActif ? "text-bleu" : "text-[#4A6178]"}`}
            >
              {autreActif && !plus && <span aria-hidden="true" className="absolute inset-x-5 top-0 h-[3px] rounded-b-full bg-[linear-gradient(90deg,#1F5EFF,#00B4D8,#2BD47D)]" />}
              <Icone nom={plus ? "fermer" : "autres"} className="h-6 w-6" />
              Plus
            </button>
          </li>
        </ul>
      </nav>

      {/* Feuille « Plus » : les autres rubriques, au-dessus de la barre d'onglets */}
      <div
        aria-hidden="true"
        onClick={() => setPlus(false)}
        className={`fixed inset-0 z-30 bg-[#020814]/45 transition-opacity duration-200 lg:hidden ${plus ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <div
        id="admin-plus"
        inert={!plus}
        className={`fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-40 px-3 transition-[translate,opacity] duration-200 lg:hidden ${
          plus ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-lg rounded-2xl bg-white p-2 shadow-[0_24px_60px_-20px_rgba(2,8,20,0.6)] ring-1 ring-[#E3E9F0]">
          <ul className="grid grid-cols-3 gap-1">
            {AUTRES.map((l) => {
              const actif = estActif(chemin, l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={actif ? "page" : undefined}
                    className={`flex flex-col items-center gap-1.5 rounded-xl px-2 py-3.5 text-[13px] font-medium ${actif ? "bg-[#E8EFFF] text-bleu" : "text-[#2C4558] hover:bg-ciel"}`}
                  >
                    <Icone nom={l.icone} className="h-6 w-6" />
                    {l.libelle}
                  </Link>
                </li>
              );
            })}
            <li>
              <form action={seDeconnecter}>
                <button type="submit" className="flex w-full flex-col items-center gap-1.5 rounded-xl px-2 py-3.5 text-[13px] font-medium text-[#2C4558] hover:bg-ciel">
                  <Icone nom="sortie" className="h-6 w-6" />
                  Déconnexion
                </button>
              </form>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
