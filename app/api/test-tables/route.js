import { NextResponse } from 'next/server'
import { Pool } from 'pg'

export async function GET() {
  let client;
  
  try {
    // Créer une nouvelle connexion directe
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
    })
    
    client = await pool.connect()
    
    // Test 1: Vérifier la base de données
    const dbResult = await client.query('SELECT current_database()')
    
    // Test 2: Lister toutes les tables
    const tablesResult = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
    `)
    
    // Test 3: Vérifier si formule_base existe
    const checkFormuleBase = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'formule_base'
      )
    `)
    
    // Test 4: Essayer de lire formule_base
    let formuleBaseData = null
    let formuleBaseError = null
    
    try {
      const result = await client.query('SELECT * FROM formule_base LIMIT 1')
      formuleBaseData = result.rows
    } catch (err) {
      formuleBaseError = err.message
    }
    
    client.release()
    await pool.end()
    
    return NextResponse.json({
      success: true,
      database: dbResult.rows[0],
      tables: tablesResult.rows.map(r => r.tablename),
      formuleBaseExists: checkFormuleBase.rows[0].exists,
      formuleBaseData,
      formuleBaseError,
      connectionString: process.env.DATABASE_URL ? 'Exists' : 'Missing',
      environment: process.env.NODE_ENV || 'development'
    })
    
  } catch (error) {
    if (client) client.release()
    
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}