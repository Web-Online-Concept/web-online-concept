import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { metaPage, versions } from "@/lib/seo";
import { AppelFinal, Conteneur, EnTetePage } from "@/components/site/Blocs";
import { PastilleIcone } from "@/components/site/Icones";
import { CarteFlottante, PhotoCadre } from "@/components/site/Photos";
import DefilementEcrans from "@/components/site/DefilementEcrans";
import OrbiteIA from "@/components/site/OrbiteIA";
import SceneEnVue from "@/components/site/SceneEnVue";
import { SCENES_CAPACITES } from "@/components/site/illustrations/Capacites";
import type { Capacite, Contenu } from "@/lib/contenu";
import { contenu, realisationDe } from "@/lib/i18n/contenu";
import { chemin, type Langue } from "@/lib/i18n/chemins";
import { langue, t } from "@/lib/i18n/langue";

const TEXTES = {
  fr: {
    titre: "Capacités",
    description:
      "Sites sur mesure, applications web et mobiles, plateformes à abonnement, IA intégrée, référencement et visibilité IA, back-offices, refonte et suivi, performance et sécurité.",
    exemple: "Exemple",
    exemples: "Exemples",
    voir: "Voir la réalisation",
    descendre: "Descendre vers les capacités",
    h1: "Tout ce qu'un projet web exige, réuni au même endroit",
    intro:
      "Du site vitrine à la plateforme complète avec IA intégrée : un seul interlocuteur pour concevoir, développer, mettre en ligne et faire évoluer.",
    criteres: "Nos critères de choix",
    valide: ["Validé par vous", "Avant chaque mise en ligne"],
    seul: "Un seul interlocuteur pour tout le projet",
    seulTexte:
      "Conception, développement, mise en ligne et suivi : la même personne, du premier échange aux évolutions. Vous validez chaque étape avant qu'elle soit publiée.",
    methode: "Découvrir la méthode",
  },
  en: {
    titre: "Capabilities",
    description:
      "Custom websites, web and mobile apps, subscription platforms, built-in AI, SEO and AI visibility, back offices, redesign and support, performance and security.",
    exemple: "Example",
    exemples: "Examples",
    voir: "View the project",
    descendre: "Scroll down to the capabilities",
    h1: "Everything a web project demands, all in one place",
    intro:
      "From a business website to a complete platform with built-in AI: a single point of contact to design, build, launch and keep improving.",
    criteres: "Our selection criteria",
    valide: ["Approved by you", "Before every release"],
    seul: "A single point of contact for the whole project",
    seulTexte:
      "Design, development, launch and support: the same person, from the first conversation to every update. You approve each step before it goes live.",
    methode: "Discover the method",
  },
  es: {
    titre: "Capacidades",
    description:
      "Sitios a medida, aplicaciones web y móviles, plataformas de suscripción, IA integrada, posicionamiento y visibilidad en las IA, paneles de gestión, rediseño y seguimiento, rendimiento y seguridad.",
    exemple: "Ejemplo",
    exemples: "Ejemplos",
    voir: "Ver el proyecto",
    descendre: "Bajar a las capacidades",
    h1: "Todo lo que exige un proyecto web, reunido en un solo lugar",
    intro:
      "Del sitio corporativo a la plataforma completa con IA integrada: un único interlocutor para diseñar, desarrollar, publicar y hacer evolucionar.",
    criteres: "Nuestros criterios de elección",
    valide: ["Aprobado por usted", "Antes de cada publicación"],
    seul: "Un único interlocutor para todo el proyecto",
    seulTexte:
      "Diseño, desarrollo, puesta en línea y seguimiento: la misma persona, desde la primera conversación hasta las evoluciones. Usted aprueba cada etapa antes de su publicación.",
    methode: "Descubrir el método",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const l = await langue();
  const x = t(TEXTES, l);
  return metaPage(l, x.titre, x.description, versions("capacites"));
}

function LigneCapacite({ c, i, contenu: ct, l }: { c: Capacite; i: number; contenu: Contenu; l: Langue }) {
  const x = t(TEXTES, l);
  const Scene = SCENES_CAPACITES[c.icone];
  const exemples = c.exemples
    .map((slug) => realisationDe(ct, slug))
    .filter((r) => r !== undefined);
  return (
    <li
      id={i === 0 ? "liste-capacites" : undefined}
      className="ecran py-16 sm:py-20"
    >
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
          {/* Pictogramme à gauche du titre (le même que dans le choix des capacités de l'accueil) */}
          <div className="flex items-center gap-3.5">
            <PastilleIcone nom={c.icone} petite />
            <h2 className="text-[clamp(1.6rem,2.6vw,2.1rem)] font-semibold leading-tight tracking-tight text-nuit">
              {c.titre}
            </h2>
          </div>
          <p className="mt-4 text-[17px] leading-relaxed text-[#2C4558]">
            {c.intro}
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
                {exemples.length > 1 ? x.exemples : x.exemple}
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {exemples.map((r) => {
                  const vignette = r.visuels?.find(
                    (v) => v.format === "ordinateur",
                  );
                  return (
                    <Link
                      key={r.slug}
                      href={chemin(l, "realisations", r.slug)}
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
                          {x.voir}
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
}

export default async function Capacites() {
  const c = await contenu();
  const { l, CAPACITES, IA, PHOTOS } = c;
  const x = t(TEXTES, l);
  // Position de l'écran des IA : juste après la capacité « IA intégrée »
  const COUPURE = CAPACITES.findIndex((k) => k.icone === "ia") + 1;
  return (
    <>
      <DefilementEcrans />
      <EnTetePage
        ecran
        suite={{ id: "liste-capacites", libelle: x.descendre }}
        illustration="capacites"
        titre={x.h1}
        intro={x.intro}
      />

      {/* Les huit capacités, chacune avec sa scène animée et des exemples réels ; l'écran des IA après « IA intégrée » */}
      <section className="bg-white">
        <Conteneur>
          <ul className="divide-y divide-[#E3E9F0]">
            {CAPACITES.slice(0, COUPURE).map((k, i) => (
              <LigneCapacite key={k.titre} c={k} i={i} contenu={c} l={l} />
            ))}
          </ul>
        </Conteneur>
      </section>

      {/* Les IA intégrées */}
      <section className="ecran relative overflow-hidden bg-nuit py-20 text-white sm:py-24">
        <div
          aria-hidden="true"
          className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-bleu opacity-20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-48 -right-40 h-[30rem] w-[30rem] rounded-full bg-vert opacity-[0.12] blur-3xl"
        />
        <Conteneur className="relative">
          <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
            <div>
              <h2 className="text-[clamp(1.8rem,3vw,2.5rem)] font-semibold tracking-tight">
                {IA.titre}
              </h2>
              <p className="mt-5 text-[18px] leading-relaxed text-[#C3D0DD]">
                {IA.phrase}
              </p>
              <ul
                className="mt-8 flex flex-wrap gap-2.5"
                aria-label={x.criteres}
              >
                {IA.criteres.map((k) => (
                  <li
                    key={k}
                    className="rounded-full bg-white/[0.07] px-4 py-2 text-[15px] text-[#E6EDF5] ring-1 ring-white/15"
                  >
                    {k}
                  </li>
                ))}
              </ul>
            </div>
            <OrbiteIA />
          </div>
        </Conteneur>
      </section>

      <section className="bg-white">
        <Conteneur>
          <ul className="divide-y divide-[#E3E9F0]">
            {CAPACITES.slice(COUPURE).map((k, i) => (
              <LigneCapacite key={k.titre} c={k} i={COUPURE + i} contenu={c} l={l} />
            ))}
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
              titre={x.valide[0]}
              detail={x.valide[1]}
              className="-bottom-6 right-5"
            />
          </PhotoCadre>
          <div>
            <h2 className="text-[clamp(1.7rem,3vw,2.4rem)] font-semibold tracking-tight text-nuit">
              {x.seul}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-[#2C4558]">{x.seulTexte}</p>
            <Link
              href={chemin(l, "methode")}
              className="mt-6 inline-block font-medium text-bleu transition-colors hover:text-[#1638A8]"
            >
              {x.methode}
            </Link>
          </div>
        </Conteneur>
      </section>

      <AppelFinal />
    </>
  );
}
