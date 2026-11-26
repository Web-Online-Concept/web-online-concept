import { CadreTelephone } from "@/components/site/Cadres";
import type { Visuel } from "@/lib/contenu";

// Trois écrans d'une application en éventail sur fond bleu nuit (accueil « Pour qui ? », page À propos).
// Le cadre prend la taille de son parent (position relative et hauteur à fournir).
export default function EventailApplication({ ecrans, sizes = "(min-width: 768px) 170px, 30vw" }: { ecrans: Visuel[]; sizes?: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-3xl bg-nuit shadow-[0_34px_70px_-40px_rgba(10,26,47,0.55)]">
      <div aria-hidden="true" className="absolute -left-16 -top-20 h-72 w-72 rounded-full bg-bleu opacity-40 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-24 -right-10 h-64 w-64 rounded-full bg-vert opacity-20 blur-3xl" />
      {ecrans.slice(0, 3).map((v, k) => (
        <div
          key={v.src}
          className={`absolute top-1/2 ${
            k === 1
              ? "left-1/2 z-10 w-[29%] -translate-x-1/2 -translate-y-1/2"
              : k === 0
                ? "left-[14%] w-[24%] -translate-y-[46%] -rotate-6 opacity-90"
                : "right-[14%] w-[24%] -translate-y-[46%] rotate-6 opacity-90"
          }`}
        >
          <CadreTelephone v={v} petit sizes={sizes} />
        </div>
      ))}
    </div>
  );
}
