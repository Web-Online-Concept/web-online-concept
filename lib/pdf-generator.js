import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

// Configuration des couleurs
const colors = {
  primary: '#0073a8',
  secondary: '#005a87',
  dark: '#333333',
  gray: '#666666',
  light: '#f5f5f5',
  white: '#ffffff'
}

// Configuration des polices
const fonts = {
  title: { size: 24, style: 'bold' },
  subtitle: { size: 18, style: 'bold' },
  heading: { size: 14, style: 'bold' },
  normal: { size: 12, style: 'normal' },
  small: { size: 10, style: 'normal' }
}

// Générateur de devis PDF
export async function generateDevisPDF(devis) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })
  
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  let yPosition = margin
  
  // Helper pour ajouter du texte
  const addText = (text, x, y, options = {}) => {
    doc.setFontSize(options.size || fonts.normal.size)
    doc.setTextColor(options.color || colors.dark)
    if (options.bold) doc.setFont(undefined, 'bold')
    else doc.setFont(undefined, 'normal')
    
    if (options.align === 'center') {
      doc.text(text, x, y, { align: 'center' })
    } else if (options.align === 'right') {
      doc.text(text, x, y, { align: 'right' })
    } else {
      doc.text(text, x, y)
    }
  }
  
  // Helper pour ajouter une ligne
  const addLine = (x1, y1, x2, y2, color = colors.gray) => {
    doc.setDrawColor(color)
    doc.line(x1, y1, x2, y2)
  }
  
  // Helper pour ajouter un rectangle
  const addRect = (x, y, width, height, options = {}) => {
    if (options.fill) {
      doc.setFillColor(options.fill)
      doc.rect(x, y, width, height, 'F')
    }
    if (options.stroke) {
      doc.setDrawColor(options.stroke)
      doc.rect(x, y, width, height, 'S')
    }
  }
  
  // En-tête avec logo et infos entreprise
  const addHeader = () => {
    // Rectangle de fond pour l'en-tête
    addRect(0, 0, pageWidth, 50, { fill: colors.primary })
    
    // Logo (simulé avec du texte pour l'instant)
    doc.setTextColor(colors.white)
    addText('WEB ONLINE', margin, 20, { size: 20, bold: true, color: colors.white })
    addText('CONCEPT', margin, 30, { size: 20, bold: true, color: colors.white })
    
    // Infos entreprise
    doc.setFontSize(10)
    doc.setTextColor(colors.white)
    const rightX = pageWidth - margin
    addText('Web Online Concept', rightX, 15, { align: 'right', color: colors.white })
    addText('Rue Paul Estival, 31200 Toulouse', rightX, 20, { align: 'right', color: colors.white })
    addText('Tél: 06 03 36 93 42', rightX, 25, { align: 'right', color: colors.white })
    addText('Email: web.online.concept@gmail.com', rightX, 30, { align: 'right', color: colors.white })
    addText('SIRET: 510 583 800 00048', rightX, 35, { align: 'right', color: colors.white })
    
    yPosition = 65
  }
  
  // Titre du devis
  const addTitle = () => {
    addText('DEVIS', pageWidth / 2, yPosition, { 
      size: fonts.title.size, 
      bold: true, 
      align: 'center',
      color: colors.primary 
    })
    
    yPosition += 10
    
    // Numéro et date
    addText(`N° ${devis.id || devis.numero}`, pageWidth / 2, yPosition, { 
      size: fonts.normal.size, 
      align: 'center' 
    })
    
    yPosition += 5
    
    const dateDevis = new Date(devis.date_creation || devis.date).toLocaleDateString('fr-FR')
    addText(`Date : ${dateDevis}`, pageWidth / 2, yPosition, { 
      size: fonts.normal.size, 
      align: 'center' 
    })
    
    // Date de validité
    if (devis.date_validite) {
      yPosition += 5
      const dateValidite = new Date(devis.date_validite).toLocaleDateString('fr-FR')
      addText(`Valide jusqu'au : ${dateValidite}`, pageWidth / 2, yPosition, { 
        size: fonts.small.size, 
        align: 'center',
        color: colors.gray
      })
    }
    
    yPosition += 15
  }
  
  // Informations client
  const addClientInfo = () => {
    // Cadre client
    addRect(pageWidth - margin - 90, yPosition - 5, 90, 50, { 
      stroke: colors.gray,
      fill: colors.light 
    })
    
    const clientX = pageWidth - margin - 85
    let clientY = yPosition
    
    addText('CLIENT', clientX, clientY, { bold: true, size: fonts.heading.size })
    clientY += 7
    
    if (devis.client.entreprise) {
      addText(devis.client.entreprise, clientX, clientY, { bold: true })
      clientY += 5
    }
    
    addText(`${devis.client.prenom} ${devis.client.nom}`, clientX, clientY)
    clientY += 5
    
    if (devis.client.adresse) {
      const adresseLines = doc.splitTextToSize(devis.client.adresse, 80)
      adresseLines.forEach(line => {
        addText(line, clientX, clientY, { size: fonts.small.size })
        clientY += 4
      })
    }
    
    if (devis.client.code_postal && devis.client.ville) {
      addText(`${devis.client.code_postal} ${devis.client.ville}`, clientX, clientY, { size: fonts.small.size })
      clientY += 5
    }
    
    addText(devis.client.email, clientX, clientY, { size: fonts.small.size })
    if (devis.client.telephone) {
      clientY += 4
      addText(devis.client.telephone, clientX, clientY, { size: fonts.small.size })
    }
    
    yPosition = Math.max(yPosition + 55, clientY + 10)
  }
  
  // Détails du devis
  const addDevisDetails = () => {
    // Titre de la section
    addText('Détail de la prestation', margin, yPosition, { 
      bold: true, 
      size: fonts.subtitle.size,
      color: colors.primary 
    })
    
    yPosition += 10
    
    // Tableau des prestations
    const tableData = []
    
    // Pour le nouveau système de devis avec tarifs dynamiques
    if (devis.projet && devis.projet.type === 'site_web_pro') {
      // Charger les tarifs dynamiques ou utiliser les valeurs par défaut
      let tarifs = devis.tarifs || {
        siteWeb: 500,
        pageSupp: 50,
        packImages: 50,
        maintenance: 120,
        redactionSiteComplet: 150,
        redactionPageSupp: 20,
        backOffice: 150
      }
      
      // Site Web Professionnel
      tableData.push([
        'Site Web Professionnel',
        '5 pages personnalisées + pages légales + hébergement 1 an inclus',
        '1',
        `${tarifs.siteWeb.toFixed(2)} €`,
        `${tarifs.siteWeb.toFixed(2)} €`
      ])
      
      // Pages supplémentaires
      if (devis.projet.nb_pages_supp > 0) {
        tableData.push([
          'Pages supplémentaires',
          `Au-delà des 5 pages incluses`,
          `${devis.projet.nb_pages_supp}`,
          `${tarifs.pageSupp.toFixed(2)} €`,
          `${(devis.projet.nb_pages_supp * tarifs.pageSupp).toFixed(2)} €`
        ])
      }
      
      // Options sélectionnées
      const optionsLabels = {
        pack_images: 'Pack images/vidéos professionnelles',
        maintenance: 'Forfait Maintenance',
        redaction: 'Rédaction complète',
        back_office: 'Back Office'
      }
      
      const optionsDescriptions = {
        pack_images: '10 images/vidéos libres de droits',
        maintenance: '12 interventions par an',
        redaction: 'Textes professionnels pour les 5 pages de base',
        back_office: 'Interface d\'administration + formation'
      }
      
      if (devis.projet.options && devis.projet.options.length > 0) {
        devis.projet.options.forEach(option => {
          if (optionsLabels[option]) {
            let prix = 0
            let quantite = '1'
            let description = optionsDescriptions[option] || 'Option supplémentaire'
            
            switch(option) {
              case 'pack_images': 
                prix = tarifs.packImages
                break
              case 'maintenance': 
                prix = tarifs.maintenance
                description = 'Forfait annuel - 12 interventions'
                break
              case 'redaction': 
                if (devis.projet.nb_pages_supp > 0) {
                  // Rédaction site complet + pages supplémentaires
                  tableData.push([
                    'Rédaction complète (5 pages de base)',
                    'Textes professionnels pour les pages incluses',
                    '1',
                    `${tarifs.redactionSiteComplet.toFixed(2)} €`,
                    `${tarifs.redactionSiteComplet.toFixed(2)} €`
                  ])
                  tableData.push([
                    'Rédaction pages supplémentaires',
                    'Textes professionnels pour les pages additionnelles',
                    `${devis.projet.nb_pages_supp}`,
                    `${tarifs.redactionPageSupp.toFixed(2)} €`,
                    `${(devis.projet.nb_pages_supp * tarifs.redactionPageSupp).toFixed(2)} €`
                  ])
                  return // Skip l'ajout normal car on a déjà ajouté
                } else {
                  prix = tarifs.redactionSiteComplet
                }
                break
              case 'back_office': 
                prix = tarifs.backOffice
                break
            }
            
            if (prix > 0) {
              tableData.push([
                optionsLabels[option],
                description,
                quantite,
                `${prix.toFixed(2)} €`,
                `${prix.toFixed(2)} €`
              ])
            }
          }
        })
      }
    }
    // Pour l'ancien système (compatibilité) - Site vitrine/catalogue/e-commerce
    else if (devis.projet) {
      // Type de site principal
      let typeSiteLabel = ''
      let typeSiteDetails = ''
      let prixBase = 0
      
      switch(devis.projet.type_site) {
        case 'vitrine':
          typeSiteLabel = 'Site Vitrine'
          typeSiteDetails = `${devis.projet.nb_pages} pages`
          prixBase = 890
          if (devis.projet.nb_pages > 5) {
            const pagesSupp = devis.projet.nb_pages - 5
            prixBase += pagesSupp * 90
            typeSiteDetails += ` (incluant ${pagesSupp} pages supplémentaires)`
          }
          break
        case 'catalogue':
          typeSiteLabel = 'Site Catalogue'
          typeSiteDetails = `${devis.projet.nb_pages} pages`
          prixBase = 1490
          if (devis.projet.nb_pages > 10) {
            const pagesSupp = devis.projet.nb_pages - 10
            prixBase += pagesSupp * 120
            typeSiteDetails += ` (incluant ${pagesSupp} pages supplémentaires)`
          }
          break
        case 'ecommerce':
          typeSiteLabel = 'Site E-commerce'
          typeSiteDetails = `Jusqu'à ${devis.projet.nb_produits} produits`
          prixBase = 2490
          if (devis.projet.nb_produits > 100) {
            const produitsSupp = devis.projet.nb_produits - 100
            prixBase += produitsSupp * 2
            typeSiteDetails += ` (incluant ${produitsSupp} produits supplémentaires)`
          }
          break
      }
      
      tableData.push([
        typeSiteLabel,
        typeSiteDetails,
        '1',
        `${prixBase.toFixed(2)} €`,
        `${prixBase.toFixed(2)} €`
      ])
      
      // Options sélectionnées
      const optionsLabels = {
        nom_domaine: 'Nom de domaine (.fr ou .com)',
        hebergement: 'Hébergement web (1 an)',
        maintenance: 'Maintenance mensuelle',
        seo: 'Référencement SEO de base',
        logo: 'Création de logo',
        redaction: 'Rédaction complète des contenus',
        multilingue: 'Version multilingue',
        reservation: 'Système de réservation',
        blog: 'Module blog'
      }
      
      const optionsPrix = {
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
      
      if (devis.projet.options && devis.projet.options.length > 0) {
        devis.projet.options.forEach(option => {
          if (optionsLabels[option]) {
            tableData.push([
              optionsLabels[option],
              'Option supplémentaire',
              '1',
              `${optionsPrix[option].toFixed(2)} €`,
              `${optionsPrix[option].toFixed(2)} €`
            ])
          }
        })
      }
    } 
    // Pour l'ancien système (compatibilité)
    else if (devis.items) {
      devis.items.forEach(item => {
        tableData.push([
          item.nom,
          item.description || '',
          `${item.quantite}`,
          `${item.prixUnitaire.toFixed(2)} €`,
          `${(item.quantite * item.prixUnitaire).toFixed(2)} €`
        ])
      })
      
      // Options sélectionnées (ancien système)
      if (devis.options) {
        Object.entries(devis.options).forEach(([key, option]) => {
          if (option.selected) {
            tableData.push([
              option.nom,
              'Option supplémentaire',
              '1',
              `${option.prix.toFixed(2)} €`,
              `${option.prix.toFixed(2)} €`
            ])
          }
        })
      }
    }
    
    // Créer le tableau
    doc.autoTable({
      startY: yPosition,
      head: [['Désignation', 'Description', 'Qté', 'Prix HT', 'Total HT']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [0, 115, 168],
        textColor: [255, 255, 255],
        fontSize: 12,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 11,
        textColor: [51, 51, 51]
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 60 },
        2: { cellWidth: 20, halign: 'center' },
        3: { cellWidth: 30, halign: 'right' },
        4: { cellWidth: 30, halign: 'right' }
      },
      margin: { left: margin, right: margin },
      didDrawPage: function(data) {
        yPosition = data.cursor.y
      }
    })
    
    yPosition += 10
  }
  
  // Totaux
  const addTotals = () => {
    const totalsX = pageWidth - margin - 60
    const labelX = totalsX - 30
    
    // Récupérer les montants selon le format
    const montantHT = devis.montants?.ht || devis.totalHT || 0
    const montantTVA = devis.montants?.tva || devis.tva || (montantHT * 0.20)
    const montantTTC = devis.montants?.ttc || devis.totalTTC || (montantHT + montantTVA)
    const pourcentageAcompte = devis.montants?.acompte ? 50 : (devis.acompte || 50)
    const montantAcompte = devis.montants?.acompte || devis.montantAcompte || (montantTTC * pourcentageAcompte / 100)
    
    // Total HT
    addText('Total HT', labelX, yPosition, { align: 'right' })
    addText(`${montantHT.toFixed(2)} €`, totalsX + 50, yPosition, { align: 'right' })
    yPosition += 6
    
    // TVA
    addText('TVA (20%)', labelX, yPosition, { align: 'right' })
    addText(`${montantTVA.toFixed(2)} €`, totalsX + 50, yPosition, { align: 'right' })
    yPosition += 6
    
    // Ligne de séparation
    addLine(labelX - 20, yPosition, totalsX + 50, yPosition)
    yPosition += 6
    
    // Total TTC
    addRect(labelX - 25, yPosition - 5, 105, 10, { fill: colors.primary })
    doc.setTextColor(colors.white)
    addText('TOTAL TTC', labelX, yPosition, { align: 'right', bold: true, color: colors.white })
    addText(`${montantTTC.toFixed(2)} €`, totalsX + 50, yPosition, { 
      align: 'right', 
      bold: true,
      color: colors.white 
    })
    doc.setTextColor(colors.dark)
    
    yPosition += 15
    
    // Acompte
    addText(`Acompte à la commande (${pourcentageAcompte}%)`, labelX, yPosition, { 
      align: 'right',
      size: fonts.small.size 
    })
    addText(`${montantAcompte.toFixed(2)} €`, totalsX + 50, yPosition, { 
      align: 'right',
      size: fonts.small.size 
    })
    yPosition += 5
    
    addText('Solde à la livraison', labelX, yPosition, { 
      align: 'right',
      size: fonts.small.size 
    })
    addText(`${(montantTTC - montantAcompte).toFixed(2)} €`, totalsX + 50, yPosition, { 
      align: 'right',
      size: fonts.small.size 
    })
    
    yPosition += 15
  }
  
  // Conditions
  const addConditions = () => {
    // Vérifier s'il reste assez de place
    if (yPosition > pageHeight - 80) {
      doc.addPage()
      yPosition = margin
    }
    
    addText('Conditions', margin, yPosition, { 
      bold: true, 
      size: fonts.heading.size,
      color: colors.primary 
    })
    
    yPosition += 8
    
    const validite = devis.validiteJours || 30
    const dateCreation = new Date(devis.date_creation || devis.date).toLocaleDateString('fr-FR')
    const pourcentageAcompte = devis.montants?.acompte ? 50 : (devis.acompte || 50)
    
    const conditions = [
      `• Validité du devis : ${validite} jours à compter du ${dateCreation}`,
      `• Modalités de paiement : Acompte de ${pourcentageAcompte}% à la commande, solde à la livraison`,
      '• Délai de réalisation : 2 à 4 semaines après réception de l\'acompte et des contenus',
      '• Les prix s\'entendent hors frais d\'hébergement et de nom de domaine annuels',
      '• Toute modification du projet fera l\'objet d\'un devis complémentaire'
    ]
    
    conditions.forEach(condition => {
      const lines = doc.splitTextToSize(condition, pageWidth - 2 * margin)
      lines.forEach(line => {
        addText(line, margin, yPosition, { size: fonts.small.size })
        yPosition += 5
      })
    })
    
    yPosition += 10
  }
  
  // Message personnalisé
  const addMessage = () => {
    if (devis.message || devis.projet?.description) {
      if (yPosition > pageHeight - 60) {
        doc.addPage()
        yPosition = margin
      }
      
      addText('Note', margin, yPosition, { 
        bold: true, 
        size: fonts.heading.size,
        color: colors.primary 
      })
      
      yPosition += 8
      
      const message = devis.message || devis.projet?.description || ''
      const lines = doc.splitTextToSize(message, pageWidth - 2 * margin)
      lines.forEach(line => {
        addText(line, margin, yPosition, { size: fonts.small.size })
        yPosition += 5
      })
      
      yPosition += 10
    }
  }
  
  // Signature
  const addSignature = () => {
    if (yPosition > pageHeight - 60) {
      doc.addPage()
      yPosition = margin
    }
    
    const signatureY = pageHeight - 60
    
    // Cadres de signature
    const boxWidth = 80
    const boxHeight = 40
    
    // Signature entreprise
    addRect(margin, signatureY, boxWidth, boxHeight, { stroke: colors.gray })
    addText('L\'entreprise', margin + boxWidth / 2, signatureY - 5, { 
      align: 'center',
      size: fonts.small.size 
    })
    addText('Date et signature', margin + boxWidth / 2, signatureY + boxHeight + 5, { 
      align: 'center',
      size: fonts.small.size 
    })
    
    // Signature client
    addRect(pageWidth - margin - boxWidth, signatureY, boxWidth, boxHeight, { stroke: colors.gray })
    addText('Le client', pageWidth - margin - boxWidth / 2, signatureY - 5, { 
      align: 'center',
      size: fonts.small.size 
    })
    addText('Date et signature', pageWidth - margin - boxWidth / 2, signatureY + boxHeight + 5, { 
      align: 'center',
      size: fonts.small.size 
    })
    
    // Mention "Bon pour accord"
    addText('Mention "Bon pour accord"', pageWidth - margin - boxWidth / 2, signatureY + boxHeight + 10, { 
      align: 'center',
      size: fonts.small.size,
      color: colors.gray 
    })
  }
  
  // Pied de page
  const addFooter = () => {
    const footerY = pageHeight - 15
    
    doc.setFontSize(8)
    doc.setTextColor(colors.gray)
    
    // Ligne de séparation
    addLine(margin, footerY - 5, pageWidth - margin, footerY - 5, colors.light)
    
    // Texte du footer
    addText('Web Online Concept - Auto-Entrepreneur', pageWidth / 2, footerY, { 
      align: 'center', 
      size: 8, 
      color: colors.gray 
    })
    
    addText('SIRET : 510 583 800 00048 - Dispensé d\'immatriculation au RCS et au RM', pageWidth / 2, footerY + 4, { 
      align: 'center', 
      size: 8, 
      color: colors.gray 
    })
    
    // Numéro de page
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      addText(`Page ${i} / ${pageCount}`, pageWidth - margin, footerY, { 
        align: 'right',
        size: 8,
        color: colors.gray 
      })
    }
  }
  
  // Construction du PDF
  addHeader()
  addTitle()
  addClientInfo()
  addDevisDetails()
  addTotals()
  addConditions()
  addMessage()
  addSignature()
  addFooter()
  
  return doc
}

// Générateur de facture PDF
export async function generateFacturePDF(facture) {
  // Utilise la même structure que le devis avec quelques modifications
  const doc = await generateDevisPDF(facture)
  
  // Remplacer "DEVIS" par "FACTURE" dans le titre
  // Ajouter les informations de paiement
  // etc.
  
  return doc
}

// Fonction pour télécharger le PDF
export function downloadPDF(devis) {
  const doc = generateDevisPDF(devis)
  doc.save(`devis-${devis.id || devis.numero}.pdf`)
}

// Fonction pour obtenir le PDF en base64
export async function getPDFBase64(devis) {
  const doc = await generateDevisPDF(devis)
  return doc.output('datauristring')
}

// Fonction pour obtenir le PDF en blob
export async function getPDFBlob(devis) {
  const doc = await generateDevisPDF(devis)
  return doc.output('blob')
}