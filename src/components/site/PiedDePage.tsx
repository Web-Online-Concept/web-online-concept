import { cacheLife } from "next/cache";
import MesurePied from "@/components/site/MesurePied";
import { LiensLumineux, LogoAnime } from "@/components/site/Survol";

// Année du copyright, recalculée chaque jour
async function Annee() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export default function PiedDePage() {
  return (
    <footer className="border-t border-white/10 bg-nuit text-[#C3D0DD]">
      <MesurePied />
      <div className="mx-auto grid max-w-5xl gap-12 px-5 py-16 text-center sm:px-8 md:grid-cols-3 md:gap-8">
        <div className="flex flex-col items-center gap-4">
          <LogoAnime className="h-11" />
          <p className="max-w-xs text-[15px] leading-relaxed">Studio de développement web depuis 2009.</p>
        </div>

        <nav aria-label="Plan du site" className="flex flex-col items-center gap-2 text-[15px]">
          <span className="mb-1 font-semibold text-white">Le studio</span>
          <LiensLumineux
            liens={[
              { href: "/realisations", libelle: "Réalisations" },
              { href: "/capacites", libelle: "Capacités" },
              { href: "/methode", libelle: "Méthode" },
              { href: "/blog", libelle: "Blog" },
            ]}
          />
        </nav>

        <nav aria-label="Informations" className="flex flex-col items-center gap-2 text-[15px]">
          <span className="mb-1 font-semibold text-white">Informations</span>
          <LiensLumineux
            liens={[
              { href: "/a-propos", libelle: "À propos" },
              { href: "/faq", libelle: "FAQ" },
              { href: "/mentions-legales", libelle: "Mentions légales" },
              { href: "/confidentialite", libelle: "Confidentialité" },
              { href: "/contact", libelle: "Contact" },
            ]}
          />
        </nav>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-5 py-6 text-center text-sm text-[#93A6BB] sm:px-8">
          © <Annee /> Web Online Concept. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
