import { neon } from '@neondatabase/serverless';

// Obtenir la connexion à la base de données
const sql = neon(process.env.DATABASE_URL);

// Fonction pour initialiser les tables si elles n'existent pas
export async function initDatabase() {
  try {
    // Table des imports
    await sql`
      CREATE TABLE IF NOT EXISTS pmu_imports (
        id SERIAL PRIMARY KEY,
        date_import TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fichier_nom VARCHAR(255),
        critere_utilise VARCHAR(100),
        nombre_chevaux INTEGER DEFAULT 0
      )
    `;

    // Table des chevaux sélectionnés
    await sql`
      CREATE TABLE IF NOT EXISTS pmu_chevaux (
        id SERIAL PRIMARY KEY,
        import_id INTEGER REFERENCES pmu_imports(id) ON DELETE CASCADE,
        
        -- Info course
        date_course DATE,
        numero_reunion VARCHAR(10),
        hippodrome VARCHAR(100),
        numero_course INTEGER,
        heure_course TIME,
        discipline VARCHAR(50),
        nb_partants INTEGER,
        distance VARCHAR(20),
        type_depart VARCHAR(50),
        
        -- Info cheval
        numero_cheval INTEGER,
        nom_cheval VARCHAR(100),
        age INTEGER,
        sexe VARCHAR(10),
        
        -- Performances
        pourcent_g_hippo DECIMAL(5,2),
        pourcent_p_hippo DECIMAL(5,2),
        clt_ca VARCHAR(20),
        first_def VARCHAR(10),
        def VARCHAR(10),
        def_1 VARCHAR(10),
        def_2 VARCHAR(10),
        def_3 VARCHAR(10),
        def_4 VARCHAR(10),
        def_5 VARCHAR(10),
        def_6 VARCHAR(10),
        def_7 VARCHAR(10),
        def_8 VARCHAR(10),
        
        -- Stats cheval
        pourcent_g_ch_histo DECIMAL(5,2),
        pourcent_g_ch DECIMAL(5,2),
        pourcent_p_ch DECIMAL(5,2),
        pourcent_total_ch DECIMAL(5,2),
        clt_ch VARCHAR(20),
        
        -- Les hommes
        entraineur VARCHAR(100),
        pourcent_g_ent DECIMAL(5,2),
        pourcent_p_ent DECIMAL(5,2),
        pourcent_total_ent DECIMAL(5,2),
        clt_ent VARCHAR(20),
        pilote VARCHAR(100),
        poids_fav VARCHAR(20),
        pourcent_g_pi DECIMAL(5,2),
        pourcent_p_pi DECIMAL(5,2),
        pourcent_total_pi DECIMAL(5,2),
        clt_pi VARCHAR(20),
        
        -- Musique
        musique TEXT,
        mus1 VARCHAR(10),
        mus2 VARCHAR(10),
        mus3 VARCHAR(10),
        mus4 VARCHAR(10),
        mus5 VARCHAR(10),
        mus6 VARCHAR(10),
        
        -- Engagement
        tempo VARCHAR(50),
        gains_carriere DECIMAL(12,2),
        statut VARCHAR(50),
        
        -- Données complètes en JSON
        data_complete JSONB,
        
        -- Métadonnées
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP DEFAULT NULL
      )
    `;

    // Index pour améliorer les performances
    await sql`
      CREATE INDEX IF NOT EXISTS idx_pmu_chevaux_import_id 
      ON pmu_chevaux(import_id);
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_pmu_chevaux_date_course 
      ON pmu_chevaux(date_course);
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_pmu_chevaux_deleted_at 
      ON pmu_chevaux(deleted_at);
    `;

    console.log('✅ Base de données initialisée avec succès');
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la BDD:', error);
    return { success: false, error: error.message };
  }
}

// Fonction pour obtenir tous les chevaux (non supprimés)
export async function getAllChevaux(filters = {}) {
  try {
    // Requête de base
    let chevaux = await sql`
      SELECT c.*, i.fichier_nom, i.critere_utilise, i.date_import
      FROM pmu_chevaux c
      JOIN pmu_imports i ON c.import_id = i.id
      WHERE c.deleted_at IS NULL
      ORDER BY c.date_course DESC, c.numero_reunion ASC, c.numero_course ASC, c.numero_cheval ASC
    `;
    
    // Log pour debug
    console.log('🐴 Nombre de chevaux récupérés depuis la BDD:', chevaux.length);
    if (chevaux.length > 0) {
      console.log('Premier cheval:', {
        nom: chevaux[0].nom_cheval,
        date_course: chevaux[0].date_course,
        type_date: typeof chevaux[0].date_course,
        heure_course: chevaux[0].heure_course
      });
    }
    
    // Convertir les dates en format string ISO pour JavaScript
    chevaux = chevaux.map(cheval => {
      if (cheval.date_course) {
        // Si c'est un objet Date, le convertir en string ISO
        if (cheval.date_course instanceof Date) {
          cheval.date_course = cheval.date_course.toISOString().split('T')[0];
        }
        // Si c'est déjà une string mais avec le temps, garder juste la date
        else if (typeof cheval.date_course === 'string' && cheval.date_course.includes('T')) {
          cheval.date_course = cheval.date_course.split('T')[0];
        }
      }
      return cheval;
    });
    
    // Appliquer les filtres en JavaScript (plus simple avec Neon)
    if (filters.dateDebut) {
      console.log('Filtre date début:', filters.dateDebut);
      chevaux = chevaux.filter(c => {
        if (!c.date_course) return false;
        return c.date_course >= filters.dateDebut;
      });
    }
    
    if (filters.dateFin) {
      console.log('Filtre date fin:', filters.dateFin);
      chevaux = chevaux.filter(c => {
        if (!c.date_course) return false;
        return c.date_course <= filters.dateFin;
      });
    }
    
    if (filters.hippodrome) {
      console.log('Filtre hippodrome:', filters.hippodrome);
      chevaux = chevaux.filter(c => c.hippodrome === filters.hippodrome);
    }
    
    if (filters.critere) {
      console.log('Filtre critère:', filters.critere);
      chevaux = chevaux.filter(c => c.critere_utilise === filters.critere);
    }
    
    console.log('Nombre de chevaux après filtrage:', chevaux.length);
    return chevaux;
  } catch (error) {
    console.error('Erreur lors de la récupération des chevaux:', error);
    throw error;
  }
}

// Fonction pour supprimer un cheval (soft delete)
export async function deleteCheval(id) {
  try {
    await sql`
      UPDATE pmu_chevaux 
      SET deleted_at = CURRENT_TIMESTAMP 
      WHERE id = ${id}
    `;
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la suppression du cheval:', error);
    throw error;
  }
}

// Fonction pour supprimer tous les chevaux d'une date (soft delete)
export async function deleteByDate(date) {
  try {
    console.log('🗑️ Suppression des chevaux pour la date:', date);
    
    // Gérer le cas spécial "date-inconnue"
    if (date === 'date-inconnue') {
      throw new Error('Impossible de supprimer les dates inconnues');
    }
    
    // S'assurer que la date est valide avant de la formater
    let dateFormatted;
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        throw new Error(`Date invalide: ${date}`);
      }
      dateFormatted = dateObj.toISOString().split('T')[0];
    } catch (e) {
      console.error('❌ Erreur de conversion de date:', e);
      throw new Error(`Format de date invalide: ${date}`);
    }
    
    console.log('📅 Date formatée:', dateFormatted);
    
    // Effectuer la suppression soft (mise à jour de deleted_at)
    const result = await sql`
      UPDATE pmu_chevaux 
      SET deleted_at = CURRENT_TIMESTAMP 
      WHERE date_course = ${dateFormatted}
      AND deleted_at IS NULL
      RETURNING id
    `;
    
    console.log(`✅ ${result.length} chevaux supprimés pour la date ${dateFormatted}`);
    
    return {
      success: true,
      count: result.length
    };
  } catch (error) {
    console.error('❌ Erreur lors de la suppression par date:', error);
    throw error;
  }
}

// Fonction pour créer un import
export async function createImport(fileName, critereName, chevauxCount) {
  try {
    const result = await sql`
      INSERT INTO pmu_imports (fichier_nom, critere_utilise, nombre_chevaux)
      VALUES (${fileName}, ${critereName}, ${chevauxCount})
      RETURNING id
    `;
    return result[0].id;
  } catch (error) {
    console.error('Erreur lors de la création de l\'import:', error);
    throw error;
  }
}

// Fonction pour insérer un cheval - CORRIGÉE POUR LA DATE
export async function insertCheval(importId, chevalData) {
  try {
    // S'assurer que la date est bien présente et au bon format
    const dateStr = chevalData.date_course || null;
    
    // Log pour debug
    console.log(`📅 Insertion cheval ${chevalData.nom_cheval} avec date: ${dateStr}`);
    
    const result = await sql`
      INSERT INTO pmu_chevaux (
        import_id,
        date_course,
        numero_reunion,
        hippodrome,
        numero_course,
        heure_course,
        discipline,
        nb_partants,
        distance,
        type_depart,
        numero_cheval,
        nom_cheval,
        age,
        sexe,
        pourcent_g_hippo,
        pourcent_p_hippo,
        clt_ca,
        first_def,
        def,
        def_1,
        def_2,
        def_3,
        def_4,
        def_5,
        def_6,
        def_7,
        def_8,
        pourcent_g_ch_histo,
        pourcent_g_ch,
        pourcent_p_ch,
        pourcent_total_ch,
        clt_ch,
        entraineur,
        pourcent_g_ent,
        pourcent_p_ent,
        pourcent_total_ent,
        clt_ent,
        pilote,
        poids_fav,
        pourcent_g_pi,
        pourcent_p_pi,
        pourcent_total_pi,
        clt_pi,
        musique,
        mus1,
        mus2,
        mus3,
        mus4,
        mus5,
        mus6,
        tempo,
        gains_carriere,
        statut,
        data_complete
      ) VALUES (
        ${importId},
        ${dateStr},
        ${chevalData.numero_reunion || null},
        ${chevalData.hippodrome || null},
        ${chevalData.numero_course || null},
        ${chevalData.heure_course || null},
        ${chevalData.discipline || null},
        ${chevalData.nb_partants || null},
        ${chevalData.distance || null},
        ${chevalData.type_depart || null},
        ${chevalData.numero_cheval || null},
        ${chevalData.nom_cheval || null},
        ${chevalData.age || null},
        ${chevalData.sexe || null},
        ${chevalData.pourcent_g_hippo || null},
        ${chevalData.pourcent_p_hippo || null},
        ${chevalData.clt_ca || null},
        ${chevalData.first_def || null},
        ${chevalData.def || null},
        ${chevalData.def_1 || null},
        ${chevalData.def_2 || null},
        ${chevalData.def_3 || null},
        ${chevalData.def_4 || null},
        ${chevalData.def_5 || null},
        ${chevalData.def_6 || null},
        ${chevalData.def_7 || null},
        ${chevalData.def_8 || null},
        ${chevalData.pourcent_g_ch_histo || null},
        ${chevalData.pourcent_g_ch || null},
        ${chevalData.pourcent_p_ch || null},
        ${chevalData.pourcent_total_ch || null},
        ${chevalData.clt_ch || null},
        ${chevalData.entraineur || null},
        ${chevalData.pourcent_g_ent || null},
        ${chevalData.pourcent_p_ent || null},
        ${chevalData.pourcent_total_ent || null},
        ${chevalData.clt_ent || null},
        ${chevalData.pilote || null},
        ${chevalData.poids_fav || null},
        ${chevalData.pourcent_g_pi || null},
        ${chevalData.pourcent_p_pi || null},
        ${chevalData.pourcent_total_pi || null},
        ${chevalData.clt_pi || null},
        ${chevalData.musique || null},
        ${chevalData.mus1 || null},
        ${chevalData.mus2 || null},
        ${chevalData.mus3 || null},
        ${chevalData.mus4 || null},
        ${chevalData.mus5 || null},
        ${chevalData.mus6 || null},
        ${chevalData.tempo || null},
        ${chevalData.gains_carriere || null},
        ${chevalData.statut || null},
        ${JSON.stringify(chevalData.data_complete || {})}
      )
      RETURNING id
    `;
    return result[0].id;
  } catch (error) {
    console.error('Erreur lors de l\'insertion du cheval:', error);
    throw error;
  }
}

// Fonction pour supprimer DÉFINITIVEMENT les chevaux sans date
export async function deleteInvalidDates() {
  try {
    console.log('🗑️ Suppression définitive des chevaux sans date valide');
    
    const result = await sql`
      DELETE FROM pmu_chevaux 
      WHERE date_course IS NULL
      RETURNING id, nom_cheval
    `;
    
    console.log(`✅ ${result.length} chevaux sans date supprimés définitivement`);
    result.forEach(r => console.log(`- Supprimé: ${r.nom_cheval} (ID: ${r.id})`));
    
    return {
      success: true,
      count: result.length,
      deleted: result
    };
  } catch (error) {
    console.error('❌ Erreur lors de la suppression des dates invalides:', error);
    throw error;
  }
}