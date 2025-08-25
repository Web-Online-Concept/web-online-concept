import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const dataPath = path.join(process.cwd(), 'app', 'data', 'tarifs.json')

export async function POST(request) {
  try {
    const { code } = await request.json()
    
    if (!code) {
      return NextResponse.json({ valid: false })
    }

    // Lire les tarifs pour vérifier le code promo
    const data = await fs.readFile(dataPath, 'utf8')
    const tarifs = JSON.parse(data)
    
    // Chercher le code promo
    const promo = tarifs.remises.find(r => r.code.toUpperCase() === code.toUpperCase())
    
    if (promo) {
      return NextResponse.json({ 
        valid: true, 
        reduction: promo.reduction,
        type: promo.type,
        description: promo.description
      })
    }
    
    return NextResponse.json({ valid: false })
  } catch (error) {
    return NextResponse.json({ valid: false })
  }
}