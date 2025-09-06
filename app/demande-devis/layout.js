// app/demande-devis/layout.js
export const metadata = {
  title: 'Demande de Devis Gratuit - Configurateur en Ligne | Web Online Concept',
  description: 'Configurez votre site web et obtenez un devis gratuit instantané. Formule de base à 500€ + options sur mesure. Réponse garantie sous 24h.',
  keywords: 'devis site web gratuit, configurateur site internet, devis création site web, prix site internet personnalisé, devis en ligne site web',
  openGraph: {
    title: 'Demande de Devis Site Web Gratuit - Configurateur en Ligne',
    description: 'Configurez votre site web et obtenez un devis gratuit instantané. Formule de base à 500€ + options sur mesure.',
    url: 'https://www.web-online-concept.com/demande-devis',
    siteName: 'Web Online Concept',
    images: [{
      url: 'https://www.web-online-concept.com/images/og-devis.jpg',
      width: 1200,
      height: 630,
      alt: 'Configurateur de devis Web Online Concept'
    }],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Demande de Devis Site Web Gratuit',
    description: 'Configurez votre site web et obtenez un devis gratuit instantané.',
    images: ['https://www.web-online-concept.com/images/og-devis.jpg'],
  },
  alternates: {
    canonical: 'https://www.web-online-concept.com/demande-devis',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
}

export default function DemandeDevisLayout({ children }) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Demande de Devis Gratuit - Web Online Concept",
            "description": "Configurateur de devis en ligne pour la création de sites web professionnels",
            "url": "https://www.web-online-concept.com/demande-devis",
            "provider": {
              "@type": "Organization",
              "name": "Web Online Concept",
              "url": "https://www.web-online-concept.com"
            },
            "potentialAction": {
              "@type": "OrderAction",
              "target": "https://www.web-online-concept.com/demande-devis",
              "result": {
                "@type": "Order",
                "orderStatus": "OrderDraft"
              }
            }
          })
        }}
      />
    </>
  )
}