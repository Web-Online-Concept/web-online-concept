import Link from "next/link";
import { PastilleIcone } from "@/components/site/Icones";
import Constellation from "@/components/site/illustrations/Constellation";
import {
  AppelFinal,
  CarteRealisation,
  Conteneur,
} from "@/components/site/Blocs";
import {
  CAPACITES,
  MANIFESTE,
  METHODE,
  REALISATIONS,
  REFERENCES,
  SITE,
} from "@/lib/contenu";

export default function Accueil() {
  return (
    <>
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
          <Constellation className="mx-auto w-full max-w-[440px] lg:-mr-[8%] lg:w-[116%] lg:max-w-none" />
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
            {REALISATIONS.map((r) => (
              <CarteRealisation key={r.slug} r={r} />
            ))}
          </div>
          <p className="mt-10 max-w-4xl text-[15px] leading-relaxed text-[#4A6178]">
            Ils nous ont aussi confié leur site : {REFERENCES.map((r) => r.nom).join(", ")}.{" "}
            <Link href="/realisations#clients" className="font-medium text-bleu hover:underline">
              Voir leurs sites
            </Link>
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
          <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {CAPACITES.map((c) => (
              <li key={c.titre} className="flex gap-4">
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

      <AppelFinal />
    </>
  );
}
