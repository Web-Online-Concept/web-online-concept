import { Champ, classeBouton, classeChamp } from "@/components/admin/ui";

export type ValeursArticle = {
  id?: string;
  titre: string;
  slug: string;
  extrait: string;
  categorie: string;
  contenu: string;
  image_url: string | null;
  publie: boolean;
};

const CATEGORIES = ["IA", "Développement", "Applications", "Méthode", "Réalisations", "Actualité"];

export default function FormulaireArticle({ action, valeurs }: { action: (f: FormData) => Promise<void>; valeurs: ValeursArticle }) {
  return (
    <form action={action} className="flex flex-col gap-5">
      {valeurs.id && <input type="hidden" name="id" value={valeurs.id} />}
      <Champ libelle="Titre" htmlFor="titre">
        <input id="titre" name="titre" required defaultValue={valeurs.titre} className={classeChamp} />
      </Champ>
      <div className="grid gap-5 sm:grid-cols-2">
        <Champ libelle="Adresse de l'article" htmlFor="slug" aide="Laissez vide pour la créer à partir du titre.">
          <div className="flex items-center gap-1">
            <span className="text-sm text-[#4A6178]">/blog/</span>
            <input id="slug" name="slug" defaultValue={valeurs.slug} className={classeChamp} />
          </div>
        </Champ>
        <Champ libelle="Catégorie" htmlFor="categorie">
          <input id="categorie" name="categorie" list="categories" defaultValue={valeurs.categorie || "IA"} className={classeChamp} />
          <datalist id="categories">
            {CATEGORIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Champ>
      </div>
      <Champ libelle="Résumé" htmlFor="extrait" aide="Deux phrases, affichées dans la liste des articles et sur les réseaux sociaux.">
        <textarea id="extrait" name="extrait" rows={2} maxLength={300} defaultValue={valeurs.extrait} className={classeChamp} />
      </Champ>
      <Champ
        libelle="Texte de l'article"
        htmlFor="contenu"
        aide="Mise en forme : ## Intertitre, **gras**, *italique*, - liste, [texte du lien](https://…). Une ligne vide sépare les paragraphes."
      >
        <textarea id="contenu" name="contenu" rows={20} defaultValue={valeurs.contenu} className={`${classeChamp} font-mono text-[14px] leading-relaxed`} />
      </Champ>
      <Champ libelle="Image de couverture (facultatif)" htmlFor="image" aide="JPG, PNG ou WebP, 3,5 Mo au maximum, format paysage.">
        <input id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="text-[15px]" />
      </Champ>
      {valeurs.image_url && (
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={valeurs.image_url} alt="Couverture actuelle" className="h-20 w-36 rounded-lg object-cover" />
          <label className="flex items-center gap-2 text-[15px]">
            <input type="checkbox" name="retirer_image" value="oui" className="h-4 w-4 accent-bleu" />
            Retirer l&apos;image
          </label>
        </div>
      )}
      <label className="flex items-center gap-3 rounded-xl bg-ciel px-4 py-3 text-[15px]">
        <input type="checkbox" name="publie" value="oui" defaultChecked={valeurs.publie} className="h-4 w-4 accent-bleu" />
        Publier sur le site
      </label>
      <button type="submit" className={`${classeBouton} self-start`}>
        Enregistrer
      </button>
    </form>
  );
}
