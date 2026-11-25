"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { EMAIL_ADMIN } from "@/lib/admin/acces";
import { clientServeur } from "@/lib/supabase/serveur";

export type EtatConnexion = { statut: "initial" | "envoye" | "erreur"; message?: string };

export async function demanderLien(_e: EtatConnexion, formData: FormData): Promise<EtatConnexion> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  // Réponse identique quelle que soit l'adresse, pour ne rien révéler.
  if (email !== EMAIL_ADMIN) return { statut: "envoye" };

  const h = await headers();
  const hote = h.get("x-forwarded-host") ?? h.get("host");
  const protocole = h.get("x-forwarded-proto") ?? "https";
  const origine = `${protocole}://${hote}`;

  const sb = await clientServeur();
  const { error } = await sb.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origine}/admin/auth/callback`, shouldCreateUser: true },
  });
  if (error) {
    return { statut: "erreur", message: `Envoi impossible pour le moment (${error.message}). Réessayez dans quelques minutes.` };
  }
  return { statut: "envoye" };
}

export async function seDeconnecter() {
  const sb = await clientServeur();
  await sb.auth.signOut();
  redirect("/admin/connexion");
}
