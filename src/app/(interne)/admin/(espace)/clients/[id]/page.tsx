import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import FormulaireClient from "@/components/admin/FormulaireClient";
import { Icone } from "@/components/admin/Icones";
import { Alerte, BoutonLien, Carte, Chargement, classeBoutonSecondaire, Pastille, TitreCarte, TitrePage } from "@/components/admin/ui";
import { exigerAdmin } from "@/lib/admin/acces";
import { round2 } from "@/lib/admin/donnees";
import { aujourdhui, fmtDate, fmtEuros, STATUTS_DEVIS, STATUTS_FACTURE } from "@/lib/admin/format";
import { basculerArchive } from "../actions";

export const metadata = { title: "Client" };

async function Contenu({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ enregistre?: string }> }) {
  const sb = await exigerAdmin();
  const { id } = await params;
  const { enregistre } = await searchParams;
  const jour = aujourdhui();
  const [{ data: client }, { data: factures }, { data: devis }] = await Promise.all([
    sb.from("clients").select("*").eq("id", id).maybeSingle(),
    sb.from("factures").select("id, numero, type, statut, objet, total_ttc, montant_encaisse, date_emission, date_echeance").eq("client_id", id).order("cree_le", { ascending: false }),
    sb.from("devis").select("id, numero, statut, total_ttc, date_emission, date_validite, objet").eq("client_id", id).order("cree_le", { ascending: false }),
  ]);
  if (!client) notFound();

  const emises = (factures ?? []).filter((f) => f.statut !== "brouillon" && f.statut !== "annulee");
  const facture = round2(emises.reduce((s, f) => s + Number(f.total_ttc), 0));
  const encaisse = round2(emises.reduce((s, f) => s + Number(f.montant_encaisse), 0));
  const reste = round2(emises.filter((f) => f.type === "facture" && f.statut === "emise").reduce((s, f) => s + Number(f.total_ttc) - Number(f.montant_encaisse), 0));

  return (
    <>
      <TitrePage
        titre={client.nom}
        retour={{ href: "/admin/clients", libelle: "Clients" }}
        description={
          <span className="flex flex-wrap gap-x-4 gap-y-1">
            <span>{[client.type === "entreprise" ? (client.siren ? `SIREN ${client.siren}` : "Professionnel") : "Particulier", client.ville].filter(Boolean).join(", ")}</span>
            {client.email && (
              <a href={`mailto:${client.email}`} className="inline-flex items-center gap-1.5 text-bleu transition-colors hover:text-[#1638A8]">
                <Icone nom="enveloppe" className="h-4 w-4" />
                {client.email}
              </a>
            )}
            {client.telephone && (
              <a href={`tel:${String(client.telephone).replace(/[^0-9+]/g, "")}`} className="inline-flex items-center gap-1.5 text-bleu transition-colors hover:text-[#1638A8]">
                <Icone nom="telephone" className="h-4 w-4" />
                {client.telephone}
              </a>
            )}
          </span>
        }
      >
        <BoutonLien href={`/admin/factures/nouvelle?client=${client.id}`} icone="plus">
          Facturer
        </BoutonLien>
        <BoutonLien href={`/admin/devis/nouveau?client=${client.id}`} variante="secondaire" icone="plus">
          Devis
        </BoutonLien>
      </TitrePage>

      {client.archive && (
        <div className="mb-5">
          <Alerte>Client archivé : il n&apos;apparaît plus dans les listes de choix des devis et factures.</Alerte>
        </div>
      )}
      {enregistre && (
        <div className="mb-5">
          <Alerte ton="succes">Fiche client enregistrée.</Alerte>
        </div>
      )}

      <div className="mb-5 grid grid-cols-3 overflow-hidden rounded-2xl border border-[#E3E9F0] bg-white">
        {[
          { l: "Facturé", v: facture },
          { l: "Encaissé", v: encaisse },
          { l: "Reste à encaisser", v: reste },
        ].map((x, i) => (
          <div key={x.l} className={`px-4 py-4 sm:px-6 sm:py-5 ${i ? "border-l border-[#EEF2F7]" : ""}`}>
            <p className="text-xs text-[#4A6178] sm:text-sm">{x.l}</p>
            <p className={`mt-1 text-[17px] font-semibold tabular-nums sm:text-[22px] ${i === 2 && x.v > 0 ? "text-[#9A5B00]" : "text-nuit"}`}>{fmtEuros(x.v, true)}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-5">
          <Carte>
            <TitreCarte>Factures</TitreCarte>
            {(factures ?? []).length === 0 ? (
              <p className="text-[15px] text-[#4A6178]">Aucune facture pour ce client.</p>
            ) : (
              <ul className="-mx-3 flex flex-col">
                {factures!.map((f) => {
                  const retard = f.type === "facture" && f.statut === "emise" && f.date_echeance && f.date_echeance < jour;
                  return (
                    <li key={f.id}>
                      <Link href={`/admin/factures/${f.id}`} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 rounded-xl px-3 py-2.5 transition-colors hover:bg-ciel">
                        <span className="min-w-0">
                          <span className="block font-medium tabular-nums text-nuit">{f.numero ?? "Brouillon"}</span>
                          <span className="block truncate text-sm text-[#4A6178]">{[f.objet, f.date_emission && fmtDate(f.date_emission)].filter(Boolean).join(", ")}</span>
                        </span>
                        <span className="flex flex-col items-end gap-1">
                          <span className="text-[15px] tabular-nums">{fmtEuros(f.total_ttc)}</span>
                          <Pastille statut={retard ? "retard" : f.statut} libelle={retard ? "En retard" : STATUTS_FACTURE[f.statut]} />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </Carte>
          <Carte>
            <TitreCarte>Devis</TitreCarte>
            {(devis ?? []).length === 0 ? (
              <p className="text-[15px] text-[#4A6178]">Aucun devis pour ce client.</p>
            ) : (
              <ul className="-mx-3 flex flex-col">
                {devis!.map((d) => {
                  const expire = d.statut === "envoye" && d.date_validite && d.date_validite < jour;
                  return (
                    <li key={d.id}>
                      <Link href={`/admin/devis/${d.id}`} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 rounded-xl px-3 py-2.5 transition-colors hover:bg-ciel">
                        <span className="min-w-0">
                          <span className="block font-medium tabular-nums text-nuit">{d.numero ?? "Brouillon"}</span>
                          <span className="block truncate text-sm text-[#4A6178]">{[d.objet, d.date_emission && fmtDate(d.date_emission)].filter(Boolean).join(", ")}</span>
                        </span>
                        <span className="flex flex-col items-end gap-1">
                          <span className="text-[15px] tabular-nums">{fmtEuros(d.total_ttc)}</span>
                          <Pastille statut={expire ? "expire" : d.statut} libelle={expire ? "Expiré" : STATUTS_DEVIS[d.statut]} />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </Carte>
        </div>

        <div className="flex flex-col gap-5">
          <Carte>
            <TitreCarte sousTitre="Recopiée sur chaque document au moment de son émission.">Fiche client</TitreCarte>
            <FormulaireClient client={client} />
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
