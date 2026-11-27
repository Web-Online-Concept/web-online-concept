// Modèles des e-mails envoyés par le site (HTML compatible messageries : tableaux et styles en ligne).
// Aucune dépendance serveur : ce fichier peut être rendu tel quel pour des aperçus.

export type DonneesMessage = {
  nom: string;
  email: string;
  telephone?: string | null;
  besoin?: string | null;
  source?: string | null;
  objet?: string | null;
  message: string;
  recuLe?: Date;
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

const dateFr = (d: Date) =>
  new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(d);
const heureFr = (d: Date) =>
  new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" }).format(d).replace(":", " h ");

// Texte du visiteur recopié dans l'accusé : tronqué, et sans aucun lien (une adresse saisie par un tiers
// ne doit pas pouvoir servir à faire passer des liens par nos e-mails).
const LIEN = /(?:https?:\/\/|www\.)[^\s<>]+|(?<![@\w.-])[\w-]+(?:\.[\w-]+)*\.(?:com|fr|net|org|info|biz|io|co|me|app|site|online|shop|xyz|ru|cn|top|link|club)\b(?:\/\S*)?/gi;
export const sansLiens = (t: string, max = 700) => {
  // La ponctuation qui suit un lien (parenthèse, point…) est conservée
  const propre = t.replace(LIEN, (lien) => `[lien]${lien.match(/[)\].,;:!?]+$/)?.[0] ?? ""}`).trim();
  return propre.length > max ? `${propre.slice(0, max).trimEnd()}…` : propre;
};

function coquille({ titre, preheader, corps, pied }: { titre: string; preheader: string; corps: string; pied: string }) {
  return `<!DOCTYPE html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml">
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

const entete = (droite = "") => `
<tr><td class="marge" style="background:${C.nuit};padding:26px 36px 24px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td valign="middle"><a href="${URL_SITE}" style="text-decoration:none"><img src="${URL_SITE}/email/logo-fond-sombre.png" width="196" height="42" alt="Web Online Concept" style="display:block;border:0;outline:none"></a></td>
    ${droite ? `<td valign="middle" align="right">${droite}</td>` : ""}
  </tr></table>
</td></tr>
<tr><td style="height:4px;line-height:4px;font-size:0;${DEGRADE}">&nbsp;</td></tr>`;

const bouton = (href: string, libelle: string, plein = true) =>
  `<a href="${href}" style="display:inline-block;font-family:${POLICE};font-size:15px;font-weight:600;line-height:20px;text-decoration:none;border-radius:999px;padding:13px 26px;${
    plein ? `${BULLE_BLEUE};color:#FFFFFF;border:1px solid ${C.bleu}` : `background:#FFFFFF;color:${C.nuit};border:1px solid #C9D5E3`
  }">${libelle}</a>`;

// ——— Accusé de réception envoyé au visiteur ———

export function accuseReception(m: DonneesMessage) {
  const recu = m.recuLe ?? new Date();
  const nom = echapper(m.nom.slice(0, 60));
  const objet = m.objet ? sansLiens(m.objet, 160) : "";
  const texte = sansLiens(m.message);
  const etapes = [
    ["Nous lisons votre demande", "Chaque message est lu en personne, avec attention."],
    ["Nous vous répondons", "Par e-mail, avec nos questions et souvent de premières pistes."],
    ["Nous en parlons ensemble", "Un premier échange, en visio ou par téléphone, si le projet s'y prête."],
  ];

  const corps = `${entete()}
<tr><td class="marge" style="padding:38px 36px 6px;font-family:${POLICE}">
  <p style="margin:0 0 10px;font-size:15px;line-height:22px;color:${C.doux}">Bonjour ${nom},</p>
  <h1 class="titre" style="margin:0;font-size:27px;line-height:34px;font-weight:700;color:${C.nuit};letter-spacing:-0.4px">Votre message est bien arrivé.</h1>
</td></tr>

<tr><td class="marge" style="padding:26px 36px 8px;font-family:${POLICE}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td align="right" style="padding-bottom:4px;font-size:12px;line-height:16px;color:${C.doux}">Vous</td></tr>
    <tr><td align="right">
      <table role="presentation" class="bulle" cellpadding="0" cellspacing="0" border="0" style="max-width:86%"><tr>
        <td style="${BULLE_BLEUE};color:#FFFFFF;border-radius:20px 20px 6px 20px;padding:16px 20px;font-size:15px;line-height:23px">
          ${m.besoin ? `<div style="font-size:12px;line-height:16px;color:#C9D8FF;padding-bottom:8px">${echapper(m.besoin)}</div>` : ""}
          ${objet ? `<div style="font-weight:700;padding-bottom:6px">${echapper(objet)}</div>` : ""}
          <div style="white-space:pre-line">${echapper(texte)}</div>
        </td>
      </tr></table>
    </td></tr>
    <tr><td align="right" style="padding-top:6px;font-size:12px;line-height:16px;color:${C.doux}">Reçu le ${dateFr(recu)} à ${heureFr(recu)} <span style="color:${C.vert};font-weight:700">&#10003;&#10003;</span></td></tr>

    <tr><td style="padding-top:18px">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td valign="top" width="36" style="padding-top:20px"><img src="${URL_SITE}/email/avatar.png" width="36" height="36" alt="" style="display:block;border:0;border-radius:50%"></td>
        <td valign="top" style="padding-left:10px">
          <div style="padding-bottom:4px;font-size:12px;line-height:16px;color:${C.doux}">Web Online Concept</div>
          <table role="presentation" class="bulle" cellpadding="0" cellspacing="0" border="0" style="max-width:440px"><tr>
            <td style="background:${C.ciel};color:${C.nuit};border-radius:6px 20px 20px 20px;padding:14px 18px;font-size:15px;line-height:23px">Merci pour votre message&nbsp;! Nous revenons vers vous personnellement, par e-mail, pour en parler.</td>
          </tr></table>
        </td>
      </tr></table>
    </td></tr>
  </table>
</td></tr>

<tr><td class="marge" style="padding:30px 36px 0;font-family:${POLICE}">
  <div style="height:1px;line-height:1px;font-size:0;background:${C.trait}">&nbsp;</div>
  <h2 style="margin:28px 0 18px;font-size:17px;line-height:24px;font-weight:700;color:${C.nuit}">Et maintenant&nbsp;?</h2>
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
      <strong style="color:${C.nuit}">Une précision, un document à partager&nbsp;?</strong><br>Répondez simplement à cet e-mail&nbsp;: il arrive directement chez nous.
    </td>
  </tr></table>
</td></tr>

<tr><td class="marge" align="left" style="padding:30px 36px 38px">
  ${bouton(`${URL_SITE}/realisations`, "Découvrir nos réalisations")}
</td></tr>`;

  const pied = `
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%">
<tr><td class="marge" align="center" style="padding:26px 36px 8px;font-family:${POLICE}">
  <img src="${URL_SITE}/email/symbole.png" width="40" height="28" alt="" style="display:block;border:0;margin:0 auto 10px">
  <div style="font-size:14px;line-height:20px;font-weight:700;color:${C.nuit}">Web Online Concept</div>
  <div style="font-size:13px;line-height:20px;color:${C.doux}">Sites et applications sur mesure</div>
  <div style="padding-top:12px;font-size:13px;line-height:20px">
    <a href="${URL_SITE}/realisations" style="color:${C.texte};text-decoration:none">Réalisations</a>
    <span style="color:#B7C4D3">&nbsp;&nbsp;/&nbsp;&nbsp;</span>
    <a href="${URL_SITE}/methode" style="color:${C.texte};text-decoration:none">Méthode</a>
    <span style="color:#B7C4D3">&nbsp;&nbsp;/&nbsp;&nbsp;</span>
    <a href="${URL_SITE}/blog" style="color:${C.texte};text-decoration:none">Blog</a>
  </div>
  <p style="margin:16px 0 0;font-size:11px;line-height:17px;color:#8A9BAE">Vous recevez cet e-mail parce que vous nous avez écrit depuis le formulaire de <span style="white-space:nowrap">web-online-concept.com</span>. Vos informations servent uniquement à vous répondre.</p>
</td></tr>
</table>`;

  return {
    sujet: "Nous avons bien reçu votre message",
    html: coquille({
      titre: "Nous avons bien reçu votre message",
      preheader: "Merci pour votre message ! Nous revenons vers vous personnellement, par e-mail, pour en parler.",
      corps,
      pied,
    }),
  };
}

// ——— Alerte envoyée au studio à chaque nouveau message ———
// Conçue pour être citée telle quelle quand Florent y répond depuis Gmail : elle ne contient que la demande
// du visiteur et ses propres coordonnées, rien d'interne (pas de lien vers le back-office ni de consigne).

export function alerteMessage(m: DonneesMessage) {
  const recu = m.recuLe ?? new Date();
  const nom = echapper(m.nom);
  const initiale = echapper((m.nom.trim()[0] ?? "?").toUpperCase());
  const lignes: [string, string][] = [
    ["E-mail", `<a href="mailto:${echapper(m.email)}" style="color:${C.bleu};text-decoration:none">${echapper(m.email)}</a>`],
  ];
  if (m.telephone) lignes.push(["Téléphone", `<a href="tel:${echapper(m.telephone.replace(/[^0-9+]/g, ""))}" style="color:${C.bleu};text-decoration:none">${echapper(m.telephone)}</a>`]);
  if (m.source) lignes.push(["Recommandé par", echapper(m.source)]);

  const pastille = `<span style="display:inline-block;font-family:${POLICE};font-size:12px;line-height:16px;font-weight:600;color:#FFFFFF;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);border-radius:999px;padding:6px 12px"><span style="color:${C.vert}">&#9679;</span>&nbsp; Demande reçue</span>`;

  const corps = `${entete(pastille)}
<tr><td class="marge" style="padding:34px 36px 0;font-family:${POLICE}">
  <p style="margin:0 0 8px;font-size:13px;line-height:18px;color:${C.doux}">Envoyée depuis le formulaire du site, le ${dateFr(recu)} à ${heureFr(recu)}</p>
  <h1 class="titre" style="margin:0 0 12px;font-size:26px;line-height:33px;font-weight:700;color:${C.nuit};letter-spacing:-0.3px">${nom}</h1>
  ${m.besoin ? `<span style="display:inline-block;font-size:13px;line-height:18px;font-weight:600;color:${C.profond};background:#E8EFFF;border-radius:999px;padding:6px 14px">${echapper(m.besoin)}</span>` : ""}
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
    sujet: m.objet || `Demande : ${m.besoin ?? "contact"}`,
    html: coquille({ titre: `Demande de ${m.nom}`, preheader: apercu, corps, pied }),
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
