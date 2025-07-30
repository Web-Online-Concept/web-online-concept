import { NextResponse } from 'next/server'
import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'

// Fonction pour charger les clients
async function loadClients() {
  try {
    const filePath = path.join(process.cwd(), 'app', 'data', 'clients.json')
    const data = await readFile(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    // Si le fichier n'existe pas, retourner des clients de démonstration
    return [
      {
        id: 'CLI-001',
        entreprise: 'Restaurant Le Gourmet',
        contact: 'Jean Dupont',
        email: 'contact@legourmet.fr',
        telephone: '01 42 86 82 82',
        adresse: '12 rue de la Paix',
        ville: 'Paris',
        codePostal: '75002',
        pays: 'France',
        siteWeb: 'https://restaurant-legourmet.fr',
        status: 'actif',
        notes: 'Client depuis 2022. Site vitrine + réservation en ligne. Très satisfait du service.',
        dateCreation: '2022-03-15',
        stats: {
          totalFacture: 5400,
          totalPaye: 5400,
          nombreProjets: 2,
          derniereInteraction: '2024-12-15'
        }
      },
      {
        id: 'CLI-002',
        entreprise: 'Boutique Mode & Style',
        contact: 'Marie Martin',
        email: 'marie@modestyle.fr',
        telephone: '01 45 67 89 90',
        adresse: '78 avenue des Champs',
        ville: 'Paris',
        codePostal: '75008',
        pays: 'France',
        siteWeb: 'https://modestyle.fr',
        status: 'actif',
        notes: 'E-commerce avec catalogue de 500 produits. Maintenance mensuelle.',
        dateCreation: '2023-01-20',
        stats: {
          totalFacture: 8200,
          totalPaye: 7200,
          nombreProjets: 3,
          derniereInteraction: '2025-01-10'
        }
      },
      {
        id: 'CLI-003',
        entreprise: 'Cabinet Avocat Durand',
        contact: 'Paul Durand',
        email: 'contact@cabinet-durand.fr',
        telephone: '01 40 50 60 70',
        adresse: '15 boulevard Saint-Germain',
        ville: 'Paris',
        codePostal: '75007',
        pays: 'France',
        status: 'actif',
        notes: 'Site institutionnel avec espace client sécurisé.',
        dateCreation: '2023-06-10',
        stats: {
          totalFacture: 4500,
          totalPaye: 4500,
          nombreProjets: 1,
          derniereInteraction: '2024-11-20'
        }
      },
      {
        id: 'CLI-004',
        entreprise: 'Test Personnel',
        contact: 'Test User',
        email: 'flotoulouse7@gmail.com',
        telephone: '06 00 00 00 00',
        adresse: 'Adresse test',
        ville: 'Toulouse',
        codePostal: '31000',
        pays: 'France',
        status: 'actif',
        notes: 'Client de test pour les emails',
        dateCreation: new Date().toISOString().split('T')[0],
        stats: {
          totalFacture: 0,
          totalPaye: 0,
          nombreProjets: 0,
          derniereInteraction: new Date().toISOString()
        }
      }
    ]
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

// GET - Récupérer tous les clients
export async function GET() {
  try {
    const clients = await loadClients()
    return NextResponse.json(clients)
  } catch (error) {
    console.error('Erreur GET clients:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Créer un nouveau client
export async function POST(request) {
  try {
    const body = await request.json()
    const clients = await loadClients()
    
    // Générer un nouvel ID
    const lastId = clients.length > 0 
      ? parseInt(clients[clients.length - 1].id.split('-')[1]) 
      : 0
    const newId = `CLI-${String(lastId + 1).padStart(3, '0')}`
    
    const newClient = {
      id: newId,
      ...body,
      dateCreation: new Date().toISOString().split('T')[0],
      status: body.status || 'actif',
      stats: {
        totalFacture: 0,
        totalPaye: 0,
        nombreProjets: 0,
        derniereInteraction: new Date().toISOString()
      }
    }
    
    clients.push(newClient)
    await saveClients(clients)
    
    return NextResponse.json({ success: true, client: newClient })
  } catch (error) {
    console.error('Erreur POST client:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT - Mettre à jour un client
export async function PUT(request) {
  try {
    const body = await request.json()
    const { id, ...clientData } = body
    
    const clients = await loadClients()
    const index = clients.findIndex(c => c.id === id)
    
    if (index === -1) {
      return NextResponse.json({ error: 'Client non trouvé' }, { status: 404 })
    }
    
    clients[index] = {
      ...clients[index],
      ...clientData,
      stats: {
        ...clients[index].stats,
        derniereInteraction: new Date().toISOString()
      }
    }
    
    await saveClients(clients)
    return NextResponse.json({ success: true, client: clients[index] })
  } catch (error) {
    console.error('Erreur PUT client:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE - Supprimer un client
export async function DELETE(request) {
  try {
    const body = await request.json()
    const { id } = body
    
    const clients = await loadClients()
    const filteredClients = clients.filter(c => c.id !== id)
    
    if (filteredClients.length === clients.length) {
      return NextResponse.json({ error: 'Client non trouvé' }, { status: 404 })
    }
    
    await saveClients(filteredClients)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur DELETE client:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}