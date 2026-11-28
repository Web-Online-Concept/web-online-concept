"use client";

import { useActionState } from "react";
import { demanderLien, type EtatConnexion } from "./actions";

const initial: EtatConnexion = { statut: "initial" };

export default function FormulaireConnexion({ erreurLien }: { erreurLien?: boolean }) {
  const [etat, action, enCours] = useActionState(demanderLien, initial);

  if (etat.statut === "envoye") {
    return (
      <div role="status" className="rounded-xl bg-ciel p-5 text-[15px] leading-relaxed">
        Si cette adresse est autorisée, un lien de connexion vient d&apos;être envoyé. Ouvrez-le <strong>dans ce même
        navigateur</strong>.
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      {erreurLien && (
        <p role="alert" className="rounded-xl bg-[#FEF3F2] px-4 py-3 text-[15px] text-[#B42318]">
          Ce lien de connexion n&apos;est plus valable. Demandez-en un nouveau.
        </p>
      )}
      <label htmlFor="email" className="text-[15px] font-medium">
        Adresse e-mail
      </label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        className="rounded-xl border border-[#D5DEE8] px-4 py-3 text-base outline-none transition-[border-color,box-shadow] focus:border-bleu focus:ring-4 focus:ring-bleu/12"
      />
      {etat.message && (
        <p role="alert" className="text-sm text-[#B42318]">
          {etat.message}
        </p>
      )}
      <button
        type="submit"
        disabled={enCours}
        className="rounded-full bg-bleu px-6 py-3 font-medium text-white shadow-[0_10px_24px_-14px_rgba(31,94,255,0.9)] transition-colors hover:bg-[#3A72FF] disabled:opacity-60"
      >
        {enCours ? "Envoi…" : "Recevoir le lien de connexion"}
      </button>
    </form>
  );
}
