"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { BESOINS, SITE } from "@/lib/contenu";
import { envoyerMessage, type EtatContact } from "./actions";

const initial: EtatContact = { statut: "initial" };

// Pictogrammes au trait des types de projet (24 × 24, même dessin que ceux de la FAQ)
const PICTOS: Record<string, React.ReactNode> = {
  "Création de site": (
    <>
      <rect x="2.75" y="4" width="18.5" height="16" rx="2.5" />
      <path d="M2.75 8.75h18.5M6.5 12.5h6M6.5 15.5h4" />
    </>
  ),
  "Application web ou mobile": (
    <>
      <rect x="6.75" y="2.75" width="10.5" height="18.5" rx="2.5" />
      <path d="M10.5 18h3" />
    </>
  ),
  "Plateforme ou abonnement": <path d="M12 3.25 3.25 7.75 12 12.25l8.75-4.5L12 3.25zM3.25 12 12 16.5l8.75-4.5M3.25 16.25 12 20.75l8.75-4.5" />,
  "Refonte ou migration": <path d="M19.75 12a7.75 7.75 0 0 1-13.4 5.3M4.25 12a7.75 7.75 0 0 1 13.4-5.3M17.9 3.2v3.6h-3.6M6.1 20.8v-3.6h3.6" />,
  "Référencement et visibilité IA": <path d="M17.25 10.5a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0zM15.4 15.4l5.1 5.1M8 13v-1.5M10.5 13V9.5M13 13V8" />,
  "Maintenance et suivi": <path d="M12 2.75 4.25 5.5v6c0 4.6 3.3 8.3 7.75 9.75 4.45-1.45 7.75-5.15 7.75-9.75v-6L12 2.75zM8.75 12l2.25 2.25 4.25-4.5" />,
  Autre: (
    <>
      <path d="M4.25 5.25h15.5v10.5H9.5l-5.25 4V5.25z" />
      <path d="M8.5 10.5h.01M12 10.5h.01M15.5 10.5h.01" />
    </>
  ),
};

function Picto({ besoin, className = "h-5 w-5" }: { besoin: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PICTOS[besoin] ?? PICTOS.Autre}
    </svg>
  );
}

// Avatar du studio : la petite planète en orbite, comme dans la FAQ et les e-mails
function Avatar({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`inline-flex shrink-0 items-center justify-center rounded-full bg-[#13294A] ring-1 ring-white/10 ${className}`}>
      <svg viewBox="0 0 24 24" className="h-[58%] w-[58%]" fill="none">
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-18 12 12)" stroke="#00B4D8" strokeWidth="1.4" />
        <circle cx="12" cy="12" r="4.2" fill="#1F5EFF" />
        <circle cx="20.2" cy="9" r="1.6" fill="#2BD47D" />
      </svg>
    </span>
  );
}

function Points({ className = "" }: { className?: string }) {
  return (
    <span className={`ct-points flex gap-1.5 ${className}`}>
      <span className="h-2 w-2 rounded-full bg-current" />
      <span className="h-2 w-2 rounded-full bg-current" />
      <span className="h-2 w-2 rounded-full bg-current" />
    </span>
  );
}

function Etape({ numero, titre, children }: { numero: number; titre: string; children: React.ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend className="flex items-center gap-3 text-lg font-semibold text-nuit">
        <span
          aria-hidden="true"
          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1F5EFF,#1638A8)] text-[13px] font-semibold text-white"
        >
          {numero}
        </span>
        {titre}
      </legend>
      <div className="mt-5 flex flex-col gap-5">{children}</div>
    </fieldset>
  );
}

function Champ({ id, libelle, aide, erreur, children }: { id: string; libelle: string; aide?: React.ReactNode; erreur?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[14px] font-medium text-nuit">
        {libelle}
      </label>
      {children}
      {aide}
      {erreur && (
        <p id={`${id}-erreur`} className="text-sm text-[#B42318]">
          {erreur}
        </p>
      )}
    </div>
  );
}

const styleChamp =
  "w-full rounded-2xl border border-[#DCE3EC] bg-[#F8FAFD] px-4 py-3.5 text-base text-nuit outline-none transition-[border-color,background-color,box-shadow] placeholder:text-[#93A4B8] hover:border-[#C3CFDD] focus:border-bleu focus:bg-white focus:ring-4 focus:ring-bleu/10 aria-[invalid=true]:border-[#F04438]";

type Apercu = { besoin: string; objet: string; message: string };

// Conversation en miroir du formulaire : la demande s'y écrit au fil de la saisie, puis le studio répond.
// Purement visuelle (aria-hidden) : elle reprend ce que le formulaire dit déjà.
function Conversation({ apercu, enSaisie, etat }: { apercu: Apercu; enSaisie: boolean; etat: EtatContact }) {
  const envoye = etat.statut === "envoye";
  const rempli = Boolean(apercu.besoin || apercu.objet.trim() || apercu.message.trim());
  return (
    <div aria-hidden="true" className="overflow-hidden rounded-[28px] bg-nuit text-white shadow-[0_30px_60px_-30px_rgba(10,26,47,0.55)]">
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-4">
        <Avatar className="h-10 w-10" />
        <div className="min-w-0">
          <p className="text-[15px] font-semibold leading-tight">Web Online Concept</p>
          <p className="mt-0.5 text-[13px] text-[#8FA3BA]">Réponse personnelle, par e-mail</p>
        </div>
      </div>
      <div className="h-1 bg-[linear-gradient(90deg,#1F5EFF,#00B4D8_55%,#2BD47D)] opacity-80" />

      <div className="flex min-h-[460px] flex-col gap-3 px-6 py-6">
        <div className="flex items-end gap-2.5">
          <Avatar className="h-7 w-7" />
          <div className="flex max-w-[85%] flex-col gap-2">
            <p className="rounded-[20px] rounded-bl-md bg-white/[0.07] px-4 py-3 text-[15px] leading-relaxed text-[#DCE6F2]">
              Bonjour&nbsp;! Racontez-nous votre projet&nbsp;: ce que vous voulez accomplir, et pour qui.
            </p>
            <p className="rounded-[20px] rounded-bl-md bg-white/[0.07] px-4 py-3 text-[15px] leading-relaxed text-[#DCE6F2]">
              Vos objectifs, vos échéances si vous en avez&nbsp;: tout ce qui nous aide à préparer l&apos;échange.
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-col items-end gap-1.5">
          {rempli ? (
            <div className="ct-bulle max-w-[88%] rounded-[20px] rounded-br-md bg-[linear-gradient(135deg,#1F5EFF,#1638A8)] px-4 py-3.5 text-[15px] leading-relaxed text-white">
              {apercu.besoin && (
                <p className="mb-1.5 flex items-center gap-1.5 text-[12px] text-[#C9D8FF]">
                  <Picto besoin={apercu.besoin} className="h-3.5 w-3.5" />
                  {apercu.besoin}
                </p>
              )}
              {apercu.objet.trim() && <p className="font-semibold">{apercu.objet}</p>}
              {apercu.message.trim() && <p className="line-clamp-[9] whitespace-pre-line text-white/90">{apercu.message}</p>}
            </div>
          ) : enSaisie ? (
            <div className="rounded-[20px] rounded-br-md bg-[linear-gradient(135deg,#1F5EFF,#1638A8)] px-4 py-3.5 text-white/80">
              <Points />
            </div>
          ) : (
            <p className="max-w-[80%] rounded-[20px] rounded-br-md border border-dashed border-white/20 px-4 py-3 text-[14px] leading-relaxed text-[#8FA3BA]">
              Votre message s&apos;écrit ici, au fil de la saisie.
            </p>
          )}
          {envoye ? (
            <p className="ct-envoye text-[12px] text-[#8FA3BA]">
              Envoyé <span className="font-semibold text-vert">✓✓</span>
            </p>
          ) : (
            <p className="text-[12px] text-[#8FA3BA]">Vous</p>
          )}
        </div>

        {envoye && (
          <div className="mt-2 flex items-end gap-2.5">
            <Avatar className="h-7 w-7" />
            <div className="relative">
              <span className="ct-ecrit absolute bottom-0 left-0 rounded-[20px] rounded-bl-md bg-white/[0.07] px-4 py-3.5 text-[#8FA3BA]">
                <Points />
              </span>
              <p className="ct-reponse max-w-[85%] rounded-[20px] rounded-bl-md bg-white px-4 py-3 text-[15px] leading-relaxed text-nuit">
                Merci{etat.prenom ? ` ${etat.prenom}` : ""}&nbsp;! Nous revenons vers vous personnellement, par e-mail, pour en parler.
              </p>
            </div>
          </div>
        )}
        {envoye && etat.accuse && (
          <p className="ct-reponse mt-3 self-center rounded-full bg-white/[0.06] px-3.5 py-1.5 text-[12px] text-[#B8C6D6]">
            Une copie vous a été envoyée par e-mail
          </p>
        )}
      </div>
    </div>
  );
}

export default function Formulaire() {
  const [etat, action, enCours] = useActionState(envoyerMessage, initial);
  const v = etat.valeurs;
  const [apercu, setApercu] = useState<Apercu>({ besoin: v?.besoin ?? "", objet: v?.objet ?? "", message: v?.message ?? "" });
  const [enSaisie, setEnSaisie] = useState(false);

  // Heure d'affichage du formulaire (anti-robots), posée côté navigateur
  // (recopiée à chaque envoi : React remet le formulaire à zéro après une action)
  const afficheLe = useRef(0);
  useEffect(() => {
    afficheLe.current = Date.now();
  }, []);

  const e = etat.erreurs ?? {};
  const envoye = etat.statut === "envoye";

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_420px]">
      <div className="rounded-[28px] bg-white p-6 shadow-[0_24px_60px_-36px_rgba(10,26,47,0.35)] ring-1 ring-[#E3EAF2] sm:p-10">
        {envoye ? (
          <div role="status" className="flex flex-col items-start py-6">
            <span className="ct-bulle inline-flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1F5EFF,#00B4D8)] text-white">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </span>
            <h2 className="mt-6 text-[clamp(1.6rem,2.6vw,2.1rem)] font-semibold tracking-tight text-nuit">Message envoyé.</h2>
            <p className="mt-3 max-w-md text-[17px] leading-relaxed text-[#2C4558]">
              Merci{etat.prenom ? ` ${etat.prenom}` : ""}. Nous lisons votre demande en personne et revenons vers vous par e-mail pour en parler.
            </p>
            {etat.accuse && (
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#4A6178]">Une copie de votre demande vient de vous être envoyée par e-mail.</p>
            )}
            <Link
              href="/realisations"
              className="mt-8 inline-flex items-center rounded-full border border-[#C9D5E3] px-6 py-3 font-medium text-nuit transition-colors hover:border-bleu hover:text-bleu"
            >
              Découvrir nos réalisations
            </Link>
          </div>
        ) : (
          <form
            action={action}
            onSubmit={(ev) => {
              const champ = ev.currentTarget.elements.namedItem("affiche_le");
              if (champ instanceof HTMLInputElement) champ.value = String(afficheLe.current);
            }}
            onChange={(ev) => {
              const t = ev.target as unknown as HTMLInputElement;
              if (t.name === "besoin" || t.name === "objet" || t.name === "message") setApercu((a) => ({ ...a, [t.name]: t.value }));
            }}
            onFocus={() => setEnSaisie(true)}
            onBlur={(ev) => {
              if (!ev.currentTarget.contains(ev.relatedTarget as Node | null)) setEnSaisie(false);
            }}
            className="flex flex-col gap-10"
            noValidate
          >
            <Etape numero={1} titre="Vous">
              <div className="grid gap-5 sm:grid-cols-2">
                <Champ id="nom" libelle="Nom" erreur={e.nom}>
                  <input id="nom" name="nom" defaultValue={v?.nom} autoComplete="name" required className={styleChamp} aria-invalid={!!e.nom} aria-describedby={e.nom ? "nom-erreur" : undefined} />
                </Champ>
                <Champ id="email" libelle="E-mail" erreur={e.email}>
                  <input id="email" name="email" defaultValue={v?.email} type="email" autoComplete="email" required className={styleChamp} aria-invalid={!!e.email} aria-describedby={e.email ? "email-erreur" : undefined} />
                </Champ>
              </div>
              <Champ id="telephone" libelle="Téléphone (facultatif)" erreur={e.telephone}>
                <input id="telephone" name="telephone" type="tel" defaultValue={v?.telephone} autoComplete="tel" className={`${styleChamp} sm:max-w-[calc(50%-10px)]`} aria-invalid={!!e.telephone} aria-describedby={e.telephone ? "telephone-erreur" : undefined} />
              </Champ>
            </Etape>

            <Etape numero={2} titre="Votre projet">
              <div role="radiogroup" aria-label="Type de projet" aria-describedby={e.besoin ? "besoin-erreur" : undefined} className="grid gap-2.5 sm:grid-cols-2">
                {BESOINS.map((b) => (
                  <label
                    key={b}
                    className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-[#DCE3EC] bg-white px-3.5 py-3 text-[15px] font-medium text-[#2C4558] transition-colors hover:border-[#B9C8DA] has-checked:border-bleu has-checked:bg-[#F3F7FF] has-checked:text-nuit has-focus-visible:ring-4 has-focus-visible:ring-bleu/20"
                  >
                    <input type="radio" name="besoin" value={b} defaultChecked={v?.besoin === b} required className="sr-only" />
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EEF3FF] text-bleu transition-colors group-has-checked:bg-[linear-gradient(135deg,#1F5EFF,#00B4D8)] group-has-checked:text-white">
                      <Picto besoin={b} />
                    </span>
                    {b}
                  </label>
                ))}
              </div>
              {e.besoin && (
                <p id="besoin-erreur" className="-mt-2 text-sm text-[#B42318]">
                  {e.besoin}
                </p>
              )}
              <Champ id="objet" libelle="Objet (facultatif)" erreur={e.objet}>
                <input id="objet" name="objet" defaultValue={v?.objet} maxLength={160} placeholder="Ex. : un site pour notre atelier" className={styleChamp} aria-invalid={!!e.objet} aria-describedby={e.objet ? "objet-erreur" : undefined} />
              </Champ>
              <Champ
                id="message"
                libelle="Votre message"
                erreur={e.message}
                aide={
                  <p className="flex justify-between gap-4 text-[13px] text-[#6B8299]">
                    <span>Ce que vous voulez accomplir, vos objectifs, vos échéances.</span>
                    <span className="shrink-0 tabular-nums">{apercu.message.length} / 5 000</span>
                  </p>
                }
              >
                <textarea id="message" name="message" defaultValue={v?.message} rows={7} maxLength={5000} required className={`${styleChamp} resize-y`} aria-invalid={!!e.message} aria-describedby={e.message ? "message-erreur" : undefined} />
              </Champ>
            </Etape>

            <Etape numero={3} titre="Recommandation">
              <Champ id="source" libelle="Qui vous a recommandé ? (facultatif)">
                <input id="source" name="source" defaultValue={v?.source} autoComplete="off" placeholder="Un client, un partenaire…" className={styleChamp} />
              </Champ>
            </Etape>

            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="site_web">Ne pas remplir</label>
              <input id="site_web" name="site_web" tabIndex={-1} autoComplete="off" />
            </div>
            <input type="hidden" name="affiche_le" defaultValue="0" />

            {etat.message && (
              <p role="alert" className="rounded-2xl bg-[#FEF3F2] px-4 py-3 text-[15px] text-[#B42318]">
                {etat.message}
              </p>
            )}

            <div className="flex flex-col gap-4 border-t border-[#E3EAF2] pt-8 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={enCours}
                className="inline-flex shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-[linear-gradient(135deg,#1F5EFF,#1638A8)] px-7 py-4 font-medium text-white shadow-[0_12px_30px_-12px_rgba(31,94,255,0.7)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-12px_rgba(31,94,255,0.8)] disabled:translate-y-0 disabled:opacity-60"
              >
                {enCours ? (
                  "Envoi en cours…"
                ) : (
                  <>
                    Envoyer le message
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 3 10.5 13.5M21 3l-6.75 18-3.75-7.5L3 9.75 21 3z" />
                    </svg>
                  </>
                )}
              </button>
              <p className="max-w-xs text-[13px] leading-relaxed text-[#6B8299] sm:text-right">
                Vos données servent uniquement à vous répondre.{" "}
                <Link href="/confidentialite" className="font-medium text-bleu transition-colors hover:text-[#1638A8]">
                  Confidentialité
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>

      <div className="flex flex-col gap-4 lg:sticky lg:top-28">
        <div className="hidden lg:block">
          <Conversation apercu={apercu} enSaisie={enSaisie} etat={etat} />
        </div>
        <p className="px-2 text-[15px] text-[#4A6178]">
          Vous préférez l&apos;e-mail&nbsp;?{" "}
          <a href={`mailto:${SITE.email}`} className="whitespace-nowrap font-medium text-bleu transition-colors hover:text-[#1638A8]">
            {SITE.email}
          </a>
        </p>
      </div>
    </div>
  );
}
