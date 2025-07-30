'use client';

import { useState, useRef } from 'react';

export default function FileUploader({ onFileSelect, onClear, disabled = false }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Gestion de la sélection de fichier
  const handleFileSelect = (file) => {
    if (!file) return;
    
    // Vérifier l'extension
    const validExtensions = ['.xlsx', '.xls'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => fileName.endsWith(ext));
    
    if (!isValid) {
      alert('Le fichier doit être au format Excel (.xlsx ou .xls)');
      return;
    }
    
    // Vérifier la taille (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Le fichier est trop volumineux (max 10MB)');
      return;
    }
    
    setSelectedFile(file);
    onFileSelect(file);
  };

  // Gestion du drag & drop
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Gestion du clic sur l'input
  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Effacer la sélection
  const handleClear = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClear();
  };

  // Formater la taille du fichier
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="file-uploader">
      {!selectedFile ? (
        <div
          className={`upload-zone ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleInputChange}
            disabled={disabled}
            style={{ display: 'none' }}
          />
          
          <div className="upload-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          
          <p className="upload-text">
            {isDragging ? 'Déposez le fichier ici' : 'Cliquez ou glissez-déposez un fichier Excel'}
          </p>
          
          <p className="upload-hint">
            Formats acceptés : .xlsx, .xls (max 10MB)
          </p>
        </div>
      ) : (
        <div className="file-selected">
          <div className="file-info">
            <div className="file-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                <polyline points="13 2 13 9 20 9" />
              </svg>
            </div>
            
            <div className="file-details">
              <p className="file-name">{selectedFile.name}</p>
              <p className="file-size">{formatFileSize(selectedFile.size)}</p>
            </div>
            
            <button
              type="button"
              onClick={handleClear}
              className="file-clear"
              disabled={disabled}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .file-uploader {
          width: 100%;
        }

        .upload-zone {
          border: 2px dashed #e5e7eb;
          border-radius: 8px;
          padding: 48px 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background-color: #f9fafb;
        }

        .upload-zone:hover:not(.disabled) {
          border-color: #3b82f6;
          background-color: #eff6ff;
        }

        .upload-zone.dragging {
          border-color: #3b82f6;
          background-color: #eff6ff;
        }

        .upload-zone.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .upload-icon {
          color: #6b7280;
          margin-bottom: 16px;
        }

        .upload-text {
          font-size: 16px;
          font-weight: 500;
          color: #111827;
          margin-bottom: 8px;
        }

        .upload-hint {
          font-size: 14px;
          color: #6b7280;
        }

        .file-selected {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          background-color: #f9fafb;
        }

        .file-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .file-icon {
          color: #3b82f6;
          flex-shrink: 0;
        }

        .file-details {
          flex: 1;
          min-width: 0;
        }

        .file-name {
          font-weight: 500;
          color: #111827;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-size {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .file-clear {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          color: #6b7280;
          transition: color 0.2s;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .file-clear:hover:not(:disabled) {
          color: #dc2626;
          background-color: #fee2e2;
        }

        .file-clear:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}