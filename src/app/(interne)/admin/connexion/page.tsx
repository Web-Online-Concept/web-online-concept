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
    <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-nuit px-5 py-16">
      {/* Halo et orbite de la marque */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 -top-40 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(31,94,255,0.4),transparent_66%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 -right-40 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(0,180,216,0.22),transparent_66%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded-[50%] border border-cyan/15" />
      <div className="relative w-full max-w-md">
        <Image src="/logo/logo-horizontal-couleur-fond-sombre.svg" alt="Web Online Concept" width={220} height={71} className="mx-auto h-14 w-auto" priority />
        <div className="mt-8 rounded-3xl bg-white p-7 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)] sm:p-9">
          <h1 className="text-2xl font-semibold tracking-tight text-nuit">Back-office</h1>
          <p className="mt-2 text-[15px] text-[#4A6178]">Recevez un lien de connexion par e-mail : pas de mot de passe à retenir.</p>
          <div className="mt-6">
            <Suspense fallback={<FormulaireConnexion />}>
              <AvecErreur searchParams={searchParams as Promise<{ erreur?: string }>} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
