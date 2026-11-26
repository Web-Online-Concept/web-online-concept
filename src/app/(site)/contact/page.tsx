import type { Metadata } from "next";
import { metaPage } from "@/lib/seo";
import { Conteneur, EnTetePage } from "@/components/site/Blocs";
import { SITE } from "@/lib/contenu";
import Formulaire from "./Formulaire";

export const metadata: Metadata = metaPage("Contact", "Web Online Concept travaille sur recommandation et sur demande privée. Pour échanger sur un projet, écrivez directement.", "/contact");

export default function Contact() {
  return (
    <>
      <EnTetePage titre="Contact" intro="Nous travaillons sur recommandation et sur demande privée. Pour échanger sur un projet, écrivez-nous directement ici." illustration="contact" />
      <section className="bg-white py-16 sm:py-20">
        <Conteneur className="grid gap-14 lg:grid-cols-[1.6fr_1fr]">
          <Formulaire />
          <aside className="flex flex-col gap-6 rounded-2xl bg-ciel p-8 self-start">
            <div>
              <h2 className="text-lg font-semibold text-nuit">Pour préparer l&apos;échange</h2>
              <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-[15px] leading-relaxed text-[#2C4558]">
                <li>Ce que vous voulez accomplir, et pour qui.</li>
                <li>Les objectifs à atteindre.</li>
                <li>Vos échéances, si vous en avez.</li>
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-nuit">Par e-mail</h2>
              <a href={`mailto:${SITE.email}`} className="mt-2 inline-block text-[15px] font-medium text-bleu transition-colors hover:text-[#1638A8]">
                {SITE.email}
              </a>
            </div>
          </aside>
        </Conteneur>
      </section>
    </>
  );
}
