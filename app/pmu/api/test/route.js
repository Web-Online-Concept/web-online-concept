import { NextResponse } from 'next/server';

export async function GET(request) {
  console.log('🧪 Test de l\'API PMU');
  
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? 'Définie' : 'NON DÉFINIE',
      VERCEL: process.env.VERCEL ? 'Oui' : 'Non',
    },
    modules: {
      next: 'OK',
      neondatabase: 'À tester'
    }
  };
  
  // Tester l'import de Neon
  try {
    const { neon } = await import('@neondatabase/serverless');
    diagnostics.modules.neondatabase = 'OK';
    
    // Tester la connexion si DATABASE_URL existe
    if (process.env.DATABASE_URL) {
      try {
        const sql = neon(process.env.DATABASE_URL);
        const result = await sql`SELECT 1 as test`;
        diagnostics.database = {
          status: 'Connecté',
          test: result[0].test === 1 ? 'OK' : 'Erreur'
        };
      } catch (dbError) {
        diagnostics.database = {
          status: 'Erreur de connexion',
          error: dbError.message
        };
      }
    } else {
      diagnostics.database = {
        status: 'DATABASE_URL non configurée'
      };
    }
  } catch (importError) {
    diagnostics.modules.neondatabase = `Erreur: ${importError.message}`;
  }
  
  // Tester l'import des autres modules
  try {
    await import('../../lib/criteria');
    diagnostics.modules.criteria = 'OK';
  } catch (e) {
    diagnostics.modules.criteria = `Erreur: ${e.message}`;
  }
  
  try {
    await import('xlsx');
    diagnostics.modules.xlsx = 'OK';
  } catch (e) {
    diagnostics.modules.xlsx = `Erreur: ${e.message}`;
  }
  
  return NextResponse.json({
    success: true,
    message: 'Test de diagnostic PMU',
    diagnostics
  });
}

export const runtime = 'nodejs';