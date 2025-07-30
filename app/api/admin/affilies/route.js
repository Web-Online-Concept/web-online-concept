import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'app/data')
const affiliesFile = path.join(dataDir, 'affilies.json')

// Structure par défaut
const defaultData = {
  affilies: [],
  compteur: 1
}

// Initialiser le fichier si nécessaire
async function initializeFile() {
  try {
    await fs.access(affiliesFile)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
    await fs.writeFile(affiliesFile, JSON.stringify(defaultData, null, 2))
  }
}

// Charger les données
async function loadData() {
  await initializeFile()
  const data = await fs.readFile(affiliesFile, 'utf-8')
  return JSON.parse(data)
}

// Sauvegarder les données
async function saveData(data) {
  await fs.writeFile(affiliesFile, JSON.stringify(data, null, 2))
}

// GET - Récupérer tous les affiliés
export async function GET() {
  try {
    const data = await loadData()
    
    // Calculer les commissions dues pour chaque affilié
    // On va chercher dans les devis
    try {
      const devisData = await fs.readFile(path.join(dataDir, 'devis.json'), 'utf-8')
      const { devis } = JSON.parse(devisData)
      
      // Enrichir chaque affilié avec ses commissions
      const affiliesAvecCommissions = data.affilies.map(affilie => {
        // Trouver tous les devis avec ce code affilié
        const devisAffilie = devis.filter(d => 
          d.code_affilie === affilie.code && 
          d.statut === 'accepte' &&
          d.statut_paiement === 'paye'
        )
        
        // Calculer les commissions
        const commissions = devisAffilie.map(d => ({
          devis_id: d.id,
          client: d.client.entreprise || `${d.client.prenom} ${d.client.nom}`,
          date: d.date_creation,
          montant_facture: d.montants.ttc,
          commission: Math.round(d.montants.ttc * 0.10), // 10% du total facturé
          paye: d.commission_payee || false
        }))
        
        const total_du = commissions.filter(c => !c.paye).reduce((sum, c) => sum + c.commission, 0)
        const total_paye = commissions.filter(c => c.paye).reduce((sum, c) => sum + c.commission, 0)
        
        return {
          ...affilie,
          commissions,
          total_du,
          total_paye,
          nombre_ventes: commissions.length
        }
      })
      
      return NextResponse.json({
        affilies: affiliesAvecCommissions,
        total: data.affilies.length
      })
      
    } catch (error) {
      // Si pas de fichier devis, retourner juste les affiliés
      return NextResponse.json({
        affilies: data.affilies,
        total: data.affilies.length
      })
    }
    
  } catch (error) {
    console.error('Erreur GET affiliés:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Créer un nouvel affilié
export async function POST(request) {
  try {
    const body = await request.json()
    const data = await loadData()
    
    // Générer un code unique si pas fourni
    if (!body.code) {
      body.code = `AFF${String(data.compteur).padStart(3, '0')}`
    }
    
    // Créer le nouvel affilié
    const nouvelAffilie = {
      id: `AFF${String(data.compteur).padStart(3, '0')}`,
      code: body.code.toUpperCase(),
      nom: body.nom || '',
      prenom: body.prenom || '',
      societe: body.societe || '',
      email: body.email || '',
      telephone: body.telephone || '',
      rib: body.rib || '',
      infos: body.infos || '',
      commission: 10, // Commission fixe de 10% du total facture
      reduction_client: 30, // Réduction de 30% pour le client sur l'offre principale
      actif: true,
      date_creation: new Date().toISOString(),
      commissions_payees: []
    }
    
    // Vérifier que le code n'existe pas déjà
    const codeExiste = data.affilies.some(a => a.code === nouvelAffilie.code)
    if (codeExiste) {
      return NextResponse.json({ 
        error: 'Ce code existe déjà' 
      }, { status: 400 })
    }
    
    // Ajouter et sauvegarder
    data.affilies.push(nouvelAffilie)
    data.compteur++
    
    await saveData(data)
    
    return NextResponse.json({ 
      success: true, 
      affilie: nouvelAffilie 
    })
    
  } catch (error) {
    console.error('Erreur POST affilié:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PATCH - Modifier un affilié
export async function PATCH(request) {
  try {
    const body = await request.json()
    const data = await loadData()
    
    const index = data.affilies.findIndex(a => a.id === body.id)
    if (index === -1) {
      return NextResponse.json({ error: 'Affilié non trouvé' }, { status: 404 })
    }
    
    // Mettre à jour l'affilié
    data.affilies[index] = {
      ...data.affilies[index],
      ...body,
      date_modification: new Date().toISOString()
    }
    
    await saveData(data)
    
    return NextResponse.json({ 
      success: true, 
      affilie: data.affilies[index] 
    })
    
  } catch (error) {
    console.error('Erreur PATCH affilié:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE - Supprimer un affilié (désactiver en fait)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 })
    }
    
    const data = await loadData()
    const index = data.affilies.findIndex(a => a.id === id)
    
    if (index === -1) {
      return NextResponse.json({ error: 'Affilié non trouvé' }, { status: 404 })
    }
    
    // On ne supprime pas vraiment, on désactive
    data.affilies[index].actif = false
    data.affilies[index].date_desactivation = new Date().toISOString()
    
    await saveData(data)
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Erreur DELETE affilié:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}