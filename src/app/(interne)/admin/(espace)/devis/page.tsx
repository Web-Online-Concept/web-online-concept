import { Suspense } from "react";
import { BoutonLien, Carte, Chargement, EnTeteDocuments, Filtres, LigneDocument, Pastille, TitrePage, Vide } from "@/components/admin/ui";
import { exigerAdmin } from "@/lib/admin/acces";
import { round2 } from "@/lib/admin/donnees";
import { aujourdhui, fmtDate, fmtEuros, STATUTS_DEVIS } from "@/lib/admin/format";

export const metadata = { title: "Devis" };

type Sp = { statut?: string };

const STATUTS = [
  { cle: "tous", libelle: "Tous" },
  { cle: "attente", libelle: "En attente" },
  { cle: "acceptes", libelle: "Acceptés" },
  { cle: "clos", libelle: "Refusés ou expirés" },
  { cle: "brouillon", libelle: "Brouillons" },
] as const;

async function Contenu({ searchParams }: { searchParams: Promise<Sp> }) {
  const sb = await exigerAdmin();
  const jour = aujourdhui();
  const sp = await searchParams;
  const filtre = STATUTS.find((s) => s.cle === sp.statut)?.cle ?? "tous";
  const { data } = await sb
    .from("devis")
    .select("id, numero, objet, statut, total_ttc, date_emission, date_validite, facture_id, cree_le, client:clients(nom)")
    .order("cree_le", { ascending: false })
    .limit(300);
  const devis = data ?? [];
  const expire = (d: (typeof devis)[number]) => d.statut === "expire" || (d.statut === "envoye" && !!d.date_validite && d.date_validite < jour);
  const tests: Record<string, (d: (typeof devis)[number]) => boolean> = {
    tous: (d) => d.statut !== "brouillon",
    attente: (d) => d.statut === "envoye" && !expire(d),
    acceptes: (d) => d.statut === "accepte",
    clos: (d) => d.statut === "refuse" || expire(d),
    brouillon: (d) => d.statut === "brouillon",
  };
  const liste = devis.filter(tests[filtre]);

  const enAttente = devis.filter(tests.attente);
  const acceptes = devis.filter(tests.acceptes);
  const tranches = devis.filter((d) => d.statut === "accepte" || d.statut === "refuse" || expire(d));
  const taux = tranches.length ? Math.round((acceptes.length / tranches.length) * 100) : null;

  return (
    <>
      <TitrePage titre="Devis" description="Chaque devis émis contient un lien pour être accepté en ligne, puis se transforme en facture en un clic.">
        <BoutonLien href="/admin/devis/nouveau" icone="plus">
          Nouveau devis
        </BoutonLien>
      </TitrePage>

      <div className="mb-5 grid grid-cols-3 overflow-hidden rounded-2xl border border-[#E3E9F0] bg-white">
        {[
          { l: "En attente", v: fmtEuros(round2(enAttente.reduce((s, d) => s + Number(d.total_ttc), 0)), true) },
          { l: "Acceptés", v: fmtEuros(round2(acceptes.reduce((s, d) => s + Number(d.total_ttc), 0)), true) },
          { l: "Taux d'acceptation", v: taux === null ? "–" : `${taux} %` },
        ].map((x, i) => (
          <div key={x.l} className={`px-4 py-4 sm:px-6 sm:py-5 ${i ? "border-l border-[#EEF2F7]" : ""}`}>
            <p className="text-xs text-[#4A6178] sm:text-sm">{x.l}</p>
            <p className="mt-1 text-[17px] font-semibold tabular-nums text-nuit sm:text-[22px]">{x.v}</p>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <Filtres
          libelle="Statut"
          options={STATUTS.map((s) => ({
            href: s.cle === "tous" ? "/admin/devis" : `/admin/devis?statut=${s.cle}`,
            libelle: s.libelle,
            actif: s.cle === filtre,
            compte: devis.filter(tests[s.cle]).length,
          }))}
        />
      </div>

      <Carte className="!p-2 sm:!p-3">
        {liste.length === 0 ? (
          <Vide icone="devis">{filtre === "tous" ? "Aucun devis pour l'instant." : "Aucun devis dans cette catégorie."}</Vide>
        ) : (
          <>
            <EnTeteDocuments />
            <ul className="flex flex-col divide-y divide-[#EEF2F7]">
              {liste.map((d) => {
                const exp = expire(d);
                return (
                  <LigneDocument
                    key={d.id}
                    href={`/admin/devis/${d.id}`}
                    numero={d.numero ?? <span className="font-medium text-[#4A6178]">Devis en brouillon</span>}
                    client={(d.client as unknown as { nom: string } | null)?.nom}
                    objet={d.objet}
                    date={d.date_emission ? fmtDate(d.date_emission) : ""}
                    montant={fmtEuros(d.total_ttc)}
                    statut={
                      <Pastille
                        statut={exp ? "expire" : d.statut}
                        libelle={exp ? "Expiré" : d.statut === "accepte" && d.facture_id ? "Facturé" : STATUTS_DEVIS[d.statut]}
                      />
                    }
                  />
                );
              })}
            </ul>
          </>
        )}
      </Carte>
    </>
  );
}

export default function Devis({ searchParams }: PageProps<"/admin/devis">) {
  return (
    <Suspense fallback={<Chargement />}>
      <Contenu searchParams={searchParams as Promise<Sp>} />
    </Suspense>
  );
}
