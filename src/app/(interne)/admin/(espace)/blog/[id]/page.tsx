import { marked } from "marked";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import FormulaireArticle from "@/components/admin/FormulaireArticle";
import { Alerte, Carte, Chargement, classeBoutonDanger, classeBoutonSecondaire, TitrePage } from "@/components/admin/ui";
import { exigerAdmin } from "@/lib/admin/acces";
import { enregistrerArticle, supprimerArticle } from "../actions";

export const metadata = { title: "Article" };

type Sp = { erreur?: string; enregistre?: string };

async function Contenu({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Sp> }) {
  const sb = await exigerAdmin();
  const { id } = await params;
  const sp = await searchParams;
  const { data: a } = await sb.from("articles").select("*").eq("id", id).maybeSingle();
  if (!a) notFound();
  const html = await marked.parse(a.contenu ?? "", { gfm: true });
  return (
    <>
      <TitrePage titre={a.titre}>
        {a.publie && (
          <a href={`/blog/${a.slug}`} target="_blank" rel="noopener" className={classeBoutonSecondaire}>
            Voir sur le site
          </a>
        )}
      </TitrePage>
      {sp.erreur && (
        <div className="mb-5">
          <Alerte ton="erreur">{sp.erreur}</Alerte>
        </div>
      )}
      {sp.enregistre && (
        <div className="mb-5">
          <Alerte ton="succes">{a.publie ? "Article enregistré et en ligne." : "Article enregistré en brouillon."}</Alerte>
        </div>
      )}
      <div className="grid gap-5 xl:grid-cols-2">
        <Carte>
          <FormulaireArticle
            action={enregistrerArticle}
            valeurs={{
              id,
              titre: a.titre,
              slug: a.slug,
              extrait: a.extrait,
              categorie: a.categorie,
              contenu: a.contenu,
              image_url: a.image_url,
              publie: a.publie,
            }}
          />
        </Carte>
        <Carte className="xl:sticky xl:top-6 xl:max-h-[calc(100vh-3rem)] xl:overflow-y-auto">
          <h2 className="text-sm font-medium text-[#4A6178]">Aperçu (dernière version enregistrée)</h2>
          <h3 className="mt-4 text-2xl font-semibold leading-tight">{a.titre}</h3>
          {a.extrait && <p className="mt-3 text-[#4A6178]">{a.extrait}</p>}
          <div className="prose-woc mt-6" dangerouslySetInnerHTML={{ __html: html }} />
        </Carte>
      </div>
      <form action={supprimerArticle} className="mt-5">
        <input type="hidden" name="id" value={id} />
        <button type="submit" className={classeBoutonDanger}>
          Supprimer l&apos;article
        </button>
      </form>
    </>
  );
}

export default function PageArticleAdmin({ params, searchParams }: PageProps<"/admin/blog/[id]">) {
  return (
    <Suspense fallback={<Chargement />}>
      <Contenu params={params} searchParams={searchParams as Promise<Sp>} />
    </Suspense>
  );
}
