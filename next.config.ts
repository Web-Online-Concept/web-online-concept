import type { NextConfig } from "next";
import { reecritures } from "./src/lib/i18n/chemins";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // Page 404 commune aux deux mises en page racines (site trilingue et espace interne)
    globalNotFound: true,
    // Images du blog envoyées depuis le back-office (Vercel limite les requêtes à 4,5 Mo)
    serverActions: { bodySizeLimit: "4mb" },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Adresses publiques traduites (/realisations, /en/work, /es/proyectos…) vers les dossiers de src/app/[lang].
  // Après les fichiers publics (les images de public/realisations et public/blog gardent leur adresse),
  // avant les routes dynamiques (sinon /realisations serait pris pour une langue).
  async rewrites() {
    return { beforeFiles: [], afterFiles: reecritures(), fallback: [] };
  },
  // Anciennes adresses du site (2025) vers les nouvelles pages
  async redirects() {
    return [
      { source: "/infos-tarifs", destination: "/capacites", permanent: true },
      { source: "/demande-devis", destination: "/contact", permanent: true },
      { source: "/devis-gratuit", destination: "/contact", permanent: true },
      { source: "/devis/confirmation", destination: "/contact", permanent: true },
      { source: "/services", destination: "/capacites", permanent: true },
      { source: "/ia", destination: "/methode", permanent: true },
      { source: "/florent-regnault", destination: "/a-propos", permanent: true },
      { source: "/cgv", destination: "/mentions-legales", permanent: true },
      { source: "/politique-confidentialite", destination: "/confidentialite", permanent: true },
      { source: "/admin-:page", destination: "/admin", permanent: false },
    ];
  },
};

export default nextConfig;
