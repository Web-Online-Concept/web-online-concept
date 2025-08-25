import { NextResponse } from 'next/server'
import { query } from '@/app/lib/db'
import { verifyAuth } from '@/app/lib/auth'

// GET - Récupérer les tarifs (public)
export async function GET() {
  try {
    // Récupérer la formule de base
    const formuleBaseResult = await query('SELECT * FROM formule_base LIMIT 1')
    const formuleBase = formuleBaseResult.rows[0] || {
      nom: "Site Web - Formule de Base",
      prix: 500,
      description: "Site 5 pages, design personnalisé, responsive, SEO de base, hébergement 1 an inclus"
    }

    // Récupérer les options
    const optionsResult = await query('SELECT * FROM options WHERE active = true ORDER BY ordre, nom')
    const options = optionsResult.rows

    // Récupérer les codes promo actifs
    const remisesResult = await query(
      `SELECT * FROM codes_promo 
       WHERE active = true 
       AND (date_debut IS NULL OR date_debut <= CURRENT_DATE)
       AND (date_fin IS NULL OR date_fin >= CURRENT_DATE)
       ORDER BY code`
    )
    const remises = remisesResult.rows

    // Formater comme l'ancien JSON
    const tarifs = {
      formuleBase: {
        nom: formuleBase.nom,
        prix: parseFloat(formuleBase.prix),
        description: formuleBase.description
      },
      options: options.map(opt => ({
        id: opt.id,
        nom: opt.nom,
        prix: parseFloat(opt.prix),
        unite: opt.unite,
        description: opt.description
      })),
      remises: remises.map(rem => ({
        code: rem.code,
        reduction: parseFloat(rem.reduction),
        type: rem.type,
        description: rem.description
      }))
    }

    return NextResponse.json(tarifs)
  } catch (error) {
    console.error('Erreur lecture tarifs:', error)
    return NextResponse.json({ error: 'Erreur lors de la lecture des tarifs' }, { status: 500 })
  }
}

// POST - Mettre à jour les tarifs (authentifié)
export async function POST(request) {
  try {
    // Vérifier l'authentification
    const auth = verifyAuth()
    
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { tarifs } = await request.json()

    // Transaction pour tout mettre à jour
    await query('BEGIN')

    try {
      // 1. Mettre à jour la formule de base
      await query(
        'UPDATE formule_base SET nom = $1, prix = $2, description = $3 WHERE id = (SELECT id FROM formule_base LIMIT 1)',
        [tarifs.formuleBase.nom, tarifs.formuleBase.prix, tarifs.formuleBase.description]
      )

      // Si aucune ligne mise à jour, insérer
      const updateResult = await query('SELECT * FROM formule_base')
      if (updateResult.rowCount === 0) {
        await query(
          'INSERT INTO formule_base (nom, prix, description) VALUES ($1, $2, $3)',
          [tarifs.formuleBase.nom, tarifs.formuleBase.prix, tarifs.formuleBase.description]
        )
      }

      // 2. Désactiver toutes les options existantes
      await query('UPDATE options SET active = false')

      // 3. Insérer ou mettre à jour les options
      for (let i = 0; i < tarifs.options.length; i++) {
        const option = tarifs.options[i]
        
        // Essayer de mettre à jour d'abord
        const result = await query(
          `UPDATE options 
           SET nom = $2, prix = $3, unite = $4, description = $5, ordre = $6, active = true
           WHERE id = $1`,
          [option.id, option.nom, option.prix, option.unite || null, option.description || null, i]
        )

        // Si aucune ligne mise à jour, insérer
        if (result.rowCount === 0) {
          await query(
            'INSERT INTO options (id, nom, prix, unite, description, ordre, active) VALUES ($1, $2, $3, $4, $5, $6, true)',
            [option.id, option.nom, option.prix, option.unite || null, option.description || null, i]
          )
        }
      }

      // 4. Désactiver tous les codes promo existants
      await query('UPDATE codes_promo SET active = false')

      // 5. Insérer ou mettre à jour les codes promo
      for (const remise of tarifs.remises) {
        // Essayer de mettre à jour d'abord
        const result = await query(
          `UPDATE codes_promo 
           SET reduction = $2, type = $3, description = $4, active = true
           WHERE code = $1`,
          [remise.code, remise.reduction, remise.type, remise.description]
        )

        // Si aucune ligne mise à jour, insérer
        if (result.rowCount === 0) {
          await query(
            'INSERT INTO codes_promo (code, reduction, type, description, active) VALUES ($1, $2, $3, $4, true)',
            [remise.code, remise.reduction, remise.type, remise.description]
          )
        }
      }

      await query('COMMIT')

      return NextResponse.json({ 
        success: true, 
        message: 'Tarifs mis à jour avec succès' 
      })
    } catch (error) {
      await query('ROLLBACK')
      throw error
    }
  } catch (error) {
    console.error('Erreur mise à jour tarifs:', error)
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
  }
}