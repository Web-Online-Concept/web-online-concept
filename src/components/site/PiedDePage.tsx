import { cacheLife } from "next/cache";
import { LiensLumineux, LogoAnime } from "@/components/site/Survol";
import { NAVIGATION } from "@/lib/contenu";

// Année du copyright, recalculée chaque jour
async function Annee() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export default function PiedDePage() {
  return (
    <footer className="border-t border-white/10 bg-nuit text-[#C3D0DD]">
      <div className="mx-auto grid max-w-5xl gap-12 px-5 py-16 text-center sm:px-8 md:grid-cols-3 md:gap-8">
        <div className="flex flex-col items-center gap-4">
          <LogoAnime className="h-11" />
          <p className="max-w-xs text-[15px] leading-relaxed">Studio de développement web à Toulouse depuis 2009.</p>
        </div>

        <nav aria-label="Plan du site" className="flex flex-col items-center gap-2 text-[15px]">
          <span className="mb-1 font-semibold text-white">Le studio</span>
          <LiensLumineux liens={NAVIGATION} />
        </nav>

        <nav aria-label="Informations légales" className="flex flex-col items-center gap-2 text-[15px]">
          <span className="mb-1 font-semibold text-white">Informations</span>
          <LiensLumineux
            liens={[
              { href: "/mentions-legales", libelle: "Mentions légales" },
              { href: "/confidentialite", libelle: "Confidentialité" },
            ]}
          />
        </nav>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-5 py-6 text-center text-sm text-[#93A6BB] sm:px-8">
          © <Annee /> Web Online Concept, Toulouse. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
