"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { seDeconnecter } from "@/app/(interne)/admin/connexion/actions";

const LIENS = [
  { href: "/admin", libelle: "Tableau de bord" },
  { href: "/admin/devis", libelle: "Devis" },
  { href: "/admin/factures", libelle: "Factures" },
  { href: "/admin/clients", libelle: "Clients" },
  { href: "/admin/urssaf", libelle: "URSSAF" },
  { href: "/admin/exports", libelle: "Exports" },
  { href: "/admin/messages", libelle: "Messages" },
  { href: "/admin/blog", libelle: "Blog" },
  { href: "/admin/parametres", libelle: "Paramètres" },
];

function Liens({ chemin, auClic }: { chemin: string | null; auClic?: () => void }) {
  return (
    <ul className="flex flex-col gap-0.5">
      {LIENS.map((l) => {
        const actif = !!chemin && (l.href === "/admin" ? chemin === "/admin" : chemin.startsWith(l.href));
        return (
          <li key={l.href}>
            <Link
              href={l.href}
              onClick={auClic}
              aria-current={actif ? "page" : undefined}
              className={`block rounded-lg px-3 py-2.5 text-[15px] ${
                actif ? "bg-white/10 font-medium text-white" : "text-[#B8C6D6] hover:bg-white/5 hover:text-white"
              }`}
            >
              {l.libelle}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function LiensActifs({ auClic }: { auClic?: () => void }) {
  const chemin = usePathname();
  return <Liens chemin={chemin} auClic={auClic} />;
}

export default function Navigation() {
  const [ouvert, setOuvert] = useState(false);
  return (
    <aside className="bg-nuit text-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-64">
      <div className="flex items-center justify-between px-5 py-4 lg:block lg:px-5 lg:py-6">
        <Link href="/admin" aria-label="Tableau de bord">
          <Image src="/logo/logo-horizontal-couleur-fond-sombre.svg" alt="" width={180} height={58} className="h-11 w-auto" />
        </Link>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
          aria-expanded={ouvert}
          aria-controls="nav-admin"
          aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOuvert((o) => !o)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {ouvert ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      <nav id="nav-admin" aria-label="Back-office" className={`${ouvert ? "block" : "hidden"} px-3 pb-5 lg:block`}>
        <Suspense fallback={<Liens chemin={null} />}>
          <LiensActifs auClic={() => setOuvert(false)} />
        </Suspense>
        <div className="mt-6 border-t border-white/10 pt-4">
          <Link href="/" className="block rounded-lg px-3 py-2 text-sm text-[#B8C6D6] hover:text-white">
            Voir le site
          </Link>
          <form action={seDeconnecter}>
            <button type="submit" className="w-full rounded-lg px-3 py-2 text-left text-sm text-[#B8C6D6] hover:text-white">
              Se déconnecter
            </button>
          </form>
        </div>
      </nav>
    </aside>
  );
}
