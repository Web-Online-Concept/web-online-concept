"use client";

import { useState, useTransition } from "react";
import { enregistrerClient, rechercherEntreprise } from "@/app/(interne)/admin/(espace)/clients/actions";
import { Icone } from "@/components/admin/Icones";
import { Champ, classeBouton, classeBoutonSecondaire, classeChamp } from "@/components/admin/ui";

export type ClientEdition = {
  id?: string;
  type: string;
  nom: string;
  siren: string | null;
  siret: string | null;
  tva_intra: string | null;
  adresse: string | null;
  code_postal: string | null;
  ville: string | null;
  pays: string | null;
  contact_nom: string | null;
  email: string | null;
  telephone: string | null;
  notes: string | null;
};

const vide: ClientEdition = {
  type: "entreprise",
  nom: "",
  siren: "",
  siret: "",
  tva_intra: "",
  adresse: "",
  code_postal: "",
  ville: "",
  pays: "France",
  contact_nom: "",
  email: "",
  telephone: "",
  notes: "",
};

export default function FormulaireClient({ client, retour }: { client?: ClientEdition; retour?: string }) {
  const [c, setC] = useState<ClientEdition>(client ?? vide);
  const [message, setMessage] = useState<string | null>(null);
  const [recherche, lancer] = useTransition();
  const maj = (k: keyof ClientEdition) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setC((x) => ({ ...x, [k]: e.target.value }));

  function remplir() {
    setMessage(null);
    lancer(async () => {
      const r = await rechercherEntreprise(c.siren ?? "");
      if (!r.ok) {
        setMessage(r.message);
        return;
      }
      setC((x) => ({ ...x, ...r.e }));
      setMessage("Informations récupérées depuis l'annuaire des entreprises.");
    });
  }

  return (
    <form action={enregistrerClient} className="flex flex-col gap-6">
      {c.id && <input type="hidden" name="id" value={c.id} />}
      {retour && <input type="hidden" name="retour" value={retour} />}

      <fieldset>
        <legend className="sr-only">Type de client</legend>
        <div className="inline-flex rounded-full bg-ciel p-1">
          {[
            ["entreprise", "Professionnel"],
            ["particulier", "Particulier"],
          ].map(([v, l]) => (
            <label
              key={v}
              className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-cyan ${
                c.type === v ? "bg-white text-nuit shadow-[0_1px_3px_rgba(10,26,47,0.15)]" : "text-[#4A6178] hover:text-nuit"
              }`}
            >
              <input type="radio" name="type" value={v} checked={c.type === v} onChange={maj("type")} className="sr-only" />
              {l}
            </label>
          ))}
        </div>
      </fieldset>

      {c.type === "entreprise" && (
        <div className="flex flex-wrap items-end gap-3 rounded-xl bg-ciel p-4">
          <Champ libelle="SIREN" htmlFor="siren" className="w-full sm:w-48">
            <input id="siren" name="siren" inputMode="numeric" value={c.siren ?? ""} onChange={maj("siren")} className={classeChamp} />
          </Champ>
          <button type="button" onClick={remplir} disabled={recherche} className={classeBoutonSecondaire}>
            <Icone nom="recherche" className="h-[18px] w-[18px]" />
            {recherche ? "Recherche…" : "Remplir avec le SIREN"}
          </button>
          {message && (
            <p role="status" className="w-full text-sm text-[#2C4558]">
              {message}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Champ libelle={c.type === "entreprise" ? "Raison sociale" : "Nom et prénom"} htmlFor="nom" className="sm:col-span-2">
          <input id="nom" name="nom" required value={c.nom} onChange={maj("nom")} className={classeChamp} />
        </Champ>
        {c.type === "entreprise" && (
          <>
            <Champ libelle="SIRET" htmlFor="siret">
              <input id="siret" name="siret" value={c.siret ?? ""} onChange={maj("siret")} className={classeChamp} />
            </Champ>
            <Champ libelle="N° de TVA intracommunautaire" htmlFor="tva_intra">
              <input id="tva_intra" name="tva_intra" value={c.tva_intra ?? ""} onChange={maj("tva_intra")} className={classeChamp} />
            </Champ>
          </>
        )}
        {c.type === "particulier" && <input type="hidden" name="siren" value="" />}
        <Champ libelle="Adresse" htmlFor="adresse" className="sm:col-span-2">
          <input id="adresse" name="adresse" value={c.adresse ?? ""} onChange={maj("adresse")} className={classeChamp} />
        </Champ>
        <Champ libelle="Code postal" htmlFor="code_postal">
          <input id="code_postal" name="code_postal" value={c.code_postal ?? ""} onChange={maj("code_postal")} className={classeChamp} />
        </Champ>
        <Champ libelle="Ville" htmlFor="ville">
          <input id="ville" name="ville" value={c.ville ?? ""} onChange={maj("ville")} className={classeChamp} />
        </Champ>
        <Champ libelle="Pays" htmlFor="pays">
          <input id="pays" name="pays" value={c.pays ?? ""} onChange={maj("pays")} className={classeChamp} />
        </Champ>
        <Champ libelle="Contact" htmlFor="contact_nom">
          <input id="contact_nom" name="contact_nom" value={c.contact_nom ?? ""} onChange={maj("contact_nom")} className={classeChamp} />
        </Champ>
        <Champ libelle="E-mail" htmlFor="email">
          <input id="email" name="email" type="email" value={c.email ?? ""} onChange={maj("email")} className={classeChamp} />
        </Champ>
        <Champ libelle="Téléphone" htmlFor="telephone">
          <input id="telephone" name="telephone" value={c.telephone ?? ""} onChange={maj("telephone")} className={classeChamp} />
        </Champ>
        <Champ libelle="Notes internes" htmlFor="notes" className="sm:col-span-2">
          <textarea id="notes" name="notes" rows={3} value={c.notes ?? ""} onChange={maj("notes")} className={classeChamp} />
        </Champ>
      </div>

      <div>
        <button type="submit" className={classeBouton}>
          <Icone nom="coche" className="h-[18px] w-[18px]" />
          Enregistrer le client
        </button>
      </div>
    </form>
  );
}
