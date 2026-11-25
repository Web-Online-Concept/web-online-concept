import { Suspense } from "react";
import EditeurDocument from "@/components/admin/EditeurDocument";
import { Alerte, Carte, Chargement, TitrePage } from "@/components/admin/ui";
import { exigerAdmin } from "@/lib/admin/acces";
import { listeClients } from "@/lib/admin/donnees";
import { enregistrerDevis } from "../actions";

export const metadata = { title: "Nouveau devis" };

async function Contenu({ searchParams }: { searchParams: Promise<{ client?: string; erreur?: string }> }) {
  const sb = await exigerAdmin();
  const sp = await searchParams;
  const clients = await listeClients(sb);
  return (
    <>
      <TitrePage titre="Nouveau devis" />
      {sp.erreur && (
        <div className="mb-5">
          <Alerte ton="erreur">{sp.erreur}</Alerte>
        </div>
      )}
      <Carte>
        <EditeurDocument
          genre="devis"
          action={enregistrerDevis}
          clients={clients}
          valeurs={{ client_id: sp.client ?? "", objet: "", date_emission: "", date_fin: "", notes: "" }}
          lignesInitiales={[]}
          libelleEmettre="Émettre le devis"
          retourNouveauClient="/admin/devis/nouveau"
        />
      </Carte>
    </>
  );
}

export default function NouveauDevis({ searchParams }: PageProps<"/admin/devis/nouveau">) {
  return (
    <Suspense fallback={<Chargement />}>
      <Contenu searchParams={searchParams as Promise<{ client?: string; erreur?: string }>} />
    </Suspense>
  );
}
