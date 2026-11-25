import Entete from "@/components/site/Entete";
import PiedDePage from "@/components/site/PiedDePage";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-nuit"
      >
        Aller au contenu
      </a>
      <Entete />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <PiedDePage />
    </>
  );
}
