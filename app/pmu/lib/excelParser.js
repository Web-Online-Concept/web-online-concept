import * as XLSX from 'xlsx';
import { applyCriteria, COLONNES } from './criteria';

// Fonction pour convertir un nombre Excel en date
function excelDateToJSDate(excelDate) {
  // Excel stocke les dates comme nombre de jours depuis le 1/1/1900
  // Mais Excel compte incorrectement 1900 comme année bissextile
  const date = new Date((excelDate - 25569) * 86400 * 1000);
  return date;
}

// Fonction pour parser la date du format "12/07/2025" vers "2025-07-12"
// FORMAT FRANÇAIS : jour/mois/année
function parseDate(dateStr) {
  if (!dateStr && dateStr !== 0) {
    return null;
  }
  
  try {
    // Si c'est un nombre (format Excel)
    if (typeof dateStr === 'number') {
      const jsDate = excelDateToJSDate(dateStr);
      const year = jsDate.getFullYear();
      const month = (jsDate.getMonth() + 1).toString().padStart(2, '0');
      const day = jsDate.getDate().toString().padStart(2, '0');
      const result = `${year}-${month}-${day}`;
      console.log(`Date Excel ${dateStr} convertie en ${result}`);
      return result;
    }
    
    // Gérer différents formats possibles
    const dateString = String(dateStr).trim();
    
    // Si c'est déjà au format ISO
    if (dateString.match(/^\d{4}-\d{2}-\d{2}/)) {
      return dateString.substring(0, 10);
    }
    
    // Format DD/MM/YYYY ou D/M/YYYY (FORMAT FRANÇAIS)
    const parts = dateString.split('/');
    if (parts.length !== 3) {
      console.error('Format de date invalide:', dateStr);
      return null;
    }
    
    // En format français : jour/mois/année
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    let year = parts[2];
    
    // Gérer les années sur 2 chiffres
    if (year.length === 2) {
      // Pour 2025, on assume que les années 00-50 sont 2000-2050
      const yearNum = parseInt(year);
      if (yearNum <= 50) {
        year = '20' + year;
      } else {
        year = '19' + year;
      }
    }
    
    const dateResult = `${year}-${month}-${day}`;
    console.log(`Date convertie (format FR): ${dateStr} => ${dateResult}`);
    return dateResult;
  } catch (error) {
    console.error('Erreur parsing date:', dateStr, error);
    return null;
  }
}

// Fonction pour parser l'heure - AMÉLIORÉE
function parseTime(timeValue) {
  if (!timeValue && timeValue !== 0) return null;
  
  try {
    // Si c'est déjà au bon format HH:MM:SS ou HH:MM
    const timeStr = String(timeValue).trim();
    if (timeStr.match(/^\d{1,2}:\d{2}(:\d{2})?$/)) {
      return timeStr;
    }
    
    // Si c'est un nombre (Excel stocke les heures comme fraction de jour)
    if (typeof timeValue === 'number' || !isNaN(timeValue)) {
      const numValue = Number(timeValue);
      
      // Excel stocke l'heure comme fraction de jour (0.5 = midi, 0.75 = 18h00, etc.)
      if (numValue >= 0 && numValue <= 1) {
        const totalMinutes = Math.round(numValue * 24 * 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const result = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
        return result;
      }
    }
    
    // Format bizarre "1/0/00" => on le convertit
    if (timeStr.includes('/')) {
      const parts = timeStr.split('/');
      if (parts.length === 3) {
        const hours = parts[0].padStart(2, '0');
        const minutes = parts[1].padStart(2, '0');
        const seconds = parts[2].padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
      }
    }
    
    // Si c'est une chaîne avec "h" (comme "14h30")
    if (timeStr.includes('h')) {
      const match = timeStr.match(/(\d{1,2})h(\d{0,2})/i);
      if (match) {
        const hours = match[1].padStart(2, '0');
        const minutes = (match[2] || '00').padStart(2, '0');
        return `${hours}:${minutes}:00`;
      }
    }
    
    return '00:00:00'; // Valeur par défaut au lieu de null
  } catch (error) {
    console.error('Erreur parsing heure:', timeValue, error);
    return '00:00:00';
  }
}

// Fonction pour parser un nombre décimal
function parseDecimal(value) {
  if (!value || value === '') return null;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

// Fonction pour parser un entier
function parseInteger(value) {
  if (!value || value === '') return null;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? null : parsed;
}

// Fonction pour extraire le numéro de course depuis "C1", "C2", etc.
function parseCourseNumber(value) {
  if (!value) return null;
  
  const strValue = String(value).trim();
  
  // Si c'est déjà un nombre
  if (!isNaN(strValue)) {
    return parseInt(strValue, 10);
  }
  
  // Si c'est au format "C1", "C2", etc.
  if (strValue.match(/^C(\d+)$/i)) {
    return parseInt(strValue.substring(1), 10);
  }
  
  console.log('Format de numéro de course non reconnu:', value);
  return null;
}

// Fonction principale pour parser le fichier Excel
export async function parseExcelFile(file, selectedCriteriaId) {
  try {
    console.log('📄 Début du parsing Excel');
    
    // Lire le fichier avec options spéciales pour les dates et heures
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, {
      type: 'array',
      cellDates: false,  // Ne pas convertir automatiquement les dates
      cellNF: true,      // Garder les formats de nombres
      cellText: false,
      raw: true         // Garder les valeurs brutes
    });
    
    // Prendre la première feuille
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convertir en tableau
    const data = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: null,
      raw: true,  // Garder les valeurs brutes pour l'heure
      dateNF: 'HH:mm:ss'
    });
    
    // Trouver où commencent les données (après les headers)
    const dataStartRow = 7; // Les données commencent à la ligne 8 (index 7)
    
    // Vérifier qu'on a des données
    if (data.length <= dataStartRow) {
      throw new Error('Aucune donnée trouvée dans le fichier');
    }
    
    // Extraire et filtrer les chevaux
    const chevaux = [];
    let totalRows = 0;
    
    for (let i = dataStartRow; i < data.length; i++) {
      const row = data[i];
      
      // Ignorer les lignes vides
      if (!row || !row[0]) continue;
      
      totalRows++;
      
      // Debug: afficher l'heure pour la première ligne
      if (i === dataStartRow) {
        console.log('Première ligne - Colonne E (heure):', row[COLONNES.HEURE]);
      }
      
      // Appliquer le critère sélectionné
      if (!applyCriteria(row, selectedCriteriaId)) {
        continue;
      }
      
      console.log(`Cheval sélectionné ligne ${i+1}:`, {
        nom: row[COLONNES.NOM_CHEVAL],
        age: row[COLONNES.AGE],
        def: row[COLONNES.DEF],
        def_1: row[COLONNES.DEF_1],
        def_2: row[COLONNES.DEF_2],
        colonneB: row[COLONNES.NUMERO_REUNION],
        colonneD_brut: row[COLONNES.NUMERO_COURSE],
        colonneD_parsed: parseCourseNumber(row[COLONNES.NUMERO_COURSE])
      });
      
      // Extraire les données du cheval
      const cheval = {
        // Info course
        date_course: parseDate(row[COLONNES.DATE]),
        numero_reunion: row[COLONNES.NUMERO_REUNION],
        hippodrome: row[COLONNES.HIPPODROME],
        numero_course: parseCourseNumber(row[COLONNES.NUMERO_COURSE]),
        heure_course: parseTime(row[COLONNES.HEURE]),
        discipline: row[COLONNES.DISCIPLINE],
        nb_partants: parseInteger(row[COLONNES.PARTANTS]),
        distance: row[COLONNES.DISTANCE],
        type_depart: row[COLONNES.DEPART],
        
        // Info cheval
        numero_cheval: parseInteger(row[COLONNES.NUMERO_CHEVAL]),
        nom_cheval: row[COLONNES.NOM_CHEVAL],
        age: parseInteger(row[COLONNES.AGE]),
        sexe: row[COLONNES.SEXE],
        
        // Performances
        pourcent_g_hippo: parseDecimal(row[COLONNES.POURCENT_G_HIPPO]),
        pourcent_p_hippo: parseDecimal(row[COLONNES.POURCENT_P_HIPPO]),
        clt_ca: row[COLONNES.CLT_CA],
        first_def: row[COLONNES.FIRST_DEF],
        def: row[COLONNES.DEF],
        def_1: row[COLONNES.DEF_1],
        def_2: row[COLONNES.DEF_2],
        def_3: row[COLONNES.DEF_3],
        def_4: row[COLONNES.DEF_4],
        def_5: row[COLONNES.DEF_5],
        def_6: row[COLONNES.DEF_6],
        def_7: row[COLONNES.DEF_7],
        def_8: row[COLONNES.DEF_8],
        
        // Stats cheval
        pourcent_g_ch_histo: parseDecimal(row[COLONNES.POURCENT_G_CH_HISTO]),
        pourcent_g_ch: parseDecimal(row[COLONNES.POURCENT_G_CH]),
        pourcent_p_ch: parseDecimal(row[COLONNES.POURCENT_P_CH]),
        pourcent_total_ch: parseDecimal(row[COLONNES.POURCENT_TOTAL_CH]),
        clt_ch: row[COLONNES.CLT_CH],
        
        // Les hommes
        entraineur: row[COLONNES.ENTRAINEUR],
        pourcent_g_ent: parseDecimal(row[COLONNES.POURCENT_G_ENT]),
        pourcent_p_ent: parseDecimal(row[COLONNES.POURCENT_P_ENT]),
        pourcent_total_ent: parseDecimal(row[COLONNES.POURCENT_TOTAL_ENT]),
        clt_ent: row[COLONNES.CLT_ENT],
        pilote: row[COLONNES.PILOTE],
        poids_fav: row[COLONNES.POIDS_FAV],
        pourcent_g_pi: parseDecimal(row[COLONNES.POURCENT_G_PI]),
        pourcent_p_pi: parseDecimal(row[COLONNES.POURCENT_P_PI]),
        pourcent_total_pi: parseDecimal(row[COLONNES.POURCENT_TOTAL_PI]),
        clt_pi: row[COLONNES.CLT_PI],
        
        // Musique
        musique: row[COLONNES.MUSIQUE],
        mus1: row[COLONNES.MUS1],
        mus2: row[COLONNES.MUS2],
        mus3: row[COLONNES.MUS3],
        mus4: row[COLONNES.MUS4],
        mus5: row[COLONNES.MUS5],
        mus6: row[COLONNES.MUS6],
        
        // Engagement
        tempo: row[COLONNES.TEMPO],
        gains_carriere: parseDecimal(row[COLONNES.GAINS_CARRIERE]),
        statut: row[COLONNES.STATUT],
        
        // Données complètes pour référence
        data_complete: row
      };
      
      chevaux.push(cheval);
    }
    
    return {
      success: true,
      chevaux: chevaux,
      totalRows: totalRows,
      selectedCount: chevaux.length,
      fileName: file.name
    };
    
  } catch (error) {
    console.error('Erreur lors du parsing du fichier Excel:', error);
    return {
      success: false,
      error: error.message,
      chevaux: [],
      totalRows: 0,
      selectedCount: 0
    };
  }
}

// Fonction pour valider le format du fichier
export function validateExcelFile(file) {
  // Vérifier l'extension
  const validExtensions = ['.xlsx', '.xls'];
  const fileName = file.name.toLowerCase();
  const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
  
  if (!hasValidExtension) {
    return {
      valid: false,
      error: 'Le fichier doit être au format Excel (.xlsx ou .xls)'
    };
  }
  
  // Vérifier la taille (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Le fichier est trop volumineux (max 10MB)'
    };
  }
  
  return { valid: true };
}

// Fonction pour extraire un résumé des données
export function getDataSummary(chevaux) {
  if (!chevaux || chevaux.length === 0) {
    return null;
  }
  
  // Grouper par hippodrome et course
  const courses = {};
  
  chevaux.forEach(cheval => {
    const key = `${cheval.hippodrome}_R${cheval.numero_reunion}_C${cheval.numero_course}`;
    if (!courses[key]) {
      courses[key] = {
        hippodrome: cheval.hippodrome,
        date: cheval.date_course,
        reunion: cheval.numero_reunion,
        course: cheval.numero_course,
        heure: cheval.heure_course,
        discipline: cheval.discipline,
        distance: cheval.distance,
        chevaux: []
      };
    }
    courses[key].chevaux.push(cheval);
  });
  
  return {
    totalChevaux: chevaux.length,
    courses: Object.values(courses),
    hippodromes: [...new Set(chevaux.map(c => c.hippodrome))]
  };
}