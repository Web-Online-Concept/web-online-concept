// app/infos-tarifs/layout.js
export const metadata = {
  title: 'Tarifs Création Site Web - Prix Transparent dès 500€',
  description: 'Découvrez nos tarifs création site internet. Formule de base à 500€ tout compris. Prix transparents, sans surprise. Devis gratuit personnalisé.',
  keywords: 'tarif création site web, prix site internet, cout site web professionnel, tarif site vitrine, prix création site internet toulouse',
  openGraph: {
    title: 'Tarifs - Web Online Concept',
    description: 'Nos tarifs création site web à partir de 500€. Prix transparents et sans surprise.',
    images: [{
      url: 'https://www.web-online-concept.com/images/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Tarifs Web Online Concept'
    }],
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.web-online-concept.com/infos-tarifs'
  }
}

export default function InfosTarifsLayout({ children }) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Création de site web",
            "provider": {
              "@type": "Organization",
              "name": "Web Online Concept"
            },
            "offers": {
              "@type": "Offer",
              "price": "500",
              "priceCurrency": "EUR",
              "priceSpecification": {
                "@type": "PriceSpecification",
                "price": "500",
                "priceCurrency": "EUR",
                "name": "Formule de base - Site 5 pages"
              }
            },
            "areaServed": {
              "@type": "Place",
              "name": "Toulouse et France"
            }
          })
        }}
      />
    </>
  )
}