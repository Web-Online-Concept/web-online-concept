import { NextResponse } from 'next/server'
import { getPostById, updatePost, deletePost, generateUniqueSlug } from '@/lib/blog-db'

// GET - Récupérer un article par son ID
export async function GET(request, { params }) {
  try {
    const post = await getPostById(params.id)
    
    if (!post) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(post)
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'article' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour un article
export async function PUT(request, { params }) {
  try {
    const data = await request.json()
    
    // Vérifier que l'article existe
    const existingPost = await getPostById(params.id)
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      )
    }
    
    // Validation des données obligatoires
    if (!data.title || !data.content) {
      return NextResponse.json(
        { error: 'Le titre et le contenu sont obligatoires' },
        { status: 400 }
      )
    }
    
    // Si le slug a changé, vérifier qu'il est unique
    if (data.slug && data.slug !== existingPost.slug) {
      data.slug = await generateUniqueSlug(data.slug, params.id)
    } else if (!data.slug) {
      // Générer un nouveau slug basé sur le titre
      data.slug = await generateUniqueSlug(
        data.title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
        params.id
      )
    }
    
    // Si l'article passe en publié et n'a pas de date, utiliser maintenant
    if (data.status === 'published' && !data.published_at && existingPost.status !== 'published') {
      data.published_at = new Date().toISOString()
    }
    
    // Mettre à jour l'article
    await updatePost(params.id, data)
    
    return NextResponse.json({
      message: 'Article mis à jour avec succès',
      slug: data.slug
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'article:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'article' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un article
export async function DELETE(request, { params }) {
  try {
    // Vérifier que l'article existe
    const existingPost = await getPostById(params.id)
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      )
    }
    
    // Supprimer l'article
    await deletePost(params.id)
    
    return NextResponse.json({
      message: 'Article supprimé avec succès'
    })
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'article:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'article' },
      { status: 500 }
    )
  }
}