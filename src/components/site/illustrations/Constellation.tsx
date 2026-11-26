import PlaneteReseau from "@/components/site/PlaneteReseau";

// Illustration de l'accueil : la « constellation » Web Online Concept.
// Une planète au centre, des orbites inclinées et, autour, tout ce que le studio réalise :
// site, application mobile, tableau de bord, IA, code. Décorative (aria-hidden).

const ORBITE = "M 30 0 A 300 108 0 1 0 630 0 A 300 108 0 1 0 30 0";

function Panneau({
  x,
  y,
  l,
  h,
  r = 14,
  retard = 0,
  children,
}: {
  x: number;
  y: number;
  l: number;
  h: number;
  r?: number;
  retard?: number;
  children: React.ReactNode;
}) {
  return (
    <g className="flotte" style={{ animationDelay: `${retard}s` }}>
      <g transform={`translate(${x} ${y})`}>
        <rect width={l} height={h} rx={r} fill="#10233F" fillOpacity="0.94" filter="url(#c-ombre)" />
        <rect width={l} height={h} rx={r} fill="none" stroke="#FFFFFF" strokeOpacity="0.1" />
        {children}
      </g>
    </g>
  );
}

export default function Constellation({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 660 560" className={className} aria-hidden="true" focusable="false" fill="none">
      <defs>
        <radialGradient id="c-lueur" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#1F5EFF" stopOpacity="0.45" />
          <stop offset="1" stopColor="#1F5EFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="c-orbite" x1="30" y1="0" x2="630" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1F5EFF" stopOpacity="0.2" />
          <stop offset="0.55" stopColor="#00B4D8" stopOpacity="0.9" />
          <stop offset="1" stopColor="#2BD47D" />
        </linearGradient>
        <linearGradient id="c-visuel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1F5EFF" />
          <stop offset="0.6" stopColor="#00B4D8" />
          <stop offset="1" stopColor="#2BD47D" />
        </linearGradient>
        <linearGradient id="c-barre" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#1F5EFF" />
          <stop offset="1" stopColor="#00B4D8" />
        </linearGradient>
        <radialGradient id="c-halo">
          <stop offset="0" stopColor="#7CCBFF" stopOpacity="0.85" />
          <stop offset="1" stopColor="#7CCBFF" stopOpacity="0" />
        </radialGradient>
        <filter id="c-ombre" x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#020814" floodOpacity="0.55" />
        </filter>
      </defs>

      {/* Lueur et orbites */}
      <circle cx="330" cy="285" r="230" fill="url(#c-lueur)" />
      <g transform="translate(0 285) rotate(-14 330 0)">
        <path d={ORBITE} stroke="url(#c-orbite)" strokeWidth="2" />
        <ellipse cx="330" cy="0" rx="215" ry="76" stroke="#1F5EFF" strokeOpacity="0.32" strokeWidth="1.2" />
      </g>

      {/* Planète réseau */}
      <PlaneteReseau cx={330} cy={285} r={80} prefixe="hero" />

      {/* Satellite */}
      <g transform="translate(0 285) rotate(-14 330 0)">
        <g className="orbite-satellite">
          <circle r="18" fill="url(#c-halo)" />
          <circle r="6" fill="#2BD47D" />
          <animateMotion dur="24s" repeatCount="indefinite" path={ORBITE} />
        </g>
      </g>

      {/* Site internet */}
      <Panneau x={18} y={38} l={268} h={176}>
        <circle cx="16" cy="14" r="3.5" fill="#3B5A85" />
        <circle cx="28" cy="14" r="3.5" fill="#3B5A85" />
        <circle cx="40" cy="14" r="3.5" fill="#3B5A85" />
        <rect x="62" y="8" width="150" height="12" rx="6" fill="#1A3358" />
        <rect x="14" y="32" width="240" height="66" rx="9" fill="url(#c-visuel)" fillOpacity="0.9" />
        <rect x="27" y="50" width="118" height="9" rx="4.5" fill="#FFFFFF" fillOpacity="0.92" />
        <rect x="27" y="66" width="78" height="6" rx="3" fill="#FFFFFF" fillOpacity="0.6" />
        <rect x="27" y="80" width="40" height="10" rx="5" fill="#0A1A2F" fillOpacity="0.55" />
        {[14, 96, 178].map((cx) => (
          <g key={cx}>
            <rect x={cx} y="108" width="76" height="56" rx="7" fill="#17304F" />
            <rect x={cx + 9} y="118" width="26" height="18" rx="4" fill="#24476F" />
            <rect x={cx + 9} y="143" width="54" height="5" rx="2.5" fill="#3B5A85" />
            <rect x={cx + 9} y="153" width="34" height="5" rx="2.5" fill="#2A4366" />
          </g>
        ))}
      </Panneau>

      {/* IA */}
      <Panneau x={388} y={56} l={170} h={58} r={29} retard={1.2}>
        <circle cx="29" cy="29" r="18" fill="url(#c-visuel)" />
        <path
          d="M29 18.5l2.6 6.9 6.9 2.6-6.9 2.6L29 37.5l-2.6-6.9-6.9-2.6 6.9-2.6z"
          fill="#FFFFFF"
          fillOpacity="0.95"
        />
        <rect x="58" y="20" width="88" height="7" rx="3.5" fill="#7CCBFF" fillOpacity="0.85" />
        <rect x="58" y="33" width="60" height="6" rx="3" fill="#3B5A85" />
      </Panneau>

      {/* Application mobile */}
      <Panneau x={500} y={150} l={130} h={256} r={24} retard={0.6}>
        <rect x="50" y="10" width="30" height="7" rx="3.5" fill="#0A1A2F" />
        <circle cx="22" cy="38" r="8" fill="#24476F" />
        <rect x="36" y="33" width="52" height="6" rx="3" fill="#3B5A85" />
        <rect x="36" y="43" width="32" height="4" rx="2" fill="#2A4366" />
        <rect x="46" y="62" width="72" height="24" rx="12" fill="#1F5EFF" />
        <rect x="57" y="71" width="48" height="6" rx="3" fill="#FFFFFF" fillOpacity="0.85" />
        <rect x="12" y="96" width="92" height="42" rx="12" fill="#1A3358" />
        <rect x="22" y="106" width="64" height="5" rx="2.5" fill="#7CCBFF" fillOpacity="0.8" />
        <rect x="22" y="116" width="72" height="5" rx="2.5" fill="#3B5A85" />
        <rect x="22" y="126" width="46" height="5" rx="2.5" fill="#3B5A85" />
        <rect x="12" y="148" width="106" height="44" rx="11" fill="#17304F" />
        <circle cx="28" cy="170" r="6" fill="#2BD47D" />
        <rect x="42" y="160" width="58" height="6" rx="3" fill="#C3D0DD" fillOpacity="0.7" />
        <rect x="42" y="172" width="40" height="5" rx="2.5" fill="#3B5A85" />
        <rect x="12" y="216" width="106" height="24" rx="12" fill="#1A3358" />
        <circle cx="104" cy="228" r="8" fill="#00B4D8" />
      </Panneau>

      {/* Tableau de bord */}
      <Panneau x={40} y={360} l={236} h={146} retard={1.8}>
        <rect x="16" y="16" width="74" height="7" rx="3.5" fill="#3B5A85" />
        <rect x="16" y="30" width="46" height="12" rx="4" fill="#C3D0DD" fillOpacity="0.75" />
        <rect x="170" y="16" width="50" height="18" rx="9" fill="#2BD47D" fillOpacity="0.16" />
        <rect x="180" y="23" width="30" height="5" rx="2.5" fill="#2BD47D" />
        {[34, 52, 44, 70, 60, 84, 76, 98].map((hauteur, i) => (
          <rect key={i} x={18 + i * 26} y={130 - hauteur} width="14" height={hauteur} rx="4" fill="url(#c-barre)" fillOpacity={0.55 + i * 0.05} />
        ))}
        <polyline
          points="25,104 51,96 77,100 103,82 129,88 155,70 181,74 207,56"
          stroke="#2BD47D"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Panneau>

      {/* Code */}
      <Panneau x={372} y={428} l={176} h={96} retard={2.4}>
        {[
          [[16, 26, "#00B4D8"], [48, 40, "#3B5A85"]],
          [[28, 34, "#2BD47D"], [68, 52, "#3B5A85"]],
          [[28, 22, "#7CCBFF"], [56, 30, "#1F5EFF"], [92, 36, "#3B5A85"]],
          [[16, 44, "#00B4D8"], [66, 26, "#3B5A85"]],
        ].map((ligne, n) =>
          (ligne as [number, number, string][]).map(([x, l, c], k) => (
            <rect key={`${n}-${k}`} x={x} y={18 + n * 17} width={l} height="6" rx="3" fill={c} fillOpacity="0.9" />
          )),
        )}
      </Panneau>
    </svg>
  );
}
