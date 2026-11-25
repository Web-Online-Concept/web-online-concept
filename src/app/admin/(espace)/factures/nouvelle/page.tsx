import { Suspense } from "react";
import EditeurDocument from "@/components/admin/EditeurDocument";
import { Alerte, Carte, Chargement, TitrePage } from "@/components/admin/ui";
import { exigerAdmin } from "@/lib/admin/acces";
import { listeClients } from "@/lib/admin/donnees";
import { enregistrerFacture } from "../actions";

export const metadata = { title: "Nouvelle facture" };

async function Contenu({ searchParams }: { searchParams: Promise<{ client?: string; erreur?: string }> }) {
  const sb = await exigerAdmin();
  const sp = await searchParams;
  const clients = await listeClients(sb);
  return (
    <>
      <TitrePage titre="Nouvelle facture" />
      {sp.erreur && (
        <div className="mb-5">
          <Alerte ton="erreur">{sp.erreur}</Alerte>
        </div>
      )}
      <Carte>
        <EditeurDocument
          genre="facture"
          action={enregistrerFacture}
          clients={clients}
          valeurs={{ client_id: sp.client ?? "", objet: "", date_emission: "", date_fin: "", notes: "" }}
          lignesInitiales={[]}
          libelleEmettre="Émettre la facture"
          retourNouveauClient="/admin/factures/nouvelle"
        />
      </Carte>
    </>
  );
}

export default function NouvelleFacture({ searchParams }: PageProps<"/admin/factures/nouvelle">) {
  return (
    <Suspense fallback={<Chargement />}>
      <Contenu searchParams={searchParams as Promise<{ client?: string; erreur?: string }>} />
    </Suspense>
  );
}
