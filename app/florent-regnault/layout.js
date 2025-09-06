// app/florent-regnault/layout.js
export const metadata = {
  title: 'Florent Regnault - Responsable Web Online Concept',
  description: 'Carte de visite digitale de Florent Regnault, Responsable chez Web Online Concept. Création de sites web professionnels.',
  keywords: 'florent regnault, web online concept, carte visite digitale, création site web',
  openGraph: {
    title: 'Florent Regnault - Web Online Concept',
    description: 'Découvrez ma carte de visite digitale. Contactez-moi pour votre projet web.',
    url: 'https://www.web-online-concept.com/florent-regnault',
    siteName: 'Web Online Concept',
    images: [{
      url: 'https://www.web-online-concept.com/images/og-card-florent.jpg',
      width: 1200,
      height: 630,
      alt: 'Carte de visite Florent Regnault'
    }],
    type: 'profile',
    profile: {
      firstName: 'Florent',
      lastName: 'Regnault',
      username: 'florentregnault',
    }
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Florent Regnault - Web Online Concept',
    description: 'Carte de visite digitale - Création de sites web professionnels',
    images: ['https://www.web-online-concept.com/images/og-card-florent.jpg'],
    creator: '@webonlinecom'
  },
  alternates: {
    canonical: 'https://www.web-online-concept.com/florent-regnault',
  },
  robots: {
    index: true,
    follow: true,
  },
  // Pour mobile
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Florent Regnault',
  }
}

export default function FlorentCardLayout({ children }) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Florent Regnault",
            "jobTitle": "Responsable",
            "worksFor": {
              "@type": "Organization",
              "name": "Web Online Concept",
              "url": "https://www.web-online-concept.com"
            },
            "email": "web.online.concept@gmail.com",
            "telephone": "+33603369342",
            "url": "https://www.web-online-concept.com/florent-regnault",
            "sameAs": [
              "https://x.com/webonlinecom"
            ]
          })
        }}
      />
    </>
  )
}