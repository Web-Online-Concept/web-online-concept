import type { Metadata } from "next";
import Link from "next/link";
import { AppelFinal, Conteneur, EnTetePage } from "@/components/site/Blocs";
import { FAQ, SITE } from "@/lib/contenu";

export const metadata: Metadata = {
  title: "Questions fréquentes",
  description:
    "Délais, autonomie, référencement, visibilité dans les IA, refonte, propriété du site, suivi : les réponses aux questions les plus fréquentes sur un projet avec Web Online Concept.",
};

// Données structurées FAQPage : aident Google et les IA à reprendre les réponses
const donneesStructurees = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((q) => ({
    "@type": "Question",
    name: q.question,
    acceptedAnswer: { "@type": "Answer", text: q.reponse },
  })),
};

export default function Faq() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(donneesStructurees).replace(/</g, "\\u003c") }}
      />
      <EnTetePage
        illustration="faq"
        titre="Questions fréquentes"
        intro="Délais, autonomie, référencement, suivi : les réponses aux questions que l'on nous pose le plus souvent."
      />
      <section className="bg-white py-16 sm:py-20">
        <Conteneur className="max-w-4xl">
          <div className="divide-y divide-[#E3E9F0] border-y border-[#E3E9F0]">
            {FAQ.map((q, i) => (
              <details key={q.question} className="group py-2" open={i === 0}>
                <summary className="flex list-none items-center justify-between gap-6 py-4 text-left text-lg font-semibold text-nuit marker:hidden hover:text-bleu [&::-webkit-details-marker]:hidden">
                  {q.question}
                  <span
                    aria-hidden="true"
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ciel text-bleu transition-transform duration-200 group-open:rotate-45"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <div className="pb-6 pr-14">
                  <p className="text-[17px] leading-relaxed text-[#2C4558]">{q.reponse}</p>
                  {q.lien && (
                    <Link href={q.lien.href} className="mt-3 inline-block font-medium text-bleu hover:underline">
                      {q.lien.libelle}
                    </Link>
                  )}
                </div>
              </details>
            ))}
          </div>
          <p className="mt-10 text-[17px] text-[#2C4558]">
            Une autre question ?{" "}
            <Link href="/contact" className="font-medium text-bleu hover:underline">
              Posez-la directement
            </Link>{" "}
            ou écrivez à{" "}
            <a href={`mailto:${SITE.email}`} className="font-medium text-bleu hover:underline">
              {SITE.email}
            </a>
            .
          </p>
        </Conteneur>
      </section>
      <AppelFinal />
    </>
  );
}
