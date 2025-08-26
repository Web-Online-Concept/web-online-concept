import { query } from '@/app/lib/db'
import { NextResponse } from 'next/server'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import nodemailer from 'nodemailer'

// Fonction pour générer un numéro de devis unique
function generateDevisNumber() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `DEV-${year}${month}${day}-${random}`
}

// Fonction pour générer le PDF (existante, conservée)
function generatePDF(formData, tarifs, total, optionsSelectionnees, codePromo) {
  const doc = new jsPDF()
  
  // Logo et en-tête
  doc.setFillColor(0, 115, 168)
  doc.rect(0, 0, 210, 40, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.text('WEB ONLINE CONCEPT', 20, 25)
  doc.setFontSize(10)
  doc.text('Sites Web Clés en Main à Prix Malins', 20, 32)
  
  // Infos société
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(9)
  doc.text('contact@web-online-concept.fr', 130, 20)
  doc.text('06 12 34 56 78', 130, 25)
  doc.text('SIRET: 123 456 789 00012', 130, 30)
  
  // Titre
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(18)
  doc.text('DEVIS', 20, 55)
  
  // Numéro et date
  const numeroDevis = generateDevisNumber()
  const date = new Date().toLocaleDateString('fr-FR')
  doc.setFontSize(10)
  doc.text(`Devis N° : ${numeroDevis}`, 20, 65)
  doc.text(`Date : ${date}`, 20, 70)
  doc.text('Validité : 30 jours', 20, 75)
  
  // Infos client
  doc.setFillColor(240, 240, 240)
  doc.rect(110, 55, 80, 30, 'F')
  doc.setFontSize(11)
  doc.text('CLIENT', 115, 62)
  doc.setFontSize(9)
  doc.text(formData.nom, 115, 68)
  if (formData.entreprise) {
    doc.text(formData.entreprise, 115, 73)
  }
  doc.text(formData.email, 115, 78)
  doc.text(formData.telephone, 115, 83)
  
  // Tableau des prestations
  let yPosition = 95
  
  const tableData = []
  
  // Formule de base
  tableData.push([
    tarifs.formuleBase.nom,
    tarifs.formuleBase.description,
    `${tarifs.formuleBase.prix}€`
  ])
  
  // Options sélectionnées
  optionsSelectionnees.forEach(optionId => {
    const option = tarifs.options.find(o => o.id === optionId)
    if (option) {
      tableData.push([
        option.nom,
        option.description || '',
        `${option.prix}€`
      ])
    }
  })
  
  // Tableau avec jspdf-autotable
  doc.autoTable({
    startY: yPosition,
    head: [['Prestation', 'Description', 'Prix HT']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [0, 115, 168] },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 100 },
      2: { cellWidth: 30, halign: 'right' }
    }
  })
  
  // Totaux
  yPosition = doc.lastAutoTable.finalY + 10
  
  const total = total
  
  // Si code promo
  if (codePromo && codePromo.valid) {
    doc.setFontSize(10)
    doc.text(`Sous-total HT :`, 130, yPosition)
    doc.text(`${total.toFixed(2)}€`, 180, yPosition, { align: 'right' })
    yPosition += 5
    
    doc.text(`Code promo (${codePromo.code}) :`, 130, yPosition)
    const reduction = codePromo.type === 'pourcentage' 
      ? `-${codePromo.reduction}%`
      : `-${codePromo.reduction}€`
    doc.text(reduction, 180, yPosition, { align: 'right' })
    yPosition += 5
  }
  
  doc.setFontSize(10)
  doc.text(`Total HT :`, 130, yPosition)
  doc.text(`${total.toFixed(2)}€`, 180, yPosition, { align: 'right' })
  yPosition += 5
  
  doc.text(`TVA (0%) :`, 130, yPosition)
  doc.text(`0.00€`, 180, yPosition, { align: 'right' })
  yPosition += 5
  
  doc.setFontSize(12)
  doc.setFont(undefined, 'bold')
  doc.text(`Total :`, 130, yPosition)
  doc.text(`${total.toFixed(2)}€`, 180, yPosition, { align: 'right' })
  
  // Message personnalisé si présent
  if (formData.message) {
    yPosition += 15
    doc.setFont(undefined, 'normal')
    doc.setFontSize(10)
    doc.text('Message du client :', 20, yPosition)
    yPosition += 5
    doc.setFontSize(9)
    const lines = doc.splitTextToSize(formData.message, 170)
    doc.text(lines, 20, yPosition)
  }
  
  // Footer
  doc.setFontSize(8)
  doc.setTextColor(128, 128, 128)
  doc.text('Ce devis est valable 30 jours. Passé ce délai, une nouvelle étude tarifaire sera nécessaire.', 105, 280, { align: 'center' })
  
  return { doc, numeroDevis }
}

export async function POST(request) {
  try {
    const { formData, tarifs, total, optionsSelectionnees, codePromo } = await request.json()
    
    // Générer le PDF
    const { doc, numeroDevis } = generatePDF(formData, tarifs, total, optionsSelectionnees, codePromo)
    
    // Convertir le PDF en base64 pour le stocker
    const pdfBase64 = doc.output('datauristring').split(',')[1]
    
    // Pas de TVA pour micro-entreprise
    const totalHT = total
    
    // Préparer les données du devis pour la base
    const formuleBase = {
      nom: tarifs.formuleBase.nom,
      prix: tarifs.formuleBase.prix,
      description: tarifs.formuleBase.description
    }
    
    const optionsDetails = optionsSelectionnees.map(optionId => {
      const option = tarifs.options.find(o => o.id === optionId)
      return option ? {
        id: option.id,
        nom: option.nom,
        prix: option.prix,
        description: option.description
      } : null
    }).filter(Boolean)
    
    // Récupérer l'IP et user agent (pour info)
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    // Sauvegarder dans la base de données
    await query(`
      INSERT INTO devis (
        numero, client_nom, client_email, client_telephone, client_entreprise,
        formule_base, options_selectionnees, 
        total_ht, tva, total_ttc,
        code_promo, reduction, type_reduction,
        statut, pdf_content, message_client,
        ip_client, user_agent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
    `, [
      numeroDevis,
      formData.nom,
      formData.email,
      formData.telephone,
      formData.entreprise || null,
      JSON.stringify(formuleBase),
      JSON.stringify(optionsDetails),
      totalHT,
      0, // Pas de TVA
      totalHT, // Total TTC = Total HT pour micro-entreprise
      codePromo?.code || null,
      codePromo?.reduction || 0,
      codePromo?.type || null,
      'envoyé',
      pdfBase64,
      formData.message || null,
      ip,
      userAgent
    ])
    
    // Configuration du transporteur email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
    
    // Convertir le PDF pour l'attachement email
    const pdfBuffer = Buffer.from(pdfBase64, 'base64')
    
    // Email de confirmation au client (SANS PDF)
    const mailOptionsClient = {
      from: process.env.EMAIL_USER,
      to: formData.email,
      subject: `Votre demande de devis - ${numeroDevis}`,
      html: `
        <h2>Bonjour ${formData.nom},</h2>
        <p>Nous avons bien reçu votre demande de devis.</p>
        <p><strong>Référence :</strong> ${numeroDevis}</p>
        <h3>Prochaines étapes :</h3>
        <ol>
          <li>Nous allons étudier votre demande et vous enverrons dans les 24/48h un devis personnalisé</li>
          <li>Si vous acceptez le devis, faites rapidement le paiement des 50% du solde (infos sur le devis)</li>
          <li>Une fois votre paiement reçu, nous vous contacterons rapidement par téléphone afin de faire le point sur le projet</li>
        </ol>
        <p>Pour toute question, contactez-nous à : web.online.concept@gmail.com</p>
        <p>Cordialement,<br>L'équipe Web Online Concept</p>
      `
    }
    
    // Email à l'admin AVEC LE PDF
    const mailOptionsAdmin = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Nouveau devis - ${formData.nom} - ${numeroDevis}`,
      html: `
        <h2>Nouveau devis généré</h2>
        <p><strong>N° :</strong> ${numeroDevis}</p>
        <p><strong>Client :</strong> ${formData.nom}</p>
        <p><strong>Email :</strong> ${formData.email}</p>
        <p><strong>Téléphone :</strong> ${formData.telephone}</p>
        ${formData.entreprise ? `<p><strong>Entreprise :</strong> ${formData.entreprise}</p>` : ''}
        <p><strong>Montant :</strong> ${totalHT.toFixed(2)}€ HT</p>
        ${formData.message ? `<p><strong>Message :</strong><br>${formData.message}</p>` : ''}
        ${codePromo?.code ? `<p><strong>Code promo utilisé :</strong> ${codePromo.code}</p>` : ''}
      `,
      attachments: [{
        filename: `Devis_${numeroDevis}.pdf`,
        content: pdfBuffer
      }]
    }
    
    // Envoyer les emails
    await transporter.sendMail(mailOptionsClient)
    await transporter.sendMail(mailOptionsAdmin)
    
    return NextResponse.json({ 
      success: true,
      numeroDevis,
      message: 'Devis envoyé avec succès'
    })
    
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du devis' },
      { status: 500 }
    )
  }
}