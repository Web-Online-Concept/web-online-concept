import { zipSync } from "fflate";
import { NextResponse } from "next/server";
import { exigerAdmin } from "@/lib/admin/acces";
import { lirePdfArchive, pdfFacture } from "@/lib/admin/documents";
import { construireTableau, EXPORTS, piedDePage, tableauCsv, tableauPdf, type TypeExport } from "@/lib/admin/exports";

function fichier(octets: Uint8Array | string, nom: string, type: string) {
  const corps = typeof octets === "string" ? octets : Buffer.from(octets);
  return new NextResponse(corps, {
    headers: {
      "Content-Type": type,
      "Content-Disposition": `attachment; filename="${nom}"`,
      "Cache-Control": "private, no-store",
    },
  });
}

export async function GET(req: Request, { params }: RouteContext<"/admin/exports/[type]">) {
  const sb = await exigerAdmin();
  const { type } = await params;
  const url = new URL(req.url);
  const anneeBrute = url.searchParams.get("annee") ?? "";
  const annee = /^\d{4}$/.test(anneeBrute) ? Number(anneeBrute) : new Date().getFullYear();
  const format = url.searchParams.get("format") === "csv" ? "csv" : "pdf";

  if ((EXPORTS as readonly string[]).includes(type)) {
    const t = await construireTableau(sb, type as TypeExport, annee);
    if (format === "csv") return fichier(tableauCsv(t), `${t.fichier}.csv`, "text/csv; charset=utf-8");
    return fichier(await tableauPdf(t, await piedDePage(sb)), `${t.fichier}.pdf`, "application/pdf");
  }

  if (type === "archive") {
    const pied = await piedDePage(sb);
    const contenu: Record<string, Uint8Array> = {};
    const enc = new TextEncoder();
    for (const e of EXPORTS) {
      const t = await construireTableau(sb, e, annee);
      contenu[`${t.fichier}.pdf`] = await tableauPdf(t, pied);
      contenu[`${t.fichier}.csv`] = enc.encode(tableauCsv(t));
    }
    const { data: factures } = await sb
      .from("factures")
      .select("id, numero, type, pdf_chemin")
      .not("numero", "is", null)
      .gte("date_emission", `${annee}-01-01`)
      .lte("date_emission", `${annee}-12-31`)
      .order("numero");
    for (const f of factures ?? []) {
      let octets: Uint8Array | null = f.pdf_chemin ? await lirePdfArchive(sb, f.pdf_chemin) : null;
      if (!octets) octets = (await pdfFacture(sb, f.id))?.octets ?? null;
      if (octets) contenu[`factures/${f.type === "avoir" ? "Avoir" : "Facture"}-${f.numero}.pdf`] = octets;
    }
    const zip = zipSync(contenu, { level: 6 });
    return fichier(zip, `web-online-concept-${annee}.zip`, "application/zip");
  }

  return new NextResponse("Export inconnu", { status: 404 });
}
