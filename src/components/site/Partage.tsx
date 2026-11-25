"use client";

import { useState, useSyncExternalStore } from "react";

const rien = () => () => {};

// Boutons de partage d'un article : liens directs vers chaque réseau (aucun script tiers,
// aucun pistage), copie du lien, et partage natif du téléphone quand il existe.

const style =
  "inline-flex items-center gap-2 rounded-full border border-[#CBD5E1] px-4 py-2 text-[15px] font-medium text-nuit transition-colors hover:border-nuit";

export default function Partage({ url, titre }: { url: string; titre: string }) {
  const [copie, setCopie] = useState(false);
  // Partage natif (surtout sur téléphone) : détecté côté navigateur uniquement
  const natif = useSyncExternalStore(
    rien,
    () => typeof navigator.share === "function",
    () => false,
  );

  const u = encodeURIComponent(url);
  const t = encodeURIComponent(titre);
  const reseaux = [
    { nom: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { nom: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { nom: "X", href: `https://x.com/intent/post?url=${u}&text=${t}` },
    { nom: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${titre} ${url}`)}` },
  ];

  async function copier() {
    try {
      await navigator.clipboard.writeText(url);
      setCopie(true);
      setTimeout(() => setCopie(false), 2500);
    } catch {
      window.prompt("Copiez ce lien :", url);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-semibold text-nuit">Partager cet article</p>
      <ul className="flex flex-wrap gap-2.5">
        {natif && (
          <li>
            <button type="button" className={`${style} border-bleu bg-bleu text-white hover:bg-[#3A72FF]`} onClick={() => navigator.share({ title: titre, url }).catch(() => {})}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3v12M7.5 7.5L12 3l4.5 4.5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
              </svg>
              Partager
            </button>
          </li>
        )}
        {reseaux.map((r) => (
          <li key={r.nom}>
            <a href={r.href} target="_blank" rel="noopener noreferrer" className={style}>
              {r.nom}
              <span className="sr-only">(nouvel onglet)</span>
            </a>
          </li>
        ))}
        <li>
          <a href={`mailto:?subject=${t}&body=${encodeURIComponent(`${titre}\n\n${url}`)}`} className={style}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2.5" />
              <path d="M3.5 6.5l8.5 6.5 8.5-6.5" />
            </svg>
            E-mail
          </a>
        </li>
        <li>
          <button type="button" onClick={copier} className={style} aria-live="polite">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1" />
              <path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1" />
            </svg>
            {copie ? "Lien copié" : "Copier le lien"}
          </button>
        </li>
      </ul>
    </div>
  );
}
