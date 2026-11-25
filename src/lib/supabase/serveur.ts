import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Client lié à la session de l'administrateur (cookies).
export async function clientServeur() {
  const store = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return store.getAll();
        },
        setAll(liste) {
          try {
            liste.forEach(({ name, value, options }) => store.set(name, value, options));
          } catch {
            // Appel depuis un composant serveur : le proxy rafraîchit la session.
          }
        },
      },
    },
  );
}
