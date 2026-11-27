import SceneEnVue from "@/components/site/SceneEnVue";
import { contenu } from "@/lib/i18n/contenu";
import { t } from "@/lib/i18n/langue";

// Bloc « conviction » (page Méthode) : les questions d'hier sont barrées une à une par le trait dégradé du logo,
// la phrase d'aujourd'hui apparaît, puis la seule question qui compte. Des points gravitent en fond.
// La scène se rejoue à chaque retour à l'écran ; tout est affiché d'emblée si l'on limite les animations.

const ORBITE = "M 1160 300 A 560 190 0 1 1 40 300 A 560 190 0 1 1 1160 300";
const ORBITE_2 = "M 1030 300 A 430 140 0 1 1 170 300 A 430 140 0 1 1 1030 300";
const POINTS = [
  { r: 6, couleur: "#2BD47D", trajet: ORBITE, duree: "26s", depart: "0s" },
  { r: 4.5, couleur: "#00B4D8", trajet: ORBITE, duree: "26s", depart: "-13s" },
  { r: 5, couleur: "#1F5EFF", trajet: ORBITE_2, duree: "19s", depart: "-6s" },
];

function Fond() {
  return (
    <svg viewBox="0 0 1200 600" className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block" preserveAspectRatio="xMidYMid meet" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="cv-trait" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1F5EFF" />
          <stop offset="0.55" stopColor="#00B4D8" />
          <stop offset="1" stopColor="#2BD47D" />
        </linearGradient>
        <radialGradient id="cv-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#E8EFFF" />
          <stop offset="1" stopColor="#E8EFFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="600" cy="300" rx="520" ry="230" fill="url(#cv-halo)" />
      <g transform="rotate(-8 600 300)">
        <path d={ORBITE} stroke="url(#cv-trait)" strokeOpacity="0.28" strokeWidth="1.5" />
        <path d={ORBITE_2} stroke="#9FB4CC" strokeOpacity="0.35" strokeWidth="1.2" strokeDasharray="2 8" strokeLinecap="round" />
        <g className="orbite-mobile">
          {POINTS.map((p, i) => (
            <circle key={i} r={p.r} fill={p.couleur}>
              <animateMotion dur={p.duree} begin={p.depart} repeatCount="indefinite" path={p.trajet} />
            </circle>
          ))}
        </g>
        <g className="orbite-fixe">
          <circle cx="1080" cy="215" r="6" fill="#2BD47D" />
          <circle cx="130" cy="380" r="4.5" fill="#00B4D8" />
          <circle cx="905" cy="415" r="5" fill="#1F5EFF" />
        </g>
      </g>
    </svg>
  );
}

export default async function Conviction() {
  const { l, MANIFESTE, QUESTIONS_D_HIER } = await contenu();
  return (
    <section className="ecran relative overflow-hidden bg-white py-20 sm:py-28">
      <Fond />
      <SceneEnVue decoratif={false} className="relative">
        <div className="mx-auto w-full max-w-5xl px-5 text-center sm:px-8">
          <p className="text-lg text-[#4A6178]">
            {t({ fr: "Hier, on se demandait\u00a0:", en: "Yesterday, people asked:", es: "Ayer, la pregunta era:" }, l)}
          </p>
          <ul className="mt-5 flex flex-wrap justify-center gap-3">
            {QUESTIONS_D_HIER.map((q, i) => (
              <li
                key={q}
                className="cv-question relative inline-flex items-center gap-2.5 whitespace-nowrap rounded-full border border-[#DCE3EC] bg-white px-4 py-2.5 text-[15px] font-medium sm:px-5 sm:text-[17px] text-[#2C4558] shadow-[0_10px_24px_-18px_rgba(10,26,47,0.4)]"
                style={{ animationDelay: `${0.7 + i * 0.45}s` }}
              >
                <span aria-hidden="true" className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#EEF3FF] text-[13px] font-semibold text-bleu">
                  ?
                </span>
                {q}
                <span
                  aria-hidden="true"
                  className="cv-barre absolute inset-x-4 top-1/2 h-[2.5px] -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,#1F5EFF,#00B4D8_55%,#2BD47D)]"
                  style={{ animationDelay: `${0.5 + i * 0.45}s` }}
                />
              </li>
            ))}
          </ul>

          <p className="cv-apparait mt-10 text-xl leading-relaxed text-[#2C4558]" style={{ animationDelay: "2s" }}>
            {MANIFESTE[1]}
          </p>
          <p
            className="cv-apparait mx-auto mt-8 max-w-[52rem] text-[clamp(1.7rem,3.4vw,2.7rem)] font-semibold leading-tight tracking-tight text-balance text-nuit"
            style={{ animationDelay: "2.6s" }}
          >
            {MANIFESTE[2]}
          </p>
        </div>
      </SceneEnVue>
    </section>
  );
}
