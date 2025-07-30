import { NextResponse } from 'next/server';
import { parseExcelFile, validateExcelFile } from '../../lib/excelParser';
import { createImport, insertCheval } from '../../lib/db';
import { getCriteriaById, getActiveCriteria } from '../../lib/criteria';

export async function POST(request) {
  console.log('📤 Début du traitement de l\'upload');
  
  // Vérifier la connexion à la base de données
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL non définie');
    return NextResponse.json(
      { error: 'Configuration de base de données manquante' },
      { status: 500 }
    );
  }
  
  try {
    // Récupérer les données du formulaire
    const formData = await request.formData();
    const file = formData.get('file');
    const criteriaId = formData.get('criteriaId');
    const applyAllCriteria = formData.get('applyAllCriteria') === 'true';
    const analyzeOnly = formData.get('analyzeOnly') === 'true';
    const importOnly = formData.get('importOnly') === 'true';
    const selectedChevauxJson = formData.get('selectedChevaux');
    
    // Validation des données
    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }
    
    if (!applyAllCriteria && !criteriaId) {
      return NextResponse.json(
        { error: 'Aucun critère sélectionné' },
        { status: 400 }
      );
    }
    
    // Valider le fichier
    const validation = validateExcelFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }
    
    // MODE ANALYSE SEULEMENT
    if (analyzeOnly) {
      console.log(`📊 Analyse du fichier: ${file.name}`);
      
      if (applyAllCriteria) {
        // Analyser avec tous les critères
        const allCriteria = getActiveCriteria();
        const allResults = {};
        let totalRows = 0;
        
        for (const criteria of allCriteria) {
          console.log(`🔍 Analyse avec le critère: ${criteria.nom}`);
          
          const parseResult = await parseExcelFile(file, criteria.id);
          
          if (!parseResult.success) {
            allResults[criteria.nom] = {
              selectedCount: 0,
              error: parseResult.error,
              couleur: criteria.couleur
            };
            continue;
          }
          
          if (totalRows === 0) {
            totalRows = parseResult.totalRows;
          }
          
          // Grouper par course et ajouter un ID unique à chaque cheval
          const coursesMap = {};
          parseResult.chevaux.forEach((cheval, index) => {
            // Ajouter un ID unique basé sur le critère et l'index
            cheval.id = `${criteria.id}_${index}`;
            
            const key = `${cheval.hippodrome}_${cheval.date_course}_R${cheval.numero_reunion}_C${cheval.numero_course}`;
            if (!coursesMap[key]) {
              coursesMap[key] = {
                hippodrome: cheval.hippodrome,
                date: cheval.date_course,
                reunion: cheval.numero_reunion,
                course: cheval.numero_course,
                chevaux: []
              };
            }
            coursesMap[key].chevaux.push({
              id: cheval.id,
              numero: cheval.numero_cheval,
              nom: cheval.nom_cheval,
              age: cheval.age,
              def: cheval.def,
              def_1: cheval.def_1,
              def_2: cheval.def_2,
              // Garder toutes les données pour l'import
              _fullData: cheval
            });
          });
          
          allResults[criteria.nom] = {
            selectedCount: parseResult.selectedCount,
            chevaux: parseResult.chevaux,
            courses: Object.values(coursesMap),
            couleur: criteria.couleur
          };
        }
        
        return NextResponse.json({
          success: true,
          analyzeOnly: true,
          allCriteriaResults: allResults,
          totalRows: totalRows
        });
      } else {
        // Analyser avec un seul critère
        const criteria = getCriteriaById(criteriaId);
        if (!criteria) {
          return NextResponse.json(
            { error: 'Critère invalide' },
            { status: 400 }
          );
        }
        
        const parseResult = await parseExcelFile(file, criteriaId);
        
        if (!parseResult.success) {
          return NextResponse.json(
            { error: `Erreur lors de l'analyse: ${parseResult.error}` },
            { status: 400 }
          );
        }
        
        // Ajouter un ID unique à chaque cheval
        parseResult.chevaux.forEach((cheval, index) => {
          cheval.id = `${criteriaId}_${index}`;
        });
        
        // Grouper par course
        const coursesMap = {};
        parseResult.chevaux.forEach(cheval => {
          const key = `${cheval.hippodrome}_${cheval.date_course}_R${cheval.numero_reunion}_C${cheval.numero_course}`;
          if (!coursesMap[key]) {
            coursesMap[key] = {
              hippodrome: cheval.hippodrome,
              date: cheval.date_course,
              reunion: cheval.numero_reunion,
              course: cheval.numero_course,
              chevaux: []
            };
          }
          coursesMap[key].chevaux.push({
            id: cheval.id,
            numero: cheval.numero_cheval,
            nom: cheval.nom_cheval,
            age: cheval.age,
            def: cheval.def,
            def_1: cheval.def_1,
            def_2: cheval.def_2,
            _fullData: cheval
          });
        });
        
        return NextResponse.json({
          success: true,
          analyzeOnly: true,
          totalRows: parseResult.totalRows,
          selectedCount: parseResult.selectedCount,
          chevaux: parseResult.chevaux,
          courses: Object.values(coursesMap),
          criteriaUsed: criteria.nom
        });
      }
    }
    
    // MODE IMPORT SEULEMENT
    if (importOnly) {
      console.log(`💾 Import des chevaux sélectionnés`);
      
      if (!selectedChevauxJson) {
        return NextResponse.json(
          { error: 'Aucun cheval sélectionné' },
          { status: 400 }
        );
      }
      
      const selectedChevauxIds = JSON.parse(selectedChevauxJson);
      
      if (selectedChevauxIds.length === 0) {
        return NextResponse.json(
          { error: 'Aucun cheval sélectionné' },
          { status: 400 }
        );
      }
      
      const insertedIds = [];
      const errors = [];
      const importsCreated = {};
      
      if (applyAllCriteria) {
        // Ré-analyser pour récupérer les chevaux sélectionnés
        const allCriteria = getActiveCriteria();
        
        for (const criteria of allCriteria) {
          const parseResult = await parseExcelFile(file, criteria.id);
          
          if (!parseResult.success) continue;
          
          // Ajouter les mêmes IDs qu'à l'analyse
          parseResult.chevaux.forEach((cheval, index) => {
            cheval.id = `${criteria.id}_${index}`;
          });
          
          // Filtrer les chevaux sélectionnés pour ce critère
          const selectedForCriteria = parseResult.chevaux.filter(cheval => 
            selectedChevauxIds.includes(`${criteria.nom}_${cheval.id}`)
          );
          
          if (selectedForCriteria.length > 0) {
            // Créer l'import pour ce critère
            const importId = await createImport(
              file.name,
              criteria.nom,
              selectedForCriteria.length
            );
            
            importsCreated[criteria.nom] = importId;
            
            // Insérer les chevaux
            for (const cheval of selectedForCriteria) {
              try {
                await insertCheval(importId, cheval);
                insertedIds.push({ critereName: criteria.nom, chevalId: cheval.id });
              } catch (error) {
                console.error(`Erreur insertion cheval ${cheval.nom_cheval}:`, error);
                errors.push({
                  cheval: cheval.nom_cheval,
                  critere: criteria.nom,
                  error: error.message
                });
              }
            }
          }
        }
        
        return NextResponse.json({
          success: true,
          message: `${insertedIds.length} chevaux importés avec succès`,
          stats: {
            selectedCount: selectedChevauxIds.length,
            insertedCount: insertedIds.length,
            errorCount: errors.length,
            imports: importsCreated
          },
          errors: errors.length > 0 ? errors : undefined
        });
      } else {
        // Import avec un seul critère
        const criteria = getCriteriaById(criteriaId);
        if (!criteria) {
          return NextResponse.json(
            { error: 'Critère invalide' },
            { status: 400 }
          );
        }
        
        const parseResult = await parseExcelFile(file, criteriaId);
        
        if (!parseResult.success) {
          return NextResponse.json(
            { error: `Erreur lors du parsing: ${parseResult.error}` },
            { status: 400 }
          );
        }
        
        // Ajouter les mêmes IDs qu'à l'analyse
        parseResult.chevaux.forEach((cheval, index) => {
          cheval.id = `${criteriaId}_${index}`;
        });
        
        // Filtrer les chevaux sélectionnés
        const selectedChevaux = parseResult.chevaux.filter(cheval => 
          selectedChevauxIds.includes(cheval.id)
        );
        
        if (selectedChevaux.length === 0) {
          return NextResponse.json({
            success: true,
            message: 'Aucun cheval sélectionné à importer',
            stats: {
              selectedCount: 0,
              insertedCount: 0
            }
          });
        }
        
        // Créer l'import
        const importId = await createImport(
          file.name,
          criteria.nom,
          selectedChevaux.length
        );
        
        // Insérer les chevaux sélectionnés
        for (const cheval of selectedChevaux) {
          try {
            await insertCheval(importId, cheval);
            insertedIds.push(cheval.id);
          } catch (error) {
            console.error(`Erreur insertion cheval ${cheval.nom_cheval}:`, error);
            errors.push({
              cheval: cheval.nom_cheval,
              error: error.message
            });
          }
        }
        
        return NextResponse.json({
          success: true,
          message: `${insertedIds.length} chevaux importés avec succès`,
          stats: {
            selectedCount: selectedChevaux.length,
            insertedCount: insertedIds.length,
            errorCount: errors.length,
            criteriaUsed: criteria.nom,
            fileName: file.name,
            importId: importId
          },
          errors: errors.length > 0 ? errors : undefined
        });
      }
    }
    
    // MODE NORMAL (ancien comportement - tout en une fois)
    // Ce code reste pour la compatibilité mais ne devrait plus être utilisé
    
    if (applyAllCriteria) {
      console.log(`📊 Application de tous les critères sur le fichier: ${file.name}`);
      
      const allCriteria = getActiveCriteria();
      const allResults = {};
      const allChevaux = [];
      const allErrors = [];
      let totalSelected = 0;
      let totalInserted = 0;
      let totalRows = 0;
      
      for (const criteria of allCriteria) {
        console.log(`🔍 Application du critère: ${criteria.nom}`);
        
        const parseResult = await parseExcelFile(file, criteria.id);
        
        if (!parseResult.success) {
          allErrors.push({
            critere: criteria.nom,
            error: parseResult.error
          });
          continue;
        }
        
        if (totalRows === 0) {
          totalRows = parseResult.totalRows;
        }
        
        let insertedCount = 0;
        const criteriaErrors = [];
        
        if (parseResult.selectedCount > 0) {
          const importId = await createImport(
            file.name,
            criteria.nom,
            parseResult.selectedCount
          );
          
          for (const cheval of parseResult.chevaux) {
            try {
              await insertCheval(importId, cheval);
              insertedCount++;
              
              allChevaux.push({
                ...cheval,
                critere: criteria.nom,
                couleur: criteria.couleur
              });
            } catch (error) {
              criteriaErrors.push({
                cheval: cheval.nom_cheval,
                error: error.message
              });
            }
          }
        }
        
        allResults[criteria.nom] = {
          selectedCount: parseResult.selectedCount,
          insertedCount: insertedCount,
          errors: criteriaErrors
        };
        
        totalSelected += parseResult.selectedCount;
        totalInserted += insertedCount;
        
        if (criteriaErrors.length > 0) {
          allErrors.push(...criteriaErrors.map(e => ({
            ...e,
            critere: criteria.nom
          })));
        }
      }
      
      const coursesMap = {};
      allChevaux.forEach(cheval => {
        const key = `${cheval.hippodrome}_${cheval.date_course}_R${cheval.numero_reunion}_C${cheval.numero_course}`;
        if (!coursesMap[key]) {
          coursesMap[key] = {
            hippodrome: cheval.hippodrome,
            date: cheval.date_course,
            reunion: cheval.numero_reunion,
            course: cheval.numero_course,
            chevaux: []
          };
        }
        coursesMap[key].chevaux.push({
          numero: cheval.numero_cheval,
          nom: cheval.nom_cheval,
          age: cheval.age,
          def: cheval.def,
          def_1: cheval.def_1,
          def_2: cheval.def_2,
          critere: cheval.critere,
          couleur: cheval.couleur
        });
      });
      
      return NextResponse.json({
        success: true,
        message: `${totalInserted} chevaux importés avec tous les critères`,
        allCriteriaResults: allResults,
        stats: {
          totalRows: totalRows,
          selectedCount: totalSelected,
          insertedCount: totalInserted,
          errorCount: allErrors.length,
          fileName: file.name,
          courses: Object.values(coursesMap)
        },
        errors: allErrors.length > 0 ? allErrors : undefined
      });
    }
    
    const criteria = getCriteriaById(criteriaId);
    if (!criteria) {
      return NextResponse.json(
        { error: 'Critère invalide' },
        { status: 400 }
      );
    }
    
    console.log(`📊 Parsing du fichier: ${file.name} avec le critère: ${criteriaId}`);
    
    const parseResult = await parseExcelFile(file, criteriaId);
    
    if (!parseResult.success) {
      return NextResponse.json(
        { error: `Erreur lors du parsing: ${parseResult.error}` },
        { status: 400 }
      );
    }
    
    console.log(`✅ Parsing réussi: ${parseResult.selectedCount} chevaux sélectionnés sur ${parseResult.totalRows}`);
    
    if (parseResult.selectedCount === 0) {
      return NextResponse.json({
        success: true,
        message: 'Aucun cheval ne correspond aux critères sélectionnés',
        stats: {
          totalRows: parseResult.totalRows,
          selectedCount: 0,
          criteriaUsed: criteria.nom
        }
      });
    }
    
    const importId = await createImport(
      file.name,
      criteria.nom,
      parseResult.selectedCount
    );
    
    console.log(`💾 Import créé avec l'ID: ${importId}`);
    
    const insertedIds = [];
    const errors = [];
    
    for (const cheval of parseResult.chevaux) {
      try {
        const chevalId = await insertCheval(importId, cheval);
        insertedIds.push(chevalId);
      } catch (error) {
        console.error(`Erreur insertion cheval ${cheval.nom_cheval}:`, error);
        errors.push({
          cheval: cheval.nom_cheval,
          error: error.message
        });
      }
    }
    
    console.log(`✅ ${insertedIds.length} chevaux insérés avec succès`);
    
    const summary = {
      totalRows: parseResult.totalRows,
      selectedCount: parseResult.selectedCount,
      insertedCount: insertedIds.length,
      errorCount: errors.length,
      criteriaUsed: criteria.nom,
      fileName: file.name,
      importId: importId
    };
    
    if (parseResult.chevaux.length > 0) {
      const coursesMap = {};
      parseResult.chevaux.forEach(cheval => {
        const key = `${cheval.hippodrome}_${cheval.date_course}_R${cheval.numero_reunion}_C${cheval.numero_course}`;
        if (!coursesMap[key]) {
          coursesMap[key] = {
            hippodrome: cheval.hippodrome,
            date: cheval.date_course,
            reunion: cheval.numero_reunion,
            course: cheval.numero_course,
            chevaux: []
          };
        }
        coursesMap[key].chevaux.push({
          numero: cheval.numero_cheval,
          nom: cheval.nom_cheval,
          age: cheval.age,
          def: cheval.def,
          def_1: cheval.def_1,
          def_2: cheval.def_2
        });
      });
      
      summary.courses = Object.values(coursesMap);
    }
    
    return NextResponse.json({
      success: true,
      message: `${insertedIds.length} chevaux importés avec succès`,
      stats: summary,
      errors: errors.length > 0 ? errors : undefined
    });
    
  } catch (error) {
    console.error('❌ Erreur lors du traitement:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors du traitement du fichier',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Configuration spécifique pour cette route
export const runtime = 'nodejs';
export const maxDuration = 30;