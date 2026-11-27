import Image from "next/image";
import { Suspense } from "react";
import FormulaireConnexion from "./FormulaireConnexion";

export const metadata = { title: "Connexion" };

async function AvecErreur({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  const sp = await searchParams;
  return <FormulaireConnexion erreurLien={sp.erreur === "lien"} />;
}

export default function Connexion({ searchParams }: PageProps<"/admin/connexion">) {
  return (
    <main className="flex flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_20px_50px_-30px_rgba(10,26,47,0.5)]">
        <Image src="/logo/logo-horizontal-couleur-fond-clair.svg" alt="Web Online Concept" width={220} height={71} className="h-14 w-auto" />
        <h1 className="mt-6 text-2xl font-semibold">Back-office</h1>
        <p className="mt-2 text-[15px] text-[#4A6178]">Recevez un lien de connexion par e-mail.</p>
        <div className="mt-6">
          <Suspense fallback={<FormulaireConnexion />}>
            <AvecErreur searchParams={searchParams as Promise<{ erreur?: string }>} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
