import type { Metadata } from "next";
import Link from "next/link";
import { metaPage, versions } from "@/lib/seo";
import { AppelFinal, Conteneur, EnTetePage } from "@/components/site/Blocs";
import DefilementEcrans from "@/components/site/DefilementEcrans";
import EventailApplication from "@/components/site/EventailApplication";
import { CarteFlottante, PhotoCadre } from "@/components/site/Photos";
import { contenu, ecransDe } from "@/lib/i18n/contenu";
import { chemin } from "@/lib/i18n/chemins";
import { langue, t } from "@/lib/i18n/langue";

// Pictogrammes au trait (24 × 24) des principes, dans l'ordre des textes
const PICTOS = [
  <>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M5 20c.8-3.7 3.6-5.8 7-5.8s6.2 2.1 7 5.8" />
  </>,
  <path d="M12 3.5l1.9 5 5 1.9-5 1.9L12 17.3l-1.9-5-5-1.9 5-1.9zM18.5 15l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" />,
  <path d="M12 2.8l7.2 3v5c0 4.6-3 8.4-7.2 10.4-4.2-2-7.2-5.8-7.2-10.4v-5zM8.8 12.1l2.2 2.2 4.3-4.4" />,
  <>
    <circle cx="8" cy="14" r="4" />
    <path d="M11 11l8.5-8.5M16.5 5.5l2.5 2.5M14 8l2 2" />
  </>,
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
];

const TEXTES = {
  fr: {
    titre: "À propos",
    description:
      "Web Online Concept, studio de développement web et d'intelligence artificielle depuis 2009 : un interlocuteur unique, la capacité de production d'une équipe entière.",
    centaines: "Des centaines",
    chiffres: [
      "création du studio",
      "de sites créés",
      "plateformes : iPhone, Android et web",
    ],
    principes: [
      [
        "Un seul interlocuteur",
        "De la première discussion à la mise en ligne, une seule personne connaît votre projet de bout en bout. Pas de relais, pas de perte d'information.",
      ],
      [
        "Les technologies de pointe",
        "Des outils modernes et l'IA générative, choisis pour leur solidité et leur capacité à évoluer avec vous.",
      ],
      [
        "Une qualité vérifiée",
        "Chaque livraison est testée, relue et sécurisée. Aller vite ne veut jamais dire aller moins bien.",
      ],
      [
        "Votre autonomie",
        "Des espaces d'administration pensés pour vous : vous faites vivre votre site ou votre application sans dépendre de personne.",
      ],
    ],
    mobile: "iOS et Android",
    descendre: "Descendre vers l'histoire du studio",
    h1: "Un studio de développement web, depuis 2009",
    intro:
      "Plus de quinze ans à concevoir des sites et des applications, et aujourd'hui une façon de travailler transformée par l'IA : un interlocuteur unique, avec la capacité de production d'une équipe entière.",
    ici: ["Conçu et testé ici", "Sur tous les formats d'écran"],
    histoire: "Plus de quinze ans de projets",
    histoire1:
      "Le studio est né en 2009. Depuis, il conçoit et fait vivre des sites pour des artisans, des imprimeurs, des praticiens ou des artistes, et développe aujourd'hui ses propres applications.",
    histoire2:
      "Avec l'IA, la façon de travailler a changé : un seul interlocuteur dispose désormais de la capacité de production d'une équipe entière.",
    guide: "Ce qui guide chaque projet",
    tests: ["Tests réussis", "Prêt pour votre validation"],
    stores: ["App Store, Google Play et web", "Disponible partout"],
    editeur: "Studio, et éditeur d'applications",
    editeurTexte:
      "En plus des projets menés pour nos clients, nous concevons et éditons nos propres applications grand public. MemoDay, la première, est disponible sur l'App Store, Google Play et le web. D'autres sont en préparation.",
    memoday: "Découvrir MemoDay",
    outils: "Des outils à la pointe",
    outilsTexte:
      "Les technologies qui font tourner les services les plus exigeants, les meilleures IA du moment, et une veille permanente : chaque nouveauté utile vient renforcer vos projets.",
    voir: "Voir ce que nous réalisons",
  },
  en: {
    titre: "About",
    description:
      "Web Online Concept, a web development and artificial intelligence studio since 2009: a single point of contact, with the production capacity of an entire team.",
    centaines: "Hundreds",
    chiffres: [
      "studio founded",
      "of websites built",
      "platforms: iPhone, Android and web",
    ],
    principes: [
      [
        "A single point of contact",
        "From the first conversation to launch, one person knows your project inside out. No hand-offs, no lost information.",
      ],
      [
        "Cutting-edge technology",
        "Modern tools and generative AI, chosen for their reliability and their ability to grow with you.",
      ],
      [
        "Proven quality",
        "Every release is tested, reviewed and secured. Moving fast never means cutting corners.",
      ],
      [
        "Your independence",
        "Admin areas designed for you: you keep your website or app alive without depending on anyone.",
      ],
    ],
    mobile: "iOS and Android",
    descendre: "Scroll down to the studio's story",
    h1: "A web development studio, since 2009",
    intro:
      "Over fifteen years designing websites and apps, and today a way of working transformed by AI: a single point of contact, with the production capacity of an entire team.",
    ici: ["Designed and tested here", "On every screen size"],
    histoire: "Over fifteen years of projects",
    histoire1:
      "The studio was founded in 2009. Since then, it has designed and maintained websites for tradespeople, printers, practitioners and artists, and today it also builds its own apps.",
    histoire2:
      "With AI, the way we work has changed: a single point of contact now has the production capacity of an entire team.",
    guide: "What guides every project",
    tests: ["Tests passed", "Ready for your approval"],
    stores: ["App Store, Google Play and web", "Available everywhere"],
    editeur: "A studio, and an app publisher",
    editeurTexte:
      "Alongside the projects we deliver for our clients, we design and publish our own consumer apps. MemoDay, the first one, is available on the App Store, Google Play and the web. More are on the way.",
    memoday: "Discover MemoDay",
    outils: "Cutting-edge tools",
    outilsTexte:
      "The technologies behind the most demanding services, today's best AIs, and a constant watch on what's new: every useful innovation strengthens your projects.",
    voir: "See what we build",
  },
  es: {
    titre: "Nosotros",
    description:
      "Web Online Concept, estudio de desarrollo web e inteligencia artificial desde 2009: un único interlocutor, con la capacidad de producción de un equipo entero.",
    centaines: "Cientos",
    chiffres: [
      "creación del estudio",
      "de sitios creados",
      "plataformas: iPhone, Android y web",
    ],
    principes: [
      [
        "Un único interlocutor",
        "Desde la primera conversación hasta la puesta en línea, una sola persona conoce su proyecto de principio a fin. Sin intermediarios ni información perdida.",
      ],
      [
        "Tecnologías de vanguardia",
        "Herramientas modernas e IA generativa, elegidas por su solidez y su capacidad para evolucionar con usted.",
      ],
      [
        "Una calidad verificada",
        "Cada entrega se prueba, se revisa y se protege. Ir rápido nunca significa hacerlo peor.",
      ],
      [
        "Su autonomía",
        "Paneles de administración pensados para usted: mantiene vivo su sitio o su aplicación sin depender de nadie.",
      ],
    ],
    mobile: "iOS y Android",
    descendre: "Bajar a la historia del estudio",
    h1: "Un estudio de desarrollo web, desde 2009",
    intro:
      "Más de quince años diseñando sitios y aplicaciones, y hoy una forma de trabajar transformada por la IA: un único interlocutor, con la capacidad de producción de un equipo entero.",
    ici: ["Diseñado y probado aquí", "En todos los formatos de pantalla"],
    histoire: "Más de quince años de proyectos",
    histoire1:
      "El estudio nació en 2009. Desde entonces, diseña y mantiene sitios para artesanos, imprentas, profesionales de la salud y artistas, y hoy desarrolla también sus propias aplicaciones.",
    histoire2:
      "Con la IA, la forma de trabajar ha cambiado: un único interlocutor dispone ahora de la capacidad de producción de un equipo entero.",
    guide: "Lo que guía cada proyecto",
    tests: ["Pruebas superadas", "Listo para su aprobación"],
    stores: ["App Store, Google Play y web", "Disponible en todas partes"],
    editeur: "Estudio y editor de aplicaciones",
    editeurTexte:
      "Además de los proyectos que realizamos para nuestros clientes, diseñamos y publicamos nuestras propias aplicaciones para el gran público. MemoDay, la primera, está disponible en el App Store, Google Play y la web. Otras están en preparación.",
    memoday: "Descubrir MemoDay",
    outils: "Herramientas de vanguardia",
    outilsTexte:
      "Las tecnologías que mueven los servicios más exigentes, las mejores IA del momento y una vigilancia permanente: cada novedad útil refuerza sus proyectos.",
    voir: "Ver lo que realizamos",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const l = await langue();
  const x = t(TEXTES, l);
  return metaPage(l, x.titre, x.description, versions("a-propos"));
}

const H2 = "text-[clamp(1.8rem,3vw,2.5rem)] font-semibold tracking-tight";

export default async function APropos() {
  const c = await contenu();
  const { l, IA, PHOTOS } = c;
  const x = t(TEXTES, l);
  const CHIFFRES = [
    { valeur: "2009", libelle: x.chiffres[0] },
    { valeur: x.centaines, libelle: x.chiffres[1] },
    { valeur: "3", libelle: x.chiffres[2] },
  ];
  const PRINCIPES = x.principes.map(([titre, texte], i) => ({
    titre,
    texte,
    picto: PICTOS[i],
  }));
  const NOMS_IA = IA.modeles.map((m) => m.nom);
  const outils = [...OUTILS, x.mobile];
  return (
    <>
      <DefilementEcrans />
      <EnTetePage
        ecran
        suite={{ id: "histoire", libelle: x.descendre }}
        illustration="apropos"
        titre={x.h1}
        intro={x.intro}
      />

      {/* Histoire */}
      <section id="histoire" className="ecran bg-white py-20 sm:py-24">
        <Conteneur>
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
            <PhotoCadre
              photo={PHOTOS.poste}
              sizes="(min-width: 1024px) 540px, 92vw"
              className="aspect-[16/11]"
            >
              <CarteFlottante
                icone="appareils"
                titre={x.ici[0]}
                detail={x.ici[1]}
                className="-bottom-6 left-5"
              />
            </PhotoCadre>
            <div>
              <h2 className={`${H2} text-nuit`}>{x.histoire}</h2>
              <p className="mt-5 text-[18px] leading-relaxed text-[#2C4558]">
                {x.histoire1}
              </p>
              <p className="mt-4 text-[18px] leading-relaxed text-[#2C4558]">
                {x.histoire2}
              </p>
            </div>
          </div>
          <dl className="mt-14 grid gap-8 border-t border-[#E3E9F0] pt-10 lg:grid-cols-[1fr_1.4fr_1fr]">
            {CHIFFRES.map((c) => (
              <div
                key={c.libelle}
                className="flex flex-col-reverse text-center"
              >
                <dt className="mt-3 text-[15px] text-[#4A6178]">{c.libelle}</dt>
                <dd className="bg-[linear-gradient(120deg,#1F5EFF,#00B4D8_55%,#2BD47D)] bg-clip-text pb-1 text-[clamp(2.4rem,3.4vw,3.2rem)] font-semibold leading-none tracking-tight whitespace-nowrap text-transparent">
                  {c.valeur}
                </dd>
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
              <h2 className={`${H2} text-nuit`}>{x.guide}</h2>
              <ul className="mt-10 grid gap-x-8 gap-y-9 sm:grid-cols-2">
                {PRINCIPES.map((p) => (
                  <li key={p.titre}>
                    {/* Pictogramme à gauche du titre */}
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#1F5EFF,#00B4D8)] text-white">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-[18px] w-[18px]"
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
                      <h3 className="text-lg font-semibold leading-snug text-nuit">
                        {p.titre}
                      </h3>
                    </div>
                    <p className="mt-3 text-[15px] leading-relaxed text-[#2C4558]">
                      {p.texte}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <PhotoCadre
              photo={PHOTOS.ultralarge}
              sizes="(min-width: 1024px) 560px, 92vw"
              className="aspect-[4/3]"
            >
              <CarteFlottante
                icone="coche"
                titre={x.tests[0]}
                detail={x.tests[1]}
                retard={0.8}
                className="-bottom-6 right-5"
              />
            </PhotoCadre>
          </div>
        </Conteneur>
      </section>

      {/* Studio et éditeur */}
      <section className="ecran relative overflow-hidden bg-nuit py-20 text-white sm:py-24">
        <div
          aria-hidden="true"
          className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-bleu opacity-20 blur-3xl"
        />
        <Conteneur className="relative">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[16/11]">
              <EventailApplication
                ecrans={ecransDe(c, "memoday")}
                sizes="(min-width: 1024px) 180px, 30vw"
              />
              <CarteFlottante
                icone="appareils"
                titre={x.stores[0]}
                detail={x.stores[1]}
                className="-bottom-6 right-5 z-20"
              />
            </div>
            <div>
              <h2 className={H2}>{x.editeur}</h2>
              <p className="mt-5 text-[18px] leading-relaxed text-[#C3D0DD]">
                {x.editeurTexte}
              </p>
              <Link
                href={chemin(l, "realisations", "memoday")}
                className="mt-6 inline-block font-medium text-[#7CCBFF] transition-colors hover:text-white"
              >
                {x.memoday}
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
              <h2 className={`${H2} text-nuit`}>{x.outils}</h2>
              <p className="mt-5 text-[18px] leading-relaxed text-[#2C4558]">
                {x.outilsTexte}
              </p>
              <Link
                href={chemin(l, "capacites")}
                className="mt-6 inline-block font-medium text-bleu transition-colors hover:text-[#1638A8]"
              >
                {x.voir}
              </Link>
            </div>
            <div className="relative overflow-hidden rounded-3xl bg-ciel p-8 sm:p-10">
              <div
                aria-hidden="true"
                className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-cyan opacity-15 blur-3xl"
              />
              <ul className="relative flex flex-wrap justify-center gap-3">
                {[...NOMS_IA, ...outils].map((o, i) => {
                  const ia = i < NOMS_IA.length;
                  return (
                    <li
                      key={o}
                      className={`flotte flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[15px] font-medium shadow-[0_14px_30px_-20px_rgba(10,26,47,0.5)] ${
                        ia
                          ? "bg-[linear-gradient(135deg,#1F5EFF,#00B4D8)] text-white"
                          : "bg-white text-nuit ring-1 ring-[#E3E9F0]"
                      }`}
                      style={{ animationDelay: `${(i % 5) * 0.7}s` }}
                    >
                      {ia && (
                        <svg
                          viewBox="0 0 24 24"
                          className="h-3.5 w-3.5"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M12 2.5l2.4 6.6 6.6 2.4-6.6 2.4L12 20.5l-2.4-6.6L3 11.5l6.6-2.4z" />
                        </svg>
                      )}
                      {o}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Conteneur>
      </section>

      <AppelFinal />
    </>
  );
}
