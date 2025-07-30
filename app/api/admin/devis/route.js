import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const dataFilePath = path.join(process.cwd(), 'app/data/devis.json')

// GET - Récupérer tous les devis avec statistiques
export async function GET(request) {
  try {
    const data = JSON.parse(await fs.readFile(dataFilePath, 'utf-8'))
    
    // Vérifier et mettre à jour les devis expirés
    const now = new Date()
    let hasChanges = false
    
    data.devis.forEach(devis => {
      // Expiration après 8 jours pour les devis validés non consultés ou consultés sans réponse
      if ((devis.statut === 'valide' || devis.statut === 'consulte') && devis.date_validite) {
        const dateValidite = new Date(devis.date_creation)
        dateValidite.setDate(dateValidite.getDate() + 8) // 8 jours de validité
        
        if (now > dateValidite) {
          devis.statut = 'expire'
          devis.historique.push({
            date: now.toISOString(),
            action: 'expiration',
            details: 'Devis expiré automatiquement après 8 jours sans réponse'
          })
          hasChanges = true
        }
      }
    })
    
    if (hasChanges) {
      await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2))
    }
    
    // Calculer les statistiques
    const stats = {
      total: data.devis.length,
      parStatut: {
        brouillon: 0,
        en_attente: 0,
        valide: 0,
        consulte: 0,
        accepte: 0,
        refuse_admin: 0,
        refuse_client: 0,
        expire: 0,
        termine: 0
      },
      montantTotal: 0,
      montantAccepte: 0,
      montantEnAttente: 0,
      montantEnCours: 0,
      tauxConversion: 0,
      tauxRefus: {
        admin: 0,
        client: 0,
        sansSuite: 0
      },
      delaiMoyenAcceptation: 0,
      topClients: [],
      evolutionMensuelle: [],
      raisonsRefus: {}
    }
    
    // Compter par statut et calculer les montants
    data.devis.forEach(devis => {
      // Par statut
      if (stats.parStatut.hasOwnProperty(devis.statut)) {
        stats.parStatut[devis.statut]++
      }
      
      // Montants
      stats.montantTotal += devis.montants.ttc
      
      if (devis.statut === 'accepte' || devis.statut === 'termine') {
        stats.montantAccepte += devis.montants.ttc
        if (devis.statut_paiement === 'acompte_paye') {
          stats.montantEnCours += devis.montants.ttc
        }
      } else if (devis.statut === 'valide' || devis.statut === 'consulte') {
        stats.montantEnAttente += devis.montants.ttc
      }
      
      // Raisons de refus
      if (devis.statut === 'refuse_admin' && devis.motif_refus) {
        stats.raisonsRefus[devis.motif_refus] = (stats.raisonsRefus[devis.motif_refus] || 0) + 1
      }
    })
    
    // Taux de conversion et refus
    const devisEnvoyes = data.devis.filter(d => 
      ['valide', 'consulte', 'accepte', 'refuse_admin', 'refuse_client', 'expire', 'termine'].includes(d.statut)
    ).length
    
    if (devisEnvoyes > 0) {
      stats.tauxConversion = ((stats.parStatut.accepte + stats.parStatut.termine) / devisEnvoyes * 100).toFixed(1)
      stats.tauxRefus.admin = (stats.parStatut.refuse_admin / devisEnvoyes * 100).toFixed(1)
      stats.tauxRefus.client = (stats.parStatut.refuse_client / devisEnvoyes * 100).toFixed(1)
      stats.tauxRefus.sansSuite = (stats.parStatut.expire / devisEnvoyes * 100).toFixed(1)
    }
    
    // Délai moyen d'acceptation
    const devisAcceptes = data.devis.filter(d => 
      (d.statut === 'accepte' || d.statut === 'termine') && d.date_acceptation
    )
    if (devisAcceptes.length > 0) {
      const delaisTotal = devisAcceptes.reduce((sum, devis) => {
        const dateCreation = new Date(devis.date_creation)
        const dateAcceptation = new Date(devis.date_acceptation)
        const delaiJours = Math.floor((dateAcceptation - dateCreation) / (1000 * 60 * 60 * 24))
        return sum + delaiJours
      }, 0)
      stats.delaiMoyenAcceptation = Math.round(delaisTotal / devisAcceptes.length)
    }
    
    // Top clients (par montant total)
    const clientsMap = new Map()
    data.devis.filter(d => d.statut === 'accepte' || d.statut === 'termine').forEach(devis => {
      const clientKey = devis.client.email
      const clientData = clientsMap.get(clientKey) || {
        nom: devis.client.entreprise || `${devis.client.prenom} ${devis.client.nom}`,
        email: devis.client.email,
        nombreDevis: 0,
        montantTotal: 0
      }
      clientData.nombreDevis++
      clientData.montantTotal += devis.montants.ttc
      clientsMap.set(clientKey, clientData)
    })
    
    stats.topClients = Array.from(clientsMap.values())
      .sort((a, b) => b.montantTotal - a.montantTotal)
      .slice(0, 5)
    
    // Evolution mensuelle (6 derniers mois)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    
    const monthlyData = new Map()
    data.devis.filter(d => new Date(d.date_creation) >= sixMonthsAgo).forEach(devis => {
      const date = new Date(devis.date_creation)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      const monthData = monthlyData.get(monthKey) || {
        mois: monthKey,
        nombre: 0,
        montant: 0,
        acceptes: 0,
        refuses: 0
      }
      
      monthData.nombre++
      monthData.montant += devis.montants.ttc
      if (devis.statut === 'accepte' || devis.statut === 'termine') {
        monthData.acceptes++
      }
      if (devis.statut.startsWith('refuse')) {
        monthData.refuses++
      }
      
      monthlyData.set(monthKey, monthData)
    })
    
    stats.evolutionMensuelle = Array.from(monthlyData.values())
      .sort((a, b) => a.mois.localeCompare(b.mois))
    
    return NextResponse.json({
      devis: data.devis,
      parametres: data.parametres,
      stats
    })
    
  } catch (error) {
    console.error('Erreur GET admin devis:', error)
    return NextResponse.json({ error: 'Erreur lors du chargement des devis' }, { status: 500 })
  }
}

// PATCH - Actions sur un devis spécifique
export async function PATCH(request) {
  try {
    const body = await request.json()
    const { id, action, motif, details } = body
    
    const devisData = JSON.parse(await fs.readFile(dataFilePath, 'utf-8'))
    const devisIndex = devisData.devis.findIndex(d => d.id === id)
    
    if (devisIndex === -1) {
      return NextResponse.json({ error: 'Devis non trouvé' }, { status: 404 })
    }
    
    const devis = devisData.devis[devisIndex]
    const now = new Date().toISOString()
    
    switch (action) {
      case 'valider':
        // Valider et préparer l'envoi au client
        devis.statut = 'valide'
        devis.date_validation = now
        devis.date_validite = new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString() // +8 jours
        devis.historique.push({
          date: now,
          action: 'validation',
          details: details || 'Devis validé et prêt à être envoyé au client'
        })
        break
        
      case 'accepter':
        // Accepter manuellement (par téléphone par exemple)
        devis.statut = 'accepte'
        devis.date_acceptation = now
        devis.historique.push({
          date: now,
          action: 'acceptation_manuelle',
          details: details || 'Devis accepté manuellement par l\'administrateur'
        })
        break
        
      case 'refuser':
        // Refuser par l'admin
        devis.statut = 'refuse_admin'
        devis.date_refus = now
        devis.motif_refus = motif
        devis.historique.push({
          date: now,
          action: 'refus_admin',
          details: details || `Refusé par l'administrateur : ${motif}`
        })
        break
        
      case 'refuser_client':
        // Refus par le client
        devis.statut = 'refuse_client'
        devis.date_refus = now
        devis.motif_refus = motif || 'client'
        devis.historique.push({
          date: now,
          action: 'refus_client',
          details: details || 'Refusé par le client'
        })
        break
        
      case 'marquer_consulte':
        // Marquer comme consulté
        if (devis.statut === 'valide') {
          devis.statut = 'consulte'
          devis.date_consultation = devis.date_consultation || now
          devis.historique.push({
            date: now,
            action: 'consultation',
            details: 'Devis consulté par le client'
          })
        }
        break
        
      case 'terminer':
        // Marquer le projet comme terminé
        devis.statut = 'termine'
        devis.date_fin = now
        devis.historique.push({
          date: now,
          action: 'projet_termine',
          details: 'Projet livré et terminé'
        })
        break
        
      case 'paiement_acompte':
        // Enregistrer le paiement de l'acompte
        devis.statut_paiement = 'acompte_paye'
        devis.date_paiement_acompte = now
        devis.methode_paiement_acompte = body.methode || 'virement'
        devis.historique.push({
          date: now,
          action: 'paiement_acompte',
          details: `Acompte de ${devis.montants.acompte}€ reçu (${devis.methode_paiement_acompte})`
        })
        break
        
      case 'paiement_solde':
        // Enregistrer le paiement du solde
        devis.statut_paiement = 'paye'
        devis.date_paiement_solde = now
        devis.methode_paiement_solde = body.methode || 'virement'
        devis.historique.push({
          date: now,
          action: 'paiement_solde',
          details: `Solde de ${devis.montants.ttc - devis.montants.acompte}€ reçu (${devis.methode_paiement_solde})`
        })
        break
        
      case 'ajouter_note':
        // Ajouter une note interne
        if (!devis.notes_internes) {
          devis.notes_internes = []
        }
        devis.notes_internes.push({
          date: now,
          note: body.note,
          auteur: body.auteur || 'Admin'
        })
        devis.historique.push({
          date: now,
          action: 'note_ajoutee',
          details: 'Note interne ajoutée'
        })
        break
        
      case 'envoyer_relance':
        // Enregistrer l'envoi d'une relance
        if (!devis.relances) {
          devis.relances = []
        }
        devis.relances.push({
          date: now,
          type: body.type || 'email',
          numero: devis.relances.length + 1
        })
        devis.historique.push({
          date: now,
          action: 'relance',
          details: `Relance ${devis.relances.length} envoyée`
        })
        break
        
      case 'signature_cgv':
        // Enregistrer la signature des CGV
        devis.cgv_acceptees = true
        devis.date_signature_cgv = now
        devis.signature_cgv = {
          accepte: true,
          date: now,
          nom: body.nom_signataire,
          ip: body.ip || ''
        }
        devis.historique.push({
          date: now,
          action: 'signature_cgv',
          details: `CGV signées par ${body.nom_signataire}`
        })
        break
        
      case 'generer_facture_acompte':
        // Vérifier que l'acompte a été payé
        if (devis.statut_paiement !== 'acompte_paye' && devis.statut_paiement !== 'paye') {
          return NextResponse.json(
            { error: 'L\'acompte doit être payé pour générer la facture' },
            { status: 400 }
          )
        }
        
        // Vérifier si la facture d'acompte existe déjà
        if (devis.facture_acompte) {
          return NextResponse.json(
            { error: 'La facture d\'acompte a déjà été générée' },
            { status: 400 }
          )
        }
        
        // Générer le numéro de facture
        const factureAcompteRes = await fetch(`${request.nextUrl.origin}/api/admin/compteurs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'factures', action: 'generate' })
        })
        
        const factureAcompteData = await factureAcompteRes.json()
        
        // Enregistrer le numéro de facture
        devis.facture_acompte = {
          numero: factureAcompteData.numero,
          date: new Date().toISOString(),
          montant: devis.montants.acompte
        }
        
        // Ajouter à l'historique
        devis.historique.push({
          date: now,
          action: 'facture_acompte_generee',
          details: `Facture d'acompte ${factureAcompteData.numero} générée`
        })
        
        break
        
      case 'generer_facture_solde':
        // Vérifier que le projet est terminé et payé
        if (devis.statut !== 'termine' || devis.statut_paiement !== 'paye') {
          return NextResponse.json(
            { error: 'Le projet doit être terminé et payé intégralement' },
            { status: 400 }
          )
        }
        
        // Vérifier si la facture finale existe déjà
        if (devis.facture_finale) {
          return NextResponse.json(
            { error: 'La facture finale a déjà été générée' },
            { status: 400 }
          )
        }
        
        // Générer le numéro de facture
        const factureFinaleRes = await fetch(`${request.nextUrl.origin}/api/admin/compteurs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'factures', action: 'generate' })
        })
        
        const factureFinaleData = await factureFinaleRes.json()
        
        // Enregistrer le numéro de facture
        devis.facture_finale = {
          numero: factureFinaleData.numero,
          date: new Date().toISOString(),
          montant: devis.montants.ttc
        }
        
        // Ajouter à l'historique
        devis.historique.push({
          date: now,
          action: 'facture_finale_generee',
          details: `Facture finale ${factureFinaleData.numero} générée`
        })
        
        break
        
      case 'generer_avoir':
        // Générer un avoir (remboursement)
        const avoirRes = await fetch(`${request.nextUrl.origin}/api/admin/compteurs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'avoirs', action: 'generate' })
        })
        
        const avoirData = await avoirRes.json()
        const montantAvoir = body.montant || devis.montants.ttc
        
        // Enregistrer l'avoir
        if (!devis.avoirs) devis.avoirs = []
        devis.avoirs.push({
          numero: avoirData.numero,
          date: new Date().toISOString(),
          montant: montantAvoir,
          motif: body.motif || 'Annulation du projet'
        })
        
        // Ajouter à l'historique
        devis.historique.push({
          date: now,
          action: 'avoir_genere',
          details: `Avoir ${avoirData.numero} généré (${montantAvoir}€)`
        })
        
        break
        
      default:
        return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 })
    }
    
    // Sauvegarder les modifications
    devisData.devis[devisIndex] = devis
    await fs.writeFile(dataFilePath, JSON.stringify(devisData, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      devis: devis,
      message: `Action "${action}" effectuée avec succès`
    })
    
  } catch (error) {
    console.error('Erreur PATCH admin devis:', error)
    return NextResponse.json({ error: 'Erreur lors de l\'action' }, { status: 500 })
  }
}

// POST - Actions admin sur les devis
export async function POST(request) {
  try {
    const body = await request.json()
    const { action, devisId, data: actionData } = body
    
    const devisData = JSON.parse(await fs.readFile(dataFilePath, 'utf-8'))
    const devisIndex = devisData.devis.findIndex(d => d.id === devisId)
    
    if (devisIndex === -1 && action !== 'check_expirations') {
      return NextResponse.json({ error: 'Devis non trouvé' }, { status: 404 })
    }
    
    const devis = devisData.devis[devisIndex]
    
    switch (action) {
      case 'duplicate':
        // Dupliquer un devis avec le système de compteurs
        const compteursResponse = await fetch(`${request.nextUrl.origin}/api/admin/compteurs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'devis', action: 'generate' })
        })
        
        const compteurData = await compteursResponse.json()
        const newToken = Math.random().toString(36).substring(2) + Date.now().toString(36)
        
        const newDevis = {
          ...devis,
          id: compteurData.numero,
          token: newToken,
          date_creation: new Date().toISOString(),
          date_validite: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
          statut: 'brouillon',
          statut_paiement: 'en_attente',
          consulte: false,
          cgv_acceptees: false,
          signature_cgv: null,
          relances: [],
          notes_internes: [],
          facture_acompte: null,
          facture_finale: null,
          avoirs: [],
          historique: [{
            date: new Date().toISOString(),
            action: 'duplication',
            details: `Dupliqué depuis ${devis.id}`
          }]
        }
        
        // Supprimer les dates spécifiques
        delete newDevis.date_consultation
        delete newDevis.date_acceptation
        delete newDevis.date_refus
        delete newDevis.date_signature_cgv
        delete newDevis.date_paiement_acompte
        delete newDevis.date_paiement_solde
        delete newDevis.date_validation
        delete newDevis.date_fin
        
        devisData.devis.unshift(newDevis)
        break
        
      case 'check_expirations':
        // Vérifier toutes les expirations (pour cron job)
        const now = new Date()
        let expired = 0
        
        devisData.devis.forEach(devis => {
          if ((devis.statut === 'valide' || devis.statut === 'consulte') && devis.date_creation) {
            const dateCreation = new Date(devis.date_creation)
            const dateExpiration = new Date(dateCreation)
            dateExpiration.setDate(dateExpiration.getDate() + 8)
            
            if (now > dateExpiration) {
              devis.statut = 'expire'
              devis.historique.push({
                date: now.toISOString(),
                action: 'expiration',
                details: 'Devis expiré automatiquement après 8 jours'
              })
              expired++
            }
          }
        })
        
        await fs.writeFile(dataFilePath, JSON.stringify(devisData, null, 2))
        return NextResponse.json({ 
          success: true, 
          expired: expired,
          message: `${expired} devis expirés` 
        })
        
      case 'send_scheduled_reminders':
        // Envoyer les relances programmées
        const toRemind = []
        const today = new Date()
        
        devisData.devis.forEach(devis => {
          if (devis.statut === 'valide' || devis.statut === 'consulte') {
            const dateCreation = new Date(devis.date_creation)
            const daysSince = Math.floor((today - dateCreation) / (1000 * 60 * 60 * 24))
            const relanceCount = devis.relances?.length || 0
            
            // Relance à J+3 si pas encore faite
            if (daysSince >= 3 && relanceCount === 0) {
              toRemind.push({
                devis: devis,
                type: 'premiere_relance',
                numero: 1
              })
            }
            // Dernière relance à J+6
            else if (daysSince >= 6 && relanceCount === 1) {
              toRemind.push({
                devis: devis,
                type: 'derniere_relance',
                numero: 2
              })
            }
          }
        })
        
        return NextResponse.json({ 
          success: true, 
          relances: toRemind,
          message: `${toRemind.length} relances à envoyer` 
        })
        
      default:
        return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 })
    }
    
    // Sauvegarder les modifications
    await fs.writeFile(dataFilePath, JSON.stringify(devisData, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      devis: action === 'duplicate' ? devisData.devis[0] : devis 
    })
    
  } catch (error) {
    console.error('Erreur POST admin devis:', error)
    return NextResponse.json({ error: 'Erreur lors de l\'action' }, { status: 500 })
  }
}

// PUT - Modifier les paramètres globaux
export async function PUT(request) {
  try {
    const body = await request.json()
    const { parametres } = body
    
    const data = JSON.parse(await fs.readFile(dataFilePath, 'utf-8'))
    
    // Mettre à jour les paramètres
    data.parametres = {
      ...data.parametres,
      ...parametres,
      validite_jours: 8 // Forcer à 8 jours
    }
    
    // Sauvegarder
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      parametres: data.parametres 
    })
    
  } catch (error) {
    console.error('Erreur PUT admin devis:', error)
    return NextResponse.json({ error: 'Erreur lors de la modification des paramètres' }, { status: 500 })
  }
}

// DELETE - Supprimer un devis
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const devisId = searchParams.get('id')
    
    if (!devisId) {
      return NextResponse.json({ error: 'ID du devis requis' }, { status: 400 })
    }
    
    const data = JSON.parse(await fs.readFile(dataFilePath, 'utf-8'))
    const devisIndex = data.devis.findIndex(d => d.id === devisId)
    
    if (devisIndex === -1) {
      return NextResponse.json({ error: 'Devis non trouvé' }, { status: 404 })
    }
    
    const devis = data.devis[devisIndex]
    
    // Vérifier qu'on peut supprimer (seulement refuse ou expire)
    if (!['refuse_admin', 'refuse_client', 'expire'].includes(devis.statut)) {
      return NextResponse.json({ 
        error: 'Seuls les devis refusés ou expirés peuvent être supprimés' 
      }, { status: 400 })
    }
    
    // Supprimer le devis
    data.devis.splice(devisIndex, 1)
    
    // Sauvegarder
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: 'Devis supprimé avec succès' 
    })
    
  } catch (error) {
    console.error('Erreur DELETE admin devis:', error)
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
  }
}