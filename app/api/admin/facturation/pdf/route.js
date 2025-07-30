import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

// Générer le HTML pour un document
function generateDocumentHTML(document, entreprise) {
  const isFacture = document.type === 'facture'
  
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${isFacture ? 'Facture' : 'Devis'} ${document.numero}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 40px;
            color: #333;
        }
        .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
        }
        .company-info h1 {
            color: #4F46E5;
            margin: 0;
        }
        .document-info {
            text-align: right;
        }
        .document-type {
            font-size: 32px;
            font-weight: bold;
            color: #4F46E5;
            margin: 0;
        }
        .document-number {
            font-size: 18px;
            color: #666;
            margin: 5px 0;
        }
        .document-date {
            font-size: 14px;
            color: #666;
        }
        .client-info {
            background: #F9FAFB;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        th {
            background: #4F46E5;
            color: white;
            padding: 12px;
            text-align: left;
        }
        td {
            padding: 12px;
            border-bottom: 1px solid #E5E7EB;
        }
        .total-section {
            display: flex;
            justify-content: flex-end;
            margin-top: 30px;
        }
        .total-box {
            width: 300px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
        }
        .total-ttc {
            font-size: 20px;
            font-weight: bold;
            color: #4F46E5;
            border-top: 2px solid #4F46E5;
            padding-top: 10px;
            margin-top: 10px;
        }
        .footer {
            margin-top: 60px;
            padding-top: 20px;
            border-top: 1px solid #E5E7EB;
            font-size: 12px;
            color: #666;
            text-align: center;
        }
        .payment-info {
            margin: 30px 0;
            padding: 20px;
            background: #F0F9FF;
            border-radius: 8px;
            border-left: 4px solid #3B82F6;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-info">
            <h1>${entreprise?.nom || 'Web Online Concept'}</h1>
            <p>${entreprise?.adresse || ''}</p>
            <p>${entreprise?.codePostal || ''} ${entreprise?.ville || ''}</p>
            <p>Tél : ${entreprise?.telephone || ''}</p>
            <p>Email : ${entreprise?.email || 'web.online.concept@gmail.com'}</p>
            ${entreprise?.siret ? `<p>SIRET : ${entreprise.siret}</p>` : ''}
        </div>
        <div class="document-info">
            <p class="document-type">${isFacture ? 'FACTURE' : 'DEVIS'}</p>
            <p class="document-number">${document.numero}</p>
            <p class="document-date">Date : ${new Date(document.date).toLocaleDateString('fr-FR')}</p>
            ${document.dateEcheance ? `<p class="document-date">Échéance : ${new Date(document.dateEcheance).toLocaleDateString('fr-FR')}</p>` : ''}
        </div>
    </div>

    <div class="client-info">
        <h3>Client</h3>
        <p><strong>${document.client?.entreprise || document.clientNom || 'Client'}</strong></p>
        ${document.client?.contact ? `<p>${document.client.contact}</p>` : ''}
        ${document.client?.adresse ? `<p>${document.client.adresse}</p>` : ''}
        ${document.client?.codePostal ? `<p>${document.client.codePostal} ${document.client.ville || ''}</p>` : ''}
        ${document.client?.email ? `<p>Email : ${document.client.email}</p>` : ''}
    </div>

    ${document.objet ? `<p><strong>Objet :</strong> ${document.objet}</p>` : ''}

    <table>
        <thead>
            <tr>
                <th style="width: 50%">Description</th>
                <th style="width: 15%; text-align: right">Quantité</th>
                <th style="width: 15%; text-align: right">Prix unitaire</th>
                <th style="width: 20%; text-align: right">Total HT</th>
            </tr>
        </thead>
        <tbody>
            ${(document.lignes || []).map(ligne => `
                <tr>
                    <td>${ligne.description}</td>
                    <td style="text-align: right">${ligne.quantite}</td>
                    <td style="text-align: right">${ligne.prixUnitaire.toFixed(2)} €</td>
                    <td style="text-align: right">${(ligne.quantite * ligne.prixUnitaire).toFixed(2)} €</td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    <div class="total-section">
        <div class="total-box">
            <div class="total-row">
                <span>Total HT</span>
                <span>${document.montantHT?.toFixed(2) || '0.00'} €</span>
            </div>
            <div class="total-row">
                <span>TVA (${document.tauxTVA || 20}%)</span>
                <span>${document.montantTVA?.toFixed(2) || '0.00'} €</span>
            </div>
            <div class="total-row total-ttc">
                <span>Total TTC</span>
                <span>${document.montantTTC?.toFixed(2) || '0.00'} €</span>
            </div>
        </div>
    </div>

    ${isFacture && document.statut === 'envoye' ? `
        <div class="payment-info">
            <h4>Modalités de paiement</h4>
            <p>Paiement à réception de facture par virement bancaire.</p>
            ${entreprise?.iban ? `<p>IBAN : ${entreprise.iban}</p>` : ''}
            <p>En cas de retard de paiement, des pénalités de retard seront appliquées.</p>
        </div>
    ` : ''}

    ${!isFacture ? `
        <div class="payment-info">
            <h4>Conditions</h4>
            <p>Devis valable 30 jours à compter de sa date d'émission.</p>
            <p>Acompte de 30% à la commande.</p>
        </div>
    ` : ''}

    ${document.notes ? `
        <div style="margin-top: 30px; padding: 20px; background: #F9FAFB; border-radius: 8px;">
            <h4>Notes</h4>
            <p>${document.notes}</p>
        </div>
    ` : ''}

    <div class="footer">
        <p>${entreprise?.nom || 'Web Online Concept'} - ${entreprise?.adresse || ''} ${entreprise?.codePostal || ''} ${entreprise?.ville || ''}</p>
        ${entreprise?.siret ? `<p>SIRET : ${entreprise.siret} - TVA : ${entreprise.tva || ''}</p>` : ''}
        <p>Contact : ${entreprise?.telephone || ''} - ${entreprise?.email || 'web.online.concept@gmail.com'}</p>
    </div>
</body>
</html>
  `
}

// POST - Générer un PDF
export async function POST(request) {
  try {
    const body = await request.json()
    const { documentId } = body
    
    if (!documentId) {
      return NextResponse.json({ error: 'ID document requis' }, { status: 400 })
    }
    
    // Charger les documents
    const docsPath = path.join(process.cwd(), 'app', 'data', 'facturation.json')
    const docsData = await readFile(docsPath, 'utf8')
    const docs = JSON.parse(docsData)
    
    // Trouver le document
    const allDocs = [...(docs.factures || []), ...(docs.devis || [])]
    const document = allDocs.find(d => d.id === documentId)
    
    if (!document) {
      return NextResponse.json({ error: 'Document non trouvé' }, { status: 404 })
    }
    
    // Charger les infos entreprise
    let entreprise = {}
    try {
      const paramsPath = path.join(process.cwd(), 'app', 'data', 'parametres.json')
      const paramsData = await readFile(paramsPath, 'utf8')
      const params = JSON.parse(paramsData)
      entreprise = params.entreprise || {}
    } catch (error) {
      console.error('Erreur chargement entreprise:', error)
    }
    
    // Générer le HTML
    const html = generateDocumentHTML(document, entreprise)
    
    // Pour un vrai PDF, il faudrait utiliser Puppeteer ou similar
    // Pour l'instant, on retourne le HTML
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    })
    
  } catch (error) {
    console.error('Erreur génération PDF:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}