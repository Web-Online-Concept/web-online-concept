import type { Metadata } from "next";
import { metaPage, versions } from "@/lib/seo";
import { AppelFinal, BlocEngagements, Conteneur, EnTetePage } from "@/components/site/Blocs";
import Conviction from "@/components/site/Conviction";
import DefilementEcrans from "@/components/site/DefilementEcrans";
import { ANIMATIONS_METHODE } from "@/components/site/illustrations/Methode";
import { CarteFlottante, PhotoCadre } from "@/components/site/Photos";
import SceneEnVue from "@/components/site/SceneEnVue";
import { contenu } from "@/lib/i18n/contenu";
import { langue, t } from "@/lib/i18n/langue";

const TEXTES = {
  fr: {
    titre: "Méthode",
    description:
      "Une méthode augmentée par l'IA : cadrer vite, produire plus, tout vérifier, faire évoluer. Et des engagements concrets à chaque étape.",
    descendre: "Descendre vers la première étape",
    h1: "Une méthode augmentée par l'IA",
    intro:
      "L'expertise technique fixe le cap, l'IA démultiplie la production. Résultat : des projets ambitieux, livrés vite, sans compromis sur la qualité.",
    ia: "Les IA que nous utilisons",
  },
  en: {
    titre: "Method",
    description:
      "A method augmented by AI: frame it fast, produce more, check everything, keep evolving. And concrete commitments at every step.",
    descendre: "Scroll down to the first step",
    h1: "A method augmented by AI",
    intro:
      "Technical expertise sets the course, AI multiplies the output. The result: ambitious projects, delivered fast, with no compromise on quality.",
    ia: "The AIs we use",
  },
  es: {
    titre: "Método",
    description:
      "Un método potenciado por la IA: definir rápido, producir más, verificarlo todo, hacer evolucionar. Y compromisos concretos en cada etapa.",
    descendre: "Bajar a la primera etapa",
    h1: "Un método potenciado por la IA",
    intro:
      "La experiencia técnica marca el rumbo, la IA multiplica la producción. Resultado: proyectos ambiciosos, entregados rápido, sin concesiones en la calidad.",
    ia: "Las IA que utilizamos",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const l = await langue();
  const x = t(TEXTES, l);
  return metaPage(l, x.titre, x.description, versions("methode"));
}

export default async function Methode() {
  const { l, IA, METHODE, METHODE_DETAILS, PHOTOS } = await contenu();
  const x = t(TEXTES, l);
  return (
    <>
      <DefilementEcrans />
      <EnTetePage
        ecran
        suite={{ id: "etape-1", libelle: x.descendre }}
        illustration="methode"
        titre={x.h1}
        intro={x.intro}
      />

      {/* Les quatre étapes : une photo du studio, et l'animation de l'étape posée dessus */}
      <section className="bg-white">
        <Conteneur>
          <ol>
            {METHODE.map((e, i) => {
              const d = METHODE_DETAILS[i];
              const Animation = ANIMATIONS_METHODE[i];
              const aDroite = i % 2 === 0;
              return (
                <li key={e.titre} id={`etape-${i + 1}`} className="ecran py-16 sm:py-20">
                  <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
                    <SceneEnVue decoratif={false} className={`relative ${aDroite ? "lg:order-last" : ""}`}>
                      <PhotoCadre photo={d ? PHOTOS[d.photo] : PHOTOS.poste} sizes="(min-width: 1024px) 540px, 92vw" className="aspect-[16/11]" />
                      {Animation && (
                        <div
                          aria-hidden="true"
                          className={`flotte absolute -bottom-10 w-[46%] overflow-hidden rounded-2xl bg-[#0F2340] shadow-[0_30px_60px_-24px_rgba(2,8,20,0.8)] ring-1 ring-white/10 ${
                            aDroite ? "left-3 lg:-left-6" : "right-3 lg:-right-6"
                          }`}
                        >
                          <div className="aspect-[4/3]">
                            <Animation />
                          </div>
                        </div>
                      )}
                      {d && (
                        <CarteFlottante
                          icone="coche"
                          titre={d.carte.titre}
                          detail={d.carte.detail}
                          retard={1}
                          className={`-top-6 ${aDroite ? "right-5" : "left-5"}`}
                        />
                      )}
                    </SceneEnVue>
                    <div>
                      {/* Numéro de l'étape à gauche du titre */}
                      <div className="flex items-center gap-4">
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1F5EFF,#00B4D8_60%,#2BD47D)] text-base font-semibold text-white shadow-[0_0_0_5px_rgba(0,180,216,0.12)]">
                          {i + 1}
                        </span>
                        <h2 className="text-[clamp(1.8rem,3vw,2.5rem)] font-semibold leading-tight tracking-tight text-nuit">{e.titre}</h2>
                      </div>
                      <p className="mt-4 text-[18px] leading-relaxed text-[#2C4558]">{e.texte}</p>
                      {d && (
                        <ul className="mt-6 flex flex-col gap-3">
                          {d.points.map((p) => (
                            <li key={p} className="flex items-start gap-3 text-[16px] text-[#2C4558]">
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
                      )}
                      {i === 1 && (
                        <ul className="mt-6 flex flex-wrap gap-2" aria-label={x.ia}>
                          {IA.modeles.map((m) => (
                            <li
                              key={m.nom}
                              className="flex items-center gap-1.5 rounded-full bg-[#E8EFFF] px-3.5 py-1.5 text-sm font-medium text-[#1638A8]"
                            >
                              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                                <path d="M12 2.5l2.4 6.6 6.6 2.4-6.6 2.4L12 20.5l-2.4-6.6L3 11.5l6.6-2.4z" />
                              </svg>
                              {m.nom}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </Conteneur>
      </section>

      <BlocEngagements fond="bg-ciel" />

      <Conviction />

      <AppelFinal />
    </>
  );
}
