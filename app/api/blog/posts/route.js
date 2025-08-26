import { NextResponse } from 'next/server'
import { createPost, getAllPosts, generateUniqueSlug } from '@/lib/blog-db'

// GET - Récupérer tous les articles
export async function GET() {
  try {
    const posts = await getAllPosts()
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des articles' },
      { status: 500 }
    )
  }
}

// POST - Créer un nouvel article
export async function POST(request) {
  try {
    const data = await request.json()
    
    // Validation des données obligatoires
    if (!data.title || !data.content) {
      return NextResponse.json(
        { error: 'Le titre et le contenu sont obligatoires' },
        { status: 400 }
      )
    }
    
    // Générer un slug s'il n'est pas fourni ou s'assurer qu'il est unique
    if (!data.slug) {
      data.slug = await generateUniqueSlug(
        data.title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      )
    } else {
      // Vérifier que le slug est unique
      data.slug = await generateUniqueSlug(data.slug)
    }
    
    // Si l'article est publié mais sans date, utiliser la date actuelle
    if (data.status === 'published' && !data.published_at) {
      data.published_at = new Date().toISOString()
    }
    
    // Créer l'article
    const postId = await createPost(data)
    
    return NextResponse.json(
      { 
        message: 'Article créé avec succès',
        id: postId,
        slug: data.slug
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erreur lors de la création de l\'article:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'article' },
      { status: 500 }
    )
  }
}