import { query } from '@/app/lib/db'
import { NextResponse } from 'next/server'
import { verifyAuth } from '@/app/lib/auth'

// GET - Récupérer toutes les réalisations
export async function GET() {
  try {
    const result = await query(
      'SELECT * FROM realisations ORDER BY ordre ASC, date_creation DESC'
    )
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Erreur lecture réalisations:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la lecture des réalisations' },
      { status: 500 }
    )
  }
}

// POST - Ajouter une nouvelle réalisation
export async function POST(request) {
  try {
    // Vérifier l'authentification
    const authResult = verifyAuth()
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { titre, url, image, description } = await request.json()

    if (!titre || !image) {
      return NextResponse.json({ error: 'Titre et image requis' }, { status: 400 })
    }

    const result = await query(
      'INSERT INTO realisations (titre, url, image, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [titre, url || null, image, description || null]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Erreur création réalisation:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création' },
      { status: 500 }
    )
  }
}