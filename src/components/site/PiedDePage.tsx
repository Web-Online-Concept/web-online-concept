import { cacheLife } from "next/cache";
import MesurePied from "@/components/site/MesurePied";
import { LiensLumineux, LogoAnime } from "@/components/site/Survol";
import { SITE } from "@/lib/contenu";
import { chemin } from "@/lib/i18n/chemins";
import { langue, t } from "@/lib/i18n/langue";

// Année du copyright, recalculée chaque jour
async function Annee() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

const TEXTES = {
  fr: {
    accroche: "Studio de développement web depuis 2009.",
    x: "Suivez-nous sur X",
    plan: "Plan du site",
    studio: "Le studio",
    infos: "Informations",
    liens: ["Réalisations", "Capacités", "Méthode", "Blog", "À propos", "FAQ", "Mentions légales", "Confidentialité", "Contact"],
    droits: "Tous droits réservés.",
  },
  en: {
    accroche: "Web development studio since 2009.",
    x: "Follow us on X",
    plan: "Site map",
    studio: "The studio",
    infos: "Information",
    liens: ["Work", "Capabilities", "Method", "Blog", "About", "FAQ", "Legal notice", "Privacy", "Contact"],
    droits: "All rights reserved.",
  },
  es: {
    accroche: "Estudio de desarrollo web desde 2009.",
    x: "Síganos en X",
    plan: "Mapa del sitio",
    studio: "El estudio",
    infos: "Información",
    liens: ["Proyectos", "Capacidades", "Método", "Blog", "Nosotros", "FAQ", "Aviso legal", "Privacidad", "Contacto"],
    droits: "Todos los derechos reservados.",
  },
};

const PAGES_STUDIO = ["realisations", "capacites", "methode", "blog"] as const;
const PAGES_INFOS = ["a-propos", "faq", "mentions-legales", "confidentialite", "contact"] as const;

export default async function PiedDePage() {
  const l = await langue();
  const x = t(TEXTES, l);
  const liens = (pages: readonly (typeof PAGES_STUDIO[number] | typeof PAGES_INFOS[number])[], debut: number) =>
    pages.map((p, i) => ({ href: chemin(l, p), libelle: x.liens[debut + i] }));

  return (
    <footer className="border-t border-white/10 bg-nuit text-[#C3D0DD]">
      <MesurePied />
      <div className="mx-auto grid max-w-5xl gap-12 px-5 py-16 text-center sm:px-8 md:grid-cols-3 md:gap-8">
        <div className="flex flex-col items-center gap-4">
          <LogoAnime className="h-11" />
          <p className="max-w-xs text-[15px] leading-relaxed">{x.accroche}</p>
          <a
            href={SITE.x}
            target="_blank"
            rel="noopener"
            className="group inline-flex items-center gap-2.5 rounded-full border border-white/15 py-2 pr-4 pl-2 text-sm transition-colors hover:border-cyan-300/60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
          >
            <span className="grid size-7 place-items-center rounded-full bg-white/10 transition-colors group-hover:bg-white group-hover:text-nuit">
              <span aria-hidden="true" className="text-[13px] font-bold leading-none">X</span>
            </span>
            {x.x}
          </a>
        </div>

        <nav aria-label={x.plan} className="flex flex-col items-center gap-2 text-[15px]">
          <span className="mb-1 font-semibold text-white">{x.studio}</span>
          <LiensLumineux liens={liens(PAGES_STUDIO, 0)} />
        </nav>

        <nav aria-label={x.infos} className="flex flex-col items-center gap-2 text-[15px]">
          <span className="mb-1 font-semibold text-white">{x.infos}</span>
          <LiensLumineux liens={liens(PAGES_INFOS, PAGES_STUDIO.length)} />
        </nav>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-5 py-6 text-center text-sm text-[#93A6BB] sm:px-8">
          © <Annee /> Web Online Concept. {x.droits}
        </p>
      </div>
    </footer>
  );
}
