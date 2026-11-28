import Link from "next/link";
import { marked } from "marked";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import BoutonConfirmer from "@/components/admin/BoutonConfirmer";
import FormulaireArticle from "@/components/admin/FormulaireArticle";
import FormulaireTraduction from "@/components/admin/FormulaireTraduction";
import { Icone } from "@/components/admin/Icones";
import { Alerte, Carte, Chargement, classeBoutonSecondaire, Pastille, TitrePage } from "@/components/admin/ui";
import { Drapeau } from "@/components/site/Langue";
import { exigerAdmin } from "@/lib/admin/acces";
import { fmtDate } from "@/lib/admin/format";
import { NOMS_LANGUES, type Langue } from "@/lib/i18n/chemins";
import { enregistrerArticle, enregistrerTraduction, supprimerArticle, supprimerTraduction } from "../actions";

export const metadata = { title: "Article" };

type Sp = { erreur?: string; enregistre?: string; supprime?: string; langue?: string };

async function Contenu({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Sp> }) {
  const sb = await exigerAdmin();
  const { id } = await params;
  const sp = await searchParams;
  const langue: Langue = sp.langue === "en" || sp.langue === "es" ? sp.langue : "fr";
  const [{ data: a }, { data: trads }] = await Promise.all([
    sb.from("articles").select("*").eq("id", id).maybeSingle(),
    sb.from("articles_traductions").select("*").eq("article_id", id),
  ]);
  if (!a) notFound();
  const traduction = langue === "fr" ? null : (trads ?? []).find((t) => t.langue === langue) ?? null;
  const existe = (l: Langue) => l === "fr" || (trads ?? []).some((t) => t.langue === l);

  // Aperçu de la version affichée (dernière version enregistrée)
  const apercu = langue === "fr" ? a : traduction;
  const html = apercu ? await marked.parse(apercu.contenu ?? "", { gfm: true }) : "";
  const adressePublique = langue === "fr" ? `/blog/${a.slug}` : traduction ? `/${langue}/blog/${traduction.slug}` : null;

  return (
    <>
      <TitrePage titre={a.titre} retour={{ href: "/admin/blog", libelle: "Blog" }}>
        {a.publie && adressePublique && (
          <a href={adressePublique} target="_blank" rel="noopener" className={classeBoutonSecondaire}>
            <Icone nom="site" className="h-[18px] w-[18px]" />
            Voir sur le site
          </a>
        )}
      </TitrePage>

      {/* Onglets de langue */}
      <nav aria-label="Langue de l'article" className="-mx-5 mb-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0">
        {(["fr", "en", "es"] as Langue[]).map((l) => {
          const actif = l === langue;
          return (
            <Link
              key={l}
              href={`/admin/blog/${id}${l === "fr" ? "" : `?langue=${l}`}`}
              aria-current={actif ? "page" : undefined}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                actif ? "bg-nuit text-white" : "bg-white text-[#2C4558] ring-1 ring-[#E3E9F0] hover:ring-[#B8C6D6]"
              }`}
            >
              <Drapeau l={l} className="h-4 w-4" />
              {NOMS_LANGUES[l]}
              {l !== "fr" &&
                (existe(l) ? (
                  <Icone nom="coche" className={`h-4 w-4 ${actif ? "text-vert" : "text-[#0E7A45]"}`} />
                ) : (
                  <span className={`text-xs ${actif ? "text-[#B8C6D6]" : "text-[#93A6BB]"}`}>à traduire</span>
                ))}
            </Link>
          );
        })}
      </nav>

      {sp.erreur && (
        <div className="mb-5">
          <Alerte ton="erreur">{sp.erreur}</Alerte>
        </div>
      )}
      {sp.enregistre && (
        <div className="mb-5">
          <Alerte ton="succes">
            {langue === "fr"
              ? a.publie
                ? "Article enregistré et en ligne."
                : "Article enregistré en brouillon."
              : a.publie
                ? "Traduction enregistrée et en ligne."
                : "Traduction enregistrée. Elle sera en ligne quand l'article sera publié."}
          </Alerte>
        </div>
      )}
      {sp.supprime && (
        <div className="mb-5">
          <Alerte>Traduction supprimée : l&apos;article n&apos;est plus proposé dans cette langue.</Alerte>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Carte>
          {langue === "fr" ? (
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
          ) : (
            <FormulaireTraduction
              key={`${langue}-${traduction?.modifie_le ?? "neuf"}`}
              action={enregistrerTraduction}
              articleId={id}
              langue={langue}
              imageFrancaise={a.image_url}
              valeurs={
                traduction
                  ? {
                      titre: traduction.titre,
                      slug: traduction.slug,
                      extrait: traduction.extrait,
                      categorie: traduction.categorie,
                      contenu: traduction.contenu,
                      image_url: traduction.image_url,
                    }
                  : null
              }
            />
          )}
        </Carte>
        <Carte className="xl:sticky xl:top-6 xl:max-h-[calc(100vh-3rem)] xl:self-start xl:overflow-y-auto">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-medium text-[#4A6178]">Aperçu de la version enregistrée</h2>
            {apercu && (
              <Pastille
                statut={a.publie ? "publie" : "brouillon"}
                libelle={a.publie ? `En ligne depuis le ${fmtDate(a.publie_le)}` : "Pas encore publié"}
              />
            )}
          </div>
          {apercu ? (
            <>
              <h3 className="mt-4 text-2xl font-semibold leading-tight">{apercu.titre}</h3>
              {apercu.extrait && <p className="mt-3 text-[#4A6178]">{apercu.extrait}</p>}
              <div className="prose-woc mt-6" dangerouslySetInnerHTML={{ __html: html }} />
            </>
          ) : (
            <p className="mt-4 text-[15px] leading-relaxed text-[#4A6178]">
              Pas encore de version {langue === "en" ? "anglaise" : "espagnole"}. Proposez une traduction automatique ou écrivez-la, puis enregistrez : l&apos;aperçu
              apparaîtra ici.
            </p>
          )}
        </Carte>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {langue === "fr" ? (
          <BoutonConfirmer
            action={supprimerArticle}
            champs={{ id }}
            libelle="Supprimer l'article"
            question="Supprimer l'article et ses traductions ?"
          />
        ) : (
          traduction && (
            <BoutonConfirmer
              action={supprimerTraduction}
              champs={{ article_id: id, langue }}
              libelle={`Supprimer la version ${langue === "en" ? "anglaise" : "espagnole"}`}
              question="Supprimer cette traduction ?"
            />
          )
        )}
      </div>
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
