import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostsByCategory, getCategoryBySlug, getAllCategories, getPopularPosts } from '@/lib/blog-db'
import BlogSearch from '@/components/BlogSearch'
import BlogPagination from '@/components/BlogPagination'

// Génération des métadonnées
export async function generateMetadata({ params }) {
  const category = await getCategoryBySlug(params.slug)
  
  if (!category) {
    return {
      title: 'Catégorie non trouvée - Web Online Concept',
    }
  }
  
  return {
    title: `${category.name} - Blog Web Online Concept`,
    description: category.description || `Tous nos articles sur ${category.name}. Conseils, tutoriels et actualités.`,
    keywords: `${category.name}, blog, création site web, seo, webdesign`,
  }
}

export default async function BlogCategoryPage({ params, searchParams }) {
  const category = await getCategoryBySlug(params.slug)
  
  if (!category) {
    notFound()
  }
  
  const page = parseInt(searchParams.page || '1')
  const { posts, totalPages, currentPage } = await getPostsByCategory(params.slug, page)
  const allCategories = await getAllCategories()
  const popularPosts = await getPopularPosts()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0073a8] via-[#00b4d8] to-[#006a87] text-white py-16">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-4 text-sm text-center">
            <Link href="/" className="hover:underline opacity-80">Accueil</Link>
            <span className="mx-2 opacity-60">/</span>
            <Link href="/blog" className="hover:underline opacity-80">Blog</Link>
            <span className="mx-2 opacity-60">/</span>
            <span className="opacity-90">{category.name}</span>
          </nav>
          
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-xl text-center opacity-90 max-w-3xl mx-auto">
              {category.description}
            </p>
          )}
          <p className="text-center mt-4 opacity-80">
            {category.post_count} article{category.post_count > 1 ? 's' : ''} publié{category.post_count > 1 ? 's' : ''}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles */}
          <div className="lg:col-span-2">
            {/* Search Bar */}
            <div className="mb-8">
              <BlogSearch />
            </div>

            {/* Articles Grid */}
            {posts.length > 0 ? (
              <div className="grid gap-8">
                {posts.map((post) => (
                  <article 
                    key={post.id} 
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <Link href={`/blog/${post.slug}`}>
                      <div className="relative h-64 md:h-80">
                        {post.featured_image ? (
                          <Image
                            src={post.featured_image}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#0073a8] to-[#00b4d8] flex items-center justify-center">
                            <span className="text-white text-4xl font-bold opacity-30">
                              {post.title.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                    
                    <div className="p-6">
                      {/* Categories (excluding current) */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.categories
                          .filter(cat => cat.slug !== params.slug)
                          .map((cat) => (
                            <Link
                              key={cat.id}
                              href={`/blog/categorie/${cat.slug}`}
                              className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-300 transition-colors"
                            >
                              {cat.name}
                            </Link>
                          ))}
                        {/* Current category highlighted */}
                        <span className="text-xs bg-[#0073a8] text-white px-3 py-1 rounded-full">
                          {category.name}
                        </span>
                      </div>
                      
                      <Link href={`/blog/${post.slug}`}>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-[#0073a8] transition-colors">
                          {post.title}
                        </h2>
                      </Link>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          <span>{new Date(post.published_at).toLocaleDateString('fr-FR')}</span>
                          {post.views_count > 0 && (
                            <span className="ml-4">{post.views_count} vues</span>
                          )}
                        </div>
                        
                        <Link 
                          href={`/blog/${post.slug}`}
                          className="text-[#0073a8] font-semibold hover:text-[#006a87] transition-colors"
                        >
                          Lire la suite →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600">Aucun article dans cette catégorie pour le moment.</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12">
                <BlogPagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  basePath={`/blog/categorie/${params.slug}`}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* All Categories */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Toutes les catégories</h3>
              <ul className="space-y-2">
                {allCategories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/blog/categorie/${cat.slug}`}
                      className={`flex items-center justify-between transition-colors ${
                        cat.slug === params.slug
                          ? 'text-[#0073a8] font-semibold'
                          : 'text-gray-700 hover:text-[#0073a8]'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-sm text-gray-500">({cat.post_count})</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/blog"
                className="block mt-4 text-sm text-center text-gray-600 hover:text-[#0073a8] transition-colors"
              >
                ← Voir tous les articles
              </Link>
            </div>

            {/* Popular Posts */}
            {popularPosts.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Articles populaires</h3>
                <ul className="space-y-4">
                  {popularPosts.map((post) => (
                    <li key={post.id}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="block group"
                      >
                        <div className="flex gap-3">
                          {post.featured_image ? (
                            <div className="relative w-20 h-20 flex-shrink-0">
                              <Image
                                src={post.featured_image}
                                alt={post.title}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                          ) : (
                            <div className="w-20 h-20 flex-shrink-0 bg-gradient-to-br from-[#0073a8] to-[#00b4d8] rounded flex items-center justify-center">
                              <span className="text-white text-xl font-bold opacity-50">
                                {post.title.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#0073a8] transition-colors line-clamp-2">
                              {post.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {post.views_count} vues
                            </p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Category Info */}
            {category.description && (
              <div className="bg-gradient-to-br from-[#0073a8]/10 to-[#00b4d8]/10 rounded-lg p-6 mb-8 border border-[#0073a8]/20">
                <h3 className="text-lg font-bold text-gray-900 mb-3">À propos de cette catégorie</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {category.description}
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="bg-gradient-to-br from-[#0073a8] to-[#00b4d8] rounded-lg shadow-md p-6 text-white">
              <h3 className="text-xl font-bold mb-3">Besoin d'un site web ?</h3>
              <p className="text-sm opacity-90 mb-4">
                Concrétisez votre projet web avec notre équipe d'experts.
              </p>
              <Link
                href="/demande-devis"
                className="block text-center bg-white text-[#0073a8] font-semibold py-2 px-4 rounded hover:bg-gray-100 transition-colors"
              >
                Demander un devis gratuit
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}