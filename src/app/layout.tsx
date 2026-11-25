import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const sora = localFont({
  src: "./fonts/Sora.ttf",
  variable: "--font-sora",
  weight: "100 800",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Web Online Concept",
  description:
    "Imaginez-le et Web Online Concept le réalise afin d'atteindre vos objectifs.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${sora.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
