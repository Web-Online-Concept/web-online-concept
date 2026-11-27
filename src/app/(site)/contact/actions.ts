"use server";

import { after } from "next/server";
import { checkBotId } from "botid/server";
import { raisonIndesirable } from "@/lib/antispam";
import { BESOINS } from "@/lib/contenu";
import { notifierNouveauMessage } from "@/lib/notification";
import { clientService } from "@/lib/supabase/service";

export type EtatContact = {
  statut: "initial" | "envoye" | "erreur";
  message?: string;
  erreurs?: Partial<Record<"nom" | "email" | "telephone" | "besoin" | "objet" | "message", string>>;
  // Saisie renvoyée en cas d'erreur, pour que rien ne soit perdu
  valeurs?: { nom: string; email: string; telephone: string; besoin: string; source: string; objet: string; message: string };
  // Après envoi : prénom pour la réponse affichée, et confirmation par e-mail envoyée ou non
  prenom?: string;
  accuse?: boolean;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ECRIRE = "Réessayez dans un instant, ou écrivez-nous à contact@web-online-concept.com.";

export async function envoyerMessage(_etat: EtatContact, formData: FormData): Promise<EtatContact> {
  // Robots, en couches successives. Les cas certains reçoivent une fausse confirmation (rien n'est enregistré
  // ni envoyé) pour ne rien leur apprendre ; un doute laisse au visiteur l'adresse e-mail en recours.
  // 1. Champ piège, invisible pour un humain
  if (String(formData.get("site_web") ?? "").trim() !== "") return { statut: "envoye" };

  const nom = String(formData.get("nom") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const objet = String(formData.get("objet") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const telephone = String(formData.get("telephone") ?? "").trim();
  const besoin = String(formData.get("besoin") ?? "");
  const source = String(formData.get("source") ?? "").trim().slice(0, 120);
  const valeurs = { nom, email, telephone, besoin, source, objet, message };

  // 2. Vérification invisible Vercel BotID
  const verification = await checkBotId();
  if (verification.isBot) {
    console.warn("[antispam] envoi bloqué par BotID");
    return { statut: "erreur", message: `L'envoi n'a pas pu être vérifié. ${ECRIRE}`, valeurs };
  }

  // 3. Envoi trop rapide après l'affichage de la page
  const affiche = Number(formData.get("affiche_le") ?? 0);
  if (!affiche || Date.now() - affiche < 3000) {
    return { statut: "erreur", message: "Merci de patienter quelques secondes avant d'envoyer le formulaire.", valeurs };
  }

  const erreurs: EtatContact["erreurs"] = {};
  if (nom.length < 2 || nom.length > 120) erreurs.nom = "Indiquez votre nom.";
  if (!EMAIL.test(email) || email.length > 200) erreurs.email = "Indiquez une adresse e-mail valide.";
  if (telephone && !/^[0-9+().\s-]{6,25}$/.test(telephone)) erreurs.telephone = "Indiquez un numéro de téléphone valide, ou laissez le champ vide.";
  if (!BESOINS.includes(besoin)) erreurs.besoin = "Choisissez le type de projet.";
  if (objet.length > 160) erreurs.objet = "L'objet est limité à 160 caractères.";
  if (message.length < 10) erreurs.message = "Décrivez votre projet en quelques mots (10 caractères minimum).";
  if (message.length > 5000) erreurs.message = "Le message est limité à 5 000 caractères.";
  if (Object.keys(erreurs).length > 0) return { statut: "erreur", erreurs, valeurs };

  // 4. Contenu typique du spam (liens en série, alphabets étrangers, démarchage connu)
  const raison = raisonIndesirable({ nom, email, objet, message });
  if (raison) {
    console.warn(`[antispam] message ignoré : ${raison}`);
    return { statut: "envoye" };
  }

  const sb = clientService();
  if (!sb) return { statut: "erreur", message: `L'envoi est momentanément indisponible. ${ECRIRE}`, valeurs };

  const depuis = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  // 5. Doublon : même adresse et même message dans les 24 h (double clic, robot qui insiste)
  const { data: recents } = await sb.from("messages").select("message").eq("email", email).gte("cree_le", depuis).limit(20);
  const prenom = nom.split(/\s+/)[0];
  if (recents?.some((r) => r.message === message)) return { statut: "envoye", prenom, accuse: false };

  const { error } = await sb
    .from("messages")
    .insert({ nom, email, objet, message, besoin, telephone: telephone || null, source: source || null });
  if (error) return { statut: "erreur", message: `L'envoi a échoué. ${ECRIRE}`, valeurs };

  // Accusé de réception au visiteur (il recopie sa demande, sans les liens) : un seul par adresse et par 24 h,
  // aucun au-delà de 20 messages en 24 h (signe d'abus) : le formulaire ne doit pas pouvoir servir
  // à envoyer des e-mails à des inconnus.
  const [parAdresse, auTotal] = await Promise.all([
    sb.from("messages").select("id", { count: "exact", head: true }).eq("email", email).gte("cree_le", depuis),
    sb.from("messages").select("id", { count: "exact", head: true }).gte("cree_le", depuis),
  ]);
  const accuse = (parAdresse.count ?? 2) <= 1 && (auTotal.count ?? 99) <= 20;

  const recuLe = new Date();
  after(() => notifierNouveauMessage({ nom, email, telephone, besoin, source, objet, message, recuLe }, { accuse }));
  return { statut: "envoye", prenom, accuse };
}
