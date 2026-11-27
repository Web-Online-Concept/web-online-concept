import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { clientServeur } from "@/lib/supabase/serveur";

// Retour du lien de connexion envoyé par e-mail.
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const sb = await clientServeur();

  let ok = false;
  if (code) {
    const { error } = await sb.auth.exchangeCodeForSession(code);
    ok = !error;
  } else if (tokenHash && type) {
    const { error } = await sb.auth.verifyOtp({ token_hash: tokenHash, type });
    ok = !error;
  }
  return NextResponse.redirect(new URL(ok ? "/admin" : "/admin/connexion?erreur=lien", url.origin));
}
