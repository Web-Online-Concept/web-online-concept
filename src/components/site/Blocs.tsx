import Link from "next/link";
import { Cadre, CadreNavigateur } from "@/components/site/Cadres";
import Orbite from "@/components/site/Orbite";
import ZoneAnimee from "@/components/site/ZoneAnimee";
import { VISUELS_ENGAGEMENTS } from "@/components/site/illustrations/Engagements";
import IllustrationEntete, {
  type VarianteEntete,
} from "@/components/site/illustrations/Entetes";
import type { Realisation } from "@/lib/contenu";
import { contenu } from "@/lib/i18n/contenu";
import { chemin } from "@/lib/i18n/chemins";
import { langue, t } from "@/lib/i18n/langue";

export function Conteneur({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

// ecran : l'en-tête occupe tout l'écran quand la page défile bloc par bloc (DefilementEcrans) ; suite donne
// l'ancre du bloc suivant, vers lequel pointe une flèche (comme sur l'accueil)
export function EnTetePage({
  titre,
  intro,
  illustration,
  ecran = false,
  suite,
}: {
  titre: string;
  intro?: string;
  illustration?: VarianteEntete;
  ecran?: boolean;
  suite?: { id: string; libelle: string };
}) {
  return (
    <section className={`relative overflow-hidden bg-nuit text-white ${ecran ? "ecran" : ""}`}>
      <Conteneur
        className={`pb-16 pt-14 sm:pb-20 sm:pt-20 ${illustration ? "lg:grid lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-10 lg:py-12" : ""}`}
      >
        <div>
          <h1 className="max-w-3xl text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.08] tracking-tight text-balance">
            {titre}
          </h1>
          {intro && (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#B8C6D6]">
              {intro}
            </p>
          )}
        </div>
        {illustration && (
          <IllustrationEntete
            variante={illustration}
            className={`hidden w-full justify-self-end lg:block ${ecran ? "max-w-[540px]" : "max-w-[460px]"}`}
          />
        )}
      </Conteneur>
      {suite && (
        <a
          href={`#${suite.id}`}
          aria-label={suite.libelle}
          className="absolute bottom-6 left-1/2 hidden h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-white/20 text-[#B8C6D6] transition-colors hover:border-white/50 hover:text-white lg:flex"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 9.5l6 6 6-6" />
          </svg>
        </a>
      )}
    </section>
  );
}

// Petite carte vers une autre réalisation (bas des fiches) : vignette de la page d'accueil, nom et type
export async function CarteSuivante({ r }: { r: Realisation }) {
  const l = await langue();
  const vignette = r.visuels?.find((v) => v.format === "ordinateur");
  return (
    <Link
      href={chemin(l, "realisations", r.slug)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[#DCE3EC] bg-white transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(10,26,47,0.45)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-cyan"
    >
      <div className="relative h-40 overflow-hidden bg-nuit">
        <div
          aria-hidden="true"
          className="absolute -right-14 -top-16 h-56 w-56 rounded-full opacity-40 blur-2xl transition-opacity group-hover:opacity-60"
          style={{ background: r.teinte }}
        />
        {vignette ? (
          <CadreNavigateur
            v={vignette}
            sizes="(min-width: 768px) 320px, 90vw"
            className="absolute left-5 top-5 w-[115%] transition-transform duration-500 group-hover:-translate-y-1"
          />
        ) : (
          <span className="absolute bottom-4 left-5 text-sm text-[#93A6BB]">{r.site.libelle}</span>
        )}
      </div>
      <div className="flex flex-col gap-1 p-5">
        <p className="text-sm text-[#4A6178]">{r.type}</p>
        <h3 className="text-lg font-semibold text-nuit transition-colors group-hover:text-bleu">{r.nom}</h3>
      </div>
    </Link>
  );
}

export async function CarteRealisation({ r }: { r: Realisation }) {
  const l = await langue();
  const fort = r.chiffres[0];
  const vignette = r.visuels?.[0];
  return (
    <Link
      href={chemin(l, "realisations", r.slug)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[#DCE3EC] bg-white transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(10,26,47,0.45)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-cyan"
    >
      <div
        className={`relative flex flex-col justify-end overflow-hidden bg-nuit p-6 ${vignette ? "h-56" : "h-48"}`}
      >
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-20 h-64 w-64 rounded-full opacity-40 blur-2xl transition-opacity group-hover:opacity-60"
          style={{ background: r.teinte }}
        />
        {vignette ? (
          <Cadre
            v={vignette}
            sizes="(min-width: 768px) 360px, 90vw"
            className={
              vignette.format === "telephone"
                ? "absolute left-1/2 top-6 w-[44%] -translate-x-1/2 transition-transform duration-500 group-hover:-translate-y-1"
                : "absolute left-6 top-7 w-[112%] transition-transform duration-500 group-hover:-translate-y-1"
            }
          />
        ) : (
          <>
            <p className="relative text-[42px] font-semibold leading-none text-white">
              {fort.valeur}
            </p>
            <p className="relative mt-2 max-w-[16rem] text-sm text-[#B8C6D6]">
              {fort.libelle}
            </p>
          </>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-6">
        <p className="text-sm text-[#4A6178]">{r.type}</p>
        <h3 className="text-xl font-semibold text-nuit">{r.nom}</h3>
        <p className="text-[15px] leading-relaxed text-[#2C4558]">
          {r.accroche}
        </p>
        <span className="mt-auto pt-3 text-[15px] font-medium text-bleu transition-colors group-hover:text-[#1638A8]">
          {t({ fr: "Voir la réalisation", en: "View the project", es: "Ver el proyecto" }, l)}
        </span>
      </div>
    </Link>
  );
}

export async function AppelFinal() {
  const c = await contenu();
  const x = t(
    {
      fr: { question: "Vous avez été recommandé ?", lien: "Écrivez-nous directement" },
      en: { question: "Were you referred to us?", lien: "Write to us directly" },
      es: { question: "¿Le han recomendado nuestro estudio?", lien: "Escríbanos directamente" },
    },
    c.l,
  );
  return (
    // Tout en bas de page, ce bloc et le pied de page remplissent exactement l'écran (77 px = menu)
    <section className="ecran-fin rendu-differe relative flex min-h-[calc(100svh-77px-var(--pied,418px))] items-center overflow-hidden bg-[radial-gradient(ellipse_at_80%_45%,#163C86_0%,#0A1A2F_64%)] text-white">
      <Orbite ajuste planete className="pointer-events-none absolute right-[3%] top-1/2 hidden aspect-[2/1] h-[82%] w-auto -translate-y-1/2 opacity-80 md:block" />
      <Conteneur className="relative flex flex-col items-start gap-6 py-20 sm:py-24">
        <p className="max-w-3xl text-[clamp(1.9rem,4.2vw,3.4rem)] font-semibold leading-[1.1] tracking-tight">{c.SITE.phraseFinale}</p>
        <p className="text-xl text-[#C3D0DD]">
          {x.question}{" "}
          <Link href={chemin(c.l, "contact")} className="font-medium text-[#7CCBFF] transition-colors hover:text-white">
            {x.lien}
          </Link>
          .
        </p>
      </Conteneur>
    </section>
  );
}

// Les quatre engagements, chacun illustré d'un visuel animé (fond ciel sur une section blanche, et inversement)
export async function BlocEngagements({ fond = "bg-white" }: { fond?: string }) {
  const c = await contenu();
  const visuel = fond === "bg-white" ? "bg-ciel" : "bg-white";
  return (
    <section className={`ecran rendu-differe ${fond} py-20 sm:py-24`}>
      <Conteneur>
        <h2 className="text-[clamp(1.7rem,3vw,2.4rem)] font-semibold tracking-tight text-nuit">
          {t({ fr: "Nos engagements", en: "Our commitments", es: "Nuestros compromisos" }, c.l)}
        </h2>
        <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {c.ENGAGEMENTS.map((e, i) => {
            const Visuel = VISUELS_ENGAGEMENTS[i];
            return (
              <li key={e.titre} className="flex flex-col">
                <ZoneAnimee className={`relative aspect-[4/3] overflow-hidden rounded-2xl ${visuel}`}>
                  <div
                    aria-hidden="true"
                    className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-cyan opacity-[0.12] blur-2xl"
                  />
                  {Visuel && <Visuel />}
                </ZoneAnimee>
                <h3 className="mt-6 text-lg font-semibold text-nuit">{e.titre}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#2C4558]">{e.texte}</p>
              </li>
            );
          })}
        </ul>
      </Conteneur>
    </section>
  );
}
