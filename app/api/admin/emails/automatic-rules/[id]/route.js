import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const dataPath = path.join(process.cwd(), 'app/data/automatic-rules.json')

// PUT - Modifier une règle
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const updatedRule = await request.json()
    
    // Lire les règles existantes
    const data = await fs.readFile(dataPath, 'utf8')
    const rules = JSON.parse(data)
    
    // Trouver et mettre à jour la règle
    const index = rules.findIndex(r => r.id === id)
    if (index === -1) {
      return NextResponse.json(
        { error: 'Règle non trouvée' },
        { status: 404 }
      )
    }
    
    // Mettre à jour en conservant certaines propriétés
    rules[index] = {
      ...rules[index],
      ...updatedRule,
      id: rules[index].id,
      createdAt: rules[index].createdAt,
      lastTriggered: rules[index].lastTriggered,
      emailsSent: rules[index].emailsSent,
      updatedAt: new Date().toISOString()
    }
    
    // Sauvegarder
    await fs.writeFile(dataPath, JSON.stringify(rules, null, 2))
    
    return NextResponse.json(rules[index])
  } catch (error) {
    console.error('Erreur modification règle:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la modification' },
      { status: 500 }
    )
  }
}

// PATCH - Modifier partiellement une règle (ex: activer/désactiver)
export async function PATCH(request, { params }) {
  try {
    const { id } = params
    const updates = await request.json()
    
    // Lire les règles existantes
    const data = await fs.readFile(dataPath, 'utf8')
    const rules = JSON.parse(data)
    
    // Trouver et mettre à jour la règle
    const index = rules.findIndex(r => r.id === id)
    if (index === -1) {
      return NextResponse.json(
        { error: 'Règle non trouvée' },
        { status: 404 }
      )
    }
    
    // Appliquer les modifications partielles
    rules[index] = {
      ...rules[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    // Sauvegarder
    await fs.writeFile(dataPath, JSON.stringify(rules, null, 2))
    
    return NextResponse.json(rules[index])
  } catch (error) {
    console.error('Erreur modification règle:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la modification' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une règle
export async function DELETE(request, { params }) {
  try {
    const { id } = params
    
    // Lire les règles existantes
    const data = await fs.readFile(dataPath, 'utf8')
    const rules = JSON.parse(data)
    
    // Filtrer pour supprimer la règle
    const filteredRules = rules.filter(r => r.id !== id)
    
    if (filteredRules.length === rules.length) {
      return NextResponse.json(
        { error: 'Règle non trouvée' },
        { status: 404 }
      )
    }
    
    // Sauvegarder
    await fs.writeFile(dataPath, JSON.stringify(filteredRules, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur suppression règle:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}