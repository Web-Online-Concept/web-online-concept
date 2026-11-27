import type { Metadata } from "next";
import Link from "next/link";
import { metaPage, versions } from "@/lib/seo";
import { AppelFinal, Conteneur, EnTetePage } from "@/components/site/Blocs";
import CouvertureArticle from "@/components/site/CouvertureArticle";
import { articlesPublies, dateLocale, tempsLecture, type Article } from "@/lib/articles";
import { chemin, type Langue } from "@/lib/i18n/chemins";
import { langue, t } from "@/lib/i18n/langue";

const TEXTES = {
  fr: {
    description: "IA, développement web et coulisses des projets : les articles de Web Online Concept.",
    intro: "IA, développement et coulisses des projets : ce qui change vraiment dans la façon de construire le web.",
    lecture: "min de lecture",
    bientot: "Les premiers articles arrivent très bientôt.",
    attente: "En attendant, découvrez nos réalisations.",
    voir: "Voir les réalisations",
    lire: "Lire l'article",
  },
  en: {
    description: "AI, web development and behind-the-scenes stories from our projects: articles by Web Online Concept.",
    intro: "AI, development and behind the scenes of our projects: what's really changing in the way the web is built.",
    lecture: "min read",
    bientot: "Our first articles are coming very soon.",
    attente: "In the meantime, take a look at our work.",
    voir: "See our work",
    lire: "Read the article",
  },
  es: {
    description: "IA, desarrollo web y entresijos de los proyectos: los artículos de Web Online Concept.",
    intro: "IA, desarrollo y entresijos de los proyectos: lo que de verdad cambia en la forma de construir la web.",
    lecture: "min de lectura",
    bientot: "Los primeros artículos llegarán muy pronto.",
    attente: "Mientras tanto, descubra nuestros proyectos.",
    voir: "Ver los proyectos",
    lire: "Leer el artículo",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const l = await langue();
  return metaPage(l, "Blog", t(TEXTES, l).description, versions("blog"));
}

function Meta({ a, l, clair = false }: { a: Article; l: Langue; clair?: boolean }) {
  return (
    <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-sm ${clair ? "text-[#B8C6D6]" : "text-[#4A6178]"}`}>
      <span className={`rounded-full px-3 py-1 font-medium ${clair ? "bg-white/10 text-white" : "bg-[#E8EFFF] text-[#1638A8]"}`}>{a.categorie}</span>
      {a.publie_le && <span>{dateLocale(a.publie_le, l)}</span>}
      <span>
        {tempsLecture(a.contenu)} {t(TEXTES, l).lecture}
      </span>
    </p>
  );
}

export default async function Blog() {
  const l = await langue();
  const x = t(TEXTES, l);
  const articles = await articlesPublies(l);
  const [une, ...suite] = articles;
  return (
    <>
      <EnTetePage illustration="blog" titre="Blog" intro={x.intro} />
      <section className="bg-white py-16 sm:py-20">
        <Conteneur>
          {!une ? (
            <div className="rounded-2xl bg-ciel p-10 text-center">
              <p className="text-xl font-semibold text-nuit">{x.bientot}</p>
              <p className="mt-2 text-[#4A6178]">{x.attente}</p>
              <Link
                href={chemin(l, "realisations")}
                className="mt-6 inline-block rounded-full bg-bleu px-6 py-3 font-medium text-white hover:bg-[#3A72FF]"
              >
                {x.voir}
              </Link>
            </div>
          ) : (
            <>
              {/* Article à la une */}
              <Link
                href={chemin(l, "blog", une.slug)}
                className="group grid items-center gap-8 rounded-3xl bg-ciel p-4 transition-shadow hover:shadow-[0_30px_60px_-36px_rgba(10,26,47,0.5)] sm:p-5 lg:grid-cols-[1.15fr_1fr] lg:gap-12 lg:pr-12"
              >
                <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
                  <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.02]">
                    <CouvertureArticle image={une.image_url} categorie={une.categorie} priorite />
                  </div>
                </div>
                <div className="px-2 pb-4 lg:p-0">
                  <Meta a={une} l={l} />
                  <h2 className="mt-5 text-[clamp(1.6rem,2.8vw,2.3rem)] font-semibold leading-tight tracking-tight text-nuit transition-colors group-hover:text-bleu">
                    {une.titre}
                  </h2>
                  {une.extrait && <p className="mt-4 text-[17px] leading-relaxed text-[#2C4558]">{une.extrait}</p>}
                  <span className="mt-6 inline-block font-medium text-bleu">{x.lire}</span>
                </div>
              </Link>

              {suite.length > 0 && (
                <ul className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {suite.map((a) => (
                    <li key={a.slug}>
                      <Link
                        href={chemin(l, "blog", a.slug)}
                        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#DCE3EC] bg-white transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(10,26,47,0.45)]"
                      >
                        <div className="relative aspect-[16/9] overflow-hidden">
                          <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]">
                            <CouvertureArticle image={a.image_url} categorie={a.categorie} />
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col p-6">
                          <Meta a={a} l={l} />
                          <h2 className="mt-4 text-xl font-semibold leading-snug text-nuit transition-colors group-hover:text-bleu">{a.titre}</h2>
                          {a.extrait && <p className="mt-3 text-[15px] leading-relaxed text-[#2C4558]">{a.extrait}</p>}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </Conteneur>
      </section>
      <AppelFinal />
    </>
  );
}
