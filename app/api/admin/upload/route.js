import { writeFile, mkdir } from 'fs/promises'
import { NextResponse } from 'next/server'
import path from 'path'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    
    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }
    
    // Vérifier le type de fichier
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Type de fichier non supporté' }, { status: 400 })
    }
    
    // Vérifier la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Fichier trop volumineux (5MB max)' }, { status: 400 })
    }
    
    // Créer le dossier s'il n'existe pas
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'sites')
    await mkdir(uploadDir, { recursive: true })
    
    // Générer un nom unique
    const timestamp = Date.now()
    const fileName = `site-${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
    const filePath = path.join(uploadDir, fileName)
    
    // Convertir le fichier en buffer et sauvegarder
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)
    
    // Retourner l'URL publique
    const publicUrl = `/uploads/sites/${fileName}`
    
    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error('Erreur upload:', error)
    return NextResponse.json({ error: 'Erreur lors de l\'upload' }, { status: 500 })
  }
}