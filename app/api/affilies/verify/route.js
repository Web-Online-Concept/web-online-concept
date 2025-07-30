import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'app/data')
const affiliesFile = path.join(dataDir, 'affilies.json')

// Initialiser le fichier si nécessaire
async function initializeFile() {
  try {
    await fs.access(affiliesFile)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
    const defaultData = {
      affilies: [],
      codes: {}
    }
    await fs.writeFile(affiliesFile, JSON.stringify(defaultData, null, 2))
  }
}

// GET - Vérifier un code affilié
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')?.toUpperCase()
    
    if (!code) {
      return NextResponse.json({ valid: false })
    }
    
    await initializeFile()
    const data = await fs.readFile(affiliesFile, 'utf-8')
    const { affilies } = JSON.parse(data)
    
    // Chercher le code dans les affiliés actifs
    const affilie = affilies.find(a => 
      a.code?.toUpperCase() === code && 
      a.actif !== false
    )
    
    if (affilie) {
      return NextResponse.json({ 
        valid: true,
        reduction: 30, // Réduction fixe de 30% pour le client
        affilie_id: affilie.id
      })
    }
    
    return NextResponse.json({ valid: false })
    
  } catch (error) {
    console.error('Erreur vérification code affilié:', error)
    return NextResponse.json({ valid: false })
  }
}