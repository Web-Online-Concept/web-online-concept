import { NextResponse } from 'next/server';
import { initDatabase } from '../../lib/db';

// POST - Initialiser la base de données
export async function POST(request) {
  try {
    console.log('🚀 Initialisation de la base de données...');
    
    // Vérifier si on a une clé secrète pour sécuriser un peu l'endpoint
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    
    // Clé simple pour éviter les appels accidentels
    if (key !== 'init-pmu-2025') {
      return NextResponse.json(
        { error: 'Clé d\'initialisation invalide' },
        { status: 401 }
      );
    }
    
    // Initialiser la base de données
    const result = await initDatabase();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Base de données initialisée avec succès',
        details: {
          tables: ['pmu_imports', 'pmu_chevaux'],
          indexes: [
            'idx_pmu_chevaux_import_id',
            'idx_pmu_chevaux_date_course',
            'idx_pmu_chevaux_deleted_at'
          ]
        }
      });
    } else {
      throw new Error(result.error || 'Échec de l\'initialisation');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    
    // Vérifier si c'est une erreur de connexion
    if (error.message.includes('connect')) {
      return NextResponse.json(
        { 
          error: 'Impossible de se connecter à la base de données',
          details: 'Vérifiez que Neon est bien configuré dans Vercel',
          solution: 'Allez dans Vercel Dashboard > Storage > Vérifiez la connexion'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Erreur lors de l\'initialisation de la base de données',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// GET - Vérifier l'état de la base de données
export async function GET(request) {
  try {
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL);
    
    // Vérifier si les tables existent
    const tablesCheck = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('pmu_imports', 'pmu_chevaux')
    `;
    
    const existingTables = tablesCheck.map(row => row.table_name);
    const requiredTables = ['pmu_imports', 'pmu_chevaux'];
    const missingTables = requiredTables.filter(t => !existingTables.includes(t));
    
    if (missingTables.length > 0) {
      return NextResponse.json({
        initialized: false,
        message: 'Base de données non initialisée',
        missingTables: missingTables,
        instruction: 'Appelez POST /api/init-db?key=init-pmu-2025 pour initialiser'
      });
    }
    
    // Compter les enregistrements
    const countsResult = await sql`
      SELECT 
        (SELECT COUNT(*) FROM pmu_imports) as imports_count,
        (SELECT COUNT(*) FROM pmu_chevaux WHERE deleted_at IS NULL) as chevaux_count
    `;
    
    const counts = countsResult[0];
    
    return NextResponse.json({
      initialized: true,
      message: 'Base de données opérationnelle',
      stats: {
        tables: existingTables,
        imports: parseInt(counts.imports_count),
        chevaux: parseInt(counts.chevaux_count)
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
    
    if (error.message.includes('connect')) {
      return NextResponse.json({
        initialized: false,
        error: 'Impossible de se connecter à la base de données',
        details: 'Vérifiez la configuration Neon dans Vercel'
      });
    }
    
    return NextResponse.json({
      initialized: false,
      error: 'Erreur lors de la vérification',
      details: error.message
    });
  }
}