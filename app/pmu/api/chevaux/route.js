import { NextResponse } from 'next/server';
import { getAllChevaux, deleteCheval } from '../../lib/db';

// GET - Récupérer tous les chevaux avec filtres optionnels
export async function GET(request) {
  try {
    // Extraire les paramètres de recherche
    const { searchParams } = new URL(request.url);
    
    const filters = {
      dateDebut: searchParams.get('dateDebut'),
      dateFin: searchParams.get('dateFin'),
      hippodrome: searchParams.get('hippodrome'),
      critere: searchParams.get('critere')
    };
    
    // Récupérer les chevaux depuis la base de données
    const chevaux = await getAllChevaux(filters);
    
    // Grouper les chevaux par date et course pour faciliter l'affichage
    const chevauxGroupes = {};
    
    chevaux.forEach(cheval => {
      // CORRECTION : S'assurer que la date est bien présente
      let dateKey = cheval.date_course || 'date-inconnue';
      
      // Si la date existe et est un objet Date, la convertir
      if (dateKey !== 'date-inconnue' && typeof dateKey === 'object' && dateKey instanceof Date) {
        dateKey = dateKey.toISOString().split('T')[0];
      }
      
      // Si c'est une string avec le temps, garder juste la date
      if (dateKey !== 'date-inconnue' && typeof dateKey === 'string' && dateKey.includes('T')) {
        dateKey = dateKey.split('T')[0];
      }
      
      // Log pour debug
      if (!cheval.date_course) {
        console.log(`⚠️ Cheval sans date: ${cheval.nom_cheval} (ID: ${cheval.id})`);
      }
      
      // Créer une clé unique pour chaque course
      const courseKey = `${cheval.hippodrome}_${cheval.numero_reunion}_C${cheval.numero_course}`;
      
      if (!chevauxGroupes[dateKey]) {
        chevauxGroupes[dateKey] = {};
      }
      
      if (!chevauxGroupes[dateKey][courseKey]) {
        chevauxGroupes[dateKey][courseKey] = {
          date: dateKey,
          hippodrome: cheval.hippodrome,
          reunion: cheval.numero_reunion,
          course: cheval.numero_course,
          heure: cheval.heure_course,
          discipline: cheval.discipline,
          distance: cheval.distance,
          critere_utilise: cheval.critere_utilise,
          fichier_nom: cheval.fichier_nom,
          date_import: cheval.date_import,
          chevaux: []
        };
      }
      
      chevauxGroupes[dateKey][courseKey].chevaux.push({
        id: cheval.id,
        numero: cheval.numero_cheval,
        nom: cheval.nom_cheval,
        age: cheval.age,
        sexe: cheval.sexe,
        def: cheval.def,
        def_1: cheval.def_1,
        def_2: cheval.def_2,
        entraineur: cheval.entraineur,
        pilote: cheval.pilote,
        musique: cheval.musique,
        gains_carriere: cheval.gains_carriere,
        pourcent_g_ch: cheval.pourcent_g_ch,
        pourcent_p_ch: cheval.pourcent_p_ch,
        pourcent_total_ch: cheval.pourcent_total_ch,
        data_complete: cheval.data_complete
      });
    });
    
    // Calculer les statistiques
    const stats = {
      totalChevaux: chevaux.length,
      totalCourses: Object.values(chevauxGroupes).reduce(
        (acc, date) => acc + Object.keys(date).length, 
        0
      ),
      hippodromes: [...new Set(chevaux.map(c => c.hippodrome))].sort(),
      dates: Object.keys(chevauxGroupes).filter(d => d !== 'date-inconnue').sort().reverse()
    };
    
    // Logger les dates trouvées
    console.log('📅 Dates trouvées:', Object.keys(chevauxGroupes));
    
    return NextResponse.json({
      success: true,
      data: chevauxGroupes,
      stats: stats
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des chevaux:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération des données',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un cheval (soft delete)
export async function DELETE(request) {
  try {
    // Récupérer l'ID du cheval à supprimer
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID du cheval manquant' },
        { status: 400 }
      );
    }
    
    // Supprimer le cheval (soft delete)
    const result = await deleteCheval(id);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Cheval supprimé avec succès'
      });
    } else {
      throw new Error('Échec de la suppression');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la suppression',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';