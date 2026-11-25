import Link from "next/link";
import { Cadre } from "@/components/site/Cadres";
import Orbite from "@/components/site/Orbite";
import IllustrationEntete, {
  type VarianteEntete,
} from "@/components/site/illustrations/Entetes";
import type { Realisation } from "@/lib/contenu";
import { SITE } from "@/lib/contenu";

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

export function EnTetePage({
  titre,
  intro,
  illustration,
}: {
  titre: string;
  intro?: string;
  illustration?: VarianteEntete;
}) {
  return (
    <section className="relative overflow-hidden bg-nuit text-white">
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
            className="hidden w-full max-w-[460px] justify-self-end lg:block"
          />
        )}
      </Conteneur>
    </section>
  );
}

export function CarteRealisation({ r }: { r: Realisation }) {
  const fort = r.chiffres[0];
  const vignette = r.visuels?.[0];
  return (
    <Link
      href={`/realisations/${r.slug}`}
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
        <span className="mt-auto pt-3 text-[15px] font-medium text-bleu group-hover:underline">
          Voir la réalisation
        </span>
      </div>
    </Link>
  );
}

export function AppelFinal() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_85%_40%,#163C86_0%,#0A1A2F_62%)] text-white">
      <Orbite className="pointer-events-none absolute -right-40 top-1/2 hidden h-[520px] w-[1000px] -translate-y-1/2 opacity-70 md:block" />
      <Conteneur className="relative flex flex-col items-start gap-7 py-20 sm:py-24">
        <p className="max-w-3xl text-[clamp(1.6rem,3.4vw,2.6rem)] font-semibold leading-tight">
          {SITE.phraseFinale}
        </p>
        <Link
          href="/contact"
          className="rounded-full bg-bleu px-7 py-3.5 text-base font-medium text-white transition-colors hover:bg-[#3A72FF]"
        >
          Décrire mon projet
        </Link>
      </Conteneur>
    </section>
  );
}
