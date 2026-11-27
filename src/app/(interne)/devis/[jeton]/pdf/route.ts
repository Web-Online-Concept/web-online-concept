import { NextResponse } from "next/server";
import { pdfDevis } from "@/lib/admin/documents";
import { clientService } from "@/lib/supabase/service";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: Request, { params }: RouteContext<"/devis/[jeton]/pdf">) {
  const { jeton } = await params;
  const sb = clientService();
  if (!UUID.test(jeton) || !sb) return new NextResponse("Introuvable", { status: 404 });
  const { data: d } = await sb.from("devis").select("id, numero").eq("jeton_acceptation", jeton).maybeSingle();
  if (!d?.numero) return new NextResponse("Introuvable", { status: 404 });
  const r = await pdfDevis(sb, d.id, new URL(req.url).origin);
  if (!r) return new NextResponse("Introuvable", { status: 404 });
  return new NextResponse(Buffer.from(r.octets), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${r.nom}"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
