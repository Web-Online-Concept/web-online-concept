import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { neon } from '@neondatabase/serverless'
import jwt from 'jsonwebtoken'

// Vérifier l'authentification
async function verifyAuth(request) {
  const cookieStore = cookies()
  const token = cookieStore.get('token')
  
  if (!token) {
    return false
  }
  
  try {
    jwt.verify(token.value, process.env.JWT_SECRET)
    return true
  } catch (error) {
    return false
  }
}

// GET - Récupérer tous les articles ou un article spécifique
export async function GET(request) {
  try {
    const sql = neon(process.env.DATABASE_URL)
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const slug = searchParams.get('slug')
    const status = searchParams.get('status')
    
    // Pour l'admin, vérifier l'auth pour voir tous les articles
    // Pour le public, ne montrer que les articles publiés
    const isAdmin = await verifyAuth(request)
    
    // Si la requête vient de la page admin et n'est pas authentifiée
    const referer = request.headers.get('referer') || ''
    if (referer.includes('/admin-blog') && !isAdmin) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    
    if (id) {
      // Récupérer un article par ID
      const query = isAdmin 
        ? `SELECT * FROM blog_articles WHERE id = $1`
        : `SELECT * FROM blog_articles WHERE id = $1 AND status = 'published'`
      
      const result = await sql(query, [id])
      
      if (result.length === 0) {
        return NextResponse.json({ error: 'Article non trouvé' }, { status: 404 })
      }
      
      return NextResponse.json(result[0])
    } else if (slug) {
      // Récupérer un article par slug (pour les URLs publiques)
      const query = isAdmin 
        ? `SELECT * FROM blog_articles WHERE slug = $1`
        : `SELECT * FROM blog_articles WHERE slug = $1 AND status = 'published'`
      
      const result = await sql(query, [slug])
      
      if (result.length === 0) {
        return NextResponse.json({ error: 'Article non trouvé' }, { status: 404 })
      }
      
      // Incrémenter les vues si c'est une visite publique
      if (!isAdmin) {
        await sql`UPDATE blog_articles SET views = views + 1 WHERE id = ${result[0].id}`
      }
      
      return NextResponse.json(result[0])
    } else {
      // Récupérer tous les articles
      let query = isAdmin 
        ? `SELECT * FROM blog_articles`
        : `SELECT * FROM blog_articles WHERE status = 'published'`
      
      // Filtrer par statut si demandé (admin seulement)
      if (status && isAdmin) {
        query = `SELECT * FROM blog_articles WHERE status = $1`
        const result = await sql(query, [status])
        return NextResponse.json(result)
      }
      
      // Ordre par date de création décroissante
      query += ` ORDER BY created_at DESC`
      
      const result = await sql(query)
      return NextResponse.json(result)
    }
  } catch (error) {
    console.error('Erreur GET articles:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des articles' },
      { status: 500 }
    )
  }
}

// POST - Créer un nouvel article (admin seulement)
export async function POST(request) {
  // Vérifier l'authentification
  if (!await verifyAuth(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  
  try {
    const sql = neon(process.env.DATABASE_URL)
    const body = await request.json()
    
    // Valider les données requises
    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: 'Titre et slug requis' },
        { status: 400 }
      )
    }
    
    // Vérifier que le slug est unique
    const existingSlug = await sql`
      SELECT id FROM blog_articles WHERE slug = ${body.slug}
    `
    
    if (existingSlug.length > 0) {
      return NextResponse.json(
        { error: 'Ce slug existe déjà' },
        { status: 400 }
      )
    }
    
    // Créer l'article
    const result = await sql`
      INSERT INTO blog_articles (
        title,
        slug,
        content,
        excerpt,
        category,
        featured_image,
        status,
        published_at
      ) VALUES (
        ${body.title},
        ${body.slug},
        ${body.content || ''},
        ${body.excerpt || null},
        ${body.category || null},
        ${body.featured_image || null},
        ${body.status || 'draft'},
        ${body.status === 'published' ? new Date() : null}
      )
      RETURNING *
    `
    
    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error('Erreur POST article:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'article' },
      { status: 500 }
    )
  }
}

// PUT - Modifier un article (admin seulement)
export async function PUT(request) {
  // Vérifier l'authentification
  if (!await verifyAuth(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  
  try {
    const sql = neon(process.env.DATABASE_URL)
    const body = await request.json()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de l\'article requis' },
        { status: 400 }
      )
    }
    
    // Vérifier que l'article existe
    const existing = await sql`
      SELECT id, status FROM blog_articles WHERE id = ${id}
    `
    
    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      )
    }
    
    // Si le statut passe à "published", mettre à jour published_at
    let publishedAt = null
    if (body.status === 'published' && existing[0].status !== 'published') {
      publishedAt = new Date()
    }
    
    // Mettre à jour l'article
    const result = await sql`
      UPDATE blog_articles
      SET
        title = ${body.title},
        slug = ${body.slug},
        content = ${body.content || ''},
        excerpt = ${body.excerpt || null},
        category = ${body.category || null},
        featured_image = ${body.featured_image || null},
        status = ${body.status || 'draft'},
        updated_at = CURRENT_TIMESTAMP,
        published_at = ${publishedAt ? publishedAt : sql`published_at`}
      WHERE id = ${id}
      RETURNING *
    `
    
    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Erreur PUT article:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la modification de l\'article' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un article (admin seulement)
export async function DELETE(request) {
  // Vérifier l'authentification
  if (!await verifyAuth(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  
  try {
    const sql = neon(process.env.DATABASE_URL)
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de l\'article requis' },
        { status: 400 }
      )
    }
    
    // Supprimer l'article
    const result = await sql`
      DELETE FROM blog_articles
      WHERE id = ${id}
      RETURNING id
    `
    
    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true, deletedId: id })
  } catch (error) {
    console.error('Erreur DELETE article:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'article' },
      { status: 500 }
    )
  }
}