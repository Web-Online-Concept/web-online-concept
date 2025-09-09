import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import '../styles/quill-custom.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL('https://www.web-online-concept.com'),
  title: {
    default: 'Création Site Internet Professionnel - Devis Gratuit | Web Online Concept',
    template: '%s | Web Online Concept'
  },
  description: 'Création de sites web professionnels sur mesure. Design moderne, responsive, hébergement inclus. Devis gratuit sous 24h. Entreprise locale à votre écoute.',
  keywords: 'création site internet, site web professionnel, création site web, webdesigner, développeur web, site vitrine, site internet entreprise',
  authors: [{ name: 'Web Online Concept' }],
  creator: 'Web Online Concept',
  publisher: 'Web Online Concept',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://www.web-online-concept.com',
    siteName: 'Web Online Concept',
    title: 'Création Site Internet Professionnel - Web Online Concept',
    description: 'Création de sites web professionnels sur mesure. Design moderne, responsive, hébergement inclus.',
    images: [
      {
        url: 'https://www.web-online-concept.com/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Web Online Concept - Création de sites internet'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web Online Concept - Création Sites Web Pro',
    description: 'Création de sites internet professionnels. Design moderne, responsive, optimisé SEO.',
    images: ['https://www.web-online-concept.com/images/og-image.jpg'],
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

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FPQGE1LFH1"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FPQGE1LFH1');
          `}
        </Script>

        <Header />
        <main>{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Web Online Concept",
              "description": "Création de sites web professionnels à prix accessible",
              "url": "https://www.web-online-concept.com",
              "telephone": "+33603369342",
              "email": "web.online.concept@gmail.com",
              "priceRange": "€€",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "rue Paul Estival",
                "addressLocality": "Toulouse",
                "addressRegion": "Occitanie",
                "postalCode": "31200",
                "addressCountry": "FR"
              },
              "sameAs": [
                "https://x.com/webonlinecom"
              ]
            })
          }}
        />
      </body>
    </html>
  )
}