import { NextResponse } from 'next/server'
import { query } from '@/app/lib/db'
import { verifyAuth } from '@/app/lib/auth'

export async function GET(request) {
  try {
    // Vérifier l'authentification
    const authResult = verifyAuth()
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    
    // Paramètres de filtrage
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit
    
    const search = searchParams.get('search') || ''
    const statut = searchParams.get('statut') || ''
    const dateDebut = searchParams.get('dateDebut') || ''
    const dateFin = searchParams.get('dateFin') || ''
    const sortBy = searchParams.get('sortBy') || 'date_creation'
    const sortOrder = searchParams.get('sortOrder') || 'DESC'
    
    // Construction de la requête
    let whereConditions = []
    let queryParams = []
    let paramIndex = 1
    
    // Recherche par nom, email ou numéro
    if (search) {
      whereConditions.push(`(
        client_nom ILIKE $${paramIndex} OR 
        client_email ILIKE $${paramIndex} OR 
        numero ILIKE $${paramIndex} OR
        client_entreprise ILIKE $${paramIndex}
      )`)
      queryParams.push(`%${search}%`)
      paramIndex++
    }
    
    // Filtre par statut
    if (statut) {
      whereConditions.push(`statut = $${paramIndex}`)
      queryParams.push(statut)
      paramIndex++
    }
    
    // Filtre par dates
    if (dateDebut) {
      whereConditions.push(`date_creation >= $${paramIndex}`)
      queryParams.push(dateDebut)
      paramIndex++
    }
    
    if (dateFin) {
      whereConditions.push(`date_creation <= $${paramIndex}`)
      queryParams.push(dateFin + ' 23:59:59')
      paramIndex++
    }
    
    const whereClause = whereConditions.length > 0 
      ? 'WHERE ' + whereConditions.join(' AND ') 
      : ''
    
    // Compter le total pour la pagination
    const countQuery = `SELECT COUNT(*) FROM devis ${whereClause}`
    const countResult = await query(countQuery, queryParams)
    const totalCount = parseInt(countResult.rows[0].count)
    
    // Récupérer les devis
    queryParams.push(limit, offset)
    const devisQuery = `
      SELECT 
        id, numero, date_creation, client_nom, client_email, 
        client_telephone, client_entreprise, total_ttc, statut,
        code_promo, reduction
      FROM devis 
      ${whereClause}
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `
    
    const devisResult = await query(devisQuery, queryParams)
    
    return NextResponse.json({
      devis: devisResult.rows,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    })
    
  } catch (error) {
    console.error('Erreur lecture devis:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la lecture des devis' },
      { status: 500 }
    )
  }
}

// Mettre à jour le statut d'un devis
export async function PATCH(request) {
  try {
    // Vérifier l'authentification
    const authResult = verifyAuth()
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { id, statut } = await request.json()
    
    const statutsValides = ['envoyé', 'accepté', 'refusé', 'facturé']
    if (!statutsValides.includes(statut)) {
      return NextResponse.json({ error: 'Statut invalide' }, { status: 400 })
    }
    
    await query(
      'UPDATE devis SET statut = $1 WHERE id = $2',
      [statut, id]
    )
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Erreur mise à jour statut:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    )
  }
}