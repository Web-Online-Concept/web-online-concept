import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import fs from 'fs/promises'
import path from 'path'

// Créer le transporteur email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// Générer un numéro de devis unique
function generateQuoteNumber() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `WOC-${year}${month}-${random}`
}

// Générer le PDF du devis
async function generatePDF(formData, quoteNumber) {
  const doc = new jsPDF()
  
  // En-tête avec bandeau
  try {
    const imagePath = path.join(process.cwd(), 'public', 'images', 'bandeau_devis.png')
    const imageData = await fs.readFile(imagePath, { encoding: 'base64' })
    doc.addImage(`data:image/png;base64,${imageData}`, 'PNG', 0, 0, 210, 40)
  } catch (error) {
    // Si l'image n'existe pas, on continue sans
    doc.setFillColor(0, 115, 168)
    doc.rect(0, 0, 210, 40, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.text('WEB ONLINE CONCEPT', 105, 25, { align: 'center' })
  }

  // Informations du devis
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(20)
  doc.text('DEVIS', 20, 60)
  
  doc.setFontSize(12)
  doc.text(`Devis N° : ${quoteNumber}`, 20, 70)
  doc.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, 20, 78)
  
  // Informations client
  doc.setFontSize(14)
  doc.text('CLIENT', 120, 60)
  doc.setFontSize(11)
  doc.text(`${formData.prenom} ${formData.nom}`, 120, 70)
  if (formData.entreprise) {
    doc.text(formData.entreprise, 120, 78)
  }
  doc.text(formData.email, 120, 86)
  doc.text(formData.telephone, 120, 94)

  // Tableau des prestations
  const tableData = []
  let total = 0

  // Formule de base
  if (formData.siteWeb) {
    tableData.push(['Site Web - Formule de Base', '1', '500 €', '500 €'])
    total += 500
  }

  // Options
  formData.options.forEach(option => {
    tableData.push([option.nom, option.quantite || '1', `${option.prix} €`, `${option.total} €`])
    total += option.total
  })

  // Ajouter la remise si applicable
  if (formData.remise && formData.remise.montant > 0) {
    tableData.push([
      `Remise (${formData.remise.description})`,
      '1',
      `-${formData.remise.montant} €`,
      `-${formData.remise.montant} €`
    ])
    total -= formData.remise.montant
  }

  doc.autoTable({
    startY: 110,
    head: [['Description', 'Quantité', 'Prix unitaire', 'Total']],
    body: tableData,
    theme: 'striped',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [0, 115, 168] }
  })

  // Total
  const finalY = doc.lastAutoTable.finalY + 10
  doc.setFontSize(12)
  doc.setFont(undefined, 'bold')
  doc.text('TOTAL HT :', 140, finalY)
  doc.text(`${total} €`, 180, finalY, { align: 'right' })

  // Commentaire projet
  if (formData.commentaire) {
    doc.setFont(undefined, 'normal')
    doc.setFontSize(11)
    doc.text('Description du projet :', 20, finalY + 20)
    const lines = doc.splitTextToSize(formData.commentaire, 170)
    doc.text(lines, 20, finalY + 30)
  }

  // Conditions
  doc.setFontSize(9)
  doc.setTextColor(100)
  const bottomY = 270
  doc.text('Conditions : Devis valable 30 jours. Acompte de 30% à la commande.', 20, bottomY)
  doc.text('Paiement : Virement bancaire ou chèque', 20, bottomY + 5)

  return doc.output('arraybuffer')
}

export async function POST(request) {
  try {
    const formData = await request.json()
    const quoteNumber = generateQuoteNumber()

    // Générer le PDF
    const pdfBuffer = await generatePDF(formData, quoteNumber)

    // Email pour Web Online Concept
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Nouvelle demande de devis - ${quoteNumber}`,
      html: `
        <h2>Nouvelle demande de devis</h2>
        <p><strong>Numéro :</strong> ${quoteNumber}</p>
        <p><strong>Client :</strong> ${formData.prenom} ${formData.nom}</p>
        ${formData.entreprise ? `<p><strong>Entreprise :</strong> ${formData.entreprise}</p>` : ''}
        <p><strong>Email :</strong> ${formData.email}</p>
        <p><strong>Téléphone :</strong> ${formData.telephone}</p>
        <p><strong>Montant total :</strong> ${formData.total} €</p>
        ${formData.commentaire ? `<p><strong>Projet :</strong><br>${formData.commentaire.replace(/\n/g, '<br>')}</p>` : ''}
      `,
      attachments: [{
        filename: `devis-${quoteNumber}.pdf`,
        content: Buffer.from(pdfBuffer)
      }]
    }

    // Email de confirmation pour le client
    const clientMailOptions = {
      from: process.env.EMAIL_USER,
      to: formData.email,
      subject: 'Votre demande de devis - Web Online Concept',
      html: `
        <h2>Bonjour ${formData.prenom},</h2>
        <p>Nous avons bien reçu votre demande de devis.</p>
        <p>Votre référence : <strong>${quoteNumber}</strong></p>
        <p>Nous allons étudier votre projet et vous recontacter dans les plus brefs délais.</p>
        <p>Vous trouverez en pièce jointe le récapitulatif de votre demande.</p>
        <br>
        <p>Cordialement,<br>L'équipe Web Online Concept</p>
      `,
      attachments: [{
        filename: `devis-${quoteNumber}.pdf`,
        content: Buffer.from(pdfBuffer)
      }]
    }

    // Envoyer les emails
    await transporter.sendMail(adminMailOptions)
    await transporter.sendMail(clientMailOptions)

    return NextResponse.json({ 
      success: true, 
      quoteNumber,
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