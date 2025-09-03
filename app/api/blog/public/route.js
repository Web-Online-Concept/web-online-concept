import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

// GET - Récupérer les articles publiés (accès public)
export async function GET(request) {
  try {
    const sql = neon(process.env.DATABASE_URL)
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    
    if (slug) {
      // Récupérer un article spécifique par slug
      const result = await sql`
        SELECT * FROM blog_articles 
        WHERE slug = ${slug} 
        AND status = 'published'
      `
      
      if (result.length === 0) {
        return NextResponse.json({ error: 'Article non trouvé' }, { status: 404 })
      }
      
      // Incrémenter les vues
      await sql`
        UPDATE blog_articles 
        SET views = COALESCE(views, 0) + 1 
        WHERE id = ${result[0].id}
      `
      
      return NextResponse.json(result[0])
    } else {
      // Récupérer tous les articles publiés
      const result = await sql`
        SELECT * FROM blog_articles 
        WHERE status = 'published' 
        ORDER BY COALESCE(published_at, created_at) DESC
      `
      
      return NextResponse.json(result)
    }
  } catch (error) {
    console.error('Erreur récupération articles publics:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des articles' },
      { status: 500 }
    )
  }
}