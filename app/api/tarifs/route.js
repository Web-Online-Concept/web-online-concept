import { query } from '@/app/lib/db'
import { NextResponse } from 'next/server'
import { verifyAuth } from '@/app/lib/auth'

export async function GET() {
  try {
    // Récupérer la formule de base
    const formuleResult = await query('SELECT * FROM formule_base LIMIT 1')
    const formuleBase = formuleResult.rows[0] || {
      nom: 'Site Web - Formule de Base',
      prix: 500,
      description: 'Site 5 pages, design personnalisé, responsive, SEO de base, hébergement 1 an inclus'
    }

    // Récupérer les options
    const optionsResult = await query('SELECT * FROM options WHERE active = true ORDER BY ordre, nom')
    const optionsFromDB = optionsResult.rows

    // Ordre personnalisé des options
    const ordrePersonnalise = [
      'page-supplementaire',
      'pack-photos',
      'hebergement',
      'redaction',
      'blog',
      'maintenance',
      'back-office',
      'ecommerce',
      'seo',
      'logo',
      'multilingue',
      'reservation',
      'emails',
      'newsletter'
    ]

    // Réorganiser les options selon l'ordre personnalisé
    const options = ordrePersonnalise
      .map(id => optionsFromDB.find(opt => opt.id === id))
      .filter(opt => opt !== undefined)
    
    // Ajouter les options non listées à la fin
    const optionsNonListees = optionsFromDB.filter(
      opt => !ordrePersonnalise.includes(opt.id)
    )
    options.push(...optionsNonListees)

    // Récupérer les codes promo - SANS les colonnes date_debut et date_fin
    const promoResult = await query(`
      SELECT * FROM codes_promo 
      WHERE active = true 
      ORDER BY code
    `)
    const remises = promoResult.rows

    const tarifs = {
      formuleBase,
      options,
      remises
    }

    return NextResponse.json(tarifs)
  } catch (error) {
    console.error('Erreur lecture tarifs:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la lecture des tarifs' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    // Vérifier l'authentification
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const tarifs = await request.json()

    // Mettre à jour la formule de base
    if (tarifs.formuleBase) {
      await query(
        'UPDATE formule_base SET nom = $1, prix = $2, description = $3 WHERE id = 1',
        [tarifs.formuleBase.nom, tarifs.formuleBase.prix, tarifs.formuleBase.description]
      )
    }

    // Mettre à jour les options
    if (tarifs.options) {
      for (const option of tarifs.options) {
        await query(
          'UPDATE options SET nom = $1, prix = $2, unite = $3, description = $4, ordre = $5, active = $6 WHERE id = $7',
          [option.nom, option.prix, option.unite, option.description, option.ordre, option.active !== false, option.id]
        )
      }
    }

    // Supprimer tous les codes promo existants
    await query('DELETE FROM codes_promo')
    
    // Ajouter les nouveaux codes promo
    if (tarifs.remises) {
      for (const remise of tarifs.remises) {
        await query(
          'INSERT INTO codes_promo (code, reduction, type, description, active) VALUES ($1, $2, $3, $4, $5)',
          [remise.code, remise.reduction, remise.type, remise.description, remise.active !== false]
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur mise à jour tarifs:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des tarifs' },
      { status: 500 }
    )
  }
}