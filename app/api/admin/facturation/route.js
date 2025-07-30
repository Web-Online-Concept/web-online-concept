import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const dataPath = path.join(process.cwd(), 'app/data/facturation.json')
const eventsPath = path.join(process.cwd(), 'app/data/email-events.json')

// Fonction pour créer un événement email
async function createEmailEvent(type, data) {
  try {
    // Lire les événements existants
    let events = []
    try {
      const eventsData = await fs.readFile(eventsPath, 'utf8')
      events = JSON.parse(eventsData)
    } catch {
      // Le fichier n'existe pas encore
    }
    
    // Créer le nouvel événement
    const event = {
      id: `EVENT-${Date.now()}`,
      type,
      timestamp: new Date().toISOString(),
      processed: false,
      ...data
    }
    
    // Ajouter l'événement
    events.push(event)
    
    // Sauvegarder
    await fs.writeFile(eventsPath, JSON.stringify(events, null, 2))
    
    console.log(`📧 Événement email créé: ${type}`, event)
  } catch (error) {
    console.error('Erreur création événement email:', error)
  }
}

// GET - Lire les factures/devis
export async function GET() {
  try {
    const data = await fs.readFile(dataPath, 'utf8')
    const facturation = JSON.parse(data)
    return NextResponse.json(facturation)
  } catch (error) {
    // Si le fichier n'existe pas, retourner une structure vide
    const emptyData = { factures: [], devis: [] }
    return NextResponse.json(emptyData)
  }
}

// POST - Créer une facture/devis
export async function POST(request) {
  try {
    const body = await request.json()
    const { type, ...documentData } = body
    
    // Lire les données existantes
    let facturation = { factures: [], devis: [] }
    try {
      const data = await fs.readFile(dataPath, 'utf8')
      facturation = JSON.parse(data)
    } catch {
      // Le fichier n'existe pas encore
    }
    
    // Créer le document
    const document = {
      id: `${type.toUpperCase()}-${Date.now()}`,
      ...documentData,
      status: type === 'facture' ? 'facture' : 'devis',
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }
    
    // Ajouter selon le type
    if (type === 'facture') {
      facturation.factures.push(document)
      
      // Créer un événement pour les emails automatiques
      await createEmailEvent('facture_creee', {
        documentId: document.id,
        documentNumber: document.numero,
        clientEmail: document.email,
        clientName: document.client,
        clientCompany: document.entreprise || document.client,
        amount: document.total,
        dueDate: document.dueDate
      })
      
    } else {
      facturation.devis.push(document)
      
      // Créer un événement pour les emails automatiques
      await createEmailEvent('devis_cree', {
        documentId: document.id,
        documentNumber: document.numero,
        clientEmail: document.email,
        clientName: document.client,
        clientCompany: document.entreprise || document.client,
        amount: document.total
      })
    }
    
    // Sauvegarder
    await fs.writeFile(dataPath, JSON.stringify(facturation, null, 2))
    
    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour une facture/devis
export async function PUT(request) {
  try {
    const body = await request.json()
    const { id, type, ...updates } = body
    
    // Lire les données
    const data = await fs.readFile(dataPath, 'utf8')
    const facturation = JSON.parse(data)
    
    // Trouver et mettre à jour
    const collection = type === 'facture' ? facturation.factures : facturation.devis
    const index = collection.findIndex(item => item.id === id)
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Document non trouvé' },
        { status: 404 }
      )
    }
    
    // Garder l'ancien statut pour comparaison
    const oldDocument = collection[index]
    const oldStatus = oldDocument.paymentStatus
    
    // Mettre à jour
    collection[index] = {
      ...collection[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    // Vérifier si le paiement a changé
    if (type === 'facture' && oldStatus !== 'paid' && updates.paymentStatus === 'paid') {
      // Créer un événement "facture payée"
      await createEmailEvent('facture_payee', {
        documentId: collection[index].id,
        documentNumber: collection[index].numero,
        clientEmail: collection[index].email,
        clientName: collection[index].client,
        clientCompany: collection[index].entreprise || collection[index].client,
        amount: collection[index].total,
        paymentDate: new Date().toISOString()
      })
    }
    
    // Vérifier si le devis est accepté
    if (type === 'devis' && oldDocument.status === 'devis' && updates.status === 'accepte') {
      await createEmailEvent('devis_accepte', {
        documentId: collection[index].id,
        documentNumber: collection[index].numero,
        clientEmail: collection[index].email,
        clientName: collection[index].client,
        clientCompany: collection[index].entreprise || collection[index].client,
        amount: collection[index].total
      })
    }
    
    // Sauvegarder
    await fs.writeFile(dataPath, JSON.stringify(facturation, null, 2))
    
    return NextResponse.json(collection[index])
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une facture/devis
export async function DELETE(request) {
  try {
    const { id, type } = await request.json()
    
    // Lire les données
    const data = await fs.readFile(dataPath, 'utf8')
    const facturation = JSON.parse(data)
    
    // Filtrer
    if (type === 'facture') {
      facturation.factures = facturation.factures.filter(f => f.id !== id)
    } else {
      facturation.devis = facturation.devis.filter(d => d.id !== id)
    }
    
    // Sauvegarder
    await fs.writeFile(dataPath, JSON.stringify(facturation, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}