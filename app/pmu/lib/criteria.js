// Configuration des critères de sélection des chevaux
// Chaque critère peut être activé/désactivé indépendamment

export const CRITERES = {
  "chevaux_4ans_DD_FF": {
    id: "chevaux_4ans_DD_FF",
    nom: "Critère 1",
    description: "Sélectionne les chevaux de 4 ans avec Déf=DD, Déf-1=DD, Déf-2=FF et Musique 1 différent de 1,2,3,4, BV différent de A,B,C",
    actif: true,
    couleur: "#3B82F6", // Bleu
    filtres: [
      {
        colonne: 11,  // Colonne L : Age
        nom: "Age",
        valeur: "4",
        type: "exact",
        operateur: "="
      },
      {
        colonne: 17,  // Colonne R : Déf
        nom: "Défaillance actuelle",
        valeur: "DD",
        type: "exact",
        operateur: "="
      },
      {
        colonne: 18,  // Colonne S : Déf-1
        nom: "Défaillance précédente",
        valeur: "DD",
        type: "exact",
        operateur: "="
      },
      {
        colonne: 19,  // Colonne T : Déf-2
        nom: "Défaillance -2",
        valeur: "FF",
        type: "exact",
        operateur: "="
      },
      {
        colonne: 45,  // Colonne AT : Mus1
        nom: "Musique 1",
        valeur: [1, 2, 3, 4],
        type: "not_in",
        operateur: "≠"
      },
      {
        colonne: 74,  // Colonne BV
        nom: "BV",
        valeur: ["A", "B", "C"],
        type: "not_in",
        operateur: "≠"
      }
    ]
  },
  
  "chevaux_4ans_DD_FF_FF": {
    id: "chevaux_4ans_DD_FF_FF",
    nom: "Critère 2",
    description: "Sélectionne les chevaux de 4 ans avec Déf=DD, Déf-1=FF, Déf-2=FF et Musique 1 différent de 1,2,3,4, BV différent de A,B,C",
    actif: true,
    couleur: "#10B981", // Vert
    filtres: [
      {
        colonne: 11,  // Colonne L : Age
        nom: "Age",
        valeur: "4",
        type: "exact",
        operateur: "="
      },
      {
        colonne: 17,  // Colonne R : Déf
        nom: "Défaillance actuelle",
        valeur: "DD",
        type: "exact",
        operateur: "="
      },
      {
        colonne: 18,  // Colonne S : Déf-1
        nom: "Défaillance précédente",
        valeur: "FF",
        type: "exact",
        operateur: "="
      },
      {
        colonne: 19,  // Colonne T : Déf-2
        nom: "Défaillance -2",
        valeur: "FF",
        type: "exact",
        operateur: "="
      },
      {
        colonne: 45,  // Colonne AT : Mus1
        nom: "Musique 1",
        valeur: [1, 2, 3, 4],
        type: "not_in",
        operateur: "≠"
      },
      {
        colonne: 74,  // Colonne BV
        nom: "BV",
        valeur: ["A", "B", "C"],
        type: "not_in",
        operateur: "≠"
      }
    ]
  },
  
  "juments_5ans_DD_FF_FF": {
    id: "juments_5ans_DD_FF_FF",
    nom: "Critère 3",
    description: "Sélectionne les juments de 5 ans avec Déf=DD, Déf-1=FF, Déf-2=FF et Musique 1 différent de 1,2,3,4, BV différent de A,B,C",
    actif: true,
    couleur: "#8B5CF6", // Violet
    filtres: [
      {
        colonne: 11,  // Colonne L : Age
        nom: "Age",
        valeur: "5",
        type: "exact",
        operateur: "="
      },
      {
        colonne: 12,  // Colonne M : Sexe
        nom: "Sexe",
        valeur: "F",
        type: "exact",
        operateur: "="
      },
      {
        colonne: 17,  // Colonne R : Déf
        nom: "Défaillance actuelle",
        valeur: "DD",
        type: "exact",
        operateur: "="
      },
      {
        colonne: 18,  // Colonne S : Déf-1
        nom: "Défaillance précédente",
        valeur: "FF",
        type: "exact",
        operateur: "="
      },
      {
        colonne: 19,  // Colonne T : Déf-2
        nom: "Défaillance -2",
        valeur: "FF",
        type: "exact",
        operateur: "="
      },
      {
        colonne: 45,  // Colonne AT : Mus1
        nom: "Musique 1",
        valeur: [1, 2, 3, 4],
        type: "not_in",
        operateur: "≠"
      },
      {
        colonne: 74,  // Colonne BV
        nom: "BV",
        valeur: ["A", "B", "C"],
        type: "not_in",
        operateur: "≠"
      }
    ]
  },
  
  "juments_5ans_DD_DD_FF": {
    id: "juments_5ans_DD_DD_FF",
    nom: "Critère 4",
    description: "Sélectionne les juments de 5 ans avec Déf=DD, Déf-1=DD, Déf-2=FF et Musique 1 différent de 1,2,3,4, BV différent de A,B,C",
    actif: true,
    couleur: "#F59E0B", // Orange
    filtres: [
      {
        colonne: 11,  // Colonne L : Age
        nom: "Age",
        valeur: "5",
        type: "exact",
        operateur: "="
      },
      {
        colonne: 12,  // Colonne M : Sexe
        nom: "Sexe",
        valeur: "F",
        type: "exact",
        operateur: "="
      },
      {
        colonne: 17,  // Colonne R : Déf
        nom: "Défaillance actuelle",
        valeur: "DD",
        type: "exact",
        operateur: "="
      },
      {
        colonne: 18,  // Colonne S : Déf-1
        nom: "Défaillance précédente",
        valeur: "DD",
        type: "exact",
        operateur: "="
      },
      {
        colonne: 19,  // Colonne T : Déf-2
        nom: "Défaillance -2",
        valeur: "FF",
        type: "exact",
        operateur: "="
      },
      {
        colonne: 45,  // Colonne AT : Mus1
        nom: "Musique 1",
        valeur: [1, 2, 3, 4],
        type: "not_in",
        operateur: "≠"
      },
      {
        colonne: 74,  // Colonne BV
        nom: "BV",
        valeur: ["A", "B", "C"],
        type: "not_in",
        operateur: "≠"
      }
    ]
  },
  
  "critere_5": {
    id: "critere_5",
    nom: "Critère 5",
    description: "Sélectionne les chevaux avec AG≥10, AM≥10 et AT=1",
    actif: true,
    couleur: "#EC4899", // Rose
    filtres: [
      {
        colonne: 32,  // Colonne AG (33 en Excel = index 32)
        nom: "AG",
        valeur: 10,
        type: "greater_or_equal",
        operateur: "≥"
      },
      {
        colonne: 38,  // Colonne AM (39 en Excel = index 38)
        nom: "AM",
        valeur: 10,
        type: "greater_or_equal",
        operateur: "≥"
      },
      {
        colonne: 45,  // Colonne AT (46 en Excel = index 45) - Mus1
        nom: "AT",
        valeur: "1",
        type: "exact_mus1",  // Type spécial pour Mus1
        operateur: "="
      }
    ]
  },
  
  // Emplacement pour ajouter d'autres critères facilement
  // Exemple de structure pour un futur critère :
  /*
  "critere_exemple": {
    id: "critere_exemple",
    nom: "Nom du critère",
    description: "Description détaillée",
    actif: false,
    couleur: "#10B981", // Vert
    filtres: [
      {
        colonne: X,
        nom: "Nom du filtre",
        valeur: "valeur recherchée",
        type: "exact" | "contains" | "greater" | "lesser",
        operateur: "=" | "LIKE" | ">" | "<"
      }
    ]
  }
  */
};

// Fonction pour appliquer un critère sur une ligne de données
export function applyCriteria(row, criteriaId) {
  const criteria = CRITERES[criteriaId];
  
  if (!criteria || !criteria.actif) {
    return false;
  }
  
  // Vérifier que tous les filtres du critère sont satisfaits
  return criteria.filtres.every(filtre => {
    const cellValue = row[filtre.colonne];
    
    // Gérer les valeurs nulles ou undefined
    if (cellValue === null || cellValue === undefined || cellValue === '') {
      // Pour not_in, une valeur vide est acceptée
      if (filtre.type === 'not_in') {
        return true;
      }
      return false;
    }
    
    // Convertir en string pour la comparaison
    const value = String(cellValue).trim();
    const targetValue = filtre.type === 'not_in' ? filtre.valeur : String(filtre.valeur).trim();
    
    switch (filtre.type) {
      case 'exact':
        return value === targetValue;
      
      case 'exact_mus1':
        // Spécial pour le critère 5 - Mus1 doit être exactement "1"
        // Log pour déboguer
        console.log(`Critère 5 - Vérification Mus1: valeur='${value}', match=${value === '1'}`);
        
        // Accepter seulement "1" (pas "1a", "1.0", etc.)
        return value === '1';
      
      case 'contains':
        return value.toLowerCase().includes(targetValue.toLowerCase());
      
      case 'greater':
        return parseFloat(value) > parseFloat(targetValue);
      
      case 'greater_or_equal':
        return parseFloat(value) >= parseFloat(targetValue);
      
      case 'lesser':
        return parseFloat(value) < parseFloat(targetValue);
      
      case 'not_in':
        // Pour un tableau de valeurs interdites
        const forbidden = Array.isArray(filtre.valeur) ? filtre.valeur : [filtre.valeur];
        
        // Pour BV, on compare les lettres en majuscules
        if (filtre.nom === 'BV') {
          const upperValue = value.toUpperCase();
          return !forbidden.includes(upperValue);
        }
        
        // Pour Musique 1
        const numValue = parseFloat(value);
        
        // Si c'est un nombre, vérifier numériquement
        if (!isNaN(numValue)) {
          return !forbidden.includes(numValue);
        }
        
        // Sinon, c'est accepté (0a, Da, etc. sont OK)
        return true;
      
      default:
        return false;
    }
  });
}

// Fonction pour obtenir tous les critères actifs
export function getActiveCriteria() {
  return Object.values(CRITERES).filter(c => c.actif);
}

// Fonction pour obtenir un critère par son ID
export function getCriteriaById(id) {
  return CRITERES[id] || null;
}

// Fonction pour valider qu'au moins un critère est sélectionné
export function hasSelectedCriteria(selectedCriteriaIds) {
  return selectedCriteriaIds && selectedCriteriaIds.length > 0;
}

// Fonction pour obtenir la description complète d'un critère
export function getCriteriaDescription(criteriaId) {
  const criteria = CRITERES[criteriaId];
  if (!criteria) return '';
  
  const filters = criteria.filtres.map(f => {
    if (f.type === 'not_in' && Array.isArray(f.valeur)) {
      return `${f.nom} ${f.operateur} ${f.valeur.join(',')}`;
    }
    return `${f.nom} ${f.operateur} ${f.valeur}`;
  }).join(' ET ');
  
  return `${criteria.nom}: ${filters}`;
}

// Export des colonnes pour référence
export const COLONNES = {
  // La Réunion et la Course
  DATE: 0,                // Colonne A - DATE
  NUMERO_REUNION: 1,      // Colonne B
  HIPPODROME: 2,
  NUMERO_COURSE: 3,
  HEURE: 4,
  DISCIPLINE: 5,
  PARTANTS: 6,
  DISTANCE: 7,
  DEPART: 8,
  
  // Le Cheval
  NUMERO_CHEVAL: 9,
  NOM_CHEVAL: 10,
  AGE: 11,
  SEXE: 12,
  POURCENT_G_HIPPO: 13,
  POURCENT_P_HIPPO: 14,
  CLT_CA: 15,
  FIRST_DEF: 16,
  DEF: 17,
  DEF_1: 18,
  DEF_2: 19,
  DEF_3: 20,
  DEF_4: 21,
  DEF_5: 22,
  DEF_6: 23,
  DEF_7: 24,
  DEF_8: 25,
  
  // Stats cheval
  POURCENT_G_CH_HISTO: 26,
  POURCENT_G_CH: 27,
  POURCENT_P_CH: 28,
  POURCENT_TOTAL_CH: 29,
  CLT_CH: 30,
  
  // Les Hommes
  ENTRAINEUR: 31,
  POURCENT_G_ENT: 32,  // Colonne AG
  POURCENT_P_ENT: 33,
  POURCENT_TOTAL_ENT: 34,
  CLT_ENT: 35,
  PILOTE: 36,
  POIDS_FAV: 37,
  POURCENT_G_PI: 38,   // Colonne AM
  POURCENT_P_PI: 39,
  POURCENT_TOTAL_PI: 40,
  CLT_PI: 41,
  
  // La Musique
  MUSIQUE: 44,
  MUS1: 45,  // Colonne AT
  MUS2: 46,
  MUS3: 47,
  MUS4: 48,
  MUS5: 49,
  MUS6: 50,
  
  // L'Engagement
  TEMPO: 58,
  GAINS_CARRIERE: 81,
  STATUT: 82,
  
  // Les Résultats
  PLACE: 83,
  RED_KM: 84,
  
  // Nouvelle colonne BV
  BV: 74
};