import PlaneteReseau from "@/components/site/PlaneteReseau";

// Motif d'orbite de la marque : grande ellipse inclinée en dégradé, avec un satellite.
// Purement décoratif.

// ajuste : l'orbite tient entièrement dans son cadre (sinon elle le remplit et peut être rognée)
// planete : ajoute la planète de la marque au centre de l'orbite
export default function Orbite({ className = "", ajuste = false, planete = false }: { className?: string; ajuste?: boolean; planete?: boolean }) {
  const chemin =
    "M 60 300 A 540 150 0 1 0 1140 300 A 540 150 0 1 0 60 300";
  return (
    <svg
      viewBox="0 0 1200 600"
      className={className}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio={ajuste ? "xMidYMid meet" : "xMidYMid slice"}
    >
      <defs>
        <linearGradient id="orbite-degrade" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1F5EFF" stopOpacity="0.15" />
          <stop offset="0.55" stopColor="#00B4D8" stopOpacity="0.85" />
          <stop offset="1" stopColor="#2BD47D" />
        </linearGradient>
        <radialGradient id="orbite-lueur" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#1F5EFF" stopOpacity="0.5" />
          <stop offset="1" stopColor="#1F5EFF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="orbite-halo">
          <stop offset="0" stopColor="#7CCBFF" stopOpacity="0.8" />
          <stop offset="1" stopColor="#7CCBFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      {planete && (
        <>
          <circle cx="600" cy="300" r="250" fill="url(#orbite-lueur)" />
          <PlaneteReseau cx={600} cy={300} r={118} />
        </>
      )}
      <g transform="rotate(-14 600 300)">
        <path d={chemin} fill="none" stroke="url(#orbite-degrade)" strokeWidth="2.5" />
        <path
          d="M 120 300 A 480 118 0 1 0 1080 300 A 480 118 0 1 0 120 300"
          fill="none"
          stroke="#1F5EFF"
          strokeOpacity="0.18"
          strokeWidth="1.2"
        />
        <g className="orbite-satellite">
          <circle r="22" fill="url(#orbite-halo)" />
          <circle r="7" fill="#2BD47D" />
          <animateMotion dur="26s" repeatCount="indefinite" path={chemin} />
        </g>
      </g>
    </svg>
  );
}
