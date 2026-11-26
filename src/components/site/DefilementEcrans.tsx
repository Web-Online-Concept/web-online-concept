"use client";

import { useEffect } from "react";

// Accueil : défilement « un bloc par écran » sur ordinateur.
// - Rend le marqueur .marqueur-ecrans (dès le rendu serveur) : les règles de animations.css calent chaque
//   bloc (.ecran, .ecran-fin) en haut de l'écran (clavier, barre de défilement).
// - La molette et le pavé tactile passent au bloc suivant ou précédent dès le premier cran (les navigateurs,
//   eux, ramènent au bloc courant si le cran est petit). L'élan du pavé tactile est absorbé.
// Uniquement sur un écran assez large et haut, et sans « réduire les animations » ; Ctrl + molette (zoom)
// et le défilement horizontal ne sont pas interceptés.

const ECRANS = "(min-width: 1024px) and (min-height: 800px) and (prefers-reduced-motion: no-preference)";
const MARGE_MENU = 76; // même valeur que scroll-padding-top
const SEUIL = 24; // pixels de molette cumulés avant de changer de bloc
const VERROU = 750; // durée minimale entre deux changements de bloc (ms)
const CALME = 180; // silence requis après un changement pour accepter un nouveau geste (ms)

export default function DefilementEcrans() {
  useEffect(() => {
    const media = window.matchMedia(ECRANS);

    let cumul = 0;
    let verrouJusqua = 0;
    let dernier = 0;
    let enElan = false; // un changement vient d'avoir lieu : on attend la fin du geste en cours

    const positions = () =>
      Array.from(document.querySelectorAll<HTMLElement>(".ecran, .ecran-fin"))
        .map((s) => Math.round(s.getBoundingClientRect().top + window.scrollY - MARGE_MENU))
        .sort((a, b) => a - b);

    const surMolette = (e: WheelEvent) => {
      if (!media.matches || e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      const maintenant = performance.now();
      const silence = maintenant - dernier;
      dernier = maintenant;
      // Pendant un changement de bloc, et tant que le geste qui l'a déclenché continue (élan), on ignore
      if (enElan) {
        if (maintenant < verrouJusqua || silence < CALME) return;
        enElan = false;
      }
      if (silence > 400) cumul = 0;
      cumul += e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY;
      if (Math.abs(cumul) < SEUIL) return;

      const sens = Math.sign(cumul);
      cumul = 0;
      const liste = positions();
      const y = window.scrollY;
      const actuel = liste.reduce((meilleur, p, i) => (Math.abs(p - y) < Math.abs(liste[meilleur] - y) ? i : meilleur), 0);
      const cible = liste[Math.min(liste.length - 1, Math.max(0, actuel + sens))];
      if (cible === undefined || Math.abs(cible - y) < 2) return;
      verrouJusqua = maintenant + VERROU;
      enElan = true;
      window.scrollTo({ top: Math.max(0, cible), behavior: "smooth" });
    };

    window.addEventListener("wheel", surMolette, { passive: false });
    return () => {
      window.removeEventListener("wheel", surMolette);
    };
  }, []);
  return <div className="marqueur-ecrans" hidden />;
}
