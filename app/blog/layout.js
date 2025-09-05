// app/blog/layout.js
export const metadata = {
  title: 'Blog Web Design & Création Site Internet - Conseils Pro',
  description: 'Découvrez nos articles sur la création de sites web, le webdesign, le SEO et le marketing digital. Conseils pratiques pour développer votre présence en ligne.',
  keywords: 'blog création site web, conseils webdesign, tutoriels SEO, marketing digital, développement web, tendances web design',
  openGraph: {
    title: 'Blog - Web Online Concept',
    description: 'Articles et conseils sur la création de sites web et le marketing digital',
    images: [{
      url: 'https://www.web-online-concept.com/images/og-blog.jpg',
      width: 1200,
      height: 630,
      alt: 'Blog Web Online Concept'
    }],
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.web-online-concept.com/blog'
  }
}

export default function BlogLayout({ children }) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Blog Web Online Concept",
            "description": "Articles sur la création de sites web et le marketing digital",
            "url": "https://www.web-online-concept.com/blog",
            "publisher": {
              "@type": "Organization",
              "name": "Web Online Concept",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.web-online-concept.com/images/logo.png"
              }
            }
          })
        }}
      />
    </>
  )
}