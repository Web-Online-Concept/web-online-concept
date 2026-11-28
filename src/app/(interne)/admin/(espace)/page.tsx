import Link from "next/link";
import { Suspense } from "react";
import { Icone, type NomIcone } from "@/components/admin/Icones";
import { BoutonLien, Carte, Chargement, Chiffre, LienCarte, Pastille, TitreCarte, TitrePage, Vide } from "@/components/admin/ui";
import { Drapeau } from "@/components/site/Langue";
import { exigerAdmin } from "@/lib/admin/acces";
import { round2, urssafAnnee } from "@/lib/admin/donnees";
import { aujourdhui, deMois, fmtDate, fmtEuros, MOIS, STATUTS_FACTURE } from "@/lib/admin/format";
import { estLangue } from "@/lib/i18n/chemins";

export const metadata = { title: "Tableau de bord" };

const jourLong = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(new Date(iso + "T12:00:00Z"));

const dateCourte = (iso: string) => new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "Europe/Paris" }).format(new Date(iso));

const pluriel = (n: number, mot: string, motPluriel = mot + "s") => `${n} ${n > 1 ? motPluriel : mot}`;

// Encaissements de l'année, mois par mois : barres en dégradé, mois en cours mis en avant
function Histogramme({ mois, moisCourant }: { mois: { mois: string; ca: number }[]; moisCourant: string }) {
  const max = Math.max(1, ...mois.map((m) => m.ca));
  return (
    <div className="flex h-36 items-end gap-1.5 sm:gap-2.5" role="img" aria-label="Chiffre d'affaires encaissé chaque mois de l'année">
      {mois.map((m, i) => {
        const futur = m.mois > moisCourant;
        const courant = m.mois === moisCourant;
        const h = futur ? 0 : Math.max(3, Math.round((Math.max(0, m.ca) / max) * 100));
        return (
          <div key={m.mois} className="flex h-full flex-1 flex-col items-center justify-end gap-2" title={`${MOIS[i]} : ${fmtEuros(m.ca, true)}`}>
            <div className="relative flex w-full flex-1 items-end">
              {futur ? (
                <div className="h-1 w-full rounded-full bg-white/10" />
              ) : (
                <div
                  className={`w-full rounded-t-md rounded-b-sm ${
                    courant
                      ? "bg-[linear-gradient(180deg,#2BD47D,#00B4D8_45%,#1F5EFF)] shadow-[0_0_18px_-4px_rgba(0,180,216,0.9)]"
                      : "bg-[linear-gradient(180deg,rgba(0,180,216,0.75),rgba(31,94,255,0.55))]"
                  }`}
                  style={{ height: `${h}%` }}
                />
              )}
            </div>
            <span className={`text-[11px] font-medium uppercase ${courant ? "text-white" : "text-[#6F86A0]"}`}>{MOIS[i].slice(0, 1)}</span>
          </div>
        );
      })}
    </div>
  );
}

function Tache({ href, icone, ton, titre, detail }: { href: string; icone: NomIcone; ton: string; titre: React.ReactNode; detail?: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="flex items-center gap-3.5 rounded-xl px-2 py-3 transition-colors hover:bg-ciel">
        <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${ton}`}>
          <Icone nom={icone} className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-medium text-nuit">{titre}</span>
          {detail && <span className="block text-sm text-[#4A6178]">{detail}</span>}
        </span>
        <Icone nom="chevron" className="h-5 w-5 shrink-0 text-[#93A6BB]" />
      </Link>
    </li>
  );
}

async function Contenu() {
  const sb = await exigerAdmin();
  const jour = aujourdhui();
  const annee = Number(jour.slice(0, 4));
  const moisCourant = jour.slice(0, 7) + "-01";
  const dPrec = new Date(Date.UTC(annee, Number(jour.slice(5, 7)) - 2, 1));
  const moisPrecedent = dPrec.toISOString().slice(0, 10);

  const [annuel, anneePrec, factures, devis, nonLus, derniersMessages, brouillonsDevis] = await Promise.all([
    urssafAnnee(sb, annee),
    moisPrecedent.startsWith(String(annee)) ? null : urssafAnnee(sb, annee - 1),
    sb
      .from("factures")
      .select("id, numero, type, objet, statut, total_ttc, montant_encaisse, date_emission, date_echeance, client:clients(nom)")
      .order("cree_le", { ascending: false })
      .limit(300),
    sb.from("devis").select("id, total_ttc, date_validite").eq("statut", "envoye"),
    sb.from("messages").select("id", { count: "exact", head: true }).eq("lu", false).eq("archive", false),
    sb.from("messages").select("id, nom, objet, lu, cree_le, langue").eq("archive", false).order("cree_le", { ascending: false }).limit(4),
    sb.from("devis").select("id", { count: "exact", head: true }).eq("statut", "brouillon"),
  ]);

  const calcCourant = annuel.mois.find((m) => m.mois === moisCourant)!;
  const sourcePrec = anneePrec ?? annuel;
  const calcPrec = sourcePrec.mois.find((m) => m.mois === moisPrecedent)!;
  const declPrec = sourcePrec.declarations.get(moisPrecedent);

  const toutes = factures.data ?? [];
  const emises = toutes.filter((f) => f.statut !== "brouillon");
  const facturesType = emises.filter((f) => f.type === "facture");
  const factureMois = round2(
    facturesType.filter((f) => String(f.date_emission).startsWith(jour.slice(0, 7))).reduce((s, f) => s + Number(f.total_ttc), 0),
  );
  const impayees = facturesType.filter((f) => f.statut === "emise");
  const resteDu = round2(impayees.reduce((s, f) => s + Number(f.total_ttc) - Number(f.montant_encaisse), 0));
  const enRetard = impayees.filter((f) => f.date_echeance && f.date_echeance < jour);
  const resteRetard = round2(enRetard.reduce((s, f) => s + Number(f.total_ttc) - Number(f.montant_encaisse), 0));
  const devisAttente = devis.data ?? [];
  const montantDevis = round2(devisAttente.reduce((s, d) => s + Number(d.total_ttc), 0));
  const brouillonsFactures = toutes.filter((f) => f.statut === "brouillon").length;
  const brouillonsDevisN = brouillonsDevis.count ?? 0;
  const nNonLus = nonLus.count ?? 0;
  const pctPlafond = Math.min(100, Math.round((annuel.caAnnee / annuel.plafond) * 100));
  const messages = derniersMessages.data ?? [];

  const urssafAFaire = !declPrec?.declare_le && calcPrec.ca !== 0;
  const brouillons = [
    brouillonsFactures && pluriel(brouillonsFactures, "facture"),
    brouillonsDevisN && pluriel(brouillonsDevisN, "devis", "devis"),
  ].filter(Boolean);

  return (
    <>
      <TitrePage titre="Bonjour Florent" description={<span className="first-letter:uppercase">{jourLong(jour)}</span>}>
        <BoutonLien href="/admin/factures/nouvelle" icone="plus">
          Nouvelle facture
        </BoutonLien>
        <BoutonLien href="/admin/devis/nouveau" variante="secondaire" icone="plus">
          Nouveau devis
        </BoutonLien>
      </TitrePage>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.45fr_1fr]">
        {/* Année en cours : encaissements mois par mois et plafond */}
        <section className="relative overflow-hidden rounded-2xl bg-nuit p-6 text-white shadow-[0_30px_60px_-36px_rgba(10,26,47,0.9)] sm:p-7">
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(31,94,255,0.45),transparent_68%)]" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 left-1/3 h-72 w-[36rem] -rotate-6 rounded-[50%] border border-cyan/15" />
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-[#B8C6D6]">Encaissé en {annee}</p>
              <p className="mt-1 text-[34px] font-semibold leading-none tracking-tight tabular-nums sm:text-[40px]">{fmtEuros(annuel.caAnnee, true)}</p>
            </div>
            <Link href="/admin/urssaf" className="rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-[#D5DEE8] transition-colors hover:border-white/40 hover:text-white">
              Détail URSSAF
            </Link>
          </div>
          <div className="relative mt-7">
            <Histogramme mois={annuel.mois} moisCourant={moisCourant} />
          </div>
          <div className="relative mt-6">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="text-[#B8C6D6]">Plafond micro-entreprise</span>
              <span className="tabular-nums text-[#D5DEE8]">
                {pctPlafond} % de {fmtEuros(annuel.plafond, true)}
              </span>
            </div>
            <div
              className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"
              role="progressbar"
              aria-valuenow={pctPlafond}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Part du plafond atteinte"
            >
              <div className="h-full rounded-full bg-[linear-gradient(90deg,#1F5EFF,#00B4D8_60%,#2BD47D)]" style={{ width: `${Math.max(pctPlafond, 1)}%` }} />
            </div>
          </div>
        </section>

        {/* Ce qui attend une action */}
        <Carte>
          <TitreCarte>À faire</TitreCarte>
          {urssafAFaire || enRetard.length || devisAttente.length || nNonLus || brouillons.length ? (
            <ul className="-mx-2 -my-1 flex flex-col">
              {urssafAFaire && (
                <Tache
                  href="/admin/urssaf"
                  icone="urssaf"
                  ton="bg-[#E8EFFF] text-bleu"
                  titre={`Déclarer le chiffre d'affaires ${deMois(moisPrecedent)}`}
                  detail={`${fmtEuros(calcPrec.caDeclarable, true)}, avant le ${fmtDate(calcPrec.echeance)}`}
                />
              )}
              {enRetard.length > 0 && (
                <Tache
                  href="/admin/factures?statut=retard"
                  icone="alerte"
                  ton="bg-[#FFF4E5] text-[#9A5B00]"
                  titre={`${pluriel(enRetard.length, "facture")} en retard de paiement`}
                  detail={`${fmtEuros(resteRetard)} à relancer`}
                />
              )}
              {nNonLus > 0 && (
                <Tache
                  href="/admin/messages?filtre=non-lus"
                  icone="messages"
                  ton="bg-[#E0F7FB] text-[#0B8E9E]"
                  titre={`${pluriel(nNonLus, "message")} non ${nNonLus > 1 ? "lus" : "lu"}`}
                  detail="Demandes reçues par le site"
                />
              )}
              {devisAttente.length > 0 && (
                <Tache
                  href="/admin/devis?statut=attente"
                  icone="devis"
                  ton="bg-[#EEF2F7] text-[#2C4558]"
                  titre={`${pluriel(devisAttente.length, "devis", "devis")} en attente de réponse`}
                  detail={fmtEuros(montantDevis)}
                />
              )}
              {brouillons.length > 0 && (
                <Tache
                  href={brouillonsFactures ? "/admin/factures?statut=brouillon" : "/admin/devis?statut=brouillon"}
                  icone="crayon"
                  ton="bg-[#EEF2F7] text-[#2C4558]"
                  titre={`Brouillon${brouillonsFactures + brouillonsDevisN > 1 ? "s" : ""} à terminer`}
                  detail={brouillons.join(" et ")}
                />
              )}
            </ul>
          ) : (
            <Vide>Tout est à jour : rien n&apos;attend de réponse.</Vide>
          )}
        </Carte>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
        <Chiffre icone="euro" ton="vert" libelle="Encaissé ce mois-ci" valeur={fmtEuros(calcCourant.ca, true)} detail={`Facturé : ${fmtEuros(factureMois, true)}`} />
        <Chiffre
          icone="horloge"
          ton={enRetard.length ? "orange" : "bleu"}
          libelle="Reste à encaisser"
          valeur={fmtEuros(resteDu, true)}
          detail={`${pluriel(impayees.length, "facture")}${enRetard.length ? `, ${enRetard.length} en retard` : ""}`}
          href="/admin/factures?statut=attente"
        />
        <Chiffre icone="devis" libelle="Devis en attente" valeur={devisAttente.length} detail={fmtEuros(montantDevis, true)} href="/admin/devis?statut=attente" />
        <Chiffre icone="messages" ton="cyan" libelle="Messages non lus" valeur={nNonLus} detail="Page Contact du site" href="/admin/messages" />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.45fr_1fr]">
        <Carte>
          <TitreCarte action={<LienCarte href="/admin/factures">Toutes les factures</LienCarte>}>Dernières factures</TitreCarte>
          {emises.length === 0 ? (
            <Vide icone="factures">Aucune facture émise pour l&apos;instant.</Vide>
          ) : (
            <ul className="-mx-3 flex flex-col">
              {emises.slice(0, 6).map((f) => {
                const retard = f.statut === "emise" && f.date_echeance && f.date_echeance < jour;
                const client = f.client as unknown as { nom: string } | null;
                return (
                  <li key={f.id}>
                    <Link href={`/admin/factures/${f.id}`} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-0.5 rounded-xl px-3 py-3 transition-colors hover:bg-ciel">
                      <span className="min-w-0">
                        <span className="block truncate text-[15px] font-medium text-nuit">{client?.nom}</span>
                        <span className="block text-sm text-[#4A6178] tabular-nums">
                          {f.numero}, {fmtDate(f.date_emission)}
                        </span>
                      </span>
                      <span className="flex flex-col items-end gap-1">
                        <span className="text-[15px] font-medium tabular-nums">{fmtEuros(f.total_ttc)}</span>
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
          <TitreCarte action={<LienCarte href="/admin/messages">Tous les messages</LienCarte>}>Derniers messages</TitreCarte>
          {messages.length === 0 ? (
            <Vide icone="messages">Aucun message reçu pour l&apos;instant.</Vide>
          ) : (
            <ul className="-mx-3 flex flex-col">
              {messages.map((m) => (
                <li key={m.id}>
                  <Link href={`/admin/messages#m-${m.id}`} className="flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-ciel">
                    <Drapeau l={estLangue(m.langue) ? m.langue : "fr"} className="mt-0.5 h-5 w-5 ring-[#E3E9F0]" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className={`truncate text-[15px] ${m.lu ? "text-nuit" : "font-semibold text-nuit"}`}>{m.nom}</span>
                        {!m.lu && <span aria-label="Non lu" className="h-2 w-2 shrink-0 rounded-full bg-bleu" />}
                        <span className="ml-auto shrink-0 text-xs text-[#4A6178]">{dateCourte(m.cree_le)}</span>
                      </span>
                      <span className="block truncate text-sm text-[#4A6178]">{m.objet || "Sans objet"}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Carte>
      </div>
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
