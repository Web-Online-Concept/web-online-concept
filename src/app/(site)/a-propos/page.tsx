import type { Metadata } from "next";
import Link from "next/link";
import { metaPage } from "@/lib/seo";
import { AppelFinal, Conteneur, EnTetePage } from "@/components/site/Blocs";
import DefilementEcrans from "@/components/site/DefilementEcrans";
import EventailApplication from "@/components/site/EventailApplication";
import { CarteFlottante, PhotoCadre } from "@/components/site/Photos";
import { PHOTOS, REALISATIONS, ecransApplication } from "@/lib/contenu";

export const metadata: Metadata = metaPage("À propos", "Web Online Concept, studio de développement web et d'intelligence artificielle à Toulouse depuis 2009 : un interlocuteur unique, la capacité de production d'une équipe entière.", "/a-propos");

const CHIFFRES = [
  { valeur: "2009", libelle: "création du studio, à Toulouse" },
  { valeur: String(REALISATIONS.length), libelle: "réalisations présentées sur ce site" },
  { valeur: "3", libelle: "plateformes : iPhone, Android et web" },
];

// Pictogrammes au trait (24 × 24) des principes
const PRINCIPES = [
  {
    titre: "Un seul interlocuteur",
    texte: "De la première discussion à la mise en ligne, une seule personne connaît votre projet de bout en bout. Pas de relais, pas de perte d'information.",
    picto: (
      <>
        <circle cx="12" cy="8" r="3.6" />
        <path d="M5 20c.8-3.7 3.6-5.8 7-5.8s6.2 2.1 7 5.8" />
      </>
    ),
  },
  {
    titre: "Les technologies de pointe",
    texte: "Des outils modernes et l'IA générative, choisis pour leur solidité et leur capacité à évoluer avec vous.",
    picto: <path d="M12 3.5l1.9 5 5 1.9-5 1.9L12 17.3l-1.9-5-5-1.9 5-1.9zM18.5 15l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" />,
  },
  {
    titre: "Une qualité vérifiée",
    texte: "Chaque livraison est testée, relue et sécurisée. Aller vite ne veut jamais dire aller moins bien.",
    picto: <path d="M12 2.8l7.2 3v5c0 4.6-3 8.4-7.2 10.4-4.2-2-7.2-5.8-7.2-10.4v-5zM8.8 12.1l2.2 2.2 4.3-4.4" />,
  },
  {
    titre: "Votre autonomie",
    texte: "Des espaces d'administration pensés pour vous : vous faites vivre votre site ou votre application sans dépendre de personne.",
    picto: (
      <>
        <circle cx="8" cy="14" r="4" />
        <path d="M11 11l8.5-8.5M16.5 5.5l2.5 2.5M14 8l2 2" />
      </>
    ),
  },
];

const OUTILS = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Supabase",
  "PostgreSQL",
  "Vercel",
  "Stripe",
  "IA générative",
  "Recherche par le sens",
  "iOS et Android",
  "Données structurées",
];

const H2 = "text-[clamp(1.8rem,3vw,2.5rem)] font-semibold tracking-tight";

export default function APropos() {
  return (
    <>
      <DefilementEcrans />
      <EnTetePage
        ecran
        suite={{ id: "histoire", libelle: "Descendre vers l'histoire du studio" }}
        illustration="apropos"
        titre="Un studio de développement web à Toulouse, depuis 2009"
        intro="Plus de quinze ans à concevoir des sites et des applications, et aujourd'hui une façon de travailler transformée par l'IA : un interlocuteur unique, avec la capacité de production d'une équipe entière."
      />

      {/* Histoire */}
      <section id="histoire" className="ecran bg-white py-20 sm:py-24">
        <Conteneur>
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
            <PhotoCadre photo={PHOTOS.poste} sizes="(min-width: 1024px) 540px, 92vw" className="aspect-[16/11]">
              <CarteFlottante icone="appareils" titre="Conçu et testé ici" detail="Sur tous les formats d'écran" className="-bottom-6 left-5" />
            </PhotoCadre>
            <div>
              <h2 className={`${H2} text-nuit`}>Plus de quinze ans de projets</h2>
              <p className="mt-5 text-[18px] leading-relaxed text-[#2C4558]">
                Le studio est né à Toulouse en 2009. Depuis, il conçoit et fait vivre des sites pour des artisans, des imprimeurs, des praticiens ou des
                artistes, et développe aujourd&apos;hui ses propres applications.
              </p>
              <p className="mt-4 text-[18px] leading-relaxed text-[#2C4558]">
                Avec l&apos;IA, la façon de travailler a changé : un seul interlocuteur dispose désormais de la capacité de production d&apos;une équipe
                entière.
              </p>
            </div>
          </div>
          <dl className="mt-14 grid gap-8 border-t border-[#E3E9F0] pt-10 sm:grid-cols-3">
            {CHIFFRES.map((c) => (
              <div key={c.libelle} className="flex flex-col-reverse text-center">
                <dt className="mt-3 text-[15px] text-[#4A6178]">{c.libelle}</dt>
                <dd className="text-[clamp(2.2rem,4vw,3rem)] font-semibold leading-none tracking-tight text-nuit">{c.valeur}</dd>
              </div>
            ))}
          </dl>
        </Conteneur>
      </section>

      {/* Principes */}
      <section className="ecran bg-ciel py-20 sm:py-24">
        <Conteneur>
          <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div>
              <h2 className={`${H2} text-nuit`}>Ce qui guide chaque projet</h2>
              <ul className="mt-10 grid gap-x-8 gap-y-9 sm:grid-cols-2">
                {PRINCIPES.map((p) => (
                  <li key={p.titre}>
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#1F5EFF,#00B4D8)] text-white">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        {p.picto}
                      </svg>
                    </span>
                    <h3 className="mt-4 text-lg font-semibold text-nuit">{p.titre}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-[#2C4558]">{p.texte}</p>
                  </li>
                ))}
              </ul>
            </div>
            <PhotoCadre photo={PHOTOS.ultralarge} sizes="(min-width: 1024px) 560px, 92vw" className="aspect-[4/3]">
              <CarteFlottante icone="coche" titre="Tests réussis" detail="Prêt pour votre validation" retard={0.8} className="-bottom-6 right-5" />
            </PhotoCadre>
          </div>
        </Conteneur>
      </section>

      {/* Studio et éditeur */}
      <section className="ecran relative overflow-hidden bg-nuit py-20 text-white sm:py-24">
        <div aria-hidden="true" className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-bleu opacity-20 blur-3xl" />
        <Conteneur className="relative">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[16/11]">
              <EventailApplication ecrans={ecransApplication("memoday")} sizes="(min-width: 1024px) 180px, 30vw" />
              <CarteFlottante icone="appareils" titre="App Store, Google Play et web" detail="Disponible partout" className="-bottom-6 right-5 z-20" />
            </div>
            <div>
              <h2 className={H2}>Studio, et éditeur d&apos;applications</h2>
              <p className="mt-5 text-[18px] leading-relaxed text-[#C3D0DD]">
                En plus des projets menés pour nos clients, nous concevons et éditons nos propres applications grand public. MemoDay, la première, est
                disponible sur l&apos;App Store, Google Play et le web. D&apos;autres sont en préparation.
              </p>
              <Link href="/realisations/memoday" className="mt-6 inline-block font-medium text-[#7CCBFF] transition-colors hover:text-white">
                Découvrir MemoDay
              </Link>
            </div>
          </div>
        </Conteneur>
      </section>

      {/* Outils */}
      <section className="ecran bg-white py-20 sm:py-24">
        <Conteneur>
          <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
            <div>
              <h2 className={`${H2} text-nuit`}>Des outils à la pointe</h2>
              <p className="mt-5 text-[18px] leading-relaxed text-[#2C4558]">
                Les technologies qui font tourner les services les plus exigeants, et une veille permanente : chaque nouveauté utile vient renforcer vos
                projets.
              </p>
              <Link href="/capacites" className="mt-6 inline-block font-medium text-bleu transition-colors hover:text-[#1638A8]">
                Voir ce que nous réalisons
              </Link>
            </div>
            <div className="relative overflow-hidden rounded-3xl bg-ciel p-8 sm:p-10">
              <div aria-hidden="true" className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-cyan opacity-15 blur-3xl" />
              <ul className="relative flex flex-wrap justify-center gap-3">
                {OUTILS.map((o, i) => (
                  <li
                    key={o}
                    className="flotte rounded-full bg-white px-5 py-2.5 text-[15px] font-medium text-nuit shadow-[0_14px_30px_-20px_rgba(10,26,47,0.5)] ring-1 ring-[#E3E9F0]"
                    style={{ animationDelay: `${(i % 5) * 0.7}s` }}
                  >
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Conteneur>
      </section>

      <AppelFinal />
    </>
  );
}
