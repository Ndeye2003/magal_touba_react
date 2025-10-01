// src/services/fileService.js

import api from './api';

/**
 * Service pour la gestion des fichiers avec upload réel côté serveur
 */
class FileService {
  
  // =====================================
  // CONSTANTES
  // =====================================
  
  static ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  static MAX_SIZE = 5 * 1024 * 1024; // 5MB
  
  // =====================================
  // VALIDATION
  // =====================================
  
  /**
   * Valider un fichier image
   */
  validateImage(file) {
    const errors = [];
    
    // Vérifier le type
    if (!FileService.ALLOWED_TYPES.includes(file.type)) {
      errors.push('Format non supporté. Utilisez JPG, PNG ou WebP.');
    }
    
    // Vérifier la taille
    if (file.size > FileService.MAX_SIZE) {
      errors.push('Fichier trop volumineux. Maximum 5MB.');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  // =====================================
  // UPLOAD RÉEL
  // =====================================
  
  /**
   * Uploader une image d'événement côté serveur Laravel
   */
  async uploadEventImage(file, evenementId = 'new') {
    try {
      // Validation côté client
      const validation = this.validateImage(file);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(' '));
      }
      
      // Créer FormData pour l'upload
      const formData = new FormData();
      formData.append('image', file);
      formData.append('evenement_id', evenementId);
      
      console.log('📤 Upload de l\'image vers Laravel...');
      
      // Envoyer vers Laravel
      const response = await api.post('/images/evenements/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const imageUrl = response.data.data.url;
      console.log('✅ Image uploadée:', imageUrl);
      
      return imageUrl;
      
    } catch (error) {
      console.error('❌ Erreur upload:', error);
      
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0];
        throw new Error(firstError ? firstError[0] : 'Erreur de validation');
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Erreur lors de l\'upload'
      );
    }
  }
  
  /**
   * Supprimer une image d'événement
   */
  async deleteEventImage(imageUrl) {
    try {
      await api.delete('/images/evenements/delete', {
        data: { image_url: imageUrl }
      });
      
      console.log('✅ Image supprimée:', imageUrl);
      
    } catch (error) {
      console.error('❌ Erreur suppression image:', error);
      // Ne pas faire échouer si la suppression échoue
    }
  }
  
  // =====================================
  // HELPERS
  // =====================================
  
  /**
   * Générer l'URL complète d'accès à une image
   */
  getImageUrl(relativePath) {
    if (!relativePath) return null;
    
    // Si c'est déjà une URL complète
    if (relativePath.startsWith('http')) {
      return relativePath;
    }
    
    // Construire l'URL vers le serveur Laravel
    return `http://localhost:8000${relativePath}`;
  }
  
  /**
   * Créer une URL de prévisualisation temporaire
   */
  createPreviewUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      
      reader.onerror = () => {
        reject(new Error('Erreur lors de la lecture du fichier'));
      };
      
      reader.readAsDataURL(file);
    });
  }
  
  /**
   * Formater la taille d'un fichier
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Instance unique
const fileService = new FileService();
export default fileService;