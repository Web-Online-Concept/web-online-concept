import { NextResponse } from "next/server";
import { exigerAdmin } from "@/lib/admin/acces";
import { lirePdfArchive, pdfFacture } from "@/lib/admin/documents";

export async function GET(_req: Request, { params }: RouteContext<"/admin/factures/[id]/pdf">) {
  const sb = await exigerAdmin();
  const { id } = await params;
  const { data: f } = await sb.from("factures").select("numero, type, pdf_chemin").eq("id", id).maybeSingle();
  if (!f) return new NextResponse("Introuvable", { status: 404 });

  let octets: Uint8Array | null = null;
  let nom = `${f.type === "avoir" ? "Avoir" : "Facture"}-${f.numero ?? "brouillon"}.pdf`;
  if (f.pdf_chemin) octets = await lirePdfArchive(sb, f.pdf_chemin);
  if (!octets) {
    const r = await pdfFacture(sb, id);
    if (!r) return new NextResponse("Introuvable", { status: 404 });
    octets = r.octets;
    nom = r.nom;
  }
  return new NextResponse(Buffer.from(octets), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${nom}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
