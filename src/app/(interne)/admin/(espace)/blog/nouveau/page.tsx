import { Suspense } from "react";
import FormulaireArticle from "@/components/admin/FormulaireArticle";
import { Alerte, Carte, Chargement, TitrePage } from "@/components/admin/ui";
import { exigerAdmin } from "@/lib/admin/acces";
import { enregistrerArticle } from "../actions";

export const metadata = { title: "Nouvel article" };

async function Contenu({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  await exigerAdmin();
  const sp = await searchParams;
  return (
    <>
      <TitrePage titre="Nouvel article" retour={{ href: "/admin/blog", libelle: "Blog" }} description="Écrivez la version française ; les traductions anglaise et espagnole se font ensuite depuis l'article." />
      {sp.erreur && (
        <div className="mb-5">
          <Alerte ton="erreur">{sp.erreur}</Alerte>
        </div>
      )}
      <Carte>
        <FormulaireArticle
          action={enregistrerArticle}
          valeurs={{ titre: "", slug: "", extrait: "", categorie: "IA", contenu: "", image_url: null, publie: false }}
        />
      </Carte>
    </>
  );
}

export default function NouvelArticle({ searchParams }: PageProps<"/admin/blog/nouveau">) {
  return (
    <Suspense fallback={<Chargement />}>
      <Contenu searchParams={searchParams as Promise<{ erreur?: string }>} />
    </Suspense>
  );
}
