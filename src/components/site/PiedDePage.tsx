import { cacheLife } from "next/cache";
import MesurePied from "@/components/site/MesurePied";
import { LiensLumineux, LogoAnime } from "@/components/site/Survol";
import { SITE } from "@/lib/contenu";
import { chemin } from "@/lib/i18n/chemins";
import { langue, t } from "@/lib/i18n/langue";

// Année du copyright, recalculée chaque jour
async function Annee() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

const TEXTES = {
  fr: {
    accroche: "Studio de développement web depuis 2009.",
    x: "Suivez-nous sur X",
    plan: "Plan du site",
    studio: "Le studio",
    infos: "Informations",
    liens: ["Réalisations", "Capacités", "Méthode", "Blog", "À propos", "FAQ", "Mentions légales", "Confidentialité", "Contact"],
    droits: "Tous droits réservés.",
  },
  en: {
    accroche: "Web development studio since 2009.",
    x: "Follow us on X",
    plan: "Site map",
    studio: "The studio",
    infos: "Information",
    liens: ["Work", "Capabilities", "Method", "Blog", "About", "FAQ", "Legal notice", "Privacy", "Contact"],
    droits: "All rights reserved.",
  },
  es: {
    accroche: "Estudio de desarrollo web desde 2009.",
    x: "Síganos en X",
    plan: "Mapa del sitio",
    studio: "El estudio",
    infos: "Información",
    liens: ["Proyectos", "Capacidades", "Método", "Blog", "Nosotros", "FAQ", "Aviso legal", "Privacidad", "Contacto"],
    droits: "Todos los derechos reservados.",
  },
};

const PAGES_STUDIO = ["realisations", "capacites", "methode", "blog"] as const;
const PAGES_INFOS = ["a-propos", "faq", "mentions-legales", "confidentialite", "contact"] as const;

// Téléphone : le pied de page se termine sur l'horizon d'une planète qui se lève, réseau à sa surface
// et satellite en orbite (le langage du logo). Décoratif, figé si l'on limite les animations.
function HorizonPied({ className = "" }: { className?: string }) {
  const points: [number, number][] = [
    [116, 122],
    [150, 102],
    [188, 92],
    [226, 95],
    [262, 106],
    [292, 123],
    [206, 115],
  ];
  const arcs: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [1, 6],
    [6, 4],
    [2, 6],
  ];
  const courbe = ([a, b]: [number, number]) => {
    const [x1, y1] = points[a];
    const [x2, y2] = points[b];
    return `M${x1} ${y1}Q${(x1 + x2) / 2} ${Math.min(y1, y2) - 9} ${x2} ${y2}`;
  };
  return (
    <svg viewBox="0 0 400 130" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false" fill="none" className={className}>
      <defs>
        <radialGradient id="pied-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#00B4D8" stopOpacity="0.32" />
          <stop offset="1" stopColor="#00B4D8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="pied-planete" gradientUnits="userSpaceOnUse" cx="200" cy="80" r="250">
          <stop offset="0" stopColor="#3B8BFF" />
          <stop offset="0.16" stopColor="#1F5EFF" stopOpacity="0.85" />
          <stop offset="0.42" stopColor="#1638A8" stopOpacity="0.6" />
          <stop offset="1" stopColor="#0A1A2F" />
        </radialGradient>
        <linearGradient id="pied-bord" gradientUnits="userSpaceOnUse" x1="30" y1="0" x2="370" y2="0">
          <stop offset="0" stopColor="#00B4D8" stopOpacity="0" />
          <stop offset="0.3" stopColor="#00B4D8" />
          <stop offset="0.5" stopColor="#9BEBFF" />
          <stop offset="0.7" stopColor="#2BD47D" />
          <stop offset="1" stopColor="#2BD47D" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="pied-orbite" gradientUnits="userSpaceOnUse" x1="-35" y1="0" x2="435" y2="0">
          <stop offset="0" stopColor="#1F5EFF" stopOpacity="0" />
          <stop offset="0.5" stopColor="#00B4D8" />
          <stop offset="1" stopColor="#2BD47D" stopOpacity="0" />
        </linearGradient>
      </defs>

      {[
        [42, 34],
        [96, 62],
        [262, 30],
        [334, 22],
        [366, 66],
        [70, 92],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="0.9" fill="#FFFFFF" fillOpacity="0.55" className="pulse" style={{ animationDelay: `${i * -0.7}s` }} />
      ))}

      <ellipse cx="200" cy="88" rx="215" ry="48" fill="url(#pied-halo)" />

      <g transform="rotate(-6 200 84)">
        <path d="M-35 84A235 24 0 0 1 435 84" stroke="url(#pied-orbite)" strokeOpacity="0.35" strokeWidth="1" />
      </g>

      <circle cx="200" cy="460" r="380" fill="url(#pied-planete)" />
      <circle cx="200" cy="460" r="380" stroke="url(#pied-bord)" strokeOpacity="0.08" strokeWidth="14" />
      <circle cx="200" cy="460" r="380" stroke="url(#pied-bord)" strokeOpacity="0.22" strokeWidth="6" />
      <circle cx="200" cy="460" r="380" stroke="url(#pied-bord)" strokeWidth="1.4" />

      <g stroke="#7CCBFF" strokeOpacity="0.35" strokeWidth="0.8">
        {arcs.map((a, i) => (
          <path key={i} d={courbe(a)} />
        ))}
      </g>
      <g stroke="#9BEBFF" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="10 322">
        {arcs.map((a, i) =>
          i % 2 === 0 ? <path key={i} d={courbe(a)} className="influx" style={{ animationDelay: `${i * -0.8}s` }} /> : null,
        )}
      </g>
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.6" fill="#9BEBFF" className="pulse" style={{ animationDelay: `${i * -0.45}s` }} />
      ))}

      <g transform="rotate(-6 200 84)">
        <path d="M435 84A235 24 0 0 1 -35 84" stroke="url(#pied-orbite)" strokeOpacity="0.7" strokeWidth="1.1" />
        <g className="orbite-satellite">
          <circle r="7" fill="#2BD47D" fillOpacity="0.18" />
          <circle r="2.4" fill="#2BD47D" />
          <animateMotion dur="18s" repeatCount="indefinite" path="M-35 84A235 24 0 0 1 435 84A235 24 0 0 1 -35 84" />
        </g>
      </g>
    </svg>
  );
}

export default async function PiedDePage() {
  const l = await langue();
  const x = t(TEXTES, l);
  const liens = (pages: readonly (typeof PAGES_STUDIO[number] | typeof PAGES_INFOS[number])[], debut: number) =>
    pages.map((p, i) => ({ href: chemin(l, p), libelle: x.liens[debut + i] }));

  return (
    <footer className="border-t border-white/10 bg-nuit text-[#C3D0DD]">
      <MesurePied />
      {/* Téléphone : marque sur toute la largeur, puis les deux listes de liens côte à côte */}
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-3 gap-y-10 px-5 pb-8 pt-12 text-center sm:px-8 md:grid-cols-3 md:gap-8 md:py-16">
        <div className="col-span-2 flex flex-col items-center gap-4 md:col-span-1">
          <LogoAnime className="h-11" />
          <p className="max-w-xs text-balance text-[15px] leading-relaxed">{x.accroche}</p>
          <a
            href={SITE.x}
            target="_blank"
            rel="noopener"
            className="group inline-flex items-center gap-2.5 rounded-full border border-white/15 py-2 pr-4 pl-2 text-sm transition-colors hover:border-cyan-300/60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
          >
            <span className="grid size-7 place-items-center rounded-full bg-white/10 transition-colors group-hover:bg-white group-hover:text-nuit">
              <span aria-hidden="true" className="text-[13px] font-bold leading-none">X</span>
            </span>
            {x.x}
          </a>
        </div>

        <nav aria-label={x.plan} className="flex flex-col items-center gap-2 text-[15px]">
          <span className="mb-1 font-semibold text-white">{x.studio}</span>
          <LiensLumineux liens={liens(PAGES_STUDIO, 0)} />
        </nav>

        <nav aria-label={x.infos} className="flex flex-col items-center gap-2 text-[15px]">
          <span className="mb-1 font-semibold text-white">{x.infos}</span>
          <LiensLumineux liens={liens(PAGES_INFOS, PAGES_STUDIO.length)} />
        </nav>
      </div>
      <div className="relative overflow-hidden md:border-t md:border-white/10">
        <HorizonPied className="pointer-events-none absolute inset-0 h-full w-full md:hidden" />
        <p className="relative mx-auto max-w-6xl px-5 pb-[104px] pt-2 text-center text-sm text-[#93A6BB] sm:px-8 md:py-6">
          © <Annee /> Web Online Concept. <span className="max-md:block">{x.droits}</span>
        </p>
      </div>
    </footer>
  );
}
