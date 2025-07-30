export function generatePDFHTML(document, settings, client) {
  const isDevis = document.type === 'devis'
  const entreprise = settings.entreprise || {}
  const facturation = settings.facturation || {}
  const bancaire = settings.bancaire || {}
  
  // Formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }
  
  // Formater les montants
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount || 0)
  }
  
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isDevis ? 'Devis' : 'Facture'} ${document.numero}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #333;
      line-height: 1.6;
      background: white;
    }
    
    .container {
      max-width: 210mm;
      margin: 0 auto;
      padding: 20mm;
      min-height: 297mm;
    }
    
    /* En-tête */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid ${entreprise.couleurPrincipale || '#0073a8'};
    }
    
    .company-info {
      flex: 1;
    }
    
    .company-logo {
      max-width: 200px;
      max-height: 80px;
      object-fit: contain;
      margin-bottom: 10px;
    }
    
    .company-name {
      font-size: 24px;
      font-weight: bold;
      color: ${entreprise.couleurPrincipale || '#0073a8'};
      margin-bottom: 5px;
    }
    
    .company-details {
      font-size: 12px;
      color: #666;
      line-height: 1.4;
    }
    
    .document-type {
      text-align: right;
      flex-shrink: 0;
      margin-left: 40px;
    }
    
    .document-title {
      font-size: 36px;
      font-weight: bold;
      color: ${entreprise.couleurPrincipale || '#0073a8'};
      margin-bottom: 5px;
    }
    
    .document-number {
      font-size: 18px;
      color: #666;
      margin-bottom: 5px;
    }
    
    .document-date {
      font-size: 14px;
      color: #666;
    }
    
    /* Informations client et dates */
    .info-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
      gap: 40px;
    }
    
    .client-info {
      flex: 1;
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
    }
    
    .client-info h3 {
      font-size: 14px;
      text-transform: uppercase;
      color: #666;
      margin-bottom: 10px;
    }
    
    .client-name {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .dates-info {
      flex-shrink: 0;
      min-width: 200px;
    }
    
    .date-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      font-size: 14px;
    }
    
    .date-label {
      color: #666;
    }
    
    .date-value {
      font-weight: 500;
    }
    
    /* Tableau des lignes */
    .items-table {
      width: 100%;
      margin-bottom: 40px;
      border-collapse: collapse;
    }
    
    .items-table th {
      background: ${entreprise.couleurPrincipale || '#0073a8'};
      color: white;
      padding: 12px;
      text-align: left;
      font-size: 14px;
      font-weight: 500;
    }
    
    .items-table th:last-child {
      text-align: right;
    }
    
    .items-table td {
      padding: 12px;
      border-bottom: 1px solid #e0e0e0;
      font-size: 14px;
    }
    
    .items-table td:last-child {
      text-align: right;
      font-weight: 500;
    }
    
    .items-table .quantity,
    .items-table .unit-price,
    .items-table .vat {
      text-align: center;
    }
    
    /* Totaux */
    .totals-section {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 40px;
    }
    
    .totals-box {
      width: 300px;
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
    }
    
    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 14px;
    }
    
    .total-row.grand-total {
      font-size: 18px;
      font-weight: bold;
      color: ${entreprise.couleurPrincipale || '#0073a8'};
      margin-top: 10px;
      padding-top: 10px;
      border-top: 2px solid ${entreprise.couleurPrincipale || '#0073a8'};
    }
    
    /* Notes et conditions */
    .notes-section {
      margin-bottom: 40px;
    }
    
    .notes-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #333;
    }
    
    .notes-content {
      font-size: 14px;
      color: #666;
      line-height: 1.6;
      white-space: pre-line;
    }
    
    /* RIB */
    .bank-info {
      background: #e8f4f8;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 40px;
    }
    
    .bank-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
      color: ${entreprise.couleurPrincipale || '#0073a8'};
    }
    
    .bank-details {
      font-size: 14px;
      font-family: monospace;
      line-height: 1.8;
    }
    
    /* Pied de page */
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      font-size: 12px;
      color: #666;
      text-align: center;
    }
    
    .signature {
      margin: 40px 0;
      text-align: right;
    }
    
    .signature img {
      max-width: 200px;
      max-height: 80px;
      object-fit: contain;
    }
    
    /* Mentions légales */
    .legal-mentions {
      font-size: 10px;
      color: #999;
      line-height: 1.4;
      margin-top: 20px;
    }
    
    @media print {
      body {
        margin: 0;
      }
      .container {
        padding: 15mm;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- En-tête -->
    <div class="header">
      <div class="company-info">
        ${entreprise.logo ? `<img src="${entreprise.logo}" alt="${entreprise.nom}" class="company-logo">` : ''}
        <div class="company-name">${entreprise.nom || 'Votre Entreprise'}</div>
        <div class="company-details">
          ${entreprise.adresse ? `${entreprise.adresse}<br>` : ''}
          ${entreprise.codePostal || entreprise.ville ? `${entreprise.codePostal} ${entreprise.ville}<br>` : ''}
          ${entreprise.telephone ? `Tél : ${entreprise.telephone}<br>` : ''}
          ${entreprise.email ? `Email : ${entreprise.email}<br>` : ''}
          ${entreprise.siteWeb ? `Web : ${entreprise.siteWeb}<br>` : ''}
          ${entreprise.siret ? `SIRET : ${entreprise.siret}<br>` : ''}
          ${entreprise.numeroTVA ? `TVA : ${entreprise.numeroTVA}` : ''}
        </div>
      </div>
      
      <div class="document-type">
        <div class="document-title">${isDevis ? 'DEVIS' : 'FACTURE'}</div>
        <div class="document-number">${document.numero}</div>
        <div class="document-date">${formatDate(document.date)}</div>
      </div>
    </div>
    
    <!-- Informations client et dates -->
    <div class="info-section">
      <div class="client-info">
        <h3>Client</h3>
        <div class="client-name">${client.entreprise}</div>
        <div>
          ${client.contact ? `${client.contact}<br>` : ''}
          ${client.adresse ? `${client.adresse}<br>` : ''}
          ${client.codePostal || client.ville ? `${client.codePostal} ${client.ville}<br>` : ''}
          ${client.email ? `${client.email}<br>` : ''}
          ${client.telephone ? `${client.telephone}` : ''}
        </div>
      </div>
      
      <div class="dates-info">
        <div class="date-row">
          <span class="date-label">Date :</span>
          <span class="date-value">${formatDate(document.date)}</span>
        </div>
        ${isDevis && document.dateValidite ? `
          <div class="date-row">
            <span class="date-label">Validité :</span>
            <span class="date-value">${formatDate(document.dateValidite)}</span>
          </div>
        ` : ''}
        ${!isDevis && document.dateEcheance ? `
          <div class="date-row">
            <span class="date-label">Échéance :</span>
            <span class="date-value">${formatDate(document.dateEcheance)}</span>
          </div>
        ` : ''}
      </div>
    </div>
    
    <!-- Tableau des lignes -->
    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 50%">Description</th>
          <th style="width: 10%" class="quantity">Qté</th>
          <th style="width: 15%" class="unit-price">Prix unitaire</th>
          <th style="width: 10%" class="vat">TVA</th>
          <th style="width: 15%">Total HT</th>
        </tr>
      </thead>
      <tbody>
        ${document.lignes.map(ligne => `
          <tr>
            <td>${ligne.description}</td>
            <td class="quantity">${ligne.quantite}</td>
            <td class="unit-price">${formatMoney(ligne.prixUnitaire)}</td>
            <td class="vat">${ligne.tva}%</td>
            <td>${formatMoney(ligne.total)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    
    <!-- Totaux -->
    <div class="totals-section">
      <div class="totals-box">
        <div class="total-row">
          <span>Total HT</span>
          <span>${formatMoney(document.montantHT)}</span>
        </div>
        <div class="total-row">
          <span>TVA</span>
          <span>${formatMoney(document.montantTVA)}</span>
        </div>
        <div class="total-row grand-total">
          <span>Total TTC</span>
          <span>${formatMoney(document.montantTTC)}</span>
        </div>
      </div>
    </div>
    
    <!-- Notes -->
    ${document.notes ? `
      <div class="notes-section">
        <div class="notes-title">Notes</div>
        <div class="notes-content">${document.notes}</div>
      </div>
    ` : ''}
    
    <!-- Conditions -->
    ${document.conditions || facturation.conditionsPaiement ? `
      <div class="notes-section">
        <div class="notes-title">Conditions</div>
        <div class="notes-content">${document.conditions || facturation.conditionsPaiement}</div>
      </div>
    ` : ''}
    
    <!-- RIB si facture -->
    ${!isDevis && bancaire.afficherRIB && bancaire.iban ? `
      <div class="bank-info">
        <div class="bank-title">Coordonnées bancaires</div>
        <div class="bank-details">
          ${bancaire.titulaire ? `Titulaire : ${bancaire.titulaire}<br>` : ''}
          IBAN : ${bancaire.iban}<br>
          ${bancaire.bic ? `BIC : ${bancaire.bic}<br>` : ''}
          ${bancaire.banque ? `Banque : ${bancaire.banque}` : ''}
        </div>
      </div>
    ` : ''}
    
    <!-- Signature -->
    ${facturation.signature ? `
      <div class="signature">
        <img src="${facturation.signature}" alt="Signature">
      </div>
    ` : ''}
    
    <!-- Pied de page -->
    <div class="footer">
      ${facturation.piedPage ? `<div>${facturation.piedPage}</div>` : ''}
      
      <div class="legal-mentions">
        ${facturation.mentionsLegales || ''}
        ${entreprise.formeJuridique && entreprise.capital ? `<br>${entreprise.formeJuridique} au capital de ${entreprise.capital}` : ''}
      </div>
    </div>
  </div>
</body>
</html>
  `
}