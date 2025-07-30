export const metadata = {
  title: 'Portfolio Sites Web - Nos Réalisations | Web Online Concept',
  description: 'Découvrez nos créations de sites web professionnels. Portfolio de sites vitrines modernes et responsives réalisés pour nos clients.',
  keywords: 'portfolio web design, réalisations sites internet, exemples sites web, création site vitrine, portfolio web developer, sites web professionnels',
  openGraph: {
    title: 'Nos Réalisations - Sites Web Professionnels | Web Online Concept',
    description: 'Explorez notre portfolio de sites web sur mesure. Design moderne, responsive et optimisé pour vos besoins professionnels.',
    type: 'website',
    url: 'https://web-online-concept.fr/realisations',
    siteName: 'Web Online Concept',
    locale: 'fr_FR',
    images: [
      {
        url: 'https://web-online-concept.fr/images/og-realisations.jpg',
        width: 1200,
        height: 630,
        alt: 'Portfolio réalisations - Web Online Concept'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio - Créations Web | Web Online Concept',
    description: 'Découvrez nos réalisations de sites web professionnels, modernes et performants.',
    images: ['https://web-online-concept.fr/images/og-realisations.jpg']
  },
  alternates: {
    canonical: 'https://web-online-concept.fr/realisations'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
}

export default function RealisationsLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Portfolio - Nos Réalisations",
            "description": "Portfolio de sites web professionnels créés par Web Online Concept",
            "url": "https://web-online-concept.fr/realisations",
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": [
                {
                  "@type": "CreativeWork",
                  "name": "Sites web professionnels",
                  "description": "Collection de sites vitrines modernes et responsives"
                }
              ]
            },
            "provider": {
              "@type": "Organization",
              "name": "Web Online Concept",
              "url": "https://web-online-concept.fr"
            }
          })
        }}
      />
      {children}
    </>
  )
}