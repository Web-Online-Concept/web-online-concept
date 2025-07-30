import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// Fichier pour stocker les modules
const dataFilePath = path.join(process.cwd(), 'app/data/modules.json')

// Données par défaut
const defaultData = [
  {
    id: 'facturation',
    title: 'Facturation',
    icon: '📄',
    description: 'Gestion des devis et factures',
    details: 'Créez et gérez vos devis, convertissez-les en factures, suivez les paiements.',
    color: 'from-blue-500 to-blue-600',
    link: '/admin/facturation',
    order: 1
  },
  {
    id: 'devis',
    title: 'Devis',
    icon: '📋',
    description: 'Gestion des devis',
    details: 'Créez, validez et suivez vos devis. Gérez les paiements et la collecte de contenus.',
    color: 'from-emerald-500 to-emerald-600',
    link: '/admin/devis',
    order: 2
  },
  {
    id: 'affilies',
    title: 'Affiliés',
    icon: '🤝',
    description: 'Gestion des partenaires',
    details: 'Gérez vos affiliés, leurs codes promo et suivez les commissions à payer.',
    color: 'from-purple-500 to-purple-600',
    link: '/admin/affilies',
    order: 3
  },
  {
    id: 'comptabilite',
    title: 'Comptabilité',
    icon: '💰',
    description: 'Tableau de bord financier',
    details: 'Visualisez votre CA, suivez vos revenus, gérez la TVA.',
    color: 'from-green-500 to-green-600',
    link: '/admin/comptabilite',
    order: 4
  },
  {
    id: 'agenda',
    title: 'Agenda',
    icon: '📅',
    description: 'Gestion des projets',
    details: 'Organisez vos projets, suivez les deadlines, gérez vos tâches.',
    color: 'from-purple-500 to-purple-600',
    link: '/admin/agenda',
    order: 5
  },
  {
    id: 'sites',
    title: 'Sites en Gestion',
    icon: '🌐',
    description: 'Portfolio clients',
    details: 'Visualisez tous les sites que vous gérez.',
    color: 'from-orange-500 to-orange-600',
    link: '/admin/sites',
    order: 6
  },
  {
    id: 'outils',
    title: 'Outils Web',
    icon: '🔧',
    description: 'Accès rapide',
    details: 'Tous vos outils de développement en un clic.',
    color: 'from-pink-500 to-pink-600',
    link: '/admin/outils',
    order: 7
  },
  {
    id: 'parametres',
    title: 'Paramètres',
    icon: '⚙️',
    description: 'Configuration',
    details: 'Gérez les paramètres de votre entreprise et facturation.',
    color: 'from-gray-500 to-gray-600',
    link: '/admin/parametres',
    order: 8
  },
  {
    id: 'crm',
    title: 'Fiches Clients',
    icon: '👥',
    description: 'Gestion clients',
    details: 'Centralisation des informations clients',
    color: 'from-indigo-500 to-indigo-600',
    link: '/admin/crm',
    order: 9
  },
  {
    id: 'depenses',
    title: 'Dépenses',
    icon: '💸',
    description: 'Gestion des charges',
    details: 'Répertorie les charges entreprise ou dépenses dossiers clients',
    color: 'from-red-500 to-red-600',
    link: '/admin/depenses',
    order: 10
  },
  {
    id: 'backup',
    title: 'Sauvegarde',
    icon: '🔑',
    description: 'Export et import des données',
    details: 'Sauvegarde et systeme de backup des datas du site',
    color: 'from-gray-500 to-gray-600',
    link: '/admin/backup',
    order: 11
  },
  {
    id: 'emails',
    title: 'Emails',
    icon: '📧',
    description: 'Communications clients',
    details: 'Envoi d\'emails manuels ou automatisés aux clients avec devis et factures',
    color: 'from-indigo-500 to-indigo-600',
    link: '/admin/emails',
    order: 12
  },
  {
    id: 'export',
    title: 'Export Excel',
    icon: '📊',
    description: 'Exporter toutes vos données',
    details: 'Téléchargez vos données clients, factures, projets au format Excel.',
    color: 'from-gray-500 to-gray-600',
    link: '/admin/export',
    order: 13
  },
  {
    id: 'realisations',
    title: 'Réalisations Publiques',
    icon: '🏪',
    description: 'Portfolio visible',
    details: 'Gérez les sites affichés sur votre page réalisations publique',
    color: 'from-purple-500 to-purple-600',
    link: '/admin/realisations',
    order: 14
  },
  {
    id: 'tarifs',
    title: 'Gestion Tarifs',
    icon: '💰',
    description: 'Modifier les tarifs du Site',
    details: 'Gérez tous vos tarifs depuis un seul endroit. Modifications instantanées sur la page publique et le générateur de devis.',
    color: 'from-orange-500 to-orange-600',
    link: '/admin/tarifs',
    order: 15
  }
]

// Fonction pour lire les données
async function readData() {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    // Si le fichier n'existe pas, créer le dossier et retourner les données par défaut
    const dir = path.dirname(dataFilePath)
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(dataFilePath, JSON.stringify(defaultData, null, 2))
    return defaultData
  }
}

// Fonction pour écrire les données
async function writeData(data) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2))
}

// GET - Récupérer tous les modules
export async function GET() {
  try {
    const data = await readData()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la lecture des données' }, { status: 500 })
  }
}

// POST - Ajouter un nouveau module
export async function POST(request) {
  try {
    const module = await request.json()
    const data = await readData()
    
    // Générer un ID unique
    module.id = module.id || Date.now().toString()
    module.order = data.length + 1
    
    data.push(module)
    await writeData(data)
    return NextResponse.json({ success: true, module })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de l\'ajout' }, { status: 500 })
  }
}

// PUT - Modifier un module
export async function PUT(request) {
  try {
    const { id, moduleData } = await request.json()
    const data = await readData()
    
    const index = data.findIndex(module => module.id === id)
    if (index !== -1) {
      data[index] = { ...data[index], ...moduleData }
      await writeData(data)
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Module non trouvé' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la modification' }, { status: 500 })
  }
}

// DELETE - Supprimer un module
export async function DELETE(request) {
  try {
    const { id } = await request.json()
    const data = await readData()
    
    const filteredData = data.filter(module => module.id !== id)
    
    // Réorganiser les ordres
    filteredData.forEach((module, index) => {
      module.order = index + 1
    })
    
    await writeData(filteredData)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
  }
}