import { NextResponse } from 'next/server'
import { createCategory, getAllCategories } from '@/lib/blog-db'
import { verifyAuth } from '@/app/lib/auth'

// GET - Récupérer toutes les catégories
export async function GET(request) {
  try {
    // Vérifier l'authentification
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const categories = await getAllCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des catégories' },
      { status: 500 }
    )
  }
}

// POST - Créer une nouvelle catégorie
export async function POST(request) {
  try {
    // Vérifier l'authentification
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const data = await request.json()
    
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
    
    // Vérifier que le slug n'existe pas déjà
    const existingCategories = await getAllCategories()
    if (existingCategories.some(cat => cat.slug === data.slug)) {
      return NextResponse.json(
        { error: 'Une catégorie avec ce slug existe déjà' },
        { status: 400 }
      )
    }
    
    // Créer la catégorie
    const categoryId = await createCategory(
      data.name,
      data.slug,
      data.description || null
    )
    
    return NextResponse.json(
      { 
        message: 'Catégorie créée avec succès',
        id: categoryId
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la catégorie' },
      { status: 500 }
    )
  }
}