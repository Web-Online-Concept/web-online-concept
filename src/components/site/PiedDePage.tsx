import Image from "next/image";
import Link from "next/link";
import { NAVIGATION, SITE } from "@/lib/contenu";

export default function PiedDePage() {
  return (
    <footer className="bg-nuit text-[#B8C6D6]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Image
            src="/logo/logo-horizontal-couleur-fond-sombre.svg"
            alt="Web Online Concept"
            width={220}
            height={71}
            className="h-16 w-auto self-start"
          />
          <p className="max-w-sm text-[15px] leading-relaxed">
            Studio de développement web à Toulouse depuis 2009.
          </p>
          <a href={`mailto:${SITE.email}`} className="self-start text-[15px] text-white underline-offset-4 hover:underline">
            {SITE.email}
          </a>
        </div>

        <nav aria-label="Plan du site" className="flex flex-col gap-2.5 text-[15px]">
          <span className="mb-1 font-semibold text-white">Le studio</span>
          {NAVIGATION.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-white">
              {l.libelle}
            </Link>
          ))}
          <Link href="/contact" className="hover:text-white">
            Contact
          </Link>
        </nav>

        <nav aria-label="Informations légales" className="flex flex-col gap-2.5 text-[15px]">
          <span className="mb-1 font-semibold text-white">Informations</span>
          <Link href="/mentions-legales" className="hover:text-white">
            Mentions légales
          </Link>
          <Link href="/confidentialite" className="hover:text-white">
            Confidentialité
          </Link>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-5 py-5 text-sm sm:px-8">Web Online Concept, Toulouse.</p>
      </div>
    </footer>
  );
}
