import type { Metadata } from "next";
import { AppelFinal, CarteRealisation, Conteneur, EnTetePage } from "@/components/site/Blocs";
import { REALISATIONS, REFERENCES } from "@/lib/contenu";

export const metadata: Metadata = {
  title: "Réalisations",
  description:
    "Applications web et mobiles, galerie d'art, sites avec réservation, sites vitrines d'entreprises : les projets conçus et développés par Web Online Concept.",
};

export default function Realisations() {
  return (
    <>
      <EnTetePage
        illustration="realisations"
        titre="Réalisations"
        intro="Une application mobile dopée à l'IA, une galerie d'art, des sites avec réservation ou devis en ligne : chaque projet part d'objectifs précis et va jusqu'à la mise en ligne."
      />

      <section className="bg-ciel py-16 sm:py-20">
        <Conteneur>
          <h2 className="text-[clamp(1.6rem,2.6vw,2.1rem)] font-semibold tracking-tight text-nuit">Projets sur mesure</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {REALISATIONS.map((r) => (
              <CarteRealisation key={r.slug} r={r} />
            ))}
          </div>
        </Conteneur>
      </section>

      <section id="clients" className="bg-white py-16 sm:py-20">
        <Conteneur>
          <div className="max-w-2xl">
            <h2 className="text-[clamp(1.6rem,2.6vw,2.1rem)] font-semibold tracking-tight text-nuit">
              Sites créés et suivis pour nos clients
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-[#4A6178]">
              Imprimeurs, artisans, praticiens, professionnels de l&apos;événementiel : des sites conçus, mis en ligne et suivis dans la durée, de
              Toulouse à La Rochelle.
            </p>
          </div>
          <ul className="mt-10 divide-y divide-[#E3E9F0] border-y border-[#E3E9F0]">
            {REFERENCES.map((r) => (
              <li key={r.nom} className="grid gap-4 py-7 lg:grid-cols-[1.15fr_1.4fr_auto] lg:items-center lg:gap-10">
                <div>
                  <h3 className="text-xl font-semibold text-nuit">{r.nom}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-[#2C4558]">{r.activite}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-[#4A6178]">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
                      <circle cx="12" cy="10" r="2.3" />
                    </svg>
                    {r.lieu}
                  </p>
                </div>
                <ul className="flex flex-wrap gap-2" aria-label={`Ce que propose le site de ${r.nom}`}>
                  {r.realise.map((x) => (
                    <li key={x} className="rounded-full bg-ciel px-3 py-1.5 text-sm text-[#2C4558]">
                      {x}
                    </li>
                  ))}
                </ul>
                <a
                  href={r.site.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 self-start justify-self-start rounded-full border border-[#CBD5E1] px-5 py-2.5 text-[15px] font-medium text-nuit transition-colors hover:border-nuit lg:self-center"
                >
                  Voir le site
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
                  </svg>
                  <span className="sr-only">(nouvel onglet)</span>
                </a>
              </li>
            ))}
          </ul>
        </Conteneur>
      </section>

      <AppelFinal />
    </>
  );
}
