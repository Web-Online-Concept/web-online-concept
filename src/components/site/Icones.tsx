// Pictogrammes au trait des capacités (24 × 24, couleur héritée).

export type NomIcone = "site" | "app" | "abonnement" | "ia" | "donnees" | "securite";

const TRACES: Record<NomIcone, React.ReactNode> = {
  site: (
    <>
      <rect x="2.75" y="4" width="18.5" height="16" rx="2.5" />
      <path d="M2.75 8.75h18.5" />
      <path d="M6 6.4h.01M8.4 6.4h.01" />
      <path d="M6.5 12.5h6M6.5 15.5h4" />
      <rect x="15" y="12" width="3.25" height="4.5" rx=".8" />
    </>
  ),
  app: (
    <>
      <rect x="6.75" y="2.5" width="10.5" height="19" rx="2.6" />
      <path d="M10.75 5h2.5" />
      <path d="M9.5 10h5M9.5 13h3.5" />
      <path d="M11 18.5h2" />
    </>
  ),
  abonnement: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" />
      <path d="M2.5 9.75h19" />
      <path d="M6 14.5h4" />
      <path d="M16.2 13.2a1.9 1.9 0 1 1-.6 1.9" />
      <path d="M15.4 12.5v1.5h1.5" />
    </>
  ),
  ia: (
    <>
      <path d="M11 3.5l1.85 4.9 4.9 1.85-4.9 1.85L11 17l-1.85-4.9-4.9-1.85 4.9-1.85z" />
      <path d="M18.5 14.5l.75 1.95 1.95.75-1.95.75-.75 1.95-.75-1.95-1.95-.75 1.95-.75z" />
    </>
  ),
  donnees: (
    <>
      <ellipse cx="12" cy="5.75" rx="7.25" ry="2.75" />
      <path d="M4.75 5.75v12.5c0 1.5 3.25 2.75 7.25 2.75s7.25-1.25 7.25-2.75V5.75" />
      <path d="M4.75 12c0 1.5 3.25 2.75 7.25 2.75s7.25-1.25 7.25-2.75" />
    </>
  ),
  securite: (
    <>
      <path d="M12 2.75l7.25 3v5.1c0 4.6-3.05 8.4-7.25 10.4-4.2-2-7.25-5.8-7.25-10.4v-5.1z" />
      <path d="M8.75 12.1l2.2 2.2 4.3-4.4" />
    </>
  ),
};

export function Icone({ nom, className = "h-6 w-6" }: { nom: NomIcone; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {TRACES[nom]}
    </svg>
  );
}

// Pastille d'icône aux couleurs de la marque
export function PastilleIcone({ nom, sombre = false }: { nom: NomIcone; sombre?: boolean }) {
  return (
    <span
      className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
        sombre ? "bg-white/8 text-[#7CCBFF] ring-1 ring-white/12" : "bg-[#E8EFFF] text-bleu"
      }`}
    >
      <Icone nom={nom} className="h-6 w-6" />
    </span>
  );
}
