import "server-only";
import { accuseReception, alerteMessage, type DonneesMessage } from "@/lib/emails/modeles";

// E-mails envoyés à chaque nouveau message du formulaire de contact (via l'API Brevo) :
// - une alerte au studio, à contact@ (redirigé vers Gmail) : y répondre part directement au visiteur, depuis contact@ ;
// - un accusé de réception au visiteur (si demandé par l'appelant).
// Les deux partent de site@ : Brevo ajoute d'office un lien « Se désabonner » à ses e-mails, et un clic dessus
// bloque l'expéditeur pour ce destinataire. Ainsi, contact@ (réponses écrites depuis Gmail) n'est jamais bloqué.
// Inactif tant que BREVO_API_KEY et NOTIF_EXPEDITEUR ne sont pas renseignés dans Vercel :
// le message reste alors simplement enregistré dans le back-office.

const CONTACT = "contact@web-online-concept.com";
const ALERTES = "site@web-online-concept.com";

async function envoyer(cle: string, quoi: string, corps: Record<string, unknown>) {
  try {
    const reponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": cle, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(corps),
      signal: AbortSignal.timeout(8000),
    });
    // Un envoi manqué n'empêche pas l'enregistrement du message, mais on le trace dans les logs Vercel
    if (!reponse.ok) console.error(`[notification] ${quoi} : Brevo a refusé l'envoi (${reponse.status}) : ${(await reponse.text()).slice(0, 300)}`);
  } catch (e) {
    console.error(`[notification] ${quoi} : Brevo injoignable :`, e instanceof Error ? e.message : e);
  }
}

export async function notifierNouveauMessage(m: DonneesMessage, { accuse }: { accuse: boolean }) {
  const cle = process.env.BREVO_API_KEY;
  const expediteur = process.env.NOTIF_EXPEDITEUR;
  if (!cle || !expediteur) return;
  const destinataire = process.env.NOTIF_DESTINATAIRE || CONTACT;

  const site = process.env.NOTIF_EXPEDITEUR_ALERTES || ALERTES;
  const alerte = alerteMessage(m);
  const envois = [
    envoyer(cle, "alerte", {
      sender: { name: "Formulaire du site", email: site },
      to: [{ email: destinataire }],
      replyTo: { email: m.email, name: m.nom },
      subject: alerte.sujet,
      htmlContent: alerte.html,
    }),
  ];

  if (accuse) {
    const reponse = accuseReception(m);
    envois.push(
      envoyer(cle, "accusé de réception", {
        sender: { name: "Web Online Concept", email: site },
        to: [{ email: m.email, name: m.nom.slice(0, 60) }],
        replyTo: { email: expediteur, name: "Web Online Concept" },
        subject: reponse.sujet,
        htmlContent: reponse.html,
      }),
    );
  }
  await Promise.all(envois);
}
