import "server-only";
import fontkit from "@pdf-lib/fontkit";
import { degrees, PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import QRCode from "qrcode";
import { CONDITIONS, RETRACTATION, TITRE_CONDITIONS } from "@/lib/conditions";
import { LOGO_PNG, SORA_REGULAR, SORA_SEMIBOLD } from "./ressources";

export type Partie = {
  nom?: string;
  raison_sociale?: string;
  nom_commercial?: string;
  adresse?: string | null;
  code_postal?: string | null;
  ville?: string | null;
  pays?: string | null;
  siren?: string | null;
  siret?: string | null;
  tva_intra?: string | null;
  email?: string | null;
  telephone?: string | null;
  iban?: string | null;
  bic?: string | null;
  mention_tva?: string;
  conditions_paiement?: string;
  penalites_retard?: string;
  contact_nom?: string | null;
  type?: string | null; // client : « entreprise » ou « particulier »
};

export type LignePdf = {
  designation: string;
  description: string | null;
  quantite: number;
  unite: string | null;
  prix_unitaire: number;
  total_ht: number;
};

export type DocumentPdf = {
  genre: "facture" | "avoir" | "devis";
  numero: string | null;
  objet: string;
  date_emission: string | null;
  date_echeance?: string | null; // facture
  date_validite?: string | null; // devis
  reference_origine?: string | null; // avoir : numéro de la facture d'origine
  total_ht: number;
  total_tva: number;
  total_ttc: number;
  notes?: string | null;
  emetteur: Partie;
  client: Partie;
  lien_acceptation?: string | null;
  accepte?: { le: string; par: string; debut_anticipe?: boolean } | null;
};

const NUIT = rgb(10 / 255, 26 / 255, 47 / 255);
const GRIS = rgb(74 / 255, 97 / 255, 120 / 255);
const FILET = rgb(220 / 255, 227 / 255, 236 / 255);
const CIEL = rgb(244 / 255, 247 / 255, 251 / 255);
const BLEU = rgb(31 / 255, 94 / 255, 255 / 255);

const euros = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n).replace(/ /g, " ").replace(/ /g, " ");
const dateFr = (iso?: string | null) =>
  iso ? new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }).format(new Date(iso + "T00:00:00Z")) : "";
// IBAN par groupes de quatre caractères, titulaire du compte = dénomination sans la mention « EI »
const ibanLisible = (iban: string) => iban.replace(/\s+/g, "").replace(/(.{4})/g, "$1 ").trim();
const titulaire = (e: Partie) => (e.raison_sociale ?? "").replace(/\s+(EI|E\.I\.)$/i, "").trim();

// QR code de virement SEPA (norme EPC069-12, « GiroCode ») : bénéficiaire, IBAN, montant et référence préremplis
function qrVirement(e: Partie, doc: DocumentPdf) {
  if (!e.iban || !(doc.total_ttc > 0) || doc.total_ttc > 999999999.99) return null;
  const charge = [
    "BCD",
    "002",
    "1",
    "SCT",
    (e.bic ?? "").replace(/\s+/g, ""),
    titulaire(e).slice(0, 70),
    e.iban.replace(/\s+/g, "").toUpperCase(),
    `EUR${doc.total_ttc.toFixed(2)}`,
    "",
    "",
    (doc.numero ?? "").slice(0, 140),
  ].join("\n");
  const { modules } = QRCode.create(charge, { errorCorrectionLevel: "M" });
  return { size: modules.size, data: modules.data };
}

const qte = (n: number) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 3 }).format(n).replace(/ /g, " ");

function decouper(texte: string, police: PDFFont, taille: number, largeur: number): string[] {
  const lignes: string[] = [];
  for (const para of texte.split(/\n/)) {
    // Un mot plus large que la colonne (une adresse web, par exemple) est coupé où il faut
    const mots = para
      .split(/\s+/)
      .filter(Boolean)
      .flatMap((mot) => {
        if (police.widthOfTextAtSize(mot, taille) <= largeur) return [mot];
        const morceaux: string[] = [];
        let m = "";
        for (const ch of mot) {
          if (police.widthOfTextAtSize(m + ch, taille) > largeur && m) {
            morceaux.push(m);
            m = ch;
          } else m += ch;
        }
        return m ? [...morceaux, m] : morceaux;
      });
    let courante = "";
    for (const mot of mots) {
      const essai = courante ? `${courante} ${mot}` : mot;
      if (police.widthOfTextAtSize(essai, taille) <= largeur) courante = essai;
      else {
        if (courante) lignes.push(courante);
        courante = mot;
      }
    }
    lignes.push(courante);
  }
  return lignes;
}

export async function genererPdf(doc: DocumentPdf, lignes: LignePdf[], brouillon: boolean): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const reg = await pdf.embedFont(Buffer.from(SORA_REGULAR, "base64"), { subset: true });
  const gras = await pdf.embedFont(Buffer.from(SORA_SEMIBOLD, "base64"), { subset: true });
  const logo = await pdf.embedPng(Buffer.from(LOGO_PNG, "base64"));

  const titre = doc.genre === "facture" ? "Facture" : doc.genre === "avoir" ? "Avoir" : "Devis";
  pdf.setTitle(`${titre} ${doc.numero ?? "brouillon"}`);
  pdf.setAuthor(doc.emetteur.nom_commercial ?? "Web Online Concept");
  pdf.setCreator("Web Online Concept");

  const L = 595.28;
  const H = 841.89;
  const M = 48;
  const pages: PDFPage[] = [];
  let page = pdf.addPage([L, H]);
  pages.push(page);
  let y = H - M;

  const texte = (t: string, x: number, yy: number, taille = 9.5, police = reg, couleur = NUIT) =>
    page.drawText(t, { x, y: yy, size: taille, font: police, color: couleur });
  const aDroite = (t: string, xDroite: number, yy: number, taille = 9.5, police = reg, couleur = NUIT) =>
    texte(t, xDroite - police.widthOfTextAtSize(t, taille), yy, taille, police, couleur);

  // En-tête
  const lw = 170;
  const lh = (logo.height / logo.width) * lw;
  page.drawImage(logo, { x: M - 6, y: y - lh + 10, width: lw, height: lh });
  aDroite(titre.toUpperCase(), L - M, y - 14, 20, gras);
  let yd = y - 34;
  if (doc.numero) {
    aDroite(`N° ${doc.numero}`, L - M, yd, 10.5, gras);
    yd -= 15;
  }
  if (doc.date_emission) {
    aDroite(`Date : ${dateFr(doc.date_emission)}`, L - M, yd, 9.5, reg, GRIS);
    yd -= 13;
  }
  if (doc.genre === "facture" && doc.date_echeance) {
    aDroite(`Échéance : ${dateFr(doc.date_echeance)}`, L - M, yd, 9.5, reg, GRIS);
    yd -= 13;
  }
  if (doc.genre === "devis" && doc.date_validite) {
    aDroite(`Valable jusqu'au : ${dateFr(doc.date_validite)}`, L - M, yd, 9.5, reg, GRIS);
    yd -= 13;
  }
  if (doc.genre === "avoir" && doc.reference_origine) {
    aDroite(`Sur facture ${doc.reference_origine}`, L - M, yd, 9.5, reg, GRIS);
    yd -= 13;
  }
  y = Math.min(y - lh - 6, yd) - 14;

  // Émetteur et client
  const e = doc.emetteur;
  const c = doc.client;
  const colG = M;
  const colD = L / 2 + 10;
  const largeurBloc = L / 2 - M - 10;
  let yg = y;
  texte(e.raison_sociale ?? "", colG, yg, 10, gras);
  yg -= 13;
  for (const l of [
    e.nom_commercial,
    e.adresse,
    [e.code_postal, e.ville].filter(Boolean).join(" "),
    e.siret ? `SIRET ${e.siret}` : null,
    e.email,
    e.telephone,
  ]) {
    if (!l) continue;
    texte(l, colG, yg, 9, reg, GRIS);
    yg -= 12;
  }

  const lignesClient = [
    c.contact_nom ? `À l'attention de ${c.contact_nom}` : null,
    c.adresse,
    [c.code_postal, c.ville].filter(Boolean).join(" "),
    c.pays && c.pays !== "France" ? c.pays : null,
    c.siren ? `SIREN ${c.siren}` : null,
    c.tva_intra ? `TVA ${c.tva_intra}` : null,
  ].filter(Boolean) as string[];
  const hClient = 26 + lignesClient.length * 12 + 10;
  page.drawRectangle({ x: colD - 12, y: y - hClient + 14, width: largeurBloc + 12, height: hClient, color: CIEL });
  let yc = y;
  texte("Client", colD, yc, 8, reg, GRIS);
  yc -= 13;
  for (const l of decouper(c.nom ?? "", gras, 10, largeurBloc - 6)) {
    texte(l, colD, yc, 10, gras);
    yc -= 13;
  }
  for (const l of lignesClient) {
    texte(l, colD, yc, 9, reg, NUIT);
    yc -= 12;
  }
  y = Math.min(yg, y - hClient + 14) - 22;

  if (doc.objet) {
    texte("Objet :", M, y, 10, gras);
    const lo = decouper(doc.objet, reg, 10, L - 2 * M - 50);
    lo.forEach((l, i) => texte(l, M + 46, y - i * 13, 10));
    y -= lo.length * 13 + 12;
  }

  // Tableau des lignes
  const xQte = L - M - 190;
  const xPu = L - M - 95;
  const xTot = L - M;
  const largeurDesignation = xQte - M - 50;
  const enTeteTableau = () => {
    page.drawRectangle({ x: M, y: y - 6, width: L - 2 * M, height: 22, color: NUIT });
    texte("Désignation", M + 8, y, 9, gras, rgb(1, 1, 1));
    aDroite("Quantité", xQte + 8, y, 9, gras, rgb(1, 1, 1));
    aDroite("Prix unitaire HT", xPu + 8, y, 9, gras, rgb(1, 1, 1));
    aDroite("Total HT", xTot - 8, y, 9, gras, rgb(1, 1, 1));
    y -= 24;
  };
  const nouvellePage = () => {
    page = pdf.addPage([L, H]);
    pages.push(page);
    y = H - M;
  };
  enTeteTableau();

  for (const l of lignes) {
    const dl = decouper(l.designation, gras, 9.5, largeurDesignation);
    const desc = l.description ? decouper(l.description, reg, 8.5, largeurDesignation) : [];
    // Hauteur du texte de la ligne, puis un espace avant le filet de séparation et la ligne suivante
    const contenu = dl.length * 12.5 + desc.length * 11;
    const hauteur = contenu + 16;
    if (y - hauteur < 150) {
      nouvellePage();
      enTeteTableau();
    }
    let yl = y;
    dl.forEach((t) => {
      texte(t, M + 8, yl, 9.5, gras);
      yl -= 12.5;
    });
    desc.forEach((t) => {
      texte(t, M + 8, yl, 8.5, reg, GRIS);
      yl -= 11;
    });
    aDroite(`${qte(l.quantite)}${l.unite ? " " + l.unite : ""}`, xQte + 8, y, 9.5);
    aDroite(euros(l.prix_unitaire), xPu + 8, y, 9.5);
    aDroite(euros(l.total_ht), xTot - 8, y, 9.5, gras);
    y -= hauteur;
    page.drawLine({ start: { x: M, y: y + 17 }, end: { x: L - M, y: y + 17 }, thickness: 0.6, color: FILET });
  }

  // Totaux, à droite
  if (y < 230) nouvellePage();
  y -= 4;
  const xLib = L - M - 220;
  const ligneTotal = (lib: string, val: string, fort = false) => {
    texte(lib, xLib, y, fort ? 11 : 9.5, fort ? gras : reg, fort ? NUIT : GRIS);
    aDroite(val, L - M - 8, y, fort ? 11 : 9.5, fort ? gras : reg);
    y -= fort ? 20 : 15;
  };
  ligneTotal("Total HT", euros(doc.total_ht));
  if (doc.total_tva !== 0) ligneTotal("TVA", euros(doc.total_tva));
  else ligneTotal("TVA", "0,00 €");
  y -= 8;
  page.drawRectangle({ x: xLib - 10, y: y - 8, width: L - M - xLib + 10, height: 26, color: CIEL });
  ligneTotal(doc.genre === "devis" ? "Total" : doc.genre === "avoir" ? "Montant de l'avoir" : "Net à payer", euros(doc.total_ttc), true);
  y -= 10;

  // Facture : encadré de règlement par virement, avec un QR code que l'application bancaire du client sait lire
  if (doc.genre === "facture" && e.iban) {
    const lignesR: [string, string][] = [
      ["Titulaire", titulaire(e)],
      ["IBAN", ibanLisible(e.iban)],
      ...(e.bic ? ([["BIC", e.bic]] as [string, string][]) : []),
      ...(doc.numero ? ([["Référence", doc.numero]] as [string, string][]) : []),
    ];
    const qr = qrVirement(e, doc);
    const tailleQr = 74;
    const hR = Math.max(26 + lignesR.length * 13 + (doc.date_echeance ? 14 : 2), qr ? tailleQr + 20 : 0);
    if (y - hR < 80) nouvellePage();
    const bas = y - hR + 12;
    page.drawRectangle({ x: M, y: bas, width: L - 2 * M, height: hR, borderColor: FILET, borderWidth: 1 });
    page.drawRectangle({ x: M, y: bas, width: 3, height: hR, color: BLEU });
    let yr = y;
    texte("Règlement par virement", M + 14, yr, 9.5, gras);
    yr -= 17;
    for (const [lib, val] of lignesR) {
      texte(lib, M + 14, yr, 8.5, reg, GRIS);
      texte(val, M + 70, yr, 8.5, lib === "IBAN" || lib === "Référence" ? gras : reg);
      yr -= 13;
    }
    if (doc.date_echeance) {
      yr -= 3;
      texte(`À régler au plus tard le ${dateFr(doc.date_echeance)}.`, M + 14, yr, 8, reg, GRIS);
    }
    if (qr) {
      const xQr = L - M - 10 - tailleQr;
      const yQr = bas + (hR - tailleQr) / 2;
      const n = qr.size;
      const m = tailleQr / n;
      for (let r = 0; r < n; r++) {
        // Modules noirs consécutifs d'une rangée tracés d'un seul rectangle
        let debut = -1;
        for (let col = 0; col <= n; col++) {
          const noir = col < n && qr.data[r * n + col] === 1;
          if (noir && debut < 0) debut = col;
          if (!noir && debut >= 0) {
            page.drawRectangle({ x: xQr + debut * m, y: yQr + (n - 1 - r) * m, width: (col - debut) * m + 0.05, height: m + 0.05, color: NUIT });
            debut = -1;
          }
        }
      }
      const xTexte = xQr - 14;
      const yMilieu = bas + hR / 2;
      aDroite("Payez en scannant ce code", xTexte, yMilieu + 4, 8.5, gras);
      aDroite("avec l'application de votre banque", xTexte, yMilieu - 8, 8, reg, GRIS);
    }
    y = bas - 16;
  }

  // Mentions
  const mentions: { t: string; gras?: boolean }[] = [];
  if (e.mention_tva) mentions.push({ t: e.mention_tva, gras: true });
  if (doc.genre === "facture") {
    // Sans coordonnées bancaires, les conditions de paiement restent écrites en toutes lettres
    if (!e.iban && e.conditions_paiement) mentions.push({ t: e.conditions_paiement });
    // Pénalités et indemnité de 40 € : uniquement entre professionnels
    if (e.penalites_retard && c.type !== "particulier") mentions.push({ t: e.penalites_retard });
  }
  if (doc.genre === "devis") {
    mentions.push({ t: `Devis valable jusqu'au ${dateFr(doc.date_validite)}. Le devis accepté vaut commande, aux conditions de réalisation jointes en page suivante.` });
    if (e.conditions_paiement) mentions.push({ t: e.conditions_paiement });
  }
  if (doc.notes) mentions.push({ t: doc.notes });

  for (const m of mentions) {
    const ls = decouper(m.t, m.gras ? gras : reg, 8.5, L - 2 * M);
    if (y - ls.length * 11 < 70) nouvellePage();
    ls.forEach((t) => {
      texte(t, M, y, 8.5, m.gras ? gras : reg, m.gras ? NUIT : GRIS);
      y -= 11;
    });
    y -= 5;
  }

  if (doc.genre === "devis") {
    y -= 8;
    if (y < 150) nouvellePage();
    if (doc.accepte) {
      texte(`Devis accepté en ligne le ${dateFr(doc.accepte.le.slice(0, 10))} par ${doc.accepte.par}.`, M, y, 10, gras, BLEU);
      y -= 16;
      if (doc.accepte.debut_anticipe) {
        texte("Le client a demandé que les travaux commencent avant la fin du délai de rétractation.", M, y, 8.5, reg, GRIS);
        y -= 14;
      }
    } else {
      page.drawRectangle({ x: L / 2, y: y - 70, width: L / 2 - M, height: 80, borderColor: FILET, borderWidth: 1 });
      texte("Bon pour accord : date et signature", L / 2 + 10, y - 4, 9, gras);
      if (doc.lien_acceptation) {
        texte("Ou acceptez ce devis en ligne :", M, y - 4, 9, gras);
        decouper(doc.lien_acceptation, reg, 8, L / 2 - M - 20).forEach((t, i) => texte(t, M, y - 18 - i * 10, 8, reg, BLEU));
      }
      y -= 80;
    }
  }

  // Devis : conditions de réalisation sur une page à part
  if (doc.genre === "devis") {
    nouvellePage();
    texte(TITRE_CONDITIONS, M, y - 8, 17, gras);
    y -= 26;
    texte(`Jointes au devis ${doc.numero ?? "en brouillon"}${doc.accepte ? "" : " : l'acceptation du devis vaut acceptation de ces conditions"}.`, M, y, 9, reg, GRIS);
    y -= 26;
    const largeurTexte = L - 2 * M - 22;
    CONDITIONS.forEach((cnd, i) => {
      const ls = decouper(cnd.texte, reg, 9, largeurTexte);
      if (y - 16 - ls.length * 12.5 < 70) nouvellePage();
      texte(String(i + 1), M, y, 10, gras, BLEU);
      texte(cnd.titre, M + 22, y, 10, gras);
      y -= 14;
      ls.forEach((t) => {
        texte(t, M + 22, y, 9, reg, GRIS);
        y -= 12.5;
      });
      y -= 9;
    });

    if (c.type === "particulier") {
      const adresse = [e.adresse, [e.code_postal, e.ville].filter(Boolean).join(" ")].filter(Boolean).join(", ");
      const paras = RETRACTATION.texte.map((t) => decouper(t, reg, 9, largeurTexte));
      const form = RETRACTATION.formulaire(`${e.raison_sociale ?? ""} (${e.nom_commercial ?? ""})`, adresse, e.email ?? "", doc.numero ?? "")
        .map((t) => decouper(t, reg, 8.5, largeurTexte - 20));
      const hauteur = 61 + paras.reduce((n, p) => n + p.length * 12.5 + 6, 0) + form.reduce((n, f) => n + f.length * 12 + 4, 0);
      y -= 6;
      if (y - hauteur < 70) nouvellePage();
      const haut = y + 14;
      page.drawRectangle({ x: M, y: haut - hauteur, width: L - 2 * M, height: hauteur, color: CIEL });
      texte(RETRACTATION.titre, M + 14, y, 10, gras);
      y -= 18;
      for (const p of paras) {
        p.forEach((t) => {
          texte(t, M + 14, y, 9, reg, NUIT);
          y -= 12.5;
        });
        y -= 6;
      }
      y -= 4;
      texte("Modèle de formulaire de rétractation", M + 14, y, 9, gras);
      y -= 15;
      for (const f of form) {
        f.forEach((t) => {
          texte(t, M + 24, y, 8.5, reg, GRIS);
          y -= 12;
        });
        y -= 4;
      }
      y = haut - hauteur - 10;
    }
  }

  // Pied de page et filigrane
  const pied = `${e.nom_commercial ?? ""} : ${e.raison_sociale ?? ""}, SIRET ${e.siret ?? ""}, ${[e.adresse, e.code_postal, e.ville].filter(Boolean).join(" ")}`;
  pages.forEach((p, i) => {
    p.drawLine({ start: { x: M, y: 44 }, end: { x: L - M, y: 44 }, thickness: 0.6, color: FILET });
    p.drawText(pied, { x: M, y: 30, size: 7.5, font: reg, color: GRIS });
    const num = `Page ${i + 1} / ${pages.length}`;
    p.drawText(num, { x: L - M - reg.widthOfTextAtSize(num, 7.5), y: 30, size: 7.5, font: reg, color: GRIS });
    if (brouillon) {
      p.drawText("BROUILLON", {
        x: 120,
        y: 330,
        size: 90,
        font: gras,
        color: rgb(0.85, 0.88, 0.93),
        opacity: 0.45,
        rotate: degrees(35),
      });
    }
  });

  return pdf.save();
}
