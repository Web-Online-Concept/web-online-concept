"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import PlaneteReseau from "@/components/site/PlaneteReseau";

// Hero de l'accueil : une fenêtre de navigateur et un téléphone sur le fond orbital de la marque.
// Avec des captures, ils les font défiler en fondu (toutes les 5 s, pause au survol, au focus
// ou par le bouton, aucun défilement si l'utilisateur limite les animations).
// Sans capture, ils affichent une maquette illustrée.

export type Diapo = { src: string; alt: string; nom: string; type: string; slug: string; domaine: string };
export type Ecran = { src: string; alt: string };

const DUREE = 5000;
const ORBITE = "M 30 0 A 300 108 0 1 0 630 0 A 300 108 0 1 0 30 0";

function FondOrbital() {
  return (
    <svg viewBox="0 0 660 560" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false" fill="none">
      <defs>
        <radialGradient id="v-lueur" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#1F5EFF" stopOpacity="0.45" />
          <stop offset="1" stopColor="#1F5EFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="v-orbite" x1="30" y1="0" x2="630" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1F5EFF" stopOpacity="0.2" />
          <stop offset="0.55" stopColor="#00B4D8" stopOpacity="0.9" />
          <stop offset="1" stopColor="#2BD47D" />
        </linearGradient>
        <radialGradient id="v-halo">
          <stop offset="0" stopColor="#7CCBFF" stopOpacity="0.85" />
          <stop offset="1" stopColor="#7CCBFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="340" cy="280" r="250" fill="url(#v-lueur)" />
      <g transform="translate(0 290) rotate(-14 330 0)">
        <path d={ORBITE} stroke="url(#v-orbite)" strokeWidth="2" />
        <ellipse cx="330" cy="0" rx="215" ry="76" stroke="#1F5EFF" strokeOpacity="0.32" strokeWidth="1.2" />
        <g className="orbite-satellite">
          <circle r="18" fill="url(#v-halo)" />
          <circle r="6" fill="#2BD47D" />
          <animateMotion dur="24s" repeatCount="indefinite" path={ORBITE} />
        </g>
      </g>
      <PlaneteReseau cx={566} cy={66} r={48} points={16} prefixe="vitrine" />
    </svg>
  );
}

// Maquette illustrée affichée tant qu'il n'y a pas de captures
function MaquetteSite() {
  return (
    <div className="absolute inset-0 flex flex-col gap-[4%] p-[4%]" aria-hidden="true">
      <div className="relative h-[46%] rounded-lg bg-[linear-gradient(120deg,#1F5EFF,#00B4D8_60%,#2BD47D)] p-[5%]">
        <div className="h-[14%] w-[48%] rounded-full bg-white/90" />
        <div className="mt-[3%] h-[9%] w-[32%] rounded-full bg-white/60" />
        <div className="mt-[6%] h-[16%] w-[18%] rounded-full bg-nuit/50" />
      </div>
      <div className="grid flex-1 grid-cols-3 gap-[4%]">
        {[0, 1, 2].map((k) => (
          <div key={k} className="rounded-md bg-[#17304F] p-[8%]">
            <div className="h-[34%] w-[42%] rounded bg-[#24476F]" />
            <div className="mt-[10%] h-[10%] w-[80%] rounded-full bg-[#3B5A85]" />
            <div className="mt-[6%] h-[10%] w-[52%] rounded-full bg-[#2A4366]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function MaquetteApp() {
  return (
    <div className="absolute inset-0 flex flex-col gap-[4%] px-[9%] pb-[8%] pt-[14%]" aria-hidden="true">
      <div className="ml-auto h-[8%] w-[62%] rounded-full bg-bleu" />
      <div className="h-[16%] w-[82%] rounded-xl bg-[#1A3358] p-[7%]">
        <div className="h-[22%] w-[70%] rounded-full bg-[#7CCBFF]/80" />
        <div className="mt-[8%] h-[18%] w-[86%] rounded-full bg-[#3B5A85]" />
      </div>
      <div className="flex h-[14%] items-center gap-[8%] rounded-xl bg-[#17304F] px-[8%]">
        <span className="h-3 w-3 shrink-0 rounded-full bg-vert" />
        <span className="h-[18%] w-[60%] rounded-full bg-[#C3D0DD]/70" />
      </div>
      <div className="mt-auto flex h-[8%] items-center justify-end rounded-full bg-[#1A3358] px-[5%]">
        <span className="h-4 w-4 rounded-full bg-cyan" />
      </div>
    </div>
  );
}

// Superposition en fondu : on garde la précédente (qui s'efface), la courante et la suivante (préchargée)
function Pile<T extends { src: string; alt: string }>({ liste, i, sizes, priorite }: { liste: T[]; i: number; sizes: string; priorite?: boolean }) {
  const n = liste.length;
  const visibles = n === 1 ? [0] : n === 2 ? [i, (i + 1) % n] : [(i - 1 + n) % n, i, (i + 1) % n];
  return (
    <>
      {visibles.map((k) => (
        <Image
          key={liste[k].src}
          src={liste[k].src}
          alt={k === i ? liste[k].alt : ""}
          aria-hidden={k !== i}
          fill
          sizes={sizes}
          priority={priorite && k === 0}
          className={`object-cover object-top transition-opacity duration-700 ease-out ${k === i ? "opacity-100" : "opacity-0"}`}
        />
      ))}
    </>
  );
}

export default function Vitrine({ diapos, ecrans }: { diapos: Diapo[]; ecrans: Ecran[] }) {
  const [i, setI] = useState(0);
  const [pause, setPause] = useState(false);
  const [survol, setSurvol] = useState(false);
  const [calme, setCalme] = useState(false);
  const zone = useRef<HTMLDivElement>(null);
  const total = Math.max(diapos.length, ecrans.length);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const maj = () => setCalme(m.matches);
    maj();
    m.addEventListener("change", maj);
    return () => m.removeEventListener("change", maj);
  }, []);

  useEffect(() => {
    if (total < 2 || pause || survol || calme) return;
    const t = window.setInterval(() => setI((x) => x + 1), DUREE);
    return () => window.clearInterval(t);
  }, [total, pause, survol, calme]);

  const d = diapos.length ? diapos[i % diapos.length] : null;
  const iSite = diapos.length ? i % diapos.length : 0;
  const iApp = ecrans.length ? i % ecrans.length : 0;

  return (
    <div
      ref={zone}
      className="relative aspect-[660/560] w-full"
      onMouseEnter={() => setSurvol(true)}
      onMouseLeave={() => setSurvol(false)}
      onFocus={() => setSurvol(true)}
      onBlur={(e) => {
        if (!zone.current?.contains(e.relatedTarget as Node)) setSurvol(false);
      }}
    >
      <FondOrbital />

      {/* Fenêtre de navigateur */}
      <div className="flotte absolute left-0 top-[11%] w-[76%]">
        <div className="overflow-hidden rounded-xl bg-[#10233F] shadow-[0_30px_60px_-24px_rgba(2,8,20,0.75)] ring-1 ring-white/10">
          <div className="flex h-7 items-center gap-1.5 px-3" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-[#3B5A85]" />
            <span className="h-2 w-2 rounded-full bg-[#3B5A85]" />
            <span className="h-2 w-2 rounded-full bg-[#3B5A85]" />
            <span className="ml-3 truncate rounded-full bg-[#1A3358] px-3 py-0.5 text-[11px] leading-4 text-[#93A6BB]">
              {d ? d.domaine : "votre-projet.fr"}
            </span>
          </div>
          <div className="relative aspect-[16/9] bg-[#0D1E36]">
            {diapos.length ? <Pile liste={diapos} i={iSite} sizes="(min-width: 1024px) 520px, 88vw" priorite /> : <MaquetteSite />}
          </div>
        </div>
      </div>

      {/* Téléphone */}
      <div className="flotte absolute right-[2%] top-[27%] w-[24%]" style={{ animationDelay: "1.2s" }}>
        <div className="rounded-[1.6rem] bg-[#10233F] p-[5%] shadow-[0_30px_60px_-24px_rgba(2,8,20,0.8)] ring-1 ring-white/12">
          <div className="relative aspect-[9/17.5] overflow-hidden rounded-[1.25rem] bg-[#0D1E36]">
            {ecrans.length ? <Pile liste={ecrans} i={iApp} sizes="(min-width: 1024px) 170px, 30vw" /> : <MaquetteApp />}
          </div>
        </div>
      </div>

      {/* Puce IA */}
      <div className="flotte absolute left-[46%] top-0 flex items-center gap-2.5 rounded-full bg-[#10233F]/95 py-2 pl-2 pr-4 shadow-[0_18px_40px_-20px_rgba(2,8,20,0.8)] ring-1 ring-white/10" style={{ animationDelay: "2s" }} aria-hidden="true">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1F5EFF,#00B4D8_60%,#2BD47D)]">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="#FFFFFF">
            <path d="M12 2.5l2.4 6.6 6.6 2.4-6.6 2.4L12 20.5l-2.4-6.6L3 11.5l6.6-2.4z" />
          </svg>
        </span>
        <span className="text-[13px] font-medium text-[#E6EDF5]">Propulsé par l&apos;IA</span>
      </div>

      {/* Légende de la capture en cours */}
      {d && (
        <div className="absolute left-0 top-[71%] flex w-[66%] items-center gap-3">
          <Link
            href={`/realisations/${d.slug}`}
            className="min-w-0 flex-1 rounded-xl bg-white/[0.06] px-4 py-2.5 ring-1 ring-white/10 transition-colors hover:bg-white/10"
          >
            <span className="block truncate text-[15px] font-semibold text-white">{d.nom}</span>
            <span className="block truncate text-[13px] text-[#93A6BB]">{d.type}</span>
          </Link>
          {total > 1 && !calme && (
            <button
              type="button"
              onClick={() => setPause((p) => !p)}
              aria-label={pause ? "Reprendre le défilement des réalisations" : "Mettre en pause le défilement des réalisations"}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#C3D0DD] ring-1 ring-white/20 transition-colors hover:text-white hover:ring-white/50"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                {pause ? <path d="M8 5.5v13l10.5-6.5z" /> : <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />}
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
