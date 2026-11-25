import "server-only";
import { createClient } from "@supabase/supabase-js";

// Accès serveur avec la clé secrète : uniquement pour les actions publiques
// contrôlées (formulaire de contact, acceptation d'un devis par lien).
export function clientService() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const cle = process.env.SUPABASE_SECRET_KEY;
  if (!url || !cle) return null;
  return createClient(url, cle, { auth: { persistSession: false, autoRefreshToken: false } });
}
