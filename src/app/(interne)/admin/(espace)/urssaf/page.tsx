import Link from "next/link";
import { Suspense } from "react";
import { Icone } from "@/components/admin/Icones";
import { Alerte, Carte, Chargement, Champ, classeBouton, classeBoutonSecondaire, classeChamp, Filtres, TitrePage } from "@/components/admin/ui";
import { exigerAdmin } from "@/lib/admin/acces";
import { urssafAnnee } from "@/lib/admin/donnees";
import { aujourdhui, deMois, fmtDate, fmtEuros, libelleMois, MOIS } from "@/lib/admin/format";
import { enregistrerDeclaration, enregistrerHorsOutil, supprimerDeclaration } from "./actions";

export const metadata = { title: "URSSAF" };

type Sp = { annee?: string; mois?: string; ok?: string; erreur?: string };

const pct = (n: number) => `${String(n).replace(".", ",")} %`;
const saisie = (n: number) => String(n).replace(".", ",");

async function Contenu({ searchParams }: { searchParams: Promise<Sp> }) {
  const sb = await exigerAdmin();
  const sp = await searchParams;
  const jour = aujourdhui();
  const anneeCourante = Number(jour.slice(0, 4));
  const annee = /^\d{4}$/.test(sp.annee ?? "") ? Number(sp.annee) : anneeCourante;
  const moisCourant = jour.slice(0, 7) + "-01";
  const { mois, declarations, caAnnee, plafond, taux } = await urssafAnnee(sb, annee);
  const tauxActuel = taux.length ? taux[taux.length - 1] : null;

  const passes = mois.filter((m) => m.mois < moisCourant);
  const aDeclarer = passes.filter((m) => !declarations.has(m.mois));
  const selection = mois.find((m) => m.mois === sp.mois) ?? aDeclarer[aDeclarer.length - 1] ?? passes[passes.length - 1] ?? mois[0];
  const declSelection = declarations.get(selection.mois);

  const totaux = mois.reduce(
    (t, m) => ({ ca: t.ca + m.ca, cot: t.cot + m.cotisations, vl: t.vl + m.versementLiberatoire, cfp: t.cfp + m.formation, total: t.total + m.total }),
    { ca: 0, cot: 0, vl: 0, cfp: 0, total: 0 },
  );
  const paye = [...declarations.values()].reduce((s, d) => s + (d.montant_paye ?? 0), 0);
  const ratio = Math.min(100, Math.round((caAnnee / plafond) * 100));

  return (
    <>
      <TitrePage titre={`URSSAF ${annee}`} description="Chiffre d'affaires encaissé, cotisations calculées et suivi des déclarations mensuelles.">
        <a href={`/admin/exports/urssaf?annee=${annee}&format=pdf`} className={classeBouton}>
          <Icone nom="exports" className="h-[18px] w-[18px]" />
          Récapitulatif PDF
        </a>
      </TitrePage>
      <div className="mb-5">
        <Filtres
          libelle="Année"
          options={[anneeCourante - 2, anneeCourante - 1, anneeCourante].map((a) => ({ href: `/admin/urssaf?annee=${a}`, libelle: String(a), actif: a === annee }))}
        />
      </div>

      {sp.erreur && (
        <div className="mb-5">
          <Alerte ton="erreur">{sp.erreur}</Alerte>
        </div>
      )}
      {sp.ok && (
        <div className="mb-5">
          <Alerte ton="succes">
            {sp.ok === "declaration" ? "Déclaration enregistrée." : sp.ok === "suppression" ? "Déclaration retirée." : "Chiffre d'affaires hors outil mis à jour."}
          </Alerte>
        </div>
      )}

      <div className="mb-5 grid grid-cols-1 gap-3 sm:gap-5 md:grid-cols-3">
        <Carte>
          <p className="text-sm text-[#4A6178]">CA encaissé {annee}</p>
          <p className="mt-1 text-2xl font-semibold">{fmtEuros(caAnnee)}</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E1E7EF]" role="img" aria-label={`${ratio} % du plafond de ${fmtEuros(plafond, true)}`}>
            <div className={`h-2 rounded-full ${ratio >= 90 ? "bg-[#D97706]" : "bg-[linear-gradient(90deg,#1F5EFF,#00B4D8_60%,#2BD47D)]"}`} style={{ width: `${Math.max(ratio, 1)}%` }} />
          </div>
          <p className="mt-2 text-sm text-[#4A6178]">
            {ratio} % du plafond de {fmtEuros(plafond, true)}
          </p>
        </Carte>
        <Carte>
          <p className="text-sm text-[#4A6178]">Cotisations calculées</p>
          <p className="mt-1 text-2xl font-semibold">{fmtEuros(totaux.total, true)}</p>
          <p className="mt-2 text-sm text-[#4A6178]">Déjà payé : {fmtEuros(paye, true)}</p>
        </Carte>
        <Carte>
          <p className="text-sm text-[#4A6178]">Mois restant à déclarer</p>
          <p className="mt-1 text-2xl font-semibold">{aDeclarer.length}</p>
          <p className="mt-2 text-sm text-[#4A6178]">
            {aDeclarer.length ? aDeclarer.map((m) => MOIS[Number(m.mois.slice(5, 7)) - 1]).join(", ") : "Tout est à jour."}
          </p>
        </Carte>
      </div>

      <Carte>
        {/* Téléphone : un mois par ligne, l'essentiel seulement */}
        <ul className="-mx-2 flex flex-col divide-y divide-[#EEF2F7] md:hidden">
          {mois.map((m) => {
            const d = declarations.get(m.mois);
            const enCours = m.mois === moisCourant;
            const futur = m.mois > moisCourant;
            if (futur) return null;
            return (
              <li key={m.mois}>
                <Link
                  href={`/admin/urssaf?annee=${annee}&mois=${m.mois}#saisie`}
                  className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 rounded-xl px-2 py-3 ${selection.mois === m.mois ? "bg-ciel" : ""}`}
                >
                  <span className="min-w-0">
                    <span className="block font-medium capitalize text-nuit">{libelleMois(m.mois)}</span>
                    <span className="block text-sm text-[#4A6178] tabular-nums">CA {fmtEuros(m.ca, true)}, à payer {fmtEuros(m.total, true)}</span>
                  </span>
                  <span className="text-right text-sm">
                    {d ? (
                      <span className="inline-flex items-center gap-1 text-[#0E7A45]">
                        <Icone nom="coche" className="h-4 w-4" />
                        Déclaré
                      </span>
                    ) : enCours ? (
                      <span className="text-[#4A6178]">En cours</span>
                    ) : (
                      <span className="font-medium text-bleu">À déclarer</span>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[860px] text-left text-[15px]">
            <thead className="text-sm text-[#4A6178]">
              <tr>
                <th className="py-2 align-bottom font-medium">Mois</th>
                <th className="py-2 pl-4 text-right align-bottom font-medium">CA encaissé</th>
                <th className="py-2 pl-4 text-right align-bottom font-medium">
                  Cotisations{tauxActuel && <span className="block text-xs font-normal">{pct(tauxActuel.cotisations)}</span>}
                </th>
                <th className="py-2 pl-4 text-right align-bottom font-medium">
                  Impôt{tauxActuel && <span className="block text-xs font-normal">{pct(tauxActuel.versement_liberatoire)}</span>}
                </th>
                <th className="py-2 pl-4 text-right align-bottom font-medium">
                  Formation{tauxActuel && <span className="block text-xs font-normal">{pct(tauxActuel.formation)}</span>}
                </th>
                <th className="py-2 pl-4 text-right align-bottom font-medium">À payer</th>
                <th className="py-2 pl-6 align-bottom font-medium">Déclaration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF2F7]">
              {mois.map((m) => {
                const d = declarations.get(m.mois);
                const enCours = m.mois === moisCourant;
                const futur = m.mois > moisCourant;
                const ecart = d && (Math.round(d.ca_declare) !== m.caDeclarable || (d.montant_paye !== null && Math.round(d.montant_paye) !== m.total));
                return (
                  <tr key={m.mois} className={selection.mois === m.mois ? "bg-ciel/70" : undefined}>
                    <td className="py-3">
                      <Link href={`/admin/urssaf?annee=${annee}&mois=${m.mois}#saisie`} className="capitalize transition-colors hover:text-bleu">
                        {libelleMois(m.mois)}
                      </Link>
                      {m.caHorsOutil > 0 && (
                        <span className="block text-xs text-[#4A6178]">{m.caOutil > 0 ? `dont ${fmtEuros(m.caHorsOutil)} hors outil` : "saisi hors outil"}</span>
                      )}
                    </td>
                    <td className="py-3 pl-4 text-right">{futur ? "" : fmtEuros(m.ca)}</td>
                    <td className="py-3 pl-4 text-right">{futur ? "" : fmtEuros(m.cotisations, true)}</td>
                    <td className="py-3 pl-4 text-right">{futur ? "" : fmtEuros(m.versementLiberatoire, true)}</td>
                    <td className="py-3 pl-4 text-right">{futur ? "" : fmtEuros(m.formation, true)}</td>
                    <td className="py-3 pl-4 text-right font-semibold">{futur ? "" : fmtEuros(m.total, true)}</td>
                    <td className="py-3 pl-6 text-sm">
                      {d ? (
                        <>
                          <span className="text-[#0E7A45]">Déclaré le {fmtDate(d.declare_le)}</span>
                          {d.montant_paye !== null && <span className="text-[#4A6178]">, payé {fmtEuros(d.montant_paye, true)}</span>}
                          {ecart && <span className="block text-[#9A5B00]">Écart avec le calcul</span>}
                          {d.note && <span className="block text-[#4A6178]">{d.note}</span>}
                          <Link href={`/admin/urssaf?annee=${annee}&mois=${m.mois}#saisie`} className="block text-bleu transition-colors hover:text-[#1638A8]">
                            Modifier
                          </Link>
                        </>
                      ) : enCours ? (
                        <span className="text-[#4A6178]">En cours, à déclarer avant le {fmtDate(m.echeance)}</span>
                      ) : futur ? (
                        ""
                      ) : (
                        <Link href={`/admin/urssaf?annee=${annee}&mois=${m.mois}#saisie`} className="font-medium text-bleu transition-colors hover:text-[#1638A8]">
                          À déclarer avant le {fmtDate(m.echeance)}
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="border-t-2 border-[#DCE3EC] font-semibold">
              <tr>
                <td className="py-3">Total</td>
                <td className="py-3 pl-4 text-right">{fmtEuros(totaux.ca)}</td>
                <td className="py-3 pl-4 text-right">{fmtEuros(totaux.cot, true)}</td>
                <td className="py-3 pl-4 text-right">{fmtEuros(totaux.vl, true)}</td>
                <td className="py-3 pl-4 text-right">{fmtEuros(totaux.cfp, true)}</td>
                <td className="py-3 pl-4 text-right">{fmtEuros(totaux.total, true)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-[#4A6178]">
          Calcul sur le chiffre d&apos;affaires réellement encaissé dans le mois, arrondi à l&apos;euro comme sur le site de l&apos;URSSAF. Chaque part est arrondie à
          l&apos;euro. {tauxActuel && <>Catégorie : {tauxActuel.libelle_categorie}.</>} Les taux se modifient dans{" "}
          <Link href="/admin/parametres" className="text-bleu transition-colors hover:text-[#1638A8]">
            Paramètres
          </Link>
          .
        </p>
      </Carte>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Carte>
          <h2 id="saisie" className="scroll-mt-6 text-lg font-semibold">
            Déclaration {deMois(selection.mois)}
          </h2>
          <p className="mt-1 text-sm text-[#4A6178]">
            À reporter sur{" "}
            <a href="https://www.autoentrepreneur.urssaf.fr/" target="_blank" rel="noopener" className="text-bleu transition-colors hover:text-[#1638A8]">
              autoentrepreneur.urssaf.fr
            </a>{" "}
            : chiffre d&apos;affaires de {fmtEuros(selection.caDeclarable, true)}, montant calculé {fmtEuros(selection.total, true)}.
          </p>
          <form action={enregistrerDeclaration} className="mt-5 flex flex-col gap-4">
            <input type="hidden" name="mois" value={selection.mois} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Champ libelle="CA déclaré" htmlFor="ca_declare">
                <input
                  id="ca_declare"
                  name="ca_declare"
                  inputMode="decimal"
                  required
                  key={`ca-${selection.mois}`}
                  defaultValue={saisie(declSelection?.ca_declare ?? selection.caDeclarable)}
                  className={classeChamp}
                />
              </Champ>
              <Champ libelle="Montant payé" htmlFor="montant_paye">
                <input
                  id="montant_paye"
                  name="montant_paye"
                  inputMode="decimal"
                  key={`paye-${selection.mois}`}
                  defaultValue={saisie(declSelection?.montant_paye ?? selection.total)}
                  className={classeChamp}
                />
              </Champ>
            </div>
            <Champ libelle="Date de la déclaration" htmlFor="declare_le">
              <input
                id="declare_le"
                name="declare_le"
                type="date"
                key={`date-${selection.mois}`}
                defaultValue={declSelection?.declare_le?.slice(0, 10) ?? jour}
                className={classeChamp}
              />
            </Champ>
            <Champ libelle="Note (facultatif)" htmlFor="note">
              <input id="note" name="note" key={`note-${selection.mois}`} defaultValue={declSelection?.note ?? ""} className={classeChamp} />
            </Champ>
            <button type="submit" className={`${classeBouton} self-start`}>
              Enregistrer la déclaration
            </button>
          </form>
          {declSelection && (
            <form action={supprimerDeclaration} className="mt-3">
              <input type="hidden" name="mois" value={selection.mois} />
              <button type="submit" className="text-sm text-[#B42318] transition-colors hover:text-[#7A1A12]">
                Retirer cette déclaration
              </button>
            </form>
          )}
        </Carte>

        <Carte>
          <h2 className="text-lg font-semibold">CA hors outil {deMois(selection.mois)}</h2>
          <p className="mt-1 text-sm leading-relaxed text-[#4A6178]">
            Pour les recettes encaissées sans facture de cet outil (avant sa mise en service, par exemple). Elles s&apos;ajoutent au calcul du mois. Laissez
            vide ou 0 pour effacer. Choisissez le mois en cliquant sur son nom dans le tableau.
          </p>
          <form action={enregistrerHorsOutil} className="mt-5 flex flex-col gap-4">
            <input type="hidden" name="mois" value={selection.mois} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Champ libelle="Montant encaissé" htmlFor="montant_hors">
                <input
                  id="montant_hors"
                  name="montant"
                  inputMode="decimal"
                  key={`hm-${selection.mois}`}
                  defaultValue={selection.caHorsOutil ? saisie(selection.caHorsOutil) : ""}
                  className={classeChamp}
                />
              </Champ>
            </div>
            <Champ libelle="Note (facultatif)" htmlFor="note_hors">
              <input id="note_hors" name="note" className={classeChamp} />
            </Champ>
            <button type="submit" className={`${classeBoutonSecondaire} self-start`}>
              Enregistrer
            </button>
          </form>
        </Carte>
      </div>
    </>
  );
}

export default function Urssaf({ searchParams }: PageProps<"/admin/urssaf">) {
  return (
    <Suspense fallback={<Chargement />}>
      <Contenu searchParams={searchParams as Promise<Sp>} />
    </Suspense>
  );
}
