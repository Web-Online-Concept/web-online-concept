"use client";

import { useEffect, useRef } from "react";

// Conteneur qui signale s'il est à l'écran (data-vu="1" ou "0") : les animations qu'il contient
// sont mises en pause hors de l'écran (règles .e-zone dans animations.css).
export default function ZoneAnimee({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const zone = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = zone.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        el.dataset.vu = e.isIntersecting ? "1" : "0";
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={zone} data-vu="1" className={`e-zone ${className}`}>
      {children}
    </div>
  );
}
