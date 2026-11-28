// Modèles des e-mails envoyés par le site (HTML compatible messageries : tableaux et styles en ligne).
// Aucune dépendance serveur : ce fichier peut être rendu tel quel pour des aperçus.

import { chemin, LOCALES, type Langue, type Page } from "../i18n/chemins";

export type DonneesMessage = {
  nom: string;
  email: string;
  telephone?: string | null;
  besoin?: string | null;
  source?: string | null;
  objet?: string | null;
  message: string;
  recuLe?: Date;
  // Langue de la page d'où le message a été envoyé : celle de l'accusé de réception (français par défaut)
  langue?: Langue;
  // Type de projet tel que le visiteur l'a lu (dans sa langue) ; besoin reste en français pour le studio
  besoinLibelle?: string | null;
};

export const URL_SITE = "https://www.web-online-concept.com";

const C = {
  bleu: "#1F5EFF",
  profond: "#1638A8",
  cyan: "#00B4D8",
  vert: "#2BD47D",
  nuit: "#0A1A2F",
  ciel: "#F4F7FB",
  texte: "#2C4558",
  doux: "#6B8299",
  trait: "#E3EAF2",
};
const POLICE = "'Sora','Segoe UI',Helvetica,Arial,sans-serif";
const DEGRADE = `background-color:${C.bleu};background-image:linear-gradient(90deg,${C.bleu},${C.cyan} 55%,${C.vert})`;
const BULLE_BLEUE = `background-color:${C.bleu};background-image:linear-gradient(135deg,${C.bleu},${C.profond})`;

export const echapper = (t: string) =>
  t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const dateL = (d: Date, l: Langue = "fr") =>
  new Intl.DateTimeFormat(LOCALES[l], { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(d);
const heureL = (d: Date, l: Langue = "fr") => {
  const h = new Intl.DateTimeFormat(LOCALES[l], { hour: l === "en" ? "numeric" : "2-digit", minute: "2-digit", timeZone: "Europe/Paris" }).format(d);
  return l === "fr" ? h.replace(":", " h ") : h;
};
const lienSite = (l: Langue, page?: Page) => `${URL_SITE}${chemin(l, page)}`;

// Texte du visiteur recopié dans l'accusé : tronqué, et sans aucun lien (une adresse saisie par un tiers
// ne doit pas pouvoir servir à faire passer des liens par nos e-mails).
const LIEN = /(?:https?:\/\/|www\.)[^\s<>]+|(?<![@\w.-])[\w-]+(?:\.[\w-]+)*\.(?:com|fr|net|org|info|biz|io|co|me|app|site|online|shop|xyz|ru|cn|top|link|club)\b(?:\/\S*)?/gi;
const MOT_LIEN: Record<Langue, string> = { fr: "lien", en: "link", es: "enlace" };
export const sansLiens = (t: string, max = 700, l: Langue = "fr") => {
  // La ponctuation qui suit un lien (parenthèse, point…) est conservée
  const propre = t.replace(LIEN, (lien) => `[${MOT_LIEN[l]}]${lien.match(/[)\].,;:!?]+$/)?.[0] ?? ""}`).trim();
  return propre.length > max ? `${propre.slice(0, max).trimEnd()}…` : propre;
};

function coquille({ titre, preheader, corps, pied, l = "fr" }: { titre: string; preheader: string; corps: string; pied: string; l?: Langue }) {
  return `<!DOCTYPE html>
<html lang="${l}" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${echapper(titre)}</title>
<style>
  body{margin:0;padding:0;-webkit-text-size-adjust:100%}
  a{color:${C.bleu}}
  @media (max-width:620px){
    .carte{border-radius:0!important}
    .marge{padding-left:22px!important;padding-right:22px!important}
    .titre{font-size:23px!important;line-height:30px!important}
    .bulle{max-width:100%!important}
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.ciel}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.ciel}">${echapper(preheader)}&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.ciel}">
<tr><td align="center" style="padding:28px 0">
<table role="presentation" class="carte" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background:#FFFFFF;border-radius:22px;overflow:hidden;box-shadow:0 18px 40px -24px rgba(10,26,47,.35)">
${corps}
</table>
${pied}
</td></tr>
</table>
</body>
</html>`;
}

const entete = (droite = "", l: Langue = "fr") => `
<tr><td class="marge" style="background:${C.nuit};padding:26px 36px 24px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td valign="middle"><a href="${lienSite(l)}" style="text-decoration:none"><img src="${URL_SITE}/email/logo-fond-sombre.png" width="196" height="42" alt="Web Online Concept" style="display:block;border:0;outline:none"></a></td>
    ${droite ? `<td valign="middle" align="right">${droite}</td>` : ""}
  </tr></table>
</td></tr>
<tr><td style="height:4px;line-height:4px;font-size:0;${DEGRADE}">&nbsp;</td></tr>`;

const bouton = (href: string, libelle: string, plein = true) =>
  `<a href="${href}" style="display:inline-block;font-family:${POLICE};font-size:15px;font-weight:600;line-height:20px;text-decoration:none;border-radius:999px;padding:13px 26px;${
    plein ? `${BULLE_BLEUE};color:#FFFFFF;border:1px solid ${C.bleu}` : `background:#FFFFFF;color:${C.nuit};border:1px solid #C9D5E3`
  }">${libelle}</a>`;

// ——— Accusé de réception envoyé au visiteur (dans sa langue) ———

const ACCUSE = {
  fr: {
    bonjour: (nom: string) => `Bonjour ${nom},`,
    titre: "Votre message est bien arrivé.",
    vous: "Vous",
    recu: (d: string, h: string) => `Reçu le ${d} à ${h}`,
    merci: "Merci pour votre message&nbsp;! Nous revenons vers vous personnellement, par e-mail, pour en parler.",
    etMaintenant: "Et maintenant&nbsp;?",
    etapes: [
      ["Nous lisons votre demande", "Chaque message est lu en personne, avec attention."],
      ["Nous vous répondons", "Par e-mail, avec nos questions et souvent de premières pistes."],
      ["Nous en parlons ensemble", "Un premier échange, en visio ou par téléphone, si le projet s'y prête."],
    ],
    precision: "Une précision, un document à partager&nbsp;?",
    repondez: "Répondez simplement à cet e-mail&nbsp;: il arrive directement chez nous.",
    decouvrir: "Découvrir nos réalisations",
    accroche: "Sites et applications sur mesure",
    liens: ["Réalisations", "Méthode", "Blog"],
    raison:
      'Vous recevez cet e-mail parce que vous nous avez écrit depuis le formulaire de <span style="white-space:nowrap">web-online-concept.com</span>. Vos informations servent uniquement à vous répondre.',
    sujet: "Nous avons bien reçu votre message",
    preheader: "Merci pour votre message ! Nous revenons vers vous personnellement, par e-mail, pour en parler.",
  },
  en: {
    bonjour: (nom: string) => `Hello ${nom},`,
    titre: "Your message has arrived.",
    vous: "You",
    recu: (d: string, h: string) => `Received on ${d} at ${h} (Paris time)`,
    merci: "Thank you for your message! We'll get back to you personally, by email, to talk it through.",
    etMaintenant: "What happens next?",
    etapes: [
      ["We read your request", "Every message is read personally, with care."],
      ["We reply to you", "By email, with our questions and often some first ideas."],
      ["We talk it through together", "A first conversation, by video call or phone, if the project calls for it."],
    ],
    precision: "Something to add, a document to share?",
    repondez: "Simply reply to this email: it comes straight to us.",
    decouvrir: "Discover our work",
    accroche: "Custom websites and apps",
    liens: ["Work", "Method", "Blog"],
    raison:
      'You are receiving this email because you wrote to us using the form on <span style="white-space:nowrap">web-online-concept.com</span>. Your information is only used to reply to you.',
    sujet: "We've received your message",
    preheader: "Thank you for your message! We'll get back to you personally, by email, to talk it through.",
  },
  es: {
    bonjour: (nom: string) => `Hola, ${nom}:`,
    titre: "Su mensaje ha llegado correctamente.",
    vous: "Usted",
    recu: (d: string, h: string) => `Recibido el ${d} a las ${h} (hora de París)`,
    merci: "¡Gracias por su mensaje! Le responderemos personalmente, por correo electrónico, para hablarlo.",
    etMaintenant: "¿Y ahora?",
    etapes: [
      ["Leemos su solicitud", "Cada mensaje se lee personalmente, con atención."],
      ["Le respondemos", "Por correo electrónico, con nuestras preguntas y a menudo con primeras ideas."],
      ["Lo hablamos juntos", "Una primera conversación, por videollamada o por teléfono, si el proyecto lo requiere."],
    ],
    precision: "¿Una precisión, un documento que compartir?",
    repondez: "Responda simplemente a este correo: nos llega directamente.",
    decouvrir: "Descubrir nuestros proyectos",
    accroche: "Sitios y aplicaciones a medida",
    liens: ["Proyectos", "Método", "Blog"],
    raison:
      'Recibe este correo porque nos escribió desde el formulario de <span style="white-space:nowrap">web-online-concept.com</span>. Sus datos solo sirven para responderle.',
    sujet: "Hemos recibido su mensaje",
    preheader: "¡Gracias por su mensaje! Le responderemos personalmente, por correo electrónico, para hablarlo.",
  },
} satisfies Record<Langue, unknown>;

export function accuseReception(m: DonneesMessage) {
  const l = m.langue ?? "fr";
  const x = ACCUSE[l];
  const recu = m.recuLe ?? new Date();
  const nom = echapper(m.nom.slice(0, 60));
  const objet = m.objet ? sansLiens(m.objet, 160, l) : "";
  const texte = sansLiens(m.message, 700, l);
  const besoin = m.besoinLibelle ?? m.besoin;
  const etapes = x.etapes;

  const corps = `${entete("", l)}
<tr><td class="marge" style="padding:38px 36px 6px;font-family:${POLICE}">
  <p style="margin:0 0 10px;font-size:15px;line-height:22px;color:${C.doux}">${x.bonjour(nom)}</p>
  <h1 class="titre" style="margin:0;font-size:27px;line-height:34px;font-weight:700;color:${C.nuit};letter-spacing:-0.4px">${x.titre}</h1>
</td></tr>

<tr><td class="marge" style="padding:26px 36px 8px;font-family:${POLICE}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td align="right" style="padding-bottom:4px;font-size:12px;line-height:16px;color:${C.doux}">${x.vous}</td></tr>
    <tr><td align="right">
      <table role="presentation" class="bulle" cellpadding="0" cellspacing="0" border="0" style="max-width:86%"><tr>
        <td style="${BULLE_BLEUE};color:#FFFFFF;border-radius:20px 20px 6px 20px;padding:16px 20px;font-size:15px;line-height:23px">
          ${besoin ? `<div style="font-size:12px;line-height:16px;color:#C9D8FF;padding-bottom:8px">${echapper(besoin)}</div>` : ""}
          ${objet ? `<div style="font-weight:700;padding-bottom:6px">${echapper(objet)}</div>` : ""}
          <div style="white-space:pre-line">${echapper(texte)}</div>
        </td>
      </tr></table>
    </td></tr>
    <tr><td align="right" style="padding-top:6px;font-size:12px;line-height:16px;color:${C.doux}">${x.recu(dateL(recu, l), heureL(recu, l))} <span style="color:${C.vert};font-weight:700">&#10003;&#10003;</span></td></tr>

    <tr><td style="padding-top:18px">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td valign="top" width="36" style="padding-top:20px"><img src="${URL_SITE}/email/avatar.png" width="36" height="36" alt="" style="display:block;border:0;border-radius:50%"></td>
        <td valign="top" style="padding-left:10px">
          <div style="padding-bottom:4px;font-size:12px;line-height:16px;color:${C.doux}">Web Online Concept</div>
          <table role="presentation" class="bulle" cellpadding="0" cellspacing="0" border="0" style="max-width:440px"><tr>
            <td style="background:${C.ciel};color:${C.nuit};border-radius:6px 20px 20px 20px;padding:14px 18px;font-size:15px;line-height:23px">${x.merci}</td>
          </tr></table>
        </td>
      </tr></table>
    </td></tr>
  </table>
</td></tr>

<tr><td class="marge" style="padding:30px 36px 0;font-family:${POLICE}">
  <div style="height:1px;line-height:1px;font-size:0;background:${C.trait}">&nbsp;</div>
  <h2 style="margin:28px 0 18px;font-size:17px;line-height:24px;font-weight:700;color:${C.nuit}">${x.etMaintenant}</h2>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    ${etapes
      .map(
        ([t, d], i) => `<tr>
      <td valign="top" width="34" style="padding-bottom:${i < 2 ? 18 : 0}px">
        <div style="width:30px;height:30px;line-height:30px;border-radius:50%;text-align:center;font-size:14px;font-weight:700;color:#FFFFFF;${BULLE_BLEUE}">${i + 1}</div>
      </td>
      <td valign="top" style="padding:4px 0 ${i < 2 ? 18 : 0}px 12px">
        <div style="font-size:15px;line-height:21px;font-weight:600;color:${C.nuit}">${t}</div>
        <div style="font-size:14px;line-height:21px;color:${C.texte}">${d}</div>
      </td>
    </tr>`,
      )
      .join("")}
  </table>
</td></tr>

<tr><td class="marge" style="padding:28px 36px 0;font-family:${POLICE}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td style="background:${C.ciel};border-radius:16px;padding:16px 20px;font-size:14px;line-height:21px;color:${C.texte}">
      <strong style="color:${C.nuit}">${x.precision}</strong><br>${x.repondez}
    </td>
  </tr></table>
</td></tr>

<tr><td class="marge" align="left" style="padding:30px 36px 38px">
  ${bouton(lienSite(l, "realisations"), x.decouvrir)}
</td></tr>`;

  const pied = `
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%">
<tr><td class="marge" align="center" style="padding:26px 36px 8px;font-family:${POLICE}">
  <img src="${URL_SITE}/email/symbole.png" width="40" height="28" alt="" style="display:block;border:0;margin:0 auto 10px">
  <div style="font-size:14px;line-height:20px;font-weight:700;color:${C.nuit}">Web Online Concept</div>
  <div style="font-size:13px;line-height:20px;color:${C.doux}">${x.accroche}</div>
  <div style="padding-top:12px;font-size:13px;line-height:20px">
    <a href="${lienSite(l, "realisations")}" style="color:${C.texte};text-decoration:none">${x.liens[0]}</a>
    <span style="color:#B7C4D3">&nbsp;&nbsp;/&nbsp;&nbsp;</span>
    <a href="${lienSite(l, "methode")}" style="color:${C.texte};text-decoration:none">${x.liens[1]}</a>
    <span style="color:#B7C4D3">&nbsp;&nbsp;/&nbsp;&nbsp;</span>
    <a href="${lienSite(l, "blog")}" style="color:${C.texte};text-decoration:none">${x.liens[2]}</a>
  </div>
  <p style="margin:16px 0 0;font-size:11px;line-height:17px;color:#8A9BAE">${x.raison}</p>
</td></tr>
</table>`;

  return {
    sujet: x.sujet,
    html: coquille({ titre: x.sujet, preheader: x.preheader, corps, pied, l }),
  };
}

// ——— Alerte envoyée au studio à chaque nouveau message ———
// Conçue pour être citée telle quelle quand Florent y répond depuis Gmail : elle ne contient que la demande
// du visiteur et ses propres coordonnées, rien d'interne (pas de lien vers le back-office ni de consigne).

// Dans la langue du visiteur : citée dans la réponse, elle doit lui rester lisible (Florent répond alors dans cette langue).
const ALERTE = {
  fr: {
    email: "E-mail",
    telephone: "Téléphone",
    source: "Recommandé par",
    pastille: "Demande reçue",
    envoyee: (d: string, h: string) => `Envoyée depuis le formulaire du site, le ${d} à ${h}`,
    sujet: (b: string) => `Demande : ${b}`,
    titre: (n: string) => `Demande de ${n}`,
  },
  en: {
    email: "Email",
    telephone: "Phone",
    source: "Referred by",
    pastille: "Request received",
    envoyee: (d: string, h: string) => `Sent from the website form on ${d} at ${h} (Paris time)`,
    sujet: (b: string) => `Request: ${b}`,
    titre: (n: string) => `Request from ${n}`,
  },
  es: {
    email: "Correo electrónico",
    telephone: "Teléfono",
    source: "Recomendado por",
    pastille: "Solicitud recibida",
    envoyee: (d: string, h: string) => `Enviada desde el formulario del sitio el ${d} a las ${h} (hora de París)`,
    sujet: (b: string) => `Solicitud: ${b}`,
    titre: (n: string) => `Solicitud de ${n}`,
  },
} satisfies Record<Langue, unknown>;

export function alerteMessage(m: DonneesMessage) {
  const l = m.langue ?? "fr";
  const x = ALERTE[l];
  const recu = m.recuLe ?? new Date();
  const nom = echapper(m.nom);
  const besoin = m.besoinLibelle ?? m.besoin;
  const initiale = echapper((m.nom.trim()[0] ?? "?").toUpperCase());
  const lignes: [string, string][] = [
    [x.email, `<a href="mailto:${echapper(m.email)}" style="color:${C.bleu};text-decoration:none">${echapper(m.email)}</a>`],
  ];
  if (m.telephone) lignes.push([x.telephone, `<a href="tel:${echapper(m.telephone.replace(/[^0-9+]/g, ""))}" style="color:${C.bleu};text-decoration:none">${echapper(m.telephone)}</a>`]);
  if (m.source) lignes.push([x.source, echapper(m.source)]);

  const pastille = `<span style="display:inline-block;font-family:${POLICE};font-size:12px;line-height:16px;font-weight:600;color:#FFFFFF;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);border-radius:999px;padding:6px 12px"><span style="color:${C.vert}">&#9679;</span>&nbsp; ${x.pastille}</span>`;

  const corps = `${entete(pastille, l)}
<tr><td class="marge" style="padding:34px 36px 0;font-family:${POLICE}">
  <p style="margin:0 0 8px;font-size:13px;line-height:18px;color:${C.doux}">${x.envoyee(dateL(recu, l), heureL(recu, l))}</p>
  <h1 class="titre" style="margin:0 0 12px;font-size:26px;line-height:33px;font-weight:700;color:${C.nuit};letter-spacing:-0.3px">${nom}</h1>
  ${besoin ? `<span style="display:inline-block;font-size:13px;line-height:18px;font-weight:600;color:${C.profond};background:#E8EFFF;border-radius:999px;padding:6px 14px">${echapper(besoin)}</span>` : ""}
</td></tr>

<tr><td class="marge" style="padding:26px 36px 0;font-family:${POLICE}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td valign="top" width="36" style="padding-top:2px">
      <div style="width:36px;height:36px;line-height:36px;border-radius:50%;text-align:center;font-size:15px;font-weight:700;color:#FFFFFF;${BULLE_BLEUE}">${initiale}</div>
    </td>
    <td valign="top" style="padding-left:10px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="background:${C.ciel};border-radius:6px 20px 20px 20px;padding:16px 20px;font-size:15px;line-height:23px;color:${C.nuit}">
          ${m.objet ? `<div style="font-weight:700;padding-bottom:6px">${echapper(m.objet)}</div>` : ""}
          <div style="white-space:pre-line;color:${C.texte}">${echapper(m.message)}</div>
        </td>
      </tr></table>
    </td>
  </tr></table>
</td></tr>

<tr><td class="marge" style="padding:24px 36px 0;font-family:${POLICE}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${C.trait};border-radius:16px">
    ${lignes
      .map(
        ([k, v], i) => `<tr>
      <td width="128" style="padding:13px 0 13px 20px;font-size:13px;line-height:19px;color:${C.doux};${i ? `border-top:1px solid ${C.trait}` : ""}">${k}</td>
      <td style="padding:13px 20px 13px 0;font-size:14px;line-height:19px;color:${C.nuit};${i ? `border-top:1px solid ${C.trait}` : ""}">${v}</td>
    </tr>`,
      )
      .join("")}
  </table>
</td></tr>

<tr><td style="height:36px;line-height:36px;font-size:0">&nbsp;</td></tr>`;

  const pied = "";

  const apercu = m.message.replace(/\s+/g, " ").slice(0, 110);
  return {
    // Sujet pensé pour la réponse : le visiteur verra « Re: <son objet> »
    sujet: m.objet || x.sujet(besoin ?? "contact"),
    html: coquille({ titre: x.titre(m.nom), preheader: apercu, corps, pied, l }),
  };
}

// ——— Signature Gmail pour contact@ (à coller dans les paramètres de Gmail) ———

export function signature() {
  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${POLICE};border-collapse:collapse">
<tr>
  <td valign="middle" style="padding-right:16px"><a href="${URL_SITE}" style="text-decoration:none"><img src="${URL_SITE}/email/symbole.png" width="54" height="38" alt="Web Online Concept" style="display:block;border:0"></a></td>
  <td valign="middle" style="width:3px;${DEGRADE};background-image:linear-gradient(180deg,${C.bleu},${C.cyan} 55%,${C.vert})">&nbsp;</td>
  <td valign="middle" style="padding-left:16px">
    <div style="font-size:15px;line-height:20px;font-weight:700;color:${C.nuit}">Web Online Concept</div>
    <div style="font-size:13px;line-height:19px;color:#0B8E9E">Sites et applications sur mesure</div>
    <div style="padding-top:4px;font-size:13px;line-height:19px"><a href="mailto:contact@web-online-concept.com" style="color:${C.texte};text-decoration:none">contact@web-online-concept.com</a></div>
    <div style="font-size:13px;line-height:19px"><a href="${URL_SITE}" style="color:${C.bleu};text-decoration:none;font-weight:600">web-online-concept.com</a></div>
  </td>
</tr>
</table>`;
}

// ——— Lien de connexion au back-office (modèle « Magic Link » de Supabase Auth) ———
// Ce HTML se colle dans Supabase : Authentication > Emails > Magic Link. Supabase y remplace
// {{ .ConfirmationURL }} par le lien de connexion (usage unique, durée limitée, même navigateur).

export const SUJET_LIEN_CONNEXION = "Votre lien de connexion au back-office";

export function modeleLienConnexion() {
  const lien = "{{ .ConfirmationURL }}";
  const corps = `${entete(`<span style="font-family:${POLICE};font-size:12px;line-height:16px;font-weight:600;color:#9FB2C8">Back-office</span>`)}

<tr><td class="marge" style="padding:38px 36px 6px;font-family:${POLICE}">
  <div style="font-size:15px;line-height:22px;color:${C.doux}">Bonjour Florent,</div>
  <h1 class="titre" style="margin:8px 0 0;font-size:26px;line-height:33px;font-weight:700;letter-spacing:-0.3px;color:${C.nuit}">Votre lien de connexion</h1>
  <p style="margin:14px 0 0;font-size:16px;line-height:25px;color:${C.texte}">Un clic sur le bouton ci-dessous et vous êtes connecté au back‑office, sans mot de passe.</p>
</td></tr>

<tr><td class="marge" align="left" style="padding:26px 36px 8px">
  ${bouton(lien, "Ouvrir le back-office")}
</td></tr>

<tr><td class="marge" style="padding:22px 36px 0;font-family:${POLICE}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.ciel};border-radius:14px"><tr>
    <td style="padding:16px 18px;font-size:14px;line-height:22px;color:${C.texte}">
      <strong style="color:${C.nuit}">Un lien à usage unique.</strong> Il ne fonctionne qu'une fois, pendant une durée limitée, et uniquement dans le navigateur où vous l'avez demandé.
    </td>
  </tr></table>
</td></tr>

<tr><td class="marge" style="padding:22px 36px 34px;font-family:${POLICE}">
  <p style="margin:0;font-size:13px;line-height:20px;color:${C.doux}">Vous n'avez rien demandé&nbsp;? Ignorez cet e-mail&nbsp;: sans ce lien, personne ne peut se connecter.</p>
  <p style="margin:14px 0 0;font-size:12px;line-height:18px;color:#8A9BAE">Le bouton ne fonctionne pas&nbsp;? Copiez cette adresse dans le navigateur&nbsp;:<br><a href="${lien}" style="color:${C.bleu};word-break:break-all">${lien}</a></p>
</td></tr>`;

  const pied = `
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%">
<tr><td class="marge" align="center" style="padding:24px 36px 8px;font-family:${POLICE}">
  <img src="${URL_SITE}/email/symbole.png" width="40" height="28" alt="" style="display:block;border:0;margin:0 auto 10px">
  <div style="font-size:13px;line-height:20px;color:${C.doux}">Web Online Concept, espace d'administration</div>
</td></tr>
</table>`;

  return coquille({ titre: SUJET_LIEN_CONNEXION, preheader: "Un clic pour ouvrir le back-office, sans mot de passe.", corps, pied });
}

// ——— Alerte au studio : un devis vient d'être accepté en ligne ———

export type DonneesAcceptation = {
  numero: string;
  client: string;
  signataire: string;
  objet?: string | null;
  total: number;
  particulier: boolean;
  debutAnticipe: boolean;
  accepteLe: Date;
  lienAdmin: string;
};

export function alerteDevisAccepte(a: DonneesAcceptation) {
  const sujet = `Devis ${a.numero} accepté par ${a.signataire}`;
  const montant = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(a.total);
  const lignes: [string, string][] = [
    ["Client", echapper(a.client)],
    ["Accepté par", echapper(a.signataire)],
    ["Le", `${dateL(a.accepteLe)} à ${heureL(a.accepteLe)}`],
    ...(a.objet ? ([["Objet", echapper(a.objet)]] as [string, string][]) : []),
    ["Montant", `<strong style="color:${C.nuit}">${montant}</strong>`],
  ];
  const delai = a.particulier
    ? a.debutAnticipe
      ? "Client particulier : il a demandé que les travaux commencent sans attendre la fin de son délai de rétractation de 14 jours."
      : "Client particulier : délai de rétractation de 14 jours. Il n'a pas demandé de démarrage anticipé : les travaux commencent après ce délai."
    : null;

  const corps = `${entete()}

<tr><td class="marge" style="padding:36px 36px 8px;font-family:${POLICE}">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
    <td valign="middle" style="width:44px;height:44px;border-radius:50%;background:#E3F8EC;text-align:center;font-size:22px;line-height:44px;color:#0E7A45">&#10003;</td>
    <td valign="middle" style="padding-left:14px;font-size:14px;line-height:20px;color:${C.doux}">Devis ${echapper(a.numero)}</td>
  </tr></table>
  <h1 class="titre" style="margin:16px 0 0;font-size:26px;line-height:33px;font-weight:700;letter-spacing:-0.3px;color:${C.nuit}">Devis accepté en ligne</h1>
</td></tr>

<tr><td class="marge" style="padding:18px 36px 0;font-family:${POLICE}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.ciel};border-radius:14px">
    ${lignes
      .map(
        ([l, v], i) => `<tr>
      <td style="padding:${i ? 8 : 16}px 0 ${i === lignes.length - 1 ? 16 : 0}px 18px;font-size:13px;line-height:20px;color:${C.doux};width:110px" valign="top">${l}</td>
      <td style="padding:${i ? 8 : 16}px 18px ${i === lignes.length - 1 ? 16 : 0}px 0;font-size:15px;line-height:21px;color:${C.texte}" valign="top">${v}</td>
    </tr>`,
      )
      .join("")}
  </table>
</td></tr>
${delai ? `<tr><td class="marge" style="padding:16px 36px 0;font-family:${POLICE};font-size:14px;line-height:22px;color:${C.texte}">${delai}</td></tr>` : ""}

<tr><td class="marge" align="left" style="padding:26px 36px 36px">
  ${bouton(a.lienAdmin, "Ouvrir le devis dans le back-office")}
</td></tr>`;

  const pied = `
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%">
<tr><td class="marge" align="center" style="padding:24px 36px 8px;font-family:${POLICE}">
  <img src="${URL_SITE}/email/symbole.png" width="40" height="28" alt="" style="display:block;border:0;margin:0 auto 10px">
  <div style="font-size:13px;line-height:20px;color:${C.doux}">Web Online Concept, espace d'administration</div>
</td></tr>
</table>`;

  return { sujet, html: coquille({ titre: sujet, preheader: `${a.client}, ${montant}. Vous pouvez lancer le projet.`, corps, pied }) };
}
