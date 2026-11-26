"use client";

import { useEffect, useRef, useState } from "react";

// Conteneur d'une scène animée (illustrations/Capacites.tsx) : la scène rejoue son entrée chaque fois
// qu'elle revient à l'écran, et ses animations sont en pause le reste du temps (règle .c-scene).
// decoratif : masque le contenu aux lecteurs d'écran (scène purement illustrative)
export default function SceneEnVue({
  children,
  className = "",
  decoratif = true,
}: {
  children: React.ReactNode;
  className?: string;
  decoratif?: boolean;
}) {
  const zone = useRef<HTMLDivElement>(null);
  const [vu, setVu] = useState(true);
  const [tour, setTour] = useState(0);
  const dehors = useRef(true);

  useEffect(() => {
    const el = zone.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        setVu(e.isIntersecting);
        if (e.isIntersecting && dehors.current) setTour((t) => t + 1);
        dehors.current = !e.isIntersecting;
      },
      { threshold: 0.35 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={zone} aria-hidden={decoratif || undefined} data-actif={vu ? "1" : "0"} className={`c-scene ${className}`}>
      <div key={tour} className="h-full w-full">
        {children}
      </div>
    </div>
  );
}
