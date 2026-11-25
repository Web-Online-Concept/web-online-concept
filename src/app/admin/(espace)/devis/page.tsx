import Link from "next/link";
import { Suspense } from "react";
import { BoutonLien, Carte, Chargement, Pastille, TitrePage, Vide } from "@/components/admin/ui";
import { exigerAdmin } from "@/lib/admin/acces";
import { aujourdhui, fmtDate, fmtEuros, STATUTS_DEVIS } from "@/lib/admin/format";

export const metadata = { title: "Devis" };

async function Contenu() {
  const sb = await exigerAdmin();
  const jour = aujourdhui();
  const { data } = await sb
    .from("devis")
    .select("id, numero, objet, statut, total_ttc, date_emission, date_validite, cree_le, client:clients(nom)")
    .order("cree_le", { ascending: false })
    .limit(300);
  const devis = data ?? [];
  return (
    <>
      <TitrePage titre="Devis">
        <BoutonLien href="/admin/devis/nouveau">Nouveau devis</BoutonLien>
      </TitrePage>
      <Carte>
        {devis.length === 0 ? (
          <Vide>Aucun devis pour l&apos;instant.</Vide>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[15px]">
              <thead className="text-sm text-[#4A6178]">
                <tr>
                  <th className="py-2 font-medium">Numéro</th>
                  <th className="py-2 font-medium">Client et objet</th>
                  <th className="py-2 font-medium">Date</th>
                  <th className="py-2 text-right font-medium">Montant</th>
                  <th className="py-2 text-right font-medium">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF2F7]">
                {devis.map((d) => {
                  const expire = d.statut === "envoye" && d.date_validite && d.date_validite < jour;
                  return (
                    <tr key={d.id} className="hover:bg-ciel/60">
                      <td className="py-3">
                        <Link href={`/admin/devis/${d.id}`} className="font-medium text-bleu hover:underline">
                          {d.numero ?? "Brouillon"}
                        </Link>
                      </td>
                      <td className="py-3">
                        {(d.client as unknown as { nom: string } | null)?.nom}
                        {d.objet && <span className="text-[#4A6178]"> : {d.objet}</span>}
                      </td>
                      <td className="py-3">{fmtDate(d.date_emission)}</td>
                      <td className="py-3 text-right">{fmtEuros(d.total_ttc)}</td>
                      <td className="py-3 text-right">
                        <Pastille statut={expire ? "expire" : d.statut} libelle={expire ? "Expiré" : STATUTS_DEVIS[d.statut]} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Carte>
    </>
  );
}

export default function Devis() {
  return (
    <Suspense fallback={<Chargement />}>
      <Contenu />
    </Suspense>
  );
}
