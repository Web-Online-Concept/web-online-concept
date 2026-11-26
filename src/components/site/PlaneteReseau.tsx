// Planète « réseau mondial » : un globe sombre parcouru d'arcs lumineux qui épousent sa courbure
// et relient des points répartis sur sa face visible. Géométrie calculée une fois (graine fixe),
// projetée en vue orthographique. Décorative.

type V3 = [number, number, number];

// Générateur pseudo-aléatoire à graine fixe : même dessin à chaque rendu
function hasard(graine: number) {
  let a = graine;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rad = (d: number) => (d * Math.PI) / 180;
const INCLINAISON = rad(18);

function versVecteur(lat: number, lon: number): V3 {
  const x = Math.cos(lat) * Math.sin(lon);
  const y = Math.sin(lat);
  const z = Math.cos(lat) * Math.cos(lon);
  // inclinaison autour de l'axe horizontal
  return [x, y * Math.cos(INCLINAISON) - z * Math.sin(INCLINAISON), y * Math.sin(INCLINAISON) + z * Math.cos(INCLINAISON)];
}

function slerp(a: V3, b: V3, t: number): V3 {
  const d = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const o = Math.acos(d);
  if (o < 1e-6) return a;
  const s = Math.sin(o);
  const k1 = Math.sin((1 - t) * o) / s;
  const k2 = Math.sin(t * o) / s;
  return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2];
}

const angle = (a: V3, b: V3) => Math.acos(Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])));

const alea = hasard(2026);
const POINTS: V3[] = [];
while (POINTS.length < 26) {
  const p = versVecteur(rad(-58 + alea() * 128), rad(-82 + alea() * 164));
  if (p[2] > 0.18 && POINTS.every((q) => angle(p, q) > 0.32)) POINTS.push(p);
}

// Liens : chaque point vers ses deux plus proches voisins, plus quelques grandes traversées
const LIENS: [number, number][] = [];
const cle = (i: number, j: number) => (i < j ? `${i}-${j}` : `${j}-${i}`);
const vus = new Set<string>();
POINTS.forEach((p, i) => {
  POINTS.map((q, j) => ({ j, d: angle(p, q) }))
    .filter((x) => x.j !== i)
    .sort((x, y) => x.d - y.d)
    .slice(0, 3)
    .forEach(({ j }) => {
      if (!vus.has(cle(i, j))) {
        vus.add(cle(i, j));
        LIENS.push([i, j]);
      }
    });
});
for (let n = 0; n < 22; n++) {
  const i = Math.floor(alea() * POINTS.length);
  const j = Math.floor(alea() * POINTS.length);
  if (i !== j && !vus.has(cle(i, j)) && angle(POINTS[i], POINTS[j]) < 1.9) {
    vus.add(cle(i, j));
    LIENS.push([i, j]);
  }
}

// Tracé d'un arc : grand cercle légèrement surélevé au milieu ; seule la partie visible est dessinée
function trace(a: V3, b: V3, cx: number, cy: number, r: number) {
  const hauteur = 0.04 + angle(a, b) * 0.09;
  let d = "";
  let enCours = false;
  for (let k = 0; k <= 28; k++) {
    const t = k / 28;
    const p = slerp(a, b, t);
    const e = 1 + hauteur * Math.sin(Math.PI * t);
    if (p[2] < 0.02) {
      enCours = false;
      continue;
    }
    const x = (cx + r * e * p[0]).toFixed(1);
    const y = (cy - r * e * p[1]).toFixed(1);
    d += `${enCours ? "L" : "M"} ${x} ${y} `;
    enCours = true;
  }
  return d.trim();
}

export default function PlaneteReseau({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <defs>
        <radialGradient id="pr-globe" cx="0.38" cy="0.32" r="0.78">
          <stop offset="0" stopColor="#1E5BE0" />
          <stop offset="0.4" stopColor="#10308F" />
          <stop offset="0.8" stopColor="#081B4E" />
          <stop offset="1" stopColor="#050F2C" />
        </radialGradient>
        <radialGradient id="pr-atmo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.78" stopColor="#00B4D8" stopOpacity="0" />
          <stop offset="0.86" stopColor="#00B4D8" stopOpacity="0.45" />
          <stop offset="1" stopColor="#00B4D8" stopOpacity="0" />
        </radialGradient>
        <filter id="pr-lueur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
        <radialGradient id="pr-point">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.35" stopColor="#9BEBFF" stopOpacity="0.9" />
          <stop offset="1" stopColor="#00B4D8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Atmosphère et globe */}
      <circle cx={cx} cy={cy} r={r * 1.18} fill="url(#pr-atmo)" />
      <circle cx={cx} cy={cy} r={r} fill="url(#pr-globe)" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#7CCBFF" strokeOpacity="0.55" strokeWidth="1.2" />

      {/* Lueur des arcs (copie floutée) */}
      <g filter="url(#pr-lueur)" opacity="0.8">
        {LIENS.map(([i, j], k) => {
          const d = trace(POINTS[i], POINTS[j], cx, cy, r);
          return d ? <path key={k} d={d} fill="none" stroke={k % 4 === 0 ? "#2BD47D" : "#00B4D8"} strokeWidth="2.4" /> : null;
        })}
      </g>

      {/* Arcs lumineux */}
      {LIENS.map(([i, j], k) => {
        const d = trace(POINTS[i], POINTS[j], cx, cy, r);
        if (!d) return null;
        const vert = k % 4 === 0;
        return (
          <g key={k}>
            <path d={d} fill="none" stroke={vert ? "#6FF0AE" : "#B8F1FF"} strokeOpacity="0.8" strokeWidth="1" strokeLinecap="round" />
            {k % 3 === 0 && (
              <path
                d={d}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeDasharray="6 160"
                className="influx"
                style={{ animationDelay: `${(k % 7) * -0.55}s` }}
              />
            )}
          </g>
        );
      })}

      {/* Points */}
      {POINTS.map((p, i) => {
        const x = cx + r * p[0];
        const y = cy - r * p[1];
        const k = 0.55 + p[2] * 0.45;
        return (
          <g key={i} className={i % 3 === 0 ? "pulse" : undefined} style={{ animationDelay: `${(i % 5) * 0.45}s` }}>
            <circle cx={x} cy={y} r={9 * k} fill="url(#pr-point)" />
            <circle cx={x} cy={y} r={2 * k} fill={i % 4 === 0 ? "#6FF0AE" : "#FFFFFF"} />
          </g>
        );
      })}

      {/* Reflet */}
      <ellipse
        cx={cx - r * 0.32}
        cy={cy - r * 0.36}
        rx={r * 0.34}
        ry={r * 0.18}
        fill="#FFFFFF"
        fillOpacity="0.07"
        transform={`rotate(-30 ${cx - r * 0.32} ${cy - r * 0.36})`}
      />
    </g>
  );
}
