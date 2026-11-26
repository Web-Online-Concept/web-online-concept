import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import FormulaireClient from "@/components/admin/FormulaireClient";
import { Alerte, Carte, Chargement, classeBoutonSecondaire, Pastille, TitrePage } from "@/components/admin/ui";
import { exigerAdmin } from "@/lib/admin/acces";
import { fmtDate, fmtEuros, STATUTS_DEVIS, STATUTS_FACTURE } from "@/lib/admin/format";
import { basculerArchive } from "../actions";

export const metadata = { title: "Client" };

async function Contenu({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ enregistre?: string }> }) {
  const sb = await exigerAdmin();
  const { id } = await params;
  const { enregistre } = await searchParams;
  const [{ data: client }, { data: factures }, { data: devis }] = await Promise.all([
    sb.from("clients").select("*").eq("id", id).maybeSingle(),
    sb.from("factures").select("id, numero, type, statut, total_ttc, date_emission").eq("client_id", id).order("cree_le", { ascending: false }),
    sb.from("devis").select("id, numero, statut, total_ttc, date_emission, objet").eq("client_id", id).order("cree_le", { ascending: false }),
  ]);
  if (!client) notFound();

  return (
    <>
      <TitrePage titre={client.nom}>
        <Link href={`/admin/factures/nouvelle?client=${client.id}`} className="rounded-full bg-bleu px-5 py-2.5 text-[15px] font-medium text-white hover:bg-[#3A72FF]">
          Facturer ce client
        </Link>
        <Link href={`/admin/devis/nouveau?client=${client.id}`} className={classeBoutonSecondaire}>
          Nouveau devis
        </Link>
      </TitrePage>
      {enregistre && (
        <div className="mb-5">
          <Alerte ton="succes">Fiche client enregistrée.</Alerte>
        </div>
      )}
      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Carte>
          <FormulaireClient client={client} />
        </Carte>
        <div className="flex flex-col gap-5">
          <Carte>
            <h2 className="text-lg font-semibold">Factures</h2>
            {(factures ?? []).length === 0 ? (
              <p className="mt-3 text-[15px] text-[#4A6178]">Aucune facture.</p>
            ) : (
              <ul className="mt-3 divide-y divide-[#EEF2F7]">
                {factures!.map((f) => (
                  <li key={f.id}>
                    <Link href={`/admin/factures/${f.id}`} className="flex items-center justify-between gap-2 py-2.5 text-[15px] transition-colors hover:text-bleu">
                      <span>{f.numero ?? "Brouillon"}</span>
                      <span>{fmtEuros(f.total_ttc)}</span>
                      <Pastille statut={f.statut} libelle={STATUTS_FACTURE[f.statut]} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Carte>
          <Carte>
            <h2 className="text-lg font-semibold">Devis</h2>
            {(devis ?? []).length === 0 ? (
              <p className="mt-3 text-[15px] text-[#4A6178]">Aucun devis.</p>
            ) : (
              <ul className="mt-3 divide-y divide-[#EEF2F7]">
                {devis!.map((d) => (
                  <li key={d.id}>
                    <Link href={`/admin/devis/${d.id}`} className="flex items-center justify-between gap-2 py-2.5 text-[15px] transition-colors hover:text-bleu">
                      <span>{d.numero ?? "Brouillon"}</span>
                      <span>{d.date_emission ? fmtDate(d.date_emission) : ""}</span>
                      <Pastille statut={d.statut} libelle={STATUTS_DEVIS[d.statut]} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Carte>
          <form action={basculerArchive}>
            <input type="hidden" name="id" value={client.id} />
            <input type="hidden" name="archive" value={client.archive ? "0" : "1"} />
            <button type="submit" className={classeBoutonSecondaire}>
              {client.archive ? "Réactiver ce client" : "Archiver ce client"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default function PageClient({ params, searchParams }: PageProps<"/admin/clients/[id]">) {
  return (
    <Suspense fallback={<Chargement />}>
      <Contenu params={params} searchParams={searchParams as Promise<{ enregistre?: string }>} />
    </Suspense>
  );
}
