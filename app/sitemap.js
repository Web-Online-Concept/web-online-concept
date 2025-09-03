export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  
  // Pages statiques principales
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tarifs`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/realisations`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Récupérer tous les articles du blog
  let blogPosts = []
  try {
    const response = await fetch(`${baseUrl}/api/blog/articles`, {
      cache: 'no-store'
    })
    
    if (response.ok) {
      const articles = await response.json()
      
      // Mapper les articles publiés vers le format sitemap
      blogPosts = articles
        .filter(article => article.status === 'published')
        .map(article => ({
          url: `${baseUrl}/blog/${article.slug}`,
          lastModified: new Date(article.updated_at || article.created_at),
          changeFrequency: 'monthly',
          priority: 0.6,
        }))
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des articles pour le sitemap:', error)
  }

  // Récupérer les catégories du blog si elles ont des pages dédiées
  let categories = []
  try {
    // Si vous avez des pages de catégories, décommentez et adaptez :
    // const categoriesResponse = await fetch(`${baseUrl}/api/blog/categories`)
    // if (categoriesResponse.ok) {
    //   const cats = await categoriesResponse.json()
    //   categories = cats.map(cat => ({
    //     url: `${baseUrl}/blog/category/${cat.slug}`,
    //     lastModified: new Date(),
    //     changeFrequency: 'weekly',
    //     priority: 0.5,
    //   }))
    // }
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error)
  }

  // Combiner toutes les pages
  return [...staticPages, ...blogPosts, ...categories]
}