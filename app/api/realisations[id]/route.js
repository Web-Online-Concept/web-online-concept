import { query } from '@/app/lib/db'
import { NextResponse } from 'next/server'
import { verifyAuth } from '@/app/lib/auth'

// PUT - Modifier une réalisation
export async function PUT(request, { params }) {
  try {
    // Vérifier l'authentification
    const authResult = verifyAuth()
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const realisationId = params.id
    const { titre, url, image, description } = await request.json()

    if (!titre || !image) {
      return NextResponse.json({ error: 'Titre et image requis' }, { status: 400 })
    }

    const result = await query(
      `UPDATE realisations 
       SET titre = $1, url = $2, image = $3, description = $4, date_modification = CURRENT_TIMESTAMP 
       WHERE id = $5 
       RETURNING *`,
      [titre, url || null, image, description || null, realisationId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Réalisation non trouvée' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Erreur modification réalisation:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la modification' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une réalisation
export async function DELETE(request, { params }) {
  try {
    // Vérifier l'authentification
    const authResult = verifyAuth()
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const realisationId = params.id
    
    const result = await query(
      'DELETE FROM realisations WHERE id = $1 RETURNING titre',
      [realisationId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Réalisation non trouvée' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      message: `Réalisation "${result.rows[0].titre}" supprimée` 
    })
  } catch (error) {
    console.error('Erreur suppression réalisation:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}