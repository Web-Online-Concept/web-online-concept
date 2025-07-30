'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ChevauxList from './components/ChevauxList';

export default function DashboardPage() {
  const [chevaux, setChevaux] = useState({});
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateDebut: '',
    dateFin: '',
    hippodrome: '',
    critere: ''
  });
  const [isDbInitialized, setIsDbInitialized] = useState(true);
  
  // États pour le convertisseur
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef(null);

  // Gérer la conversion XLSX vers XLS
  const handleFileConversion = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Vérifier que c'est bien un fichier XLSX
    if (!file.name.endsWith('.xlsx')) {
      alert('Veuillez sélectionner un fichier .xlsx');
      event.target.value = '';
      return;
    }

    setIsConverting(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/pmu/api/convert-excel', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la conversion');
      }

      // Récupérer le fichier converti
      const blob = await response.blob();
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace('.xlsx', '.xls');
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Réinitialiser l'input
      event.target.value = '';
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la conversion du fichier');
    } finally {
      setIsConverting(false);
    }
  };

  // Charger les données
  const loadData = async () => {
    setIsLoading(true);
    
    try {
      // Construire l'URL avec les filtres
      const params = new URLSearchParams();
      if (filters.dateDebut) params.append('dateDebut', filters.dateDebut);
      if (filters.dateFin) params.append('dateFin', filters.dateFin);
      if (filters.hippodrome) params.append('hippodrome', filters.hippodrome);
      if (filters.critere) params.append('critere', filters.critere);
      
      const response = await fetch(`/pmu/api/chevaux?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setChevaux(data.data);
        setStats(data.stats);
      } else {
        console.error('Erreur lors du chargement des données');
      }
    } catch (error) {
      console.error('Erreur:', error);
      // Vérifier si la base de données est initialisée
      checkDatabaseStatus();
    } finally {
      setIsLoading(false);
    }
  };

  // Vérifier le statut de la base de données
  const checkDatabaseStatus = async () => {
    try {
      const response = await fetch('/pmu/api/init-db');
      const data = await response.json();
      setIsDbInitialized(data.initialized);
    } catch (error) {
      console.error('Erreur vérification BDD:', error);
      setIsDbInitialized(false);
    }
  };

  // Initialiser la base de données
  const initializeDatabase = async () => {
    try {
      const response = await fetch('/pmu/api/init-db?key=init-pmu-2025', {
        method: 'POST'
      });
      
      if (response.ok) {
        setIsDbInitialized(true);
        loadData();
      } else {
        alert('Erreur lors de l\'initialisation de la base de données');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de connexion au serveur');
    }
  };

  // Charger les données au montage
  useEffect(() => {
    loadData();
  }, [filters]);

  // Gérer les changements de filtres
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      dateDebut: '',
      dateFin: '',
      hippodrome: '',
      critere: ''
    });
  };

  // Si la base de données n'est pas initialisée
  if (!isDbInitialized) {
    return (
      <div className="dashboard-page">
        <div className="init-container">
          <div className="init-card">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <h2>Base de données non initialisée</h2>
            <p>La base de données doit être initialisée avant la première utilisation.</p>
            <button onClick={initializeDatabase} className="init-button">
              Initialiser la base de données
            </button>
          </div>
        </div>
        <style jsx>{`
          .dashboard-page {
            min-height: 100vh;
            background-color: #f9fafb;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
          }
          .init-container {
            max-width: 500px;
            width: 100%;
          }
          .init-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 48px;
            text-align: center;
          }
          .init-card svg {
            margin: 0 auto 24px;
            color: #6b7280;
          }
          .init-card h2 {
            font-size: 24px;
            font-weight: 600;
            color: #111827;
            margin: 0 0 12px 0;
          }
          .init-card p {
            color: #6b7280;
            margin: 0 0 24px 0;
          }
          .init-button {
            padding: 12px 24px;
            background-color: #3b82f6;
            color: white;
            border: none;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          .init-button:hover {
            background-color: #2563eb;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Tableau de bord PMU</h1>
          <p className="page-description">
            Gestion des sélections de chevaux
          </p>
        </div>
        
        <div className="header-actions">
          {/* Convertisseur XLSX vers XLS */}
          <div className="converter-container">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx"
              onChange={handleFileConversion}
              style={{ display: 'none' }}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="converter-button"
              disabled={isConverting}
            >
              {isConverting ? (
                <>
                  <span className="spinner" />
                  Conversion...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  XLSX → XLS
                </>
              )}
            </button>
          </div>
          
          <Link href="/pmu/upload" className="upload-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Importer un fichier
          </Link>
        </div>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Total chevaux</p>
              <p className="stat-value">{stats.totalChevaux}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Hippodromes</p>
              <p className="stat-value">{stats.hippodromes.length}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Courses</p>
              <p className="stat-value">{stats.totalCourses}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="filters-section">
        <h2 className="section-title">Filtres</h2>
        <div className="filters-grid">
          <div className="filter-item">
            <label htmlFor="dateDebut">Date début</label>
            <input
              type="date"
              id="dateDebut"
              value={filters.dateDebut}
              onChange={(e) => handleFilterChange('dateDebut', e.target.value)}
            />
          </div>
          
          <div className="filter-item">
            <label htmlFor="dateFin">Date fin</label>
            <input
              type="date"
              id="dateFin"
              value={filters.dateFin}
              onChange={(e) => handleFilterChange('dateFin', e.target.value)}
            />
          </div>
          
          <div className="filter-item">
            <label htmlFor="hippodrome">Hippodrome</label>
            <select
              id="hippodrome"
              value={filters.hippodrome}
              onChange={(e) => handleFilterChange('hippodrome', e.target.value)}
            >
              <option value="">Tous les hippodromes</option>
              {stats?.hippodromes.map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-item">
            <label htmlFor="critere">Critère utilisé</label>
            <select
              id="critere"
              value={filters.critere}
              onChange={(e) => handleFilterChange('critere', e.target.value)}
            >
              <option value="">Tous les critères</option>
              <option value="Critère 1">Critère 1</option>
              <option value="Critère 2">Critère 2</option>
              <option value="Critère 3">Critère 3</option>
              <option value="Critère 4">Critère 4</option>
              <option value="Critère 5">Critère 5</option>
            </select>
          </div>
          
          <button onClick={resetFilters} className="reset-filters">
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Liste des chevaux */}
      <div className="chevaux-section">
        <h2 className="section-title">Chevaux sélectionnés</h2>
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Chargement des données...</p>
          </div>
        ) : (
          <ChevauxList 
            chevaux={chevaux} 
            onDelete={() => loadData()}
            onRefresh={loadData}
          />
        )}
      </div>

      <style jsx>{`
        .dashboard-page {
          min-height: 100vh;
          background-color: #f9fafb;
          padding: 24px;
        }

        .page-header {
          max-width: 1200px;
          margin: 0 auto 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .header-content {
          flex: 1;
        }

        .header-actions {
          display: flex;
          gap: 12px;
          align-items: center;
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

        .converter-container {
          position: relative;
        }

        .converter-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background-color: #8b5cf6;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
          font-size: 14px;
        }

        .converter-button:hover:not(:disabled) {
          background-color: #7c3aed;
        }

        .converter-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .upload-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background-color: #3b82f6;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .upload-button:hover {
          background-color: #2563eb;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        .stats-grid {
          max-width: 1200px;
          margin: 0 auto 32px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .stat-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          background-color: #eff6ff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3b82f6;
          flex-shrink: 0;
        }

        .stat-content {
          flex: 1;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 4px 0;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .filters-section {
          max-width: 1200px;
          margin: 0 auto 32px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 24px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 16px 0;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          align-items: end;
        }

        .filter-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .filter-item label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .filter-item input,
        .filter-item select {
          padding: 8px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .filter-item input:focus,
        .filter-item select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .reset-filters {
          padding: 8px 16px;
          background-color: #f3f4f6;
          color: #6b7280;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          align-self: flex-end;
        }

        .reset-filters:hover {
          background-color: #e5e7eb;
          color: #374151;
        }

        .chevaux-section {
          max-width: 1200px;
          margin: 0 auto;
        }

        .loading-state {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 60px;
          text-align: center;
        }

        .loading-state .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f3f4f6;
          border-top-color: #3b82f6;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-state p {
          color: #6b7280;
          margin: 0;
        }

        @media (max-width: 768px) {
          .dashboard-page {
            padding: 16px;
          }

          .page-title {
            font-size: 24px;
          }

          .header-actions {
            width: 100%;
            flex-direction: column;
          }

          .converter-button,
          .upload-button {
            width: 100%;
            justify-content: center;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .filters-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}