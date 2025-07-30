import { readFile, writeFile, mkdir } from 'fs/promises'
import { NextResponse } from 'next/server'
import path from 'path'

// Fonction pour créer une sauvegarde complète
export async function GET() {
  try {
    const backup = {
      date: new Date().toISOString(),
      version: '1.0',
      modules: {}
    }

    // Liste des fichiers à sauvegarder
    const files = [
      { id: 'clients', file: 'clients.json' },
      { id: 'sites', file: 'sites.json' },
      { id: 'facturation', file: 'facturation.json' },
      { id: 'depenses', file: 'depenses.json' },
      { id: 'outils', file: 'outils.json' },
      { id: 'agenda', file: 'agenda.json' },
      { id: 'parametres', file: 'parametres.json' }
    ]

    // Lire chaque fichier
    for (const { id, file } of files) {
      try {
        const filePath = path.join(process.cwd(), 'app', 'data', file)
        const data = await readFile(filePath, 'utf8')
        backup.modules[id] = JSON.parse(data)
      } catch (error) {
        console.log(`Fichier ${file} non trouvé, ignoré`)
      }
    }

    return NextResponse.json(backup)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la création du backup' }, { status: 500 })
  }
}

// Fonction pour restaurer une sauvegarde
export async function POST(request) {
  try {
    const backup = await request.json()
    
    if (!backup.modules) {
      return NextResponse.json({ error: 'Format de backup invalide' }, { status: 400 })
    }

    const dirPath = path.join(process.cwd(), 'app', 'data')
    await mkdir(dirPath, { recursive: true })

    // Mapping des modules vers les fichiers
    const fileMapping = {
      clients: 'clients.json',
      sites: 'sites.json',
      facturation: 'facturation.json',
      depenses: 'depenses.json',
      outils: 'outils.json',
      agenda: 'agenda.json',
      parametres: 'parametres.json'
    }

    // Restaurer chaque module
    for (const [moduleId, data] of Object.entries(backup.modules)) {
      if (fileMapping[moduleId]) {
        const filePath = path.join(dirPath, fileMapping[moduleId])
        await writeFile(filePath, JSON.stringify(data, null, 2))
      }
    }

    return NextResponse.json({ success: true, message: 'Restauration réussie' })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la restauration' }, { status: 500 })
  }
}