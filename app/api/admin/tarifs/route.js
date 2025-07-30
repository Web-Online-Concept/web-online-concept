import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const dataFilePath = path.join(process.cwd(), 'app/data/tarifs.json')

// Tarifs par défaut
const defaultTarifs = {
  siteWeb: 500,
  pageSupp: 50,
  hebergement: 40,
  emailPro: 120,
  maintenance: 120,
  redactionSiteComplet: 150,
  redactionPageSupp: 20,
  packImages: 50,
  backOffice: 150
}

// Initialiser le fichier si nécessaire
async function initializeFile() {
  try {
    await fs.access(dataFilePath)
  } catch {
    const dir = path.dirname(dataFilePath)
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(dataFilePath, JSON.stringify(defaultTarifs, null, 2))
  }
}

// GET - Récupérer les tarifs
export async function GET() {
  try {
    await initializeFile()
    const data = await fs.readFile(dataFilePath, 'utf-8')
    const tarifs = JSON.parse(data)
    
    return NextResponse.json(tarifs)
  } catch (error) {
    console.error('Erreur GET tarifs:', error)
    return NextResponse.json(defaultTarifs)
  }
}

// PUT - Mettre à jour les tarifs
export async function PUT(request) {
  try {
    const body = await request.json()
    
    // Valider que tous les tarifs sont présents et sont des nombres
    const updatedTarifs = {}
    for (const [key, defaultValue] of Object.entries(defaultTarifs)) {
      const value = body[key]
      if (typeof value === 'number' && value >= 0) {
        updatedTarifs[key] = value
      } else {
        updatedTarifs[key] = defaultValue
      }
    }
    
    // Sauvegarder
    await fs.writeFile(dataFilePath, JSON.stringify(updatedTarifs, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      tarifs: updatedTarifs 
    })
    
  } catch (error) {
    console.error('Erreur PUT tarifs:', error)
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
  }
}