import { NextResponse } from 'next/server'
import { createPost, getAllPosts, generateUniqueSlug } from '@/lib/blog-db'
import { verifyAuth } from '@/app/lib/auth'
import { cleanHTML } from '@/utils/cleanHTML'

// GET - Récupérer tous les articles
export async function GET(request) {
  try {
    // Vérifier l'authentification
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

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
    // Vérifier l'authentification
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const data = await request.json()
    
    // Validation des données obligatoires
    if (!data.title || !data.content) {
      return NextResponse.json(
        { error: 'Le titre et le contenu sont obligatoires' },
        { status: 400 }
      )
    }
    
    // NETTOYER LE CONTENU HTML
    data.content = cleanHTML(data.content)
    
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
    
    // Nettoyer published_at - convertir chaîne vide en null
    if (data.published_at === '') {
      data.published_at = null
    }
    
    // Si l'article est publié mais sans date, utiliser la date actuelle
    if (data.status === 'published' && !data.published_at) {
      data.published_at = new Date().toISOString()
    }
    
    // Si l'article n'est pas publié, s'assurer que published_at est null
    if (data.status === 'draft') {
      data.published_at = null
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