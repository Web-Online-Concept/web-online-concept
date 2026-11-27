import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppelFinal, CarteSuivante, Conteneur } from "@/components/site/Blocs";
import { Cadre, CadreNavigateur, CadreTelephone } from "@/components/site/Cadres";
import { REALISATIONS, SITE, type Visuel } from "@/lib/contenu";
import { contenu, realisationDe } from "@/lib/i18n/contenu";
import { chemin } from "@/lib/i18n/chemins";
import { t } from "@/lib/i18n/langue";
import { ID_ENTREPRISE, jsonLd, metaPage, versions } from "@/lib/seo";

export function generateStaticParams() {
  return REALISATIONS.map((r) => ({ slug: r.slug }));
}

const TEXTES = {
  fr: { accueil: "Accueil", realisations: "Réalisations", toutes: "Toutes les réalisations", pour: "Pour", visiter: "Visiter", besoin: "Le besoin", technos: "Technologies", realise: "Ce qui a été réalisé", images: "En images", autres: "Autres réalisations" },
  en: { accueil: "Home", realisations: "Our work", toutes: "All our work", pour: "For", visiter: "Visit", besoin: "The need", technos: "Technologies", realise: "What we built", images: "In pictures", autres: "More projects" },
  es: { accueil: "Inicio", realisations: "Proyectos", toutes: "Todos los proyectos", pour: "Para", visiter: "Visitar", besoin: "La necesidad", technos: "Tecnologías", realise: "Lo que se realizó", images: "En imágenes", autres: "Otros proyectos" },
};

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/realisations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = await contenu();
  const r = realisationDe(c, slug);
  if (!r) return {};
  return metaPage(c.l, r.nom, r.accroche, versions("realisations", r.slug));
}

// Répartit les captures (hors capture principale) en groupes qui illustrent la fiche :
// chaque capture ordinateur forme un groupe ; le premier écran mobile vient se poser sur la
// dernière capture ordinateur ; les autres écrans mobiles vont seuls ou par deux.
function composer(ordis: Visuel[], tels: Visuel[]): Visuel[][] {
  const groupes: Visuel[][] = ordis.map((v) => [v]);
  const t = [...tels];
  if (groupes.length && t.length) groupes[groupes.length - 1].push(t.shift()!);
  if (t.length === 3 && !groupes.length) groupes.push([t[0]], [t[1], t[2]]);
  else for (let i = 0; i < t.length; i += 2) groupes.push(t.slice(i, i + 2));
  return groupes;
}

const COLONNES: Record<number, string> = { 1: "", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" };

// Une scène : fond clair teinté de la couleur du projet, avec une ou plusieurs captures
function Scene({ groupe, teinte }: { groupe: Visuel[]; teinte: string }) {
  const [a, b] = groupe;
  return (
    <div className="relative overflow-hidden rounded-3xl bg-ciel px-6 py-10 sm:px-10 sm:py-12">
      <div
        aria-hidden="true"
        className="absolute -right-20 -top-24 h-80 w-80 rounded-full opacity-25 blur-3xl"
        style={{ background: teinte }}
      />
      <div className="relative">
        {a.format === "ordinateur" && !b && <CadreNavigateur v={a} sizes="(min-width: 1024px) 520px, 88vw" />}
        {a.format === "ordinateur" && b && (
          <div className="relative pb-[9%] pr-[7%]">
            <CadreNavigateur v={a} sizes="(min-width: 1024px) 480px, 82vw" />
            <CadreTelephone v={b} sizes="(min-width: 1024px) 130px, 24vw" petit className="absolute bottom-0 right-0 w-[24%] shadow-[0_24px_50px_-18px_rgba(2,8,20,0.8)]" />
          </div>
        )}
        {a.format === "telephone" && !b && <CadreTelephone v={a} sizes="(min-width: 1024px) 260px, 55vw" className="mx-auto w-[55%] max-w-[260px]" />}
        {a.format === "telephone" && b && (
          <div className="flex justify-center gap-[6%]">
            <CadreTelephone v={a} sizes="(min-width: 1024px) 220px, 40vw" className="w-[42%] max-w-[240px]" />
            <CadreTelephone v={b} sizes="(min-width: 1024px) 220px, 40vw" className="mt-[12%] w-[42%] max-w-[240px]" />
          </div>
        )}
      </div>
    </div>
  );
}

export default async function PageRealisation({
  params,
}: PageProps<"/[lang]/realisations/[slug]">) {
  const { slug } = await params;
  const c = await contenu();
  const { l, REALISATIONS } = c;
  const x = t(TEXTES, l);
  const r = realisationDe(c, slug);
  if (!r) notFound();
  // Les trois réalisations qui suivent, en boucle : chaque fiche en propose de différentes
  const rang = REALISATIONS.findIndex((x) => x.slug === r.slug);
  const suivantes = [1, 2, 3].map((k) => REALISATIONS[(rang + k) % REALISATIONS.length]);
  const [principal, ...galerie] = r.visuels ?? [];
  const [visuelBesoin, visuelRealise, ...reste] = composer(
    galerie.filter((v) => v.format === "ordinateur"),
    galerie.filter((v) => v.format === "telephone"),
  );
  const resteOrdis = reste.flat().filter((v) => v.format === "ordinateur");
  const resteTels = reste.flat().filter((v) => v.format === "telephone");
  const donnees = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: x.accueil, item: `${SITE.url}${chemin(l)}` },
          { "@type": "ListItem", position: 2, name: x.realisations, item: `${SITE.url}${chemin(l, "realisations")}` },
          { "@type": "ListItem", position: 3, name: r.nom, item: `${SITE.url}${chemin(l, "realisations", r.slug)}` },
        ],
      },
      {
        "@type": "CreativeWork",
        inLanguage: l,
        name: r.nom,
        headline: r.accroche,
        description: r.besoin,
        genre: r.type,
        url: r.site.href,
        creator: { "@id": ID_ENTREPRISE },
        ...(principal ? { image: `${SITE.url}${principal.src}` } : {}),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(donnees)} />
      <section className="relative overflow-hidden bg-nuit text-white">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-32 h-[28rem] w-[28rem] rounded-full opacity-30 blur-3xl"
          style={{ background: r.teinte }}
        />
        <Conteneur
          className={`relative pb-28 pt-12 sm:pb-32 sm:pt-16 ${principal ? "lg:grid lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-12" : ""}`}
        >
          <div>
            <Link
              href={chemin(l, "realisations")}
              className="text-sm text-[#B8C6D6] hover:text-white"
            >
              {x.toutes}
            </Link>
            <p className="mt-8 text-[15px] text-[#B8C6D6]">{r.type}</p>
            <h1 className="mt-2 text-[clamp(2.2rem,5vw,3.8rem)] font-semibold leading-[1.06] tracking-tight">
              {r.nom}
            </h1>
            <p className="mt-5 max-w-2xl text-xl leading-relaxed text-[#C3D0DD]">
              {r.accroche}
            </p>
            {r.client && (
              <p className="mt-4 text-[15px] text-[#B8C6D6]">{x.pour} {r.client}</p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={r.site.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-bleu px-6 py-3 font-medium text-white transition-colors hover:bg-[#3A72FF]"
              >
                {x.visiter} {r.site.libelle}
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
          </div>
          {principal && (
            <Cadre
              v={principal}
              priorite
              sizes="(min-width: 1024px) 560px, 92vw"
              className={`mt-12 lg:mt-0 ${principal.format === "telephone" ? "mx-auto w-[62%] max-w-[300px]" : "w-full"}`}
            />
          )}
        </Conteneur>
      </section>

      {/* Carte des chiffres, à cheval sur le bas du héros */}
      <section className="relative -mt-16 bg-[linear-gradient(to_bottom,transparent_4rem,#fff_4rem)]">
        <Conteneur>
          <div
            className={`grid divide-y divide-[#E3E9F0] rounded-2xl bg-white shadow-[0_28px_60px_-30px_rgba(10,26,47,0.45)] ring-1 ring-[#E3E9F0] sm:divide-x sm:divide-y-0 ${COLONNES[r.chiffres.length] ?? "sm:grid-cols-3"}`}
          >
            {r.chiffres.map((c) => (
              <div key={c.libelle} className="px-6 py-8 text-center sm:py-10">
                <p className="text-[clamp(2.2rem,4vw,3rem)] font-semibold leading-none tracking-tight text-nuit">{c.valeur}</p>
                <p className="mx-auto mt-3 max-w-[15rem] text-[15px] leading-snug text-[#4A6178]">{c.libelle}</p>
              </div>
            ))}
          </div>
        </Conteneur>
      </section>

      <section className="bg-white pb-20 pt-16 sm:pb-24 sm:pt-20">
        <Conteneur className="flex flex-col gap-16 lg:gap-24">
          <div className={visuelBesoin ? "grid items-center gap-10 lg:grid-cols-2 lg:gap-16" : "max-w-3xl"}>
            <div>
              <h2 className="text-2xl font-semibold text-nuit">{x.besoin}</h2>
              <p className="mt-4 text-[17px] leading-relaxed text-[#2C4558]">{r.besoin}</p>
            {r.technos && r.technos.length > 0 && (
              <>
                <h2 className="mt-10 text-2xl font-semibold text-nuit">{x.technos}</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {r.technos.map((t) => (
                    <li key={t} className="rounded-full bg-ciel px-4 py-1.5 text-sm text-nuit">
                      {t}
                    </li>
                  ))}
                </ul>
              </>
            )}
            </div>
            {visuelBesoin && <Scene groupe={visuelBesoin} teinte={r.teinte} />}
          </div>

          <div className={visuelRealise ? "grid items-center gap-10 lg:grid-cols-2 lg:gap-16" : ""}>
            {visuelRealise && (
              <div className="lg:order-first">
                <Scene groupe={visuelRealise} teinte={r.teinte} />
              </div>
            )}
            <div className={visuelRealise ? "lg:order-last" : ""}>
              <h2 className="text-2xl font-semibold text-nuit">{x.realise}</h2>
              <ul className={`mt-5 grid gap-4 ${visuelRealise ? "" : "md:grid-cols-2 md:gap-x-12"}`}>
                {r.realise.map((ligne) => (
                  <li key={ligne} className="flex gap-3 text-[17px] leading-relaxed text-[#2C4558]">
                    <span aria-hidden="true" className="mt-2.5 h-2 w-2 shrink-0 rounded-full" style={{ background: r.teinte }} />
                    {ligne}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {reste.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-nuit">{x.images}</h2>
              {resteOrdis.length > 0 && (
                <div className="mt-8 grid items-start gap-8 md:grid-cols-2">
                  {resteOrdis.map((v) => (
                    <Cadre key={v.src} v={v} sizes="(min-width: 768px) 540px, 92vw" />
                  ))}
                </div>
              )}
              {resteTels.length > 0 && (
                <div className="mt-8 grid grid-cols-2 items-start gap-8 sm:grid-cols-3 lg:grid-cols-4">
                  {resteTels.map((v) => (
                    <Cadre key={v.src} v={v} sizes="(min-width: 1024px) 260px, 45vw" />
                  ))}
                </div>
              )}
            </div>
          )}
        </Conteneur>
      </section>

      <section className="bg-ciel py-16 sm:py-20">
        <Conteneur>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold text-nuit">{x.autres}</h2>
            <Link href={chemin(l, "realisations")} className="font-medium text-bleu transition-colors hover:text-[#1638A8]">
              {x.toutes}
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {suivantes.map((a) => (
              <CarteSuivante key={a.slug} r={a} />
            ))}
          </div>
        </Conteneur>
      </section>

      <AppelFinal />
    </>
  );
}
