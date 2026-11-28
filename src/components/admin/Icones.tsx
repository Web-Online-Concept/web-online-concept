// Pictogrammes du back-office : traits de 1,8 px sur une grille de 24, couleur héritée du texte.

const TRACES = {
  tableau: (
    <>
      <rect x="3.5" y="3.5" width="7" height="8.5" rx="2" />
      <rect x="13.5" y="3.5" width="7" height="5" rx="2" />
      <rect x="13.5" y="11.5" width="7" height="9" rx="2" />
      <rect x="3.5" y="15" width="7" height="5.5" rx="2" />
    </>
  ),
  devis: (
    <>
      <path d="M14 3.5H7.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8z" />
      <path d="M14 3.5V8h4.5M9 12.5h6M9 16h4" />
    </>
  ),
  factures: (
    <>
      <path d="M6 3.5h12v17l-3-2-3 2-3-2-3 2z" />
      <path d="M9 8h6M9 11.5h6M9 15h3.5" />
    </>
  ),
  clients: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5" />
      <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M17.8 14.8c1.9.7 3.2 2.4 3.7 5.2" />
    </>
  ),
  urssaf: (
    <>
      <path d="M3 9.5h18L12 4z" />
      <path d="M5.5 9.5v8M10 9.5v8M14 9.5v8M18.5 9.5v8M3 20.5h18" />
    </>
  ),
  exports: (
    <>
      <path d="M12 3.5v11M7.5 10 12 14.5 16.5 10" />
      <path d="M4 14.5v3.5a2.5 2.5 0 0 0 2.5 2.5h11a2.5 2.5 0 0 0 2.5-2.5v-3.5" />
    </>
  ),
  messages: (
    <>
      <path d="M3 13.5 5.4 6a2 2 0 0 1 1.9-1.5h9.4A2 2 0 0 1 18.6 6L21 13.5v4.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18z" />
      <path d="M3 13.5h5l1.5 2.5h5l1.5-2.5h5" />
    </>
  ),
  blog: (
    <>
      <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z" />
      <path d="M13.5 6.5l4 4" />
    </>
  ),
  parametres: (
    <>
      <path d="M4 7h9M17 7h3M4 17h4M12 17h8" />
      <circle cx="15" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </>
  ),
  site: (
    <>
      <path d="M14 4h6v6M20 4l-9 9" />
      <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </>
  ),
  sortie: (
    <>
      <path d="M14.5 4h3a2.5 2.5 0 0 1 2.5 2.5v11a2.5 2.5 0 0 1-2.5 2.5h-3" />
      <path d="M10 8l-4 4 4 4M6 12h10" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  autres: (
    <>
      <circle cx="5.5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="18.5" cy="12" r="1.6" />
    </>
  ),
  chevron: <path d="M9.5 6l6 6-6 6" />,
  retour: <path d="M14.5 6l-6 6 6 6" />,
  alerte: (
    <>
      <path d="M12 4 2.8 19.5h18.4z" />
      <path d="M12 10v4M12 16.8v.2" />
    </>
  ),
  horloge: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  coche: <path d="M5 12.5l4.2 4.2L19 7" />,
  recherche: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4.2-4.2" />
    </>
  ),
  traduire: (
    <>
      <path d="M3.5 5.5h9M8 3.5v2M5.5 5.5c.8 3.4 3 5.9 6 7.4M10.5 5.5c-.8 3.4-3 5.9-6 7.4" />
      <path d="M13 20.5l4-9 4 9M14.4 17.5h5.2" />
    </>
  ),
  poubelle: (
    <>
      <path d="M4 7h16M10 11v6M14 11v6" />
      <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
    </>
  ),
  repondre: (
    <>
      <path d="M10 7.5 4 12.5l6 5" />
      <path d="M4 12.5h9a7 7 0 0 1 7 7" />
    </>
  ),
  archive: (
    <>
      <rect x="3" y="4" width="18" height="4.5" rx="1.5" />
      <path d="M4.8 8.5v9.5a2 2 0 0 0 2 2h10.4a2 2 0 0 0 2-2V8.5M10 12.5h4" />
    </>
  ),
  desarchiver: (
    <>
      <rect x="3" y="4" width="18" height="4.5" rx="1.5" />
      <path d="M4.8 8.5v9.5a2 2 0 0 0 2 2h10.4a2 2 0 0 0 2-2V8.5M12 17.5v-5.5M9.5 14.5 12 12l2.5 2.5" />
    </>
  ),
  enveloppe: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M3.8 6.8 12 13l8.2-6.2" />
    </>
  ),
  telephone: (
    <path d="M5.2 4h3.3l1.6 4-2.1 1.4a11 11 0 0 0 6.6 6.6l1.4-2.1 4 1.6v3.3a1.6 1.6 0 0 1-1.7 1.6A16 16 0 0 1 3.6 5.7 1.6 1.6 0 0 1 5.2 4z" />
  ),
  euro: (
    <>
      <path d="M17.5 6.2A7 7 0 1 0 17.5 17.8" />
      <path d="M4.5 10.2h9M4.5 13.8h9" />
    </>
  ),
  calendrier: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  crayon: (
    <>
      <path d="M4 20h16" />
      <path d="M6 16.5V13l9-9 3.5 3.5-9 9z" />
    </>
  ),
  lien: (
    <>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
    </>
  ),
  copie: (
    <>
      <rect x="8.5" y="8.5" width="12" height="12" rx="2.5" />
      <path d="M15.5 8.5V6a2.5 2.5 0 0 0-2.5-2.5H6A2.5 2.5 0 0 0 3.5 6v7A2.5 2.5 0 0 0 6 15.5h2.5" />
    </>
  ),
  fermer: <path d="M6 6l12 12M18 6 6 18" />,
  oeil: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
};

export type NomIcone = keyof typeof TRACES;

export function Icone({ nom, className = "h-5 w-5" }: { nom: NomIcone; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {TRACES[nom]}
    </svg>
  );
}

// Étincelle de l'IA (pleine), reprise du site
export function Etincelle({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M12 2.5l2.4 6.6 6.6 2.4-6.6 2.4L12 20.5l-2.4-6.6L3 11.5l6.6-2.4z" />
    </svg>
  );
}
