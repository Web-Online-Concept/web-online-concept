import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 bg-ciel px-6 py-24 text-center">
      <Image
        src="/logo/logo-horizontal-couleur-fond-clair.svg"
        alt="Web Online Concept"
        width={420}
        height={135}
        priority
      />
      <p className="max-w-md text-lg text-nuit/80">
        Nouveau site en préparation.
      </p>
    </main>
  );
}
