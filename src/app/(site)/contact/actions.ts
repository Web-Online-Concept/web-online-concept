"use server";

import { clientService } from "@/lib/supabase/service";

export type EtatContact = {
  statut: "initial" | "envoye" | "erreur";
  message?: string;
  erreurs?: Partial<Record<"nom" | "email" | "objet" | "message", string>>;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function envoyerMessage(_etat: EtatContact, formData: FormData): Promise<EtatContact> {
  // Pièges à robots : champ caché rempli, ou envoi trop rapide après affichage.
  if (String(formData.get("site_web") ?? "").trim() !== "") {
    return { statut: "envoye" };
  }
  const affiche = Number(formData.get("affiche_le") ?? 0);
  if (!affiche || Date.now() - affiche < 3000) {
    return { statut: "erreur", message: "Merci de patienter quelques secondes avant d'envoyer le formulaire." };
  }

  const nom = String(formData.get("nom") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const objet = String(formData.get("objet") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const erreurs: EtatContact["erreurs"] = {};
  if (nom.length < 2 || nom.length > 120) erreurs.nom = "Indiquez votre nom.";
  if (!EMAIL.test(email) || email.length > 200) erreurs.email = "Indiquez une adresse e-mail valide.";
  if (objet.length > 160) erreurs.objet = "L'objet est limité à 160 caractères.";
  if (message.length < 10) erreurs.message = "Décrivez votre projet en quelques mots (10 caractères minimum).";
  if (message.length > 5000) erreurs.message = "Le message est limité à 5 000 caractères.";
  if (Object.keys(erreurs).length > 0) return { statut: "erreur", erreurs };

  const sb = clientService();
  if (!sb) {
    return { statut: "erreur", message: "L'envoi est momentanément indisponible. Écrivez à contact@web-online-concept.com." };
  }
  const { error } = await sb.from("messages").insert({ nom, email, objet, message });
  if (error) {
    return { statut: "erreur", message: "L'envoi a échoué. Réessayez ou écrivez à contact@web-online-concept.com." };
  }
  return { statut: "envoye" };
}
