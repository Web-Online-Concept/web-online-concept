import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'app/data')
const devisFile = path.join(dataDir, 'devis.json')
const tarifsFile = path.join(dataDir, 'tarifs.json')

// Initialiser le fichier si nécessaire
async function initializeFile() {
  try {
    await fs.access(devisFile)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
    const defaultData = {
      devis: [],
      compteur: 1,
      parametres: {
        validite_jours: 30,
        acompte_pourcentage: 50,
        entreprise: {
          nom: 'Web Online Concept',
          adresse: 'Rue Paul Estival, 31200 Toulouse',
          telephone: '06 03 36 93 42',
          email: 'web.online.concept@gmail.com',
          siret: '510 583 800 00048'
        }
      }
    }
    await fs.writeFile(devisFile, JSON.stringify(defaultData, null, 2))
  }
}

// Charger les tarifs
async function loadTarifs() {
  try {
    const data = await fs.readFile(tarifsFile, 'utf-8')
    return JSON.parse(data)
  } catch {
    // Tarifs par défaut si le fichier n'existe pas
    return {
      siteWeb: 500,
      pageSupp: 50,
      packImages: 50,
      maintenance: 120,
      redactionSiteComplet: 150,
      redactionPageSupp: 20,
      backOffice: 150
    }
  }
}

// GET - Récupérer les devis
export async function GET(request) {
  try {
    await initializeFile()
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    
    const data = await fs.readFile(devisFile, 'utf-8')
    const parsed = JSON.parse(data)
    
    if (token) {
      const devis = parsed.devis.find(d => d.token === token)
      if (!devis) {
        return NextResponse.json({ error: 'Devis non trouvé' }, { status: 404 })
      }
      return NextResponse.json(devis)
    }
    
    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Erreur GET devis:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Créer un nouveau devis
export async function POST(request) {
  try {
    await initializeFile()
    const body = await request.json()
    
    const data = await fs.readFile(devisFile, 'utf-8')
    const parsed = JSON.parse(data)
    
    // Charger les tarifs actuels
    const tarifs = await loadTarifs()
    
    // Validation basique
    if (!body.nom || !body.email) {
      return NextResponse.json({ 
        error: 'Nom et email requis' 
      }, { status: 400 })
    }
    
    // Créer le nouveau devis
    const dateCreation = new Date()
    const dateValidite = new Date()
    dateValidite.setDate(dateValidite.getDate() + parsed.parametres.validite_jours)
    
    // Déterminer le type de projet
    if (body.type === 'site_web_pro') {
      // Nouveau système avec tarifs dynamiques
      
      // Calculer les montants avec les tarifs dynamiques
      let montantHT = tarifs.siteWeb
      
      // Appliquer la réduction affilié si présente
      let reductionAffilie = 0
      if (body.code_affilie && body.code_valide) {
        reductionAffilie = Math.round(montantHT * (body.reduction_affilie || 30) / 100)
        montantHT = montantHT - reductionAffilie
      }
      
      // Ajouter les pages supplémentaires (pas de réduction)
      if (body.nb_pages_supp > 0) {
        montantHT += body.nb_pages_supp * tarifs.pageSupp
      }
      
      // Ajouter les options sélectionnées (pas de réduction)
      if (body.options && body.options.length > 0) {
        body.options.forEach(option => {
          switch(option) {
            case 'pack_images':
              montantHT += tarifs.packImages
              break
            case 'maintenance':
              montantHT += tarifs.maintenance
              break
            case 'redaction':
              montantHT += tarifs.redactionSiteComplet
              break
            case 'back_office':
              montantHT += tarifs.backOffice
              break
          }
        })
      }
      
      // Ajouter la rédaction des pages supplémentaires
      if (body.nb_pages_redaction_supp > 0) {
        montantHT += body.nb_pages_redaction_supp * tarifs.redactionPageSupp
      }
      
      const nouveauDevis = {
        id: `DEV${String(parsed.compteur).padStart(5, '0')}`,
        token: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        statut: 'brouillon',
        statut_paiement: 'en_attente',
        
        // Informations client
        client: {
          type: body.type_client || 'particulier',
          entreprise: body.entreprise || '',
          nom: body.nom || '',
          prenom: body.prenom || '',
          email: body.email || '',
          telephone: body.telephone || '',
          adresse: body.adresse || '',
          code_postal: body.code_postal || '',
          ville: body.ville || ''
        },
        
        // Détails du projet
        projet: {
          type: body.type || 'site_web_pro',
          type_site: body.type || 'site_web_pro',
          nb_pages: 5 + parseInt(body.nb_pages_supp || 0),
          nb_pages_supp: parseInt(body.nb_pages_supp || 0),
          nb_pages_redaction_supp: parseInt(body.nb_pages_redaction_supp || 0),
          options: body.options || [],
          description: body.description || ''
        },
        
        // Code affilié
        code_affilie: body.code_affilie || null,
        reduction_affilie: body.code_valide ? (body.reduction_affilie || 30) : 0,
        
        // Montants
        montants: {
          base: tarifs.siteWeb,
          reduction: reductionAffilie,
          ht: montantHT,
          tva: 0, // Auto-entrepreneur
          ttc: montantHT,
          acompte: Math.round(montantHT * 0.5),
          solde: Math.round(montantHT * 0.5)
        },
        
        // Tarifs utilisés (pour référence)
        tarifs: tarifs,
        
        // Dates
        date_creation: dateCreation.toISOString(),
        date_validite: dateValidite.toISOString(),
        
        // Paramètres entreprise
        entreprise: parsed.parametres.entreprise,
        
        // Historique
        historique: [{
          date: dateCreation.toISOString(),
          action: 'creation',
          details: 'Devis créé depuis le formulaire en ligne'
        }]
      }
      
      parsed.devis.push(nouveauDevis)
      parsed.compteur++
      
      await fs.writeFile(devisFile, JSON.stringify(parsed, null, 2))
      
      return NextResponse.json(nouveauDevis)
      
    } else {
      // Ancien système (pour compatibilité)
      const tarifs = {
        site_vitrine: { base: 890, pages_supp: 90 },
        site_catalogue: { base: 1490, pages_supp: 120 },
        site_ecommerce: { base: 2490, produits_supp: 2 },
        options: {
          nom_domaine: 15,
          hebergement: 60,
          maintenance: 30,
          seo: 490,
          logo: 290,
          redaction: 890,
          multilingue: 690,
          reservation: 390,
          blog: 290
        }
      }
      
      // Calculer le montant selon le type
      let montantHT = 0
      const typeSite = body.type_site || 'vitrine'
      
      switch(typeSite) {
        case 'vitrine':
          montantHT = tarifs.site_vitrine.base
          if (body.nb_pages > 5) {
            montantHT += (body.nb_pages - 5) * tarifs.site_vitrine.pages_supp
          }
          break
        case 'catalogue':
          montantHT = tarifs.site_catalogue.base
          if (body.nb_pages > 10) {
            montantHT += (body.nb_pages - 10) * tarifs.site_catalogue.pages_supp
          }
          break
        case 'ecommerce':
          montantHT = tarifs.site_ecommerce.base
          if (body.nb_produits > 100) {
            montantHT += (body.nb_produits - 100) * tarifs.site_ecommerce.produits_supp
          }
          break
      }
      
      // Ajouter les options
      if (body.options && body.options.length > 0) {
        body.options.forEach(option => {
          if (tarifs.options[option]) {
            montantHT += tarifs.options[option]
          }
        })
      }
      
      const montantTVA = 0 // Auto-entrepreneur, pas de TVA
      const montantTTC = montantHT
      
      const nouveauDevis = {
        id: `DEV${String(parsed.compteur).padStart(5, '0')}`,
        token: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        statut: 'brouillon',
        statut_paiement: 'en_attente',
        
        client: {
          type: body.type_client || 'particulier',
          entreprise: body.entreprise || '',
          nom: body.nom || '',
          prenom: body.prenom || '',
          email: body.email || '',
          telephone: body.telephone || '',
          adresse: body.adresse || '',
          code_postal: body.code_postal || '',
          ville: body.ville || ''
        },
        
        projet: {
          type_site: typeSite,
          nb_pages: body.nb_pages || 5,
          nb_produits: body.nb_produits || 0,
          options: body.options || [],
          description: body.description || ''
        },
        
        montants: {
          ht: montantHT,
          tva: montantTVA,
          ttc: montantTTC,
          acompte: Math.round(montantTTC * parsed.parametres.acompte_pourcentage / 100),
          solde: Math.round(montantTTC * (100 - parsed.parametres.acompte_pourcentage) / 100)
        },
        
        date_creation: dateCreation.toISOString(),
        date_validite: dateValidite.toISOString(),
        
        entreprise: parsed.parametres.entreprise,
        
        historique: [{
          date: dateCreation.toISOString(),
          action: 'creation',
          details: 'Devis créé depuis le formulaire en ligne'
        }]
      }
      
      parsed.devis.push(nouveauDevis)
      parsed.compteur++
      
      await fs.writeFile(devisFile, JSON.stringify(parsed, null, 2))
      
      return NextResponse.json(nouveauDevis)
    }
    
  } catch (error) {
    console.error('Erreur POST devis:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PATCH - Mettre à jour un devis
export async function PATCH(request) {
  try {
    const body = await request.json()
    const { token, action } = body
    
    if (!token || !action) {
      return NextResponse.json({ 
        error: 'Token et action requis' 
      }, { status: 400 })
    }
    
    const data = await fs.readFile(devisFile, 'utf-8')
    const parsed = JSON.parse(data)
    
    const devisIndex = parsed.devis.findIndex(d => d.token === token)
    if (devisIndex === -1) {
      return NextResponse.json({ error: 'Devis non trouvé' }, { status: 404 })
    }
    
    const devis = parsed.devis[devisIndex]
    const now = new Date().toISOString()
    
    // Actions possibles
    switch(action) {
      case 'valider':
        devis.statut = 'valide'
        devis.historique.push({
          date: now,
          action: 'validation',
          details: 'Devis validé et envoyé au client'
        })
        break
        
      case 'accepter':
        devis.statut = 'accepte'
        devis.date_acceptation = now
        devis.historique.push({
          date: now,
          action: 'acceptation',
          details: 'Devis accepté par le client'
        })
        break
        
      case 'refuser':
        devis.statut = 'refuse'
        devis.date_refus = now
        devis.historique.push({
          date: now,
          action: 'refus',
          details: `Refusé par le client. Motif: ${body.motif || 'Non précisé'}`
        })
        break
        
      case 'marquer_consulte':
        devis.consulte = true
        devis.date_consultation = devis.date_consultation || now
        devis.historique.push({
          date: now,
          action: 'consultation',
          details: 'Devis consulté par le client'
        })
        break
        
      case 'paiement_acompte':
        devis.statut_paiement = 'acompte_paye'
        devis.date_paiement_acompte = now
        devis.historique.push({
          date: now,
          action: 'paiement',
          details: `Acompte payé: ${devis.montants.acompte}€`
        })
        break
        
      case 'paiement_solde':
        devis.statut_paiement = 'paye'
        devis.date_paiement_solde = now
        devis.historique.push({
          date: now,
          action: 'paiement',
          details: `Solde payé: ${devis.montants.solde}€`
        })
        break
        
      case 'collecte_contenu':
        devis.contenus = body.contenus
        devis.date_collecte = now
        devis.historique.push({
          date: now,
          action: 'collecte',
          details: 'Contenus du projet collectés'
        })
        break
        
      case 'modifier':
        // Mise à jour des données
        if (body.client) devis.client = { ...devis.client, ...body.client }
        if (body.projet) devis.projet = { ...devis.projet, ...body.projet }
        if (body.montants) devis.montants = { ...devis.montants, ...body.montants }
        
        devis.historique.push({
          date: now,
          action: 'modification',
          details: body.details || 'Devis modifié'
        })
        break
        
      default:
        return NextResponse.json({ 
          error: 'Action non reconnue' 
        }, { status: 400 })
    }
    
    parsed.devis[devisIndex] = devis
    await fs.writeFile(devisFile, JSON.stringify(parsed, null, 2))
    
    return NextResponse.json({ success: true, devis })
    
  } catch (error) {
    console.error('Erreur PATCH devis:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}