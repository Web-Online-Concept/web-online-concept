import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function POST(request) {
  try {
    // Récupérer le fichier
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }
    
    // Vérifier l'extension
    if (!file.name.endsWith('.xlsx')) {
      return NextResponse.json(
        { error: 'Le fichier doit être au format .xlsx' },
        { status: 400 }
      );
    }
    
    console.log(`🔄 Conversion de ${file.name} en XLS`);
    
    // Lire le fichier XLSX
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { 
      type: 'array',
      cellStyles: true,
      cellFormula: true,
      cellDates: true,
      cellNF: true,
      sheetStubs: true
    });
    
    // Convertir en XLS (BIFF8)
    const xlsBuffer = XLSX.write(workbook, { 
      bookType: 'xls',
      type: 'buffer',
      bookSST: true,
      compression: false
    });
    
    // Créer le nom du fichier de sortie
    const outputFileName = file.name.replace('.xlsx', '.xls');
    
    console.log(`✅ Conversion réussie: ${outputFileName}`);
    
    // Retourner le fichier converti
    return new NextResponse(xlsBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.ms-excel',
        'Content-Disposition': `attachment; filename="${outputFileName}"`,
        'Content-Length': xlsBuffer.length.toString()
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la conversion:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la conversion du fichier',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Configuration
export const runtime = 'nodejs';
export const maxDuration = 30;