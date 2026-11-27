// Planète « réseau mondial » : un globe sombre parcouru d'arcs lumineux qui épousent sa courbure
// et relient des points répartis sur sa face visible. Géométrie calculée une fois par densité
// (graine fixe), projetée en vue orthographique. Décorative.
// prefixe : rend les identifiants SVG uniques quand plusieurs globes sont sur la même page.

type V3 = [number, number, number];
type Reseau = { points: V3[]; liens: [number, number][] };

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

const RESEAUX = new Map<number, Reseau>();

// nombre : nombre de points ; les liens suivent (3 plus proches voisins + grandes traversées)
function reseau(nombre: number): Reseau {
  const deja = RESEAUX.get(nombre);
  if (deja) return deja;
  const alea = hasard(2026);
  const ecart = 0.32 * Math.sqrt(26 / nombre);
  const points: V3[] = [];
  for (let essai = 0; points.length < nombre && essai < 5000; essai++) {
    const p = versVecteur(rad(-58 + alea() * 128), rad(-82 + alea() * 164));
    if (p[2] > 0.18 && points.every((q) => angle(p, q) > ecart)) points.push(p);
  }
  const liens: [number, number][] = [];
  const vus = new Set<string>();
  const ajoute = (i: number, j: number) => {
    const cle = i < j ? `${i}-${j}` : `${j}-${i}`;
    if (i === j || vus.has(cle)) return;
    vus.add(cle);
    liens.push([i, j]);
  };
  points.forEach((p, i) => {
    points
      .map((q, j) => ({ j, d: angle(p, q) }))
      .filter((x) => x.j !== i)
      .sort((x, y) => x.d - y.d)
      .slice(0, 3)
      .forEach(({ j }) => ajoute(i, j));
  });
  const traversees = Math.round(nombre * 0.85);
  for (let n = 0; n < traversees; n++) {
    const i = Math.floor(alea() * points.length);
    const j = Math.floor(alea() * points.length);
    if (angle(points[i], points[j]) < 1.9) ajoute(i, j);
  }
  const r = { points, liens };
  RESEAUX.set(nombre, r);
  return r;
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

export default function PlaneteReseau({
  cx,
  cy,
  r,
  points = 26,
  prefixe = "pr",
}: {
  cx: number;
  cy: number;
  r: number;
  points?: number;
  prefixe?: string;
}) {
  const { points: POINTS, liens: LIENS } = reseau(points);
  // tailles des points et des traits proportionnées au globe (référence : rayon 118)
  const e = Math.max(0.55, r / 118);
  const id = (nom: string) => `${prefixe}-${nom}`;
  const chemins = LIENS.map(([i, j]) => trace(POINTS[i], POINTS[j], cx, cy, r));

  return (
    <g>
      <defs>
        <radialGradient id={id("globe")} cx="0.38" cy="0.32" r="0.78">
          <stop offset="0" stopColor="#1E5BE0" />
          <stop offset="0.4" stopColor="#10308F" />
          <stop offset="0.8" stopColor="#081B4E" />
          <stop offset="1" stopColor="#050F2C" />
        </radialGradient>
        <radialGradient id={id("atmo")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.78" stopColor="#00B4D8" stopOpacity="0" />
          <stop offset="0.86" stopColor="#00B4D8" stopOpacity="0.45" />
          <stop offset="1" stopColor="#00B4D8" stopOpacity="0" />
        </radialGradient>
        <filter id={id("lueur")} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={2.2 * e} />
        </filter>
        <radialGradient id={id("point")}>
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.35" stopColor="#9BEBFF" stopOpacity="0.9" />
          <stop offset="1" stopColor="#00B4D8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Atmosphère et globe */}
      <circle cx={cx} cy={cy} r={r * 1.18} fill={`url(#${id("atmo")})`} />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id("globe")})`} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#7CCBFF" strokeOpacity="0.55" strokeWidth={1.2 * e} />

      {/* Lueur des arcs (copie floutée) */}
      <g filter={`url(#${id("lueur")})`} opacity="0.8">
        {chemins.map((d, k) =>
          d ? <path key={k} d={d} fill="none" stroke={k % 4 === 0 ? "#2BD47D" : "#00B4D8"} strokeWidth={2.4 * e} /> : null,
        )}
      </g>

      {/* Arcs lumineux et impulsions qui les parcourent */}
      {chemins.map((d, k) =>
        d ? (
          <g key={k}>
            <path
              d={d}
              fill="none"
              stroke={k % 4 === 0 ? "#6FF0AE" : "#B8F1FF"}
              strokeOpacity="0.8"
              strokeWidth={Math.max(0.7, e)}
              strokeLinecap="round"
            />
            {k % 3 === 0 && (
              <path
                d={d}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth={1.6 * e}
                strokeLinecap="round"
                strokeDasharray="6 160"
                className="influx"
                style={{ animationDelay: `${(k % 7) * -0.55}s` }}
              />
            )}
          </g>
        ) : null,
      )}

      {/* Points */}
      {POINTS.map((p, i) => {
        // Arrondis : le serveur et le navigateur doivent produire exactement les mêmes valeurs (hydratation)
        const x = Math.round((cx + r * p[0]) * 100) / 100;
        const y = Math.round((cy - r * p[1]) * 100) / 100;
        const k = Math.round((0.55 + p[2] * 0.45) * e * 1000) / 1000;
        return (
          <g key={i} className={i % 3 === 0 ? "pulse" : undefined} style={{ animationDelay: `${(i % 5) * 0.45}s` }}>
            <circle cx={x} cy={y} r={9 * k} fill={`url(#${id("point")})`} />
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
