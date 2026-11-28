"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties } from "react";
import { useLangue } from "@/components/site/Langue";
import type { VarianteEntete } from "@/components/site/illustrations/Entetes";
import { analyserChemin, chemin as cheminPublic } from "@/lib/i18n/chemins";

// Illustrations des en-têtes de page, chargées à part : rien n'est téléchargé tant que le menu n'a pas servi
const chargerIllustrations = () => import("@/components/site/illustrations/Entetes");
const IllustrationEntete = lazy(chargerIllustrations);

type Lien = { href: string; libelle: string };

const TEXTES = {
  fr: {
    realisations: "Nos projets en images",
    capacites: "Ce que nous savons faire",
    methode: "Quatre étapes, de l'idée au suivi",
    "a-propos": "Le studio depuis 2009",
    blog: "Articles et conseils",
    faq: "Vos questions, nos réponses",
    contact: "Écrivez-nous",
    x: "Suivez-nous sur X",
  },
  en: {
    realisations: "Our projects in pictures",
    capacites: "What we can build",
    methode: "Four steps, from idea to support",
    "a-propos": "The studio since 2009",
    blog: "Articles and advice",
    faq: "Your questions answered",
    contact: "Write to us",
    x: "Follow us on X",
  },
  es: {
    realisations: "Nuestros proyectos en imágenes",
    capacites: "Lo que sabemos hacer",
    methode: "Cuatro etapas, de la idea al seguimiento",
    "a-propos": "El estudio desde 2009",
    blog: "Artículos y consejos",
    faq: "Sus preguntas, nuestras respuestas",
    contact: "Escríbanos",
    x: "Síganos en X",
  },
};

type CleTexte = keyof (typeof TEXTES)["fr"];

const VARIANTES: Record<string, VarianteEntete> = {
  realisations: "realisations",
  capacites: "capacites",
  methode: "methode",
  "a-propos": "apropos",
  blog: "blog",
  faq: "faq",
  contact: "contact",
};

// Menu des téléphones et tablettes : un panneau glisse depuis la gauche par-dessus la page.
// Chaque page y a sa tuile, illustrée par l'animation de son propre en-tête ; Contact occupe toute la largeur.
export default function MenuMobile({
  navigation,
  ouvert,
  onFermer,
  nav,
  lienX,
}: {
  navigation: Lien[];
  ouvert: boolean;
  onFermer: (retourBouton: boolean) => void;
  nav: string;
  lienX: string;
}) {
  const t = TEXTES[useLangue()];
  const { langue, page, suite } = analyserChemin(usePathname());
  const actuel = cheminPublic(langue, page, suite);
  const panneau = useRef<HTMLElement>(null);
  const [illustrations, setIllustrations] = useState(false);

  // Précharge les illustrations quand le navigateur n'a plus rien à faire, pour un menu prêt dès le premier geste
  useEffect(() => {
    const prete = () => void chargerIllustrations();
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(prete, { timeout: 4000 });
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(prete, 2500);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!ouvert) return;
    setIllustrations(true);
    const html = document.documentElement;
    const debordement = html.style.overflow;
    // La page dessous ne défile plus et n'est plus atteignable au clavier tant que le menu est ouvert
    const zones = [document.getElementById("contenu"), document.querySelector("body > footer")];
    html.dataset.menu = "";
    html.style.overflow = "hidden";
    zones.forEach((z) => z?.setAttribute("inert", ""));
    panneau.current?.focus({ preventScroll: true });

    const echap = (e: KeyboardEvent) => e.key === "Escape" && onFermer(true);
    const large = window.matchMedia("(min-width: 1024px)");
    const passageOrdinateur = () => large.matches && onFermer(false);
    document.addEventListener("keydown", echap);
    large.addEventListener("change", passageOrdinateur);
    return () => {
      delete html.dataset.menu;
      html.style.overflow = debordement;
      zones.forEach((z) => z?.removeAttribute("inert"));
      document.removeEventListener("keydown", echap);
      large.removeEventListener("change", passageOrdinateur);
    };
  }, [ouvert, onFermer]);

  return (
    <>
      <div
        aria-hidden="true"
        onClick={() => onFermer(false)}
        className={`fixed inset-x-0 bottom-0 top-[77px] bg-[#020814]/65 backdrop-blur-[2px] transition-opacity duration-300 motion-reduce:transition-none lg:hidden ${
          ouvert ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <nav
        id="menu-mobile"
        ref={panneau}
        aria-label={nav}
        tabIndex={-1}
        inert={!ouvert}
        data-ouvert={ouvert ? "" : undefined}
        className="menu-panneau fixed bottom-0 left-0 top-[77px] w-[88vw] max-w-[26rem] overflow-y-auto overscroll-contain border-r border-white/10 bg-nuit shadow-[24px_0_60px_-30px_rgba(0,0,0,0.9)] outline-none lg:hidden"
      >
        {/* Halo bleu et orbite en filigrane, dans le langage de la marque */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[520px] overflow-hidden">
          <div className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(31,94,255,0.35),transparent_68%)]" />
          <div className="absolute -right-32 top-40 h-72 w-[30rem] -rotate-12 rounded-[50%] border border-cyan/15" />
        </div>

        <div className="relative px-4 pb-6 pt-4">
          <ul className="grid grid-cols-2 gap-3">
            {navigation.map((lien, i) => {
              const cle = analyserChemin(lien.href).page as CleTexte;
              const variante = VARIANTES[cle];
              const actif = actuel === lien.href || actuel.startsWith(lien.href + "/");
              const large = i === navigation.length - 1 && navigation.length % 2 === 1;
              return (
                <li key={lien.href} className={large ? "col-span-2" : ""}>
                  <Link
                    href={lien.href}
                    onClick={() => onFermer(false)}
                    aria-current={actif ? "page" : undefined}
                    style={{ "--i": i } as CSSProperties}
                    className={`menu-tuile group block h-full rounded-2xl p-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan ${
                      actif
                        ? "bg-[linear-gradient(135deg,#1F5EFF,#00B4D8_55%,#2BD47D)] shadow-[0_0_30px_-10px_rgba(0,180,216,0.85)]"
                        : "bg-white/10"
                    }`}
                  >
                    <span
                      className={`flex h-full overflow-hidden rounded-[15px] bg-[#0D2240] transition-[scale,background-color] duration-150 group-active:scale-[0.97] group-active:bg-[#12305A] motion-reduce:transition-none ${
                        large ? "flex-row items-center" : "flex-col"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`relative block shrink-0 overflow-hidden bg-[radial-gradient(70%_80%_at_50%_50%,rgba(31,94,255,0.18),transparent_75%)] ${
                          large ? "h-24 w-[42%]" : "aspect-[440/290] w-full"
                        }`}
                      >
                        {illustrations && variante && (
                          <Suspense fallback={null}>
                            <IllustrationEntete
                              variante={variante}
                              prefixe="mm"
                              className="absolute inset-x-0 top-1/2 w-full -translate-y-1/2"
                            />
                          </Suspense>
                        )}
                      </span>
                      <span className={`block min-w-0 ${large ? "px-4 py-3" : "px-3 pb-3"}`}>
                        <span className="relative inline-block text-[15px] font-semibold leading-tight text-white">
                          {lien.libelle}
                          {actif && (
                            <span
                              aria-hidden="true"
                              className="absolute inset-x-0 -bottom-1 h-[2px] rounded-full bg-[linear-gradient(90deg,#1F5EFF,#00B4D8,#2BD47D)] shadow-[0_0_10px_rgba(0,180,216,0.8)]"
                            />
                          )}
                        </span>
                        <span className="mt-1.5 block text-[12.5px] leading-snug text-[#9FB2C8]">{t[cle]}</span>
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <a
            href={lienX}
            target="_blank"
            rel="noopener"
            style={{ "--i": navigation.length } as CSSProperties}
            className="menu-tuile group mx-auto mt-5 flex w-fit items-center gap-2.5 rounded-full border border-white/15 py-2 pl-2 pr-4 text-sm text-[#C3D0DD] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
          >
            <span className="grid size-7 place-items-center rounded-full bg-white/10 group-active:bg-white group-active:text-nuit">
              <span aria-hidden="true" className="text-[13px] font-bold leading-none">
                X
              </span>
            </span>
            {t.x}
          </a>
        </div>
      </nav>
    </>
  );
}
