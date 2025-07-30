import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// Fichier pour stocker les outils (dans le dossier app pour ne pas être public)
const dataFilePath = path.join(process.cwd(), 'app/data/outils.json')

// Données par défaut si le fichier n'existe pas
const defaultData = {
  categories: {
    developpement: {
      title: 'Développement',
      icon: '💻',
      tools: [
        { id: '1', name: 'GitHub', url: 'https://github.com', description: 'Hébergement de code et collaboration', icon: '🐙' },
        { id: '2', name: 'Vercel', url: 'https://vercel.com', description: 'Déploiement et hébergement Next.js', icon: '▲' },
      ]
    },
    design: {
      title: 'Design & Images',
      icon: '🎨',
      tools: [
        { id: '3', name: 'Figma', url: 'https://figma.com', description: 'Design d\'interface collaboratif', icon: '🎨' },
        { id: '4', name: 'Unsplash', url: 'https://unsplash.com', description: 'Photos gratuites haute qualité', icon: '📸' },
      ]
    }
  },
  order: ['developpement', 'design']
}

// Fonction pour lire les données
async function readData() {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8')
    const data = JSON.parse(fileContent)
    
    // Migration des anciennes données vers le nouveau format
    if (!data.categories && !data.order) {
      const migratedData = {
        categories: data,
        order: Object.keys(data)
      }
      await fs.writeFile(dataFilePath, JSON.stringify(migratedData, null, 2))
      return migratedData
    }
    
    return data
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

// GET - Récupérer tous les outils
export async function GET() {
  try {
    const data = await readData()
    // Pour la compatibilité, on peut renvoyer soit le nouveau format, soit l'ancien
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la lecture des données' }, { status: 500 })
  }
}

// POST - Ajouter un outil ou une catégorie
export async function POST(request) {
  try {
    const body = await request.json()
    const data = await readData()
    
    // Ajouter une catégorie
    if (body.type === 'category') {
      const { categoryKey, categoryData } = body
      data.categories[categoryKey] = {
        title: categoryData.title,
        icon: categoryData.icon,
        tools: []
      }
      // Ajouter la nouvelle catégorie à l'ordre
      if (!data.order.includes(categoryKey)) {
        data.order.push(categoryKey)
      }
      await writeData(data)
      return NextResponse.json({ success: true })
    }
    
    // Ajouter un outil
    else {
      const { category, tool } = body
      tool.id = Date.now().toString()
      
      if (data.categories[category]) {
        data.categories[category].tools.push(tool)
        await writeData(data)
        return NextResponse.json({ success: true, tool })
      } else {
        return NextResponse.json({ error: 'Catégorie non trouvée' }, { status: 400 })
      }
    }
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de l\'ajout' }, { status: 500 })
  }
}

// DELETE - Supprimer un outil ou une catégorie
export async function DELETE(request) {
  try {
    const body = await request.json()
    const data = await readData()
    
    // Supprimer une catégorie
    if (body.type === 'category') {
      const { categoryKey } = body
      delete data.categories[categoryKey]
      // Retirer de l'ordre aussi
      data.order = data.order.filter(key => key !== categoryKey)
      await writeData(data)
      return NextResponse.json({ success: true })
    }
    
    // Supprimer un outil
    else {
      const { category, toolId } = body
      if (data.categories[category]) {
        data.categories[category].tools = data.categories[category].tools.filter(tool => tool.id !== toolId)
        await writeData(data)
        return NextResponse.json({ success: true })
      } else {
        return NextResponse.json({ error: 'Catégorie non trouvée' }, { status: 400 })
      }
    }
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
  }
}

// PUT - Modifier une catégorie, un outil, ou réorganiser
export async function PUT(request) {
  try {
    const body = await request.json()
    const data = await readData()
    
    // Mise à jour complète (pour le drag & drop)
    if (body.categories && body.order) {
      data.categories = body.categories
      data.order = body.order
      await writeData(data)
      return NextResponse.json({ success: true })
    }
    
    // Modifier un outil
    if (body.type === 'tool') {
      const { category, toolId, toolData } = body
      if (data.categories[category]) {
        const toolIndex = data.categories[category].tools.findIndex(tool => tool.id === toolId)
        if (toolIndex !== -1) {
          data.categories[category].tools[toolIndex] = { ...toolData, id: toolId }
          await writeData(data)
          return NextResponse.json({ success: true })
        }
      }
      return NextResponse.json({ error: 'Outil non trouvé' }, { status: 400 })
    }
    
    // Modifier une catégorie
    else if (body.oldKey) {
      const { oldKey, newKey, categoryData } = body
      if (data.categories[oldKey]) {
        // Si la clé change, on doit déplacer les données
        if (oldKey !== newKey) {
          data.categories[newKey] = data.categories[oldKey]
          delete data.categories[oldKey]
          // Mettre à jour l'ordre
          const index = data.order.indexOf(oldKey)
          if (index !== -1) {
            data.order[index] = newKey
          }
        }
        
        // Mettre à jour les infos
        data.categories[newKey].title = categoryData.title
        data.categories[newKey].icon = categoryData.icon
        
        await writeData(data)
        return NextResponse.json({ success: true })
      } else {
        return NextResponse.json({ error: 'Catégorie non trouvée' }, { status: 400 })
      }
    }
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la modification' }, { status: 500 })
  }
}