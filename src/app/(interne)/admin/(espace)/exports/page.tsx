import Link from "next/link";
import { Suspense } from "react";
import { Carte, Chargement, classeBouton, classeBoutonSecondaire, TitrePage } from "@/components/admin/ui";
import { exigerAdmin } from "@/lib/admin/acces";
import { aujourdhui } from "@/lib/admin/format";

export const metadata = { title: "Exports" };

const EXPORTS = [
  {
    cle: "recettes",
    titre: "Livre des recettes",
    texte: "Toutes les recettes encaissées dans l'ordre chronologique : date, pièce, client, nature, mode de règlement et montant. Le registre obligatoire de l'auto-entrepreneur.",
  },
  {
    cle: "urssaf",
    titre: "Récapitulatif URSSAF",
    texte: "Mois par mois : chiffre d'affaires encaissé et déclaré, cotisations, impôt, formation, montants payés.",
  },
  {
    cle: "factures",
    titre: "Registre des factures",
    texte: "Toutes les factures et tous les avoirs émis, avec leur montant, ce qui a été encaissé et leur statut.",
  },
];

async function Contenu({ searchParams }: { searchParams: Promise<{ annee?: string }> }) {
  await exigerAdmin();
  const sp = await searchParams;
  const anneeCourante = Number(aujourdhui().slice(0, 4));
  const annee = /^\d{4}$/.test(sp.annee ?? "") ? Number(sp.annee) : anneeCourante;
  return (
    <>
      <TitrePage titre={`Exports ${annee}`}>
        <Link href={`/admin/exports?annee=${annee - 1}`} className={classeBoutonSecondaire}>
          {annee - 1}
        </Link>
        {annee < anneeCourante && (
          <Link href={`/admin/exports?annee=${annee + 1}`} className={classeBoutonSecondaire}>
            {annee + 1}
          </Link>
        )}
      </TitrePage>

      <Carte className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Tout {annee} en un clic</h2>
          <p className="mt-1 text-[15px] text-[#4A6178]">Une archive avec les trois documents ci-dessous (PDF et tableur) et le PDF de chaque facture et avoir.</p>
        </div>
        <a href={`/admin/exports/archive?annee=${annee}`} className={`${classeBouton} shrink-0`}>
          Télécharger l&apos;archive
        </a>
      </Carte>

      <div className="grid gap-5 md:grid-cols-3">
        {EXPORTS.map((e) => (
          <Carte key={e.cle} className="flex flex-col">
            <h2 className="text-lg font-semibold">{e.titre}</h2>
            <p className="mt-2 flex-1 text-[15px] leading-relaxed text-[#4A6178]">{e.texte}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={`/admin/exports/${e.cle}?annee=${annee}&format=pdf`} className={classeBouton}>
                PDF
              </a>
              <a href={`/admin/exports/${e.cle}?annee=${annee}&format=csv`} className={classeBoutonSecondaire}>
                Tableur (CSV)
              </a>
            </div>
          </Carte>
        ))}
      </div>
    </>
  );
}

export default function Exports({ searchParams }: PageProps<"/admin/exports">) {
  return (
    <Suspense fallback={<Chargement />}>
      <Contenu searchParams={searchParams as Promise<{ annee?: string }>} />
    </Suspense>
  );
}
