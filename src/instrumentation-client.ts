import { initBotId } from "botid/client/core";
import { chemin, LANGUES } from "@/lib/i18n/chemins";

// Vérification invisible des envois du formulaire de contact (Vercel BotID), dans les trois langues
initBotId({ protect: LANGUES.map((l) => ({ path: chemin(l, "contact"), method: "POST" as const })) });
