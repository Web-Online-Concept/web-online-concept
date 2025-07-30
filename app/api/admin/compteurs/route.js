import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const COMPTEURS_FILE = path.join(process.cwd(), 'app/data/compteurs.json')

// Initialiser le fichier compteurs s'il n'existe pas
async function initializeCompteurs() {
  try {
    await fs.access(COMPTEURS_FILE)
  } catch {
    const initialData = {
      factures: {
        prefixe: "FAC",
        annee: new Date().getFullYear(),
        prochain: 1,
        format: "FAC-{annee}-{numero:04d}"
      },
      devis: {
        prefixe: "DEV",
        annee: new Date().getFullYear(),
        prochain: 1,
        format: "DEV-{annee}-{numero:04d}"
      },
      avoirs: {
        prefixe: "AV",
        annee: new Date().getFullYear(),
        prochain: 1,
        format: "AV-{annee}-{numero:04d}"
      }
    }
    
    await fs.mkdir(path.dirname(COMPTEURS_FILE), { recursive: true })
    await fs.writeFile(COMPTEURS_FILE, JSON.stringify(initialData, null, 2))
    return initialData
  }
  
  const data = await fs.readFile(COMPTEURS_FILE, 'utf8')
  return JSON.parse(data)
}

// Obtenir le prochain numéro
async function getNextNumber(type) {
  const compteurs = await initializeCompteurs()
  const currentYear = new Date().getFullYear()
  
  if (!compteurs[type]) {
    throw new Error(`Type de compteur invalide: ${type}`)
  }
  
  // Reset si nouvelle année
  if (compteurs[type].annee !== currentYear) {
    compteurs[type].annee = currentYear
    compteurs[type].prochain = 1
  }
  
  const numero = compteurs[type].prochain
  const format = compteurs[type].format
  
  // Formater le numéro
  const numeroFormate = format
    .replace('{annee}', currentYear)
    .replace('{numero}', numero)
    .replace('{numero:04d}', numero.toString().padStart(4, '0'))
    .replace('{numero:03d}', numero.toString().padStart(3, '0'))
  
  // Incrémenter pour la prochaine fois
  compteurs[type].prochain++
  
  // Sauvegarder
  await fs.writeFile(COMPTEURS_FILE, JSON.stringify(compteurs, null, 2))
  
  return {
    numero: numeroFormate,
    raw: numero,
    annee: currentYear
  }
}

// GET /api/admin/compteurs
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const action = searchParams.get('action')
    
    // Obtenir l'état actuel des compteurs
    if (action === 'status') {
      const compteurs = await initializeCompteurs()
      return NextResponse.json({ success: true, compteurs })
    }
    
    // Obtenir le prochain numéro sans l'incrémenter
    if (action === 'preview' && type) {
      const compteurs = await initializeCompteurs()
      if (!compteurs[type]) {
        return NextResponse.json(
          { error: 'Type invalide' },
          { status: 400 }
        )
      }
      
      const currentYear = new Date().getFullYear()
      const numero = compteurs[type].prochain
      const format = compteurs[type].format
      
      const numeroFormate = format
        .replace('{annee}', currentYear)
        .replace('{numero}', numero)
        .replace('{numero:04d}', numero.toString().padStart(4, '0'))
        .replace('{numero:03d}', numero.toString().padStart(3, '0'))
      
      return NextResponse.json({
        success: true,
        preview: numeroFormate,
        prochain: numero
      })
    }
    
    // Liste des types disponibles
    const compteurs = await initializeCompteurs()
    const types = Object.keys(compteurs)
    
    return NextResponse.json({
      success: true,
      types,
      compteurs
    })
    
  } catch (error) {
    console.error('Erreur GET compteurs:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST /api/admin/compteurs
export async function POST(request) {
  try {
    const body = await request.json()
    const { type, action } = body
    
    // Générer un nouveau numéro
    if (action === 'generate' && type) {
      const result = await getNextNumber(type)
      
      // Logger pour la traçabilité
      console.log(`Nouveau numéro généré: ${result.numero} (${type})`)
      
      return NextResponse.json({
        success: true,
        ...result
      })
    }
    
    // Reset un compteur
    if (action === 'reset' && type) {
      const compteurs = await initializeCompteurs()
      
      if (!compteurs[type]) {
        return NextResponse.json(
          { error: 'Type invalide' },
          { status: 400 }
        )
      }
      
      compteurs[type].prochain = 1
      compteurs[type].annee = new Date().getFullYear()
      
      await fs.writeFile(COMPTEURS_FILE, JSON.stringify(compteurs, null, 2))
      
      return NextResponse.json({
        success: true,
        message: `Compteur ${type} réinitialisé`
      })
    }
    
    // Configurer un compteur
    if (action === 'configure' && type) {
      const { prefixe, format, prochain } = body
      const compteurs = await initializeCompteurs()
      
      if (!compteurs[type]) {
        // Créer un nouveau type de compteur
        compteurs[type] = {
          prefixe: prefixe || type.toUpperCase(),
          annee: new Date().getFullYear(),
          prochain: prochain || 1,
          format: format || `${prefixe || type.toUpperCase()}-{annee}-{numero:04d}`
        }
      } else {
        // Mettre à jour
        if (prefixe) compteurs[type].prefixe = prefixe
        if (format) compteurs[type].format = format
        if (prochain) compteurs[type].prochain = prochain
      }
      
      await fs.writeFile(COMPTEURS_FILE, JSON.stringify(compteurs, null, 2))
      
      return NextResponse.json({
        success: true,
        compteur: compteurs[type]
      })
    }
    
    return NextResponse.json(
      { error: 'Action invalide' },
      { status: 400 }
    )
    
  } catch (error) {
    console.error('Erreur POST compteurs:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/compteurs - Ajuster manuellement
export async function PATCH(request) {
  try {
    const body = await request.json()
    const { type, numero } = body
    
    if (!type || !numero) {
      return NextResponse.json(
        { error: 'Type et numéro requis' },
        { status: 400 }
      )
    }
    
    const compteurs = await initializeCompteurs()
    
    if (!compteurs[type]) {
      return NextResponse.json(
        { error: 'Type invalide' },
        { status: 400 }
      )
    }
    
    // Ajuster le prochain numéro
    compteurs[type].prochain = parseInt(numero)
    
    await fs.writeFile(COMPTEURS_FILE, JSON.stringify(compteurs, null, 2))
    
    return NextResponse.json({
      success: true,
      message: `Prochain numéro ${type}: ${numero}`
    })
    
  } catch (error) {
    console.error('Erreur PATCH compteurs:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}