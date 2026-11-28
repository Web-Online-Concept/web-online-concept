// Illustrations des en-têtes de page, dans le langage visuel de la marque :
// orbites inclinées, planète en dégradé, panneaux sombres. Décoratives (aria-hidden).

import type { NomIcone } from "@/components/site/Icones";
import PlaneteReseau from "@/components/site/PlaneteReseau";

export type VarianteEntete = "realisations" | "capacites" | "methode" | "apropos" | "blog" | "contact" | "faq";

const CX = 220;
const CY = 160;

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <radialGradient id={`${id}-lueur`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#1F5EFF" stopOpacity="0.42" />
        <stop offset="1" stopColor="#1F5EFF" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}-planete`} cx="0.34" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#9BEBFF" />
        <stop offset="0.3" stopColor="#00B4D8" />
        <stop offset="0.64" stopColor="#1F5EFF" />
        <stop offset="1" stopColor="#13308F" />
      </radialGradient>
      <linearGradient id={`${id}-orbite`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#1F5EFF" stopOpacity="0.2" />
        <stop offset="0.55" stopColor="#00B4D8" stopOpacity="0.9" />
        <stop offset="1" stopColor="#2BD47D" />
      </linearGradient>
      <linearGradient id={`${id}-visuel`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#1F5EFF" />
        <stop offset="0.6" stopColor="#00B4D8" />
        <stop offset="1" stopColor="#2BD47D" />
      </linearGradient>
      <filter id={`${id}-ombre`} x="-30%" y="-30%" width="160%" height="170%">
        <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#020814" floodOpacity="0.55" />
      </filter>
    </defs>
  );
}

function Fond({ id, rx = 190, ry = 66, planete = 34 }: { id: string; rx?: number; ry?: number; planete?: number }) {
  return (
    <>
      <circle cx={CX} cy={CY} r="170" fill={`url(#${id}-lueur)`} />
      <g transform={`rotate(-14 ${CX} ${CY})`}>
        <ellipse cx={CX} cy={CY} rx={rx} ry={ry} stroke={`url(#${id}-orbite)`} strokeWidth="1.8" />
        <ellipse cx={CX} cy={CY} rx={rx * 0.68} ry={ry * 0.68} stroke="#1F5EFF" strokeOpacity="0.3" strokeWidth="1.1" />
      </g>
      {planete > 0 && (
        <>
          <circle cx={CX} cy={CY} r={planete} fill={`url(#${id}-planete)`} />
          <ellipse
            cx={CX - planete * 0.3}
            cy={CY - planete * 0.38}
            rx={planete * 0.36}
            ry={planete * 0.2}
            fill="#FFFFFF"
            fillOpacity="0.2"
            transform={`rotate(-28 ${CX - planete * 0.3} ${CY - planete * 0.38})`}
          />
        </>
      )}
    </>
  );
}

function Carte({ id, x, y, l, h, r = 12, retard = 0, children }: { id: string; x: number; y: number; l: number; h: number; r?: number; retard?: number; children?: React.ReactNode }) {
  return (
    <g className="flotte" style={{ animationDelay: `${retard}s` }}>
      <g transform={`translate(${x} ${y})`}>
        <rect width={l} height={h} rx={r} fill="#10233F" fillOpacity="0.95" filter={`url(#${id}-ombre)`} />
        <rect width={l} height={h} rx={r} stroke="#FFFFFF" strokeOpacity="0.1" />
        {children}
      </g>
    </g>
  );
}

// Tracés des pictogrammes (repris de Icones.tsx, dessinés ici en SVG brut)
const PICTOS: Record<NomIcone, string> = {
  site: "M2.75 6.5a2.5 2.5 0 0 1 2.5-2.5h13.5a2.5 2.5 0 0 1 2.5 2.5v11a2.5 2.5 0 0 1-2.5 2.5H5.25a2.5 2.5 0 0 1-2.5-2.5zM2.75 8.75h18.5M6.5 12.5h6M6.5 15.5h4",
  app: "M9.35 2.5h5.3a2.6 2.6 0 0 1 2.6 2.6v13.8a2.6 2.6 0 0 1-2.6 2.6h-5.3a2.6 2.6 0 0 1-2.6-2.6V5.1a2.6 2.6 0 0 1 2.6-2.6zM10.75 5h2.5M11 18.5h2",
  abonnement: "M5 5.5h14a2.5 2.5 0 0 1 2.5 2.5v8a2.5 2.5 0 0 1-2.5 2.5H5A2.5 2.5 0 0 1 2.5 16V8A2.5 2.5 0 0 1 5 5.5zM2.5 9.75h19M6 14.5h4",
  ia: "M11 3.5l1.85 4.9 4.9 1.85-4.9 1.85L11 17l-1.85-4.9-4.9-1.85 4.9-1.85zM18.5 14.5l.75 1.95 1.95.75-1.95.75-.75 1.95-.75-1.95-1.95-.75 1.95-.75z",
  visibilite: "M17.25 10.5a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0zM15.4 15.4l5.1 5.1M8 13v-1.5M10.5 13V9.5M13 13V8",
  evolution: "M19.75 12a7.75 7.75 0 0 1-13.4 5.3M4.25 12a7.75 7.75 0 0 1 13.4-5.3M17.9 3.2v3.6h-3.6M6.1 20.8v-3.6h3.6",
  donnees: "M4.75 5.75c0-1.5 3.25-2.75 7.25-2.75s7.25 1.25 7.25 2.75-3.25 2.75-7.25 2.75-7.25-1.25-7.25-2.75zM4.75 5.75v12.5c0 1.5 3.25 2.75 7.25 2.75s7.25-1.25 7.25-2.75V5.75M4.75 12c0 1.5 3.25 2.75 7.25 2.75s7.25-1.25 7.25-2.75",
  securite: "M12 2.75l7.25 3v5.1c0 4.6-3.05 8.4-7.25 10.4-4.2-2-7.25-5.8-7.25-10.4v-5.1zM8.75 12.1l2.2 2.2 4.3-4.4",
};

function Picto({ nom, x, y, taille = 26, couleur = "#7CCBFF" }: { nom: NomIcone; x: number; y: number; taille?: number; couleur?: string }) {
  const k = taille / 24;
  return (
    <path
      d={PICTOS[nom]}
      transform={`translate(${x} ${y}) scale(${k})`}
      stroke={couleur}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    />
  );
}

// Capacités : les huit capacités gravitent autour du globe réseau (fixes si l'on limite les animations)
function Capacites({ id }: { id: string }) {
  const noms: NomIcone[] = ["site", "app", "abonnement", "ia", "visibilite", "donnees", "evolution", "securite"];
  const RX = 170;
  const RY = 112;
  const DUREE = 48;
  const orbite = `M ${CX} ${CY - RY} A ${RX} ${RY} 0 1 1 ${CX} ${CY + RY} A ${RX} ${RY} 0 1 1 ${CX} ${CY - RY}`;
  const pos = noms.map((_, i) => {
    const a = (i / noms.length) * Math.PI * 2 - Math.PI / 2;
    return { x: CX + Math.cos(a) * RX, y: CY + Math.sin(a) * RY };
  });
  const carte = (nom: NomIcone, i: number, x: number, y: number) => (
    <Carte id={id} x={x - 25} y={y - 25} l={50} h={50} r={15} retard={i * 0.45}>
      <Picto nom={nom} x={12} y={12} taille={26} couleur={i % 2 ? "#2BD47D" : "#7CCBFF"} />
    </Carte>
  );
  return (
    <>
      <Fond id={id} rx={168} ry={60} planete={0} />
      <ellipse cx={CX} cy={CY} rx={RX} ry={RY} stroke="#00B4D8" strokeOpacity="0.22" strokeDasharray="2 6" />
      <PlaneteReseau cx={CX} cy={CY} r={40} points={14} prefixe={`${id}-globe`} />
      <g className="orbite-mobile">
        {noms.map((nom, i) => (
          <g key={nom}>
            <animateMotion dur={`${DUREE}s`} begin={`${-(i * DUREE) / noms.length}s`} repeatCount="indefinite" path={orbite} />
            {carte(nom, i, 0, 0)}
          </g>
        ))}
      </g>
      <g className="orbite-fixe">
        {noms.map((nom, i) => (
          <g key={nom}>{carte(nom, i, pos[i].x, pos[i].y)}</g>
        ))}
      </g>
    </>
  );
}

function Methode({ id }: { id: string }) {
  const couleurs = ["#1F5EFF", "#00B4D8", "#0B8E9E", "#2BD47D"];
  const points = [
    { x: 58, y: 236 },
    { x: 160, y: 150 },
    { x: 278, y: 110 },
    { x: 390, y: 52 },
  ];
  return (
    <>
      <Fond id={id} rx={200} ry={70} planete={0} />
      <path
        d="M 58 236 C 100 190, 120 160, 160 150 S 240 118, 278 110 S 360 70, 390 52"
        stroke={`url(#${id}-orbite)`}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {points.map((p, i) => (
        <g key={i} className="flotte" style={{ animationDelay: `${i * 0.6}s` }}>
          <circle cx={p.x} cy={p.y} r="27" fill={couleurs[i]} fillOpacity="0.16" />
          <circle cx={p.x} cy={p.y} r="19" fill="#10233F" stroke={couleurs[i]} strokeWidth="2" />
          <text
            x={p.x}
            y={p.y + 6}
            textAnchor="middle"
            fontSize="17"
            fontWeight="600"
            fill="#FFFFFF"
            style={{ fontFamily: "var(--font-sora), sans-serif" }}
          >
            {i + 1}
          </text>
        </g>
      ))}
      <g className="orbite-satellite">
        <circle r="5" fill="#2BD47D" />
        <animateMotion dur="9s" repeatCount="indefinite" path="M 58 236 C 100 190, 120 160, 160 150 S 240 118, 278 110 S 360 70, 390 52" />
      </g>
    </>
  );
}

// À propos : des anneaux autour du globe réseau, et des projets qui gravitent dessus (les anneaux intérieurs
// tournent plus vite). Avec « réduire les animations », les points restent à leur place.
function APropos({ id }: { id: string }) {
  const anneaux = [0.42, 0.58, 0.74, 0.88, 1];
  const projets: [number, number][] = [
    [0.42, 0.6],
    [0.58, 2.2],
    [0.58, 4.4],
    [0.74, 1.1],
    [0.74, 3.5],
    [0.74, 5.6],
    [0.88, 0.2],
    [0.88, 2.8],
    [0.88, 4.9],
    [1, 1.6],
    [1, 3.9],
    [1, 5.3],
  ];
  const ellipse = (k: number) => {
    const rx = 190 * k;
    const ry = 70 * k;
    return `M ${CX + rx} ${CY} A ${rx} ${ry} 0 1 1 ${CX - rx} ${CY} A ${rx} ${ry} 0 1 1 ${CX + rx} ${CY}`;
  };
  return (
    <>
      <circle cx={CX} cy={CY} r="170" fill={`url(#${id}-lueur)`} />
      <g transform={`rotate(-14 ${CX} ${CY})`}>
        {anneaux.map((k, i) => (
          <ellipse
            key={k}
            cx={CX}
            cy={CY}
            rx={190 * k}
            ry={70 * k}
            stroke={i === anneaux.length - 1 ? `url(#${id}-orbite)` : "#1F5EFF"}
            strokeOpacity={i === anneaux.length - 1 ? 1 : 0.16 + i * 0.07}
            strokeWidth={i === anneaux.length - 1 ? 1.8 : 1.1}
          />
        ))}
        {/* Projets en orbite : durée proportionnelle à la taille de l'anneau, départ décalé selon l'angle */}
        <g className="orbite-mobile">
          {projets.map(([k, a], i) => {
            const duree = 14 + k * 26;
            const depart = -((a / (Math.PI * 2)) * duree).toFixed(2);
            return (
              <circle key={i} r={k === 1 ? 5 : 3.5} fill={k === 1 ? "#2BD47D" : "#7CCBFF"} fillOpacity={0.5 + k * 0.5}>
                <animateMotion dur={`${duree}s`} begin={`${depart}s`} repeatCount="indefinite" path={ellipse(k)} />
              </circle>
            );
          })}
        </g>
        <g className="orbite-fixe">
          {projets.map(([k, a], i) => (
            <circle
              key={i}
              cx={CX + Math.cos(a) * 190 * k}
              cy={CY + Math.sin(a) * 70 * k}
              r={k === 1 ? 5 : 3.5}
              fill={k === 1 ? "#2BD47D" : "#7CCBFF"}
              fillOpacity={0.5 + k * 0.5}
            />
          ))}
        </g>
      </g>
      <PlaneteReseau cx={CX} cy={CY} r={36} points={14} prefixe={`${id}-globe`} />
    </>
  );
}

// Réalisations : un site et une application qui se construisent en boucle, et des points qui gravitent
// derrière (fixes si l'on limite les animations)
function Realisations({ id }: { id: string }) {
  const rx = 196;
  const ry = 64;
  const orbite = `M ${CX + rx} ${CY} A ${rx} ${ry} 0 1 1 ${CX - rx} ${CY} A ${rx} ${ry} 0 1 1 ${CX + rx} ${CY}`;
  const points = [
    { r: 5, couleur: "#2BD47D", depart: 0 },
    { r: 4, couleur: "#7CCBFF", depart: -8 },
    { r: 3.5, couleur: "#00B4D8", depart: -16 },
  ];
  return (
    <>
      <Fond id={id} rx={rx} ry={ry} planete={0} />
      <g transform={`rotate(-14 ${CX} ${CY})`}>
        <g className="orbite-mobile">
          {points.map((p, k) => (
            <circle key={k} r={p.r} fill={p.couleur}>
              <animateMotion dur="24s" begin={`${p.depart}s`} repeatCount="indefinite" path={orbite} />
            </circle>
          ))}
        </g>
        <g className="orbite-fixe">
          {points.map((p, k) => (
            <circle key={k} cx={CX + Math.cos(k * 2.1 + 0.4) * rx} cy={CY + Math.sin(k * 2.1 + 0.4) * ry} r={p.r} fill={p.couleur} />
          ))}
        </g>
      </g>
      <Carte id={id} x={40} y={46} l={262} h={178}>
        <circle cx="15" cy="14" r="3.2" fill="#3B5A85" />
        <circle cx="26" cy="14" r="3.2" fill="#3B5A85" />
        <circle cx="37" cy="14" r="3.2" fill="#3B5A85" />
        <rect x="56" y="8" width="140" height="12" rx="6" fill="#1A3358" />
        <rect x="14" y="32" width="234" height="80" rx="9" fill={`url(#${id}-visuel)`} fillOpacity="0.9" />
        <rect className="m2-ligne" x="27" y="56" width="110" height="9" rx="4.5" fill="#FFFFFF" fillOpacity="0.92" />
        <rect className="m2-ligne" style={{ animationDelay: "0.3s" }} x="27" y="72" width="70" height="6" rx="3" fill="#FFFFFF" fillOpacity="0.6" />
        {[14, 94, 174].map((x, k) => (
          <g key={x} className="real-vignette" style={{ animationDelay: `${0.6 + k * 0.3}s` }}>
            <rect x={x} y="122" width="74" height="42" rx="7" fill="#17304F" />
            <rect x={x + 9} y="132" width="44" height="5" rx="2.5" fill="#3B5A85" />
            <rect x={x + 9} y="143" width="30" height="5" rx="2.5" fill="#2A4366" />
          </g>
        ))}
      </Carte>
      <Carte id={id} x={274} y={92} l={112} h={208} r={22} retard={0.8}>
        <rect x="41" y="9" width="30" height="6" rx="3" fill="#0A1A2F" />
        <rect x="12" y="28" width="88" height="70" rx="11" fill={`url(#${id}-visuel)`} fillOpacity="0.85" />
        <g className="real-vignette" style={{ animationDelay: "1.2s" }}>
          <rect x="12" y="108" width="88" height="34" rx="9" fill="#1A3358" />
          <rect x="20" y="117" width="58" height="5" rx="2.5" fill="#7CCBFF" fillOpacity="0.8" />
          <rect x="20" y="127" width="44" height="5" rx="2.5" fill="#3B5A85" />
        </g>
        <g className="real-vignette" style={{ animationDelay: "1.5s" }}>
          <rect x="12" y="150" width="88" height="34" rx="9" fill="#17304F" />
          <circle className="pulse" cx="26" cy="167" r="5" fill="#2BD47D" />
          <rect x="37" y="164" width="46" height="5" rx="2.5" fill="#3B5A85" />
        </g>
      </Carte>
    </>
  );
}

// Blog : deux articles qui flottent sur l'orbite, le texte du premier plan qui s'écrit, et des points
// qui gravitent autour (fixes si l'on limite les animations)
function Blog({ id }: { id: string }) {
  const rx = 190;
  const ry = 62;
  const orbite = `M ${CX + rx} ${CY} A ${rx} ${ry} 0 1 1 ${CX - rx} ${CY} A ${rx} ${ry} 0 1 1 ${CX + rx} ${CY}`;
  const points = [
    { r: 5, couleur: "#2BD47D", depart: 0 },
    { r: 4, couleur: "#7CCBFF", depart: -7 },
    { r: 3.5, couleur: "#00B4D8", depart: -14 },
  ];
  return (
    <>
      <Fond id={id} rx={rx} ry={ry} planete={0} />
      {/* Points en orbite, derrière les articles */}
      <g transform={`rotate(-14 ${CX} ${CY})`}>
        <g className="orbite-mobile">
          {points.map((p, k) => (
            <circle key={k} r={p.r} fill={p.couleur}>
              <animateMotion dur="21s" begin={`${p.depart}s`} repeatCount="indefinite" path={orbite} />
            </circle>
          ))}
        </g>
        <g className="orbite-fixe">
          {points.map((p, k) => {
            const a = (k / points.length) * Math.PI * 2 + 0.4;
            return <circle key={k} cx={CX + Math.cos(a) * rx} cy={CY + Math.sin(a) * ry} r={p.r} fill={p.couleur} />;
          })}
        </g>
      </g>
      {[
        { x: 66, y: 44, a: -6, retard: 0 },
        { x: 150, y: 70, a: 3, retard: 0.7 },
      ].map((c, i) => (
        <g key={i} transform={`rotate(${c.a} ${c.x + 110} ${c.y + 90})`}>
          <Carte id={id} x={c.x} y={c.y} l={220} h={180} retard={c.retard}>
            <rect x="14" y="14" width="192" height="82" rx="9" fill={i ? `url(#${id}-visuel)` : "#17304F"} fillOpacity={i ? 0.88 : 1} />
            <rect x="14" y="108" width="54" height="16" rx="8" fill="#00B4D8" fillOpacity="0.18" />
            <rect x="22" y="113" width="38" height="6" rx="3" fill="#00B4D8" />
            {i ? (
              <>
                {/* L'article du premier plan s'écrit, ligne après ligne */}
                <rect className="m2-ligne" x="14" y="134" width="170" height="8" rx="4" fill="#C3D0DD" fillOpacity="0.75" />
                <rect className="m2-ligne" style={{ animationDelay: "0.35s" }} x="14" y="150" width="132" height="6" rx="3" fill="#3B5A85" />
                <rect className="m2-ligne" style={{ animationDelay: "0.7s" }} x="14" y="162" width="96" height="6" rx="3" fill="#2A4366" />
                <rect className="m2-caret" x="114" y="160" width="2" height="10" rx="1" fill="#FFFFFF" />
              </>
            ) : (
              <>
                <rect x="14" y="134" width="170" height="8" rx="4" fill="#C3D0DD" fillOpacity="0.75" />
                <rect x="14" y="150" width="132" height="6" rx="3" fill="#3B5A85" />
                <rect x="14" y="162" width="96" height="6" rx="3" fill="#2A4366" />
              </>
            )}
          </Carte>
        </g>
      ))}
    </>
  );
}

function Contact({ id }: { id: string }) {
  const trajet = "M 40 250 C 120 250, 150 170, 230 160 S 330 120, 372 70";
  return (
    <>
      <Fond id={id} rx={190} ry={64} planete={0} />
      <path d={trajet} stroke="#7CCBFF" strokeOpacity="0.55" strokeWidth="1.8" strokeDasharray="2 7" strokeLinecap="round" />
      <Carte id={id} x={36} y={118} l={190} h={92} r={18}>
        <rect x="16" y="18" width="120" height="8" rx="4" fill="#C3D0DD" fillOpacity="0.8" />
        <rect x="16" y="34" width="150" height="6" rx="3" fill="#3B5A85" />
        <rect x="16" y="46" width="104" height="6" rx="3" fill="#3B5A85" />
        <rect x="122" y="62" width="54" height="18" rx="9" fill="#1F5EFF" />
      </Carte>
      <g className="flotte" style={{ animationDelay: "0.8s" }}>
        <g transform="translate(340 46) rotate(-18)">
          <path d="M0 22 L60 0 L42 52 L30 34 Z" fill={`url(#${id}-visuel)`} />
          <path d="M30 34 L60 0 L22 28 Z" fill="#FFFFFF" fillOpacity="0.35" />
        </g>
      </g>
      <g className="orbite-satellite">
        <circle r="4.5" fill="#2BD47D" />
        <animateMotion dur="7s" repeatCount="indefinite" path={trajet} />
      </g>
    </>
  );
}

// FAQ : une question posée, le studio qui « écrit » (trois points) puis la réponse qui s'affiche, en boucle ;
// des points gravitent derrière les bulles (tout est fixe si l'on limite les animations)
function Faq({ id }: { id: string }) {
  const rx = 190;
  const ry = 64;
  const orbite = `M ${CX + rx} ${CY} A ${rx} ${ry} 0 1 1 ${CX - rx} ${CY} A ${rx} ${ry} 0 1 1 ${CX + rx} ${CY}`;
  const points = [
    { r: 5, couleur: "#2BD47D", depart: 0 },
    { r: 4, couleur: "#7CCBFF", depart: -9 },
  ];
  return (
    <>
      <Fond id={id} rx={rx} ry={ry} planete={0} />
      <g transform={`rotate(-14 ${CX} ${CY})`}>
        <g className="orbite-mobile">
          {points.map((p, k) => (
            <circle key={k} r={p.r} fill={p.couleur}>
              <animateMotion dur="18s" begin={`${p.depart}s`} repeatCount="indefinite" path={orbite} />
            </circle>
          ))}
        </g>
        <g className="orbite-fixe">
          {points.map((p, k) => (
            <circle key={k} cx={CX + Math.cos(k * 3 + 0.5) * rx} cy={CY + Math.sin(k * 3 + 0.5) * ry} r={p.r} fill={p.couleur} />
          ))}
        </g>
      </g>
      <Carte id={id} x={62} y={48} l={170} h={112} r={20}>
        <g className="pulse">
          <circle cx="44" cy="56" r="26" fill={`url(#${id}-visuel)`} />
        </g>
        <text
          x="44"
          y="66"
          textAnchor="middle"
          fontSize="30"
          fontWeight="600"
          fill="#FFFFFF"
          style={{ fontFamily: "var(--font-sora), sans-serif" }}
        >
          ?
        </text>
        <rect x="82" y="40" width="70" height="8" rx="4" fill="#C3D0DD" fillOpacity="0.8" />
        <rect x="82" y="56" width="56" height="6" rx="3" fill="#3B5A85" />
        <rect x="82" y="68" width="44" height="6" rx="3" fill="#3B5A85" />
        <path d="M40 112 L34 128 L56 112 Z" fill="#10233F" />
      </Carte>
      <Carte id={id} x={190} y={150} l={196} h={110} r={20} retard={0.9}>
        {/* Le studio écrit… */}
        <g className="faqh-points">
          {[78, 98, 118].map((cx, k) => (
            <circle key={cx} className="c-saute" style={{ animationDelay: `${k * 0.15}s` }} cx={cx} cy="55" r="6" fill="#7CCBFF" />
          ))}
        </g>
        {/* … puis la réponse s'affiche */}
        <g className="faqh-reponse">
          <circle cx="28" cy="30" r="11" fill="#2BD47D" fillOpacity="0.2" />
          <path d="M22.5 30.5l3.8 3.8 7.2-7.4" stroke="#2BD47D" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="48" y="24" width="120" height="8" rx="4" fill="#C3D0DD" fillOpacity="0.8" />
          <rect x="20" y="54" width="156" height="6" rx="3" fill="#3B5A85" />
          <rect x="20" y="66" width="140" height="6" rx="3" fill="#3B5A85" />
          <rect x="20" y="78" width="98" height="6" rx="3" fill="#2A4366" />
        </g>
        <path d="M160 110 L170 126 L144 110 Z" fill="#10233F" />
      </Carte>
    </>
  );
}

// prefixe : à changer quand la même illustration apparaît deux fois sur une page (menu mobile), pour des id uniques
export default function IllustrationEntete({ variante, className = "", prefixe = "ie" }: { variante: VarianteEntete; className?: string; prefixe?: string }) {
  const id = `${prefixe}-${variante}`;
  return (
    <svg viewBox="0 0 440 320" className={className} aria-hidden="true" focusable="false" fill="none">
      <Defs id={id} />
      {variante === "capacites" && <Capacites id={id} />}
      {variante === "methode" && <Methode id={id} />}
      {variante === "apropos" && <APropos id={id} />}
      {variante === "realisations" && <Realisations id={id} />}
      {variante === "blog" && <Blog id={id} />}
      {variante === "contact" && <Contact id={id} />}
      {variante === "faq" && <Faq id={id} />}
    </svg>
  );
}
