import Image from "next/image";

// Photos d'illustration (studio et clients) et petites cartes d'interface qui flottent par-dessus,
// dans le style du site : la photo apporte l'humain, la carte la touche « tech ».

export type Photo = { src: string; alt: string };

export function PhotoCadre({
  photo,
  sizes,
  className = "",
  children,
}: {
  photo: Photo;
  sizes: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <figure className={`relative ${className}`}>
      <div className="absolute inset-0 overflow-hidden rounded-3xl bg-[#DCE3EC] shadow-[0_34px_70px_-40px_rgba(10,26,47,0.55)]">
        <Image src={photo.src} alt={photo.alt} fill sizes={sizes} className="object-cover" />
      </div>
      {children}
    </figure>
  );
}

const ICONES = {
  calendrier: (
    <>
      <rect x="4" y="5.5" width="16" height="14.5" rx="2.5" />
      <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
      <path d="M9.5 14.5l1.8 1.8 3.4-3.5" />
    </>
  ),
  devis: (
    <>
      <path d="M7 3.5h7l4.5 4.5v12.5H7z" />
      <path d="M14 3.5V8h4.5M10 12h5.5M10 15.5h5.5" />
    </>
  ),
  coche: <path d="M5.5 12.5l4.2 4.2L18.5 8" />,
  appareils: (
    <>
      <rect x="3" y="4.5" width="13" height="10" rx="1.8" />
      <path d="M7 18.5h5M9.5 14.5v4" />
      <rect x="16" y="9" width="5.5" height="10" rx="1.4" />
    </>
  ),
};

export type NomIconeCarte = keyof typeof ICONES;

// Carte décorative (aria-hidden) : son contenu illustre la scène, ce n'est pas une information réelle
export function CarteFlottante({
  icone,
  titre,
  detail,
  className = "",
  retard = 0,
}: {
  icone: NomIconeCarte;
  titre: string;
  detail: string;
  className?: string;
  retard?: number;
}) {
  return (
    <div aria-hidden="true" className={`absolute ${className}`}>
      <div
        className="flotte flex items-center gap-3 rounded-2xl bg-white/95 py-3 pl-3 pr-5 shadow-[0_22px_44px_-20px_rgba(10,26,47,0.5)] ring-1 ring-[#E3E9F0] backdrop-blur"
        style={{ animationDelay: `${retard}s` }}
      >
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#1F5EFF,#00B4D8)] text-white">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {ICONES[icone]}
          </svg>
        </span>
        <span className="whitespace-nowrap">
          <span className="block text-sm font-semibold text-nuit">{titre}</span>
          <span className="block text-[13px] text-[#4A6178]">{detail}</span>
        </span>
      </div>
    </div>
  );
}
