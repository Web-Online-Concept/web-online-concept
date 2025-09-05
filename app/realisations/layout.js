// app/realisations/layout.js
export const metadata = {
  title: 'Portfolio & Réalisations - Sites Web Créés | Nos Références',
  description: 'Découvrez notre portfolio de sites web réalisés. Sites vitrines, e-commerce, applications web pour TPE/PME. Exemples concrets et témoignages clients.',
  keywords: 'portfolio web design, réalisations sites internet, exemples sites web, références clients, création site vitrine, site e-commerce',
  openGraph: {
    title: 'Nos Réalisations - Web Online Concept',
    description: 'Portfolio de nos créations de sites web pour entreprises',
    images: [{
      url: 'https://www.web-online-concept.com/images/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Portfolio Web Online Concept'
    }],
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.web-online-concept.com/realisations'
  }
}

export default function RealisationsLayout({ children }) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Portfolio Web Online Concept",
            "description": "Nos réalisations de sites web",
            "url": "https://www.web-online-concept.com/realisations",
            "numberOfItems": 6,
            "itemListElement": [
              {
                "@type": "CreativeWork",
                "name": "Site web professionnel",
                "description": "Création de sites web sur mesure",
                "creator": {
                  "@type": "Organization",
                  "name": "Web Online Concept"
                }
              }
            ]
          })
        }}
      />
    </>
  )
}