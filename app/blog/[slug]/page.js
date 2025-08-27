import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, recordPostView, getRecentPosts, getPostsByCategory } from '@/lib/blog-db'
import { remark } from 'remark'
import html from 'remark-html'
import ShareButtons from '@/components/ShareButtons'
import { headers } from 'next/headers'
import { convertChatGPTToHTML, cleanExistingContent } from '@/utils/convertChatGPTToHTML'

// Fonction pour détecter si le contenu est du HTML
function isHTML(content) {
  // Vérifier si le contenu contient des balises HTML courantes
  const htmlPattern = /<(p|div|h[1-6]|ul|ol|li|strong|em|a|article|section)\b[^>]*>/i
  return htmlPattern.test(content)
}

// Fonction pour convertir le Markdown en HTML
async function markdownToHtml(markdown) {
  const result = await remark().use(html).process(markdown)
  return result.toString()
}

// Fonction pour traiter le contenu (HTML ou Markdown)
async function processContent(content) {
  if (isHTML(content)) {
    // Si c'est déjà du HTML, retourner tel quel
    return content
  } else {
    // Essayer de détecter si c'est du format ChatGPT
    if (content.includes('**') || content.includes('*') || content.match(/^[🔍📱🌍🚀🛠️]/m)) {
      // Convertir depuis le format ChatGPT
      return convertChatGPTToHTML(content)
    } else {
      // Sinon, convertir le Markdown en HTML
      return await markdownToHtml(content)
    }
  }
}

// Génération des métadonnées
export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug)
  
  if (!post) {
    return {
      title: 'Article non trouvé - Web Online Concept',
    }
  }
  
  return {
    title: post.meta_title || `${post.title} - Web Online Concept`,
    description: post.meta_description || post.excerpt,
    keywords: post.meta_keywords,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      type: 'article',
      publishedTime: post.published_at,
      authors: [post.author],
      images: post.featured_image ? [{ url: post.featured_image }] : [],
    },
  }
}

// Fonction pour estimer le temps de lecture
function calculateReadingTime(text) {
  const wordsPerMinute = 200
  // Retirer les balises HTML pour le comptage
  const textWithoutHtml = text.replace(/<[^>]*>/g, '')
  const wordCount = textWithoutHtml.trim().split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return minutes
}

export default async function BlogArticlePage({ params }) {
  const post = await getPostBySlug(params.slug)
  
  if (!post) {
    notFound()
  }
  
  // Enregistrer une vue
  const headersList = headers()
  const ipAddress = headersList.get('x-forwarded-for') || 'unknown'
  const userAgent = headersList.get('user-agent') || 'unknown'
  
  // DEBUG: Log pour voir l'ID réel
  console.log('Post ID:', post.id, 'Post slug:', post.slug)
  
  try {
    await recordPostView(post.id, ipAddress, userAgent)
  } catch (error) {
    console.error('Erreur recordPostView:', error)
    // Continue sans bloquer l'affichage
  }
  
  // Traiter le contenu (HTML ou Markdown)
  const contentHtml = await processContent(post.content)
  
  // Calculer le temps de lecture
  const readingTime = calculateReadingTime(post.content)
  
  // Récupérer les articles similaires (même catégorie)
  let relatedPosts = []
  if (post.categories && post.categories.length > 0) {
    const { posts } = await getPostsByCategory(post.categories[0].slug, 1, 4)
    relatedPosts = posts.filter(p => p.id !== post.id).slice(0, 3)
  }
  
  // Si pas assez d'articles similaires, compléter avec des articles récents
  if (relatedPosts.length < 3) {
    const recentPosts = await getRecentPosts(5)
    const additionalPosts = recentPosts
      .filter(p => p.id !== post.id && !relatedPosts.find(rp => rp.id === p.id))
      .slice(0, 3 - relatedPosts.length)
    relatedPosts = [...relatedPosts, ...additionalPosts]
  }
  
  const articleUrl = `https://web-online-concept.vercel.app/blog/${post.slug}`
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section avec image */}
      <section className="relative h-[400px] md:h-[500px]">
        {post.featured_image ? (
          <>
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0073a8] via-[#00b4d8] to-[#006a87]" />
        )}
        
        <div className="absolute inset-0 flex items-end">
          <div className="container max-w-4xl mx-auto px-4 pb-12 text-white">
            {/* Breadcrumb */}
            <nav className="mb-4 text-sm">
              <Link href="/" className="hover:underline opacity-80">Accueil</Link>
              <span className="mx-2 opacity-60">/</span>
              <Link href="/blog" className="hover:underline opacity-80">Blog</Link>
              <span className="mx-2 opacity-60">/</span>
              <span className="opacity-90">{post.title}</span>
            </nav>
            
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/blog/categorie/${category.slug}`}
                  className="text-xs bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full hover:bg-white/30 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-4" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm opacity-90">
              <span>Par {post.author}</span>
              <span>•</span>
              <time dateTime={post.published_at}>
                {new Date(post.published_at).toLocaleDateString('fr-FR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </time>
              <span>•</span>
              <span>{readingTime} min de lecture</span>
              <span>•</span>
              <span>{post.views_count + 1} vues</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Content */}
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Article Content */}
          <article className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 md:p-10">
              {/* Share Buttons */}
              <div className="mb-8 pb-8 border-b">
                <ShareButtons 
                  url={articleUrl}
                  title={post.title}
                  description={post.excerpt}
                />
              </div>
              
              {/* Excerpt */}
              {post.excerpt && (
                <div className="text-xl text-gray-700 leading-relaxed mb-8 font-medium">
                  {post.excerpt}
                </div>
              )}
              
              {/* Content */}
              <div 
                className="prose prose-lg max-w-none
                  prose-headings:text-gray-900 
                  prose-h1:text-3xl prose-h1:font-bold prose-h1:mt-8 prose-h1:mb-4
                  prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:font-bold prose-h3:mt-6 prose-h3:mb-3
                  prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                  prose-a:text-[#0073a8] prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-gray-900 prose-strong:font-semibold
                  prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4
                  prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4
                  prose-li:text-gray-700 prose-li:mb-2
                  prose-blockquote:border-l-4 prose-blockquote:border-[#0073a8] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:my-6
                  prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                  prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
                  prose-img:rounded-lg prose-img:shadow-md prose-img:mx-auto
                  [&_p]:mb-4 [&_p:last-child]:mb-0
                  [&_.MsoNormal]:mb-4 [&_.MsoListBullet*]:list-disc [&_.MsoListBullet*]:ml-6
                  [&_.MsoListNumber*]:list-decimal [&_.MsoListNumber*]:ml-6"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
              
              {/* Share Buttons Bottom */}
              <div className="mt-12 pt-8 border-t">
                <p className="text-center text-gray-600 mb-4">Cet article vous a plu ? Partagez-le !</p>
                <ShareButtons 
                  url={articleUrl}
                  title={post.title}
                  description={post.excerpt}
                />
              </div>
            </div>
          </article>
          
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* CTA */}
            <div className="bg-gradient-to-br from-[#0073a8] to-[#00b4d8] rounded-lg shadow-md p-6 mb-8 text-white">
              <h3 className="text-xl font-bold mb-3">Besoin d'un site web professionnel ?</h3>
              <p className="text-sm opacity-90 mb-4">
                Notre équipe d'experts est là pour concrétiser votre projet web.
              </p>
              <Link
                href="/demande-devis"
                className="block text-center bg-white text-[#0073a8] font-semibold py-3 px-4 rounded hover:bg-gray-100 transition-colors"
              >
                Demander un devis gratuit
              </Link>
            </div>
            
            {/* Articles similaires */}
            {relatedPosts.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Articles similaires</h3>
                <div className="space-y-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      href={`/blog/${relatedPost.slug}`}
                      className="block group"
                    >
                      <div className="flex gap-4">
                        <div className="relative w-24 h-24 flex-shrink-0">
                          {relatedPost.featured_image ? (
                            <Image
                              src={relatedPost.featured_image}
                              alt={relatedPost.title}
                              fill
                              className="object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#0073a8] to-[#00b4d8] rounded-lg flex items-center justify-center">
                              <span className="text-white text-2xl font-bold opacity-50">
                                {relatedPost.title.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 group-hover:text-[#0073a8] transition-colors line-clamp-2">
                            {relatedPost.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {relatedPost.excerpt}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(relatedPost.published_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}