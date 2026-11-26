import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { metaPage } from "@/lib/seo";
import { AppelFinal, Conteneur, EnTetePage } from "@/components/site/Blocs";
import { PastilleIcone } from "@/components/site/Icones";
import { CarteFlottante, PhotoCadre } from "@/components/site/Photos";
import DefilementEcrans from "@/components/site/DefilementEcrans";
import SceneEnVue from "@/components/site/SceneEnVue";
import { SCENES_CAPACITES } from "@/components/site/illustrations/Capacites";
import { CAPACITES, PHOTOS, realisation } from "@/lib/contenu";

export const metadata: Metadata = metaPage(
  "Capacités",
  "Sites sur mesure, applications web et mobiles, plateformes à abonnement, IA intégrée, référencement et visibilité IA, back-offices, refonte et suivi, performance et sécurité.",
  "/capacites",
);

export default function Capacites() {
  return (
    <>
      <DefilementEcrans />
      <EnTetePage
        ecran
        suite={{ id: "liste-capacites", libelle: "Descendre vers les capacités" }}
        illustration="capacites"
        titre="Tout ce qu'un projet web exige, réuni au même endroit"
        intro="Du site vitrine à la plateforme complète avec IA intégrée : un seul interlocuteur pour concevoir, développer, mettre en ligne et faire évoluer."
      />

      {/* Les huit capacités, chacune avec sa scène animée et des exemples réels */}
      <section className="bg-white">
        <Conteneur>
          <ul className="divide-y divide-[#E3E9F0]">
            {CAPACITES.map((c, i) => {
              const Scene = SCENES_CAPACITES[c.icone];
              const exemples = c.exemples
                .map((slug) => realisation(slug))
                .filter((r) => r !== undefined);
              return (
                <li key={c.titre} id={i === 0 ? "liste-capacites" : undefined} className="ecran py-16 sm:py-20">
                  <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                    <SceneEnVue
                      className={`relative aspect-[16/11] overflow-hidden rounded-3xl bg-nuit shadow-[0_40px_80px_-40px_rgba(10,26,47,0.7)] ${
                        i % 2 ? "lg:order-first" : "lg:order-last"
                      }`}
                    >
                      <div className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-bleu opacity-30 blur-3xl" />
                      <div className="absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-vert opacity-15 blur-3xl" />
                      <div className="relative h-full w-full">
                        <Scene />
                      </div>
                    </SceneEnVue>
                    <div>
                      <PastilleIcone nom={c.icone} />
                      <h2 className="mt-5 text-[clamp(1.6rem,2.6vw,2.1rem)] font-semibold tracking-tight text-nuit">
                        {c.titre}
                      </h2>
                      <p className="mt-3 text-[17px] leading-relaxed text-[#2C4558]">
                        {c.texte}
                      </p>
                      <ul className="mt-6 flex flex-col gap-3">
                        {c.points.map((p) => (
                          <li
                            key={p}
                            className="flex items-start gap-3 text-[16px] text-[#2C4558]"
                          >
                            <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E3F8EC] text-[#0E7A45]">
                              <svg
                                viewBox="0 0 24 24"
                                className="h-3.5 w-3.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                <path d="M5 12.5l4.2 4.2L19 7" />
                              </svg>
                            </span>
                            {p}
                          </li>
                        ))}
                      </ul>
                      {exemples.length > 0 && (
                        <div className="mt-8">
                          <p className="text-sm font-medium text-[#4A6178]">
                            {exemples.length > 1 ? "Exemples" : "Exemple"}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-3">
                            {exemples.map((r) => {
                              const vignette = r.visuels?.find(
                                (v) => v.format === "ordinateur",
                              );
                              return (
                                <Link
                                  key={r.slug}
                                  href={`/realisations/${r.slug}`}
                                  className="group flex items-center gap-3 rounded-2xl border border-[#DCE3EC] bg-white p-2 pr-5 transition-shadow hover:shadow-[0_14px_30px_-18px_rgba(10,26,47,0.45)]"
                                >
                                  {vignette && (
                                    <span className="relative block h-14 w-24 overflow-hidden rounded-xl bg-[#DCE3EC]">
                                      <Image
                                        src={vignette.src}
                                        alt=""
                                        fill
                                        sizes="96px"
                                        className="object-cover object-top"
                                      />
                                    </span>
                                  )}
                                  <span>
                                    <span className="block font-semibold text-nuit transition-colors group-hover:text-bleu">
                                      {r.nom}
                                    </span>
                                    <span className="block text-[13px] text-[#4A6178]">
                                      Voir la réalisation
                                    </span>
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Conteneur>
      </section>

      {/* Un seul interlocuteur */}
      <section className="ecran bg-ciel py-20 sm:py-24">
        <Conteneur className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <PhotoCadre
            photo={PHOTOS.validation}
            sizes="(min-width: 1024px) 540px, 92vw"
            className="aspect-[16/11]"
          >
            <CarteFlottante
              icone="coche"
              titre="Validé par vous"
              detail="Avant chaque mise en ligne"
              className="-bottom-6 right-5"
            />
          </PhotoCadre>
          <div>
            <h2 className="text-[clamp(1.7rem,3vw,2.4rem)] font-semibold tracking-tight text-nuit">
              Un seul interlocuteur pour tout le projet
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-[#2C4558]">
              Conception, développement, mise en ligne et suivi : la même
              personne, du premier échange aux évolutions. Vous validez chaque
              étape avant qu&apos;elle soit publiée.
            </p>
            <Link
              href="/methode"
              className="mt-6 inline-block font-medium text-bleu transition-colors hover:text-[#1638A8]"
            >
              Découvrir la méthode
            </Link>
          </div>
        </Conteneur>
      </section>

      <AppelFinal />
    </>
  );
}
