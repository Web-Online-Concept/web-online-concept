import "server-only";
import { createClient } from "@supabase/supabase-js";

// Lecture publique (articles publiés) : clé publiable, sans session.
export function clientPublic() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const cle = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !cle) return null;
  return createClient(url, cle, { auth: { persistSession: false } });
}
