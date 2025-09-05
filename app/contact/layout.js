// app/contact/layout.js
export const metadata = {
  title: 'Contact - Web Online Concept Toulouse | Devis Gratuit',
  description: 'Contactez Web Online Concept pour votre projet de site web. Basés à Toulouse, nous intervenons dans toute la France. Devis gratuit sous 24h.',
  keywords: 'contact création site web, agence web toulouse, devis site internet gratuit, contact webdesigner toulouse',
  openGraph: {
    title: 'Contactez-nous - Web Online Concept',
    description: 'Parlons de votre projet web. Devis gratuit et réponse rapide garantie.',
    images: [{
      url: 'https://www.web-online-concept.com/images/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Contact Web Online Concept'
    }],
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.web-online-concept.com/contact'
  }
}

export default function ContactLayout({ children }) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact Web Online Concept",
            "description": "Page de contact pour vos projets de création de site web",
            "url": "https://www.web-online-concept.com/contact",
            "mainEntity": {
              "@type": "Organization",
              "name": "Web Online Concept",
              "email": "web.online.concept@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Toulouse",
                "addressRegion": "Occitanie",
                "addressCountry": "FR"
              }
            }
          })
        }}
      />
    </>
  )
}