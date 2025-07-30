import { readFile, writeFile, mkdir } from 'fs/promises'
import { NextResponse } from 'next/server'
import path from 'path'

// Fonction pour charger les projets
async function loadProjets() {
  try {
    const filePath = path.join(process.cwd(), 'app', 'data', 'agenda.json')
    const data = await readFile(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    // Si le fichier n'existe pas, retourner une structure vide
    return {
      projets: []
    }
  }
}

// Fonction pour sauvegarder les projets
async function saveProjets(data) {
  const dirPath = path.join(process.cwd(), 'app', 'data')
  const filePath = path.join(dirPath, 'agenda.json')
  
  // Créer le dossier s'il n'existe pas
  await mkdir(dirPath, { recursive: true })
  
  // Sauvegarder les données
  await writeFile(filePath, JSON.stringify(data, null, 2))
}

// GET - Récupérer tous les projets
export async function GET() {
  try {
    const data = await loadProjets()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors du chargement' }, { status: 500 })
  }
}

// POST - Ajouter un projet
export async function POST(request) {
  try {
    const body = await request.json()
    const data = await loadProjets()
    
    const newProjet = {
      id: Date.now().toString(),
      ...body,
      dateCreation: new Date().toISOString(),
      taches: body.taches || []
    }
    
    data.projets.push(newProjet)
    await saveProjets(data)
    
    return NextResponse.json({ success: true, projet: newProjet })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de l\'ajout' }, { status: 500 })
  }
}

// PUT - Modifier un projet
export async function PUT(request) {
  try {
    const body = await request.json()
    const { id, ...projetData } = body
    
    const data = await loadProjets()
    const index = data.projets.findIndex(p => p.id === id)
    
    if (index === -1) {
      return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 })
    }
    
    data.projets[index] = {
      ...data.projets[index],
      ...projetData,
      id,
      dateModification: new Date().toISOString()
    }
    
    await saveProjets(data)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la modification' }, { status: 500 })
  }
}

// DELETE - Supprimer un projet
export async function DELETE(request) {
  try {
    const body = await request.json()
    const { id } = body
    
    const data = await loadProjets()
    data.projets = data.projets.filter(p => p.id !== id)
    
    await saveProjets(data)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
  }
}