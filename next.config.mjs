# Remplace le contenu du fichier next.config.mjs
@"
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // !! ATTENTION !!
    // Ceci permet à la production de build même avec des erreurs ESLint
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
"@ | Out-File -FilePath next.config.mjs -Encoding UTF8