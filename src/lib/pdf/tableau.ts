import "server-only";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { LOGO_PNG, SORA_REGULAR, SORA_SEMIBOLD } from "./ressources";

// Rapport tabulaire au format A4 paysage (livre des recettes, récapitulatifs…)

export type Colonne = { titre: string; largeur: number; droite?: boolean };

export type RapportPdf = {
  titre: string;
  sousTitre?: string;
  colonnes: Colonne[]; // largeurs relatives
  lignes: string[][];
  totaux?: string[];
  notes?: string[];
  pied: string;
};

const NUIT = rgb(10 / 255, 26 / 255, 47 / 255);
const GRIS = rgb(74 / 255, 97 / 255, 120 / 255);
const FILET = rgb(220 / 255, 227 / 255, 236 / 255);
const CIEL = rgb(244 / 255, 247 / 255, 251 / 255);

function tronquer(t: string, police: PDFFont, taille: number, largeur: number) {
  if (police.widthOfTextAtSize(t, taille) <= largeur) return t;
  let s = t;
  while (s.length > 1 && police.widthOfTextAtSize(s + "…", taille) > largeur) s = s.slice(0, -1);
  return s + "…";
}

export async function genererRapport(r: RapportPdf): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const reg = await pdf.embedFont(Buffer.from(SORA_REGULAR, "base64"), { subset: true });
  const gras = await pdf.embedFont(Buffer.from(SORA_SEMIBOLD, "base64"), { subset: true });
  const logo = await pdf.embedPng(Buffer.from(LOGO_PNG, "base64"));
  pdf.setTitle(r.titre);
  pdf.setAuthor("Web Online Concept");
  pdf.setCreator("Web Online Concept");

  const L = 841.89;
  const H = 595.28;
  const M = 40;
  const largeurUtile = L - 2 * M;
  const somme = r.colonnes.reduce((s, c) => s + c.largeur, 0);
  const largeurs = r.colonnes.map((c) => (c.largeur / somme) * largeurUtile);
  const xs = largeurs.map((_, i) => M + largeurs.slice(0, i).reduce((s, w) => s + w, 0));
  const PAD = 6;
  const TAILLE = 8.5;
  const HL = 17;

  const pages: PDFPage[] = [];
  let page!: PDFPage;
  let y = 0;

  const cellule = (t: string, i: number, yy: number, police: PDFFont, couleur = NUIT) => {
    const w = largeurs[i] - 2 * PAD;
    const s = tronquer(t ?? "", police, TAILLE, w);
    const x = r.colonnes[i].droite ? xs[i] + largeurs[i] - PAD - police.widthOfTextAtSize(s, TAILLE) : xs[i] + PAD;
    page.drawText(s, { x, y: yy, size: TAILLE, font: police, color: couleur });
  };

  const entete = () => {
    page.drawRectangle({ x: M, y: y - HL + 4, width: largeurUtile, height: HL, color: NUIT });
    r.colonnes.forEach((c, i) => cellule(c.titre, i, y - HL + 9.5, gras, rgb(1, 1, 1)));
    y -= HL + 2;
  };

  const nouvellePage = (premiere: boolean) => {
    page = pdf.addPage([L, H]);
    pages.push(page);
    y = H - M;
    if (premiere) {
      const lw = 150;
      const lh = (logo.height / logo.width) * lw;
      page.drawImage(logo, { x: M - 5, y: y - lh + 8, width: lw, height: lh });
      const tw = gras.widthOfTextAtSize(r.titre, 16);
      page.drawText(r.titre, { x: L - M - tw, y: y - 12, size: 16, font: gras, color: NUIT });
      if (r.sousTitre) {
        const sw = reg.widthOfTextAtSize(r.sousTitre, 9.5);
        page.drawText(r.sousTitre, { x: L - M - sw, y: y - 28, size: 9.5, font: reg, color: GRIS });
      }
      y -= Math.max(lh, 36) + 14;
    } else {
      page.drawText(r.titre, { x: M, y: y - 10, size: 10, font: gras, color: NUIT });
      y -= 24;
    }
    entete();
  };

  nouvellePage(true);
  const bas = M + 28;

  r.lignes.forEach((ligne, n) => {
    if (y - HL < bas) nouvellePage(false);
    if (n % 2 === 1) page.drawRectangle({ x: M, y: y - HL + 4, width: largeurUtile, height: HL, color: CIEL });
    ligne.forEach((v, i) => cellule(v, i, y - HL + 9.5, reg));
    y -= HL;
  });
  if (r.lignes.length === 0) {
    page.drawText("Aucune donnée sur la période.", { x: M + PAD, y: y - HL + 9.5, size: TAILLE, font: reg, color: GRIS });
    y -= HL;
  }

  if (r.totaux) {
    if (y - HL - 4 < bas) nouvellePage(false);
    y -= 2;
    page.drawLine({ start: { x: M, y: y + 4 }, end: { x: L - M, y: y + 4 }, thickness: 1, color: NUIT });
    r.totaux.forEach((v, i) => cellule(v, i, y - HL + 9.5, gras));
    y -= HL + 6;
  }

  for (const note of r.notes ?? []) {
    if (y - 14 < bas) nouvellePage(false);
    page.drawText(tronquer(note, reg, 8, largeurUtile), { x: M, y: y - 10, size: 8, font: reg, color: GRIS });
    y -= 13;
  }

  const total = pages.length;
  pages.forEach((p, i) => {
    p.drawLine({ start: { x: M, y: M + 14 }, end: { x: L - M, y: M + 14 }, thickness: 0.5, color: FILET });
    p.drawText(r.pied, { x: M, y: M, size: 7.5, font: reg, color: GRIS });
    const num = `Page ${i + 1} / ${total}`;
    p.drawText(num, { x: L - M - reg.widthOfTextAtSize(num, 7.5), y: M, size: 7.5, font: reg, color: GRIS });
  });

  return pdf.save();
}
