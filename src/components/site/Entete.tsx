"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { NAVIGATION } from "@/lib/contenu";

type Pastille = { x: number; l: number; visible: boolean; glisse: boolean };

// Menu ordinateur : une pastille lumineuse à bord dégradé glisse d'un lien à l'autre au survol ;
// la page en cours est soulignée d'un trait dégradé.
function NavBureau({ chemin }: { chemin: string | null }) {
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
      {NAVIGATION.map((l) => {
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

function NavBureauActive() {
  const chemin = usePathname();
  return <NavBureau chemin={chemin} />;
}

export default function Entete() {
  const [ouvert, setOuvert] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-nuit/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
        <Link href="/" className="logo-entete group relative shrink-0 rounded-lg" aria-label="Web Online Concept, accueil" onClick={() => setOuvert(false)}>
          <Image
            src="/logo/logo-web-fond-sombre.svg"
            alt=""
            width={207}
            height={44}
            priority
            className="h-10 w-auto transition-[filter,transform] duration-500 ease-out group-hover:-translate-y-px group-hover:drop-shadow-[0_0_14px_rgba(0,180,216,0.55)] sm:h-11 motion-reduce:transition-none"
          />
          <span aria-hidden="true" className="logo-balayage pointer-events-none absolute inset-0" />
        </Link>

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <Suspense fallback={<NavBureau chemin={null} />}>
            <NavBureauActive />
          </Suspense>
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
        </nav>
      )}
    </header>
  );
}
