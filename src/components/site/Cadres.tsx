import Image from "next/image";
import type { Visuel } from "@/lib/contenu";

// Captures d'écran présentées dans un cadre de navigateur ou de téléphone.

export function CadreNavigateur({
  v,
  sizes = "(min-width: 1024px) 640px, 100vw",
  priorite = false,
  className = "",
}: {
  v: Visuel;
  sizes?: string;
  priorite?: boolean;
  className?: string;
}) {
  return (
    <figure className={`overflow-hidden rounded-xl bg-[#10233F] shadow-[0_30px_60px_-30px_rgba(2,8,20,0.7)] ring-1 ring-white/10 ${className}`}>
      <div className="flex h-7 items-center gap-1.5 px-3" aria-hidden="true">
        <span className="h-2 w-2 rounded-full bg-[#3B5A85]" />
        <span className="h-2 w-2 rounded-full bg-[#3B5A85]" />
        <span className="h-2 w-2 rounded-full bg-[#3B5A85]" />
        <span className="ml-3 h-3 w-1/3 rounded-full bg-[#1A3358]" />
      </div>
      <Image src={v.src} alt={v.alt} width={v.l} height={v.h} sizes={sizes} priority={priorite} className="block h-auto w-full" />
    </figure>
  );
}

// petit : bords et arrondis réduits, pour un téléphone affiché en petit format
export function CadreTelephone({
  v,
  sizes = "(min-width: 1024px) 280px, 60vw",
  priorite = false,
  petit = false,
  className = "",
}: {
  v: Visuel;
  sizes?: string;
  priorite?: boolean;
  petit?: boolean;
  className?: string;
}) {
  return (
    <figure
      className={`bg-[#10233F] shadow-[0_30px_60px_-30px_rgba(2,8,20,0.75)] ring-1 ring-white/12 ${petit ? "rounded-[1.4rem] p-1.5" : "rounded-[2.2rem] p-2"} ${className}`}
    >
      <Image
        src={v.src}
        alt={v.alt}
        width={v.l}
        height={v.h}
        sizes={sizes}
        priority={priorite}
        className={`block h-auto w-full ${petit ? "rounded-[1.1rem]" : "rounded-[1.8rem]"}`}
      />
    </figure>
  );
}

export function Cadre(props: { v: Visuel; sizes?: string; priorite?: boolean; className?: string }) {
  return props.v.format === "telephone" ? <CadreTelephone {...props} /> : <CadreNavigateur {...props} />;
}
