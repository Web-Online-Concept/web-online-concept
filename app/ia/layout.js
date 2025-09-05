export const metadata = {
  title: 'Assistant Virtuel IA - Testez Notre Intelligence Artificielle',
  description: 'Découvrez la puissance d\'un assistant virtuel IA pour votre entreprise. Testez gratuitement notre chatbot intelligent par chat et voix. Support client 24/7, génération de leads automatisée, intégration CRM.',
  keywords: 'assistant virtuel, intelligence artificielle, chatbot IA, assistant vocal, support client automatisé, génération leads IA, CRM intelligent, automatisation entreprise, Web Online Concept Toulouse',
  openGraph: {
    title: 'Assistant Virtuel IA - Web Online Concept',
    description: 'Testez notre assistant IA intelligent et découvrez comment automatiser votre relation client. Réponses instantanées 24/7, génération de leads, intégration CRM.',
    images: [
      {
        url: 'https://web-online-concept.vercel.app/images/og-ia.jpg',
        width: 1200,
        height: 630,
        alt: 'Assistant Virtuel IA - Web Online Concept'
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Assistant Virtuel IA - Web Online Concept',
    description: 'Testez notre assistant IA intelligent. Support client 24/7, génération de leads automatisée.',
    images: ['https://web-online-concept.vercel.app/images/og-ia.jpg'],
  },
  alternates: {
    canonical: 'https://web-online-concept.vercel.app/ia'
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

export default function IALayout({ children }) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Assistant Virtuel IA - Web Online Concept",
            "description": "Assistant virtuel intelligent pour automatiser votre relation client",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR",
              "description": "Test gratuit de l'assistant virtuel"
            },
            "featureList": [
              "Support client 24/7",
              "Génération automatique de leads",
              "Intégration CRM",
              "Réponses vocales et textuelles",
              "Analyse comportementale",
              "Emails de suivi automatiques"
            ],
            "provider": {
              "@type": "Organization",
              "name": "Web Online Concept",
              "url": "https://web-online-concept.vercel.app"
            }
          })
        }}
      />
    </>
  )
}