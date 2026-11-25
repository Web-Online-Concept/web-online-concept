import type { Metadata } from "next";
import Link from "next/link";
import { ID_ENTREPRISE, jsonLd } from "@/lib/seo";
import { PastilleIcone } from "@/components/site/Icones";
import Constellation from "@/components/site/illustrations/Constellation";
import Vitrine, { type Diapo, type Ecran } from "@/components/site/Vitrine";
import {
  AppelFinal,
  BlocEngagements,
  CarteRealisation,
  Conteneur,
} from "@/components/site/Blocs";
import {
  CAPACITES,
  MANIFESTE,
  METHODE,
  PROJETS_SUR_MESURE,
  REALISATIONS,
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
      address: {
        "@type": "PostalAddress",
        streetAddress: "5 rue Paul Estival",
        postalCode: "31200",
        addressLocality: "Toulouse",
        addressRegion: "Occitanie",
        addressCountry: "FR",
      },
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

// Captures pour le Hero : la première capture « ordinateur » de chaque réalisation, et les écrans de MemoDay
const DIAPOS: Diapo[] = REALISATIONS.flatMap((r) => {
  const v = r.visuels?.find((x) => x.format === "ordinateur");
  return v ? [{ src: v.src, alt: v.alt, nom: r.nom, type: r.type, slug: r.slug, domaine: r.site.libelle }] : [];
});
const ECRANS: Ecran[] = REALISATIONS.flatMap((r) => (r.visuels ?? []).filter((x) => x.format === "telephone").map((x) => ({ src: x.src, alt: x.alt })));

export default function Accueil() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(DONNEES)} />
      {/* Accroche */}
      <section className="relative overflow-hidden bg-nuit text-white lg:flex lg:min-h-[calc(100svh-77px)] lg:items-center">
        <Conteneur className="relative grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-[1fr_1.05fr] lg:gap-4 lg:py-16">
          <div>
            <h1 className="text-[clamp(1.9rem,4.2vw,3.55rem)] font-semibold leading-[1.08] tracking-tight text-balance">
              {SITE.titre.replace(
                "Web Online Concept",
                "Web\u00a0Online\u00a0Concept",
              )}
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
              <Link
                href="/contact"
                className="rounded-full border border-white/40 px-7 py-3.5 font-medium text-white transition-colors hover:border-white hover:bg-white/5"
              >
                Parlons de votre projet
              </Link>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[460px] lg:-mr-[6%] lg:w-[112%] lg:max-w-none">
            {DIAPOS.length ? <Vitrine diapos={DIAPOS} ecrans={ECRANS} /> : <Constellation className="w-full" />}
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
      <section id="realisations" className="bg-ciel py-20 sm:py-24">
        <Conteneur>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[clamp(1.7rem,3vw,2.4rem)] font-semibold tracking-tight text-nuit">
              Des réalisations concrètes
            </h2>
            <Link
              href="/realisations"
              className="font-medium text-bleu hover:underline"
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
                <Link href={`/realisations/${r.slug}`} className="text-[#2C4558] underline decoration-[#CBD5E1] underline-offset-4 hover:text-bleu hover:decoration-bleu">
                  {r.nom}
                </Link>
              </span>
            ))}
            .
          </p>
        </Conteneur>
      </section>

      {/* Manifeste */}
      <section className="bg-white py-20 sm:py-28">
        <Conteneur className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <h2 className="text-[clamp(1.7rem,3vw,2.4rem)] font-semibold tracking-tight text-nuit">
            Notre conviction
          </h2>
          <div className="flex flex-col gap-6">
            <p className="text-xl leading-relaxed text-[#4A6178]">
              {MANIFESTE[0]}
            </p>
            <p className="text-xl leading-relaxed text-[#2C4558]">
              {MANIFESTE[1]}
            </p>
            <p className="text-[clamp(1.4rem,2.6vw,2rem)] font-semibold leading-snug text-nuit">
              {MANIFESTE[2]}
            </p>
          </div>
        </Conteneur>
      </section>

      {/* Capacités */}
      <section className="border-t border-[#E3E9F0] bg-white py-20 sm:py-24">
        <Conteneur>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[clamp(1.7rem,3vw,2.4rem)] font-semibold tracking-tight text-nuit">
              Tout ce qu&apos;un projet web exige
            </h2>
            <Link
              href="/capacites"
              className="font-medium text-bleu hover:underline"
            >
              Le détail des capacités
            </Link>
          </div>
          <ul className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {CAPACITES.map((c) => (
              <li key={c.titre} className="flex flex-col gap-4">
                <PastilleIcone nom={c.icone} />
                <div>
                  <h3 className="text-lg font-semibold text-nuit">{c.titre}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#2C4558]">
                    {c.texte}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Conteneur>
      </section>

      {/* Méthode */}
      <section className="bg-ciel py-20 sm:py-24">
        <Conteneur>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[clamp(1.7rem,3vw,2.4rem)] font-semibold tracking-tight text-nuit">
              Une méthode augmentée par l&apos;IA
            </h2>
            <Link
              href="/methode"
              className="font-medium text-bleu hover:underline"
            >
              La méthode en détail
            </Link>
          </div>
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {METHODE.map((e, i) => (
              <li key={e.titre} className="rounded-2xl bg-white p-6">
                <span className="text-sm font-semibold text-bleu">
                  Étape {i + 1}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-nuit">
                  {e.titre}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#2C4558]">
                  {e.texte}
                </p>
              </li>
            ))}
          </ol>
        </Conteneur>
      </section>

      <BlocEngagements />

      <AppelFinal />
    </>
  );
}
