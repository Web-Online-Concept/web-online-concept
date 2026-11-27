"use client";

import { useEffect, useRef, useState } from "react";

// Effet joué une fois, après un envoi réussi du formulaire de contact : l'avion en papier de l'en-tête
// décolle du bouton « Envoyer », laisse une traînée de points, puis éclate en confettis aux couleurs du logo.
// Rien n'est joué si le visiteur a demandé à réduire les animations.

const COULEURS = ["#1F5EFF", "#00B4D8", "#2BD47D", "#7CA8FF", "#FFFFFF"];
const VOL = 1300; // durée du vol (ms)

const AVION = `<svg viewBox="-2 -2 64 56" width="56" height="49" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="envol-g" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#1F5EFF"/><stop offset="1" stop-color="#00B4D8"/></linearGradient></defs>
  <path d="M0 22 L60 0 L42 52 L30 34 Z" fill="url(#envol-g)"/>
  <path d="M30 34 L60 0 L22 28 Z" fill="#FFFFFF" fill-opacity="0.4"/>
</svg>`;

function element(zone: HTMLElement, style: Partial<CSSStyleDeclaration>, html = "") {
  const e = document.createElement("div");
  Object.assign(e.style, { position: "absolute", left: "0", top: "0", willChange: "transform, opacity" }, style);
  e.innerHTML = html;
  zone.appendChild(e);
  return e;
}

export default function Envol({ x, y }: { x: number; y: number }) {
  const zone = useRef<HTMLDivElement>(null);
  const [fini, setFini] = useState(false);

  useEffect(() => {
    const el = zone.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = setTimeout(() => setFini(true), 0);
      return () => clearTimeout(t);
    }

    // Trajectoire : courbe de Bézier du bouton vers le haut de l'écran, légèrement à droite
    const l = window.innerWidth;
    const fin = { x: Math.min(x + 320, l - 120), y: Math.max(y - 380, 150) };
    const ctrl = { x: x + 30, y: y - 230 };
    const point = (t: number) => ({
      x: (1 - t) ** 2 * x + 2 * (1 - t) * t * ctrl.x + t * t * fin.x,
      y: (1 - t) ** 2 * y + 2 * (1 - t) * t * ctrl.y + t * t * fin.y,
    });
    const angle = (t: number) => {
      const dx = 2 * (1 - t) * (ctrl.x - x) + 2 * t * (fin.x - ctrl.x);
      const dy = 2 * (1 - t) * (ctrl.y - y) + 2 * t * (fin.y - ctrl.y);
      return (Math.atan2(dy, dx) * 180) / Math.PI + 45; // le nez de l'avion pointe à -45°
    };

    // L'avion
    const avion = element(el, {}, AVION);
    const pas = 24;
    avion.animate(
      Array.from({ length: pas + 1 }, (_, i) => {
        const t = i / pas;
        const p = point(t);
        return {
          transform: `translate(${p.x - 28}px, ${p.y - 24}px) rotate(${angle(t)}deg) scale(${1 - t * 0.3})`,
          opacity: t > 0.92 ? 0 : 1,
        };
      }),
      { duration: VOL, easing: "cubic-bezier(0.45, 0, 0.7, 1)", fill: "forwards" },
    );

    // La traînée de points, qui s'efface derrière lui
    for (let i = 1; i <= 20; i++) {
      const t = i / 21;
      const p = point(t);
      const trace = element(el, { width: "6px", height: "6px", borderRadius: "50%", background: "#7CCBFF", opacity: "0" });
      trace.animate(
        [
          { transform: `translate(${p.x - 3}px, ${p.y - 3}px) scale(1)`, opacity: 0.9 },
          { transform: `translate(${p.x - 3}px, ${p.y - 3}px) scale(0.4)`, opacity: 0 },
        ],
        // le moment où l'avion passe à cet endroit (courbe d'accélération approchée)
        { duration: 900, delay: VOL * Math.pow(t, 0.75), easing: "ease-out", fill: "forwards" },
      );
    }

    // L'éclat : un anneau qui s'ouvre…
    const anneau = element(el, { width: "16px", height: "16px", borderRadius: "50%", border: "2px solid #7CCBFF", opacity: "0" });
    anneau.animate(
      [
        { transform: `translate(${fin.x - 8}px, ${fin.y - 8}px) scale(0.4)`, opacity: 0.9 },
        { transform: `translate(${fin.x - 8}px, ${fin.y - 8}px) scale(11)`, opacity: 0 },
      ],
      { duration: 900, delay: VOL - 60, easing: "cubic-bezier(0.2, 0.7, 0.3, 1)", fill: "forwards" },
    );

    // … et des confettis (ronds et petits rubans) qui jaillissent, puis retombent en tournoyant
    const nombre = l < 640 ? 46 : 70;
    for (let i = 0; i < nombre; i++) {
      const a = (i / nombre) * Math.PI * 2 + Math.random() * 0.5;
      const d = 90 + Math.random() * (l < 640 ? 120 : 210);
      const taille = 6 + Math.random() * 7;
      const rond = Math.random() < 0.4;
      const couleur = COULEURS[i % COULEURS.length];
      const confetti = element(el, {
        width: `${taille}px`,
        height: `${rond ? taille : taille * 0.45}px`,
        borderRadius: rond ? "50%" : "2px",
        background: couleur,
        boxShadow: couleur === "#FFFFFF" ? "0 0 0 1px rgba(31,94,255,.3)" : "none",
        opacity: "0",
      });
      const rot = Math.random() * 720 - 360;
      const bx = fin.x + Math.cos(a) * d;
      const by = fin.y + Math.sin(a) * d * 0.85;
      const chute = 140 + Math.random() * 160;
      const derive = Math.random() * 60 - 30;
      confetti.animate(
        [
          { transform: `translate(${fin.x}px, ${fin.y}px) rotate(0deg) scale(0.5)`, opacity: 1 },
          { transform: `translate(${bx}px, ${by}px) rotate(${rot}deg) scale(1)`, opacity: 1, offset: 0.35 },
          { transform: `translate(${bx + derive}px, ${by + chute * 0.6}px) rotate(${rot * 2}deg) scale(1)`, opacity: 1, offset: 0.75 },
          { transform: `translate(${bx + derive * 1.5}px, ${by + chute}px) rotate(${rot * 2.6}deg) scale(0.9)`, opacity: 0 },
        ],
        { duration: 2000 + Math.random() * 700, delay: VOL - 50 + Math.random() * 120, easing: "cubic-bezier(0.2, 0.65, 0.4, 1)", fill: "forwards" },
      );
    }

    const t = setTimeout(() => setFini(true), VOL + 3000);
    return () => {
      clearTimeout(t);
      el.replaceChildren();
    };
  }, [x, y]);

  if (fini) return null;
  return <div ref={zone} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" />;
}
