export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin-tarifs/',
          '/admin-blog/',
          '/admin-realisations/',
          '/admin-devis/',
          '/api/',
          '/_next/',
          '/static/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin-tarifs/',
          '/admin-blog/',
          '/admin-realisations/',
          '/admin-devis/',
          '/api/',
        ],
        crawlDelay: 0,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/admin-tarifs/',
          '/admin-blog/',
          '/admin-realisations/',
          '/admin-devis/',
          '/api/',
        ],
        crawlDelay: 1,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}