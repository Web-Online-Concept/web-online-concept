import type { Metadata } from "next";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { Marked, type Tokens } from "marked";
import { AppelFinal, Conteneur } from "@/components/site/Blocs";
import CouvertureArticle from "@/components/site/CouvertureArticle";
import Partage from "@/components/site/Partage";
import { ancre, articleParSlug, articlesPublies, dateFr, tempsLecture } from "@/lib/articles";
import { SITE } from "@/lib/contenu";
import { IMAGE_PARTAGE } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = await articleParSlug(slug);
  if (!a) return { title: "Article introuvable" };
  return {
    title: a.titre,
    description: a.extrait,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      locale: "fr_FR",
      siteName: "Web Online Concept",
      title: a.titre,
      description: a.extrait,
      url: `/blog/${slug}`,
      ...(a.publie_le ? { publishedTime: a.publie_le } : {}),
      images: a.image_url ? [a.image_url] : [IMAGE_PARTAGE],
    },
    twitter: { card: "summary_large_image", title: a.titre, description: a.extrait, images: [a.image_url ?? IMAGE_PARTAGE.url] },
  };
}

// Markdown → HTML, avec une ancre sur chaque intertitre de niveau 2 (pour le sommaire)
const md = new Marked({
  gfm: true,
  renderer: {
    heading({ tokens, depth, text }: Tokens.Heading) {
      const contenu = this.parser.parseInline(tokens);
      return depth === 2 ? `<h2 id="${ancre(text)}">${contenu}</h2>\n` : `<h${depth}>${contenu}</h${depth}>\n`;
    },
    // Images dans le texte : chargement différé
    image({ href, text }: Tokens.Image) {
      const alt = text.replace(/"/g, "&quot;");
      return `<img src="${href}" alt="${alt}" loading="lazy" decoding="async">`;
    },
  },
});

async function Contenu({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = await articleParSlug(slug);
  // Adresse inconnue (dont les anciens articles 2025) : retour au blog
  if (!a) permanentRedirect("/blog");
  const html = await md.parse(a.contenu);
  const sommaire = md
    .lexer(a.contenu)
    .filter((t): t is Tokens.Heading => t.type === "heading" && t.depth === 2)
    .map((t) => ({ id: ancre(t.text), titre: t.text }));
  const autres = (await articlesPublies()).filter((x) => x.slug !== a.slug).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-nuit text-white">
        <div aria-hidden="true" className="absolute -right-24 -top-32 h-[28rem] w-[28rem] rounded-full bg-bleu opacity-25 blur-3xl" />
        <Conteneur className="relative max-w-4xl pb-40 pt-12 sm:pb-48 sm:pt-16">
          <Link href="/blog" className="text-sm text-[#B8C6D6] transition-colors hover:text-white">
            Tous les articles
          </Link>
          <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#B8C6D6]">
            <span className="rounded-full bg-white/10 px-3 py-1 font-medium text-white">{a.categorie}</span>
            {a.publie_le && <span>{dateFr(a.publie_le)}</span>}
            <span>{tempsLecture(a.contenu)} min de lecture</span>
          </p>
          <h1 className="mt-5 text-[clamp(2rem,4.4vw,3.3rem)] font-semibold leading-[1.1] tracking-tight text-balance">{a.titre}</h1>
          {a.extrait && <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#C3D0DD]">{a.extrait}</p>}
        </Conteneur>
      </section>

      <article className="bg-white pb-16 sm:pb-20">
        <Conteneur className="max-w-5xl">
          <div className="relative -mt-28 aspect-[16/9] overflow-hidden rounded-3xl shadow-[0_40px_80px_-40px_rgba(10,26,47,0.6)] sm:-mt-36">
            <CouvertureArticle image={a.image_url} categorie={a.categorie} priorite />
          </div>

          <div className={`mt-14 grid gap-12 ${sommaire.length > 2 ? "lg:grid-cols-[minmax(0,1fr)_15rem]" : ""}`}>
            <div className="min-w-0 max-w-3xl">
              <div className="prose-woc prose-article" dangerouslySetInnerHTML={{ __html: html }} />
              <div className="mt-14 border-t border-[#E3E9F0] pt-8">
                <Partage url={`${SITE.url}/blog/${slug}`} titre={a.titre} />
              </div>
            </div>
            {sommaire.length > 2 && (
              <nav aria-label="Sommaire de l'article" className="hidden lg:block">
                <div className="sticky top-28 rounded-2xl bg-ciel p-6">
                  <p className="text-sm font-semibold text-nuit">Dans cet article</p>
                  <ol className="mt-4 flex flex-col gap-3 border-l-2 border-[#DCE3EC] pl-4">
                    {sommaire.map((s) => (
                      <li key={s.id}>
                        <a href={`#${s.id}`} className="block text-[14px] leading-snug text-[#4A6178] transition-colors hover:text-bleu">
                          {s.titre}
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              </nav>
            )}
          </div>
        </Conteneur>
      </article>

      {autres.length > 0 && (
        <section className="bg-ciel py-16 sm:py-20">
          <Conteneur>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-2xl font-semibold text-nuit">À lire aussi</h2>
              <Link href="/blog" className="font-medium text-bleu transition-colors hover:text-[#1638A8]">
                Tous les articles
              </Link>
            </div>
            <ul className="mt-8 grid gap-6 md:grid-cols-3">
              {autres.map((x) => (
                <li key={x.slug}>
                  <Link
                    href={`/blog/${x.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#DCE3EC] bg-white transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(10,26,47,0.45)]"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <CouvertureArticle image={x.image_url} categorie={x.categorie} />
                    </div>
                    <div className="p-5">
                      <p className="text-sm text-[#4A6178]">{x.categorie}</p>
                      <h3 className="mt-2 text-lg font-semibold leading-snug text-nuit transition-colors group-hover:text-bleu">{x.titre}</h3>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Conteneur>
        </section>
      )}
    </>
  );
}

export default function PageArticle({ params }: PageProps<"/blog/[slug]">) {
  return (
    <>
      <Suspense fallback={<div className="min-h-[60vh] bg-nuit" />}>
        <Contenu params={params} />
      </Suspense>
      <AppelFinal />
    </>
  );
}
