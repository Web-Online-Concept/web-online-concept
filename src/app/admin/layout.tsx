import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Back-office", template: "%s | Back-office Web Online Concept" },
  robots: { index: false, follow: false },
};

export default function AdminRacine({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-full flex-1 flex-col bg-ciel text-nuit">{children}</div>;
}
