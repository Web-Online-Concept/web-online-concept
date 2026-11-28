// Scènes animées des huit capacités (bloc « Tout ce qu'un projet web exige » de l'accueil).
// SVG + CSS (classes c- dans animations.css). Chaque scène rejoue son entrée quand elle devient active ;
// elle est décorative (aria-hidden), le texte de la capacité est dans la liste à côté.

import type { NomIcone } from "@/components/site/Icones";

import { langue, t } from "@/lib/i18n/langue";

// Textes des maquettes animées (courts : ils doivent tenir dans les cadres dessinés)
const TEXTES = {
  fr: {
    site: ["Design unique", "Rapide sur mobile", "Bien référencé"],
    code: "Une seule base de code",
    stores: "Publiée sur les stores",
    abonnement: "Abonnement activé",
    question: "Où est mon contrat d'assurance ?",
    fichier: "contrat-habitation.pdf",
    lecture: "Lecture auto",
    recherche: "plombier bordeaux",
    domaine: "votre-site.fr",
    reponse: "Réponse IA",
    source: "Source citée",
    hausse: "+32 %",
    reservations: "Réservations",
    nouvelle: "Nouvelle réservation",
    ancien: "Ancien site",
    nouveau: "Nouveau site",
    evolution: ["Référencement conservé", "Mises à jour suivies"],
    performance: "Performance",
    protections: ["Connexion sécurisée", "Sauvegardes", "Conforme RGPD"],
  },
  en: {
    site: ["Unique design", "Fast on mobile", "Easy to find"],
    code: "One single codebase",
    stores: "Published on the stores",
    abonnement: "Subscription active",
    question: "Where is my insurance policy?",
    fichier: "home-insurance.pdf",
    lecture: "Auto-read",
    recherche: "plumber near me",
    domaine: "your-site.com",
    reponse: "AI answer",
    source: "Cited source",
    hausse: "+32%",
    reservations: "Bookings",
    nouvelle: "New booking",
    ancien: "Old site",
    nouveau: "New site",
    evolution: ["Rankings preserved", "Ongoing updates"],
    performance: "Performance",
    protections: ["Secure sign-in", "Backups", "GDPR compliant"],
  },
  es: {
    site: ["Diseño único", "Rápido en móvil", "SEO optimizado"],
    code: "Un solo código base",
    stores: "Publicada en las tiendas",
    abonnement: "Suscripción activa",
    question: "¿Dónde está mi seguro de hogar?",
    fichier: "seguro-hogar.pdf",
    lecture: "Lectura auto",
    recherche: "fontanero madrid",
    domaine: "su-sitio.es",
    reponse: "Respuesta IA",
    source: "Fuente citada",
    hausse: "+32 %",
    reservations: "Reservas",
    nouvelle: "Nueva reserva",
    ancien: "Sitio antiguo",
    nouveau: "Sitio nuevo",
    evolution: ["Posicionamiento intacto", "Actualizaciones al día"],
    performance: "Rendimiento",
    protections: ["Acceso seguro", "Copias de seguridad", "Conforme al RGPD"],
  },
};

async function textes() {
  const l = await langue();
  return { ...t(TEXTES, l), langue: l.toUpperCase() };
}

const BORD = "#24476F";
const CARTE = "#10233F";

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 480 330" className="h-full w-full" aria-hidden="true" focusable="false" fill="none">
      {children}
    </svg>
  );
}

// Dégradé de la marque (identifiant unique par scène)
function Degrade({ id, vertical = false }: { id: string; vertical?: boolean }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2={vertical ? "0" : "1"} y2="1">
      <stop offset="0" stopColor="#1F5EFF" />
      <stop offset="0.6" stopColor="#00B4D8" />
      <stop offset="1" stopColor="#2BD47D" />
    </linearGradient>
  );
}

const retard = (s: number) => ({ animationDelay: `${s}s` });

function Fenetre({ x, y, l, h, rayon = 12 }: { x: number; y: number; l: number; h: number; rayon?: number }) {
  return (
    <>
      <rect x={x} y={y} width={l} height={h} rx={rayon} fill={CARTE} stroke={BORD} />
      {[12, 20, 28].map((d) => (
        <circle key={d} cx={x + d} cy={y + 11} r="2.4" fill="#3B5A85" />
      ))}
    </>
  );
}

function Coche({ cx, cy, r = 8 }: { cx: number; cy: number; r?: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill="#2BD47D" />
      <path
        d={`M${cx - r * 0.45} ${cy}l${r * 0.32} ${r * 0.32} ${r * 0.6}-${r * 0.62}`}
        stroke="#0A1A2F"
        strokeWidth={r * 0.26}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
}

// Pastille de texte avec coche
function Puce({ x, y, l, texte, d }: { x: number; y: number; l: number; texte: string; d: number }) {
  return (
    <g className="c-pop" style={retard(d)}>
      <rect x={x} y={y} width={l} height="26" rx="13" fill="#FFFFFF" fillOpacity="0.06" stroke="#FFFFFF" strokeOpacity="0.14" />
      <Coche cx={x + 15} cy={y + 13} r={7} />
      <text x={x + 29} y={y + 17} fontSize="10.5" fill="#E6EDF5">
        {texte}
      </text>
    </g>
  );
}

function Etincelle({ cx, cy, t = 1, couleur = "#FFFFFF" }: { cx: number; cy: number; t?: number; couleur?: string }) {
  const k = 6 * t;
  const m = 1.7 * t;
  return <path d={`M${cx} ${cy - k}l${m} ${k - m} ${k - m} ${m}-${k - m} ${m}L${cx} ${cy + k}l-${m}-${k - m}-${k - m}-${m} ${k - m}-${m}z`} fill={couleur} />;
}

// 1. Sites sur mesure : la page se compose, se décline en langues et sur mobile
async function SceneSite() {
  const x = await textes();
  return (
    <Svg>
      <defs>
        <Degrade id="c1-deg" />
      </defs>
      <Fenetre x={40} y={34} l={300} h={234} />
      <rect x="80" y="40" width="118" height="10" rx="5" fill="#1A3358" />
      {["FR", "EN", "ES"].map((l, i) => (
        <g key={l} className="c-pop" style={retard(1.1 + i * 0.12)}>
          <rect x={246 + i * 30} y="38.5" width="26" height="14" rx="7" fill={l === x.langue ? "url(#c1-deg)" : "#1A3358"} />
          <text x={259 + i * 30} y="48.3" textAnchor="middle" fontSize="7.5" fontWeight="600" fill="#FFFFFF">
            {l}
          </text>
        </g>
      ))}
      <g className="c-entre" style={retard(0.1)}>
        <circle cx="62" cy="76" r="6" fill="url(#c1-deg)" />
        {[0, 1, 2, 3].map((k) => (
          <rect key={k} x={222 + k * 28} y="74" width="20" height="4.5" rx="2.25" fill="#3B5A85" />
        ))}
      </g>
      <g className="c-entre" style={retard(0.3)}>
        <rect x="54" y="92" width="272" height="84" rx="9" fill="url(#c1-deg)" />
        <rect x="232" y="104" width="80" height="60" rx="7" fill="#FFFFFF" fillOpacity="0.18" />
        <path d="M240 156l18-20 13 13 9-9 24 16z" fill="#FFFFFF" fillOpacity="0.45" />
        <circle cx="292" cy="118" r="6" fill="#FFFFFF" fillOpacity="0.6" />
      </g>
      <g className="c-entre" style={retard(0.45)}>
        <rect x="70" y="110" width="132" height="9" rx="4.5" fill="#FFFFFF" fillOpacity="0.95" />
        <rect x="70" y="126" width="96" height="6" rx="3" fill="#FFFFFF" fillOpacity="0.65" />
        <rect x="70" y="146" width="52" height="15" rx="7.5" fill="#0A1A2F" />
      </g>
      {[54, 146, 238].map((x, i) => (
        <g key={x} className="c-entre" style={retard(0.6 + i * 0.1)}>
          <rect x={x} y="188" width="88" height="66" rx="8" fill="#17304F" />
          <rect x={x + 8} y="196" width="72" height="28" rx="5" fill="#24476F" />
          <rect x={x + 8} y="232" width="54" height="5" rx="2.5" fill="#3B5A85" />
          <rect x={x + 8} y="242" width="36" height="5" rx="2.5" fill="#2A4366" />
        </g>
      ))}
      <g className="c-glisse-d" style={retard(0.95)}>
        <rect x="360" y="80" width="84" height="168" rx="17" fill={CARTE} stroke={BORD} />
        <rect x="366" y="92" width="72" height="148" rx="11" fill="#0D1E36" />
        <rect x="390" y="85" width="24" height="4" rx="2" fill="#24476F" />
        <rect x="372" y="100" width="60" height="44" rx="6" fill="url(#c1-deg)" />
        <rect x="378" y="110" width="40" height="5" rx="2.5" fill="#FFFFFF" fillOpacity="0.9" />
        <rect x="378" y="120" width="28" height="4" rx="2" fill="#FFFFFF" fillOpacity="0.6" />
        <rect x="372" y="152" width="60" height="38" rx="6" fill="#17304F" />
        <rect x="372" y="196" width="60" height="38" rx="6" fill="#17304F" />
      </g>
      <Puce x={40} y={286} l={118} texte={x.site[0]} d={1.5} />
      <Puce x={168} y={286} l={142} texte={x.site[1]} d={1.65} />
      <Puce x={320} y={286} l={124} texte={x.site[2]} d={1.8} />
    </Svg>
  );
}

// Écran d'application commun aux trois appareils
function EcranApp({ x, y, l, id }: { x: number; y: number; l: number; id: string }) {
  return (
    <>
      <rect x={x} y={y} width={l} height="22" rx="6" fill={`url(#${id})`} />
      <rect x={x + 8} y={y + 8} width={l * 0.45} height="6" rx="3" fill="#FFFFFF" fillOpacity="0.9" />
      {[0, 1, 2, 3].map((k) => (
        <g key={k}>
          <rect x={x} y={y + 30 + k * 26} width={l} height="20" rx="6" fill="#17304F" />
          <circle cx={x + 11} cy={y + 40 + k * 26} r="5" fill={k === 1 ? "#2BD47D" : "#24476F"} />
          <rect x={x + 22} y={y + 36 + k * 26} width={l * 0.5} height="4.5" rx="2.25" fill="#3B5A85" />
          <rect x={x + 22} y={y + 43 + k * 26} width={l * 0.3} height="3.5" rx="1.75" fill="#2A4366" />
        </g>
      ))}
    </>
  );
}

// 2. Applications web et mobiles : une base de code, trois appareils synchronisés
async function SceneApp() {
  const x = await textes();
  const liens = ["M240 52C240 72 138 70 138 94", "M240 52C240 66 303 66 303 84", "M240 52C240 70 401 72 401 94"];
  return (
    <Svg>
      <defs>
        <Degrade id="c2-deg" />
      </defs>
      {liens.map((d, i) => (
        <path key={i} className="c-trace" style={{ ...retard(0.3), ["--duree" as string]: "0.8s" }} d={d} pathLength={1} strokeDasharray="1" stroke="#3B5A85" strokeWidth="1.5" />
      ))}
      <g className="c-pop" style={retard(0.05)}>
        <rect x="146" y="26" width="188" height="28" rx="14" fill="url(#c2-deg)" />
        <path d="M165 35l-6 5 6 5M179 35l6 5-6 5M174.5 33.5l-5 13" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <text x="192" y="44" fontSize="11" fontWeight="600" fill="#FFFFFF">
          {x.code}
        </text>
      </g>
      <g className="c-entre" style={retard(0.55)}>
        <Fenetre x={38} y={94} l={200} h={152} rayon={10} />
        <EcranApp x={50} y={112} l={176} id="c2-deg" />
      </g>
      <g className="c-entre" style={retard(0.7)}>
        <rect x="262" y="84" width="82" height="168" rx="16" fill={CARTE} stroke={BORD} />
        <rect x="288" y="90" width="30" height="7" rx="3.5" fill="#0A1A2F" />
        <EcranApp x={270} y={104} l={66} id="c2-deg" />
      </g>
      <g className="c-entre" style={retard(0.85)}>
        <rect x="362" y="94" width="78" height="158" rx="13" fill={CARTE} stroke={BORD} />
        <circle cx="401" cy="102" r="3" fill="#0A1A2F" />
        <EcranApp x={370} y={110} l={62} id="c2-deg" />
      </g>
      {[
        { x: 138, t: "Web" },
        { x: 303, t: "iPhone" },
        { x: 401, t: "Android" },
      ].map((a) => (
        <text key={a.t} className="c-entre" style={retard(1)} x={a.x} y={a.t === "Web" ? 264 : 270} textAnchor="middle" fontSize="11" fill="#93A6BB">
          {a.t}
        </text>
      ))}
      <g className="c-flux">
        {liens.map((d, i) => (
          <circle key={i} r="3.5" fill="#2BD47D">
            <animateMotion dur="2.2s" begin={`${1.2 + i * 0.35}s`} repeatCount="indefinite" path={d} keyPoints="0;1" keyTimes="0;1" />
          </circle>
        ))}
      </g>
      <Puce x={150} y={290} l={180} texte={x.stores} d={1.35} />
    </Svg>
  );
}

// 3. Plateformes à abonnement : formules, paiement, abonnement activé
async function SceneAbonnement() {
  const x = await textes();
  const formule = (x: number, y: number, h: number, mise: boolean) => (
    <>
      <rect x={x} y={y} width="118" height={h} rx="14" fill={mise ? "#13294A" : CARTE} stroke={mise ? "url(#c3-deg)" : BORD} strokeWidth={mise ? 2 : 1} />
      <rect x={x + 16} y={y + 20} width="52" height="7" rx="3.5" fill="#7CCBFF" />
      <rect x={x + 16} y={y + 38} width="72" height="14" rx="5" fill="#FFFFFF" fillOpacity="0.9" />
      {[0, 1, 2, 3].map((k) => (
        <g key={k}>
          <circle cx={x + 21} cy={y + 72 + k * 16} r="4" fill={mise || k < 2 ? "#2BD47D" : "#24476F"} />
          <rect x={x + 31} y={y + 70 + k * 16} width={58 - k * 6} height="4.5" rx="2.25" fill="#3B5A85" />
        </g>
      ))}
      <rect x={x + 16} y={y + h - 30} width="86" height="16" rx="8" fill={mise ? "url(#c3-deg)" : "#1A3358"} />
    </>
  );
  return (
    <Svg>
      <defs>
        <Degrade id="c3-deg" />
        <linearGradient id="c3-carte" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1F5EFF" />
          <stop offset="1" stopColor="#00B4D8" />
        </linearGradient>
      </defs>
      <g className="c-entre" style={retard(0.1)}>
        {formule(46, 44, 164, false)}
      </g>
      <g className="c-entre" style={retard(0.4)}>
        {formule(316, 44, 164, false)}
      </g>
      <g className="c-pop" style={retard(0.2)}>
        {formule(181, 30, 192, true)}
        <rect x="210" y="20" width="60" height="18" rx="9" fill="url(#c3-deg)" />
        <Etincelle cx={224} cy={29} t={0.75} />
        <rect x="233" y="27" width="28" height="4.5" rx="2.25" fill="#FFFFFF" fillOpacity="0.9" />
      </g>
      <g className="c-glisse-g" style={retard(0.75)}>
        <rect x="88" y="236" width="124" height="76" rx="11" fill="url(#c3-carte)" />
        <rect x="100" y="250" width="20" height="14" rx="3" fill="#FFD27A" fillOpacity="0.9" />
        <rect x="100" y="276" width="84" height="6" rx="3" fill="#FFFFFF" fillOpacity="0.75" />
        <rect x="100" y="290" width="40" height="5" rx="2.5" fill="#FFFFFF" fillOpacity="0.5" />
        <circle cx="188" cy="294" r="8" fill="#FFFFFF" fillOpacity="0.35" />
        <circle cx="198" cy="294" r="8" fill="#FFFFFF" fillOpacity="0.25" />
      </g>
      <path className="c-trace" style={{ ...retard(1.15), ["--duree" as string]: "0.5s" }} d="M222 274H256" pathLength={1} strokeDasharray="1" stroke="#7CCBFF" strokeWidth="2" strokeLinecap="round" />
      <path className="c-pop" style={retard(1.5)} d="M251 268l7 6-7 6" stroke="#7CCBFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <g className="c-pop" style={retard(1.6)}>
        <rect x="268" y="252" width="176" height="44" rx="22" fill="#2BD47D" fillOpacity="0.14" stroke="#2BD47D" />
        <Coche cx={292} cy={274} r={11} />
        <text x="311" y="278.5" fontSize="12" fontWeight="600" fill="#FFFFFF">
          {x.abonnement}
        </text>
      </g>
    </Svg>
  );
}

// 4. IA intégrée : une question en langage naturel, l'IA lit le document et répond
async function SceneIA() {
  const x = await textes();
  return (
    <Svg>
      <defs>
        <Degrade id="c4-deg" />
        <linearGradient id="c4-balai" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#00B4D8" stopOpacity="0" />
          <stop offset="1" stopColor="#00B4D8" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <g className="c-entre" style={retard(0.05)}>
        <rect x="34" y="28" width="264" height="274" rx="16" fill={CARTE} stroke={BORD} />
        <circle cx="60" cy="54" r="13" fill="url(#c4-deg)" />
        <Etincelle cx={60} cy={54} t={1} />
        <rect x="82" y="47" width="72" height="7" rx="3.5" fill="#FFFFFF" fillOpacity="0.9" />
        <rect x="82" y="59" width="46" height="5" rx="2.5" fill="#3B5A85" />
        <path d="M34 80H298" stroke={BORD} />
        <rect x="50" y="258" width="232" height="30" rx="15" fill="#0D1E36" stroke={BORD} />
        <rect x="64" y="270" width="96" height="5" rx="2.5" fill="#3B5A85" />
        <circle cx="266" cy="273" r="10" fill="url(#c4-deg)" />
        <path d="M263.8 268.6a2.2 2.2 0 0 1 4.4 0v4a2.2 2.2 0 0 1-4.4 0z" fill="#FFFFFF" />
        <path d="M261.6 272.4a4.4 4.4 0 0 0 8.8 0M266 276.8v2" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
      </g>
      <g className="c-entre" style={retard(0.3)}>
        <rect x="82" y="94" width="200" height="34" rx="14" fill="#1F5EFF" />
        <text x="96" y="115" fontSize="10.5" fill="#FFFFFF">
          {x.question}
        </text>
      </g>
      <g className="c-bref" style={retard(0.75)}>
        <rect x="50" y="142" width="58" height="28" rx="14" fill="#1A3358" />
        {[66, 79, 92].map((cx, k) => (
          <circle key={cx} className="c-saute" style={retard(k * 0.15)} cx={cx} cy="156" r="3.2" fill="#7CCBFF" />
        ))}
      </g>
      <g className="c-entre" style={retard(1.85)}>
        <rect x="50" y="142" width="232" height="96" rx="14" fill="#1A3358" />
        <Etincelle cx={66} cy={160} t={0.8} couleur="#7CCBFF" />
        <rect x="80" y="156" width="150" height="6" rx="3" fill="#C3D0DD" fillOpacity="0.85" />
        <rect x="80" y="169" width="176" height="6" rx="3" fill="#C3D0DD" fillOpacity="0.6" />
        <rect x="80" y="182" width="112" height="6" rx="3" fill="#C3D0DD" fillOpacity="0.6" />
        <rect x="64" y="200" width="168" height="26" rx="8" fill="#24476F" />
        <path d="M75 205h9l4 4v12H75z" fill="#FFFFFF" fillOpacity="0.9" />
        <text x="96" y="217" fontSize="9.5" fill="#E6EDF5">
          {x.fichier}
        </text>
      </g>
      <g className="c-entre" style={retard(0.35)}>
        <rect x="320" y="52" width="126" height="168" rx="8" fill="#F4F7FB" />
        <rect x="334" y="68" width="62" height="8" rx="4" fill="#0A1A2F" fillOpacity="0.85" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
          <rect key={k} x="334" y={88 + k * 14} width={k % 3 === 2 ? 66 : 96} height="5" rx="2.5" fill="#CBD5E1" />
        ))}
        <rect className="c-pop" style={retard(1.2)} x="330" y="111" width="80" height="13" rx="4" fill="#00B4D8" fillOpacity="0.22" stroke="#00B4D8" />
        <rect className="c-pop" style={retard(1.45)} x="330" y="167" width="104" height="13" rx="4" fill="#00B4D8" fillOpacity="0.22" stroke="#00B4D8" />
        <rect className="c-balaye" x="320" y="52" width="126" height="22" fill="url(#c4-balai)" />
      </g>
      <g className="c-entre" style={retard(1.3)}>
        <rect x="320" y="234" width="126" height="26" rx="13" fill="#FFFFFF" fillOpacity="0.06" stroke="#FFFFFF" strokeOpacity="0.14" />
        <Etincelle cx={336} cy={247} t={0.7} couleur="#7CCBFF" />
        <text x="348" y="251" fontSize="10" fill="#E6EDF5">
          {x.lecture}
        </text>
      </g>
    </Svg>
  );
}

// 5. Référencement et visibilité IA : la recherche, le site qui monte en tête, cité par l'IA
async function SceneVisibilite() {
  const x = await textes();
  const autres = [
    { y: 100, l: 150 },
    { y: 148, l: 128 },
    { y: 196, l: 162 },
  ];
  const resultat = (y: number, l: number) => (
    <>
      <rect x="54" y={y} width={l} height="7" rx="3.5" fill="#7CCBFF" />
      <rect x="54" y={y + 13} width="74" height="5" rx="2.5" fill="#2BD47D" fillOpacity="0.7" />
      <rect x="54" y={y + 24} width="210" height="5" rx="2.5" fill="#3B5A85" />
    </>
  );
  return (
    <Svg>
      <defs>
        <Degrade id="c5-deg" />
      </defs>
      <rect x="34" y="30" width="276" height="268" rx="14" fill={CARTE} stroke={BORD} />
      <rect x="50" y="46" width="244" height="32" rx="16" fill="#F4F7FB" />
      <circle cx="68" cy="61" r="5.5" stroke="#4A6178" strokeWidth="1.8" />
      <path d="M72 65l4 4" stroke="#4A6178" strokeWidth="1.8" strokeLinecap="round" />
      <text x="84" y="66" fontSize="11.5" fill="#0A1A2F">
        {x.recherche}
      </text>
      <rect className="c-tape" style={retard(0.2)} x="82" y="52" width="140" height="20" fill="#F4F7FB" />
      {autres.map((a, i) => (
        <g key={i} className="c-descend" style={{ ...retard(1.5), ["--vers" as string]: "48px" }}>
          <g className="c-entre" style={retard(1 + i * 0.1)}>
            {resultat(a.y, a.l)}
          </g>
        </g>
      ))}
      <g className="c-monte" style={{ ...retard(1.5), ["--de" as string]: "144px" }}>
        <g className="c-entre" style={retard(1.3)}>
          <rect x="44" y="90" width="256" height="44" rx="10" fill="#1F5EFF" fillOpacity="0.16" stroke="url(#c5-deg)" strokeWidth="1.5" />
          <rect x="54" y="100" width="140" height="7" rx="3.5" fill="#FFFFFF" />
          <text x="54" y="118" fontSize="9" fontWeight="600" fill="#2BD47D">
            {x.domaine}
          </text>
          <rect x="54" y="124" width="200" height="5" rx="2.5" fill="#7CCBFF" fillOpacity="0.55" />
        </g>
      </g>
      <g className="c-pop" style={retard(2.35)}>
        <circle cx="282" cy="112" r="11" fill="url(#c5-deg)" />
        <text x="282" y="116.5" textAnchor="middle" fontSize="12" fontWeight="700" fill="#FFFFFF">
          1
        </text>
      </g>
      <g className="c-entre" style={retard(0.6)}>
        <rect x="326" y="62" width="126" height="194" rx="14" fill={CARTE} stroke={BORD} />
        <circle cx="346" cy="84" r="10" fill="url(#c5-deg)" />
        <Etincelle cx={346} cy={84} t={0.8} />
        <text x="362" y="88" fontSize="10.5" fontWeight="600" fill="#FFFFFF">
          {x.reponse}
        </text>
        {[0, 1, 2, 3, 4].map((k) => (
          <rect key={k} x="340" y={108 + k * 14} width={k === 4 ? 56 : 96} height="5" rx="2.5" fill="#3B5A85" />
        ))}
        <text x="340" y="196" fontSize="8.5" fill="#93A6BB">
          {x.source}
        </text>
      </g>
      <g className="c-pop" style={retard(2.55)}>
        <rect x="336" y="206" width="106" height="26" rx="13" fill="#2BD47D" fillOpacity="0.15" stroke="#2BD47D" />
        <circle cx="351" cy="219" r="4" fill="#2BD47D" />
        <text x="361" y="223" fontSize="10" fontWeight="600" fill="#FFFFFF">
          {x.domaine}
        </text>
      </g>
    </Svg>
  );
}

// 6. Données et back-offices : tableau de bord qui se remplit, réservation qui arrive
async function SceneDonnees() {
  const x = await textes();
  const barres = [52, 74, 60, 96, 84, 118, 132];
  return (
    <Svg>
      <defs>
        <Degrade id="c6-deg" />
        <Degrade id="c6-barre" vertical />
      </defs>
      <rect x="30" y="34" width="420" height="268" rx="14" fill={CARTE} stroke={BORD} />
      <path d="M44 34.5H94V301.5H44A13.5 13.5 0 0 1 30.5 288V48A13.5 13.5 0 0 1 44 34.5z" fill="#0D1E36" />
      <circle cx="62" cy="60" r="10" fill="url(#c6-deg)" />
      {[0, 1, 2, 3].map((k) => (
        <rect key={k} x="50" y={96 + k * 22} width="28" height="6" rx="3" fill={k === 0 ? "#7CCBFF" : "#3B5A85"} />
      ))}
      {[
        { x: 110, v: "128", l: 52 },
        { x: 224, v: x.hausse, l: 40 },
        { x: 338, v: "24", l: 60 },
      ].map((k, i) => (
        <g key={k.x} className="c-entre" style={retard(0.1 + i * 0.1)}>
          <rect x={k.x} y="50" width="100" height="58" rx="10" fill="#13294A" />
          <rect x={k.x + 12} y="62" width={k.l} height="5" rx="2.5" fill="#3B5A85" />
          <text x={k.x + 12} y="94" fontSize="20" fontWeight="600" fill={i === 1 ? "#2BD47D" : "#FFFFFF"}>
            {k.v}
          </text>
        </g>
      ))}
      <g className="c-entre" style={retard(0.3)}>
        <rect x="110" y="120" width="214" height="166" rx="10" fill="#13294A" />
        <rect x="124" y="134" width="70" height="6" rx="3" fill="#C3D0DD" fillOpacity="0.8" />
        <path d="M124 270H310" stroke="#24476F" />
      </g>
      {barres.map((h, i) => (
        <rect key={i} className="c-grandit" style={retard(0.45 + i * 0.08)} x={130 + i * 26} y={270 - h} width="14" height={h} rx="4" fill="url(#c6-barre)" />
      ))}
      <g className="c-entre" style={retard(0.35)}>
        <rect x="338" y="120" width="100" height="166" rx="10" fill="#13294A" />
        <text x="350" y="139" fontSize="9" fill="#C3D0DD">
          {x.reservations}
        </text>
      </g>
      {[0, 1, 2, 3].map((k) => (
        <g key={k} className="c-glisse-d" style={retard(0.6 + k * 0.12)}>
          <rect x="348" y={152 + k * 31} width="80" height="23" rx="6" fill="#1A3358" />
          <circle cx="359" cy={163.5 + k * 31} r="4" fill={["#2BD47D", "#00B4D8", "#7CCBFF", "#2BD47D"][k]} />
          <rect x="369" y={158 + k * 31} width="44" height="4.5" rx="2.25" fill="#C3D0DD" fillOpacity="0.7" />
          <rect x="369" y={166 + k * 31} width="28" height="4" rx="2" fill="#3B5A85" />
        </g>
      ))}
      <g className="c-toast" style={retard(1.5)}>
        <rect x="282" y="8" width="180" height="36" rx="18" fill="#FFFFFF" />
        <circle cx="301" cy="26" r="11" fill="url(#c6-deg)" />
        <path d="M297 29h8m-7-1v-4a3 3 0 0 1 6 0v4m-4 3h2" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="318" y="30" fontSize="10.5" fontWeight="600" fill="#0A1A2F">
          {x.nouvelle}
        </text>
      </g>
    </Svg>
  );
}

// 7. Refonte, migration et suivi : de l'ancien site au nouveau, sans rien perdre en route
const MIGRATION = "M208 140C232 98 250 98 272 118";

async function SceneEvolution() {
  const x = await textes();
  return (
    <Svg>
      <defs>
        <Degrade id="c7-deg" />
      </defs>
      <g className="c-eteint" style={retard(2)}>
        <rect x="36" y="72" width="172" height="140" rx="5" fill="#2A3442" stroke="#4A5568" />
        <rect x="46" y="82" width="152" height="24" fill="#4A5568" />
        <rect x="54" y="90" width="60" height="8" fill="#6B7789" />
        <rect x="46" y="112" width="44" height="90" fill="#3A4556" />
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <rect key={k} x="98" y={116 + k * 14} width={k % 2 ? 70 : 96} height="5" fill="#5A6678" />
        ))}
      </g>
      <text x="122" y="232" textAnchor="middle" fontSize="10.5" fill="#93A6BB">
        {x.ancien}
      </text>
      <path className="c-trace" style={{ ...retard(0.4), ["--duree" as string]: "0.7s" }} d={MIGRATION} pathLength={1} strokeDasharray="1" stroke="#3B5A85" strokeWidth="1.5" />
      <g className="c-flux">
        {["#1F5EFF", "#00B4D8", "#2BD47D"].map((c, i) => (
          <rect key={c} x="-3.5" y="-3.5" width="7" height="7" rx="1.8" fill={c}>
            <animateMotion dur="1.5s" begin={`${0.9 + i * 0.45}s`} repeatCount="indefinite" path={MIGRATION} />
          </rect>
        ))}
      </g>
      <g className="c-entre" style={retard(1.1)}>
        <Fenetre x={272} y={50} l={180} h={182} />
        <rect x="286" y="72" width="152" height="66" rx="8" fill="url(#c7-deg)" />
        <rect x="298" y="88" width="80" height="7" rx="3.5" fill="#FFFFFF" fillOpacity="0.95" />
        <rect x="298" y="101" width="56" height="5" rx="2.5" fill="#FFFFFF" fillOpacity="0.65" />
        <rect x="298" y="116" width="34" height="11" rx="5.5" fill="#0A1A2F" />
      </g>
      {[286, 339, 392].map((x, i) => (
        <g key={x} className="c-entre" style={retard(1.3 + i * 0.1)}>
          <rect x={x} y="148" width="46" height="70" rx="6" fill="#17304F" />
          <rect x={x + 6} y="154" width="34" height="26" rx="4" fill="#24476F" />
          <rect x={x + 6} y="188" width="28" height="4.5" rx="2.25" fill="#3B5A85" />
        </g>
      ))}
      <text className="c-entre" style={retard(1.6)} x="362" y="252" textAnchor="middle" fontSize="10.5" fill="#E6EDF5">
        {x.nouveau}
      </text>
      <Puce x={56} y={276} l={176} texte={x.evolution[0]} d={2.1} />
      <Puce x={248} y={276} l={176} texte={x.evolution[1]} d={2.3} />
    </Svg>
  );
}

// 8. Performance et sécurité : jauge à 100, bouclier, protections cochées une à une
async function SceneSecurite() {
  const x = await textes();
  const protections = x.protections;
  return (
    <Svg>
      <defs>
        <Degrade id="c8-deg" />
        <radialGradient id="c8-halo">
          <stop offset="0" stopColor="#2BD47D" stopOpacity="0.28" />
          <stop offset="1" stopColor="#2BD47D" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle className="c-respire" cx="146" cy="160" r="120" fill="url(#c8-halo)" />
      <circle cx="146" cy="160" r="84" stroke="#1A3358" strokeWidth="14" />
      <circle
        className="c-trace"
        style={{ ...retard(0.2), ["--duree" as string]: "1.5s" }}
        cx="146"
        cy="160"
        r="84"
        transform="rotate(-90 146 160)"
        pathLength={1}
        strokeDasharray="1"
        stroke="url(#c8-deg)"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <text className="c-pop" style={retard(1.45)} x="146" y="172" textAnchor="middle" fontSize="42" fontWeight="600" fill="#FFFFFF">
        100
      </text>
      <text className="c-entre" style={retard(1.6)} x="146" y="198" textAnchor="middle" fontSize="11" fill="#93A6BB">
        {x.performance}
      </text>
      <g className="c-pop" style={retard(0.5)}>
        <path d="M360 44l38 14v26c0 23-16 39-38 46-22-7-38-23-38-46V58z" fill="url(#c8-deg)" />
        <rect x="347" y="80" width="26" height="21" rx="4" fill="#FFFFFF" />
        <path d="M352 80v-6a8 8 0 0 1 16 0v6" stroke="#FFFFFF" strokeWidth="3.2" />
        <circle cx="360" cy="89" r="2.6" fill="#1F5EFF" />
      </g>
      {protections.map((p, i) => (
        <g key={p} className="c-entre" style={retard(1 + i * 0.25)}>
          <rect x="282" y={160 + i * 40} width="164" height="30" rx="15" fill="#FFFFFF" fillOpacity="0.05" stroke="#FFFFFF" strokeOpacity="0.12" />
          <g className="c-pop" style={retard(1.15 + i * 0.25)}>
            <Coche cx={299} cy={175 + i * 40} r={8} />
          </g>
          <text x="315" y={179 + i * 40} fontSize="11" fill="#E6EDF5">
            {p}
          </text>
        </g>
      ))}
    </Svg>
  );
}

export const SCENES_CAPACITES: Record<NomIcone, () => Promise<React.JSX.Element>> = {
  site: SceneSite,
  app: SceneApp,
  abonnement: SceneAbonnement,
  ia: SceneIA,
  visibilite: SceneVisibilite,
  donnees: SceneDonnees,
  evolution: SceneEvolution,
  securite: SceneSecurite,
};
