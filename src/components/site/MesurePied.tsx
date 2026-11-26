"use client";

import { useEffect } from "react";

// Mesure la hauteur du pied de page et l'expose en variable CSS (--pied) :
// le bloc de fin de page s'en sert pour que, tout en bas, bloc + pied remplissent l'écran.
export default function MesurePied() {
  useEffect(() => {
    const pied = document.querySelector("footer");
    if (!pied) return;
    const maj = () => document.documentElement.style.setProperty("--pied", `${pied.offsetHeight}px`);
    maj();
    const obs = new ResizeObserver(maj);
    obs.observe(pied);
    return () => obs.disconnect();
  }, []);
  return null;
}
