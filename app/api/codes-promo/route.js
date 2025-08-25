import { NextResponse } from 'next/server'
import { query } from '@/app/lib/db'

export async function POST(request) {
  try {
    const { code } = await request.json()
    
    if (!code) {
      return NextResponse.json({ valid: false })
    }

    // Chercher le code promo dans la base de données
    const result = await query(
      'SELECT * FROM codes_promo WHERE UPPER(code) = UPPER($1) AND active = true',
      [code]
    )
    
    if (result.rows.length > 0) {
      const promo = result.rows[0]
      return NextResponse.json({ 
        valid: true, 
        reduction: promo.reduction,
        type: promo.type,
        description: promo.description
      })
    }
    
    return NextResponse.json({ valid: false })
  } catch (error) {
    console.error('Erreur vérification code promo:', error)
    return NextResponse.json({ valid: false })
  }
}