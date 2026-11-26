"use client";

import { useEffect, useRef } from "react";

// Liste d'étapes reliées par une ligne lumineuse qui avance au fil du défilement.
// Chaque enfant porteur de data-etape reçoit data-allume ("1" quand la ligne l'atteint) et la variable
// --remplissage (de 0 à 1) pour le segment qui le relie à l'étape suivante. Sans JavaScript ou si
// l'utilisateur limite les animations, tout reste allumé.
export default function SuiviEtapes({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const liste = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const ol = liste.current;
    if (!ol) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const etapes = Array.from(ol.querySelectorAll<HTMLElement>("[data-etape]"));
    const n = etapes.length;
    let image = 0;

    const majour = () => {
      image = 0;
      const r = ol.getBoundingClientRect();
      const h = window.innerHeight;
      // 0 quand le haut de la liste entre dans le bas de l'écran (80 %), 1 quand il atteint les 38 %
      const p = Math.min(1, Math.max(0, (h * 0.8 - r.top) / (h * 0.42)));
      const position = p * (n - 1);
      etapes.forEach((e, i) => {
        e.dataset.allume = p > 0 && position >= i - 0.02 ? "1" : "0";
        e.style.setProperty("--remplissage", Math.min(1, Math.max(0, position - i)).toFixed(3));
      });
    };
    const demander = () => {
      if (!image) image = window.requestAnimationFrame(majour);
    };

    majour();
    window.addEventListener("scroll", demander, { passive: true });
    window.addEventListener("resize", demander);
    return () => {
      window.removeEventListener("scroll", demander);
      window.removeEventListener("resize", demander);
      if (image) window.cancelAnimationFrame(image);
    };
  }, []);

  return (
    <ol ref={liste} className={className}>
      {children}
    </ol>
  );
}
