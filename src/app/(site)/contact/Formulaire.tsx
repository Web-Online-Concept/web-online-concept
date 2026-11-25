"use client";

import { useActionState, useEffect, useRef } from "react";
import { envoyerMessage, type EtatContact } from "./actions";

const initial: EtatContact = { statut: "initial" };

function Champ({
  id,
  libelle,
  erreur,
  children,
}: {
  id: string;
  libelle: string;
  erreur?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[15px] font-medium text-nuit">
        {libelle}
      </label>
      {children}
      {erreur && (
        <p id={`${id}-erreur`} className="text-sm text-[#B42318]">
          {erreur}
        </p>
      )}
    </div>
  );
}

const styleChamp =
  "w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-base text-nuit outline-none transition-colors focus:border-bleu focus:ring-2 focus:ring-bleu/20";

export default function Formulaire() {
  const [etat, action, enCours] = useActionState(envoyerMessage, initial);
  // Heure d'affichage du formulaire (anti-robots), posée côté navigateur
  // (recopiée à chaque envoi : React remet le formulaire à zéro après une action)
  const afficheLe = useRef(0);
  useEffect(() => {
    afficheLe.current = Date.now();
  }, []);

  if (etat.statut === "envoye") {
    return (
      <div role="status" className="rounded-2xl bg-ciel p-8">
        <p className="text-xl font-semibold text-nuit">Message envoyé.</p>
        <p className="mt-2 text-[#2C4558]">Merci. Votre projet sera étudié avec attention, et vous recevrez une réponse rapidement.</p>
      </div>
    );
  }

  const e = etat.erreurs ?? {};
  return (
    <form
      action={action}
      onSubmit={(e) => {
        const champ = e.currentTarget.elements.namedItem("affiche_le");
        if (champ instanceof HTMLInputElement) champ.value = String(afficheLe.current);
      }}
      className="flex flex-col gap-5"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Champ id="nom" libelle="Nom" erreur={e.nom}>
          <input id="nom" name="nom" defaultValue={etat.valeurs?.nom} autoComplete="name" required className={styleChamp} aria-invalid={!!e.nom} aria-describedby={e.nom ? "nom-erreur" : undefined} />
        </Champ>
        <Champ id="email" libelle="E-mail" erreur={e.email}>
          <input id="email" name="email" defaultValue={etat.valeurs?.email} type="email" autoComplete="email" required className={styleChamp} aria-invalid={!!e.email} aria-describedby={e.email ? "email-erreur" : undefined} />
        </Champ>
      </div>
      <Champ id="objet" libelle="Objet" erreur={e.objet}>
        <input id="objet" name="objet" defaultValue={etat.valeurs?.objet} className={styleChamp} aria-invalid={!!e.objet} aria-describedby={e.objet ? "objet-erreur" : undefined} />
      </Champ>
      <Champ id="message" libelle="Votre projet et vos objectifs" erreur={e.message}>
        <textarea id="message" name="message" defaultValue={etat.valeurs?.message} rows={7} required className={styleChamp} aria-invalid={!!e.message} aria-describedby={e.message ? "message-erreur" : undefined} />
      </Champ>

      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="site_web">Ne pas remplir</label>
        <input id="site_web" name="site_web" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="affiche_le" defaultValue="0" />

      {etat.message && (
        <p role="alert" className="rounded-xl bg-[#FEF3F2] px-4 py-3 text-[15px] text-[#B42318]">
          {etat.message}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={enCours}
          className="rounded-full bg-bleu px-7 py-3.5 font-medium text-white transition-colors hover:bg-[#3A72FF] disabled:opacity-60"
        >
          {enCours ? "Envoi en cours…" : "Envoyer le message"}
        </button>
        <p className="text-sm text-[#4A6178]">
          Vos données servent uniquement à vous répondre.{" "}
          <a href="/confidentialite" className="underline underline-offset-2">
            En savoir plus
          </a>
        </p>
      </div>
    </form>
  );
}
