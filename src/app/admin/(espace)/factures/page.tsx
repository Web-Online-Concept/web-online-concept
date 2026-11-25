import Link from "next/link";
import { Suspense } from "react";
import { BoutonLien, Carte, Chargement, Pastille, TitrePage, Vide } from "@/components/admin/ui";
import { exigerAdmin } from "@/lib/admin/acces";
import { aujourdhui, fmtDate, fmtEuros, STATUTS_FACTURE } from "@/lib/admin/format";

export const metadata = { title: "Factures" };

async function Contenu({ searchParams }: { searchParams: Promise<{ annee?: string }> }) {
  const sb = await exigerAdmin();
  const jour = aujourdhui();
  const { annee: a } = await searchParams;
  const annee = Number(a) || Number(jour.slice(0, 4));
  const { data } = await sb
    .from("factures")
    .select("id, numero, type, objet, statut, total_ttc, montant_encaisse, date_emission, date_echeance, cree_le, client:clients(nom)")
    .or(`date_emission.gte.${annee}-01-01,date_emission.is.null`)
    .or(`date_emission.lte.${annee}-12-31,date_emission.is.null`)
    .order("cree_le", { ascending: false });
  const factures = data ?? [];
  const brouillons = factures.filter((f) => f.statut === "brouillon");
  const emises = factures.filter((f) => f.statut !== "brouillon").sort((x, y) => String(y.numero).localeCompare(String(x.numero)));

  return (
    <>
      <TitrePage titre="Factures">
        <BoutonLien href="/admin/factures/nouvelle">Nouvelle facture</BoutonLien>
      </TitrePage>
      <nav aria-label="Année" className="mb-5 flex gap-2">
        {[annee - 1, annee, annee + 1].map((x) => (
          <Link key={x} href={`/admin/factures?annee=${x}`} aria-current={x === annee ? "page" : undefined} className={`rounded-full px-4 py-1.5 text-sm ${x === annee ? "bg-nuit text-white" : "bg-white text-nuit hover:bg-[#E1E7EF]"}`}>
            {x}
          </Link>
        ))}
      </nav>
      {brouillons.length > 0 && (
        <Carte className="mb-5">
          <h2 className="text-lg font-semibold">Brouillons</h2>
          <ul className="mt-3 divide-y divide-[#EEF2F7]">
            {brouillons.map((f) => (
              <li key={f.id}>
                <Link href={`/admin/factures/${f.id}`} className="flex flex-wrap items-center justify-between gap-3 py-3 hover:bg-ciel/60">
                  <span className="font-medium">{f.type === "avoir" ? "Avoir" : "Facture"} en brouillon</span>
                  <span className="flex-1 text-[15px] text-[#2C4558]">{(f.client as unknown as { nom: string } | null)?.nom} {f.objet && `: ${f.objet}`}</span>
                  <span>{fmtEuros(f.total_ttc)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Carte>
      )}
      <Carte>
        {emises.length === 0 ? (
          <Vide>Aucune facture émise en {annee}.</Vide>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[15px]">
              <thead className="text-sm text-[#4A6178]">
                <tr>
                  <th className="py-2 font-medium">Numéro</th>
                  <th className="py-2 font-medium">Client</th>
                  <th className="py-2 font-medium">Date</th>
                  <th className="py-2 text-right font-medium">Montant</th>
                  <th className="py-2 text-right font-medium">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF2F7]">
                {emises.map((f) => {
                  const retard = f.statut === "emise" && f.date_echeance && f.date_echeance < jour;
                  return (
                    <tr key={f.id} className="hover:bg-ciel/60">
                      <td className="py-3">
                        <Link href={`/admin/factures/${f.id}`} className="font-medium text-bleu hover:underline">
                          {f.numero}
                        </Link>
                      </td>
                      <td className="py-3">{(f.client as unknown as { nom: string } | null)?.nom}</td>
                      <td className="py-3">{fmtDate(f.date_emission)}</td>
                      <td className="py-3 text-right">{fmtEuros(f.total_ttc)}</td>
                      <td className="py-3 text-right">
                        <Pastille statut={retard ? "retard" : f.statut} libelle={retard ? "En retard" : STATUTS_FACTURE[f.statut]} />
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

export default function Factures({ searchParams }: PageProps<"/admin/factures">) {
  return (
    <Suspense fallback={<Chargement />}>
      <Contenu searchParams={searchParams as Promise<{ annee?: string }>} />
    </Suspense>
  );
}
