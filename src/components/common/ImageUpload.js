// src/components/common/ImageUpload.js

import React, { useState, useRef } from 'react';
import { FaUpload, FaTimes, FaSpinner, FaImage, FaTrash } from 'react-icons/fa';
import fileService from '../../services/fileService';

/**
 * Composant d'upload d'images avec upload réel côté serveur
 */
const ImageUpload = ({ 
  currentImage = null,
  onImageChange,
  eventId = 'new',
  className = '',
  disabled = false 
}) => {
  // =====================================
  // ÉTATS DU COMPOSANT
  // =====================================
  
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(
    currentImage ? fileService.getImageUrl(currentImage) : null
  );
  const [currentImageUrl, setCurrentImageUrl] = useState(currentImage);
  
  const fileInputRef = useRef(null);
  
  // =====================================
  // GESTION DES FICHIERS
  // =====================================
  
  /**
   * Traiter un fichier sélectionné avec upload réel
   */
  const handleFileSelect = async (file) => {
    if (!file) return;
    
    setUploading(true);
    setError('');
    
    try {
      // Créer une prévisualisation temporaire immédiate
      const tempPreview = await fileService.createPreviewUrl(file);
      setPreviewUrl(tempPreview);
      
      // Uploader réellement vers Laravel
      const imageUrl = await fileService.uploadEventImage(file, eventId);
      
      // Mettre à jour avec l'URL finale du serveur
      const finalUrl = fileService.getImageUrl(imageUrl);
      setPreviewUrl(finalUrl);
      setCurrentImageUrl(imageUrl);
      
      // Notifier le parent avec l'URL relative pour la base
      onImageChange(imageUrl);
      
      console.log('✅ Upload terminé avec succès');
      
    } catch (error) {
      console.error('❌ Erreur upload:', error);
      setError(error.message);
      // Revenir à l'état précédent
      setPreviewUrl(currentImage ? fileService.getImageUrl(currentImage) : null);
    } finally {
      setUploading(false);
    }
  };
  
  /**
   * Supprimer l'image actuelle
   */
  const handleRemoveImage = async () => {
    setUploading(true);
    
    try {
      // Supprimer côté serveur si ce n'est pas l'image initiale
      if (currentImageUrl && currentImageUrl !== currentImage) {
        await fileService.deleteEventImage(currentImageUrl);
      }
      
      // Réinitialiser l'état
      setPreviewUrl(null);
      setCurrentImageUrl(null);
      setError('');
      onImageChange(null);
      
      // Réinitialiser l'input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
      console.error('❌ Erreur suppression:', error);
      // Continuer même si la suppression échoue
      setPreviewUrl(null);
      setCurrentImageUrl(null);
      onImageChange(null);
    } finally {
      setUploading(false);
    }
  };
  
  // =====================================
  // GESTIONNAIRES D'ÉVÉNEMENTS
  // =====================================
  
  const handleClick = () => {
    if (disabled || uploading) return;
    fileInputRef.current?.click();
  };
  
  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled && !uploading) {
      setDragOver(true);
    }
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    if (disabled || uploading) return;
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };
  
  // =====================================
  // RENDER
  // =====================================
  
  return (
    <div className={`image-upload-container ${className}`}>
      
      {/* Zone d'upload */}
      <div
        className={`
          border-2 border-dashed rounded-3 p-4 text-center cursor-pointer transition-all
          ${dragOver ? 'border-primary bg-primary-subtle' : 'border-muted'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'}
          ${error ? 'border-danger' : ''}
        `}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ minHeight: '200px', position: 'relative' }}
      >
        
        {/* Input file caché */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
          disabled={disabled || uploading}
        />
        
        {uploading ? (
          // État de chargement
          <div className="d-flex flex-column align-items-center justify-content-center h-100">
            <FaSpinner className="fa-spin text-primary mb-3" size={32} />
            <p className="text-muted mb-0">
              {previewUrl ? 'Upload en cours...' : 'Préparation...'}
            </p>
          </div>
        ) : previewUrl ? (
          // Prévisualisation de l'image
          <div className="position-relative">
            <img
              src={previewUrl}
              alt="Prévisualisation"
              className="img-fluid rounded"
              style={{ maxHeight: '300px', objectFit: 'cover' }}
              onError={(e) => {
                console.warn('Erreur chargement image preview');
                setError('Erreur de chargement de l\'image');
              }}
            />
            
            {/* Bouton de suppression */}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                style={{ zIndex: 10 }}
                disabled={uploading}
              >
                <FaTrash />
              </button>
            )}
          </div>
        ) : (
          // Zone de drop vide
          <div className="d-flex flex-column align-items-center justify-content-center h-100">
            <FaImage className="text-muted mb-3" size={48} />
            <h6 className="text-muted mb-2">
              {dragOver ? 'Déposez l\'image ici' : 'Ajouter une image'}
            </h6>
            <p className="text-muted small mb-3">
              Cliquez ou glissez-déposez une image<br />
              <small>JPG, PNG ou WebP - Maximum 5MB</small>
            </p>
            <div className="btn btn-outline-primary btn-sm">
              <FaUpload className="me-2" />
              Choisir un fichier
            </div>
          </div>
        )}
      </div>
      
      {/* Message d'erreur */}
      {error && (
        <div className="alert alert-danger mt-2 py-2" role="alert">
          <small>{error}</small>
        </div>
      )}
      
      {/* Informations sur le fichier */}
      {previewUrl && !uploading && !error && (
        <div className="mt-2">
          <small className="text-success">
            ✅ Image prête à être utilisée
          </small>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;