import { NextResponse } from 'next/server';
import { deleteByDate } from '../../../lib/db';

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    console.log('🗑️ API appelée pour supprimer la date:', date);
    
    if (!date) {
      console.error('❌ Aucune date fournie');
      return NextResponse.json(
        { error: 'Date requise' },
        { status: 400 }
      );
    }
    
    // Gérer le cas spécial "date-inconnue"
    if (date === 'date-inconnue') {
      console.log('⚠️ Tentative de suppression des dates inconnues');
      return NextResponse.json(
        { error: 'Impossible de supprimer les dates inconnues. Veuillez supprimer les chevaux individuellement.' },
        { status: 400 }
      );
    }
    
    console.log(`🗑️ Suppression de tous les chevaux du ${date}`);
    
    const result = await deleteByDate(date);
    
    console.log(`✅ Résultat de la suppression:`, result);
    
    return NextResponse.json({
      success: true,
      message: `${result.count} chevaux supprimés pour la date ${date}`,
      deletedCount: result.count
    });
    
  } catch (error) {
    console.error('❌ Erreur détaillée lors de la suppression par date:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la suppression',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';