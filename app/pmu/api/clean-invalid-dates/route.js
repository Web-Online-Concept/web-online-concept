import { NextResponse } from 'next/server';
import { deleteInvalidDates } from '../../lib/db';

export async function DELETE() {
  try {
    console.log('🧹 Nettoyage des dates invalides demandé');
    
    const result = await deleteInvalidDates();
    
    return NextResponse.json({
      success: true,
      message: `${result.count} chevaux sans date valide ont été supprimés`,
      details: result
    });
    
  } catch (error) {
    console.error('Erreur lors du nettoyage:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}