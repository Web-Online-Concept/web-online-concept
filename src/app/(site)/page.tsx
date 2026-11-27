import type { Metadata } from "next";
import Link from "next/link";
import { ID_ENTREPRISE, jsonLd } from "@/lib/seo";
import BlocMethode from "@/components/site/BlocMethode";
import DefilementEcrans from "@/components/site/DefilementEcrans";
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
import {
  CAPACITES,
  MANIFESTE,
  PHOTOS,
  POUR_QUI,
  STUDIO,
  PROJETS_SUR_MESURE,
  REALISATIONS,
  ecransApplication,
  SITE,
  SITES_CLIENTS,
} from "@/lib/contenu";

export const metadata: Metadata = { alternates: { canonical: "/" } };

// Données structurées : l'entreprise et le site, pour Google et les moteurs d'IA
const DONNEES = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": ID_ENTREPRISE,
      name: SITE.nom,
      url: SITE.url,
      logo: `${SITE.url}/icon-512.png`,
      image: `${SITE.url}/opengraph-image.png`,
      description: SITE.sousTitre,
      slogan: SITE.titre,
      email: SITE.email,
      foundingDate: "2009",
      areaServed: { "@type": "Country", name: "France" },
      knowsAbout: CAPACITES.map((c) => c.titre),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Capacités",
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
      inLanguage: "fr-FR",
      publisher: { "@id": ID_ENTREPRISE },
    },
  ],
};

// Captures pour le Hero : pour chaque réalisation, sa première capture ordinateur et sa première capture mobile
const DIAPOS: Diapo[] = REALISATIONS.flatMap((r) => {
  const v = r.visuels?.find((x) => x.format === "ordinateur");
  const m = r.visuels?.find((x) => x.format === "telephone");
  return v
    ? [{ src: v.src, alt: v.alt, nom: r.nom, type: r.type, slug: r.slug, domaine: r.site.libelle, mobile: m && { src: m.src, alt: m.alt } }]
    : [];
});

// Écrans de l'application MemoDay pour le bloc « Pour qui ? »
const ECRANS_MEMODAY = ecransApplication("memoday");

export default function Accueil() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(DONNEES)} />
      <DefilementEcrans />
      {/* Accroche */}
      <section className="ecran ecran-hero relative overflow-hidden bg-nuit text-white lg:flex lg:min-h-[calc(100svh-77px)] lg:items-center">
        <Conteneur className="relative grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-[1fr_1.05fr] lg:gap-4 lg:py-16">
          <div>
            <h1 className="text-[clamp(1.9rem,4.2vw,3.55rem)] font-semibold leading-[1.08] tracking-tight text-balance">
              <span className="block">Vous l&apos;imaginez.</span>
              <span className="block">Nous le réalisons, au service de vos objectifs.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-[#C3D0DD] sm:text-xl">
              {SITE.sousTitre}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/realisations"
                className="rounded-full bg-bleu px-7 py-3.5 font-medium text-white transition-colors hover:bg-[#3A72FF]"
              >
                Voir les réalisations
              </Link>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[460px] lg:-mr-[6%] lg:w-[112%] lg:max-w-none">
            {DIAPOS.length ? <Vitrine diapos={DIAPOS} /> : <Constellation className="w-full" />}
          </div>
        </Conteneur>
        <a
          href="#realisations"
          aria-label="Descendre vers les réalisations"
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
              Des réalisations concrètes
            </h2>
            <Link
              href="/realisations"
              className="font-medium text-bleu transition-colors hover:text-[#1638A8]"
            >
              Toutes les réalisations
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {PROJETS_SUR_MESURE.map((r) => (
              <CarteRealisation key={r.slug} r={r} />
            ))}
          </div>
          <p className="mt-10 max-w-4xl text-[15px] leading-relaxed text-[#4A6178]">
            Ils nous ont aussi confié leur site :{" "}
            {SITES_CLIENTS.map((r, i) => (
              <span key={r.slug}>
                {i > 0 && ", "}
                <Link href={`/realisations/${r.slug}`} className="font-medium text-nuit transition-colors hover:text-bleu">
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
            <h2 className="text-[clamp(1.7rem,3vw,2.4rem)] font-semibold tracking-tight text-nuit">Pour qui ?</h2>
            <p className="mt-3 text-lg leading-relaxed text-[#4A6178]">{POUR_QUI.intro}</p>
          </div>
          <div className="mt-12 grid gap-14 md:grid-cols-2 md:gap-8">
            <article>
              <div className="relative aspect-[16/11]">
                <EventailApplication ecrans={ECRANS_MEMODAY} />
                <CarteFlottante icone="appareils" titre="iPhone, Android et web" detail="Une seule application" className="-top-6 right-5 z-20" />
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
                  titre="Nouvelle demande de devis"
                  detail="Rénovation d'une cuisine"
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
              <CarteFlottante icone="coche" titre="Maquette validée" detail="Place au développement" className="-bottom-6 left-5" />
            </PhotoCadre>
            <div>
              <h2 className="text-[clamp(1.7rem,3vw,2.4rem)] font-semibold tracking-tight text-nuit">Notre conviction</h2>
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
              <PhotoCadre photo={PHOTOS.poste} sizes="(min-width: 1024px) 680px, 92vw" className="aspect-[16/10] lg:row-span-2 lg:aspect-auto">
                <CarteFlottante
                  icone="appareils"
                  titre="Testé sur tous les écrans"
                  detail="Ordinateur, tablette et mobile"
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
              Tout ce qu&apos;un projet web exige
            </h2>
            <Link
              href="/capacites"
              className="font-medium text-bleu transition-colors hover:text-[#1638A8]"
            >
              Le détail des capacités
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
