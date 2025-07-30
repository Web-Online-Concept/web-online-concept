import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// Fonction pour charger les données
async function loadData(fileName) {
  try {
    const filePath = path.join(process.cwd(), 'app/data', fileName)
    const data = await fs.readFile(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error(`Erreur lecture ${fileName}:`, error)
    return null
  }
}

// Fonction pour formater une date
function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR')
}

// Fonction pour générer le CSV
function generateCSV(data) {
  const { factures, depenses, stats, year } = data
  
  // En-têtes du CSV
  let csv = 'EXPORT COMPTABLE - ANNÉE ' + year + '\n\n'
  
  // Section Résumé
  csv += 'RÉSUMÉ ANNUEL\n'
  csv += 'Type;Montant (€)\n'
  csv += `Chiffre d'affaires HT;${stats.caTotal.toFixed(2)}\n`
  csv += `TVA collectée;${stats.tvaCollectee.toFixed(2)}\n`
  csv += `Total dépenses HT;${stats.depensesTotal.toFixed(2)}\n`
  csv += `TVA déductible;${stats.tvaDeductible.toFixed(2)}\n`
  csv += `Résultat net;${stats.resultatNet.toFixed(2)}\n`
  csv += '\n'
  
  // Section Factures
  csv += 'FACTURES\n'
  csv += 'Date;Numéro;Client;Montant HT (€);TVA (€);Montant TTC (€);Statut;Date paiement\n'
  
  factures.forEach(facture => {
    // Vérifier que facture.total existe
    const total = facture.total || facture.montantTTC || 0
    const montantHT = total / 1.2
    const tva = total - montantHT
    
    csv += `${formatDate(facture.date)};`
    csv += `${facture.numero};`
    csv += `"${facture.client || facture.clientNom || ''}";`
    csv += `${montantHT.toFixed(2)};`
    csv += `${tva.toFixed(2)};`
    csv += `${total.toFixed(2)};`
    csv += `${(facture.paymentStatus === 'paid' || facture.status === 'payee') ? 'Payée' : 'En attente'};`
    csv += `${facture.paymentDate ? formatDate(facture.paymentDate) : ''}\n`
  })
  
  csv += '\n'
  
  // Section Dépenses
  csv += 'DÉPENSES\n'
  csv += 'Date;Catégorie;Description;Montant HT (€);TVA (€);Montant TTC (€)\n'
  
  depenses.forEach(depense => {
    const tvaRate = depense.tva || 20
    const montantHT = depense.montant / (1 + tvaRate / 100)
    const tva = depense.montant - montantHT
    
    csv += `${formatDate(depense.date)};`
    csv += `"${depense.categorie || ''}";`
    csv += `"${depense.description || ''}";`
    csv += `${montantHT.toFixed(2)};`
    csv += `${tva.toFixed(2)};`
    csv += `${depense.montant.toFixed(2)}\n`
  })
  
  csv += '\n'
  
  // Section TVA
  csv += 'DÉCLARATION TVA\n'
  csv += 'Trimestre;TVA collectée (€);TVA déductible (€);TVA à payer (€)\n'
  
  // Calcul par trimestre
  for (let t = 1; t <= 4; t++) {
    const startMonth = (t - 1) * 3
    const endMonth = t * 3
    
    // TVA collectée du trimestre
    const tvaCollecteeTrimestre = factures
      .filter(f => {
        const month = new Date(f.date).getMonth()
        return month >= startMonth && month < endMonth && 
          (f.paymentStatus === 'paid' || f.status === 'payee')
      })
      .reduce((sum, f) => {
        const total = f.total || f.montantTTC || 0
        return sum + (total - total / 1.2)
      }, 0)
    
    // TVA déductible du trimestre
    const tvaDeductibleTrimestre = depenses
      .filter(d => {
        const month = new Date(d.date).getMonth()
        return month >= startMonth && month < endMonth
      })
      .reduce((sum, d) => {
        const tvaRate = d.tva || 20
        return sum + (d.montant - d.montant / (1 + tvaRate / 100))
      }, 0)
    
    const tvaAPayer = Math.max(0, tvaCollecteeTrimestre - tvaDeductibleTrimestre)
    
    csv += `T${t} ${year};`
    csv += `${tvaCollecteeTrimestre.toFixed(2)};`
    csv += `${tvaDeductibleTrimestre.toFixed(2)};`
    csv += `${tvaAPayer.toFixed(2)}\n`
  }
  
  return csv
}

// GET - Générer l'export comptable
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const year = parseInt(searchParams.get('year')) || new Date().getFullYear()
    
    // Charger toutes les données nécessaires
    const [facturationData, depensesData] = await Promise.all([
      loadData('facturation.json'),
      loadData('depenses.json')
    ])
    
    if (!facturationData) {
      console.error('Pas de données de facturation')
      return NextResponse.json(
        { error: 'Données de facturation non disponibles' },
        { status: 404 }
      )
    }
    
    // Gérer le format des données
    const factures = facturationData.factures || []
    const depensesArray = depensesData?.depenses || depensesData || []
    
    // Filtrer les données par année
    const facturesYear = factures.filter(f => 
      new Date(f.date).getFullYear() === year && f.status === 'facture'
    )
    
    const depensesYear = depensesArray.filter(d => 
      new Date(d.date).getFullYear() === year
    )
    
    // Calculer les statistiques
    const stats = {
      caTotal: facturesYear
        .filter(f => f.paymentStatus === 'paid' || f.status === 'payee')
        .reduce((sum, f) => {
          const total = f.total || f.montantTTC || 0
          return sum + (total / 1.2)
        }, 0),
      tvaCollectee: facturesYear
        .filter(f => f.paymentStatus === 'paid' || f.status === 'payee')
        .reduce((sum, f) => {
          const total = f.total || f.montantTTC || 0
          return sum + (total - total / 1.2)
        }, 0),
      depensesTotal: depensesYear.reduce((sum, d) => {
        const tvaRate = d.tva || 20
        return sum + (parseFloat(d.montant) / (1 + tvaRate / 100))
      }, 0),
      tvaDeductible: depensesYear.reduce((sum, d) => {
        const tvaRate = d.tva || 20
        const montant = parseFloat(d.montant)
        return sum + (montant - montant / (1 + tvaRate / 100))
      }, 0),
      resultatNet: 0
    }
    
    stats.resultatNet = stats.caTotal - stats.depensesTotal
    
    // Générer le CSV
    const csv = generateCSV({
      factures: facturesYear,
      depenses: depensesYear,
      stats,
      year
    })
    
    // Convertir en buffer avec BOM pour Excel
    const BOM = '\uFEFF'
    const csvWithBOM = BOM + csv
    
    // Retourner le fichier CSV
    return new NextResponse(csvWithBOM, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="export-comptable-${year}.csv"`
      }
    })
    
  } catch (error) {
    console.error('Erreur export:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération de l\'export: ' + error.message },
      { status: 500 }
    )
  }
}