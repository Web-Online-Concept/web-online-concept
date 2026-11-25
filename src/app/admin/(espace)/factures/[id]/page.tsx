import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import EditeurDocument from "@/components/admin/EditeurDocument";
import {
  Alerte,
  Carte,
  Chargement,
  Champ,
  classeBouton,
  classeBoutonDanger,
  classeBoutonSecondaire,
  classeChamp,
  Pastille,
  TitrePage,
} from "@/components/admin/ui";
import { exigerAdmin } from "@/lib/admin/acces";
import { listeClients } from "@/lib/admin/donnees";
import { chargerFacture } from "@/lib/admin/documents";
import { aujourdhui, fmtDate, fmtEuros, STATUTS_FACTURE } from "@/lib/admin/format";
import { ajouterEncaissement, creerAvoir, enregistrerFacture, marquerEnvoyee, supprimerBrouillon, supprimerEncaissement } from "../actions";

export const metadata = { title: "Facture" };

const MODES: Record<string, string> = {
  virement: "Virement",
  cheque: "Chèque",
  especes: "Espèces",
  carte: "Carte bancaire",
  paypal: "PayPal",
  autre: "Autre",
};

type Sp = { erreur?: string; emise?: string; enregistre?: string };

async function Contenu({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Sp> }) {
  const sb = await exigerAdmin();
  const { id } = await params;
  const sp = await searchParams;
  const c = await chargerFacture(sb, id);
  if (!c) notFound();
  const f = c.facture;
  const avoir = f.type === "avoir";
  const nomDoc = avoir ? "Avoir" : "Facture";

  const messages = (
    <>
      {sp.erreur && (
        <div className="mb-5">
          <Alerte ton="erreur">{sp.erreur}</Alerte>
        </div>
      )}
      {sp.emise && (
        <div className="mb-5">
          <Alerte ton="succes">{nomDoc} émis{avoir ? "" : "e"} et archivé{avoir ? "" : "e"} : le PDF est prêt à être envoyé.</Alerte>
        </div>
      )}
      {sp.enregistre && (
        <div className="mb-5">
          <Alerte ton="succes">Brouillon enregistré.</Alerte>
        </div>
      )}
    </>
  );

  if (f.statut === "brouillon") {
    const clients = await listeClients(sb);
    return (
      <>
        <TitrePage titre={`${nomDoc} en brouillon`}>
          <a href={`/admin/factures/${id}/pdf`} target="_blank" rel="noopener" className={classeBoutonSecondaire}>
            Aperçu PDF
          </a>
        </TitrePage>
        {messages}
        {c.origine && (
          <div className="mb-5">
            <Alerte>
              Avoir sur la facture{" "}
              <Link href={`/admin/factures/${c.origine.id}`} className="font-medium underline">
                {c.origine.numero}
              </Link>
              . Les montants sont négatifs ; ajustez les lignes pour un avoir partiel.
            </Alerte>
          </div>
        )}
        <Carte>
          <EditeurDocument
            genre={avoir ? "avoir" : "facture"}
            action={enregistrerFacture}
            id={id}
            clients={clients}
            valeurs={{
              client_id: f.client_id,
              objet: f.objet ?? "",
              date_emission: f.date_emission ?? "",
              date_fin: f.date_echeance ?? "",
              notes: f.notes ?? "",
            }}
            lignesInitiales={c.lignes.map((l) => ({
              designation: l.designation,
              description: l.description ?? "",
              quantite: String(l.quantite),
              unite: l.unite ?? "",
              prix_unitaire: String(l.prix_unitaire),
            }))}
            libelleEmettre={avoir ? "Émettre l'avoir" : "Émettre la facture"}
            retourNouveauClient={`/admin/factures/${id}`}
          />
        </Carte>
        <form action={supprimerBrouillon} className="mt-5">
          <input type="hidden" name="id" value={id} />
          <button type="submit" className={classeBoutonDanger}>
            Supprimer ce brouillon
          </button>
        </form>
      </>
    );
  }

  const reste = Math.round((Number(f.total_ttc) - Number(f.montant_encaisse)) * 100) / 100;
  const jour = aujourdhui();
  const retard = f.statut === "emise" && f.date_echeance && f.date_echeance < jour;

  return (
    <>
      <TitrePage titre={`${nomDoc} ${f.numero}`}>
        <a href={`/admin/factures/${id}/pdf`} target="_blank" rel="noopener" className={classeBouton}>
          Télécharger le PDF
        </a>
        {!avoir && f.statut !== "annulee" && (
          <form action={creerAvoir}>
            <input type="hidden" name="id" value={id} />
            <button type="submit" className={classeBoutonSecondaire}>
              Établir un avoir
            </button>
          </form>
        )}
      </TitrePage>
      {messages}
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Carte>
          <div className="flex flex-wrap items-center gap-3">
            <Pastille statut={retard ? "retard" : f.statut} libelle={retard ? "En retard" : STATUTS_FACTURE[f.statut]} />
            {f.envoyee_le && <span className="text-sm text-[#4A6178]">Envoyée le {fmtDate(f.envoyee_le)}</span>}
          </div>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-[#4A6178]">Client</dt>
              <dd className="mt-1 font-medium">
                <Link href={`/admin/clients/${f.client_id}`} className="hover:underline">
                  {c.client.nom}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-[#4A6178]">Objet</dt>
              <dd className="mt-1">{f.objet || "Sans objet"}</dd>
            </div>
            <div>
              <dt className="text-sm text-[#4A6178]">Date</dt>
              <dd className="mt-1">{fmtDate(f.date_emission)}</dd>
            </div>
            <div>
              <dt className="text-sm text-[#4A6178]">Échéance</dt>
              <dd className="mt-1">{fmtDate(f.date_echeance)}</dd>
            </div>
            {c.origine && (
              <div>
                <dt className="text-sm text-[#4A6178]">Facture d&apos;origine</dt>
                <dd className="mt-1">
                  <Link href={`/admin/factures/${c.origine.id}`} className="text-bleu hover:underline">
                    {c.origine.numero}
                  </Link>
                </dd>
              </div>
            )}
          </dl>
          <ul className="mt-6 divide-y divide-[#EEF2F7] border-t border-[#EEF2F7]">
            {c.lignes.map((l) => (
              <li key={l.id} className="flex justify-between gap-4 py-3 text-[15px]">
                <span>
                  {l.designation}
                  <span className="text-[#4A6178]">
                    {" "}
                    ({l.quantite} × {fmtEuros(l.prix_unitaire)})
                  </span>
                </span>
                <span className="font-medium">{fmtEuros(l.total_ht)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex justify-between rounded-xl bg-ciel px-4 py-3 text-lg font-semibold">
            <span>Total</span>
            <span>{fmtEuros(f.total_ttc)}</span>
          </p>
          {c.avoirs.length > 0 && (
            <p className="mt-4 text-[15px] text-[#4A6178]">
              Avoir{c.avoirs.length > 1 ? "s" : ""} lié{c.avoirs.length > 1 ? "s" : ""} :{" "}
              {c.avoirs.map((a, i) => (
                <span key={a.id}>
                  {i > 0 && ", "}
                  <Link href={`/admin/factures/${a.id}`} className="text-bleu hover:underline">
                    {a.numero ?? "brouillon"}
                  </Link>
                </span>
              ))}
            </p>
          )}
          {!f.envoyee_le && (
            <form action={marquerEnvoyee} className="mt-5">
              <input type="hidden" name="id" value={id} />
              <button type="submit" className={classeBoutonSecondaire}>
                Marquer comme envoyée au client
              </button>
            </form>
          )}
          {f.pdf_sha256 && <p className="mt-5 break-all text-xs text-[#4A6178]">PDF archivé, empreinte SHA-256 : {f.pdf_sha256}</p>}
        </Carte>

        <Carte>
          <h2 className="text-lg font-semibold">{avoir ? "Remboursements" : "Encaissements"}</h2>
          <p className="mt-1 text-sm text-[#4A6178]">
            Le calcul URSSAF se base sur ces dates{avoir ? " (montants négatifs)" : ""}.
          </p>
          {c.encaissements.length > 0 && (
            <ul className="mt-4 divide-y divide-[#EEF2F7]">
              {c.encaissements.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 py-2.5 text-[15px]">
                  <span>
                    {fmtDate(e.date_encaissement)}, {MODES[e.mode] ?? e.mode}
                  </span>
                  <span className="font-medium">{fmtEuros(e.montant)}</span>
                  <form action={supprimerEncaissement}>
                    <input type="hidden" name="facture_id" value={id} />
                    <input type="hidden" name="encaissement_id" value={e.id} />
                    <button type="submit" className="text-sm text-[#B42318] hover:underline" aria-label={`Supprimer l'encaissement du ${fmtDate(e.date_encaissement)}`}>
                      Retirer
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-[15px]">
            Reste {avoir ? "à rembourser" : "à encaisser"} : <strong>{fmtEuros(reste)}</strong>
          </p>
          {reste !== 0 && f.statut !== "annulee" && (
            <form action={ajouterEncaissement} className="mt-5 flex flex-col gap-3 border-t border-[#EEF2F7] pt-5">
              <input type="hidden" name="facture_id" value={id} />
              <div className="grid grid-cols-2 gap-3">
                <Champ libelle="Date" htmlFor="date_encaissement">
                  <input id="date_encaissement" name="date_encaissement" type="date" defaultValue={jour} required className={classeChamp} />
                </Champ>
                <Champ libelle="Montant" htmlFor="montant">
                  <input id="montant" name="montant" inputMode="decimal" defaultValue={String(reste)} required className={classeChamp} />
                </Champ>
              </div>
              <Champ libelle="Mode" htmlFor="mode">
                <select id="mode" name="mode" className={classeChamp} defaultValue="virement">
                  {Object.entries(MODES).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </Champ>
              <button type="submit" className={classeBouton}>
                {avoir ? "Enregistrer le remboursement" : "Enregistrer l'encaissement"}
              </button>
            </form>
          )}
        </Carte>
      </div>
    </>
  );
}

export default function PageFacture({ params, searchParams }: PageProps<"/admin/factures/[id]">) {
  return (
    <Suspense fallback={<Chargement />}>
      <Contenu params={params} searchParams={searchParams as Promise<Sp>} />
    </Suspense>
  );
}
