import type { Metadata } from "next";
import { metaPage, versions } from "@/lib/seo";
import Link from "next/link";
import {
  AppelFinal,
  CarteRealisation,
  Conteneur,
  EnTetePage,
} from "@/components/site/Blocs";
import { CadreNavigateur, CadreTelephone } from "@/components/site/Cadres";
import { contenu, projetsSurMesure, sitesClients } from "@/lib/i18n/contenu";
import { chemin } from "@/lib/i18n/chemins";
import { langue, t } from "@/lib/i18n/langue";

const TEXTES = {
  fr: {
    titre: "Réalisations",
    description:
      "Applications web et mobiles, galerie d'art, sites avec réservation, sites vitrines d'entreprises : les projets conçus et développés par Web Online Concept.",
    intro:
      "Une application mobile dopée à l'IA, une galerie d'art, des sites avec réservation ou devis en ligne : chaque projet part d'objectifs précis et va jusqu'à la mise en ligne.",
    surMesure: "Projets sur mesure",
    clients: "Sites créés et suivis pour nos clients",
    clientsIntro:
      "Imprimeurs, artisans, praticiens, artiste peintre, professionnels de l'événementiel : des sites conçus, mis en ligne et suivis dans la durée, partout en France.",
    points: (nom: string) => `Points forts du site de ${nom}`,
    voir: "Voir la réalisation",
    site: "Voir le site",
    onglet: "(nouvel onglet)",
  },
  en: {
    titre: "Our work",
    description:
      "Web and mobile apps, an art gallery, websites with booking, business websites: the projects designed and built by Web Online Concept.",
    intro:
      "An AI-powered mobile app, an art gallery, websites with online booking or quotes: every project starts from clear goals and goes all the way to launch.",
    surMesure: "Custom projects",
    clients: "Websites built and maintained for our clients",
    clientsIntro:
      "Printers, tradespeople, practitioners, a painter, event professionals: websites designed, launched and looked after over time, across France.",
    points: (nom: string) => `Highlights of the ${nom} website`,
    voir: "View the project",
    site: "Visit the website",
    onglet: "(new tab)",
  },
  es: {
    titre: "Proyectos",
    description:
      "Aplicaciones web y móviles, una galería de arte, sitios con reserva, sitios corporativos: los proyectos diseñados y desarrollados por Web Online Concept.",
    intro:
      "Una aplicación móvil impulsada por la IA, una galería de arte, sitios con reserva o presupuesto en línea: cada proyecto parte de objetivos precisos y llega hasta la puesta en línea.",
    surMesure: "Proyectos a medida",
    clients: "Sitios creados y mantenidos para nuestros clientes",
    clientsIntro:
      "Imprentas, artesanos, profesionales de la salud, un pintor, profesionales de eventos: sitios diseñados, publicados y mantenidos a lo largo del tiempo, en toda Francia.",
    points: (nom: string) => `Puntos fuertes del sitio de ${nom}`,
    voir: "Ver el proyecto",
    site: "Ver el sitio",
    onglet: "(nueva pestaña)",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const l = await langue();
  const x = t(TEXTES, l);
  return metaPage(l, x.titre, x.description, versions("realisations"));
}

export default async function Realisations() {
  const c = await contenu();
  const l = c.l;
  const x = t(TEXTES, l);
  return (
    <>
      <EnTetePage illustration="realisations" titre={x.titre} intro={x.intro} />

      <section className="bg-ciel py-16 sm:py-20">
        <Conteneur>
          <h2 className="text-[clamp(1.6rem,2.6vw,2.1rem)] font-semibold tracking-tight text-nuit">
            {x.surMesure}
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {projetsSurMesure(c).map((r) => (
              <CarteRealisation key={r.slug} r={r} />
            ))}
          </div>
        </Conteneur>
      </section>

      <section id="clients" className="bg-white py-16 sm:py-20">
        <Conteneur>
          <div className="max-w-2xl">
            <h2 className="text-[clamp(1.6rem,2.6vw,2.1rem)] font-semibold tracking-tight text-nuit">
              {x.clients}
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-[#4A6178]">
              {x.clientsIntro}
            </p>
          </div>
          {/* Téléphone et tablette : une carte par site, captures ordinateur et mobile en tête.
              Ordinateur : une ligne par site, petite capture à gauche. */}
          <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:block lg:divide-y lg:divide-[#E3E9F0] lg:border-y lg:border-[#E3E9F0]">
            {sitesClients(c).map((r) => {
              const ordi = r.visuels?.find((v) => v.format === "ordinateur");
              const tel = r.visuels?.find((v) => v.format === "telephone");
              return (
                <li
                  key={r.slug}
                  className={`flex flex-col overflow-hidden rounded-2xl border border-[#DCE3EC] bg-white lg:grid lg:items-center lg:gap-10 lg:overflow-visible lg:rounded-none lg:border-0 lg:bg-transparent lg:py-7 ${
                    r.visuels?.[0]
                      ? "lg:grid-cols-[13rem_1.15fr_1.4fr_auto]"
                      : "lg:grid-cols-[1.15fr_1.4fr_auto]"
                  }`}
                >
                  {(ordi || tel) && (
                    <Link
                      href={chemin(l, "realisations", r.slug)}
                      tabIndex={-1}
                      aria-hidden="true"
                      className="relative block h-56 overflow-hidden bg-nuit lg:hidden"
                    >
                      <span
                        className="absolute -right-16 -top-20 h-64 w-64 rounded-full opacity-40 blur-2xl"
                        style={{ background: r.teinte }}
                      />
                      {ordi && (
                        <CadreNavigateur
                          v={ordi}
                          sizes="(min-width: 768px) 320px, 80vw"
                          className="absolute left-5 top-7 w-[84%]"
                        />
                      )}
                      {tel && (
                        <CadreTelephone
                          v={tel}
                          petit
                          sizes="(min-width: 768px) 100px, 28vw"
                          className="absolute right-4 top-14 w-[27%]"
                        />
                      )}
                    </Link>
                  )}
                  {r.visuels?.[0] && (
                    <Link
                      href={chemin(l, "realisations", r.slug)}
                      tabIndex={-1}
                      aria-hidden="true"
                      className="hidden lg:block"
                    >
                      <CadreNavigateur
                        v={r.visuels[0]}
                        sizes="208px"
                        className="transition-transform duration-300 hover:-translate-y-0.5"
                      />
                    </Link>
                  )}
                  <div className="flex flex-1 flex-col gap-4 p-6 lg:contents">
                    <div>
                      <h3 className="text-xl font-semibold text-nuit">
                        <Link
                          href={chemin(l, "realisations", r.slug)}
                          className="hover:text-bleu"
                        >
                          {r.nom}
                        </Link>
                      </h3>
                      <p className="mt-1 text-[15px] leading-relaxed text-[#2C4558]">
                        {r.resume?.activite}
                      </p>
                      {r.resume?.lieu && (
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
                          {r.resume?.lieu}
                        </p>
                      )}
                    </div>
                    <ul
                      className="flex flex-wrap gap-2"
                      aria-label={x.points(r.nom)}
                    >
                      {r.resume?.points.map((x) => (
                        <li
                          key={x}
                          className="rounded-full bg-ciel px-3 py-1.5 text-sm text-[#2C4558]"
                        >
                          {x}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto flex gap-3 pt-1 lg:mt-0 lg:flex-col lg:items-stretch lg:pt-0">
                      <Link
                        href={chemin(l, "realisations", r.slug)}
                        className="flex-1 rounded-full bg-nuit px-5 py-2.5 text-center text-[15px] font-medium text-white transition-colors hover:bg-[#1A3358] lg:flex-none"
                      >
                        {x.voir}
                      </Link>
                      <a
                        href={r.site.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-[#CBD5E1] text-[15px] font-medium text-nuit transition-colors hover:border-nuit max-lg:size-11 lg:px-5 lg:py-2.5"
                      >
                        {/* Téléphone et tablette : le bouton ne garde que l'icône, le texte reste lu par les lecteurs d'écran */}
                        <span className="max-lg:sr-only">{x.site}</span>
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
                        <span className="sr-only">{x.onglet}</span>
                      </a>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Conteneur>
      </section>

      <AppelFinal />
    </>
  );
}
