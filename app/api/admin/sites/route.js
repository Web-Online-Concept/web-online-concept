import { readFile, writeFile, mkdir } from 'fs/promises'
import { NextResponse } from 'next/server'
import path from 'path'

// Fonction pour charger les sites
async function loadSites() {
  try {
    const filePath = path.join(process.cwd(), 'app', 'data', 'sites.json')
    const data = await readFile(filePath, 'utf8')
    const allData = JSON.parse(data)
    
    // Filtrer uniquement les 3 catégories autorisées
    const allowedCategories = ['actifs', 'persos', 'archives']
    const filteredData = {}
    
    // Migrer les sites des anciennes catégories vers archives
    const sitesToMigrate = []
    
    Object.entries(allData).forEach(([key, category]) => {
      if (allowedCategories.includes(key)) {
        filteredData[key] = category
      } else if (category.sites && category.sites.length > 0) {
        // Collecter les sites des catégories supprimées
        sitesToMigrate.push(...category.sites)
      }
    })
    
    // S'assurer que les 3 catégories existent avec les bonnes données
    if (!filteredData.actifs) {
      filteredData.actifs = {
        title: 'Sites Clients Actifs',
        icon: '🟢',
        sites: []
      }
    }
    if (!filteredData.persos) {
      filteredData.persos = {
        title: 'Sites Entreprise Actifs',
        icon: '✅',
        sites: []
      }
    }
    if (!filteredData.archives) {
      filteredData.archives = {
        title: 'Anciens Sites',
        icon: '🗂️',
        sites: []
      }
    }
    
    // Ajouter les sites migrés dans archives
    if (sitesToMigrate.length > 0) {
      filteredData.archives.sites = [
        ...filteredData.archives.sites,
        ...sitesToMigrate
      ]
      // Sauvegarder immédiatement pour nettoyer le fichier
      await saveSites(filteredData)
    }
    
    return filteredData
  } catch (error) {
    // Si le fichier n'existe pas, retourner la structure par défaut
    return {
      actifs: {
        title: 'Sites Clients Actifs',
        icon: '🟢',
        sites: []
      },
      persos: {
        title: 'Sites Entreprise Actifs',
        icon: '✅',
        sites: []
      },
      archives: {
        title: 'Anciens Sites',
        icon: '🗂️',
        sites: []
      }
    }
  }
}

// Fonction pour sauvegarder les sites
async function saveSites(sites) {
  const dirPath = path.join(process.cwd(), 'app', 'data')
  const filePath = path.join(dirPath, 'sites.json')
  
  // Créer le dossier s'il n'existe pas
  await mkdir(dirPath, { recursive: true })
  
  // Sauvegarder les données
  await writeFile(filePath, JSON.stringify(sites, null, 2))
}

// GET - Récupérer tous les sites
export async function GET() {
  try {
    const sites = await loadSites()
    return NextResponse.json(sites)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors du chargement des sites' }, { status: 500 })
  }
}

// POST - Ajouter un site
export async function POST(request) {
  try {
    const body = await request.json()
    const sites = await loadSites()
    
    // Ajouter un site uniquement
    const { category, site } = body
    
    // Vérifier que la catégorie est autorisée
    const allowedCategories = ['actifs', 'persos', 'archives']
    if (!allowedCategories.includes(category)) {
      return NextResponse.json({ error: 'Catégorie non autorisée' }, { status: 400 })
    }
    
    if (!sites[category]) {
      return NextResponse.json({ error: 'Catégorie non trouvée' }, { status: 400 })
    }
    
    const newSite = {
      id: Date.now().toString(),
      ...site
    }
    
    sites[category].sites.push(newSite)
    
    await saveSites(sites)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de l\'ajout' }, { status: 500 })
  }
}

// PUT - Modifier un site
export async function PUT(request) {
  try {
    const body = await request.json()
    const sites = await loadSites()
    
    // Modifier un site uniquement
    const { category, siteId, siteData } = body
    
    if (!sites[category]) {
      return NextResponse.json({ error: 'Catégorie non trouvée' }, { status: 404 })
    }
    
    const siteIndex = sites[category].sites.findIndex(s => s.id === siteId)
    if (siteIndex === -1) {
      return NextResponse.json({ error: 'Site non trouvé' }, { status: 404 })
    }
    
    sites[category].sites[siteIndex] = {
      id: siteId,
      ...siteData
    }
    
    await saveSites(sites)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la modification' }, { status: 500 })
  }
}

// DELETE - Supprimer un site
export async function DELETE(request) {
  try {
    const body = await request.json()
    const sites = await loadSites()
    
    // Supprimer un site uniquement
    const { category, siteId } = body
    
    if (!sites[category]) {
      return NextResponse.json({ error: 'Catégorie non trouvée' }, { status: 404 })
    }
    
    sites[category].sites = sites[category].sites.filter(s => s.id !== siteId)
    
    await saveSites(sites)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
  }
}