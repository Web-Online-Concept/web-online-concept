import { NextResponse } from "next/server";
import { exigerAdmin } from "@/lib/admin/acces";
import { pdfDevis } from "@/lib/admin/documents";

export async function GET(req: Request, { params }: RouteContext<"/admin/devis/[id]/pdf">) {
  const sb = await exigerAdmin();
  const { id } = await params;
  const r = await pdfDevis(sb, id, new URL(req.url).origin);
  if (!r) return new NextResponse("Introuvable", { status: 404 });
  return new NextResponse(Buffer.from(r.octets), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${r.nom}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
