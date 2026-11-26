"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Effets de survol partagés par l'en-tête et le pied de page.

// Logo : halo pulsé et reflet holographique qui parcourt le dessin en boucle tant qu'on le survole
export function LogoAnime({
  className = "h-11",
  priorite = false,
  onClick,
}: {
  className?: string;
  priorite?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link href="/" className="logo-anime group relative inline-block shrink-0 rounded-lg" aria-label="Web Online Concept, accueil" onClick={onClick}>
      <Image src="/logo/logo-web-fond-sombre.svg" alt="" width={207} height={44} priority={priorite} className={`logo-anime-image w-auto ${className}`} />
      <span aria-hidden="true" className="logo-anime-reflet pointer-events-none absolute inset-0" />
    </Link>
  );
}

type Pastille = { x: number; y: number; l: number; h: number; visible: boolean; glisse: boolean };
const cachee: Pastille = { x: 0, y: 0, l: 0, h: 0, visible: false, glisse: false };

// Colonne de liens : une pastille lumineuse à bord dégradé glisse d'un lien à l'autre
export function LiensLumineux({ liens, className = "" }: { liens: { href: string; libelle: string }[]; className?: string }) {
  const [p, setP] = useState<Pastille>(cachee);
  const viser = (el: HTMLElement) =>
    setP((v) => ({ x: el.offsetLeft, y: el.offsetTop, l: el.offsetWidth, h: el.offsetHeight, visible: true, glisse: v.visible }));
  const cacher = () => setP((v) => ({ ...v, visible: false, glisse: false }));

  return (
    <div className={`relative flex flex-col items-center gap-1 ${className}`} onMouseLeave={cacher}>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute rounded-full bg-[linear-gradient(90deg,#1F5EFF,#00B4D8_55%,#2BD47D)] p-px shadow-[0_0_22px_-6px_rgba(0,180,216,0.7)] motion-reduce:transition-none ${
          p.glisse ? "transition-[left,top,width,height,opacity] duration-300 ease-out" : "transition-opacity duration-200"
        }`}
        style={{ left: p.x, top: p.y, width: p.l, height: p.h, opacity: p.visible ? 1 : 0 }}
      >
        <span className="block h-full w-full rounded-full bg-[#0D2240]" />
      </span>
      {liens.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          onMouseEnter={(e) => viser(e.currentTarget)}
          onFocus={(e) => viser(e.currentTarget)}
          onBlur={cacher}
          className="relative z-10 rounded-full px-3.5 py-1.5 transition-colors duration-200 hover:text-white focus-visible:text-white focus-visible:outline-none"
        >
          {l.libelle}
        </Link>
      ))}
    </div>
  );
}
