import { notFound } from 'next/navigation'
import { getPostById, getAllCategories } from '@/lib/blog-db'
import BlogArticleForm from '@/components/BlogArticleForm'

export const metadata = {
  title: 'Modifier article - Administration Blog',
  robots: 'noindex, nofollow',
}

export default async function EditArticlePage({ params }) {
  const article = await getPostById(params.id)
  
  if (!article) {
    notFound()
  }
  
  const categories = await getAllCategories()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0073a8] via-[#00b4d8] to-[#006a87] text-white py-6">
        <div className="container max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Modifier l'article</h1>
          <p className="text-white/80 mt-2">{article.title}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <BlogArticleForm 
          mode="edit"
          article={article}
          categories={categories}
        />
      </div>
    </div>
  )
}