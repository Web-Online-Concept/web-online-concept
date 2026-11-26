// Couverture d'un article : son image si elle existe, sinon un visuel aux couleurs du site (orbite et
// catégorie). Remplit son parent (position relative et taille à fournir).
export default function CouvertureArticle({
  image,
  categorie,
  priorite = false,
}: {
  image: string | null;
  categorie: string;
  priorite?: boolean;
}) {
  if (image) {
    return (
      // Images d'articles : adresses libres (dossier public ou stockage), d'où une balise img simple
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt=""
        loading={priorite ? "eager" : "lazy"}
        fetchPriority={priorite ? "high" : undefined}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-nuit">
      <div className="absolute -left-16 -top-20 h-64 w-64 rounded-full bg-bleu opacity-40 blur-3xl" />
      <div className="absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-vert opacity-20 blur-3xl" />
      <svg viewBox="0 0 400 225" className="absolute inset-0 h-full w-full" fill="none" preserveAspectRatio="xMidYMid slice">
        <g transform="rotate(-12 200 112)">
          <ellipse cx="200" cy="112" rx="170" ry="52" stroke="#00B4D8" strokeOpacity="0.55" strokeWidth="1.4" />
          <ellipse cx="200" cy="112" rx="115" ry="35" stroke="#1F5EFF" strokeOpacity="0.35" />
        </g>
        <circle cx="200" cy="112" r="26" fill="#1F5EFF" fillOpacity="0.85" />
        <circle cx="352" cy="78" r="5" fill="#2BD47D" />
      </svg>
      <span className="absolute bottom-4 left-5 text-sm font-medium text-[#C3D0DD]">{categorie}</span>
    </div>
  );
}
