export const metadata = {
  title: 'Tarifs Création Site Internet - Devis Gratuit | Web Online Concept',
  description: 'Découvrez nos tarifs pour la création de site web professionnel. Prix transparents, options flexibles, hébergement inclus. Devis personnalisé gratuit sous 24h.',
  keywords: 'tarif création site web, prix site internet, devis site vitrine gratuit, combien coute un site web, tarif site web professionnel, prix creation site internet entreprise',
  openGraph: {
    title: 'Tarifs Création Site Web - Prix Transparents | Web Online Concept',
    description: 'Tarifs clairs pour votre site web professionnel. Formule tout inclus, options sur mesure. Devis gratuit et sans engagement.',
    type: 'website',
    url: 'https://web-online-concept.fr/infos-tarifs',
    siteName: 'Web Online Concept',
    locale: 'fr_FR',
    images: [
      {
        url: 'https://web-online-concept.fr/images/og-tarifs.jpg',
        width: 1200,
        height: 630,
        alt: 'Tarifs création site web - Web Online Concept'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tarifs Site Web Pro - Prix Transparents | Web Online Concept',
    description: 'Créez votre site web professionnel. Tarifs adaptés à vos besoins, tout inclus : design, responsive, hébergement.',
    images: ['https://web-online-concept.fr/images/og-tarifs.jpg']
  },
  alternates: {
    canonical: 'https://web-online-concept.fr/infos-tarifs'
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

export default function InfosTarifsLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Création de sites web",
            "name": "Site Web Professionnel 5 pages",
            "description": "Création de site web professionnel 5 pages tout inclus avec hébergement et nom de domaine la première année",
            "provider": {
              "@type": "Organization",
              "name": "Web Online Concept",
              "url": "https://web-online-concept.fr"
            },
            "offers": {
              "@type": "Offer",
              "priceCurrency": "EUR",
              "priceValidUntil": "2025-12-31",
              "itemOffered": {
                "@type": "Service",
                "name": "Site web professionnel sur mesure"
              }
            },
            "areaServed": {
              "@type": "Country",
              "name": "France"
            }
          })
        }}
      />
      {children}
    </>
  )
}