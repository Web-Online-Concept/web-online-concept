import "server-only";
import fontkit from "@pdf-lib/fontkit";
import { degrees, PDFDocument, rgb, type PDFFont, type PDFPage, type RGB } from "pdf-lib";
import QRCode from "qrcode";
import { CONDITIONS, RETRACTATION, TITRE_CONDITIONS } from "@/lib/conditions";
import { LOGO_SOMBRE_PNG, SORA_REGULAR, SORA_SEMIBOLD } from "./ressources";

// Devis, factures et avoirs aux couleurs du site : bandeau bleu nuit avec halo et orbite, filet en dégradé
// bleu, cyan, vert, cartes arrondies. Tout est vectoriel (sauf le logo) : le PDF reste léger et net à l'impression.

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

const hex = (h: string) => rgb(parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255);
const NUIT = hex("#0A1A2F");
const NUIT_CLAIR = hex("#13294A");
const BLEU = hex("#1F5EFF");
const CYAN = hex("#00B4D8");
const VERT = hex("#2BD47D");
const BLEU_CIEL = hex("#7CCBFF");
const TEXTE = hex("#2C4558");
const GRIS = hex("#4A6178");
const GRIS_DOUX = hex("#6B8299");
const FILET = hex("#DCE3EC");
const CIEL = hex("#F4F7FB");
const BLEU_PALE = hex("#E8EFFF");
const VERT_PALE = hex("#E3F8EC");
const VERT_FONCE = hex("#0E7A45");
const BLANC = rgb(1, 1, 1);

const euros = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n).replace(/[\u202f\u00a0]/g, " ");
const dateFr = (iso?: string | null) =>
  iso ? new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }).format(new Date(iso + "T00:00:00Z")) : "";
const qte = (n: number) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 3 }).format(n).replace(/[\u202f\u00a0]/g, " ");

// IBAN par groupes de quatre caractères, titulaire du compte = dénomination sans la mention « EI »
const ibanLisible = (iban: string) => iban.replace(/\s+/g, "").replace(/(.{4})/g, "$1 ").trim();
const titulaire = (e: Partie) => (e.raison_sociale ?? "").replace(/\s+(EI|E\.I\.)$/i, "").trim();

// Matrice d'un QR code (niveau de correction M)
function qrMatrice(texte: string) {
  const { modules } = QRCode.create(texte, { errorCorrectionLevel: "M" });
  return { size: modules.size, data: modules.data };
}

// QR code de virement SEPA (norme EPC069-12, « GiroCode ») : bénéficiaire, IBAN, montant et référence préremplis
function qrVirement(e: Partie, doc: DocumentPdf) {
  if (!e.iban || !(doc.total_ttc > 0) || doc.total_ttc > 999999999.99) return null;
  return qrMatrice(
    [
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
    ].join("\n"),
  );
}

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

// Couleur du dégradé de la marque (bleu, cyan à 55 %, vert) à la position t entre 0 et 1
function teinte(t: number): RGB {
  const [a, b, u] = t < 0.55 ? [BLEU, CYAN, t / 0.55] : [CYAN, VERT, (t - 0.55) / 0.45];
  return rgb(a.red + (b.red - a.red) * u, a.green + (b.green - a.green) * u, a.blue + (b.blue - a.blue) * u);
}

function degrade(page: PDFPage, x: number, y: number, l: number, h: number, vertical = false) {
  const n = 48;
  for (let i = 0; i < n; i++) {
    const c = teinte(i / (n - 1));
    if (vertical) page.drawRectangle({ x, y: y + h - ((i + 1) * h) / n, width: l, height: h / n + 0.3, color: c });
    else page.drawRectangle({ x: x + (i * l) / n, y, width: l / n + 0.3, height: h, color: c });
  }
}

// Rectangle aux coins arrondis (x, y : coin bas gauche)
function carte(page: PDFPage, x: number, y: number, l: number, h: number, r: number, o: { couleur?: RGB; bord?: RGB; epaisseur?: number }) {
  const chemin = `M ${r} 0 H ${l - r} Q ${l} 0 ${l} ${r} V ${h - r} Q ${l} ${h} ${l - r} ${h} H ${r} Q 0 ${h} 0 ${h - r} V ${r} Q 0 0 ${r} 0 Z`;
  page.drawSvgPath(chemin, {
    x,
    y: y + h,
    color: o.couleur,
    borderColor: o.bord,
    borderWidth: o.bord ? (o.epaisseur ?? 0.8) : 0,
  });
}

// Ellipse inclinée tracée en polyligne (orbite du logo)
function orbite(page: PDFPage, cx: number, cy: number, rx: number, ry: number, angle: number, couleur: RGB, opacite: number, epaisseur: number) {
  const a = (angle * Math.PI) / 180;
  const pts: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const t = (i / 120) * Math.PI * 2;
    const x = rx * Math.cos(t);
    const y = ry * Math.sin(t);
    const px = x * Math.cos(a) - y * Math.sin(a);
    const py = x * Math.sin(a) + y * Math.cos(a);
    pts.push(`${i ? "L" : "M"} ${px.toFixed(2)} ${(-py).toFixed(2)}`);
  }
  page.drawSvgPath(pts.join(" "), { x: cx, y: cy, borderColor: couleur, borderWidth: epaisseur, borderOpacity: opacite });
  return (t: number) => {
    const x = rx * Math.cos(t);
    const y = ry * Math.sin(t);
    return { x: cx + x * Math.cos(a) - y * Math.sin(a), y: cy + x * Math.sin(a) + y * Math.cos(a) };
  };
}

function dessinerQr(page: PDFPage, qr: { size: number; data: Uint8Array }, x: number, y: number, taille: number) {
  const n = qr.size;
  const m = taille / n;
  for (let r = 0; r < n; r++) {
    // Modules noirs consécutifs d'une rangée tracés d'un seul rectangle
    let debut = -1;
    for (let col = 0; col <= n; col++) {
      const noir = col < n && qr.data[r * n + col] === 1;
      if (noir && debut < 0) debut = col;
      if (!noir && debut >= 0) {
        page.drawRectangle({ x: x + debut * m, y: y + (n - 1 - r) * m, width: (col - debut) * m + 0.05, height: m + 0.05, color: NUIT });
        debut = -1;
      }
    }
  }
}

export async function genererPdf(doc: DocumentPdf, lignes: LignePdf[], brouillon: boolean): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const reg = await pdf.embedFont(Buffer.from(SORA_REGULAR, "base64"), { subset: true });
  const gras = await pdf.embedFont(Buffer.from(SORA_SEMIBOLD, "base64"), { subset: true });
  const logo = await pdf.embedPng(Buffer.from(LOGO_SOMBRE_PNG, "base64"));

  const titre = doc.genre === "facture" ? "Facture" : doc.genre === "avoir" ? "Avoir" : "Devis";
  const e = doc.emetteur;
  const c = doc.client;
  pdf.setTitle(`${titre} ${doc.numero ?? "brouillon"}${c.nom ? `, ${c.nom}` : ""}`);
  pdf.setAuthor(e.nom_commercial ?? "Web Online Concept");
  pdf.setCreator("Web Online Concept");

  const L = 595.28;
  const H = 841.89;
  const M = 44;
  const BAS = 66; // limite basse du contenu, au-dessus du pied de page
  const pages: PDFPage[] = [];
  let page!: PDFPage;
  let y = 0;

  const texte = (t: string, x: number, yy: number, taille = 9.5, police = reg, couleur = NUIT) =>
    page.drawText(t, { x, y: yy, size: taille, font: police, color: couleur });
  const aDroite = (t: string, xDroite: number, yy: number, taille = 9.5, police = reg, couleur = NUIT) =>
    texte(t, xDroite - police.widthOfTextAtSize(t, taille), yy, taille, police, couleur);
  const numero = `${titre} ${doc.numero ?? "en brouillon"}`;

  // Première page : grand bandeau bleu nuit, halo, orbite et satellite, titre du document
  const bandeau = () => {
    const HB = 120;
    page.drawRectangle({ x: -2, y: H - HB, width: L + 4, height: HB + 2, color: NUIT });
    for (let i = 0; i < 20; i++) page.drawCircle({ x: L - 60, y: H - 10, size: 230 - i * 11, color: BLEU, opacity: 0.032 });
    for (let i = 0; i < 12; i++) page.drawCircle({ x: L * 0.5, y: H - HB - 30, size: 150 - i * 12, color: CYAN, opacity: 0.018 });
    const point = orbite(page, L - 170, H - 68, 215, 36, 9, CYAN, 0.32, 0.9);
    orbite(page, L - 170, H - 68, 150, 24, 9, BLEU_CIEL, 0.22, 0.7);
    const s = point(Math.PI * 0.82);
    page.drawCircle({ x: s.x, y: s.y, size: 7, color: VERT, opacity: 0.22 });
    page.drawCircle({ x: s.x, y: s.y, size: 2.8, color: VERT });
    // Ce qui déborde du bandeau (halo, orbite) est recouvert de blanc
    page.drawRectangle({ x: -10, y: H - HB - 300, width: L + 20, height: 300, color: BLANC });
    page.drawRectangle({ x: L, y: H - HB - 300, width: 20, height: HB + 310, color: BLANC });
    degrade(page, 0, H - HB - 3, L, 3);

    const lw = 158;
    const lh = (logo.height / logo.width) * lw;
    page.drawImage(logo, { x: M - 4, y: H - HB / 2 - lh / 2 + 2, width: lw, height: lh });
    aDroite(titre, L - M, H - 58, 28, gras, BLANC);
    aDroite(doc.numero ? `N° ${doc.numero}` : "Brouillon, sans numéro", L - M, H - 80, 11, gras, BLEU_CIEL);
    y = H - HB - 3 - 30;
  };

  // Pages suivantes : bandeau fin, rappel du document
  const bandeauFin = () => {
    const HB = 48;
    page.drawRectangle({ x: -2, y: H - HB, width: L + 4, height: HB + 2, color: NUIT });
    degrade(page, 0, H - HB - 2, L, 2);
    const lw = 104;
    const lh = (logo.height / logo.width) * lw;
    page.drawImage(logo, { x: M - 3, y: H - HB / 2 - lh / 2 + 1, width: lw, height: lh });
    aDroite(numero, L - M, H - HB / 2 - 3, 9.5, gras, BLANC);
    y = H - HB - 2 - 34;
  };

  const nouvellePage = (premiere = false) => {
    page = pdf.addPage([L, H]);
    pages.push(page);
    if (premiere) bandeau();
    else bandeauFin();
  };
  nouvellePage(true);

  // Repères : dates et montant
  const total = euros(doc.total_ttc);
  const reperes: [string, string, boolean?][] =
    doc.genre === "facture"
      ? [
          ["Date", dateFr(doc.date_emission) || "À l'émission"],
          ["Échéance", dateFr(doc.date_echeance) || "30 jours"],
          ["Net à payer", total, true],
        ]
      : doc.genre === "avoir"
        ? [
            ["Date", dateFr(doc.date_emission) || "À l'émission"],
            ["Sur facture", doc.reference_origine ?? ""],
            ["Montant de l'avoir", total, true],
          ]
        : [
            ["Date", dateFr(doc.date_emission) || "À l'émission"],
            ["Valable jusqu'au", dateFr(doc.date_validite) || "30 jours"],
            ["Montant total", total, true],
          ];
  const largeurRepere = (L - 2 * M) / reperes.length;
  reperes.forEach(([lib, val, fort], i) => {
    const x = M + i * largeurRepere;
    if (i) page.drawRectangle({ x: x - 0.4, y: y - 24, width: 0.8, height: 34, color: FILET });
    const px = i ? x + 18 : x;
    texte(lib, px, y, 8.5, reg, GRIS_DOUX);
    texte(val, px, y - 18, fort ? 14 : 11.5, gras, fort ? BLEU : NUIT);
  });
  y -= 40;
  page.drawRectangle({ x: M, y, width: L - 2 * M, height: 0.8, color: FILET });
  y -= 22;

  // Émetteur et client
  const colD = L / 2 + 6;
  const largeurClient = L - M - colD;
  let yg = y;
  texte("Émis par", M, yg, 8.5, reg, GRIS_DOUX);
  yg -= 15;
  texte(e.raison_sociale ?? "", M, yg, 10.5, gras);
  yg -= 14;
  for (const l of [
    e.nom_commercial,
    e.adresse,
    [e.code_postal, e.ville].filter(Boolean).join(" "),
    e.email,
    e.telephone,
  ]) {
    if (!l) continue;
    texte(l, M, yg, 9, reg, GRIS);
    yg -= 12.5;
  }

  const lignesClient = [
    c.contact_nom ? `À l'attention de ${c.contact_nom}` : null,
    c.adresse,
    [c.code_postal, c.ville].filter(Boolean).join(" "),
    c.pays && c.pays !== "France" ? c.pays : null,
    c.siren ? `SIREN ${c.siren}` : null,
    c.tva_intra ? `TVA ${c.tva_intra}` : null,
  ].filter(Boolean) as string[];
  const nomClient = decouper(c.nom ?? "", gras, 11, largeurClient - 32);
  const hClient = 22 + 15 + nomClient.length * 14 + lignesClient.length * 12.5 + 12;
  carte(page, colD, y + 14 - hClient, largeurClient, hClient, 12, { couleur: CIEL });
  degrade(page, colD, y + 14 - hClient + 12, 3, hClient - 24, true);
  let yc = y - 6;
  texte(doc.genre === "devis" ? "Devis pour" : "Facturé à", colD + 18, yc, 8.5, reg, GRIS_DOUX);
  yc -= 16;
  for (const l of nomClient) {
    texte(l, colD + 18, yc, 11, gras);
    yc -= 14;
  }
  for (const l of lignesClient) {
    texte(l, colD + 18, yc, 9, reg, TEXTE);
    yc -= 12.5;
  }
  y = Math.min(yg, y + 14 - hClient) - 22;

  if (doc.objet) {
    texte("Objet", M, y, 8.5, reg, GRIS_DOUX);
    y -= 17;
    for (const l of decouper(doc.objet, gras, 13, L - 2 * M)) {
      texte(l, M, y, 13, gras);
      y -= 17;
    }
    y -= 5;
  }

  // Tableau des lignes
  const xQte = L - M - 196;
  const xPu = L - M - 98;
  const xTot = L - M - 12;
  const largeurDesignation = xQte - M - 60;
  const enTeteTableau = () => {
    carte(page, M, y - 9, L - 2 * M, 26, 8, { couleur: CIEL });
    texte("Désignation", M + 14, y, 8.5, gras, GRIS);
    aDroite("Quantité", xQte + 10, y, 8.5, gras, GRIS);
    aDroite("Prix unitaire HT", xPu + 10, y, 8.5, gras, GRIS);
    aDroite("Total HT", xTot, y, 8.5, gras, GRIS);
    y -= 28;
  };
  enTeteTableau();

  let premiereLigne = true;
  lignes.forEach((l) => {
    const dl = decouper(l.designation, gras, 10, largeurDesignation);
    const desc = l.description ? decouper(l.description, reg, 8.5, largeurDesignation) : [];
    // Hauteur du texte de la ligne, puis un espace avant le filet de séparation et la ligne suivante
    const contenu = dl.length * 13 + desc.length * 11.5;
    const hauteur = contenu + 16;
    if (y - hauteur < BAS + 40) {
      nouvellePage();
      enTeteTableau();
      premiereLigne = true;
    }
    // Filet entre deux lignes d'une même page
    if (!premiereLigne) page.drawRectangle({ x: M + 14, y: y + 17, width: L - 2 * M - 28, height: 0.6, color: FILET });
    premiereLigne = false;
    let yl = y;
    dl.forEach((t) => {
      texte(t, M + 14, yl, 10, gras);
      yl -= 13;
    });
    desc.forEach((t) => {
      texte(t, M + 14, yl, 8.5, reg, GRIS);
      yl -= 11.5;
    });
    aDroite(`${qte(l.quantite)}${l.unite ? " " + l.unite : ""}`, xQte + 10, y, 9.5, reg, TEXTE);
    aDroite(euros(l.prix_unitaire), xPu + 10, y, 9.5, reg, TEXTE);
    aDroite(euros(l.total_ht), xTot, y, 10, gras);
    y -= hauteur;
  });

  // Totaux, à droite : sous-totaux puis montant final dans une carte bleu nuit
  if (y < 250) nouvellePage();
  y -= 4;
  page.drawRectangle({ x: M, y: y + 10, width: L - 2 * M, height: 0.8, color: FILET });
  y -= 12;
  const lT = 236;
  const xT = L - M - lT;
  texte("Total HT", xT + 16, y, 9.5, reg, GRIS);
  aDroite(euros(doc.total_ht), L - M - 16, y, 9.5, reg, TEXTE);
  y -= 16;
  texte("TVA", xT + 16, y, 9.5, reg, GRIS);
  aDroite(doc.total_tva !== 0 ? euros(doc.total_tva) : "0,00 €", L - M - 16, y, 9.5, reg, TEXTE);
  y -= 16;
  const hTot = 44;
  carte(page, xT, y - hTot + 12, lT, hTot, 12, { couleur: NUIT });
  degrade(page, xT + 16, y - hTot + 12, lT - 32, 2.2);
  texte(doc.genre === "devis" ? "Total" : doc.genre === "avoir" ? "Montant de l'avoir" : "Net à payer", xT + 16, y - 15, 11, gras, BLANC);
  aDroite(total, L - M - 16, y - 17, 16, gras, BLANC);
  y -= hTot;
  if (e.mention_tva) {
    aDroite(e.mention_tva, L - M, y - 2, 8, reg, GRIS_DOUX);
    y -= 14;
  }
  y -= 14;

  // Facture : carte de règlement par virement, avec le QR code que l'application bancaire du client sait lire
  if (doc.genre === "facture" && e.iban) {
    const lignesR: [string, string][] = [
      ["Titulaire", titulaire(e)],
      ["IBAN", ibanLisible(e.iban)],
      ...(e.bic ? ([["BIC", e.bic]] as [string, string][]) : []),
      ...(doc.numero ? ([["Référence", doc.numero]] as [string, string][]) : []),
    ];
    const qr = qrVirement(e, doc);
    const tailleQr = 76;
    const hR = Math.max(34 + lignesR.length * 14 + (doc.date_echeance ? 14 : 0), qr ? tailleQr + 28 : 0);
    if (y - hR < BAS) nouvellePage();
    const bas = y - hR + 14;
    carte(page, M, bas, L - 2 * M, hR, 14, { couleur: CIEL });
    degrade(page, M, bas + 14, 3, hR - 28, true);
    let yr = y - 6;
    texte("Règlement par virement", M + 20, yr, 11, gras);
    yr -= 20;
    for (const [lib, val] of lignesR) {
      texte(lib, M + 20, yr, 8.5, reg, GRIS_DOUX);
      texte(val, M + 84, yr, 9, lib === "IBAN" || lib === "Référence" ? gras : reg, NUIT);
      yr -= 14;
    }
    if (doc.date_echeance) {
      yr -= 2;
      texte(`À régler au plus tard le ${dateFr(doc.date_echeance)}.`, M + 20, yr, 8.5, reg, GRIS);
    }
    if (qr) {
      const xQr = L - M - 14 - tailleQr;
      const yQr = bas + (hR - tailleQr) / 2;
      carte(page, xQr - 6, yQr - 6, tailleQr + 12, tailleQr + 12, 8, { couleur: BLANC });
      dessinerQr(page, qr, xQr, yQr, tailleQr);
      const xTexte = xQr - 18;
      const yMilieu = bas + hR / 2;
      aDroite("Scannez pour payer", xTexte, yMilieu + 8, 9, gras);
      aDroite("avec l'application", xTexte, yMilieu - 5, 8, reg, GRIS);
      aDroite("de votre banque", xTexte, yMilieu - 16, 8, reg, GRIS);
    }
    y = bas - 18;
  }

  // Devis : acceptation en ligne (lien et QR code) ou bon pour accord signé
  if (doc.genre === "devis") {
    if (doc.accepte) {
      const hA = doc.accepte.debut_anticipe ? 52 : 38;
      if (y - hA < BAS) nouvellePage();
      carte(page, M, y - hA + 14, L - 2 * M, hA, 12, { couleur: VERT_PALE });
      page.drawCircle({ x: M + 24, y: y - hA / 2 + 14, size: 9, color: VERT });
      page.drawSvgPath("M -4 0 L -1.2 3 L 4.5 -3", { x: M + 24, y: y - hA / 2 + 14, borderColor: BLANC, borderWidth: 1.6 });
      texte(`Devis accepté en ligne le ${dateFr(doc.accepte.le.slice(0, 10))} par ${doc.accepte.par}.`, M + 44, y - 6, 10, gras, VERT_FONCE);
      if (doc.accepte.debut_anticipe) {
        texte("Le client a demandé que les travaux commencent avant la fin du délai de rétractation.", M + 44, y - 21, 8.5, reg, VERT_FONCE);
      }
      y -= hA + 10;
    } else {
      const qr = doc.lien_acceptation ? qrMatrice(doc.lien_acceptation) : null;
      const tailleQr = 76;
      const largeurA = (L - 2 * M) * 0.62;
      const lien = doc.lien_acceptation ? decouper(doc.lien_acceptation, reg, 7.5, largeurA - 40 - (qr ? tailleQr + 16 : 0)) : [];
      const intro = decouper(
        "Scannez le code ou ouvrez le lien : vous relisez le devis et ses conditions, puis vous l'acceptez en quelques secondes.",
        reg,
        8.5,
        largeurA - 40 - (qr ? tailleQr + 16 : 0),
      );
      const hA = Math.max(30 + intro.length * 11.5 + 8 + lien.length * 10 + 12, qr ? tailleQr + 28 : 0);
      if (y - hA < BAS) nouvellePage();
      const bas = y - hA + 14;
      carte(page, M, bas, largeurA, hA, 14, { couleur: CIEL });
      degrade(page, M, bas + 14, 3, hA - 28, true);
      let ya = y - 6;
      texte("Acceptez ce devis en ligne", M + 20, ya, 11, gras);
      ya -= 17;
      intro.forEach((t) => {
        texte(t, M + 20, ya, 8.5, reg, GRIS);
        ya -= 11.5;
      });
      ya -= 6;
      lien.forEach((t) => {
        texte(t, M + 20, ya, 7.5, reg, BLEU);
        ya -= 10;
      });
      if (qr) {
        const xQr = M + largeurA - 14 - tailleQr;
        const yQr = bas + (hA - tailleQr) / 2;
        carte(page, xQr - 6, yQr - 6, tailleQr + 12, tailleQr + 12, 8, { couleur: BLANC });
        dessinerQr(page, qr, xQr, yQr, tailleQr);
      }
      // Bon pour accord signé, à droite
      const xS = M + largeurA + 14;
      const lS = L - M - xS;
      carte(page, xS, bas, lS, hA, 14, { bord: FILET, epaisseur: 1 });
      texte("Ou bon pour accord", xS + 16, y - 6, 10, gras);
      texte("Date et signature", xS + 16, y - 21, 8.5, reg, GRIS_DOUX);
      y = bas - 20;
    }
  }

  // Mentions
  const mentions: string[] = [];
  if (doc.genre === "facture") {
    // Sans coordonnées bancaires, les conditions de paiement restent écrites en toutes lettres
    if (!e.iban && e.conditions_paiement) mentions.push(e.conditions_paiement);
    // Pénalités et indemnité de 40 € : uniquement entre professionnels
    if (e.penalites_retard && c.type !== "particulier") mentions.push(e.penalites_retard);
  }
  if (doc.genre === "devis") {
    if (e.conditions_paiement) mentions.push(e.conditions_paiement);
    mentions.push(`Devis valable jusqu'au ${dateFr(doc.date_validite)}. Le devis accepté vaut commande, aux conditions de réalisation jointes en page suivante.`);
  }
  if (doc.notes) mentions.push(doc.notes);
  for (const m of mentions) {
    const ls = decouper(m, reg, 8.5, L - 2 * M);
    if (y - ls.length * 11.5 < BAS) nouvellePage();
    ls.forEach((t) => {
      texte(t, M, y, 8.5, reg, GRIS);
      y -= 11.5;
    });
    y -= 6;
  }

  // Devis : conditions de réalisation sur une page à part
  if (doc.genre === "devis") {
    nouvellePage();
    texte(TITRE_CONDITIONS, M, y - 4, 20, gras);
    y -= 26;
    texte(
      `Jointes au devis ${doc.numero ?? "en brouillon"}${doc.accepte ? "" : " : l'acceptation du devis vaut acceptation de ces conditions"}.`,
      M,
      y,
      9,
      reg,
      GRIS,
    );
    y -= 26;
    const largeurTexte = L - 2 * M - 34;
    CONDITIONS.forEach((cnd, i) => {
      const ls = decouper(cnd.texte, reg, 9, largeurTexte);
      if (y - 18 - ls.length * 12.5 < BAS) nouvellePage();
      page.drawCircle({ x: M + 10, y: y + 3.5, size: 10, color: BLEU_PALE });
      const n = String(i + 1);
      texte(n, M + 10 - gras.widthOfTextAtSize(n, 9) / 2, y, 9, gras, BLEU);
      texte(cnd.titre, M + 34, y, 10.5, gras);
      y -= 14.5;
      ls.forEach((t) => {
        texte(t, M + 34, y, 9, reg, TEXTE);
        y -= 12.5;
      });
      y -= 8;
    });

    if (c.type === "particulier") {
      const adresse = [e.adresse, [e.code_postal, e.ville].filter(Boolean).join(" ")].filter(Boolean).join(", ");
      const largeurR = L - 2 * M - 40;
      const paras = RETRACTATION.texte.map((t) => decouper(t, reg, 9, largeurR));
      const form = RETRACTATION.formulaire(`${e.raison_sociale ?? ""} (${e.nom_commercial ?? ""})`, adresse, e.email ?? "", doc.numero ?? "").map((t) =>
        decouper(t, reg, 8.5, largeurR - 12),
      );
      // Marges et titres (16 + 22 + 4 + 16 + 14) puis paragraphes et formulaire
      const hauteur = 72 + paras.reduce((n, p) => n + p.length * 12.5 + 6, 0) + form.reduce((n, f) => n + f.length * 11.5 + 3, 0);
      if (y - hauteur < BAS) nouvellePage();
      const haut = y + 16;
      carte(page, M, haut - hauteur, L - 2 * M, hauteur, 14, { couleur: CIEL });
      degrade(page, M, haut - hauteur + 14, 3, hauteur - 28, true);
      texte(RETRACTATION.titre, M + 20, y - 4, 11, gras);
      y -= 22;
      for (const p of paras) {
        p.forEach((t) => {
          texte(t, M + 20, y, 9, reg, NUIT);
          y -= 12.5;
        });
        y -= 6;
      }
      y -= 4;
      texte("Modèle de formulaire de rétractation", M + 20, y, 9.5, gras);
      y -= 16;
      for (const f of form) {
        f.forEach((t) => {
          texte(t, M + 32, y, 8.5, reg, GRIS);
          y -= 11.5;
        });
        y -= 3;
      }
      y = haut - hauteur - 10;
    }
  }

  // Pied de page (filet en dégradé, mentions de l'émetteur, pagination) et filigrane des brouillons
  const pied = `${e.nom_commercial ?? ""} : ${e.raison_sociale ?? ""}, SIRET ${e.siret ?? ""}, ${[e.adresse, e.code_postal, e.ville].filter(Boolean).join(" ")}`;
  pages.forEach((p, i) => {
    page = p;
    degrade(p, M, 50, L - 2 * M, 1.2);
    p.drawText(pied, { x: M, y: 34, size: 7.5, font: reg, color: GRIS_DOUX });
    const num = `Page ${i + 1} sur ${pages.length}`;
    p.drawText(num, { x: L - M - reg.widthOfTextAtSize(num, 7.5), y: 34, size: 7.5, font: reg, color: GRIS_DOUX });
    if (brouillon) {
      p.drawText("BROUILLON", {
        x: 120,
        y: 300,
        size: 90,
        font: gras,
        color: NUIT_CLAIR,
        opacity: 0.06,
        rotate: degrees(35),
      });
    }
  });

  return pdf.save();
}
