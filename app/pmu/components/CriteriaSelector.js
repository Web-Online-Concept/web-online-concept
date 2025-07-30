'use client';

import { useState, useEffect } from 'react';
import { CRITERES } from '../lib/criteria';

export default function CriteriaSelector({ onCriteriaSelect, disabled = false }) {
  const [selectedCriteria, setSelectedCriteria] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  // Obtenir uniquement les critères actifs
  const activeCriteria = Object.entries(CRITERES).filter(([_, criteria]) => criteria.actif);

  useEffect(() => {
    // Sélectionner automatiquement le premier critère actif s'il n'y en a qu'un
    if (activeCriteria.length === 1 && !selectedCriteria) {
      const [id] = activeCriteria[0];
      setSelectedCriteria(id);
      onCriteriaSelect(id);
    }
  }, []);

  const handleCriteriaChange = (criteriaId) => {
    setSelectedCriteria(criteriaId);
    onCriteriaSelect(criteriaId);
  };

  const getCurrentCriteria = () => {
    return selectedCriteria ? CRITERES[selectedCriteria] : null;
  };

  return (
    <div className="criteria-selector">
      <div className="selector-header">
        <h3 className="selector-title">Sélection du critère de filtrage</h3>
        <p className="selector-description">
          Choisissez le critère à appliquer pour filtrer les chevaux
        </p>
      </div>

      <div className="criteria-list">
        {activeCriteria.length === 0 ? (
          <p className="no-criteria">Aucun critère actif disponible</p>
        ) : (
          activeCriteria.map(([id, criteria]) => (
            <label
              key={id}
              className={`criteria-item ${selectedCriteria === id ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
            >
              <input
                type="radio"
                name="criteria"
                value={id}
                checked={selectedCriteria === id}
                onChange={(e) => handleCriteriaChange(e.target.value)}
                disabled={disabled}
              />
              
              <div className="criteria-content">
                <div className="criteria-header">
                  <span 
                    className="criteria-indicator"
                    style={{ backgroundColor: criteria.couleur }}
                  />
                  <span className="criteria-name">{criteria.nom}</span>
                </div>
                
                <p className="criteria-description">{criteria.description}</p>
                
                {selectedCriteria === id && showDetails && (
                  <div className="criteria-filters">
                    <h4>Filtres appliqués :</h4>
                    <ul>
                      {criteria.filtres.map((filtre, index) => (
                        <li key={index}>
                          {filtre.nom} {filtre.operateur} <strong>{filtre.valeur}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </label>
          ))
        )}
      </div>

      {selectedCriteria && (
        <button
          type="button"
          className="details-toggle"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Masquer' : 'Voir'} les détails
        </button>
      )}

      <style jsx>{`
        .criteria-selector {
          width: 100%;
        }

        .selector-header {
          margin-bottom: 20px;
        }

        .selector-title {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 8px 0;
        }

        .selector-description {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .criteria-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .no-criteria {
          text-align: center;
          color: #6b7280;
          padding: 24px;
          background-color: #f9fafb;
          border-radius: 8px;
          border: 1px dashed #e5e7eb;
        }

        .criteria-item {
          display: block;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s;
          background-color: white;
        }

        .criteria-item:hover:not(.disabled) {
          border-color: #3b82f6;
          background-color: #f0f9ff;
        }

        .criteria-item.selected {
          border-color: #3b82f6;
          background-color: #eff6ff;
        }

        .criteria-item.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .criteria-item input[type="radio"] {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .criteria-content {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .criteria-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .criteria-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .criteria-name {
          font-weight: 600;
          color: #111827;
          font-size: 16px;
        }

        .criteria-description {
          color: #4b5563;
          font-size: 14px;
          margin: 0;
          padding-left: 24px;
        }

        .criteria-filters {
          margin-top: 12px;
          padding: 12px;
          background-color: #f3f4f6;
          border-radius: 6px;
          font-size: 14px;
        }

        .criteria-filters h4 {
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .criteria-filters ul {
          margin: 0;
          padding-left: 20px;
          color: #4b5563;
        }

        .criteria-filters li {
          margin-bottom: 4px;
        }

        .criteria-filters strong {
          color: #111827;
          font-weight: 600;
        }

        .details-toggle {
          margin-top: 12px;
          background: none;
          border: none;
          color: #3b82f6;
          font-size: 14px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .details-toggle:hover {
          background-color: #eff6ff;
        }

        @media (max-width: 640px) {
          .criteria-item {
            padding: 12px;
          }
          
          .criteria-name {
            font-size: 15px;
          }
          
          .criteria-description {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}