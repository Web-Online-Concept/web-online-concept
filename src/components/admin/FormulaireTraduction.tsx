"use client";

import { useActionState, useEffect, useState } from "react";
import { proposerTraduction, type EtatProposition } from "@/app/(interne)/admin/(espace)/blog/actions";
import { Etincelle, Icone } from "@/components/admin/Icones";
import { Alerte, Champ, classeBouton, classeBoutonSecondaire, classeChamp } from "@/components/admin/ui";

export type ValeursTraduction = { titre: string; slug: string; extrait: string; categorie: string; contenu: string; image_url: string | null };

const NOMS = { en: "anglais", es: "espagnol" } as const;
const PREFIXES = { en: "/en/blog/", es: "/es/blog/" } as const;
const initial: EtatProposition = { statut: "initial" };

// Traduction d'un article : saisie à la main, ou proposition automatique depuis le français, à relire avant d'enregistrer
export default function FormulaireTraduction({
  action,
  articleId,
  langue,
  valeurs,
  imageFrancaise,
}: {
  action: (f: FormData) => Promise<void>;
  articleId: string;
  langue: "en" | "es";
  valeurs: ValeursTraduction | null;
  imageFrancaise: string | null;
}) {
  const [v, setV] = useState({
    titre: valeurs?.titre ?? "",
    slug: valeurs?.slug ?? "",
    extrait: valeurs?.extrait ?? "",
    categorie: valeurs?.categorie ?? "",
    contenu: valeurs?.contenu ?? "",
  });
  const [etat, proposer, enCours] = useActionState(proposerTraduction, initial);
  const [propose, setPropose] = useState(false);

  useEffect(() => {
    if (etat.statut === "ok" && etat.champs) {
      setV({ titre: etat.champs.titre, slug: etat.champs.slug, extrait: etat.champs.extrait, categorie: etat.champs.categorie, contenu: etat.champs.contenu });
      setPropose(true);
    }
  }, [etat.jeton, etat.statut, etat.champs]);

  const maj = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setV((x) => ({ ...x, [k]: e.target.value }));

  return (
    <div className="flex flex-col gap-5">
      {/* Proposition automatique */}
      <form action={proposer} className="flex flex-col gap-3 rounded-2xl bg-[linear-gradient(135deg,#0D2240,#0A1A2F)] p-5 text-white sm:flex-row sm:items-center sm:justify-between">
        <input type="hidden" name="article_id" value={articleId} />
        <input type="hidden" name="langue" value={langue} />
        <div>
          <p className="flex items-center gap-2 font-semibold">
            <Etincelle className="h-4 w-4 text-cyan" />
            Traduction automatique
          </p>
          <p className="mt-1 text-sm leading-relaxed text-[#B8C6D6]">
            L&apos;IA traduit la version française enregistrée en {NOMS[langue]}. Rien n&apos;est publié : vous relisez, corrigez, puis enregistrez.
          </p>
        </div>
        <button
          type="submit"
          disabled={enCours}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-[15px] font-medium text-nuit transition-colors hover:bg-[#E6EDF5] disabled:opacity-70"
        >
          <Icone nom="traduire" className="h-[18px] w-[18px]" />
          {enCours ? "Traduction en cours…" : v.titre ? "Retraduire" : "Proposer une traduction"}
        </button>
      </form>
      {etat.statut === "erreur" && <Alerte ton="erreur">{etat.message}</Alerte>}
      {propose && !enCours && <Alerte>Traduction proposée : relisez-la, corrigez si besoin, puis enregistrez.</Alerte>}

      <form action={action} className="flex flex-col gap-5">
        <input type="hidden" name="article_id" value={articleId} />
        <input type="hidden" name="langue" value={langue} />
        <Champ libelle="Titre" htmlFor={`titre-${langue}`}>
          <input id={`titre-${langue}`} name="titre" required value={v.titre} onChange={maj("titre")} className={classeChamp} />
        </Champ>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Champ libelle="Adresse de l'article" htmlFor={`slug-${langue}`} aide="Laissez vide pour la créer à partir du titre.">
            <div className="flex items-center gap-1">
              <span className="shrink-0 text-sm text-[#4A6178]">{PREFIXES[langue]}</span>
              <input id={`slug-${langue}`} name="slug" value={v.slug} onChange={maj("slug")} className={classeChamp} />
            </div>
          </Champ>
          <Champ libelle="Catégorie" htmlFor={`categorie-${langue}`}>
            <input id={`categorie-${langue}`} name="categorie" value={v.categorie} onChange={maj("categorie")} className={classeChamp} />
          </Champ>
        </div>
        <Champ libelle="Résumé" htmlFor={`extrait-${langue}`}>
          <textarea id={`extrait-${langue}`} name="extrait" rows={2} maxLength={300} value={v.extrait} onChange={maj("extrait")} className={classeChamp} />
        </Champ>
        <Champ libelle="Texte de l'article" htmlFor={`contenu-${langue}`} aide="Même mise en forme que la version française.">
          <textarea
            id={`contenu-${langue}`}
            name="contenu"
            rows={20}
            value={v.contenu}
            onChange={maj("contenu")}
            className={`${classeChamp} font-mono text-[14px] leading-relaxed`}
          />
        </Champ>
        <Champ
          libelle="Image de couverture (facultatif)"
          htmlFor={`image-${langue}`}
          aide="Sans image propre, la couverture de la version française est utilisée."
        >
          <input id={`image-${langue}`} name="image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="text-[15px]" />
        </Champ>
        {(valeurs?.image_url || imageFrancaise) && (
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={valeurs?.image_url ?? imageFrancaise ?? ""} alt="Couverture actuelle" className="h-20 w-36 rounded-lg object-cover ring-1 ring-[#E3E9F0]" />
            {valeurs?.image_url ? (
              <label className="flex cursor-pointer items-center gap-2 text-[15px]">
                <input type="checkbox" name="retirer_image" value="oui" className="h-4 w-4 accent-bleu" />
                Reprendre l&apos;image française
              </label>
            ) : (
              <span className="text-sm text-[#4A6178]">Image de la version française</span>
            )}
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <button type="submit" className={classeBouton}>
            <Icone nom="coche" className="h-[18px] w-[18px]" />
            Enregistrer la traduction
          </button>
          {propose && (
            <button type="button" onClick={() => location.reload()} className={classeBoutonSecondaire}>
              Abandonner la proposition
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
