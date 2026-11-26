import PlaneteReseau from "@/components/site/PlaneteReseau";
import { IA } from "@/lib/contenu";

// Les IA intégrées, en étiquettes qui tournent lentement autour du globe réseau (textes toujours droits).
// Rotation coupée si l'utilisateur limite les animations (règles .ia- dans animations.css).
export default function OrbiteIA() {
  const n = IA.modeles.length;
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[480px]">
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false" fill="none">
        <defs>
          <radialGradient id="ia-lueur" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#1F5EFF" stopOpacity="0.45" />
            <stop offset="1" stopColor="#1F5EFF" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ia-anneau" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1F5EFF" stopOpacity="0.25" />
            <stop offset="0.6" stopColor="#00B4D8" stopOpacity="0.8" />
            <stop offset="1" stopColor="#2BD47D" />
          </linearGradient>
        </defs>
        <circle cx="200" cy="200" r="190" fill="url(#ia-lueur)" />
        <circle cx="200" cy="200" r="160" stroke="url(#ia-anneau)" strokeWidth="1.6" />
        <circle cx="200" cy="200" r="112" stroke="#1F5EFF" strokeOpacity="0.28" strokeDasharray="2 6" />
        <PlaneteReseau cx={200} cy={200} r={70} points={20} prefixe="ia-globe" />
      </svg>
      <ul className="ia-orbite absolute inset-0 [container-type:size]" aria-label={IA.titre}>
        {IA.modeles.map((m, i) => (
          <li
            key={m.nom}
            className="absolute left-1/2 top-1/2 h-0 w-0"
            style={{ transform: `rotate(${(i / n) * 360 - 90}deg) translateX(40cqw) rotate(${90 - (i / n) * 360}deg)` }}
          >
            <span className="ia-contre absolute left-0 top-0 block">
              <span className="block -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-2xl bg-white/[0.08] px-4 py-2.5 text-center shadow-[0_18px_40px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/20 backdrop-blur">
                <span className="block text-[17px] font-semibold text-white">{m.nom}</span>
                <span className="block text-[12px] text-[#93A6BB]">{m.editeur}</span>
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
