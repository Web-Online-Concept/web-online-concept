import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    
    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }
    
    // Vérifier le type de fichier
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non supporté. Utilisez JPG, PNG, WebP ou GIF.' },
        { status: 400 }
      )
    }
    
    // Vérifier la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Le fichier est trop volumineux (5MB maximum)' },
        { status: 400 }
      )
    }
    
    // Créer un nom de fichier unique
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Générer un nom unique avec timestamp
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-')
    const fileName = `realisation-${timestamp}-${originalName}`
    
    // Définir le chemin de sauvegarde
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'realisations')
    const filePath = path.join(uploadDir, fileName)
    
    // Créer le dossier s'il n'existe pas
    const { mkdir } = require('fs/promises')
    await mkdir(uploadDir, { recursive: true })
    
    // Écrire le fichier
    await writeFile(filePath, buffer)
    
    // Retourner l'URL publique
    const publicUrl = `/uploads/realisations/${fileName}`
    
    return NextResponse.json({ 
      success: true,
      url: publicUrl,
      fileName: fileName
    })
    
  } catch (error) {
    console.error('Erreur upload:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload du fichier' },
      { status: 500 }
    )
  }
}

// Configuration pour permettre les uploads de fichiers plus volumineux
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb'
    }
  }
}