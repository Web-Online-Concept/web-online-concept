import { NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'

// DELETE - Supprimer un email spécifique
export async function DELETE(request, { params }) {
  try {
    const emailId = params.id
    
    if (!emailId) {
      return NextResponse.json({ error: 'ID email requis' }, { status: 400 })
    }

    const dirPath = path.join(process.cwd(), 'app', 'data')
    const filePath = path.join(dirPath, 'emails.json')
    
    // Lire les emails existants
    let data = { emails: [] }
    try {
      const content = await readFile(filePath, 'utf8')
      data = JSON.parse(content)
    } catch (error) {
      return NextResponse.json({ error: 'Aucun email trouvé' }, { status: 404 })
    }
    
    // Vérifier que c'est bien un objet avec emails array
    if (!data.emails || !Array.isArray(data.emails)) {
      data = { emails: [] }
    }
    
    // Filtrer pour supprimer l'email
    const initialLength = data.emails.length
    data.emails = data.emails.filter(email => email.id !== emailId)
    
    if (data.emails.length === initialLength) {
      return NextResponse.json({ error: 'Email non trouvé' }, { status: 404 })
    }
    
    // Sauvegarder
    await writeFile(filePath, JSON.stringify(data, null, 2))
    
    return NextResponse.json({ success: true, message: 'Email supprimé' })
  } catch (error) {
    console.error('Erreur suppression email:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}