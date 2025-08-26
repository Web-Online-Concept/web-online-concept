import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('image')
    
    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }
    
    // Vérifier le type de fichier
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Format de fichier non supporté. Utilisez JPG, PNG, WebP ou GIF.' },
        { status: 400 }
      )
    }
    
    // Vérifier la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Le fichier est trop lourd. Maximum 5MB.' },
        { status: 400 }
      )
    }
    
    // Créer un nom unique pour le fichier
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Générer un nom unique basé sur le timestamp
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-')
    const extension = path.extname(originalName)
    const nameWithoutExt = path.basename(originalName, extension)
    const uniqueName = `${nameWithoutExt}-${timestamp}${extension}`
    
    // Chemin de destination
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'blog')
    const filePath = path.join(uploadDir, uniqueName)
    
    // Écrire le fichier
    await writeFile(filePath, buffer)
    
    // Retourner l'URL publique
    const publicUrl = `/images/blog/${uniqueName}`
    
    return NextResponse.json({
      message: 'Image uploadée avec succès',
      url: publicUrl,
      filename: uniqueName
    })
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error)
    
    // Si c'est une erreur de système de fichiers
    if (error.code === 'ENOENT') {
      return NextResponse.json(
        { error: 'Le dossier de destination n\'existe pas. Créez le dossier public/images/blog/' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload de l\'image' },
      { status: 500 }
    )
  }
}