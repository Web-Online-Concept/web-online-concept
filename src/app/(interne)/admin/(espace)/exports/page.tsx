import { Suspense } from "react";
import { Icone, type NomIcone } from "@/components/admin/Icones";
import { Carte, Chargement, classeBouton, classeBoutonSecondaire, Filtres, TitrePage } from "@/components/admin/ui";
import { exigerAdmin } from "@/lib/admin/acces";
import { aujourdhui } from "@/lib/admin/format";

export const metadata = { title: "Exports" };

const EXPORTS = [
  {
    cle: "recettes",
    icone: "euro" as NomIcone,
    titre: "Livre des recettes",
    texte: "Toutes les recettes encaissées dans l'ordre chronologique : date, pièce, client, nature, mode de règlement et montant. Le registre obligatoire de l'auto-entrepreneur.",
  },
  {
    cle: "urssaf",
    icone: "urssaf" as NomIcone,
    titre: "Récapitulatif URSSAF",
    texte: "Mois par mois : chiffre d'affaires encaissé et déclaré, cotisations, impôt, formation, montants payés.",
  },
  {
    cle: "factures",
    icone: "factures" as NomIcone,
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
      <TitrePage titre={`Exports ${annee}`} description="Les documents à garder ou à transmettre à un comptable, en PDF ou en tableur." />
      <div className="mb-5">
        <Filtres
          libelle="Année"
          options={[anneeCourante - 2, anneeCourante - 1, anneeCourante].map((a) => ({ href: `/admin/exports?annee=${a}`, libelle: String(a), actif: a === annee }))}
        />
      </div>

      <section className="relative mb-5 flex flex-col gap-4 overflow-hidden rounded-2xl bg-nuit p-6 text-white sm:flex-row sm:items-center sm:justify-between">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(31,94,255,0.45),transparent_68%)]" />
        <div className="relative">
          <h2 className="text-lg font-semibold">Tout {annee} en un clic</h2>
          <p className="mt-1 text-[15px] text-[#B8C6D6]">Une archive avec les trois documents ci-dessous (PDF et tableur) et le PDF de chaque facture et avoir.</p>
        </div>
        <a href={`/admin/exports/archive?annee=${annee}`} className={`${classeBouton} relative shrink-0`}>
          <Icone nom="exports" className="h-[18px] w-[18px]" />
          Télécharger l&apos;archive
        </a>
      </section>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {EXPORTS.map((e) => (
          <Carte key={e.cle} className="flex flex-col">
            <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8EFFF] text-bleu">
              <Icone nom={e.icone} className="h-5 w-5" />
            </span>
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
