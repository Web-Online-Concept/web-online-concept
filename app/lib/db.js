import { Pool } from 'pg'

// Log de la connection string (masquée)
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
console.log('DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 30) + '...')

// Configuration pour Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

// Test de connexion au démarrage
pool.connect((err, client, release) => {
  if (err) {
    console.error('Erreur de connexion à la base:', err.stack)
  } else {
    console.log('Connecté à la base de données')
    // Vérifier la base de données actuelle
    client.query('SELECT current_database()', (err, result) => {
      if (!err) {
        console.log('Base de données actuelle:', result.rows[0])
      }
      // Lister les tables
      client.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`, (err, result) => {
        if (!err) {
          console.log('Tables existantes:', result.rows.map(r => r.table_name))
        }
        release()
      })
    })
  }
})

export default pool

// Helper pour exécuter des requêtes
export async function query(text, params) {
  const start = Date.now()
  try {
    console.log('Executing query:', text)
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('Query executed successfully', { duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error('Database query error:', error)
    console.error('Query was:', text)
    throw error
  }
}