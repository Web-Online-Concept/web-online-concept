import { Suspense } from "react";
import Navigation, { NavigationAttente } from "@/components/admin/Navigation";
import { exigerAdmin } from "@/lib/admin/acces";
import { aujourdhui } from "@/lib/admin/format";

// Compteurs affichés dans la navigation : messages non lus, factures en retard de paiement
async function NavigationAvecCompteurs() {
  const sb = await exigerAdmin();
  const [messages, retards] = await Promise.all([
    sb.from("messages").select("id", { count: "exact", head: true }).eq("lu", false),
    sb.from("factures").select("id", { count: "exact", head: true }).eq("type", "facture").eq("statut", "emise").lt("date_echeance", aujourdhui()),
  ]);
  return <Navigation compteurs={{ messages: messages.count ?? 0, retards: retards.count ?? 0 }} />;
}

export default function EspaceAdmin({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Suspense fallback={<NavigationAttente />}>
        <NavigationAvecCompteurs />
      </Suspense>
      <main className="flex-1 pb-[calc(6rem+env(safe-area-inset-bottom))] lg:pb-0 lg:pl-64">
        <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8 lg:py-10">{children}</div>
      </main>
    </div>
  );
}
