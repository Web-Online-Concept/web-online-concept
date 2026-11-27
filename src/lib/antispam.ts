// Filtre des messages indésirables du formulaire de contact (en plus de BotID, du champ piège et du délai minimal).
// Ne vise que les cas certains : un vrai visiteur ne doit jamais être bloqué par erreur.

const LIEN = /(?:https?:\/\/|www\.)\S+|(?<![@\w.-])[\w-]+(?:\.[\w-]+)*\.(?:com|net|org|info|biz|io|co|ru|cn|xyz|top|click|link|online|site|shop|store)\b/gi;

// Alphabets étrangers au site (cyrillique, chinois, japonais, coréen, arabe, hébreu, thaï)
const ALPHABETS = /[Ѐ-ӿ぀-ヿ㐀-鿿가-힯؀-ۿ֐-׿฀-๿]/g;

// Démarchage et spam classiques (en anglais pour l'essentiel)
const EXPRESSIONS = [
  /\bguest ?posts?\b/i,
  /\bbacklinks?\b/i,
  /\blink ?building\b/i,
  /\bfirst page of google\b/i,
  /\brank(?:ing)? (?:your|on) (?:website|site|google)\b/i,
  /\b(?:increase|boost) (?:your )?(?:website )?traffic\b/i,
  /\bseo (?:agency|services|expert|package)\b/i,
  /\b(?:bitcoin|crypto(?:currency)?|forex|casino|viagra|cialis|porn|escort|onlyfans)\b/i,
  /\bwhite ?label\b/i,
  /\bunsubscribe\b/i,
];

export type Envoi = { nom: string; email: string; objet: string; message: string };

/** Raison du rejet si le message est indésirable, sinon null. */
export function raisonIndesirable({ nom, email, objet, message }: Envoi): string | null {
  const texte = `${objet}\n${message}`;
  if (/https?:|www\.|\.[a-z]{2,}\/|[<>]/i.test(nom)) return "nom contenant un lien";
  if ((texte.match(LIEN) ?? []).length > 2) return "trop de liens";
  if ((texte.match(ALPHABETS) ?? []).length >= 3) return "alphabet étranger";
  if (EXPRESSIONS.some((r) => r.test(texte))) return "démarchage ou spam connu";
  if (/^[^@]+@(?:[^.]+\.)*(?:ru|cn|xyz|top|click)$/i.test(email)) return "domaine d'e-mail à risque";
  return null;
}
