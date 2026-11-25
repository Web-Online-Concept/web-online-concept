"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { NAVIGATION } from "@/lib/contenu";

function Liens({ chemin }: { chemin: string | null }) {
  return (
    <>
      {NAVIGATION.map((l) => {
        const actif = !!chemin && (chemin === l.href || chemin.startsWith(l.href + "/"));
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={actif ? "page" : undefined}
            className={`rounded-full px-2.5 py-2 text-[15px] font-medium transition-colors xl:px-4 xl:text-base ${
              actif ? "bg-white/12 text-white" : "text-[#E6EDF5] hover:bg-white/6 hover:text-white"
            }`}
          >
            {l.libelle}
          </Link>
        );
      })}
    </>
  );
}

function LiensActifs() {
  const chemin = usePathname();
  return <Liens chemin={chemin} />;
}

export default function Entete() {
  const [ouvert, setOuvert] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-nuit/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
        <Link href="/" className="shrink-0" aria-label="Web Online Concept, accueil" onClick={() => setOuvert(false)}>
          <Image src="/logo/logo-web-fond-sombre.svg" alt="" width={207} height={44} priority className="h-10 w-auto sm:h-11" />
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-0.5 lg:flex xl:gap-1">
          <Suspense fallback={<Liens chemin={null} />}>
            <LiensActifs />
          </Suspense>
          <Link
            href="/contact"
            className="ml-2 rounded-full bg-bleu px-4 py-2.5 text-[15px] font-medium whitespace-nowrap text-white transition-colors hover:bg-[#3A72FF] xl:ml-3 xl:px-5 xl:text-base"
          >
            Parlons de votre projet
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white lg:hidden"
          aria-expanded={ouvert}
          aria-controls="menu-mobile"
          aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOuvert((o) => !o)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {ouvert ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {ouvert && (
        <nav id="menu-mobile" aria-label="Navigation principale" className="border-t border-white/10 px-5 pb-5 lg:hidden">
          <ul className="flex flex-col py-2">
            {NAVIGATION.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOuvert(false)}
                  className="block rounded-lg px-3 py-3 text-base text-[#D5DEE8] hover:bg-white/5 hover:text-white"
                >
                  {l.libelle}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            onClick={() => setOuvert(false)}
            className="block rounded-full bg-bleu px-5 py-3 text-center font-medium text-white"
          >
            Parlons de votre projet
          </Link>
        </nav>
      )}
    </header>
  );
}
