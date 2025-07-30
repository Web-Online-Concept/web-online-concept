import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const dataPath = path.join(process.cwd(), 'app/data/automatic-rules.json')

// Créer le fichier s'il n'existe pas
async function ensureDataFile() {
  try {
    await fs.access(dataPath)
  } catch {
    const defaultRules = []
    await fs.writeFile(dataPath, JSON.stringify(defaultRules, null, 2))
  }
}

// GET - Récupérer toutes les règles
export async function GET() {
  try {
    await ensureDataFile()
    const data = await fs.readFile(dataPath, 'utf8')
    const rules = JSON.parse(data)
    
    return NextResponse.json(rules)
  } catch (error) {
    console.error('Erreur lecture règles:', error)
    return NextResponse.json([], { status: 500 })
  }
}

// POST - Créer une nouvelle règle
export async function POST(request) {
  try {
    await ensureDataFile()
    
    const newRule = await request.json()
    
    // Lire les règles existantes
    const data = await fs.readFile(dataPath, 'utf8')
    const rules = JSON.parse(data)
    
    // Créer la nouvelle règle
    const rule = {
      id: `RULE-${Date.now()}`,
      ...newRule,
      createdAt: new Date().toISOString(),
      lastTriggered: null,
      emailsSent: 0
    }
    
    // Ajouter la règle
    rules.push(rule)
    
    // Sauvegarder
    await fs.writeFile(dataPath, JSON.stringify(rules, null, 2))
    
    return NextResponse.json(rule, { status: 201 })
  } catch (error) {
    console.error('Erreur création règle:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la règle' },
      { status: 500 }
    )
  }
}