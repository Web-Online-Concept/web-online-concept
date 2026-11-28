import type { Metadata } from "next";
import Link from "next/link";
import { metaPage, versions } from "@/lib/seo";
import { Conteneur, EnTetePage } from "@/components/site/Blocs";
import { LEGAL } from "@/lib/contenu";
import { chemin } from "@/lib/i18n/chemins";
import { langue, t } from "@/lib/i18n/langue";

const E = <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>;

const TEXTES = {
  fr: {
    titre: "Politique de confidentialité",
    description: "Comment Web Online Concept traite les données personnelles transmises par le formulaire de contact.",
    fait: null as string | null,
    responsable: "Responsable du traitement",
    responsableTexte: (
      <>
        {LEGAL.editeur} ({LEGAL.nomCommercial}), {LEGAL.adresse}. Contact&nbsp;: {E}.
      </>
    ),
    collecte: "Données collectées et finalité",
    collecteTexte:
      "Seules les informations saisies dans le formulaire de contact sont collectées : nom, adresse e-mail, téléphone (facultatif), type de projet, objet, message et, le cas échéant, la personne qui vous a recommandé. Elles servent uniquement à répondre à votre demande et à assurer le suivi de l'échange. Le traitement repose sur l'intérêt légitime à répondre aux messages reçus.",
    duree: "Durée de conservation",
    dureeTexte:
      "Les messages sont conservés trois ans après le dernier échange, puis supprimés. Les données de facturation des clients sont conservées dix ans, conformément aux obligations comptables.",
    destinataires: "Destinataires",
    destinatairesTexte:
      "Les données sont destinées à Web Online Concept uniquement. Elles ne sont ni vendues ni cédées. Elles sont traitées par les prestataires techniques suivants : Vercel (hébergement du site et protection du formulaire contre les envois automatisés), Supabase (base de données hébergée dans l'Union européenne), Brevo (envoi des e-mails de confirmation et de réponse, France) et Forward Email (acheminement des e-mails reçus). Les transferts éventuels hors de l'Union européenne sont encadrés par les garanties prévues par le RGPD.",
    cookies: "Cookies",
    cookiesTexte:
      "Ce site n'utilise aucun cookie publicitaire ni de mesure d'audience. Seul un cookie technique protège l'accès à l'espace d'administration. Votre navigateur garde aussi la date de votre dernière visite, uniquement pour ne pas rejouer la vidéo de présentation à chaque passage, et la langue du site que vous avez choisie : ces informations restent sur votre appareil et ne sont transmises à personne.",
    droits: "Vos droits",
    droitsTexte: (
      <>
        Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, d&apos;opposition, de limitation et de portabilité de
        vos données. Pour l&apos;exercer, écrivez à {E}. En cas de désaccord, vous pouvez adresser une réclamation à la CNIL (
        <a href="https://www.cnil.fr">cnil.fr</a>).
      </>
    ),
  },
  en: {
    titre: "Privacy policy",
    description: "How Web Online Concept processes the personal data submitted through the contact form.",
    fait: "This English translation is provided for convenience; the French version is the legally binding one.",
    responsable: "Data controller",
    responsableTexte: (
      <>
        {LEGAL.editeur} ({LEGAL.nomCommercial}), {LEGAL.adresse}. Contact: {E}.
      </>
    ),
    collecte: "Data collected and purpose",
    collecteTexte:
      "Only the information entered in the contact form is collected: name, email address, phone number (optional), type of project, subject, message and, where applicable, the person who referred you. It is used solely to reply to your request and follow up on the conversation. Processing is based on the legitimate interest in replying to messages received.",
    duree: "Retention period",
    dureeTexte:
      "Messages are kept for three years after the last exchange, then deleted. Client billing data is kept for ten years, in accordance with accounting obligations.",
    destinataires: "Recipients",
    destinatairesTexte:
      "The data is intended for Web Online Concept only. It is never sold or transferred. It is processed by the following technical providers: Vercel (website hosting and protection of the form against automated submissions), Supabase (database hosted in the European Union), Brevo (sending confirmation and reply emails, France) and Forward Email (routing incoming emails). Any transfers outside the European Union are covered by the safeguards provided for by the GDPR.",
    cookies: "Cookies",
    cookiesTexte:
      "This website uses no advertising or analytics cookies. Only one technical cookie protects access to the admin area. Your browser also stores the date of your last visit, solely so the introduction video isn't replayed every time, and the site language you chose: this information stays on your device and is never shared with anyone.",
    droits: "Your rights",
    droitsTexte: (
      <>
        You have the right to access, rectify, erase, object to, restrict and port your data. To exercise these rights, write to {E}. If you
        disagree with our response, you can lodge a complaint with the CNIL, the French data protection authority (
        <a href="https://www.cnil.fr">cnil.fr</a>).
      </>
    ),
  },
  es: {
    titre: "Política de privacidad",
    description: "Cómo trata Web Online Concept los datos personales enviados mediante el formulario de contacto.",
    fait: "Esta traducción al español se ofrece a título informativo; la versión francesa es la única jurídicamente vinculante.",
    responsable: "Responsable del tratamiento",
    responsableTexte: (
      <>
        {LEGAL.editeur} ({LEGAL.nomCommercial}), {LEGAL.adresse}. Contacto: {E}.
      </>
    ),
    collecte: "Datos recogidos y finalidad",
    collecteTexte:
      "Solo se recogen los datos introducidos en el formulario de contacto: nombre, dirección de correo electrónico, teléfono (opcional), tipo de proyecto, asunto, mensaje y, en su caso, la persona que le ha recomendado. Sirven únicamente para responder a su solicitud y hacer el seguimiento de la conversación. El tratamiento se basa en el interés legítimo de responder a los mensajes recibidos.",
    duree: "Plazo de conservación",
    dureeTexte:
      "Los mensajes se conservan tres años después del último intercambio y después se eliminan. Los datos de facturación de los clientes se conservan diez años, de acuerdo con las obligaciones contables.",
    destinataires: "Destinatarios",
    destinatairesTexte:
      "Los datos están destinados únicamente a Web Online Concept. No se venden ni se ceden. Los tratan los siguientes proveedores técnicos: Vercel (alojamiento del sitio y protección del formulario contra envíos automatizados), Supabase (base de datos alojada en la Unión Europea), Brevo (envío de los correos de confirmación y de respuesta, Francia) y Forward Email (encaminamiento de los correos recibidos). Las posibles transferencias fuera de la Unión Europea están cubiertas por las garantías previstas en el RGPD.",
    cookies: "Cookies",
    cookiesTexte:
      "Este sitio no utiliza ninguna cookie publicitaria ni de medición de audiencia. Solo una cookie técnica protege el acceso al panel de administración. Su navegador también guarda la fecha de su última visita, únicamente para no repetir el vídeo de presentación en cada visita, y el idioma del sitio que ha elegido: esta información permanece en su dispositivo y no se transmite a nadie.",
    droits: "Sus derechos",
    droitsTexte: (
      <>
        Usted dispone de los derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad de sus datos. Para ejercerlos,
        escriba a {E}. En caso de desacuerdo, puede presentar una reclamación ante la CNIL, la autoridad francesa de protección de datos (
        <a href="https://www.cnil.fr">cnil.fr</a>).
      </>
    ),
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const l = await langue();
  const x = t(TEXTES, l);
  return metaPage(l, x.titre, x.description, versions("confidentialite"));
}

export default async function Confidentialite() {
  const l = await langue();
  const x = t(TEXTES, l);
  return (
    <>
      <EnTetePage titre={x.titre} />
      <section className="bg-white py-14 sm:py-16">
        <Conteneur className="max-w-3xl">
          <div className="prose-woc">
            {x.fait && (
              <p>
                <em>{x.fait}</em>{" "}
                <Link href={chemin("fr", "confidentialite")} hrefLang="fr" lang="fr">
                  Version française
                </Link>
              </p>
            )}
            <h2>{x.responsable}</h2>
            <p>{x.responsableTexte}</p>

            <h2>{x.collecte}</h2>
            <p>{x.collecteTexte}</p>

            <h2>{x.duree}</h2>
            <p>{x.dureeTexte}</p>

            <h2>{x.destinataires}</h2>
            <p>{x.destinatairesTexte}</p>

            <h2>{x.cookies}</h2>
            <p>{x.cookiesTexte}</p>

            <h2>{x.droits}</h2>
            <p>{x.droitsTexte}</p>
          </div>
        </Conteneur>
      </section>
    </>
  );
}
