import type { Metadata } from "next";
import { metaPage } from "@/lib/seo";
import { Conteneur, EnTetePage } from "@/components/site/Blocs";
import Formulaire from "./Formulaire";

export const metadata: Metadata = metaPage("Contact", "Web Online Concept travaille sur recommandation et sur demande privée. Pour échanger sur un projet, écrivez directement.", "/contact");

export default function Contact() {
  return (
    <>
      <EnTetePage
        titre="Écrivez-nous"
        intro="Nous travaillons sur recommandation et sur demande privée. Chaque message est lu en personne, et nous revenons vers vous par e-mail."
        illustration="contact"
      />
      <section className="bg-ciel py-14 sm:py-20">
        <Conteneur>
          <Formulaire />
        </Conteneur>
      </section>
    </>
  );
}
