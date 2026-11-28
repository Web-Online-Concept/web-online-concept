"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLangue } from "@/components/site/Langue";

const TEXTES = {
  fr: { video: "Vidéo de présentation de Web Online Concept", activer: "Activer le son", couper: "Couper le son", passer: "Passer" },
  en: { video: "Web Online Concept introduction video", activer: "Turn sound on", couper: "Mute", passer: "Skip" },
  es: { video: "Vídeo de presentación de Web Online Concept", activer: "Activar el sonido", couper: "Silenciar", passer: "Saltar" },
};

// Vidéo de présentation jouée par-dessus le hero de l'accueil, à la première visite puis après 30 jours d'absence.
// La décision est prise avant l'affichage par SCRIPT_INTRO (attribut data-intro sur <html>) : le voile bleu nuit
// couvre le hero dès la première image, sans clignotement. La vidéo part en muet (règle des navigateurs),
// avec « Activer le son » et « Passer » ; à la fin, ou au premier défilement, elle s'efface sur le hero.
// Rien ne se joue si le visiteur a demandé à réduire les animations.

export const SCRIPT_INTRO = `try{var k="woc-intro",n=Date.now(),d=+localStorage.getItem(k)||0;if(!matchMedia("(prefers-reduced-motion: reduce)").matches&&n-d>2592e6)document.documentElement.setAttribute("data-intro","1");localStorage.setItem(k,String(n))}catch(e){}`;

type Etat = "attente" | "lecture" | "fin" | "terminee";

function IconeSon({ coupe }: { coupe: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
      {coupe ? <path d="M16 9.5l5 5M21 9.5l-5 5" /> : <path d="M16 9a4.2 4.2 0 0 1 0 6M18.6 6.5a7.8 7.8 0 0 1 0 11" />}
    </svg>
  );
}

export default function IntroVideo() {
  const l = useLangue();
  const x = TEXTES[l];
  // Une version par langue (textes à l'écran traduits) : intro-paysage.mp4, intro-paysage-en.mp4…
  const fichier = (format: string) => `/video/intro-${format}${l === "fr" ? "" : `-${l}`}`;
  const [etat, setEtat] = useState<Etat>("attente");
  const [format, setFormat] = useState<"paysage" | "portrait">("paysage");
  const [muet, setMuet] = useState(true);
  const video = useRef<HTMLVideoElement>(null);

  const terminer = useCallback(() => {
    setEtat((e) => (e === "lecture" || e === "attente" ? "fin" : e));
  }, []);

  // Démarrage : seulement si le script d'avant affichage l'a décidé
  useEffect(() => {
    if (document.documentElement.dataset.intro !== "1") return;
    const t = setTimeout(() => {
      setFormat(window.matchMedia("(max-aspect-ratio: 1/1)").matches ? "portrait" : "paysage");
      setEtat("lecture");
    }, 0);
    return () => clearTimeout(t);
  }, []);

  // Lecture : en muet ; si le navigateur refuse ou si rien ne démarre en 4 s, on laisse place au hero
  useEffect(() => {
    if (etat !== "lecture") return;
    const v = video.current;
    if (!v) return;
    v.play().catch(terminer);
    const garde = setTimeout(() => {
      if (v.currentTime === 0) terminer();
    }, 4000);
    // Le premier geste de défilement termine l'introduction
    const touches = new Set(["ArrowDown", "PageDown", " ", "End"]);
    const surTouche = (e: KeyboardEvent) => touches.has(e.key) && terminer();
    window.addEventListener("wheel", terminer, { passive: true });
    window.addEventListener("touchmove", terminer, { passive: true });
    window.addEventListener("keydown", surTouche);
    return () => {
      clearTimeout(garde);
      window.removeEventListener("wheel", terminer);
      window.removeEventListener("touchmove", terminer);
      window.removeEventListener("keydown", surTouche);
    };
  }, [etat, terminer]);

  // Fin : fondu de 0,8 s, puis la vidéo disparaît et le hero reprend la main
  useEffect(() => {
    if (etat !== "fin") return;
    video.current?.pause();
    const t = setTimeout(() => {
      document.documentElement.removeAttribute("data-intro");
      setEtat("terminee");
    }, 800);
    return () => clearTimeout(t);
  }, [etat]);

  if (etat === "terminee") return null;
  return (
    <div className={`intro-video fixed inset-x-0 bottom-0 z-30 bg-nuit transition-opacity duration-700 ${etat === "fin" ? "pointer-events-none opacity-0" : "opacity-100"}`}>
      {/* Première image de la vidéo, dès le rendu serveur : l'écran est rempli avant même que le script ne démarre
          (affichée seulement si <html data-intro>, comme tout ce bloc ; la vidéo vient ensuite se poser dessus) */}
      <picture>
        <source media="(max-aspect-ratio: 1/1)" srcSet={`${fichier("portrait")}.jpg`} />
        <img src={`${fichier("paysage")}.jpg`} alt="" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      </picture>
      {etat !== "attente" && (
        <>
          <video
            ref={video}
            key={format}
            className="relative h-full w-full object-cover"
            src={`${fichier(format)}.mp4`}
            poster={`${fichier(format)}.jpg`}
            muted={muet}
            playsInline
            preload="auto"
            onEnded={terminer}
            onError={terminer}
            aria-label={x.video}
          />
          <div className="absolute bottom-5 right-5 flex gap-2.5 sm:bottom-8 sm:right-8">
            <button
              type="button"
              onClick={() => {
                const v = video.current;
                if (v) v.muted = !muet;
                setMuet(!muet);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-medium text-white ring-1 ring-white/20 backdrop-blur transition-colors hover:bg-white/20"
            >
              <IconeSon coupe={muet} />
              {muet ? x.activer : x.couper}
            </button>
            <button
              type="button"
              onClick={terminer}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-nuit transition-colors hover:bg-[#E6EDF5]"
            >
              {x.passer}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
