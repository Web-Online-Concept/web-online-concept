import localFont from "next/font/local";

// Police du site, partagée par les deux mises en page racines ([lang] et (interne))
export const sora = localFont({
  src: "./fonts/Sora.ttf",
  variable: "--font-sora",
  weight: "100 800",
  display: "swap",
});
