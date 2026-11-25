"use client";

import { useActionState } from "react";
import { accepterDevis, type EtatAcceptation } from "./actions";

export default function FormulaireAcceptation({ jeton, total }: { jeton: string; total: string }) {
  const [etat, action, enCours] = useActionState(accepterDevis, { statut: "initial" } as EtatAcceptation);

  if (etat.statut === "accepte") {
    return (
      <div role="status" className="rounded-2xl bg-[#E3F8EC] p-6 text-[#0E5A35]">
        <p className="text-lg font-semibold">Merci, votre accord est enregistré.</p>
        <p className="mt-1">Web Online Concept revient vers vous très vite pour lancer le projet.</p>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4 rounded-2xl border border-[#DCE3EC] p-6">
      <input type="hidden" name="jeton" value={jeton} />
      <h2 className="text-lg font-semibold">Accepter ce devis</h2>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="nom" className="text-sm font-medium">
          Vos nom et prénom
        </label>
        <input id="nom" name="nom" required autoComplete="name" className="rounded-xl border border-[#CBD5E1] px-4 py-3 outline-none focus:border-bleu focus:ring-2 focus:ring-bleu/20" />
      </div>
      <label className="flex cursor-pointer items-start gap-3 text-[15px] leading-relaxed">
        <input type="checkbox" name="accord" value="oui" required className="mt-1 h-4 w-4 accent-bleu" />
        <span>J&apos;accepte ce devis d&apos;un montant de {total}. Ce bon pour accord vaut commande.</span>
      </label>
      {etat.message && (
        <p role="alert" className="text-[15px] text-[#B42318]">
          {etat.message}
        </p>
      )}
      <button type="submit" disabled={enCours} className="self-start rounded-full bg-bleu px-6 py-3 font-medium text-white hover:bg-[#3A72FF] disabled:opacity-60">
        {enCours ? "Enregistrement…" : "J'accepte le devis"}
      </button>
    </form>
  );
}
