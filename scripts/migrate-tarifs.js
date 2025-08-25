import fs from 'fs/promises'
import path from 'path'
import { query } from '../app/lib/db.js'

async function migrate() {
  try {
    // Lire le fichier JSON actuel
    const dataPath = path.join(process.cwd(), 'app', 'data', 'tarifs.json')
    const data = await fs.readFile(dataPath, 'utf8')
    const tarifs = JSON.parse(data)

    console.log('🚀 Début de la migration...')

    // 1. Migrer la formule de base
    await query('DELETE FROM formule_base')
    await query(
      'INSERT INTO formule_base (nom, prix, description) VALUES ($1, $2, $3)',
      [tarifs.formuleBase.nom, tarifs.formuleBase.prix, tarifs.formuleBase.description]
    )
    console.log('✅ Formule de base migrée')

    // 2. Migrer les options
    await query('DELETE FROM options')
    for (let i = 0; i < tarifs.options.length; i++) {
      const option = tarifs.options[i]
      await query(
        'INSERT INTO options (id, nom, prix, unite, description, ordre) VALUES ($1, $2, $3, $4, $5, $6)',
        [option.id, option.nom, option.prix, option.unite || null, option.description || null, i]
      )
    }
    console.log(`✅ ${tarifs.options.length} options migrées`)

    // 3. Migrer les codes promo
    await query('DELETE FROM codes_promo')
    for (const remise of tarifs.remises) {
      await query(
        'INSERT INTO codes_promo (code, reduction, type, description) VALUES ($1, $2, $3, $4)',
        [remise.code, remise.reduction, remise.type, remise.description]
      )
    }
    console.log(`✅ ${tarifs.remises.length} codes promo migrés`)

    console.log('🎉 Migration terminée avec succès!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error)
    process.exit(1)
  }
}

migrate()