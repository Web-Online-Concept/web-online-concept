import { Suspense } from "react";
import FormulaireClient from "@/components/admin/FormulaireClient";
import { Carte, Chargement, TitrePage } from "@/components/admin/ui";
import { exigerAdmin } from "@/lib/admin/acces";

export const metadata = { title: "Nouveau client" };

async function Contenu({ searchParams }: { searchParams: Promise<{ retour?: string }> }) {
  await exigerAdmin();
  const { retour } = await searchParams;
  const retourSur = retour && retour.startsWith("/admin/") ? retour : undefined;
  return (
    <>
      <TitrePage titre="Nouveau client" retour={{ href: retourSur ?? "/admin/clients", libelle: retourSur ? "Retour au document" : "Clients" }} description="Pour un professionnel, le SIREN suffit : le reste de la fiche se remplit depuis l'annuaire des entreprises." />
      <Carte>
        <FormulaireClient retour={retourSur} />
      </Carte>
    </>
  );
}

export default function NouveauClient({ searchParams }: PageProps<"/admin/clients/nouveau">) {
  return (
    <Suspense fallback={<Chargement />}>
      <Contenu searchParams={searchParams as Promise<{ retour?: string }>} />
    </Suspense>
  );
}
