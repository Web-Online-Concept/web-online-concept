import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
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
