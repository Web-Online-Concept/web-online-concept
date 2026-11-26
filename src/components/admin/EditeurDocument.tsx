"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Champ, classeBouton, classeBoutonSecondaire, classeChamp } from "@/components/admin/ui";

export type LigneEdition = {
  designation: string;
  description: string;
  quantite: string;
  unite: string;
  prix_unitaire: string;
};

type ClientOption = { id: string; nom: string };

const nombre = (s: string) => {
  const n = Number(String(s).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};
const euros = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
const ligneVide = (): LigneEdition => ({ designation: "", description: "", quantite: "1", unite: "", prix_unitaire: "" });

export default function EditeurDocument({
  genre,
  action,
  id,
  clients,
  valeurs,
  lignesInitiales,
  cache,
  libelleEmettre,
  retourNouveauClient,
}: {
  genre: "facture" | "avoir" | "devis";
  action: (formData: FormData) => Promise<void>;
  id?: string;
  clients: ClientOption[];
  valeurs: { client_id: string; objet: string; date_emission: string; date_fin: string; notes: string };
  lignesInitiales: LigneEdition[];
  cache?: Record<string, string>;
  libelleEmettre: string;
  retourNouveauClient: string;
}) {
  const [lignes, setLignes] = useState<LigneEdition[]>(lignesInitiales.length ? lignesInitiales : [ligneVide()]);
  const total = useMemo(
    () => Math.round(lignes.reduce((s, l) => s + Math.round(nombre(l.quantite) * nombre(l.prix_unitaire) * 100) / 100, 0) * 100) / 100,
    [lignes],
  );

  const maj = (i: number, k: keyof LigneEdition, v: string) => setLignes((ls) => ls.map((l, j) => (j === i ? { ...l, [k]: v } : l)));
  const deplacer = (i: number, d: -1 | 1) =>
    setLignes((ls) => {
      const j = i + d;
      if (j < 0 || j >= ls.length) return ls;
      const copie = [...ls];
      [copie[i], copie[j]] = [copie[j], copie[i]];
      return copie;
    });

  const libFin = genre === "devis" ? "Valable jusqu'au" : "Date d'échéance";

  return (
    <form action={action} className="flex flex-col gap-6">
      {id && <input type="hidden" name="id" value={id} />}
      {cache && Object.entries(cache).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      <input type="hidden" name="lignes" value={JSON.stringify(lignes)} />

      <div className="grid gap-4 md:grid-cols-2">
        <Champ libelle="Client" htmlFor="client_id">
          <div className="flex gap-2">
            <select id="client_id" name="client_id" defaultValue={valeurs.client_id} required className={classeChamp}>
              <option value="">Choisir un client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nom}
                </option>
              ))}
            </select>
            <Link href={`/admin/clients/nouveau?retour=${encodeURIComponent(retourNouveauClient)}`} className="shrink-0 self-center text-sm font-medium text-bleu transition-colors hover:text-[#1638A8]">
              Nouveau
            </Link>
          </div>
        </Champ>
        <Champ libelle="Objet" htmlFor="objet">
          <input id="objet" name="objet" defaultValue={valeurs.objet} className={classeChamp} />
        </Champ>
        <Champ libelle="Date" htmlFor="date_emission" aide="Laisser vide : date du jour à l'émission.">
          <input id="date_emission" name="date_emission" type="date" defaultValue={valeurs.date_emission} className={classeChamp} />
        </Champ>
        <Champ libelle={libFin} htmlFor="date_fin" aide={genre === "devis" ? "Laisser vide : 30 jours après la date." : "Laisser vide : 30 jours après la date."}>
          <input id="date_fin" name={genre === "devis" ? "date_validite" : "date_echeance"} type="date" defaultValue={valeurs.date_fin} className={classeChamp} />
        </Champ>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Lignes</h2>
        {lignes.length > 0 && (
          <div aria-hidden="true" className="mb-1.5 hidden gap-3 px-[17px] text-xs font-medium text-[#4A6178] md:grid md:grid-cols-[1fr_90px_90px_130px]">
            <span>Désignation</span>
            <span>Quantité</span>
            <span>Unité</span>
            <span>Prix unitaire</span>
          </div>
        )}
        <div className="flex flex-col gap-3">
          {lignes.map((l, i) => {
            const tot = Math.round(nombre(l.quantite) * nombre(l.prix_unitaire) * 100) / 100;
            return (
              <fieldset key={i} className="rounded-xl border border-[#E1E7EF] p-4">
                <legend className="sr-only">Ligne {i + 1}</legend>
                <div className="grid gap-3 md:grid-cols-[1fr_90px_90px_130px]">
                  <input aria-label={`Désignation, ligne ${i + 1}`} placeholder="Désignation" value={l.designation} onChange={(e) => maj(i, "designation", e.target.value)} className={classeChamp} />
                  <input aria-label={`Quantité, ligne ${i + 1}`} inputMode="decimal" placeholder="Qté" value={l.quantite} onChange={(e) => maj(i, "quantite", e.target.value)} className={classeChamp} />
                  <input aria-label={`Unité, ligne ${i + 1}`} placeholder="Unité" value={l.unite} onChange={(e) => maj(i, "unite", e.target.value)} className={classeChamp} />
                  <input aria-label={`Prix unitaire HT, ligne ${i + 1}`} inputMode="decimal" placeholder="Prix unitaire" value={l.prix_unitaire} onChange={(e) => maj(i, "prix_unitaire", e.target.value)} className={classeChamp} />
                </div>
                <textarea aria-label={`Description, ligne ${i + 1}`} placeholder="Description (facultatif)" rows={2} value={l.description} onChange={(e) => maj(i, "description", e.target.value)} className={`${classeChamp} mt-3`} />
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex gap-1">
                    <button type="button" onClick={() => deplacer(i, -1)} className="rounded-lg px-2.5 py-1.5 text-sm text-[#4A6178] hover:bg-ciel" aria-label={`Monter la ligne ${i + 1}`}>
                      Monter
                    </button>
                    <button type="button" onClick={() => deplacer(i, 1)} className="rounded-lg px-2.5 py-1.5 text-sm text-[#4A6178] hover:bg-ciel" aria-label={`Descendre la ligne ${i + 1}`}>
                      Descendre
                    </button>
                    <button type="button" onClick={() => setLignes((ls) => (ls.length > 1 ? ls.filter((_, j) => j !== i) : [ligneVide()]))} className="rounded-lg px-2.5 py-1.5 text-sm text-[#B42318] hover:bg-[#FEF3F2]">
                      Supprimer
                    </button>
                  </div>
                  <span className="text-[15px] font-medium">{euros(tot)}</span>
                </div>
              </fieldset>
            );
          })}
        </div>
        <button type="button" onClick={() => setLignes((ls) => [...ls, ligneVide()])} className={`${classeBoutonSecondaire} mt-3`}>
          Ajouter une ligne
        </button>
      </div>

      <div className="flex items-center justify-end gap-4 rounded-xl bg-ciel px-5 py-4">
        <span className="text-[15px] text-[#4A6178]">Total (TVA non applicable)</span>
        <span className="text-2xl font-semibold">{euros(total)}</span>
      </div>

      <Champ libelle="Note sur le document" htmlFor="notes" aide="Apparaît en bas du PDF (facultatif).">
        <textarea id="notes" name="notes" rows={2} defaultValue={valeurs.notes} className={classeChamp} />
      </Champ>

      <div className="flex flex-wrap gap-3">
        <button type="submit" name="intention" value="enregistrer" className={classeBoutonSecondaire}>
          Enregistrer le brouillon
        </button>
        <button type="submit" name="intention" value="emettre" className={classeBouton}>
          {libelleEmettre}
        </button>
      </div>
    </form>
  );
}
