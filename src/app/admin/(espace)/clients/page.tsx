import Link from "next/link";
import { Suspense } from "react";
import { BoutonLien, Carte, Chargement, TitrePage, Vide } from "@/components/admin/ui";
import { exigerAdmin } from "@/lib/admin/acces";
import { listeClients } from "@/lib/admin/donnees";

export const metadata = { title: "Clients" };

async function Contenu() {
  const sb = await exigerAdmin();
  const clients = await listeClients(sb, true);
  const actifs = clients.filter((c) => !c.archive);
  const archives = clients.filter((c) => c.archive);
  return (
    <>
      <TitrePage titre="Clients">
        <BoutonLien href="/admin/clients/nouveau">Nouveau client</BoutonLien>
      </TitrePage>
      <Carte>
        {actifs.length === 0 ? (
          <Vide>Aucun client pour l&apos;instant. Ajoutez le premier : son SIREN suffit pour remplir la fiche.</Vide>
        ) : (
          <ul className="divide-y divide-[#EEF2F7]">
            {actifs.map((c) => (
              <li key={c.id}>
                <Link href={`/admin/clients/${c.id}`} className="flex flex-wrap items-center justify-between gap-3 py-3 hover:bg-ciel/60">
                  <span className="font-medium">{c.nom}</span>
                  <span className="text-[15px] text-[#4A6178]">
                    {[c.type === "entreprise" ? c.siren && `SIREN ${c.siren}` : "Particulier", c.ville].filter(Boolean).join(", ")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Carte>
      {archives.length > 0 && (
        <details className="mt-5">
          <summary className="cursor-pointer text-[15px] text-[#4A6178]">Clients archivés ({archives.length})</summary>
          <ul className="mt-3 flex flex-col gap-2">
            {archives.map((c) => (
              <li key={c.id}>
                <Link href={`/admin/clients/${c.id}`} className="text-[15px] text-bleu hover:underline">
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
