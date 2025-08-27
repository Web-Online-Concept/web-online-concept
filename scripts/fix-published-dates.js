import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' })

const sql = neon(process.env.DATABASE_URL)

async function fixPublishedDates() {
  try {
    console.log('Recherche des articles publiés sans date de publication...')
    
    // Trouver tous les articles avec status 'published' mais sans published_at
    const articlesWithoutDate = await sql`
      SELECT id, title, created_at 
      FROM posts 
      WHERE status = 'published' 
      AND (published_at IS NULL OR published_at = '')
    `
    
    if (articlesWithoutDate.length === 0) {
      console.log('✅ Aucun article à corriger trouvé.')
      return
    }
    
    console.log(`🔍 ${articlesWithoutDate.length} article(s) à corriger :`)
    
    // Corriger chaque article
    for (const article of articlesWithoutDate) {
      console.log(`- ${article.title}`)
      
      // Utiliser created_at comme published_at
      await sql`
        UPDATE posts 
        SET published_at = ${article.created_at}
        WHERE id = ${article.id}
      `
    }
    
    console.log('✅ Correction terminée avec succès !')
    
    // Vérifier le résultat
    const verifyResult = await sql`
      SELECT COUNT(*) as count 
      FROM posts 
      WHERE status = 'published' 
      AND (published_at IS NULL OR published_at = '')
    `
    
    console.log(`📊 Articles publiés sans date après correction : ${verifyResult[0].count}`)
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction :', error)
  } finally {
    process.exit()
  }
}

// Exécuter le script
console.log('🚀 Démarrage du script de correction des dates de publication...')
fixPublishedDates()