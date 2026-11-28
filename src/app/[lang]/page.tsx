import type { Metadata } from "next";
import Link from "next/link";
import { alternatesLangues, ID_ENTREPRISE, jsonLd, versions } from "@/lib/seo";
import BlocMethode from "@/components/site/BlocMethode";
import DefilementEcrans from "@/components/site/DefilementEcrans";
import SuperpositionMobile from "@/components/site/SuperpositionMobile";
import IntroVideo, { SCRIPT_INTRO } from "@/components/site/IntroVideo";
import EventailApplication from "@/components/site/EventailApplication";
import { CarteFlottante, PhotoCadre } from "@/components/site/Photos";
import CapacitesInteractives from "@/components/site/CapacitesInteractives";
import { SCENES_CAPACITES } from "@/components/site/illustrations/Capacites";
import Constellation from "@/components/site/illustrations/Constellation";
import Vitrine, { type Diapo } from "@/components/site/Vitrine";
import {
  AppelFinal,
  BlocEngagements,
  CarteRealisation,
  Conteneur,
} from "@/components/site/Blocs";
import { SITE } from "@/lib/contenu";
import { contenu, ecransDe, projetsSurMesure, sitesClients } from "@/lib/i18n/contenu";
import { chemin, LANGUES, LOCALES, type Langue } from "@/lib/i18n/chemins";
import { langue, t } from "@/lib/i18n/langue";

export async function generateMetadata(): Promise<Metadata> {
  const l = await langue();
  const v = versions();
  return { alternates: { canonical: v[l], languages: alternatesLangues(v) } };
}

const TEXTES = {
  fr: {
    titre: ["Vous l'imaginez.", "Nous le réalisons, au service de vos objectifs."],
    voir: "Voir les réalisations",
    descendre: "Descendre vers les réalisations",
    concretes: "Des réalisations concrètes",
    toutes: "Toutes les réalisations",
    aussi: "Ils nous ont aussi confié leur site :",
    pourQui: "Pour qui ?",
    appareils: ["iPhone, Android et web", "Une seule application"],
    devis: ["Nouvelle demande de devis", "Rénovation d'une cuisine"],
    conviction: "Notre conviction",
    maquette: ["Maquette validée", "Place au développement"],
    ecrans: ["Testé sur tous les écrans", "Ordinateur, tablette et mobile"],
    exige: "Tout ce qu'un projet web exige",
    detail: "Le détail des capacités",
  },
  en: {
    titre: ["You imagine it.", "We build it, around your goals."],
    voir: "See our work",
    descendre: "Scroll down to our work",
    concretes: "Real-world projects",
    toutes: "All our work",
    aussi: "They also trusted us with their website:",
    pourQui: "Who is it for?",
    appareils: ["iPhone, Android and web", "One single app"],
    devis: ["New quote request", "Kitchen renovation"],
    conviction: "Our conviction",
    maquette: ["Mockup approved", "On to development"],
    ecrans: ["Tested on every screen", "Desktop, tablet and mobile"],
    exige: "Everything a web project demands",
    detail: "Our capabilities in detail",
  },
  es: {
    titre: ["Usted lo imagina.", "Lo creamos, al servicio de sus objetivos."],
    voir: "Ver los proyectos",
    descendre: "Bajar a los proyectos",
    concretes: "Proyectos concretos",
    toutes: "Todos los proyectos",
    aussi: "También nos confiaron su sitio:",
    pourQui: "¿Para quién?",
    appareils: ["iPhone, Android y web", "Una sola aplicación"],
    devis: ["Nueva solicitud de presupuesto", "Reforma de una cocina"],
    conviction: "Nuestra convicción",
    maquette: ["Maqueta aprobada", "Pasamos al desarrollo"],
    ecrans: ["Probado en todas las pantallas", "Ordenador, tableta y móvil"],
    exige: "Todo lo que exige un proyecto web",
    detail: "Las capacidades en detalle",
  },
};

// Données structurées : l'entreprise et le site, pour Google et les moteurs d'IA
const donnees = (l: Langue, CAPACITES: { titre: string; texte: string }[], sousTitre: string, titre: string) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": ID_ENTREPRISE,
      name: SITE.nom,
      url: SITE.url,
      logo: `${SITE.url}/icon-512.png`,
      image: `${SITE.url}/opengraph-image.png`,
      description: sousTitre,
      slogan: titre,
      email: SITE.email,
      sameAs: [SITE.x],
      foundingDate: "2009",
      areaServed: { "@type": "Country", name: "France" },
      knowsAbout: CAPACITES.map((c) => c.titre),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: t({ fr: "Capacités", en: "Capabilities", es: "Capacidades" }, l),
        itemListElement: CAPACITES.map((c) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: c.titre, description: c.texte },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#site`,
      url: SITE.url,
      name: SITE.nom,
      inLanguage: LANGUES.map((x) => LOCALES[x]),
      publisher: { "@id": ID_ENTREPRISE },
    },
  ],
});

export default async function Accueil() {
  const c = await contenu();
  const { l, CAPACITES, MANIFESTE, PHOTOS, POUR_QUI, STUDIO, REALISATIONS } = c;
  const x = t(TEXTES, l);
  // Captures pour le Hero : pour chaque réalisation, sa première capture ordinateur et sa première capture mobile
  const DIAPOS: Diapo[] = REALISATIONS.flatMap((r) => {
    const v = r.visuels?.find((y) => y.format === "ordinateur");
    const m = r.visuels?.find((y) => y.format === "telephone");
    return v
      ? [{ src: v.src, alt: v.alt, nom: r.nom, type: r.type, slug: r.slug, domaine: r.site.libelle, mobile: m && { src: m.src, alt: m.alt } }]
      : [];
  });
  // Écrans de l'application MemoDay pour le bloc « Pour qui ? »
  const ECRANS_MEMODAY = ecransDe(c, "memoday");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(donnees(l, CAPACITES, c.SITE.sousTitre, c.SITE.titre))} />
      <DefilementEcrans />
      <SuperpositionMobile />
      {/* Vidéo de présentation : décidée avant l'affichage (première visite, ou après 30 jours d'absence) */}
      <script dangerouslySetInnerHTML={{ __html: SCRIPT_INTRO }} />
      <IntroVideo />
      {/* Accroche */}
      <section className="ecran ecran-hero relative flex min-h-[calc(100svh-77px)] flex-col overflow-hidden bg-nuit text-white lg:flex-row lg:items-center">
        {/* Téléphone et tablette : titre, image des sites, texte puis bouton, centrés, le tout dans la hauteur de l'écran
            (l'image se réduit pour laisser le bouton visible). Ordinateur : texte à gauche, image à droite. */}
        <Conteneur className="relative flex flex-1 flex-col pb-6 pt-6 sm:pb-10 sm:pt-10 lg:grid lg:flex-initial lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-4 lg:py-16">
          <div className="contents lg:block">
            <h1 className="titre-lumiere order-1 -mb-[0.12em] pb-[0.12em] text-center text-[clamp(1.75rem,4.2vw,3.55rem)] font-semibold leading-[1.08] tracking-tight text-balance lg:text-left">
              <span className="block">{x.titre[0]}</span>
              <span className="block">{x.titre[1]}</span>
            </h1>
            <p className="order-3 mx-auto max-w-xl text-pretty text-center text-base leading-relaxed text-[#C3D0DD] sm:text-xl lg:mx-0 lg:mt-7 lg:text-left">
              {c.SITE.sousTitre}
            </p>
            <div className="order-4 mt-6 flex flex-wrap justify-center gap-3 lg:mt-10 lg:justify-start">
              <Link
                href={chemin(l, "realisations")}
                className="rounded-full bg-bleu px-7 py-3.5 font-medium text-white transition-colors hover:bg-[#3A72FF]"
              >
                {x.voir}
              </Link>
            </div>
          </div>
          {/* Zone de l'image : prend la hauteur restante ; l'image s'y inscrit (largeur limitée par cette hauteur) */}
          <div className="relative order-2 my-4 min-h-[200px] flex-1 lg:order-none lg:my-0 lg:-mr-[6%] lg:min-h-0 lg:w-[112%]">
            <div className="absolute inset-0 flex items-center justify-center [container-type:size] lg:static lg:block lg:[container-type:normal]">
              <div className="w-[min(100%,460px,calc(100cqh*660/560))] lg:w-full">
                {DIAPOS.length ? <Vitrine diapos={DIAPOS} /> : <Constellation className="w-full" />}
              </div>
            </div>
          </div>
        </Conteneur>
        <a
          href="#realisations"
          aria-label={x.descendre}
          className="absolute bottom-6 left-1/2 hidden h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-white/20 text-[#B8C6D6] transition-colors hover:border-white/50 hover:text-white lg:flex"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 9.5l6 6 6-6" />
          </svg>
        </a>
      </section>

      {/* Réalisations */}
      <section id="realisations" className="ecran bg-ciel py-20 sm:py-24">
        <Conteneur>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[clamp(1.7rem,3vw,2.4rem)] font-semibold tracking-tight text-nuit">
              {x.concretes}
            </h2>
            <Link
              href={chemin(l, "realisations")}
              className="font-medium text-bleu transition-colors hover:text-[#1638A8]"
            >
              {x.toutes}
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {projetsSurMesure(c).map((r) => (
              <CarteRealisation key={r.slug} r={r} />
            ))}
          </div>
          <p className="mt-10 max-w-4xl text-[15px] leading-relaxed text-[#4A6178]">
            {x.aussi}{" "}
            {sitesClients(c).map((r, i) => (
              <span key={r.slug}>
                {i > 0 && ", "}
                <Link href={chemin(l, "realisations", r.slug)} className="font-medium text-nuit transition-colors hover:text-bleu">
                  {r.nom}
                </Link>
              </span>
            ))}
            .
          </p>
        </Conteneur>
      </section>

      {/* Pour qui */}
      <section className="ecran rendu-differe bg-white py-20 sm:py-28">
        <Conteneur>
          <div className="max-w-2xl">
            <h2 className="text-[clamp(1.7rem,3vw,2.4rem)] font-semibold tracking-tight text-nuit">{x.pourQui}</h2>
            <p className="mt-3 text-lg leading-relaxed text-[#4A6178]">{POUR_QUI.intro}</p>
          </div>
          <div className="mt-12 grid gap-14 md:grid-cols-2 md:gap-8">
            <article>
              <div className="relative aspect-[16/11]">
                <EventailApplication ecrans={ECRANS_MEMODAY} />
                <CarteFlottante icone="appareils" titre={x.appareils[0]} detail={x.appareils[1]} className="-top-6 right-5 z-20" />
              </div>
              <h3 className="mt-10 text-xl font-semibold text-nuit">{POUR_QUI.tous.titre}</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-[#2C4558]">{POUR_QUI.tous.texte}</p>
              <Link href={POUR_QUI.tous.lien.href} className="mt-4 inline-block font-medium text-bleu transition-colors hover:text-[#1638A8]">
                {POUR_QUI.tous.lien.libelle}
              </Link>
            </article>
            <article>
              <div className="relative grid aspect-[16/11] grid-cols-2 gap-3">
                <PhotoCadre photo={PHOTOS.commercante} sizes="(min-width: 768px) 270px, 46vw" className="h-full" />
                <PhotoCadre photo={PHOTOS.artisan} sizes="(min-width: 768px) 270px, 46vw" className="h-full" />
                <CarteFlottante
                  icone="devis"
                  titre={x.devis[0]}
                  detail={x.devis[1]}
                  retard={1.4}
                  className="-bottom-6 right-5"
                />
              </div>
              <h3 className="mt-10 text-xl font-semibold text-nuit">{POUR_QUI.pros.titre}</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-[#2C4558]">{POUR_QUI.pros.texte}</p>
              <Link href={POUR_QUI.pros.lien.href} className="mt-4 inline-block font-medium text-bleu transition-colors hover:text-[#1638A8]">
                {POUR_QUI.pros.lien.libelle}
              </Link>
            </article>
          </div>
        </Conteneur>
      </section>

      {/* Manifeste */}
      <section className="ecran rendu-differe bg-ciel py-20 sm:py-28">
        <Conteneur>
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
            <PhotoCadre photo={PHOTOS.rendezVous} sizes="(min-width: 1024px) 540px, 92vw" className="aspect-[16/11]">
              <CarteFlottante icone="coche" titre={x.maquette[0]} detail={x.maquette[1]} className="-bottom-6 left-5" />
            </PhotoCadre>
            <div>
              <h2 className="text-[clamp(1.7rem,3vw,2.4rem)] font-semibold tracking-tight text-nuit">{x.conviction}</h2>
              <p className="mt-6 text-xl leading-relaxed text-[#4A6178]">{MANIFESTE[0]}</p>
              <p className="mt-4 text-xl leading-relaxed text-[#2C4558]">{MANIFESTE[1]}</p>
              <p className="mt-6 text-[clamp(1.35rem,2.4vw,1.85rem)] font-semibold leading-snug text-nuit">{MANIFESTE[2]}</p>
            </div>
          </div>
        </Conteneur>
      </section>

      {/* Studio */}
      <section className="ecran rendu-differe bg-white py-20 sm:py-28">
        <Conteneur>
          <div>
            <div className="max-w-2xl">
              <h2 className="text-[clamp(1.7rem,3vw,2.4rem)] font-semibold tracking-tight text-nuit">{STUDIO.titre}</h2>
              <p className="mt-3 text-lg leading-relaxed text-[#4A6178]">{STUDIO.texte}</p>
            </div>
            <div className="mt-10 grid gap-5 lg:grid-cols-[1.5fr_1fr] lg:grid-rows-2">
              <PhotoCadre photo={PHOTOS.poste} sizes="(min-width: 1024px) 680px, 92vw" className="mb-5 aspect-[16/10] lg:row-span-2 lg:mb-0 lg:aspect-auto">
                <CarteFlottante
                  icone="appareils"
                  titre={x.ecrans[0]}
                  detail={x.ecrans[1]}
                  retard={0.8}
                  className="-bottom-6 left-5"
                />
              </PhotoCadre>
              <PhotoCadre photo={PHOTOS.ultralarge} sizes="(min-width: 1024px) 440px, 92vw" className="aspect-[16/10]" />
              <PhotoCadre photo={PHOTOS.validation} sizes="(min-width: 1024px) 440px, 92vw" className="aspect-[16/10]" />
            </div>
          </div>
        </Conteneur>
      </section>

      {/* Capacités */}
      <section className="ecran rendu-differe border-t border-[#E3E9F0] bg-white py-20 sm:py-24">
        <Conteneur>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[clamp(1.7rem,3vw,2.4rem)] font-semibold tracking-tight text-nuit">
              {x.exige}
            </h2>
            <Link
              href={chemin(l, "capacites")}
              className="font-medium text-bleu transition-colors hover:text-[#1638A8]"
            >
              {x.detail}
            </Link>
          </div>
          <CapacitesInteractives
            capacites={CAPACITES.map(({ titre, texte, icone }) => ({ titre, texte, icone }))}
            scenes={CAPACITES.map((c) => {
              const Scene = SCENES_CAPACITES[c.icone];
              return <Scene key={c.icone} />;
            })}
          />
        </Conteneur>
      </section>

      <BlocMethode />

      <BlocEngagements />

      <AppelFinal />
    </>
  );
}
