"use client";

import { useEffect, useRef } from "react";

// Défilement « un bloc par écran » sur ordinateur, pour la page qui rend ce composant (accueil, capacités).
// - Rend le marqueur .marqueur-ecrans (dès le rendu serveur) : les règles de animations.css calent chaque
//   bloc (.ecran, .ecran-fin) en haut de l'écran (clavier, barre de défilement).
// - Next.js garde les pages visitées en mémoire, masquées, quand on change de page : le marqueur reste alors dans la
//   page mais passe en data-inactif, dès le clic sur un lien vers une autre page (avant que la nouvelle page
//   ne s'affiche et ne remonte en haut) ou au retour arrière, et au plus tard au nettoyage de l'effet.
//   L'attribut est retiré au retour sur la page. Seuls les blocs affichés comptent (pas ceux d'une page masquée).
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
  const marqueur = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const m = marqueur.current;
    m?.removeAttribute("data-inactif");
    const media = window.matchMedia(ECRANS);

    let cumul = 0;
    let verrouJusqua = 0;
    let dernier = 0;
    let enElan = false; // un changement vient d'avoir lieu : on attend la fin du geste en cours

    const positions = () =>
      Array.from(document.querySelectorAll<HTMLElement>(".ecran, .ecran-fin"))
        .filter((s) => s.getClientRects().length > 0)
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

    // Départ vers une autre page : calage coupé avant que la nouvelle page ne s'affiche
    const chemin = window.location.pathname;
    const desactiver = () => m?.setAttribute("data-inactif", "");
    const surClic = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const lien = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!lien || lien.target === "_blank") return;
      const url = new URL(lien.href, window.location.href);
      if (url.origin === window.location.origin && url.pathname !== chemin) desactiver();
    };
    const surRetour = () => {
      if (window.location.pathname !== chemin) desactiver();
    };

    window.addEventListener("wheel", surMolette, { passive: false });
    document.addEventListener("click", surClic, true);
    window.addEventListener("popstate", surRetour);
    return () => {
      document.removeEventListener("click", surClic, true);
      window.removeEventListener("popstate", surRetour);
      m?.setAttribute("data-inactif", "");
      window.removeEventListener("wheel", surMolette);
    };
  }, []);
  return <div ref={marqueur} className="marqueur-ecrans" hidden />;
}
