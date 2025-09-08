// app/sitemap.js
export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.web-online-concept.com'
  
  // Pages statiques principales
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/infos-tarifs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/demande-devis`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/ia`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/realisations`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/florent-regnault`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/mentions-legales`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/cgv`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/politique-confidentialite`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ]

  // Récupérer tous les articles du blog
  let blogPosts = []
  try {
    const response = await fetch(`${baseUrl}/api/blog/articles`, {
      next: { revalidate: 3600 }, // Cache 1 heure
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (response.ok) {
      const articles = await response.json()
      
      // Mapper les articles publiés vers le format sitemap
      // Prioriser les articles récents
      const now = new Date()
      blogPosts = articles
        .filter(article => article.status === 'published')
        .map(article => {
          const lastModDate = new Date(article.updated_at || article.created_at)
          const daysSinceUpdate = Math.floor((now - lastModDate) / (1000 * 60 * 60 * 24))
          
          // Ajuster la priorité selon la fraîcheur du contenu
          let priority = 0.7
          if (daysSinceUpdate < 7) priority = 0.8
          else if (daysSinceUpdate < 30) priority = 0.7
          else if (daysSinceUpdate < 90) priority = 0.6
          else priority = 0.5
          
          return {
            url: `${baseUrl}/blog/${article.slug}`,
            lastModified: lastModDate,
            changeFrequency: daysSinceUpdate < 30 ? 'weekly' : 'monthly',
            priority: priority,
          }
        })
        // Trier par date de modification décroissante
        .sort((a, b) => b.lastModified - a.lastModified)
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des articles pour le sitemap:', error)
  }

  // Ajouter des pages virtuelles importantes pour le SEO
  const seoPages = [
    {
      url: `${baseUrl}/creation-site-internet`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
      // Page virtuelle qui redirige vers l'accueil avec ancre
    },
    {
      url: `${baseUrl}/site-web-500-euros`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
      // Page virtuelle pour capturer ce mot-clé
    },
  ]

  // Images sitemap (si vous avez des images importantes)
  const imageSitemap = {
    url: `${baseUrl}/sitemap-images.xml`,
    lastModified: new Date(),
  }

  // Combiner toutes les pages et limiter à 50000 URLs (limite Google)
  const allUrls = [...staticPages, ...blogPosts, ...seoPages]
    .slice(0, 50000)
    // Filtrer les doublons
    .filter((item, index, self) => 
      index === self.findIndex((t) => t.url === item.url)
    )

  return allUrls
}

// Fonction helper pour générer aussi un sitemap index si nécessaire
export async function generateSitemapIndex() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.web-online-concept.com'
  
  return {
    sitemaps: [
      {
        url: `${baseUrl}/sitemap.xml`,
        lastModified: new Date(),
      },
      // Ajouter d'autres sitemaps si nécessaire (images, vidéos, etc.)
    ],
  }
}