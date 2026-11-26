"use client";

import { useEffect, useRef } from "react";

// Liste d'étapes reliées par une ligne lumineuse. Chaque enfant porteur de data-etape reçoit data-allume
// ("1" quand la ligne l'atteint) et la variable --remplissage (de 0 à 1) pour le segment qui le relie à
// l'étape suivante.
// Défilement libre : la ligne avance au fil du défilement. Défilement « un bloc par écran » (accueil sur
// ordinateur) : elle se trace toute seule quand le bloc arrive à l'écran, et repart de zéro en le quittant.
// Sans JavaScript ou si l'utilisateur limite les animations, tout reste allumé.

const ECRANS = "(min-width: 1024px) and (min-height: 800px) and (prefers-reduced-motion: no-preference)";
const DUREE_TRACE = 2400;

const modeEcrans = () =>
  document.querySelector(".marqueur-ecrans") !== null && window.matchMedia(ECRANS).matches;

export default function SuiviEtapes({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const liste = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const ol = liste.current;
    if (!ol) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const etapes = Array.from(ol.querySelectorAll<HTMLElement>("[data-etape]"));
    const n = etapes.length;
    let image = 0;
    let trace = 0;

    const appliquer = (p: number) => {
      const position = p * (n - 1);
      etapes.forEach((e, i) => {
        e.dataset.allume = p > 0 && position >= i - 0.02 ? "1" : "0";
        e.style.setProperty("--remplissage", Math.min(1, Math.max(0, position - i)).toFixed(3));
      });
    };

    // Défilement libre : 0 quand le haut de la liste entre dans le bas de l'écran (80 %), 1 quand il atteint les 38 %
    const majour = () => {
      image = 0;
      if (modeEcrans()) return;
      const r = ol.getBoundingClientRect();
      const h = window.innerHeight;
      appliquer(Math.min(1, Math.max(0, (h * 0.8 - r.top) / (h * 0.42))));
    };
    const demander = () => {
      if (!image) image = window.requestAnimationFrame(majour);
    };

    // Un bloc par écran : tracé dans le temps à l'arrivée du bloc
    const tracer = () => {
      window.cancelAnimationFrame(trace);
      const debut = performance.now();
      const pas = (t: number) => {
        const p = Math.min(1, (t - debut) / DUREE_TRACE);
        appliquer(Math.max(0.001, p));
        if (p < 1) trace = window.requestAnimationFrame(pas);
      };
      trace = window.requestAnimationFrame(pas);
    };
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!modeEcrans()) return;
        if (e.isIntersecting) tracer();
        else {
          window.cancelAnimationFrame(trace);
          appliquer(0);
        }
      },
      { threshold: 0.6 },
    );

    majour();
    obs.observe(ol);
    window.addEventListener("scroll", demander, { passive: true });
    window.addEventListener("resize", demander);
    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", demander);
      window.removeEventListener("resize", demander);
      if (image) window.cancelAnimationFrame(image);
      window.cancelAnimationFrame(trace);
    };
  }, []);

  return (
    <ol ref={liste} className={className}>
      {children}
    </ol>
  );
}
