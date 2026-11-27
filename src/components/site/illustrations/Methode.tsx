// Mini-animations des quatre étapes de la méthode (accueil). Décoratives : SVG + CSS (classes m1- à m4-
// dans animations.css), en pause tant que l'étape n'est pas « allumée » par la ligne de progression.
import { langue } from "@/lib/i18n/langue";

const FENETRE = { x: 22, y: 22, l: 236, h: 166 };

function Fenetre({ children, onglet = false }: { children?: React.ReactNode; onglet?: boolean }) {
  return (
    <>
      <rect x={FENETRE.x} y={FENETRE.y} width={FENETRE.l} height={FENETRE.h} rx="12" fill="#0B1C33" stroke="#24476F" />
      {[34, 42, 50].map((cx) => (
        <circle key={cx} cx={cx} cy="31" r="2.4" fill="#3B5A85" />
      ))}
      {onglet && <rect x="62" y="26.5" width="46" height="9" rx="4.5" fill="#1A3358" />}
      {children}
    </>
  );
}

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 280 210" className="h-full w-full" aria-hidden="true" focusable="false" fill="none">
      {children}
    </svg>
  );
}

// 1. Cadrer vite : la maquette se dessine, se remplit, puis un clic la valide
export function AnimPrototype() {
  const blocs = [
    { x: 34, y: 42, l: 212, h: 15 },
    { x: 34, y: 64, l: 138, h: 66 },
    { x: 180, y: 64, l: 66, h: 66 },
    { x: 34, y: 138, l: 64, h: 40 },
    { x: 108, y: 138, l: 64, h: 40 },
    { x: 182, y: 138, l: 64, h: 40 },
  ];
  return (
    <Svg>
      <defs>
        <linearGradient id="m1-degrade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1F5EFF" />
          <stop offset="0.6" stopColor="#00B4D8" />
          <stop offset="1" stopColor="#2BD47D" />
        </linearGradient>
      </defs>
      <Fenetre />
      {blocs.map((b, i) => (
        <g key={i}>
          <rect
            className="m1-remplir"
            style={{ animationDelay: `${i * 0.1}s` }}
            x={b.x}
            y={b.y}
            width={b.l}
            height={b.h}
            rx="6"
            fill={i === 1 ? "url(#m1-degrade)" : "#1A3358"}
          />
          <rect
            className="m1-trace"
            style={{ animationDelay: `${i * 0.16}s` }}
            x={b.x}
            y={b.y}
            width={b.l}
            height={b.h}
            rx="6"
            pathLength={1}
            strokeDasharray="1"
            stroke="#7CCBFF"
            strokeWidth="1.4"
          />
        </g>
      ))}
      <g className="m1-remplir" style={{ animationDelay: "0.35s" }}>
        <rect x="46" y="77" width="82" height="7" rx="3.5" fill="#FFFFFF" fillOpacity="0.92" />
        <rect x="46" y="90" width="56" height="5" rx="2.5" fill="#FFFFFF" fillOpacity="0.6" />
        <rect x="192" y="76" width="42" height="26" rx="5" fill="#24476F" />
        <rect x="192" y="108" width="30" height="5" rx="2.5" fill="#3B5A85" />
        {[44, 118, 192].map((x) => (
          <rect key={x} x={x} y="164" width="34" height="5" rx="2.5" fill="#3B5A85" />
        ))}
      </g>
      <rect className="m1-bouton" x="46" y="106" width="44" height="13" rx="6.5" fill="#0A1A2F" />
      <g className="m1-curseur">
        <path d="M0 0v15.5l4.1-3.9 2.9 6.9 2.6-1.1-2.9-6.7H12.4z" fill="#FFFFFF" stroke="#0A1A2F" strokeWidth="1" strokeLinejoin="round" />
      </g>
    </Svg>
  );
}

// 2. Produire plus : le code s'écrit à toute vitesse, l'IA à la manœuvre
const LIGNES: [number, [number, string][]][] = [
  [0, [[30, "#00B4D8"], [46, "#7CCBFF"], [22, "#3B5A85"]]],
  [12, [[24, "#2BD47D"], [62, "#3B5A85"]]],
  [12, [[38, "#4D86FF"], [28, "#7CCBFF"], [34, "#3B5A85"]]],
  [24, [[52, "#3B5A85"], [26, "#2BD47D"]]],
  [24, [[30, "#00B4D8"], [46, "#3B5A85"]]],
  [12, [[20, "#7CCBFF"], [66, "#3B5A85"]]],
  [0, [[18, "#00B4D8"]]],
  [0, [[36, "#2BD47D"], [40, "#3B5A85"]]],
];

export async function AnimCode() {
  const ia = (await langue()) === "en" ? "AI" : "IA";
  return (
    <Svg>
      <defs>
        <linearGradient id="m2-degrade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1F5EFF" />
          <stop offset="0.6" stopColor="#00B4D8" />
          <stop offset="1" stopColor="#2BD47D" />
        </linearGradient>
      </defs>
      <Fenetre onglet />
      <rect x="204" y="25.5" width="44" height="12" rx="6" fill="url(#m2-degrade)" />
      <path
        className="m2-etincelle"
        d="M215 26.6l1.25 3.45 3.45 1.25-3.45 1.25L215 36l-1.25-3.45-3.45-1.25 3.45-1.25z"
        fill="#FFFFFF"
      />
      <text x="224" y="34.4" fontSize="8" fontWeight="600" fill="#FFFFFF" fontFamily="var(--font-sora), sans-serif">
        {ia}
      </text>
      {LIGNES.map((ligne, i) => {
        const y = 50 + i * 16.5;
        let x = 52 + ligne[0];
        return (
          <g key={i}>
            <rect x="34" y={y + 1} width="8" height="5" rx="2.5" fill="#24476F" />
            <g className="m2-ligne" style={{ animationDelay: `${i * 0.2}s` }}>
              {ligne[1].map(([l, c], k) => {
                const seg = <rect key={k} x={x} y={y} width={l} height="7" rx="3.5" fill={c} />;
                x += l + 6;
                return seg;
              })}
            </g>
          </g>
        );
      })}
      <rect className="m2-caret" x="140" y="164" width="2" height="9" rx="1" fill="#FFFFFF" />
    </Svg>
  );
}

// 3. Tout vérifier : les tests passent un à un, la barre se remplit, le bouclier s'allume
export function AnimTests() {
  const largeurs = [112, 92, 120, 84, 104];
  return (
    <Svg>
      <defs>
        <linearGradient id="m3-degrade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1F5EFF" />
          <stop offset="0.6" stopColor="#00B4D8" />
          <stop offset="1" stopColor="#2BD47D" />
        </linearGradient>
      </defs>
      <rect x="22" y="22" width="236" height="166" rx="12" fill="#0B1C33" stroke="#24476F" />
      <rect x="36" y="34" width="64" height="7" rx="3.5" fill="#3B5A85" />
      <g className="m3-bouclier">
        <path d="M232 29.5l9 3.4v6.3c0 5.4-3.8 9.3-9 10.8-5.2-1.5-9-5.4-9-10.8v-6.3z" fill="#2BD47D" />
        <path d="M228 39.4l2.9 2.9 5.3-5.4" stroke="#0A1A2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {largeurs.map((l, i) => {
        const cy = 64 + i * 22;
        return (
          <g key={i}>
            <circle cx="44" cy={cy} r="6.5" stroke="#3B5A85" strokeWidth="1.5" />
            <g className="m3-attente" style={{ animationDelay: `${i * 0.4}s` }}>
              <path
                className="m3-tourne"
                style={{ transformOrigin: `44px ${cy}px` }}
                d={`M44 ${cy - 6.5}A6.5 6.5 0 0 1 50.5 ${cy}`}
                stroke="#00B4D8"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
            <g className="m3-ok" style={{ animationDelay: `${i * 0.4}s` }}>
              <circle cx="44" cy={cy} r="7" fill="#2BD47D" />
              <path
                d={`M40.6 ${cy}l2.3 2.3 4.4-4.5`}
                stroke="#0A1A2F"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <rect x="60" y={cy - 3.5} width={l} height="7" rx="3.5" fill="#24476F" />
            <rect x="208" y={cy - 2.5} width="36" height="5" rx="2.5" fill="#1A3358" />
          </g>
        );
      })}
      <rect x="36" y="172" width="208" height="6" rx="3" fill="#1A3358" />
      <rect className="m3-barre" x="36" y="172" width="208" height="6" rx="3" fill="url(#m3-degrade)" />
    </Svg>
  );
}

// 4. Faire évoluer : la courbe monte, versions après versions
const COURBE = "M40 160C78 152 96 136 120 129S166 105 186 96 226 68 240 56";

export function AnimCourbe() {
  const barres = [34, 42, 50, 46, 62, 70, 84, 100];
  const versions = [
    { x: 40, y: 160, t: "v1", d: 0 },
    { x: 120, y: 129, t: "v2", d: 0.85 },
    { x: 186, y: 96, t: "v3", d: 1.65 },
    { x: 240, y: 56, t: "v4", d: 2.35 },
  ];
  return (
    <Svg>
      <defs>
        <linearGradient id="m4-trait" x1="40" y1="0" x2="240" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1F5EFF" />
          <stop offset="0.6" stopColor="#00B4D8" />
          <stop offset="1" stopColor="#2BD47D" />
        </linearGradient>
        <linearGradient id="m4-aire" x1="0" y1="50" x2="0" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#00B4D8" stopOpacity="0.35" />
          <stop offset="1" stopColor="#00B4D8" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="m4-halo">
          <stop offset="0" stopColor="#2BD47D" stopOpacity="0.8" />
          <stop offset="1" stopColor="#2BD47D" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="22" y="22" width="236" height="166" rx="12" fill="#0B1C33" stroke="#24476F" />
      {[60, 95, 130, 165].map((y) => (
        <path key={y} d={`M34 ${y}H246`} stroke="#1A3358" strokeDasharray="3 5" />
      ))}
      {barres.map((h, i) => (
        <rect
          key={i}
          className="m4-barre"
          style={{ animationDelay: `${i * 0.12}s` }}
          x={38 + i * 26}
          y={178 - h * 0.62}
          width="14"
          height={h * 0.62}
          rx="3"
          fill="#1A3358"
        />
      ))}
      <path className="m4-aire" d={`${COURBE}L240 178H40z`} fill="url(#m4-aire)" />
      <path className="m4-courbe" d={COURBE} pathLength={1} strokeDasharray="1" stroke="url(#m4-trait)" strokeWidth="3" strokeLinecap="round" />
      <g className="m4-sommet">
        <circle cx="240" cy="56" r="14" fill="url(#m4-halo)" />
        <circle cx="240" cy="56" r="4.5" fill="#2BD47D" />
      </g>
      {versions.map((v) => (
        <g key={v.t} className="m4-version" style={{ animationDelay: `${v.d}s` }}>
          <circle cx={v.x} cy={v.y} r="3.2" fill="#FFFFFF" />
          <rect x={v.x - 12} y={v.y - 24} width="24" height="14" rx="7" fill="#10233F" stroke="#00B4D8" />
          <text
            x={v.x}
            y={v.y - 14.2}
            textAnchor="middle"
            fontSize="8"
            fontWeight="600"
            fill="#FFFFFF"
            fontFamily="var(--font-sora), sans-serif"
          >
            {v.t}
          </text>
        </g>
      ))}
    </Svg>
  );
}

export const ANIMATIONS_METHODE = [AnimPrototype, AnimCode, AnimTests, AnimCourbe];
