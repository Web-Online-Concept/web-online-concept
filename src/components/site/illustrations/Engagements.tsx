// Visuels animés des quatre engagements. SVG clairs (posés sur fond ciel ou blanc), animations CSS
// (classes e1- à e4- dans animations.css), en pause hors de l'écran. Décoratifs.

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 240 180" className="h-full w-full" aria-hidden="true" focusable="false" fill="none">
      {children}
    </svg>
  );
}

function Degrade({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#1F5EFF" />
      <stop offset="0.6" stopColor="#00B4D8" />
      <stop offset="1" stopColor="#2BD47D" />
    </linearGradient>
  );
}

const CURSEUR = "M0 0v15.5l4.1-3.9 2.9 6.9 2.6-1.1-2.9-6.7H12.4z";

function Cle() {
  return (
    <g>
      <circle cx="0" cy="0" r="6.5" stroke="url(#e1-deg)" strokeWidth="3.6" fill="#FFFFFF" />
      <rect x="6" y="-1.8" width="20" height="3.6" rx="1.8" fill="url(#e1-deg)" />
      <rect x="18" y="1" width="3.2" height="5" rx="1" fill="#00B4D8" />
      <rect x="23" y="1" width="3.2" height="6.5" rx="1" fill="#2BD47D" />
    </g>
  );
}

// 1. Tout vous appartient : la clé tourne autour de votre site, vos contenus et vos données
const ORBITE = "M22 98A98 30 0 1 0 218 98A98 30 0 1 0 22 98";

export function VisuelPropriete() {
  return (
    <Svg>
      <defs>
        <Degrade id="e1-deg" />
      </defs>
      <ellipse cx="120" cy="138" rx="50" ry="6" fill="#0A1A2F" fillOpacity="0.07" />
      <path d={ORBITE} stroke="url(#e1-deg)" strokeOpacity="0.55" strokeWidth="1.4" strokeDasharray="2 5" />
      <g className="e-flotte">
        <g transform="rotate(-12 96 92)">
          <rect x="68" y="64" width="56" height="56" rx="12" fill="#FFFFFF" stroke="#DCE3EC" />
          <ellipse cx="96" cy="80" rx="13" ry="4.5" stroke="#1638A8" strokeWidth="2" />
          <path d="M83 80v20c0 2.5 5.8 4.5 13 4.5s13-2 13-4.5V80M83 90c0 2.5 5.8 4.5 13 4.5s13-2 13-4.5" stroke="#1638A8" strokeWidth="2" />
        </g>
        <g transform="rotate(10 146 90)">
          <rect x="118" y="62" width="56" height="56" rx="12" fill="#FFFFFF" stroke="#DCE3EC" />
          <rect x="128" y="74" width="36" height="30" rx="5" fill="#E8EFFF" />
          <path d="M130 101l10-11 7 7 5-5 10 9z" fill="#00B4D8" />
          <circle cx="155" cy="81" r="3.5" fill="#2BD47D" />
        </g>
        <g>
          <rect x="92" y="74" width="56" height="58" rx="12" fill="#FFFFFF" stroke="#DCE3EC" />
          <path d="M104 74h32a12 12 0 0 1 12 12v2H92v-2a12 12 0 0 1 12-12z" fill="url(#e1-deg)" />
          <rect x="102" y="96" width="36" height="5" rx="2.5" fill="#0A1A2F" fillOpacity="0.8" />
          <rect x="102" y="106" width="26" height="4" rx="2" fill="#9AACBF" />
          <rect x="102" y="115" width="32" height="4" rx="2" fill="#9AACBF" />
        </g>
      </g>
      <g className="e-flux">
        <g>
          <animateMotion dur="7s" repeatCount="indefinite" path={ORBITE} />
          <Cle />
        </g>
      </g>
      <g className="e-statique" transform="translate(186 72)">
        <Cle />
      </g>
    </Svg>
  );
}

// 2. Un seul interlocuteur : la même personne vous accompagne à chaque étape
const JALONS = [
  { x: 44, t: "Échange" },
  { x: 96, t: "Création" },
  { x: 148, t: "En ligne" },
  { x: 200, t: "Suivi" },
];

export function VisuelInterlocuteur() {
  return (
    <Svg>
      <defs>
        <Degrade id="e2-deg" />
        <linearGradient id="e2-trait" x1="44" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1F5EFF" />
          <stop offset="0.6" stopColor="#00B4D8" />
          <stop offset="1" stopColor="#2BD47D" />
        </linearGradient>
      </defs>
      <path d="M44 112H200" stroke="#DCE3EC" strokeWidth="4" strokeLinecap="round" />
      <path className="e2-trait" d="M44 112H200" stroke="url(#e2-trait)" strokeWidth="4" strokeLinecap="round" />
      {JALONS.map((j, i) => (
        <g key={j.t}>
          <circle cx={j.x} cy="112" r="7.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <g className={`e2-p${i}`}>
            <circle cx={j.x} cy="112" r="8" fill="url(#e2-deg)" />
            <circle cx={j.x} cy="112" r="2.8" fill="#FFFFFF" />
          </g>
          <text x={j.x} y="138" textAnchor="middle" fontSize="9" fill="#4A6178">
            {j.t}
          </text>
        </g>
      ))}
      <g className="e2-avatar">
        <circle cx="0" cy="0" r="17" fill="#FFFFFF" />
        <circle cx="0" cy="0" r="14" fill="url(#e2-deg)" />
        <circle cx="0" cy="-4" r="4.5" fill="#FFFFFF" />
        <path d="M-7.5 8.5a7.5 6.5 0 0 1 15 0z" fill="#FFFFFF" />
        <path d="M-5 15.5L0 23l5-7.5z" fill="#00B4D8" />
      </g>
    </Svg>
  );
}

// 3. Vous validez avant la mise en ligne : aperçu, clic sur « Valider », le site passe en ligne
export function VisuelValidation() {
  return (
    <Svg>
      <defs>
        <Degrade id="e3-deg" />
      </defs>
      <rect x="30" y="24" width="180" height="138" rx="12" fill="#FFFFFF" stroke="#DCE3EC" />
      {[42, 50, 58].map((cx) => (
        <circle key={cx} cx={cx} cy="34" r="2.4" fill="#CBD5E1" />
      ))}
      <rect x="42" y="44" width="156" height="48" rx="7" fill="url(#e3-deg)" />
      <rect x="52" y="56" width="70" height="6" rx="3" fill="#FFFFFF" fillOpacity="0.95" />
      <rect x="52" y="67" width="48" height="4.5" rx="2.25" fill="#FFFFFF" fillOpacity="0.7" />
      <rect x="52" y="78" width="26" height="8" rx="4" fill="#0A1A2F" />
      {[42, 96, 150].map((x) => (
        <rect key={x} x={x} y="100" width="48" height="22" rx="5" fill="#E8EFFF" />
      ))}
      <path d="M30 130H210" stroke="#E3E9F0" />
      <rect x="42" y="138" width="64" height="16" rx="8" fill="#FFFFFF" stroke="#CBD5E1" />
      <text x="74" y="149" textAnchor="middle" fontSize="8" fill="#4A6178">
        Modifier
      </text>
      <g className="e3-valider">
        <rect x="134" y="138" width="64" height="16" rx="8" fill="url(#e3-deg)" />
        <text x="166" y="149" textAnchor="middle" fontSize="8" fontWeight="600" fill="#FFFFFF">
          Valider
        </text>
      </g>
      <g className="e3-valide">
        <rect x="134" y="138" width="64" height="16" rx="8" fill="#2BD47D" />
        <path d="M148 146l2.6 2.6 4.8-4.9" stroke="#0A1A2F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <text x="172" y="149" textAnchor="middle" fontSize="8" fontWeight="600" fill="#0A1A2F">
          Validé
        </text>
      </g>
      <g className="e3-enligne">
        <rect x="150" y="10" width="74" height="22" rx="11" fill="#0A1A2F" />
        <circle className="e-respire" cx="164" cy="21" r="4" fill="#2BD47D" />
        <text x="173" y="24.3" fontSize="9" fontWeight="600" fill="#FFFFFF">
          En ligne
        </text>
      </g>
      <g className="e3-curseur">
        <path d={CURSEUR} fill="#0A1A2F" stroke="#FFFFFF" strokeWidth="1" strokeLinejoin="round" />
      </g>
    </Svg>
  );
}

// 4. Une prise en main accompagnée : la bulle guide, vous modifiez, c'est enregistré
export function VisuelPriseEnMain() {
  return (
    <Svg>
      <defs>
        <Degrade id="e4-deg" />
      </defs>
      <rect x="30" y="34" width="180" height="116" rx="12" fill="#FFFFFF" stroke="#DCE3EC" />
      <rect x="44" y="50" width="72" height="8" rx="4" fill="#0A1A2F" fillOpacity="0.85" />
      <rect x="176" y="44" width="22" height="22" rx="7" fill="#E8EFFF" />
      <rect className="e4-crayon" x="176" y="44" width="22" height="22" rx="7" fill="url(#e4-deg)" />
      <path className="e4-icone" d="M183 59l1-4 8-8 3 3-8 8z" stroke="#1F5EFF" strokeWidth="1.6" strokeLinejoin="round" />
      <rect x="44" y="78" width="132" height="7" rx="3.5" fill="#CBD5E1" />
      <rect className="e4-ancien" x="44" y="94" width="104" height="7" rx="3.5" fill="#CBD5E1" />
      <rect className="e4-nouveau" x="44" y="94" width="122" height="7" rx="3.5" fill="url(#e4-deg)" />
      <rect x="44" y="110" width="88" height="7" rx="3.5" fill="#CBD5E1" />
      <rect x="44" y="126" width="112" height="7" rx="3.5" fill="#CBD5E1" />
      <g className="e4-bulle">
        <rect x="76" y="4" width="114" height="24" rx="9" fill="#0A1A2F" />
        <path d="M178 27l8 0-2 8z" fill="#0A1A2F" />
        <text x="88" y="20" fontSize="9" fill="#FFFFFF">
          Modifiez ce texte ici
        </text>
      </g>
      <g className="e4-toast">
        <rect x="70" y="156" width="100" height="22" rx="11" fill="#E3F8EC" stroke="#2BD47D" />
        <circle cx="86" cy="167" r="6" fill="#2BD47D" />
        <path d="M83.4 167l1.9 1.9 3.4-3.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="97" y="170.5" fontSize="9" fontWeight="600" fill="#0E7A45">
          Enregistré
        </text>
      </g>
      <g className="e4-curseur">
        <path d={CURSEUR} fill="#0A1A2F" stroke="#FFFFFF" strokeWidth="1" strokeLinejoin="round" />
      </g>
    </Svg>
  );
}

export const VISUELS_ENGAGEMENTS = [VisuelPropriete, VisuelInterlocuteur, VisuelValidation, VisuelPriseEnMain];
