import Link from "next/link";
import { Suspense } from "react";
import { BoutonLien, Carte, Chargement, Pastille, TitrePage } from "@/components/admin/ui";
import { exigerAdmin } from "@/lib/admin/acces";
import { round2, urssafAnnee } from "@/lib/admin/donnees";
import { aujourdhui, fmtDate, fmtEuros, libelleMois, STATUTS_FACTURE } from "@/lib/admin/format";

export const metadata = { title: "Tableau de bord" };

async function Contenu() {
  const sb = await exigerAdmin();
  const jour = aujourdhui();
  const annee = Number(jour.slice(0, 4));
  const moisCourant = jour.slice(0, 7) + "-01";
  const dPrec = new Date(Date.UTC(annee, Number(jour.slice(5, 7)) - 2, 1));
  const moisPrecedent = dPrec.toISOString().slice(0, 10);

  const [annuel, anneePrec, factures, devis, messages] = await Promise.all([
    urssafAnnee(sb, annee),
    moisPrecedent.startsWith(String(annee)) ? null : urssafAnnee(sb, annee - 1),
    sb.from("factures").select("id, numero, type, objet, statut, total_ttc, montant_encaisse, date_emission, date_echeance, client:clients(nom)").neq("statut", "brouillon").order("date_emission", { ascending: false }).limit(200),
    sb.from("devis").select("id, total_ttc").eq("statut", "envoye"),
    sb.from("messages").select("id", { count: "exact", head: true }).eq("lu", false),
  ]);

  const calcCourant = annuel.mois.find((m) => m.mois === moisCourant)!;
  const sourcePrec = anneePrec ?? annuel;
  const calcPrec = sourcePrec.mois.find((m) => m.mois === moisPrecedent)!;
  const declPrec = sourcePrec.declarations.get(moisPrecedent);

  const liste = factures.data ?? [];
  const facturesType = liste.filter((f) => f.type === "facture");
  const factureMois = round2(
    facturesType.filter((f) => String(f.date_emission).startsWith(jour.slice(0, 7))).reduce((s, f) => s + Number(f.total_ttc), 0),
  );
  const impayees = facturesType.filter((f) => f.statut === "emise");
  const resteDu = round2(impayees.reduce((s, f) => s + Number(f.total_ttc) - Number(f.montant_encaisse), 0));
  const enRetard = impayees.filter((f) => f.date_echeance && f.date_echeance < jour);
  const devisAttente = devis.data ?? [];
  const pctPlafond = Math.min(100, Math.round((annuel.caAnnee / annuel.plafond) * 100));

  return (
    <>
      <TitrePage titre="Tableau de bord">
        <BoutonLien href="/admin/factures/nouvelle">Nouvelle facture</BoutonLien>
        <BoutonLien href="/admin/devis/nouveau" variante="secondaire">
          Nouveau devis
        </BoutonLien>
      </TitrePage>

      <div className="grid gap-5 lg:grid-cols-3">
        <Carte className="lg:col-span-2">
          <h2 className="text-lg font-semibold">Déclaration URSSAF de {libelleMois(moisPrecedent)}</h2>
          {declPrec?.declare_le ? (
            <p className="mt-3 text-[15px] text-[#0E7A45]">
              Déclarée le {fmtDate(declPrec.declare_le)} : {fmtEuros(declPrec.ca_declare, true)} de CA
              {declPrec.montant_paye !== null && <>, {fmtEuros(declPrec.montant_paye, true)} payés</>}.
            </p>
          ) : (
            <>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-[#4A6178]">CA encaissé à déclarer</p>
                  <p className="mt-1 text-2xl font-semibold">{fmtEuros(calcPrec.ca, true)}</p>
                </div>
                <div>
                  <p className="text-sm text-[#4A6178]">Montant à payer</p>
                  <p className="mt-1 text-2xl font-semibold">{fmtEuros(calcPrec.total, true)}</p>
                </div>
                <div>
                  <p className="text-sm text-[#4A6178]">Échéance</p>
                  <p className="mt-1 text-2xl font-semibold">{fmtDate(calcPrec.echeance)}</p>
                </div>
              </div>
              <Link href="/admin/urssaf" className="mt-4 inline-block text-[15px] font-medium text-bleu hover:underline">
                Voir le détail et marquer comme déclarée
              </Link>
            </>
          )}
        </Carte>

        <Carte>
          <h2 className="text-lg font-semibold">Plafond {annee}</h2>
          <p className="mt-3 text-2xl font-semibold">{fmtEuros(annuel.caAnnee, true)}</p>
          <p className="text-sm text-[#4A6178]">encaissés sur {fmtEuros(annuel.plafond, true)}</p>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-ciel" role="progressbar" aria-valuenow={pctPlafond} aria-valuemin={0} aria-valuemax={100} aria-label="Part du plafond atteinte">
            <div className="h-full rounded-full bg-gradient-to-r from-bleu via-cyan to-vert" style={{ width: `${Math.max(pctPlafond, 1)}%` }} />
          </div>
          <p className="mt-2 text-sm text-[#4A6178]">{pctPlafond} % du plafond micro-entreprise</p>
        </Carte>

        <Carte>
          <p className="text-sm text-[#4A6178]">Encaissé ce mois-ci</p>
          <p className="mt-1 text-2xl font-semibold">{fmtEuros(calcCourant.ca)}</p>
          <p className="mt-3 text-sm text-[#4A6178]">Facturé ce mois-ci</p>
          <p className="mt-1 text-lg font-semibold">{fmtEuros(factureMois)}</p>
        </Carte>
        <Carte>
          <p className="text-sm text-[#4A6178]">Reste à encaisser</p>
          <p className="mt-1 text-2xl font-semibold">{fmtEuros(resteDu)}</p>
          <p className="mt-3 text-sm text-[#4A6178]">
            {impayees.length} facture{impayees.length > 1 ? "s" : ""} en attente
            {enRetard.length > 0 && <span className="font-medium text-[#9A5B00]">, dont {enRetard.length} en retard</span>}
          </p>
        </Carte>
        <Carte>
          <p className="text-sm text-[#4A6178]">Devis en attente de réponse</p>
          <p className="mt-1 text-2xl font-semibold">{devisAttente.length}</p>
          <p className="mt-1 text-sm text-[#4A6178]">{fmtEuros(devisAttente.reduce((s, d) => s + Number(d.total_ttc), 0))}</p>
          <Link href="/admin/messages" className="mt-3 inline-block text-[15px] font-medium text-bleu hover:underline">
            {messages.count ?? 0} message{(messages.count ?? 0) > 1 ? "s" : ""} non lu{(messages.count ?? 0) > 1 ? "s" : ""}
          </Link>
        </Carte>
      </div>

      <Carte className="mt-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Dernières factures</h2>
          <Link href="/admin/factures" className="text-[15px] font-medium text-bleu hover:underline">
            Toutes les factures
          </Link>
        </div>
        {liste.length === 0 ? (
          <p className="mt-4 text-[15px] text-[#4A6178]">Aucune facture émise pour l&apos;instant.</p>
        ) : (
          <ul className="mt-4 divide-y divide-[#EEF2F7]">
            {liste.slice(0, 6).map((f) => {
              const retard = f.statut === "emise" && f.date_echeance && f.date_echeance < jour;
              const client = f.client as unknown as { nom: string } | null;
              return (
                <li key={f.id}>
                  <Link href={`/admin/factures/${f.id}`} className="flex flex-wrap items-center justify-between gap-3 py-3 hover:bg-ciel/60">
                    <span className="font-medium">{f.numero}</span>
                    <span className="flex-1 text-[15px] text-[#2C4558]">{client?.nom}</span>
                    <span className="text-[15px]">{fmtEuros(f.total_ttc)}</span>
                    <Pastille statut={retard ? "retard" : f.statut} libelle={retard ? "En retard" : STATUTS_FACTURE[f.statut]} />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Carte>
    </>
  );
}

export default function TableauDeBord() {
  return (
    <Suspense fallback={<Chargement />}>
      <Contenu />
    </Suspense>
  );
}
