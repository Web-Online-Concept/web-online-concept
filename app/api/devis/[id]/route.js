import { query } from '@/app/lib/db'
import { NextResponse } from 'next/server'
import { verifyAuth } from '@/app/lib/auth'

export async function GET(request, { params }) {
  try {
    // Vérifier l'authentification
    const authResult = verifyAuth()
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const devisId = params.id
    
    // Vérifier si c'est une demande de PDF
    const isPdfRequest = request.url.endsWith('/pdf')
    
    if (isPdfRequest) {
      // Récupérer le PDF depuis la base
      const result = await query(
        'SELECT pdf_content, numero FROM devis WHERE id = $1',
        [devisId]
      )
      
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Devis non trouvé' }, { status: 404 })
      }
      
      const { pdf_content, numero } = result.rows[0]
      
      // Convertir le base64 en buffer
      const pdfBuffer = Buffer.from(pdf_content, 'base64')
      
      // Retourner le PDF
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="Devis_${numero}.pdf"`,
        },
      })
    } else {
      // Récupérer les détails du devis
      const result = await query(
        'SELECT * FROM devis WHERE id = $1',
        [devisId]
      )
      
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Devis non trouvé' }, { status: 404 })
      }
      
      return NextResponse.json(result.rows[0])
    }
    
  } catch (error) {
    console.error('Erreur récupération devis:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération' },
      { status: 500 }
    )
  }
}