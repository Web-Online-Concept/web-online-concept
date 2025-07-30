'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FileUploader from '../components/FileUploader';
import CriteriaSelector from '../components/CriteriaSelector';

export default function UploadPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCriteria, setSelectedCriteria] = useState('');
  const [applyAllCriteria, setApplyAllCriteria] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  
  // États pour la sélection manuelle
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedChevaux, setSelectedChevaux] = useState({});
  const [isImporting, setIsImporting] = useState(false);

  // Réinitialiser le formulaire
  const resetForm = () => {
    setSelectedFile(null);
    setSelectedCriteria('');
    setApplyAllCriteria(false);
    setUploadResult(null);
    setAnalysisResult(null);
    setSelectedChevaux({});
    setError(null);
  };

  // Gérer le changement de la checkbox tous critères
  const handleAllCriteriaChange = (checked) => {
    setApplyAllCriteria(checked);
    if (checked) {
      setSelectedCriteria(''); // Reset la sélection individuelle
    }
  };

  // Gérer l'analyse (première étape)
  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    if (!applyAllCriteria && !selectedCriteria) {
      setError('Veuillez choisir un critère ou sélectionner "Appliquer tous les critères"');
      return;
    }

    setIsUploading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('analyzeOnly', 'true'); // Nouvelle option pour analyse seulement
      
      if (applyAllCriteria) {
        formData.append('applyAllCriteria', 'true');
      } else {
        formData.append('criteriaId', selectedCriteria);
      }

      const response = await fetch('/pmu/api/upload-excel', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        setAnalysisResult(result);
        
        // Initialiser tous les chevaux comme sélectionnés
        const initialSelection = {};
        if (result.allCriteriaResults) {
          // Pour tous les critères
          Object.entries(result.allCriteriaResults).forEach(([critereName, criteriaData]) => {
            if (criteriaData.chevaux) {
              criteriaData.chevaux.forEach(cheval => {
                initialSelection[`${critereName}_${cheval.id}`] = true;
              });
            }
          });
        } else if (result.chevaux) {
          // Pour un seul critère
          result.chevaux.forEach(cheval => {
            initialSelection[cheval.id] = true;
          });
        }
        setSelectedChevaux(initialSelection);
      } else {
        setError(result.error || 'Erreur lors de l\'analyse');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error('Erreur analyse:', err);
    } finally {
      setIsUploading(false);
    }
  };

  // Gérer l'import des chevaux sélectionnés
  const handleImport = async () => {
    const chevauxToImport = Object.entries(selectedChevaux)
      .filter(([_, isSelected]) => isSelected)
      .map(([key, _]) => key);

    if (chevauxToImport.length === 0) {
      setError('Veuillez sélectionner au moins un cheval');
      return;
    }

    setIsImporting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('importOnly', 'true');
      formData.append('selectedChevaux', JSON.stringify(chevauxToImport));
      
      if (applyAllCriteria) {
        formData.append('applyAllCriteria', 'true');
      } else {
        formData.append('criteriaId', selectedCriteria);
      }

      const response = await fetch('/pmu/api/upload-excel', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        setUploadResult(result);
        setAnalysisResult(null);
      } else {
        setError(result.error || 'Erreur lors de l\'import');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error('Erreur import:', err);
    } finally {
      setIsImporting(false);
    }
  };

  // Gérer la sélection d'un cheval
  const handleChevalSelection = (chevalKey, isChecked) => {
    setSelectedChevaux(prev => ({
      ...prev,
      [chevalKey]: isChecked
    }));
  };

  // Sélectionner/désélectionner tous les chevaux d'une course
  const handleCourseSelection = (courseChevaux, critereName = null) => {
    const newSelection = { ...selectedChevaux };
    const allSelected = courseChevaux.every(cheval => {
      const key = critereName ? `${critereName}_${cheval.id}` : cheval.id;
      return selectedChevaux[key];
    });

    courseChevaux.forEach(cheval => {
      const key = critereName ? `${critereName}_${cheval.id}` : cheval.id;
      newSelection[key] = !allSelected;
    });

    setSelectedChevaux(newSelection);
  };

  // Sélectionner/désélectionner tous
  const handleSelectAll = () => {
    const allKeys = Object.keys(selectedChevaux);
    const allSelected = allKeys.every(key => selectedChevaux[key]);
    
    const newSelection = {};
    allKeys.forEach(key => {
      newSelection[key] = !allSelected;
    });
    
    setSelectedChevaux(newSelection);
  };

  // Compter les chevaux sélectionnés
  const countSelected = () => {
    return Object.values(selectedChevaux).filter(v => v).length;
  };

  const totalChevaux = Object.keys(selectedChevaux).length;

  return (
    <div className="upload-page">
      <div className="page-header">
        <Link href="/pmu" className="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Retour au tableau de bord
        </Link>
        
        <h1 className="page-title">Import de fichier Excel</h1>
        <p className="page-description">
          Sélectionnez un fichier Excel et choisissez le critère de filtrage à appliquer
        </p>
      </div>

      <div className="upload-container">
        {/* Résultat final de l'import */}
        {uploadResult && (
          <div className={`result-card ${uploadResult.success ? 'success' : 'warning'}`}>
            <div className="result-header">
              {uploadResult.success ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              )}
              <h3>{uploadResult.message}</h3>
            </div>
            
            <div className="action-buttons">
              <button onClick={resetForm} className="reset-button">
                Faire un nouvel import
              </button>
              
              <button onClick={() => router.push('/pmu')} className="dashboard-button">
                Voir le tableau de bord
              </button>
            </div>
          </div>
        )}

        {/* Résultats de l'analyse avec sélection */}
        {analysisResult && !uploadResult && (
          <div className="analysis-results">
            <div className="selection-header">
              <h2>Sélection des chevaux à importer</h2>
              <div className="selection-info">
                <span className="selection-count">
                  {countSelected()} / {totalChevaux} chevaux sélectionnés
                </span>
                <button onClick={handleSelectAll} className="select-all-btn">
                  {countSelected() === totalChevaux ? 'Tout désélectionner' : 'Tout sélectionner'}
                </button>
              </div>
            </div>

            {/* Résultats pour tous les critères */}
            {analysisResult.allCriteriaResults && (
              <div className="all-criteria-selection">
                {Object.entries(analysisResult.allCriteriaResults).map(([critereName, criteriaData]) => (
                  <div key={critereName} className="criteria-section">
                    <h3 style={{color: criteriaData.couleur}}>{critereName}</h3>
                    {criteriaData.selectedCount === 0 ? (
                      <p className="no-results">Aucun cheval trouvé pour ce critère</p>
                    ) : (
                      criteriaData.courses?.map((course, idx) => (
                        <div key={idx} className="course-selection">
                          <div className="course-header-selection">
                            <label className="course-checkbox">
                              <input
                                type="checkbox"
                                checked={course.chevaux.every(ch => selectedChevaux[`${critereName}_${ch.id}`])}
                                onChange={() => handleCourseSelection(course.chevaux, critereName)}
                              />
                              <span>{course.reunion}C{course.course} - {course.hippodrome}</span>
                            </label>
                            <span className="course-count">
                              {course.chevaux.filter(ch => selectedChevaux[`${critereName}_${ch.id}`]).length} / {course.chevaux.length}
                            </span>
                          </div>
                          <div className="chevaux-selection">
                            {course.chevaux.map((cheval) => (
                              <label key={cheval.id} className="cheval-checkbox">
                                <input
                                  type="checkbox"
                                  checked={selectedChevaux[`${critereName}_${cheval.id}`] || false}
                                  onChange={(e) => handleChevalSelection(`${critereName}_${cheval.id}`, e.target.checked)}
                                />
                                <span className="cheval-info-selection">
                                  <span className="cheval-numero">N°{cheval.numero}</span>
                                  <span className="cheval-nom">{cheval.nom}</span>
                                  <span className="cheval-age">{cheval.age} ans</span>
                                  <span className="cheval-def">
                                    Déf: {cheval.def || '-'} | {cheval.def_1 || '-'} | {cheval.def_2 || '-'}
                                  </span>
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Résultats pour un seul critère */}
            {!analysisResult.allCriteriaResults && analysisResult.courses && (
              <div className="single-criteria-selection">
                {analysisResult.courses.map((course, idx) => (
                  <div key={idx} className="course-selection">
                    <div className="course-header-selection">
                      <label className="course-checkbox">
                        <input
                          type="checkbox"
                          checked={course.chevaux.every(ch => selectedChevaux[ch.id])}
                          onChange={() => handleCourseSelection(course.chevaux)}
                        />
                        <span>{course.reunion}C{course.course} - {course.hippodrome}</span>
                      </label>
                      <span className="course-count">
                        {course.chevaux.filter(ch => selectedChevaux[ch.id]).length} / {course.chevaux.length}
                      </span>
                    </div>
                    <div className="chevaux-selection">
                      {course.chevaux.map((cheval) => (
                        <label key={cheval.id} className="cheval-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedChevaux[cheval.id] || false}
                            onChange={(e) => handleChevalSelection(cheval.id, e.target.checked)}
                          />
                          <span className="cheval-info-selection">
                            <span className="cheval-numero">N°{cheval.numero}</span>
                            <span className="cheval-nom">{cheval.nom}</span>
                            <span className="cheval-age">{cheval.age} ans</span>
                            <span className="cheval-def">
                              Déf: {cheval.def || '-'} | {cheval.def_1 || '-'} | {cheval.def_2 || '-'}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="error-message">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <div className="import-actions">
              <button onClick={resetForm} className="cancel-import">
                Annuler
              </button>
              <button 
                onClick={handleImport} 
                disabled={countSelected() === 0 || isImporting}
                className="import-selected"
              >
                {isImporting ? (
                  <>
                    <span className="spinner" />
                    Import en cours...
                  </>
                ) : (
                  `Importer ${countSelected()} ${countSelected() > 1 ? 'chevaux' : 'cheval'}`
                )}
              </button>
            </div>
          </div>
        )}

        {/* Formulaire initial */}
        {!uploadResult && !analysisResult && (
          <>
            <div className="form-section">
              <h2 className="section-title">1. Sélectionner le fichier Excel</h2>
              <FileUploader
                onFileSelect={setSelectedFile}
                onClear={() => setSelectedFile(null)}
                disabled={isUploading}
              />
            </div>

            <div className="form-section">
              <h2 className="section-title">2. Choisir le critère de filtrage</h2>
              
              {/* Option tous les critères */}
              <div className="all-criteria-option">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={applyAllCriteria}
                    onChange={(e) => handleAllCriteriaChange(e.target.checked)}
                    disabled={isUploading}
                  />
                  <span className="checkbox-wrapper">
                    <span className="checkbox-custom"></span>
                    <span className="checkbox-label">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="10" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      Appliquer tous les critères
                    </span>
                  </span>
                </label>
                <p className="checkbox-description">
                  Analyse le fichier avec tous les critères disponibles (1, 2, 3, 4 et 5) en une seule fois
                </p>
              </div>

              <div className="separator">
                <span>ou</span>
              </div>

              {applyAllCriteria && (
                <p className="disabled-message">
                  La sélection individuelle est désactivée car "Appliquer tous les critères" est activé
                </p>
              )}
              
              <div className={`criteria-selector-wrapper ${applyAllCriteria ? 'disabled' : ''}`}>
                <CriteriaSelector
                  onCriteriaSelect={setSelectedCriteria}
                  disabled={isUploading || applyAllCriteria}
                />
              </div>
            </div>

            {error && (
              <div className="error-message">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <div className="form-actions">
              <Link href="/pmu" className="cancel-button">
                Annuler
              </Link>
              <button
                onClick={handleAnalyze}
                disabled={!selectedFile || (!selectedCriteria && !applyAllCriteria) || isUploading}
                className="submit-button"
              >
                {isUploading ? (
                  <>
                    <span className="spinner" />
                    Analyse en cours...
                  </>
                ) : (
                  'Analyser le fichier'
                )}
              </button>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .upload-page {
          min-height: 100vh;
          background-color: #f9fafb;
          padding: 24px;
        }

        .page-header {
          max-width: 800px;
          margin: 0 auto 32px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #6b7280;
          text-decoration: none;
          font-size: 14px;
          margin-bottom: 16px;
          transition: color 0.2s;
        }

        .back-link:hover {
          color: #3b82f6;
        }

        .page-title {
          font-size: 32px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 8px 0;
        }

        .page-description {
          font-size: 16px;
          color: #6b7280;
          margin: 0;
        }

        .upload-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .analysis-results {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 24px;
        }

        .selection-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e7eb;
        }

        .selection-header h2 {
          font-size: 20px;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .selection-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .selection-count {
          font-size: 16px;
          font-weight: 500;
          color: #3b82f6;
        }

        .select-all-btn {
          padding: 6px 12px;
          background-color: #f3f4f6;
          color: #374151;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .select-all-btn:hover {
          background-color: #e5e7eb;
        }

        .criteria-section {
          margin-bottom: 24px;
        }

        .criteria-section h3 {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 12px 0;
        }

        .no-results {
          color: #6b7280;
          font-style: italic;
          margin: 8px 0;
        }

        .course-selection {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          margin-bottom: 12px;
          overflow: hidden;
        }

        .course-header-selection {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: white;
          border-bottom: 1px solid #e5e7eb;
        }

        .course-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-weight: 600;
          color: #111827;
        }

        .course-checkbox input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .course-count {
          font-size: 14px;
          color: #6b7280;
        }

        .chevaux-selection {
          padding: 8px;
        }

        .cheval-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .cheval-checkbox:hover {
          background-color: white;
        }

        .cheval-checkbox input[type="checkbox"] {
          width: 16px;
          height: 16px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .cheval-info-selection {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .cheval-numero {
          font-weight: 600;
          color: #6b7280;
          min-width: 35px;
        }

        .cheval-nom {
          font-weight: 500;
          color: #111827;
          flex: 1;
        }

        .cheval-age {
          color: #6b7280;
          font-size: 14px;
        }

        .cheval-def {
          color: #7c3aed;
          font-size: 14px;
          font-weight: 500;
        }

        .import-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }

        .cancel-import {
          padding: 10px 20px;
          border: 1px solid #e5e7eb;
          background-color: white;
          color: #6b7280;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cancel-import:hover {
          background-color: #f9fafb;
        }

        .import-selected {
          padding: 10px 20px;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .import-selected:hover:not(:disabled) {
          background-color: #2563eb;
        }

        .import-selected:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .all-criteria-option {
          background: #f0f9ff;
          border: 1px solid #3b82f6;
          border-radius: 6px;
          padding: 16px;
          margin-bottom: 16px;
        }

        .checkbox-container {
          display: block;
          cursor: pointer;
        }

        .checkbox-container input[type="checkbox"] {
          position: absolute;
          opacity: 0;
        }

        .checkbox-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .checkbox-custom {
          width: 20px;
          height: 20px;
          border: 2px solid #d1d5db;
          border-radius: 4px;
          background: white;
          position: relative;
          transition: all 0.2s;
        }

        .checkbox-container input[type="checkbox"]:checked ~ .checkbox-wrapper .checkbox-custom {
          background-color: #3b82f6;
          border-color: #3b82f6;
        }

        .checkbox-container input[type="checkbox"]:checked ~ .checkbox-wrapper .checkbox-custom::after {
          content: '';
          position: absolute;
          left: 6px;
          top: 2px;
          width: 6px;
          height: 10px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #111827;
          font-size: 16px;
        }

        .checkbox-label svg {
          color: #3b82f6;
        }

        .checkbox-description {
          font-size: 14px;
          color: #6b7280;
          font-weight: 400;
          margin: 8px 0 0 32px;
        }

        .separator {
          text-align: center;
          margin: 16px 0;
          position: relative;
        }

        .separator::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #e5e7eb;
        }

        .separator span {
          background: white;
          padding: 0 16px;
          position: relative;
          color: #6b7280;
          font-size: 14px;
          font-style: italic;
        }

        .form-section {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 24px;
          position: relative;
        }

        .disabled-message {
          color: #6b7280;
          font-size: 14px;
          font-style: italic;
          margin-bottom: 12px;
        }

        .criteria-selector-wrapper.disabled {
          opacity: 0.5;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 16px 0;
        }

        .error-message {
          background-color: #fee2e2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .cancel-button {
          padding: 10px 20px;
          border: 1px solid #e5e7eb;
          background-color: white;
          color: #6b7280;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 500;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
        }

        .cancel-button:hover {
          background-color: #f9fafb;
        }

        .submit-button {
          padding: 10px 20px;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .submit-button:hover:not(:disabled) {
          background-color: #2563eb;
        }

        .submit-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .result-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .result-card.success {
          border-color: #86efac;
          background-color: #f0fdf4;
        }

        .result-card.warning {
          border-color: #fde68a;
          background-color: #fffbeb;
        }

        .result-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .result-header svg {
          color: #22c55e;
          flex-shrink: 0;
        }

        .result-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #111827;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .reset-button,
        .dashboard-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 20px;
          color: white;
          text-decoration: none;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .reset-button {
          background-color: #3b82f6;
        }

        .reset-button:hover {
          background-color: #2563eb;
        }

        .dashboard-button {
          background-color: #6366f1;
        }

        .dashboard-button:hover {
          background-color: #4f46e5;
        }

        @media (max-width: 640px) {
          .upload-page {
            padding: 16px;
          }

          .page-title {
            font-size: 24px;
          }

          .form-section {
            padding: 16px;
          }

          .selection-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .selection-info {
            width: 100%;
            justify-content: space-between;
          }

          .cheval-info-selection {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}