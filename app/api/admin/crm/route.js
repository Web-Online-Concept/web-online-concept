import { readFile, writeFile, mkdir } from 'fs/promises'
import { NextResponse } from 'next/server'
import path from 'path'

// Fonction pour charger les clients
async function loadClients() {
  try {
    const filePath = path.join(process.cwd(), 'app', 'data', 'clients.json')
    const data = await readFile(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    // Si le fichier n'existe pas, retourner une structure par défaut
    return []
  }
}

// Fonction pour sauvegarder les clients
async function saveClients(clients) {
  const dirPath = path.join(process.cwd(), 'app', 'data')
  const filePath = path.join(dirPath, 'clients.json')
  
  // Créer le dossier s'il n'existe pas
  await mkdir(dirPath, { recursive: true })
  
  // Sauvegarder les données
  await writeFile(filePath, JSON.stringify(clients, null, 2))
}

// Générer un ID unique pour un client
function generateClientId(clients) {
  const currentIds = clients.map(c => {
    const match = c.id.match(/CLI-(\d+)/)
    return match ? parseInt(match[1]) : 0
  })
  
  const maxId = currentIds.length > 0 ? Math.max(...currentIds) : 0
  return `CLI-${String(maxId + 1).padStart(3, '0')}`
}

// GET - Récupérer tous les clients
export async function GET() {
  try {
    const clients = await loadClients()
    return NextResponse.json(clients)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors du chargement des clients' }, { status: 500 })
  }
}

// POST - Ajouter un client
export async function POST(request) {
  try {
    const body = await request.json()
    const clients = await loadClients()
    
    // Créer le nouveau client avec un ID généré
    const newClient = {
      id: generateClientId(clients),
      ...body,
      stats: {
        totalFacture: 0,
        totalPaye: 0,
        nombreProjets: 0,
        derniereInteraction: new Date().toISOString().split('T')[0]
      },
      historique: [
        {
          date: new Date().toISOString(),
          type: 'creation',
          description: 'Création de la fiche client'
        }
      ]
    }
    
    clients.push(newClient)
    await saveClients(clients)
    
    return NextResponse.json({ success: true, client: newClient })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de l\'ajout du client' }, { status: 500 })
  }
}

// PUT - Modifier un client
export async function PUT(request) {
  try {
    const body = await request.json()
    const { clientId, clientData } = body
    
    const clients = await loadClients()
    const clientIndex = clients.findIndex(c => c.id === clientId)
    
    if (clientIndex === -1) {
      return NextResponse.json({ error: 'Client non trouvé' }, { status: 404 })
    }
    
    // Conserver les stats et l'historique
    const existingClient = clients[clientIndex]
    
    // Mettre à jour le client
    clients[clientIndex] = {
      ...existingClient,
      ...clientData,
      id: clientId, // Conserver l'ID
      stats: existingClient.stats, // Conserver les stats
      historique: [
        ...(existingClient.historique || []),
        {
          date: new Date().toISOString(),
          type: 'modification',
          description: 'Modification des informations client'
        }
      ]
    }
    
    await saveClients(clients)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la modification' }, { status: 500 })
  }
}

// DELETE - Supprimer un client
export async function DELETE(request) {
  try {
    const body = await request.json()
    const { clientId } = body
    
    const clients = await loadClients()
    const filteredClients = clients.filter(c => c.id !== clientId)
    
    if (filteredClients.length === clients.length) {
      return NextResponse.json({ error: 'Client non trouvé' }, { status: 404 })
    }
    
    await saveClients(filteredClients)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
  }
}