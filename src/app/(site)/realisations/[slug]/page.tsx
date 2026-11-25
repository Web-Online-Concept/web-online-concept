import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppelFinal, Conteneur } from "@/components/site/Blocs";
import { REALISATIONS, realisation } from "@/lib/contenu";

export function generateStaticParams() {
  return REALISATIONS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/realisations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = realisation(slug);
  if (!r) return {};
  return { title: r.nom, description: r.accroche };
}

export default async function PageRealisation({ params }: PageProps<"/realisations/[slug]">) {
  const { slug } = await params;
  const r = realisation(slug);
  if (!r) notFound();
  const autres = REALISATIONS.filter((x) => x.slug !== r.slug);

  return (
    <>
      <section className="relative overflow-hidden bg-nuit text-white">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-32 h-[28rem] w-[28rem] rounded-full opacity-30 blur-3xl"
          style={{ background: r.teinte }}
        />
        <Conteneur className="relative pb-16 pt-12 sm:pb-20 sm:pt-16">
          <Link href="/realisations" className="text-sm text-[#B8C6D6] hover:text-white">
            Toutes les réalisations
          </Link>
          <p className="mt-8 text-[15px] text-[#B8C6D6]">{r.type}</p>
          <h1 className="mt-2 text-[clamp(2.2rem,5vw,3.8rem)] font-semibold leading-[1.06] tracking-tight">{r.nom}</h1>
          <p className="mt-5 max-w-2xl text-xl leading-relaxed text-[#C3D0DD]">{r.accroche}</p>
          {r.client && <p className="mt-4 text-[15px] text-[#B8C6D6]">Pour {r.client}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={r.site.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-bleu px-6 py-3 font-medium text-white transition-colors hover:bg-[#3A72FF]"
            >
              Visiter {r.site.libelle}
            </a>
            {r.autresLiens?.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/40 px-6 py-3 font-medium text-white transition-colors hover:border-white hover:bg-white/5"
              >
                {l.libelle}
              </a>
            ))}
          </div>
        </Conteneur>
      </section>

      <section className="border-b border-[#E3E9F0] bg-white">
        <Conteneur className="grid gap-8 py-12 sm:grid-cols-3">
          {r.chiffres.map((c) => (
            <div key={c.libelle}>
              <p className="text-[clamp(2.2rem,4vw,3rem)] font-semibold leading-none text-nuit">{c.valeur}</p>
              <p className="mt-2 text-[15px] text-[#4A6178]">{c.libelle}</p>
            </div>
          ))}
        </Conteneur>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <Conteneur className="grid gap-14 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="text-2xl font-semibold text-nuit">Le besoin</h2>
            <p className="mt-4 text-[17px] leading-relaxed text-[#2C4558]">{r.besoin}</p>
            <h2 className="mt-12 text-2xl font-semibold text-nuit">Technologies</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {r.technos.map((t) => (
                <li key={t} className="rounded-full bg-ciel px-4 py-1.5 text-sm text-nuit">
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-nuit">Ce qui a été réalisé</h2>
            <ul className="mt-5 flex flex-col gap-4">
              {r.realise.map((ligne) => (
                <li key={ligne} className="flex gap-3 text-[17px] leading-relaxed text-[#2C4558]">
                  <span aria-hidden="true" className="mt-2.5 h-2 w-2 shrink-0 rounded-full" style={{ background: r.teinte }} />
                  {ligne}
                </li>
              ))}
            </ul>
          </div>
        </Conteneur>
      </section>

      <section className="bg-ciel py-14">
        <Conteneur>
          <h2 className="text-xl font-semibold text-nuit">Autres réalisations</h2>
          <ul className="mt-5 flex flex-wrap gap-3">
            {autres.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/realisations/${a.slug}`}
                  className="inline-block rounded-full border border-[#CBD5E1] bg-white px-5 py-2.5 font-medium text-nuit hover:border-nuit"
                >
                  {a.nom}
                </Link>
              </li>
            ))}
          </ul>
        </Conteneur>
      </section>

      <AppelFinal />
    </>
  );
}
