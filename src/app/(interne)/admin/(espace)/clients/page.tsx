import Link from "next/link";
import { Suspense } from "react";
import ListeClients from "@/components/admin/ListeClients";
import { BoutonLien, Carte, Chargement, TitrePage, Vide } from "@/components/admin/ui";
import { exigerAdmin } from "@/lib/admin/acces";
import { listeClients, round2 } from "@/lib/admin/donnees";

export const metadata = { title: "Clients" };

async function Contenu() {
  const sb = await exigerAdmin();
  const [clients, { data: factures }] = await Promise.all([
    listeClients(sb, true),
    sb.from("factures").select("client_id, type, statut, total_ttc, montant_encaisse").neq("statut", "brouillon").neq("statut", "annulee"),
  ]);
  const stats = (id: string) => {
    const f = (factures ?? []).filter((x) => x.client_id === id);
    return {
      facture: round2(f.reduce((s, x) => s + Number(x.total_ttc), 0)),
      reste: round2(f.filter((x) => x.type === "facture" && x.statut === "emise").reduce((s, x) => s + Number(x.total_ttc) - Number(x.montant_encaisse), 0)),
      documents: f.length,
    };
  };
  const actifs = clients.filter((c) => !c.archive).map((c) => ({ id: c.id, nom: c.nom, type: c.type, ville: c.ville, email: c.email, ...stats(c.id) }));
  const archives = clients.filter((c) => c.archive);

  return (
    <>
      <TitrePage titre="Clients" description={`${actifs.length} client${actifs.length > 1 ? "s" : ""} actif${actifs.length > 1 ? "s" : ""}. Le montant indiqué est le total facturé.`}>
        <BoutonLien href="/admin/clients/nouveau" icone="plus">
          Nouveau client
        </BoutonLien>
      </TitrePage>
      {actifs.length === 0 ? (
        <Carte>
          <Vide icone="clients">Aucun client pour l&apos;instant. Ajoutez le premier : son SIREN suffit pour remplir la fiche.</Vide>
        </Carte>
      ) : (
        <ListeClients clients={actifs} />
      )}
      {archives.length > 0 && (
        <details className="mt-6 rounded-2xl border border-[#E3E9F0] bg-white p-5">
          <summary className="cursor-pointer text-[15px] font-medium text-[#2C4558]">Clients archivés ({archives.length})</summary>
          <ul className="mt-3 flex flex-col gap-2">
            {archives.map((c) => (
              <li key={c.id}>
                <Link href={`/admin/clients/${c.id}`} className="text-[15px] text-bleu transition-colors hover:text-[#1638A8]">
                  {c.nom}
                </Link>
              </li>
            ))}
          </ul>
        </details>
      )}
    </>
  );
}

export default function Clients() {
  return (
    <Suspense fallback={<Chargement />}>
      <Contenu />
    </Suspense>
  );
}
