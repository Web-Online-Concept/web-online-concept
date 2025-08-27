import { NextResponse } from 'next/server'
import { updateCategory, deleteCategory, getAllCategories } from '@/lib/blog-db'
import { verifyAuth } from '@/app/lib/auth'

// PUT - Mettre à jour une catégorie
export async function PUT(request, { params }) {
  try {
    // Vérifier l'authentification
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const data = await request.json()
    const categoryId = parseInt(params.id)
    
    // Validation des données obligatoires
    if (!data.name || !data.slug) {
      return NextResponse.json(
        { error: 'Le nom et le slug sont obligatoires' },
        { status: 400 }
      )
    }
    
    // Validation du format du slug
    const slugRegex = /^[a-z0-9-]+$/
    if (!slugRegex.test(data.slug)) {
      return NextResponse.json(
        { error: 'Le slug ne doit contenir que des lettres minuscules, chiffres et tirets' },
        { status: 400 }
      )
    }
    
    // Vérifier que le slug n'est pas déjà utilisé par une autre catégorie
    const existingCategories = await getAllCategories()
    const duplicateSlug = existingCategories.some(
      cat => cat.slug === data.slug && cat.id !== categoryId
    )
    
    if (duplicateSlug) {
      return NextResponse.json(
        { error: 'Une autre catégorie utilise déjà ce slug' },
        { status: 400 }
      )
    }
    
    // Mettre à jour la catégorie
    await updateCategory(
      categoryId,
      data.name,
      data.slug,
      data.description || null
    )
    
    return NextResponse.json({
      message: 'Catégorie mise à jour avec succès'
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la catégorie' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une catégorie
export async function DELETE(request, { params }) {
  try {
    // Vérifier l'authentification
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const categoryId = parseInt(params.id)
    
    // Vérifier si la catégorie existe et n'a pas d'articles
    const categories = await getAllCategories()
    const category = categories.find(cat => cat.id === categoryId)
    
    if (!category) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      )
    }
    
    if (category.post_count > 0) {
      return NextResponse.json(
        { error: `Impossible de supprimer cette catégorie car elle contient ${category.post_count} article${category.post_count > 1 ? 's' : ''}` },
        { status: 400 }
      )
    }
    
    // Supprimer la catégorie
    await deleteCategory(categoryId)
    
    return NextResponse.json({
      message: 'Catégorie supprimée avec succès'
    })
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la catégorie' },
      { status: 500 }
    )
  }
}