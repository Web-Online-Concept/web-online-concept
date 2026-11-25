import "server-only";
import { redirect } from "next/navigation";
import { clientServeur } from "@/lib/supabase/serveur";

export const EMAIL_ADMIN = "web.online.concept@gmail.com";

// À appeler en tête de chaque page et de chaque action du back-office.
export async function exigerAdmin() {
  const sb = await clientServeur();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user || user.email?.toLowerCase() !== EMAIL_ADMIN) {
    redirect("/admin/connexion");
  }
  return sb;
}
