import { readFile, writeFile, mkdir } from 'fs/promises'
import { NextResponse } from 'next/server'
import path from 'path'

// Fonction pour charger les emails
async function loadEmails() {
  try {
    const filePath = path.join(process.cwd(), 'app', 'data', 'emails.json')
    const data = await readFile(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    // Si le fichier n'existe pas, retourner une structure vide
    return {
      emails: [],
      stats: {
        totalEnvoyes: 0,
        tauxOuverture: 0,
        automatiques: 0
      }
    }
  }
}

// Fonction pour sauvegarder les emails
async function saveEmails(data) {
  const dirPath = path.join(process.cwd(), 'app', 'data')
  const filePath = path.join(dirPath, 'emails.json')
  
  // Créer le dossier s'il n'existe pas
  await mkdir(dirPath, { recursive: true })
  
  // Sauvegarder les données
  await writeFile(filePath, JSON.stringify(data, null, 2))
}

// GET - Récupérer tous les emails
export async function GET() {
  try {
    const data = await loadEmails()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors du chargement' }, { status: 500 })
  }
}

// POST - Envoyer un email
export async function POST(request) {
  try {
    const body = await request.json()
    
    // Si c'est un envoi réel, rediriger vers l'API d'envoi
    if (body.destinataire && body.objet && body.message) {
      const sendResponse = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/admin/emails/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      
      if (!sendResponse.ok) {
        const error = await sendResponse.json()
        return NextResponse.json(error, { status: sendResponse.status })
      }
      
      const result = await sendResponse.json()
      return NextResponse.json(result)
    }
    
    // Sinon, juste enregistrer dans l'historique (pour compatibilité)
    const data = await loadEmails()
    
    const newEmail = {
      id: Date.now().toString(),
      ...body,
      dateEnvoi: body.dateEnvoi || new Date().toISOString(),
      statut: body.statut || 'envoye',
      type: body.type || 'manuel'
    }
    
    data.emails.unshift(newEmail)
    
    // Mettre à jour les stats
    data.stats.totalEnvoyes++
    if (newEmail.type === 'automatique') {
      data.stats.automatiques++
    }
    
    await saveEmails(data)
    
    return NextResponse.json({ success: true, email: newEmail })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de l\'envoi' }, { status: 500 })
  }
}

// PUT - Mettre à jour un email (statut, etc.)
export async function PUT(request) {
  try {
    const body = await request.json()
    const { id, ...emailData } = body
    
    const data = await loadEmails()
    const index = data.emails.findIndex(e => e.id === id)
    
    if (index === -1) {
      return NextResponse.json({ error: 'Email non trouvé' }, { status: 404 })
    }
    
    data.emails[index] = {
      ...data.emails[index],
      ...emailData
    }
    
    await saveEmails(data)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la modification' }, { status: 500 })
  }
}

// DELETE - Supprimer un email
export async function DELETE(request) {
  try {
    const body = await request.json()
    const { id } = body
    
    const data = await loadEmails()
    data.emails = data.emails.filter(e => e.id !== id)
    
    await saveEmails(data)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
  }
}