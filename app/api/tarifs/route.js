import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const dataPath = path.join(process.cwd(), 'app', 'data', 'tarifs.json')

// GET - Récupérer les tarifs
export async function GET() {
  try {
    const data = await fs.readFile(dataPath, 'utf8')
    return NextResponse.json(JSON.parse(data))
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la lecture des tarifs' }, { status: 500 })
  }
}

// POST - Mettre à jour les tarifs (protégé par mot de passe)
export async function POST(request) {
  try {
    const body = await request.json()
    const { password, tarifs } = body

    // Vérifier le mot de passe
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
    }

    // Sauvegarder les nouveaux tarifs
    await fs.writeFile(dataPath, JSON.stringify(tarifs, null, 2))
    
    return NextResponse.json({ success: true, message: 'Tarifs mis à jour' })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
  }
}