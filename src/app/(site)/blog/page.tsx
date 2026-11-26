import type { Metadata } from "next";
import { metaPage } from "@/lib/seo";
import Link from "next/link";
import { AppelFinal, Conteneur, EnTetePage } from "@/components/site/Blocs";
import { articlesPublies, dateFr } from "@/lib/articles";

export const metadata: Metadata = metaPage("Blog", "IA, développement web et coulisses des projets : les articles de Web Online Concept.", "/blog");

export default async function Blog() {
  const articles = await articlesPublies();
  return (
    <>
      <EnTetePage
        illustration="blog"
        titre="Blog"
        intro="IA, développement et coulisses des projets : ce qui change vraiment dans la façon de construire le web."
      />
      <section className="bg-white py-16 sm:py-20">
        <Conteneur>
          {articles.length === 0 ? (
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
            <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <li key={a.slug}>
                  <Link href={`/blog/${a.slug}`} className="group flex h-full flex-col rounded-2xl border border-[#DCE3EC] p-6 hover:border-nuit">
                    <p className="text-sm text-[#4A6178]">
                      {a.categorie}
                      {a.publie_le && <span>, {dateFr(a.publie_le)}</span>}
                    </p>
                    <h2 className="mt-3 text-xl font-semibold leading-snug text-nuit transition-colors group-hover:text-bleu">{a.titre}</h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-[#2C4558]">{a.extrait}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Conteneur>
      </section>
      <AppelFinal />
    </>
  );
}
