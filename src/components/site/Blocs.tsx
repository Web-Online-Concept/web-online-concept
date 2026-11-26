import Link from "next/link";
import { Cadre } from "@/components/site/Cadres";
import Orbite from "@/components/site/Orbite";
import IllustrationEntete, {
  type VarianteEntete,
} from "@/components/site/illustrations/Entetes";
import type { Realisation } from "@/lib/contenu";
import { ENGAGEMENTS, SITE } from "@/lib/contenu";

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
      <Conteneur className="relative flex flex-col items-start gap-5 py-20 sm:py-24">
        <p className="max-w-3xl text-[clamp(1.6rem,3.4vw,2.6rem)] font-semibold leading-tight">{SITE.phraseFinale}</p>
        <p className="text-lg text-[#C3D0DD]">
          Vous avez été recommandé ?{" "}
          <Link href="/contact" className="font-medium text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">
            Écrivez directement
          </Link>
          .
        </p>
      </Conteneur>
    </section>
  );
}

export function BlocEngagements({ fond = "bg-white" }: { fond?: string }) {
  return (
    <section className={`${fond} py-20 sm:py-24`}>
      <Conteneur>
        <h2 className="text-[clamp(1.7rem,3vw,2.4rem)] font-semibold tracking-tight text-nuit">Nos engagements</h2>
        <ul className="mt-10 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
          {ENGAGEMENTS.map((e) => (
            <li key={e.titre} className="flex gap-4">
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E3F8EC] text-[#0E7A45]">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12.5l4.2 4.2L19 7" />
                </svg>
              </span>
              <div>
                <h3 className="text-lg font-semibold text-nuit">{e.titre}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-[#2C4558]">{e.texte}</p>
              </div>
            </li>
          ))}
        </ul>
      </Conteneur>
    </section>
  );
}
