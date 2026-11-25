import { Suspense } from "react";
import { Alerte, Carte, Chargement, Champ, classeBouton, classeBoutonSecondaire, classeChamp, TitrePage } from "@/components/admin/ui";
import { exigerAdmin } from "@/lib/admin/acces";
import { fmtDate, fmtEuros } from "@/lib/admin/format";
import { ajouterTaux, enregistrerParametres, supprimerTaux } from "./actions";

export const metadata = { title: "Paramètres" };

type Sp = { ok?: string; erreur?: string };

const CHAMPS: { cle: string; libelle: string; large?: boolean }[] = [
  { cle: "nom_commercial", libelle: "Nom commercial" },
  { cle: "raison_sociale", libelle: "Dénomination (entrepreneur individuel)" },
  { cle: "siren", libelle: "SIREN" },
  { cle: "siret", libelle: "SIRET" },
  { cle: "code_ape", libelle: "Code APE" },
  { cle: "adresse", libelle: "Adresse", large: true },
  { cle: "code_postal", libelle: "Code postal" },
  { cle: "ville", libelle: "Ville" },
  { cle: "pays", libelle: "Pays" },
  { cle: "email", libelle: "E-mail sur les documents" },
  { cle: "telephone", libelle: "Téléphone sur les documents" },
  { cle: "site_web", libelle: "Site internet" },
];

const virgule = (n: number | string) => String(n).replace(".", ",");

async function Contenu({ searchParams }: { searchParams: Promise<Sp> }) {
  const sb = await exigerAdmin();
  const sp = await searchParams;
  const [{ data: p }, { data: taux }] = await Promise.all([
    sb.from("parametres").select("*").eq("id", 1).maybeSingle(),
    sb.from("taux_urssaf").select("*").order("date_effet", { ascending: false }),
  ]);
  const dernier = taux?.[0];
  const v = (cle: string) => (p ? String((p as Record<string, unknown>)[cle] ?? "") : "");

  return (
    <>
      <TitrePage titre="Paramètres" />
      {sp.erreur && (
        <div className="mb-5">
          <Alerte ton="erreur">{sp.erreur}</Alerte>
        </div>
      )}
      {sp.ok && (
        <div className="mb-5">
          <Alerte ton="succes">{sp.ok === "taux" ? "Taux URSSAF mis à jour." : "Informations enregistrées. Elles s'appliquent aux prochains documents émis."}</Alerte>
        </div>
      )}

      <Carte>
        <h2 className="text-lg font-semibold">Entreprise et mentions des documents</h2>
        <p className="mt-1 text-sm text-[#4A6178]">
          Ces informations sont recopiées dans chaque facture et devis au moment de l&apos;émission : un document déjà émis ne change jamais.
        </p>
        <form action={enregistrerParametres} className="mt-6 flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CHAMPS.map((c) => (
              <Champ key={c.cle} libelle={c.libelle} htmlFor={c.cle} className={c.large ? "sm:col-span-2 lg:col-span-3" : ""}>
                <input id={c.cle} name={c.cle} required defaultValue={v(c.cle)} className={classeChamp} />
              </Champ>
            ))}
          </div>
          <div className="grid gap-5 sm:grid-cols-[2fr_1fr]">
            <Champ libelle="IBAN" htmlFor="iban" aide="Affiché sur les factures pour le règlement par virement.">
              <input id="iban" name="iban" defaultValue={v("iban")} autoComplete="off" className={classeChamp} />
            </Champ>
            <Champ libelle="BIC" htmlFor="bic">
              <input id="bic" name="bic" defaultValue={v("bic")} autoComplete="off" className={classeChamp} />
            </Champ>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Champ libelle="Délai de paiement (jours)" htmlFor="delai_paiement_jours" aide="Fixe l'échéance des factures. 60 jours au maximum.">
              <input id="delai_paiement_jours" name="delai_paiement_jours" type="number" min={0} max={60} defaultValue={v("delai_paiement_jours") || "30"} className={classeChamp} />
            </Champ>
            <Champ libelle="Validité des devis (jours)" htmlFor="validite_devis_jours">
              <input id="validite_devis_jours" name="validite_devis_jours" type="number" min={1} max={365} defaultValue={v("validite_devis_jours") || "30"} className={classeChamp} />
            </Champ>
          </div>
          <Champ libelle="Mention TVA" htmlFor="mention_tva">
            <input id="mention_tva" name="mention_tva" required defaultValue={v("mention_tva")} className={classeChamp} />
          </Champ>
          <Champ libelle="Conditions de paiement" htmlFor="conditions_paiement">
            <textarea id="conditions_paiement" name="conditions_paiement" required rows={2} defaultValue={v("conditions_paiement")} className={classeChamp} />
          </Champ>
          <Champ libelle="Pénalités de retard" htmlFor="penalites_retard" aide="Mention obligatoire sur les factures entre professionnels.">
            <textarea id="penalites_retard" name="penalites_retard" required rows={3} defaultValue={v("penalites_retard")} className={classeChamp} />
          </Champ>
          <button type="submit" className={`${classeBouton} self-start`}>
            Enregistrer
          </button>
        </form>
      </Carte>

      <Carte className="mt-5">
        <h2 className="text-lg font-semibold">Taux URSSAF</h2>
        <p className="mt-1 text-sm text-[#4A6178]">
          Quand l&apos;URSSAF change ses taux, ajoutez une ligne avec la date d&apos;effet : les mois précédents gardent leurs anciens taux.
        </p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[15px]">
            <thead className="text-sm text-[#4A6178]">
              <tr>
                <th className="py-2 font-medium">Depuis le</th>
                <th className="py-2 font-medium">Catégorie</th>
                <th className="py-2 text-right font-medium">Cotisations</th>
                <th className="py-2 text-right font-medium">Impôt</th>
                <th className="py-2 text-right font-medium">Formation</th>
                <th className="py-2 text-right font-medium">Plafond</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF2F7]">
              {(taux ?? []).map((t) => (
                <tr key={t.id}>
                  <td className="py-3">{fmtDate(t.date_effet)}</td>
                  <td className="py-3 text-sm">{t.libelle_categorie}</td>
                  <td className="py-3 text-right">{virgule(t.cotisations)} %</td>
                  <td className="py-3 text-right">{virgule(t.versement_liberatoire)} %</td>
                  <td className="py-3 text-right">{virgule(t.formation)} %</td>
                  <td className="py-3 text-right">{fmtEuros(t.plafond_ca, true)}</td>
                  <td className="py-3 text-right">
                    {(taux?.length ?? 0) > 1 && (
                      <form action={supprimerTaux}>
                        <input type="hidden" name="id" value={t.id} />
                        <button type="submit" className="text-sm text-[#B42318] hover:underline">
                          Retirer
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <form action={ajouterTaux} className="mt-6 grid gap-4 border-t border-[#EEF2F7] pt-6 sm:grid-cols-2 lg:grid-cols-3">
          <Champ libelle="Date d'effet (1er du mois)" htmlFor="date_effet">
            <input id="date_effet" name="date_effet" type="date" required className={classeChamp} />
          </Champ>
          <Champ libelle="Catégorie" htmlFor="libelle_categorie" className="lg:col-span-2">
            <input id="libelle_categorie" name="libelle_categorie" defaultValue={dernier?.libelle_categorie ?? ""} className={classeChamp} />
          </Champ>
          <Champ libelle="Cotisations (%)" htmlFor="cotisations">
            <input id="cotisations" name="cotisations" inputMode="decimal" required defaultValue={dernier ? virgule(dernier.cotisations) : ""} className={classeChamp} />
          </Champ>
          <Champ libelle="Versement libératoire (%)" htmlFor="versement_liberatoire">
            <input id="versement_liberatoire" name="versement_liberatoire" inputMode="decimal" required defaultValue={dernier ? virgule(dernier.versement_liberatoire) : ""} className={classeChamp} />
          </Champ>
          <Champ libelle="Formation professionnelle (%)" htmlFor="formation">
            <input id="formation" name="formation" inputMode="decimal" required defaultValue={dernier ? virgule(dernier.formation) : ""} className={classeChamp} />
          </Champ>
          <Champ libelle="Plafond annuel de CA (€)" htmlFor="plafond_ca">
            <input id="plafond_ca" name="plafond_ca" inputMode="decimal" required defaultValue={dernier ? virgule(dernier.plafond_ca) : ""} className={classeChamp} />
          </Champ>
          <div className="flex items-end">
            <button type="submit" className={classeBoutonSecondaire}>
              Ajouter ces taux
            </button>
          </div>
        </form>
      </Carte>
    </>
  );
}

export default function Parametres({ searchParams }: PageProps<"/admin/parametres">) {
  return (
    <Suspense fallback={<Chargement />}>
      <Contenu searchParams={searchParams as Promise<Sp>} />
    </Suspense>
  );
}
