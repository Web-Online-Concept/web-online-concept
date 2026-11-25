import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import CopierLien from "@/components/admin/CopierLien";
import EditeurDocument from "@/components/admin/EditeurDocument";
import { Alerte, Carte, Chargement, classeBouton, classeBoutonDanger, classeBoutonSecondaire, Pastille, TitrePage } from "@/components/admin/ui";
import { exigerAdmin } from "@/lib/admin/acces";
import { listeClients } from "@/lib/admin/donnees";
import { chargerDevis } from "@/lib/admin/documents";
import { aujourdhui, fmtDate, fmtEuros, STATUTS_DEVIS } from "@/lib/admin/format";
import { changerStatutDevis, convertirEnFacture, dupliquerDevis, enregistrerDevis, marquerAccepte, supprimerDevisBrouillon } from "../actions";

export const metadata = { title: "Devis" };

type Sp = { erreur?: string; emis?: string; enregistre?: string };

async function Contenu({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Sp> }) {
  const sb = await exigerAdmin();
  const { id } = await params;
  const sp = await searchParams;
  const c = await chargerDevis(sb, id);
  if (!c) notFound();
  const d = c.devis;

  const messages = (
    <>
      {sp.erreur && (
        <div className="mb-5">
          <Alerte ton="erreur">{sp.erreur}</Alerte>
        </div>
      )}
      {sp.emis && (
        <div className="mb-5">
          <Alerte ton="succes">Devis émis. Envoyez le PDF au client : il contient le lien pour l&apos;accepter en ligne.</Alerte>
        </div>
      )}
      {sp.enregistre && (
        <div className="mb-5">
          <Alerte ton="succes">Brouillon enregistré.</Alerte>
        </div>
      )}
    </>
  );

  if (!d.numero) {
    const clients = await listeClients(sb);
    return (
      <>
        <TitrePage titre="Devis en brouillon">
          <a href={`/admin/devis/${id}/pdf`} target="_blank" rel="noopener" className={classeBoutonSecondaire}>
            Aperçu PDF
          </a>
        </TitrePage>
        {messages}
        <Carte>
          <EditeurDocument
            genre="devis"
            action={enregistrerDevis}
            id={id}
            clients={clients}
            valeurs={{ client_id: d.client_id, objet: d.objet ?? "", date_emission: d.date_emission ?? "", date_fin: d.date_validite ?? "", notes: d.notes ?? "" }}
            lignesInitiales={c.lignes.map((l) => ({
              designation: l.designation,
              description: l.description ?? "",
              quantite: String(l.quantite),
              unite: l.unite ?? "",
              prix_unitaire: String(l.prix_unitaire),
            }))}
            libelleEmettre="Émettre le devis"
            retourNouveauClient={`/admin/devis/${id}`}
          />
        </Carte>
        <form action={supprimerDevisBrouillon} className="mt-5">
          <input type="hidden" name="id" value={id} />
          <button type="submit" className={classeBoutonDanger}>
            Supprimer ce brouillon
          </button>
        </form>
      </>
    );
  }

  const jour = aujourdhui();
  const expire = d.statut === "envoye" && d.date_validite && d.date_validite < jour;

  return (
    <>
      <TitrePage titre={`Devis ${d.numero}`}>
        <a href={`/admin/devis/${id}/pdf`} target="_blank" rel="noopener" className={classeBouton}>
          Télécharger le PDF
        </a>
        <form action={dupliquerDevis}>
          <input type="hidden" name="id" value={id} />
          <button type="submit" className={classeBoutonSecondaire}>
            Dupliquer
          </button>
        </form>
      </TitrePage>
      {messages}
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Carte>
          <Pastille statut={expire ? "expire" : d.statut} libelle={expire ? "Expiré" : STATUTS_DEVIS[d.statut]} />
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-[#4A6178]">Client</dt>
              <dd className="mt-1 font-medium">
                <Link href={`/admin/clients/${d.client_id}`} className="hover:underline">
                  {c.client.nom}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-[#4A6178]">Objet</dt>
              <dd className="mt-1">{d.objet || "Sans objet"}</dd>
            </div>
            <div>
              <dt className="text-sm text-[#4A6178]">Date</dt>
              <dd className="mt-1">{fmtDate(d.date_emission)}</dd>
            </div>
            <div>
              <dt className="text-sm text-[#4A6178]">Valable jusqu&apos;au</dt>
              <dd className="mt-1">{fmtDate(d.date_validite)}</dd>
            </div>
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
            <span>{fmtEuros(d.total_ttc)}</span>
          </p>
        </Carte>

        <Carte>
          <h2 className="text-lg font-semibold">Suivi</h2>
          {d.statut === "accepte" && (
            <p className="mt-3 text-[15px] text-[#0E7A45]">
              Accepté le {fmtDate(d.accepte_le)} {d.accepte_par && <>par {d.accepte_par}</>}.
            </p>
          )}
          <div className="mt-4 flex flex-col items-start gap-3">
            {d.statut === "envoye" && <CopierLien chemin={`/devis/${d.jeton_acceptation}`} />}
            {d.facture_id ? (
              <Link href={`/admin/factures/${d.facture_id}`} className={classeBouton}>
                Voir la facture
              </Link>
            ) : (
              (d.statut === "accepte" || d.statut === "envoye") && (
                <form action={convertirEnFacture}>
                  <input type="hidden" name="id" value={id} />
                  <button type="submit" className={classeBouton}>
                    Transformer en facture
                  </button>
                </form>
              )
            )}
            {d.statut === "envoye" && (
              <>
                <form action={marquerAccepte}>
                  <input type="hidden" name="id" value={id} />
                  <button type="submit" className={classeBoutonSecondaire}>
                    Marquer comme accepté (accord hors ligne)
                  </button>
                </form>
                <form action={changerStatutDevis}>
                  <input type="hidden" name="id" value={id} />
                  <input type="hidden" name="statut" value="refuse" />
                  <button type="submit" className={classeBoutonDanger}>
                    Marquer comme refusé
                  </button>
                </form>
              </>
            )}
            {d.statut === "refuse" && (
              <form action={changerStatutDevis}>
                <input type="hidden" name="id" value={id} />
                <input type="hidden" name="statut" value="envoye" />
                <button type="submit" className={classeBoutonSecondaire}>
                  Remettre en attente
                </button>
              </form>
            )}
          </div>
        </Carte>
      </div>
    </>
  );
}

export default function PageDevis({ params, searchParams }: PageProps<"/admin/devis/[id]">) {
  return (
    <Suspense fallback={<Chargement />}>
      <Contenu params={params} searchParams={searchParams as Promise<Sp>} />
    </Suspense>
  );
}
