import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { verifyAuth } from '@/app/lib/auth'

const dataPath = path.join(process.cwd(), 'app', 'data', 'tarifs.json')

// GET - Récupérer les tarifs (public)
export async function GET() {
  try {
    const data = await fs.readFile(dataPath, 'utf8')
    return NextResponse.json(JSON.parse(data))
  } catch (error) {
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

    // Récupérer les tarifs
    const { tarifs } = await request.json()

    // Sauvegarder les nouveaux tarifs
    await fs.writeFile(dataPath, JSON.stringify(tarifs, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: 'Tarifs mis à jour avec succès' 
    })
  } catch (error) {
    console.error('Erreur mise à jour tarifs:', error)
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
  }
}