import { Suspense } from "react";
import { BoutonLien, Carte, Chargement, EnTeteDocuments, Filtres, LigneDocument, Pastille, TitrePage, Vide } from "@/components/admin/ui";
import { exigerAdmin } from "@/lib/admin/acces";
import { round2 } from "@/lib/admin/donnees";
import { aujourdhui, fmtDate, fmtEuros, STATUTS_FACTURE } from "@/lib/admin/format";

export const metadata = { title: "Factures" };

type Sp = { annee?: string; statut?: string };

const STATUTS = [
  { cle: "toutes", libelle: "Toutes" },
  { cle: "attente", libelle: "À encaisser" },
  { cle: "retard", libelle: "En retard" },
  { cle: "payees", libelle: "Payées" },
  { cle: "avoirs", libelle: "Avoirs" },
  { cle: "brouillon", libelle: "Brouillons" },
] as const;

async function Contenu({ searchParams }: { searchParams: Promise<Sp> }) {
  const sb = await exigerAdmin();
  const jour = aujourdhui();
  const sp = await searchParams;
  const anneeCourante = Number(jour.slice(0, 4));
  const annee = /^\d{4}$/.test(sp.annee ?? "") ? Number(sp.annee) : anneeCourante;
  const filtre = STATUTS.find((s) => s.cle === sp.statut)?.cle ?? "toutes";

  const { data } = await sb
    .from("factures")
    .select("id, numero, type, objet, statut, total_ttc, montant_encaisse, date_emission, date_echeance, cree_le, client:clients(nom)")
    .order("cree_le", { ascending: false });
  // Brouillons (sans date) toujours affichés ; documents émis : ceux de l'année choisie
  const factures = (data ?? []).filter((f) => f.statut === "brouillon" || String(f.date_emission ?? "").startsWith(String(annee)));
  const enRetard = (f: (typeof factures)[number]) => f.type === "facture" && f.statut === "emise" && !!f.date_echeance && f.date_echeance < jour;
  const tests: Record<string, (f: (typeof factures)[number]) => boolean> = {
    toutes: (f) => f.statut !== "brouillon",
    attente: (f) => f.type === "facture" && f.statut === "emise",
    retard: enRetard,
    payees: (f) => f.type === "facture" && f.statut === "payee",
    avoirs: (f) => f.type === "avoir" && f.statut !== "brouillon",
    brouillon: (f) => f.statut === "brouillon",
  };
  const liste = factures.filter(tests[filtre]).sort((x, y) => String(y.numero ?? "~").localeCompare(String(x.numero ?? "~")));

  const emises = factures.filter((f) => f.statut !== "brouillon" && f.statut !== "annulee");
  const facture = round2(emises.reduce((s, f) => s + Number(f.total_ttc), 0));
  const encaisse = round2(emises.reduce((s, f) => s + Number(f.montant_encaisse), 0));
  const reste = round2(emises.filter((f) => f.type === "facture" && f.statut === "emise").reduce((s, f) => s + Number(f.total_ttc) - Number(f.montant_encaisse), 0));

  const lien = (a: number, st: string) => `/admin/factures?annee=${a}${st !== "toutes" ? `&statut=${st}` : ""}`;

  return (
    <>
      <TitrePage titre="Factures" description="Factures et avoirs : émission, PDF archivé, suivi des encaissements.">
        <BoutonLien href="/admin/factures/nouvelle" icone="plus">
          Nouvelle facture
        </BoutonLien>
      </TitrePage>

      <div className="mb-5 grid grid-cols-3 overflow-hidden rounded-2xl border border-[#E3E9F0] bg-white">
        {[
          { l: `Facturé en ${annee}`, v: facture },
          { l: "Encaissé", v: encaisse },
          { l: "Reste à encaisser", v: reste },
        ].map((x, i) => (
          <div key={x.l} className={`px-4 py-4 sm:px-6 sm:py-5 ${i ? "border-l border-[#EEF2F7]" : ""}`}>
            <p className="text-xs text-[#4A6178] sm:text-sm">{x.l}</p>
            <p className="mt-1 text-[17px] font-semibold tabular-nums text-nuit sm:text-[22px]">{fmtEuros(x.v, true)}</p>
          </div>
        ))}
      </div>

      <div className="mb-4 flex flex-col gap-3">
        <Filtres
          libelle="Année"
          options={[anneeCourante - 2, anneeCourante - 1, anneeCourante].map((a) => ({ href: lien(a, filtre), libelle: String(a), actif: a === annee }))}
        />
        <Filtres
          libelle="Statut"
          options={STATUTS.map((s) => ({ href: lien(annee, s.cle), libelle: s.libelle, actif: s.cle === filtre, compte: factures.filter(tests[s.cle]).length }))}
        />
      </div>

      <Carte className="!p-2 sm:!p-3">
        {liste.length === 0 ? (
          <Vide icone="factures">
            {filtre === "toutes" ? `Aucune facture émise en ${annee}.` : "Aucune facture dans cette catégorie."}
          </Vide>
        ) : (
          <>
            <EnTeteDocuments />
            <ul className="flex flex-col divide-y divide-[#EEF2F7]">
              {liste.map((f) => {
                const retard = enRetard(f);
                const client = (f.client as unknown as { nom: string } | null)?.nom;
                const brouillon = f.statut === "brouillon";
                return (
                  <LigneDocument
                    key={f.id}
                    href={`/admin/factures/${f.id}`}
                    numero={brouillon ? <span className="font-medium text-[#4A6178]">{f.type === "avoir" ? "Avoir" : "Facture"} en brouillon</span> : f.numero}
                    client={client}
                    objet={f.objet}
                    date={brouillon ? "" : fmtDate(f.date_emission)}
                    montant={fmtEuros(f.total_ttc)}
                    statut={
                      <Pastille
                        statut={retard ? "retard" : f.statut}
                        libelle={retard ? "En retard" : f.type === "avoir" && f.statut === "payee" ? "Remboursé" : STATUTS_FACTURE[f.statut]}
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

export default function Factures({ searchParams }: PageProps<"/admin/factures">) {
  return (
    <Suspense fallback={<Chargement />}>
      <Contenu searchParams={searchParams as Promise<Sp>} />
    </Suspense>
  );
}
