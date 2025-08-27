import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

export default async function DebugBlog() {
  // Récupérer TOUS les articles
  const allPosts = await sql`
    SELECT id, title, slug, status, published_at, created_at 
    FROM posts 
    ORDER BY created_at DESC
  `
  
  // Récupérer les articles "publiés" selon la fonction
  const publishedPosts = await sql`
    SELECT id, title, slug, status, published_at, created_at 
    FROM posts 
    WHERE status = 'published' AND published_at <= NOW()
    ORDER BY published_at DESC
  `
  
  // Récupérer l'heure actuelle du serveur
  const serverTime = await sql`SELECT NOW() as current_time`
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Blog</h1>
      
      <div className="mb-8 bg-blue-100 p-4 rounded">
        <p className="font-semibold">Heure serveur : {serverTime[0].current_time.toString()}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Tous les articles ({allPosts.length})</h2>
          <div className="space-y-4">
            {allPosts.map(post => (
              <div key={post.id} className="bg-gray-100 p-4 rounded">
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-sm">Slug: {post.slug}</p>
                <p className="text-sm">Status: <span className={post.status === 'published' ? 'text-green-600' : 'text-yellow-600'}>{post.status}</span></p>
                <p className="text-sm">Published at: {post.published_at ? post.published_at.toString() : 'NULL'}</p>
                <p className="text-sm">Created at: {post.created_at.toString()}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Articles publiés visibles ({publishedPosts.length})</h2>
          <div className="space-y-4">
            {publishedPosts.map(post => (
              <div key={post.id} className="bg-green-100 p-4 rounded">
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-sm">Slug: {post.slug}</p>
                <p className="text-sm">Published at: {post.published_at.toString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}