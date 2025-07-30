import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// Fichier pour stocker les réalisations
const dataFilePath = path.join(process.cwd(), 'data', 'realisations.json')

// Créer le dossier data s'il n'existe pas
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Lire les réalisations
async function getRealisations() {
  try {
    await ensureDataDir()
    const fileContent = await fs.readFile(dataFilePath, 'utf8')
    return JSON.parse(fileContent)
  } catch (error) {
    // Si le fichier n'existe pas, retourner les données par défaut
    const defaultData = {
      sites: [
        {
          id: 1,
          name: "Restaurant Le Gourmet",
          type: "Site vitrine",
          url: "https://restaurant-legourmet.fr",
          image: "/images/sites/restaurant-gourmet.jpg",
          description: "Site moderne pour restaurant gastronomique avec réservation en ligne"
        },
        {
          id: 2,
          name: "Boutique Mode & Style",
          type: "E-commerce",
          url: "https://mode-et-style.fr",
          image: "/images/sites/boutique-mode.jpg",
          description: "Boutique en ligne complète avec paiement sécurisé"
        },
        {
          id: 3,
          name: "Cabinet Médical Santé Plus",
          type: "Site professionnel",
          url: "https://cabinet-sante-plus.fr",
          image: "/images/sites/cabinet-medical.jpg",
          description: "Site médical avec prise de rendez-vous en ligne"
        },
        {
          id: 4,
          name: "Artisan Plombier Pro",
          type: "Site vitrine",
          url: "https://plombier-pro.fr",
          image: "/images/sites/plombier.jpg",
          description: "Site vitrine avec formulaire de devis et galerie de réalisations"
        },
        {
          id: 5,
          name: "École de Musique Harmony",
          type: "Site vitrine",
          url: "https://ecole-harmony.fr",
          image: "/images/sites/ecole-musique.jpg",
          description: "Plateforme complète avec inscription en ligne et espace élève"
        },
        {
          id: 6,
          name: "Agence Immobilière Prestige",
          type: "Site catalogue",
          url: "https://prestige-immo.fr",
          image: "/images/sites/agence-immo.jpg",
          description: "Catalogue immobilier avec recherche avancée et visites virtuelles"
        }
      ],
      siteOrder: [],
      lastId: 6
    }
    
    // Créer le fichier avec les données par défaut
    await saveRealisations(defaultData)
    return defaultData
  }
}

// Sauvegarder les réalisations
async function saveRealisations(data) {
  await ensureDataDir()
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2))
  return data
}

// GET - Récupérer toutes les réalisations
export async function GET() {
  try {
    const data = await getRealisations()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des réalisations' },
      { status: 500 }
    )
  }
}

// POST - Ajouter une nouvelle réalisation
export async function POST(request) {
  try {
    const newSite = await request.json()
    const data = await getRealisations()
    
    // Générer un nouvel ID
    data.lastId = (data.lastId || 0) + 1
    newSite.id = data.lastId
    
    // Ajouter le site
    data.sites.push(newSite)
    
    // Sauvegarder
    await saveRealisations(data)
    
    return NextResponse.json({ success: true, site: newSite })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout de la réalisation' },
      { status: 500 }
    )
  }
}

// PUT - Modifier une réalisation ou l'ordre
export async function PUT(request) {
  try {
    const { action, ...params } = await request.json()
    const data = await getRealisations()
    
    switch (action) {
      case 'updateSite':
        // Modifier un site
        const { siteId, siteData } = params
        const siteIndex = data.sites.findIndex(s => s.id === siteId)
        
        if (siteIndex === -1) {
          return NextResponse.json(
            { error: 'Site non trouvé' },
            { status: 404 }
          )
        }
        
        data.sites[siteIndex] = { ...data.sites[siteIndex], ...siteData }
        break
        
      case 'updateOrder':
        // Mettre à jour l'ordre des sites
        const { siteOrder } = params
        data.siteOrder = siteOrder
        break
        
      default:
        return NextResponse.json(
          { error: 'Action non reconnue' },
          { status: 400 }
        )
    }
    
    // Sauvegarder
    await saveRealisations(data)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la modification' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une réalisation
export async function DELETE(request) {
  try {
    const { siteId } = await request.json()
    const data = await getRealisations()
    
    // Filtrer pour supprimer le site
    data.sites = data.sites.filter(s => s.id !== siteId)
    
    // Mettre à jour l'ordre si nécessaire
    if (data.siteOrder) {
      data.siteOrder = data.siteOrder.filter(id => id !== siteId)
    }
    
    // Sauvegarder
    await saveRealisations(data)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}