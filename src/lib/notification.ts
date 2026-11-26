import "server-only";

// Prévient Florent par e-mail à chaque nouveau message du formulaire de contact (via Brevo).
// Inactif tant que BREVO_API_KEY et NOTIF_EXPEDITEUR ne sont pas renseignés dans Vercel :
// le message reste alors simplement enregistré dans le back-office.

type NouveauMessage = {
  nom: string;
  email: string;
  telephone?: string | null;
  besoin?: string | null;
  source?: string | null;
  objet?: string | null;
  message: string;
};

const echapper = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function notifierNouveauMessage(m: NouveauMessage) {
  const cle = process.env.BREVO_API_KEY;
  const expediteur = process.env.NOTIF_EXPEDITEUR;
  const destinataire = process.env.NOTIF_DESTINATAIRE || "web.online.concept@gmail.com";
  if (!cle || !expediteur) return;

  const lignes: [string, string | null | undefined][] = [
    ["Nom", m.nom],
    ["E-mail", m.email],
    ["Téléphone", m.telephone],
    ["Projet", m.besoin],
    ["Recommandé par", m.source],
    ["Objet", m.objet],
  ];
  const html = `
    <div style="font-family:Arial,sans-serif;font-size:15px;color:#0A1A2F">
      <p style="font-size:18px;font-weight:bold">Nouveau message depuis le site</p>
      <table style="border-collapse:collapse">
        ${lignes
          .filter(([, v]) => v)
          .map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#4A6178">${k}</td><td style="padding:4px 0">${echapper(String(v))}</td></tr>`)
          .join("")}
      </table>
      <p style="margin-top:16px;white-space:pre-line">${echapper(m.message)}</p>
      <p style="margin-top:24px"><a href="https://www.web-online-concept.com/admin/messages">Ouvrir les messages dans le back-office</a></p>
    </div>`;

  try {
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": cle, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: { name: "Site Web Online Concept", email: expediteur },
        to: [{ email: destinataire }],
        replyTo: { email: m.email, name: m.nom },
        subject: `Nouveau message : ${m.besoin ?? "contact"}${m.objet ? ` (${m.objet})` : ""}`,
        htmlContent: html,
      }),
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    // Une notification manquée n'empêche pas l'enregistrement du message
  }
}
