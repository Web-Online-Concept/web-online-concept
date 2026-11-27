"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Icone, type NomIcone } from "@/components/site/Icones";
import { useLangue } from "@/components/site/Langue";

const TEXTES = {
  fr: { reprendre: "Reprendre l'enchaînement des capacités", pause: "Mettre en pause l'enchaînement des capacités", bReprendre: "Reprendre", bPause: "Pause" },
  en: { reprendre: "Resume the capabilities slideshow", pause: "Pause the capabilities slideshow", bReprendre: "Resume", bPause: "Pause" },
  es: { reprendre: "Reanudar la secuencia de capacidades", pause: "Pausar la secuencia de capacidades", bReprendre: "Reanudar", bPause: "Pausa" },
};

// Bloc « Tout ce qu'un projet web exige » : la liste des capacités à gauche (accordéon), une scène animée
// à droite. Les capacités s'enchaînent seules (minuteur sous la capacité ouverte) tant que l'utilisateur
// n'en a pas choisi une ; pause au survol, au focus et par le bouton ; rien ne défile si l'utilisateur
// limite les animations. Les scènes, rendues côté serveur, arrivent en children.

type Capacite = { titre: string; texte: string; icone: NomIcone };

const REQUETE = "(prefers-reduced-motion: reduce)";
function abonner(rappel: () => void) {
  const m = window.matchMedia(REQUETE);
  m.addEventListener("change", rappel);
  return () => m.removeEventListener("change", rappel);
}
const useCalme = () =>
  useSyncExternalStore(
    abonner,
    () => window.matchMedia(REQUETE).matches,
    () => false,
  );

export default function CapacitesInteractives({
  capacites,
  scenes,
}: {
  capacites: Capacite[];
  scenes: React.ReactNode[];
}) {
  const x = TEXTES[useLangue()];
  const n = capacites.length;
  const [actif, setActif] = useState(0);
  const [lancements, setLancements] = useState<number[]>(() =>
    capacites.map(() => 0),
  );
  const [auto, setAuto] = useState(true);
  const [pause, setPause] = useState(false);
  const [survol, setSurvol] = useState(false);
  const [visible, setVisible] = useState(false);
  const calme = useCalme();
  const zone = useRef<HTMLDivElement>(null);
  const dejaVu = useRef(false);

  const activer = (i: number) => {
    setActif(i);
    setLancements((l) => l.map((v, k) => (k === i ? v + 1 : v)));
  };

  // La première capacité rejoue sa scène quand le bloc apparaît à l'écran
  useEffect(() => {
    const el = zone.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        if (e.isIntersecting && !dejaVu.current) {
          dejaVu.current = true;
          setLancements((l) => l.map((v, k) => (k === 0 ? v + 1 : v)));
        }
      },
      { threshold: 0.35 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const defile = auto && !calme;
  const enPause = pause || survol || !visible;

  return (
    <div
      ref={zone}
      className="mt-12 grid items-center gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-14"
      onMouseEnter={() => setSurvol(true)}
      onMouseLeave={() => setSurvol(false)}
      onFocus={() => setSurvol(true)}
      onBlur={(e) => {
        if (!zone.current?.contains(e.relatedTarget as Node)) setSurvol(false);
      }}
    >
      {/* Scène */}
      <div className="flex flex-col gap-3 lg:order-last">
        <div className="relative aspect-[16/11] overflow-hidden rounded-3xl bg-nuit shadow-[0_40px_80px_-40px_rgba(10,26,47,0.7)]">
          <div
            aria-hidden="true"
            className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-bleu opacity-30 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-vert opacity-15 blur-3xl"
          />
          {scenes.map((s, i) => (
            <div
              key={i}
              aria-hidden="true"
              data-actif={i === actif ? "1" : "0"}
              className={`c-scene absolute inset-0 transition-opacity duration-500 ${i === actif ? "opacity-100" : "opacity-0"}`}
            >
              <div key={lancements[i]} className="h-full w-full">
                {s}
              </div>
            </div>
          ))}
        </div>
        {!calme && (
          <button
            type="button"
            onClick={() => setPause((p) => !p)}
            aria-label={
              pause ? x.reprendre : x.pause
            }
            className={`inline-flex items-center gap-2 self-end rounded-full px-3 py-1.5 text-sm font-medium text-[#4A6178] transition-colors hover:text-nuit ${auto ? "" : "invisible"}`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="currentColor"
              aria-hidden="true"
            >
              {pause ? (
                <path d="M8 5.5v13l10.5-6.5z" />
              ) : (
                <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
              )}
            </svg>
            <span aria-hidden="true">{pause ? x.bReprendre : x.bPause}</span>
          </button>
        )}
      </div>

      {/* Liste */}
      <ul className="flex flex-col gap-1">
        {capacites.map((c, i) => {
          const ouvert = i === actif;
          return (
            <li
              key={c.titre}
              className={`rounded-2xl transition-colors duration-300 ${ouvert ? "bg-ciel" : ""}`}
            >
              <button
                type="button"
                aria-expanded={ouvert}
                aria-controls={`capacite-${i}`}
                onClick={() => {
                  setAuto(false);
                  if (!ouvert) activer(i);
                }}
                className="group flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left"
              >
                <span
                  className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                    ouvert
                      ? "bg-[linear-gradient(135deg,#1F5EFF,#00B4D8)] text-white"
                      : "bg-[#E8EFFF] text-bleu group-hover:bg-[#DCE6FF]"
                  }`}
                >
                  <Icone nom={c.icone} className="h-5 w-5" />
                </span>
                <span
                  className={`text-[17px] font-semibold transition-colors ${ouvert ? "text-nuit" : "text-[#2C4558] group-hover:text-nuit"}`}
                >
                  {c.titre}
                </span>
              </button>
              <div
                id={`capacite-${i}`}
                inert={!ouvert}
                className={`grid transition-[grid-template-rows] duration-500 ease-out ${ouvert ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <div className="overflow-hidden">
                  <p className="px-4 pb-4 pl-[4.5rem] text-[15px] leading-relaxed text-[#2C4558]">
                    {c.texte}
                  </p>
                  {ouvert && defile && (
                    <span
                      aria-hidden="true"
                      className="mx-4 mb-3 ml-[4.5rem] block h-0.5 overflow-hidden rounded-full bg-[#DCE3EC]"
                    >
                      <span
                        key={`${i}-${lancements[i]}`}
                        className="c-minuteur block h-full w-full bg-[linear-gradient(90deg,#1F5EFF,#00B4D8_60%,#2BD47D)]"
                        style={{
                          animationPlayState: enPause ? "paused" : "running",
                        }}
                        onAnimationEnd={() => activer((i + 1) % n)}
                      />
                    </span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
