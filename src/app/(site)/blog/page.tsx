import type { Metadata } from "next";
import Link from "next/link";
import { metaPage } from "@/lib/seo";
import { AppelFinal, Conteneur, EnTetePage } from "@/components/site/Blocs";
import CouvertureArticle from "@/components/site/CouvertureArticle";
import { articlesPublies, dateFr, tempsLecture, type Article } from "@/lib/articles";

export const metadata: Metadata = metaPage("Blog", "IA, développement web et coulisses des projets : les articles de Web Online Concept.", "/blog");

function Meta({ a, clair = false }: { a: Article; clair?: boolean }) {
  return (
    <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-sm ${clair ? "text-[#B8C6D6]" : "text-[#4A6178]"}`}>
      <span className={`rounded-full px-3 py-1 font-medium ${clair ? "bg-white/10 text-white" : "bg-[#E8EFFF] text-[#1638A8]"}`}>{a.categorie}</span>
      {a.publie_le && <span>{dateFr(a.publie_le)}</span>}
      <span>{tempsLecture(a.contenu)} min de lecture</span>
    </p>
  );
}

export default async function Blog() {
  const articles = await articlesPublies();
  const [une, ...suite] = articles;
  return (
    <>
      <EnTetePage
        illustration="blog"
        titre="Blog"
        intro="IA, développement et coulisses des projets : ce qui change vraiment dans la façon de construire le web."
      />
      <section className="bg-white py-16 sm:py-20">
        <Conteneur>
          {!une ? (
            <div className="rounded-2xl bg-ciel p-10 text-center">
              <p className="text-xl font-semibold text-nuit">Les premiers articles arrivent très bientôt.</p>
              <p className="mt-2 text-[#4A6178]">En attendant, découvrez nos réalisations.</p>
              <Link
                href="/realisations"
                className="mt-6 inline-block rounded-full bg-bleu px-6 py-3 font-medium text-white hover:bg-[#3A72FF]"
              >
                Voir les réalisations
              </Link>
            </div>
          ) : (
            <>
              {/* Article à la une */}
              <Link
                href={`/blog/${une.slug}`}
                className="group grid items-center gap-8 rounded-3xl bg-ciel p-4 transition-shadow hover:shadow-[0_30px_60px_-36px_rgba(10,26,47,0.5)] sm:p-5 lg:grid-cols-[1.15fr_1fr] lg:gap-12 lg:pr-12"
              >
                <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
                  <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.02]">
                    <CouvertureArticle image={une.image_url} categorie={une.categorie} priorite />
                  </div>
                </div>
                <div className="px-2 pb-4 lg:p-0">
                  <Meta a={une} />
                  <h2 className="mt-5 text-[clamp(1.6rem,2.8vw,2.3rem)] font-semibold leading-tight tracking-tight text-nuit transition-colors group-hover:text-bleu">
                    {une.titre}
                  </h2>
                  {une.extrait && <p className="mt-4 text-[17px] leading-relaxed text-[#2C4558]">{une.extrait}</p>}
                  <span className="mt-6 inline-block font-medium text-bleu">Lire l&apos;article</span>
                </div>
              </Link>

              {suite.length > 0 && (
                <ul className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {suite.map((a) => (
                    <li key={a.slug}>
                      <Link
                        href={`/blog/${a.slug}`}
                        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#DCE3EC] bg-white transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(10,26,47,0.45)]"
                      >
                        <div className="relative aspect-[16/9] overflow-hidden">
                          <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]">
                            <CouvertureArticle image={a.image_url} categorie={a.categorie} />
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col p-6">
                          <Meta a={a} />
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
