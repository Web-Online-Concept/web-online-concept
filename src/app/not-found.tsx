import Link from "next/link";

export default function PageIntrouvable() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-nuit px-6 py-32 text-center text-white">
      <p className="text-sm text-[#B8C6D6]">Erreur 404</p>
      <h1 className="text-[clamp(2rem,4vw,3rem)] font-semibold">Cette page n&apos;existe pas ou a été déplacée.</h1>
      <Link href="/" className="rounded-full bg-bleu px-6 py-3 font-medium hover:bg-[#3A72FF]">
        Revenir à l&apos;accueil
      </Link>
    </main>
  );
}
