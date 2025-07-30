import { readFile, writeFile, mkdir } from 'fs/promises'
import { NextResponse } from 'next/server'
import path from 'path'

// Fonction pour charger les dépenses
async function loadDepenses() {
  try {
    const filePath = path.join(process.cwd(), 'app', 'data', 'depenses.json')
    const data = await readFile(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    // Si le fichier n'existe pas, retourner une structure vide
    return {
      depenses: [],
      categories: [
        { id: 'hebergement', nom: 'Hébergement & Domaines', icon: '🌐' },
        { id: 'logiciels', nom: 'Logiciels & Abonnements', icon: '💻' },
        { id: 'materiel', nom: 'Matériel informatique', icon: '🖥️' },
        { id: 'formation', nom: 'Formation', icon: '🎓' },
        { id: 'marketing', nom: 'Marketing & Publicité', icon: '📣' },
        { id: 'comptable', nom: 'Frais comptables', icon: '📊' },
        { id: 'bancaire', nom: 'Frais bancaires', icon: '🏦' },
        { id: 'bureau', nom: 'Fournitures bureau', icon: '📎' },
        { id: 'transport', nom: 'Transport & Déplacements', icon: '🚗' },
        { id: 'autres', nom: 'Autres', icon: '📦' }
      ]
    }
  }
}

// Fonction pour sauvegarder les dépenses
async function saveDepenses(data) {
  const dirPath = path.join(process.cwd(), 'app', 'data')
  const filePath = path.join(dirPath, 'depenses.json')
  
  // Créer le dossier s'il n'existe pas
  await mkdir(dirPath, { recursive: true })
  
  // Sauvegarder les données
  await writeFile(filePath, JSON.stringify(data, null, 2))
}

// GET - Récupérer toutes les dépenses
export async function GET() {
  try {
    const data = await loadDepenses()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors du chargement' }, { status: 500 })
  }
}

// POST - Ajouter une dépense
export async function POST(request) {
  try {
    const body = await request.json()
    const data = await loadDepenses()
    
    const newDepense = {
      id: Date.now().toString(),
      ...body,
      dateCreation: new Date().toISOString()
    }
    
    data.depenses.push(newDepense)
    await saveDepenses(data)
    
    return NextResponse.json({ success: true, depense: newDepense })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de l\'ajout' }, { status: 500 })
  }
}

// PUT - Modifier une dépense
export async function PUT(request) {
  try {
    const body = await request.json()
    const { id, ...depenseData } = body
    
    const data = await loadDepenses()
    const index = data.depenses.findIndex(d => d.id === id)
    
    if (index === -1) {
      return NextResponse.json({ error: 'Dépense non trouvée' }, { status: 404 })
    }
    
    data.depenses[index] = {
      ...data.depenses[index],
      ...depenseData,
      id,
      dateModification: new Date().toISOString()
    }
    
    await saveDepenses(data)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la modification' }, { status: 500 })
  }
}

// DELETE - Supprimer une dépense
export async function DELETE(request) {
  try {
    const body = await request.json()
    const { id } = body
    
    const data = await loadDepenses()
    data.depenses = data.depenses.filter(d => d.id !== id)
    
    await saveDepenses(data)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
  }
}