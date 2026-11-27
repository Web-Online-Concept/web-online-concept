"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { LogoAnime } from "@/components/site/Survol";
import { SelecteurLangue, SelecteurLangueMobile, useLangue } from "@/components/site/Langue";
import { analyserChemin, chemin as cheminPublic } from "@/lib/i18n/chemins";

type Lien = { href: string; libelle: string };

type Pastille = { x: number; l: number; visible: boolean; glisse: boolean };

// Menu ordinateur : une pastille lumineuse à bord dégradé glisse d'un lien à l'autre au survol ;
// la page en cours est soulignée d'un trait dégradé.
function NavBureau({ chemin, navigation }: { chemin: string | null; navigation: Lien[] }) {
  const [p, setP] = useState<Pastille>({ x: 0, l: 0, visible: false, glisse: false });

  return (
    <div className="relative flex items-center gap-0.5 xl:gap-1" onMouseLeave={() => setP((v) => ({ ...v, visible: false, glisse: false }))}>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute top-1/2 h-10 -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,#1F5EFF,#00B4D8_55%,#2BD47D)] p-px shadow-[0_0_26px_-6px_rgba(0,180,216,0.7)] motion-reduce:transition-none ${
          p.glisse ? "transition-[left,width,opacity] duration-300 ease-out" : "transition-opacity duration-200"
        }`}
        style={{ left: p.x, width: p.l, opacity: p.visible ? 1 : 0 }}
      >
        <span className="block h-full w-full rounded-full bg-[#0D2240]" />
      </span>
      {navigation.map((l) => {
        const actif = !!chemin && (chemin === l.href || chemin.startsWith(l.href + "/"));
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={actif ? "page" : undefined}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              setP((v) => ({ x: el.offsetLeft, l: el.offsetWidth, visible: true, glisse: v.visible }));
            }}
            onFocus={(e) => {
              const el = e.currentTarget;
              setP((v) => ({ x: el.offsetLeft, l: el.offsetWidth, visible: true, glisse: v.visible }));
            }}
            onBlur={() => setP((v) => ({ ...v, visible: false, glisse: false }))}
            className={`relative z-10 rounded-full px-2.5 py-2 text-[15px] font-medium transition-colors duration-200 focus-visible:outline-none xl:px-4 xl:text-base ${
              actif ? "text-white" : "text-[#E6EDF5] hover:text-white"
            }`}
          >
            {l.libelle}
            {actif && (
              <span
                aria-hidden="true"
                className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-[linear-gradient(90deg,#1F5EFF,#00B4D8,#2BD47D)] shadow-[0_0_10px_rgba(0,180,216,0.8)]"
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}

// Au prérendu, usePathname donne l'adresse interne (/fr/capacites, /en/realisations…) et dans le navigateur
// l'adresse publique (/capacites, /en/work…) : on ramène les deux à l'adresse publique, sinon l'hydratation diverge.
function NavBureauActive({ navigation }: { navigation: Lien[] }) {
  const { langue, page, suite } = analyserChemin(usePathname());
  return <NavBureau chemin={cheminPublic(langue, page, suite)} navigation={navigation} />;
}

// Un lien vers la page où l'on se trouve déjà (logo sur l'accueil, « Contact » sur la page Contact…)
// fait remonter en haut de la page, au lieu de ne rien faire. Écouteur en phase de capture : il passe
// avant les liens Next, qui voient alors la navigation annulée.
function useRetourEnHaut() {
  useEffect(() => {
    const auClic = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const lien = (e.target as Element | null)?.closest?.("a[href]");
      if (!(lien instanceof HTMLAnchorElement) || lien.target === "_blank") return;
      const url = new URL(lien.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || url.hash) return;
      e.preventDefault();
      const doux = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: doux ? "smooth" : "auto" });
    };
    document.addEventListener("click", auClic, true);
    return () => document.removeEventListener("click", auClic, true);
  }, []);
}

const LIBELLES = {
  fr: { nav: "Navigation principale", ouvrir: "Ouvrir le menu", fermer: "Fermer le menu" },
  en: { nav: "Main navigation", ouvrir: "Open the menu", fermer: "Close the menu" },
  es: { nav: "Navegación principal", ouvrir: "Abrir el menú", fermer: "Cerrar el menú" },
};

export default function Entete({ navigation }: { navigation: Lien[] }) {
  const [ouvert, setOuvert] = useState(false);
  const t = LIBELLES[useLangue()];
  useRetourEnHaut();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-nuit/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
        <LogoAnime className="h-10 sm:h-11" priorite onClick={() => setOuvert(false)} />

        <div className="hidden items-center gap-3 lg:flex xl:gap-5">
          <nav aria-label={t.nav}>
            <Suspense fallback={<NavBureau chemin={null} navigation={navigation} />}>
              <NavBureauActive navigation={navigation} />
            </Suspense>
          </nav>
          <Suspense>
            <SelecteurLangue />
          </Suspense>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white lg:hidden"
          aria-expanded={ouvert}
          aria-controls="menu-mobile"
          aria-label={ouvert ? t.fermer : t.ouvrir}
          onClick={() => setOuvert((o) => !o)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {ouvert ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {ouvert && (
        <nav id="menu-mobile" aria-label={t.nav} className="border-t border-white/10 px-5 pb-5 lg:hidden">
          <ul className="flex flex-col py-2">
            {navigation.map((l) => (
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
          <Suspense>
            <SelecteurLangueMobile onChoix={() => setOuvert(false)} />
          </Suspense>
        </nav>
      )}
    </header>
  );
}
