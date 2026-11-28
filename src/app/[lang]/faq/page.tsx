import type { Metadata } from "next";
import Link from "next/link";
import { jsonLd, metaPage, versions } from "@/lib/seo";
import { AppelFinal, Conteneur, EnTetePage } from "@/components/site/Blocs";
import type { Question, ThemeFaq } from "@/lib/contenu";
import { contenu } from "@/lib/i18n/contenu";
import { chemin } from "@/lib/i18n/chemins";
import { langue, t } from "@/lib/i18n/langue";

const TEXTES = {
  fr: {
    titre: "Questions fréquentes",
    description:
      "Délais, autonomie, référencement, visibilité dans les IA, sites multilingues, propriété du site, suivi : les réponses aux questions les plus fréquentes sur un projet avec Web Online Concept.",
    intro: "Délais, autonomie, référencement, suivi : les réponses aux questions que l'on nous pose le plus souvent.",
    themes: "Thèmes",
    autre: "Une autre question ?",
    ecrivez: "Écrivez-nous : nous répondons personnellement.",
    ecrire: "Nous écrire",
  },
  en: {
    titre: "Frequently asked questions",
    description:
      "Timelines, independence, SEO, AI visibility, multilingual websites, ownership, support: answers to the most common questions about a project with Web Online Concept.",
    intro: "Timelines, independence, SEO, support: answers to the questions we're asked most often.",
    themes: "Topics",
    autre: "Another question?",
    ecrivez: "Write to us: we reply personally.",
    ecrire: "Write to us",
  },
  es: {
    titre: "Preguntas frecuentes",
    description:
      "Plazos, autonomía, posicionamiento, visibilidad en las IA, sitios multilingües, propiedad del sitio, seguimiento: las respuestas a las preguntas más frecuentes sobre un proyecto con Web Online Concept.",
    intro: "Plazos, autonomía, posicionamiento, seguimiento: las respuestas a las preguntas que más nos hacen.",
    themes: "Temas",
    autre: "¿Otra pregunta?",
    ecrivez: "Escríbanos: respondemos personalmente.",
    ecrire: "Escribirnos",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const l = await langue();
  const x = t(TEXTES, l);
  return metaPage(l, x.titre, x.description, versions("faq"));
}

// Données structurées FAQPage : aident Google et les IA à reprendre les réponses
const donneesStructurees = (FAQ: Question[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((q) => ({
    "@type": "Question",
    name: q.question,
    acceptedAnswer: { "@type": "Answer", text: q.reponse },
  })),
});

// Pictogrammes au trait des thèmes (24 × 24)
const PICTOS: Record<ThemeFaq, React.ReactNode> = {
  ensemble: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 19c.6-3 2.9-4.8 6-4.8s5.4 1.8 6 4.8M16 5.2a3 3 0 0 1 0 5.6M18.5 14.6c1.4.7 2.3 2.2 2.5 4.4" />
    </>
  ),
  projet: (
    <>
      <rect x="2.75" y="4" width="18.5" height="16" rx="2.5" />
      <path d="M2.75 8.75h18.5M6.5 12.5h6M6.5 15.5h4" />
    </>
  ),
  visibilite: <path d="M17.25 10.5a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0zM15.4 15.4l5.1 5.1M8 13v-1.5M10.5 13V9.5M13 13V8" />,
  suivi: <path d="M19.75 12a7.75 7.75 0 0 1-13.4 5.3M4.25 12a7.75 7.75 0 0 1 13.4-5.3M17.9 3.2v3.6h-3.6M6.1 20.8v-3.6h3.6" />,
};

function Picto({ theme, className = "h-5 w-5" }: { theme: ThemeFaq; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PICTOS[theme]}
    </svg>
  );
}

export default async function Faq() {
  const { l, FAQ, THEMES_FAQ } = await contenu();
  const x = t(TEXTES, l);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(donneesStructurees(FAQ))} />
      <EnTetePage illustration="faq" titre={x.titre} intro={x.intro} />

      <section className="bg-white py-16 sm:py-20">
        <Conteneur className="grid gap-12 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
          {/* Thèmes */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-sm font-semibold text-nuit">{x.themes}</p>
            <ul className="mt-4 flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              {THEMES_FAQ.map((th) => (
                <li key={th.id}>
                  <a
                    href={`#${th.id}`}
                    className="group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] font-medium text-[#2C4558] transition-colors hover:bg-ciel hover:text-nuit"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8EFFF] text-bleu transition-colors group-hover:bg-[linear-gradient(135deg,#1F5EFF,#00B4D8)] group-hover:text-white">
                      <Picto theme={th.id} className="h-[18px] w-[18px]" />
                    </span>
                    {th.titre}
                    <span className="ml-auto text-sm text-[#93A6BB]">{FAQ.filter((q) => q.theme === th.id).length}</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-8 hidden rounded-2xl bg-nuit p-5 text-white lg:block">
              <p className="font-semibold">{x.autre}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-[#B8C6D6]">{x.ecrivez}</p>
              <Link href={chemin(l, "contact")} className="mt-4 inline-block text-sm font-medium text-[#7CCBFF] transition-colors hover:text-white">
                {x.ecrire}
              </Link>
            </div>
          </aside>

          {/* Conversation */}
          <div className="flex flex-col gap-14">
            {THEMES_FAQ.map((th) => (
              <div key={th.id} id={th.id} className="scroll-mt-24">
                <h2 className="flex items-center gap-3 text-[clamp(1.4rem,2.2vw,1.75rem)] font-semibold tracking-tight text-nuit">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#1F5EFF,#00B4D8)] text-white">
                    <Picto theme={th.id} />
                  </span>
                  {th.titre}
                </h2>
                <div className="mt-6 flex flex-col gap-3">
                  {FAQ.filter((q) => q.theme === th.id).map((q, i) => (
                    <details key={q.question} className="faq-bulle group" open={th.id === "ensemble" && i === 0}>
                      <summary className="flex cursor-pointer list-none items-center gap-4 rounded-2xl border border-[#DCE3EC] bg-white px-5 py-4 text-left transition-colors hover:border-[#B9C8DA] group-open:border-transparent group-open:bg-[linear-gradient(135deg,#1F5EFF,#1638A8)] [&::-webkit-details-marker]:hidden">
                        <span
                          aria-hidden="true"
                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ciel text-[15px] font-semibold text-bleu group-open:bg-white/15 group-open:text-white"
                        >
                          ?
                        </span>
                        <span className="flex-1 text-[17px] font-semibold text-nuit group-open:text-white">{q.question}</span>
                        <span
                          aria-hidden="true"
                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#4A6178] transition-transform duration-200 group-open:rotate-45 group-open:text-white"
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </span>
                      </summary>
                      {/* Réponse du studio, comme dans une conversation : trois points, puis le texte */}
                      <div className="mt-3 flex items-start gap-3 pl-2 sm:pl-6">
                        <span
                          aria-hidden="true"
                          className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-nuit ring-2 ring-white"
                        >
                          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-18 12 12)" stroke="#00B4D8" strokeWidth="1.4" />
                            <circle cx="12" cy="12" r="4.2" fill="#1F5EFF" />
                            <circle cx="20.2" cy="9" r="1.6" fill="#2BD47D" />
                          </svg>
                        </span>
                        <div className="relative min-w-0 flex-1">
                          <span aria-hidden="true" className="faq-ecrit absolute left-0 top-0 flex gap-1.5 rounded-2xl rounded-tl-md bg-ciel px-4 py-3.5">
                            <span className="h-2 w-2 rounded-full bg-[#7CA3C9]" />
                            <span className="h-2 w-2 rounded-full bg-[#7CA3C9]" />
                            <span className="h-2 w-2 rounded-full bg-[#7CA3C9]" />
                          </span>
                          <div className="faq-texte rounded-2xl rounded-tl-md bg-ciel px-5 py-4">
                            <p className="text-[16px] leading-relaxed text-[#2C4558]">{q.reponse}</p>
                            {q.lien && (
                              <Link href={q.lien.href} className="mt-2 inline-block font-medium text-bleu transition-colors hover:text-[#1638A8]">
                                {q.lien.libelle}
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}

            <div className="rounded-2xl bg-nuit p-6 text-white lg:hidden">
              <p className="font-semibold">{x.autre}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-[#B8C6D6]">{x.ecrivez}</p>
              <Link href={chemin(l, "contact")} className="mt-4 inline-block text-sm font-medium text-[#7CCBFF] transition-colors hover:text-white">
                {x.ecrire}
              </Link>
            </div>
          </div>
        </Conteneur>
      </section>
      <AppelFinal />
    </>
  );
}
