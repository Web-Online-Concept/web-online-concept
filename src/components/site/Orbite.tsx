// Motif d'orbite de la marque : grande ellipse inclinée en dégradé, avec un satellite.
// Purement décoratif.

// Réseau de communication autour de la planète : points reliés par des arcs en pointillés
// qui « sautent » d'un point à l'autre, à la surface et vers l'extérieur.
const C = { x: 600, y: 300 };
const R = 80;
const SURFACE = [
  { x: 556, y: 264 },
  { x: 628, y: 248 },
  { x: 654, y: 314 },
  { x: 592, y: 346 },
  { x: 542, y: 312 },
  { x: 610, y: 294 },
];
const EXTERIEUR = [
  { x: 462, y: 226 },
  { x: 648, y: 150 },
  { x: 752, y: 222 },
  { x: 770, y: 360 },
  { x: 488, y: 398 },
];
// [départ, arrivée, hauteur du saut] ; s = surface, e = extérieur
const LIENS: [string, string, number][] = [
  ["s0", "s1", 0.55],
  ["s1", "s2", 0.5],
  ["s2", "s3", 0.5],
  ["s3", "s4", 0.5],
  ["s4", "s0", 0.45],
  ["s5", "s0", 0.6],
  ["s5", "s2", 0.6],
  ["s0", "e0", 0.7],
  ["s1", "e1", 0.55],
  ["s1", "e2", 0.7],
  ["s2", "e3", 0.65],
  ["s3", "e4", 0.7],
  ["e0", "e1", 0.45],
  ["e2", "e3", 0.4],
  ["e4", "e0", 0.3],
];

function point(id: string) {
  return id[0] === "s" ? SURFACE[Number(id.slice(1))] : EXTERIEUR[Number(id.slice(1))];
}

// Arc d'un point à l'autre : à la surface, il épouse la planète ; vers l'extérieur,
// il forme un « saut » en cloche (comme une trajectoire de vol)
function arc(a: { x: number; y: number }, b: { x: number; y: number }, hauteur: number, saut: boolean) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const d = Math.hypot(b.x - a.x, b.y - a.y);
  let ox: number;
  let oy: number;
  if (saut) {
    // perpendiculaire au segment, orientée vers le haut
    ox = -(b.y - a.y) / d;
    oy = (b.x - a.x) / d;
    if (oy > 0) {
      ox = -ox;
      oy = -oy;
    }
  } else {
    // vers l'extérieur de la planète
    ox = mx - C.x;
    oy = my - C.y;
    const n = Math.hypot(ox, oy) || 1;
    ox /= n;
    oy /= n;
  }
  const cx = mx + ox * d * hauteur;
  const cy = my + oy * d * hauteur;
  return `M ${a.x} ${a.y} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x} ${b.y}`;
}

function Reseau() {
  return (
    <g>
      {LIENS.map(([a, b, h], i) => (
        <path
          key={i}
          d={arc(point(a), point(b), h, a[0] === "e" || b[0] === "e")}
          fill="none"
          stroke={b[0] === "e" ? "url(#orbite-lien)" : "#9BEBFF"}
          strokeOpacity={a[0] === "e" ? 0.55 : b[0] === "e" ? 0.95 : 0.8}
          strokeWidth="2.6"
          strokeDasharray="0.5 7"
          strokeLinecap="round"
          className="flux"
          style={{ animationDelay: `${(i % 5) * -0.4}s` }}
        />
      ))}
      {SURFACE.map((p, i) => (
        <g key={`s${i}`}>
          <circle cx={p.x} cy={p.y} r="7" fill="#9BEBFF" fillOpacity="0.22" />
          <circle cx={p.x} cy={p.y} r="3.2" fill="#FFFFFF" />
        </g>
      ))}
      {EXTERIEUR.map((p, i) => (
        <g key={`e${i}`} className="pulse" style={{ animationDelay: `${i * 0.5}s` }}>
          <circle cx={p.x} cy={p.y} r="10" fill="#2BD47D" fillOpacity="0.18" />
          <circle cx={p.x} cy={p.y} r="4.2" fill={i % 2 ? "#00B4D8" : "#2BD47D"} />
        </g>
      ))}
    </g>
  );
}

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
        <radialGradient id="orbite-planete" cx="0.34" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#9BEBFF" />
          <stop offset="0.28" stopColor="#00B4D8" />
          <stop offset="0.62" stopColor="#1F5EFF" />
          <stop offset="1" stopColor="#13308F" />
        </radialGradient>
        <radialGradient id="orbite-lueur" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#1F5EFF" stopOpacity="0.5" />
          <stop offset="1" stopColor="#1F5EFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="orbite-lien" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9BEBFF" />
          <stop offset="1" stopColor="#2BD47D" />
        </linearGradient>
        <radialGradient id="orbite-halo">
          <stop offset="0" stopColor="#7CCBFF" stopOpacity="0.8" />
          <stop offset="1" stopColor="#7CCBFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      {planete && (
        <>
          <circle cx="600" cy="300" r="230" fill="url(#orbite-lueur)" />
          <circle cx="600" cy="300" r={R} fill="url(#orbite-planete)" />
          <circle cx="600" cy="300" r={R} fill="none" stroke="#FFFFFF" strokeOpacity="0.18" />
          <ellipse cx="572" cy="268" rx="26" ry="14" fill="#FFFFFF" fillOpacity="0.16" transform="rotate(-28 572 268)" />
          <Reseau />
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
