import type { Metadata } from "next";
import { metaPage, versions } from "@/lib/seo";
import { Conteneur, EnTetePage } from "@/components/site/Blocs";
import { contenu } from "@/lib/i18n/contenu";
import { langue, t } from "@/lib/i18n/langue";
import Formulaire from "./Formulaire";

const TEXTES = {
  fr: {
    titre: "Contact",
    description: "Web Online Concept travaille sur recommandation et sur demande privée. Pour échanger sur un projet, écrivez directement.",
    h1: "Écrivez-nous",
    intro: "Nous travaillons sur recommandation et sur demande privée. Chaque message est lu en personne, et nous revenons vers vous par e-mail.",
  },
  en: {
    titre: "Contact",
    description: "Web Online Concept works by referral and private request. To talk about a project, write to us directly.",
    h1: "Write to us",
    intro: "We work by referral and private request. Every message is read personally, and we get back to you by email.",
  },
  es: {
    titre: "Contacto",
    description: "Web Online Concept trabaja por recomendación y bajo petición privada. Para hablar de un proyecto, escríbanos directamente.",
    h1: "Escríbanos",
    intro: "Trabajamos por recomendación y bajo petición privada. Cada mensaje se lee personalmente, y le respondemos por correo electrónico.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const l = await langue();
  const x = t(TEXTES, l);
  return metaPage(l, x.titre, x.description, versions("contact"));
}

export default async function Contact() {
  const { l, BESOINS } = await contenu();
  const x = t(TEXTES, l);
  return (
    <>
      <EnTetePage titre={x.h1} intro={x.intro} illustration="contact" />
      <section className="bg-ciel py-14 sm:py-20">
        <Conteneur>
          <Formulaire libelles={BESOINS} />
        </Conteneur>
      </section>
    </>
  );
}
