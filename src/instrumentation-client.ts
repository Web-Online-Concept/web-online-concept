import { initBotId } from "botid/client/core";

// Vercel BotID : vérification invisible (sans case à cocher) des envois du formulaire de contact.
// L'action serveur du formulaire est appelée en POST sur /contact ; checkBotId() la contrôle dans actions.ts.
initBotId({
  protect: [{ path: "/contact", method: "POST" }],
});
