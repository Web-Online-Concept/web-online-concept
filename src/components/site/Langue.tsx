"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import { analyserChemin, chemin, estLangue, LANGUES, LOCALES, NOMS_LANGUES, type Langue } from "@/lib/i18n/chemins";

// Langue de la page pour les composants client (fournie par la mise en page src/app/[lang]/layout.tsx)
const ContexteLangue = createContext<Langue>("fr");

export function LangueProvider({ l, children }: { l: Langue; children: React.ReactNode }) {
  return <ContexteLangue.Provider value={l}>{children}</ContexteLangue.Provider>;
}

export function useLangue() {
  return useContext(ContexteLangue);
}

// Choix de langue mémorisé dans le navigateur (le bandeau de suggestion ne revient plus ensuite)
const CLE = "woc-langue";
function memoriser(l: Langue) {
  try {
    localStorage.setItem(CLE, l);
  } catch {}
}

// Adresse de la page en cours dans une autre langue : d'abord la balise hreflang de la page (exacte,
// y compris pour les articles du blog dont l'adresse est traduite), sinon la table des adresses.
function adresseDans(cible: Langue, pathname: string) {
  const lien = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${LOCALES[cible]}"]`);
  // Adresses absolues du domaine de production : seul le chemin compte (aussi en préversion)
  if (lien?.href) return new URL(lien.href).pathname;
  return adresseCalculee(cible, pathname);
}

function adresseCalculee(cible: Langue, pathname: string) {
  const { page, suite } = analyserChemin(pathname);
  return chemin(cible, page, suite);
}

function useChangerLangue() {
  const router = useRouter();
  const pathname = usePathname();
  return (cible: Langue) => (e?: React.MouseEvent) => {
    memoriser(cible);
    if (!e || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    router.push(adresseDans(cible, pathname));
  };
}

// Drapeaux ronds dessinés en SVG (les émojis drapeaux ne s'affichent pas sous Windows).
// Anglais : drapeau du Royaume-Uni.
export function Drapeau({ l, className = "h-5 w-5" }: { l: Langue; className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 20 20" className={`shrink-0 rounded-full ring-1 ring-white/25 ${className}`} aria-hidden="true">
      <defs>
        <clipPath id={`${id}-rond`}>
          <circle cx="10" cy="10" r="10" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-rond)`}>
        {l === "fr" && (
          <>
            <rect width="7" height="20" fill="#0055A4" />
            <rect x="7" width="6" height="20" fill="#FFFFFF" />
            <rect x="13" width="7" height="20" fill="#EF4135" />
          </>
        )}
        {l === "es" && (
          <>
            <rect width="20" height="20" fill="#AA151B" />
            <rect y="5" width="20" height="10" fill="#F1BF00" />
          </>
        )}
        {l === "en" && (
          // Union Jack (proportions 2:1), recadré au centre du disque
          <g transform="translate(-10 0) scale(0.6667)">
            <rect width="60" height="30" fill="#012169" />
            <path d="M0 0L60 30M60 0L0 30" stroke="#FFFFFF" strokeWidth="6" />
            <path d="M0 0L60 30M60 0L0 30" stroke="#C8102E" strokeWidth="4" clipPath={`url(#${id}-diag)`} />
            <clipPath id={`${id}-diag`}>
              <path d="M30 15h30v15zv15h-30zh-30v-15zv-15h30z" />
            </clipPath>
            <path d="M30 0v30M0 15h60" stroke="#FFFFFF" strokeWidth="10" />
            <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
          </g>
        )}
      </g>
    </svg>
  );
}

const LIBELLES = {
  fr: { bouton: "Langue du site", actuelle: "Langue actuelle" },
  en: { bouton: "Site language", actuelle: "Current language" },
  es: { bouton: "Idioma del sitio", actuelle: "Idioma actual" },
};

// Sélecteur de l'en-tête (ordinateur) : bouton « FR » qui ouvre la liste des trois langues
export function SelecteurLangue() {
  const l = useLangue();
  const pathname = usePathname();
  const changer = useChangerLangue();
  const [ouvert, setOuvert] = useState(false);
  const zone = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ouvert) return;
    const fermer = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !zone.current?.contains(e.target as Node)) setOuvert(false);
    };
    document.addEventListener("pointerdown", fermer);
    document.addEventListener("keydown", fermer);
    return () => {
      document.removeEventListener("pointerdown", fermer);
      document.removeEventListener("keydown", fermer);
    };
  }, [ouvert]);

  return (
    <div ref={zone} className="relative">
      <button
        type="button"
        aria-expanded={ouvert}
        aria-controls="choix-langue"
        aria-label={`${LIBELLES[l].bouton} : ${NOMS_LANGUES[l]}`}
        onClick={() => setOuvert((o) => !o)}
        className="flex h-10 items-center gap-1.5 rounded-full border border-white/15 px-2.5 text-sm font-medium sm:px-3 text-[#E6EDF5] transition-colors hover:border-white/40 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
      >
        <Drapeau l={l} className="h-[18px] w-[18px]" />
        {l.toUpperCase()}
        <svg viewBox="0 0 24 24" className={`hidden h-3.5 w-3.5 transition-transform sm:block ${ouvert ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M6 9.5l6 6 6-6" />
        </svg>
      </button>
      {ouvert && (
        <ul
          id="choix-langue"
          className="absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-2xl border border-white/10 bg-[#0D2240] p-1.5 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.8)]"
        >
          {LANGUES.map((x) => (
            <li key={x}>
              <Link
                href={adresseCalculee(x, pathname)}
                hrefLang={x}
                lang={x}
                aria-current={x === l ? "true" : undefined}
                onClick={(e) => {
                  setOuvert(false);
                  if (x === l) return e.preventDefault();
                  changer(x)(e);
                }}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-[15px] transition-colors ${
                  x === l ? "bg-white/5 text-white" : "text-[#C3D0DD] hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Drapeau l={x} />
                  {NOMS_LANGUES[x]}
                </span>
                {x === l && (
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#2BD47D]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <title>{LIBELLES[l].actuelle}</title>
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const SUGGESTION: Record<Langue, { texte: string; bouton: string; fermer: string }> = {
  fr: { texte: "Ce site existe aussi en français.", bouton: "Voir en français", fermer: "Fermer" },
  en: { texte: "This site is also available in English.", bouton: "View in English", fermer: "Close" },
  es: { texte: "Este sitio también está disponible en español.", bouton: "Ver en español", fermer: "Cerrar" },
};

// Petit bandeau flottant qui propose la langue du navigateur, quand elle diffère de celle de la page.
// Rien n'est redirigé automatiquement ; il disparaît dès qu'un choix est fait (mémorisé dans le navigateur).
export function BandeauLangue() {
  const l = useLangue();
  const pathname = usePathname();
  const changer = useChangerLangue();
  const [proposee, setProposee] = useState<Langue | null>(null);

  useEffect(() => {
    let choix: string | null = null;
    try {
      choix = localStorage.getItem(CLE);
    } catch {}
    if (choix) return;
    const prefere = (navigator.languages ?? [navigator.language]).map((x) => x.slice(0, 2).toLowerCase()).find(estLangue);
    if (!prefere || prefere === l) return;
    const minuteur = setTimeout(() => setProposee(prefere), 1200);
    return () => clearTimeout(minuteur);
  }, [l]);

  if (!proposee || proposee === l) return null;
  const s = SUGGESTION[proposee];
  const fermer = () => {
    memoriser(l);
    setProposee(null);
  };

  return (
    <div
      lang={proposee}
      role="region"
      aria-label={s.texte}
      className="bandeau-langue fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-lg items-center gap-3 rounded-2xl border border-white/10 bg-[#0D2240]/95 p-2 pl-4 text-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.85)] backdrop-blur sm:bottom-5"
    >
      <Drapeau l={proposee} className="h-6 w-6" />
      <p className="flex-1 text-sm leading-snug text-[#D5DEE8]">{s.texte}</p>
      <Link
        href={adresseCalculee(proposee, pathname)}
        hrefLang={proposee}
        onClick={(e) => {
          setProposee(null);
          changer(proposee)(e);
        }}
        className="shrink-0 rounded-full bg-bleu px-4 py-2 text-sm font-medium transition-colors hover:bg-[#3A72FF]"
      >
        {s.bouton}
      </Link>
      <button
        type="button"
        onClick={fermer}
        aria-label={s.fermer}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[#93A6BB] transition-colors hover:bg-white/10 hover:text-white"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  );
}
