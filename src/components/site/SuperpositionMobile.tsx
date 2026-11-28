"use client";

import { useEffect } from "react";

// Téléphone et tablette : les blocs de la page s'empilent comme des cartes.
// On fait défiler un bloc jusqu'à son dernier pixel, puis il reste en place pendant que le suivant glisse
// par-dessus ; celui du dessous s'assombrit et recule légèrement. Rien n'est coupé : un bloc plus haut que
// l'écran défile normalement avant de se figer (règles [data-pile] dans animations.css).
// Sur ordinateur, c'est DefilementEcrans qui prend le relais ; rien si l'on limite les animations.

const MOBILE = "(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)";
const MENU = 77; // hauteur de l'en-tête collé en haut

export default function SuperpositionMobile() {
  useEffect(() => {
    const media = window.matchMedia(MOBILE);
    let blocs: HTMLElement[] = [];
    let obs: ResizeObserver | null = null;
    let image = 0;
    const derniers = new Map<HTMLElement, number>();

    const mesurer = () => {
      for (const b of blocs) b.style.setProperty("--haut", `${b.offsetHeight}px`);
    };

    const calculer = () => {
      image = 0;
      const vh = window.innerHeight;
      blocs.forEach((b, i) => {
        const suivant = blocs[i + 1];
        let c = 0;
        if (suivant) {
          const haut = suivant.getBoundingClientRect().top;
          c = Math.min(1, Math.max(0, (vh - haut) / (vh - MENU)));
        }
        c = Math.round(c * 1000) / 1000;
        if (derniers.get(b) === c) return;
        derniers.set(b, c);
        b.style.setProperty("--couvert", String(c));
        b.toggleAttribute("data-recouvert", c >= 1);
        b.toggleAttribute("data-recule", c > 0 && c < 1);
      });
    };

    const auDefilement = () => {
      if (!image) image = requestAnimationFrame(calculer);
    };

    const activer = () => {
      blocs = Array.from(document.querySelectorAll<HTMLElement>("#contenu > .ecran, #contenu > .ecran-fin")).filter(
        (b) => b.getClientRects().length > 0,
      );
      blocs.forEach((b) => b.setAttribute("data-pile", ""));
      mesurer();
      obs = new ResizeObserver(mesurer);
      blocs.forEach((b) => obs!.observe(b));
      window.addEventListener("scroll", auDefilement, { passive: true });
      window.addEventListener("resize", auDefilement, { passive: true });
      calculer();
    };

    const desactiver = () => {
      window.removeEventListener("scroll", auDefilement);
      window.removeEventListener("resize", auDefilement);
      if (image) cancelAnimationFrame(image);
      image = 0;
      obs?.disconnect();
      obs = null;
      for (const b of blocs) {
        ["data-pile", "data-recouvert", "data-recule"].forEach((a) => b.removeAttribute(a));
        b.style.removeProperty("--haut");
        b.style.removeProperty("--couvert");
      }
      blocs = [];
      derniers.clear();
    };

    const basculer = () => {
      desactiver();
      if (media.matches) activer();
    };

    basculer();
    media.addEventListener("change", basculer);
    return () => {
      media.removeEventListener("change", basculer);
      desactiver();
    };
  }, []);

  return null;
}
