import type { Metadata } from "next";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { marked } from "marked";
import { AppelFinal, Conteneur } from "@/components/site/Blocs";
import { articleParSlug, dateFr } from "@/lib/articles";

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = await articleParSlug(slug);
  if (!a) return { title: "Article introuvable" };
  return {
    title: a.titre,
    description: a.extrait,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { type: "article", title: a.titre, description: a.extrait, ...(a.image_url ? { images: [a.image_url] } : {}) },
  };
}

async function Contenu({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = await articleParSlug(slug);
  // Adresse inconnue (dont les anciens articles 2025) : retour au blog
  if (!a) permanentRedirect("/blog");
  const html = await marked.parse(a.contenu, { gfm: true });
  return (
    <>
      <section className="bg-nuit text-white">
        <Conteneur className="max-w-3xl pb-14 pt-12 sm:pt-16">
          <Link href="/blog" className="text-sm text-[#B8C6D6] hover:text-white">
            Tous les articles
          </Link>
          <p className="mt-8 text-[15px] text-[#B8C6D6]">
            {a.categorie}
            {a.publie_le && <span>, {dateFr(a.publie_le)}</span>}
          </p>
          <h1 className="mt-3 text-[clamp(2rem,4.4vw,3.2rem)] font-semibold leading-[1.1] tracking-tight">{a.titre}</h1>
          {a.extrait && <p className="mt-5 text-lg leading-relaxed text-[#C3D0DD]">{a.extrait}</p>}
        </Conteneur>
      </section>
      <article className="bg-white py-14 sm:py-16">
        <Conteneur className="max-w-3xl">
          {a.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={a.image_url} alt="" className="mb-10 aspect-[16/9] w-full rounded-2xl object-cover" />
          )}
          <div className="prose-woc" dangerouslySetInnerHTML={{ __html: html }} />
        </Conteneur>
      </article>
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
