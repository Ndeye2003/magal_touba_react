// src/pages/admin/NouvelEvenement.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaSave, 
  FaTimes, 
  FaSpinner,
  FaCalendar,
  FaMapMarkerAlt,
  FaUsers,
  FaImage,
  FaClock
} from 'react-icons/fa';

import evenementService from '../../services/evenementService';
import ImageUpload from '../../components/common/ImageUpload';

/**
 * Page de création d'un nouvel événement (Admin)
 * 
 * Fonctionnalités :
 * - Formulaire complet avec validation
 * - Upload d'image avec prévisualisation
 * - Validation côté client et serveur
 * - Animations et feedback utilisateur
 */
const NouvelEvenement = () => {
  // =====================================
  // ÉTATS DU COMPOSANT
  // =====================================
  
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    date_heure: '',
    lieu: '',
    capacite_max: '',
    image_url: null,
    est_actif: true
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  
  // =====================================
  // GESTION DU FORMULAIRE
  // =====================================
  
  /**
   * Gérer les changements dans les champs
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Effacer l'erreur spécifique à ce champ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    if (success) setSuccess('');
  };
  
  /**
   * Gérer le changement d'image
   */
  const handleImageChange = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      image_url: imageUrl
    }));
    
    if (errors.image_url) {
      setErrors(prev => ({
        ...prev,
        image_url: ''
      }));
    }
  };
  
  /**
   * Valider le formulaire côté client
   */
  const validateForm = () => {
    const newErrors = {};
    
    // Titre
    if (!formData.titre.trim()) {
      newErrors.titre = 'Le titre est obligatoire';
    } else if (formData.titre.length < 5) {
      newErrors.titre = 'Le titre doit contenir au moins 5 caractères';
    }
    
    // Description
    if (!formData.description.trim()) {
      newErrors.description = 'La description est obligatoire';
    } else if (formData.description.length < 10) {
      newErrors.description = 'La description doit contenir au moins 10 caractères';
    }
    
    // Date et heure
    if (!formData.date_heure) {
      newErrors.date_heure = 'La date et l\'heure sont obligatoires';
    } else {
      const eventDate = new Date(formData.date_heure);
      const now = new Date();
      if (eventDate <= now) {
        newErrors.date_heure = 'La date doit être dans le futur';
      }
    }
    
    // Lieu
    if (!formData.lieu.trim()) {
      newErrors.lieu = 'Le lieu est obligatoire';
    } else if (formData.lieu.length < 3) {
      newErrors.lieu = 'Le lieu doit contenir au moins 3 caractères';
    }
    
    // Capacité maximale (optionnelle mais si renseignée, doit être valide)
    if (formData.capacite_max && (isNaN(formData.capacite_max) || parseInt(formData.capacite_max) < 1)) {
      newErrors.capacite_max = 'La capacité doit être un nombre supérieur à 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  /**
   * Soumettre le formulaire
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation côté client
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setErrors({});
    setSuccess('');
    
    try {
      // Préparer les données pour l'API
      const submitData = {
        ...formData,
        capacite_max: formData.capacite_max ? parseInt(formData.capacite_max) : null
      };
      
      // Créer l'événement
      const response = await evenementService.creerEvenement(submitData);
      
      // Succès
      setSuccess('Événement créé avec succès !');
      
      console.log('✅ Événement créé:', response.data);
      
      // Redirection après un délai
      setTimeout(() => {
        navigate(`/evenements/${response.data.id}`, {
          state: { message: 'Événement créé avec succès !' }
        });
      }, 2000);
      
    } catch (error) {
      console.error('❌ Erreur création événement:', error);
      
      if (error.response?.status === 422) {
        // Erreurs de validation du serveur
        setErrors(error.response.data.errors || {});
      } else {
        setErrors({ 
          general: error.response?.data?.message || 'Erreur lors de la création de l\'événement' 
        });
      }
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Réinitialiser le formulaire
   */
  const handleReset = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser le formulaire ?')) {
      setFormData({
        titre: '',
        description: '',
        date_heure: '',
        lieu: '',
        capacite_max: '',
        image_url: null,
        est_actif: true
      });
      setErrors({});
      setSuccess('');
    }
  };
  
  // =====================================
  // HELPERS
  // =====================================
  
  /**
   * Obtenir la date minimum (maintenant + 1 heure)
   */
  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };
  
  // =====================================
  // RENDER
  // =====================================
  
  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h1 className="text-magal-primary mb-2 fade-in">
                  ✨ Créer un nouvel événement
                </h1>
                <p className="text-muted">
                  Ajoutez un événement au programme du Magal Touba 2024
                </p>
              </div>
              
              {/* Bouton retour */}
              <Link 
                to="/evenements"
                className="btn btn-outline-secondary"
              >
                <FaArrowLeft className="me-2" />
                Retour
              </Link>
            </div>
          </div>
        </div>
        
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-6">
            
            {/* Formulaire */}
            <div className="magal-card slide-up">
              <div className="card-body p-4">
                
                {/* Messages de feedback */}
                {errors.general && (
                  <div className="alert alert-danger magal-alert" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {errors.general}
                  </div>
                )}
                
                {success && (
                  <div className="alert alert-success magal-alert" role="alert">
                    <i className="fas fa-check-circle me-2"></i>
                    {success}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  
                  {/* Titre */}
                  <div className="mb-4">
                    <label htmlFor="titre" className="form-label fw-semibold">
                      <FaCalendar className="me-2 text-magal-primary" />
                      Titre de l'événement *
                    </label>
                    <input
                      type="text"
                      id="titre"
                      name="titre"
                      className={`form-control magal-input ${errors.titre ? 'is-invalid' : ''}`}
                      placeholder="Ex: Grande Conférence sur Serigne Touba"
                      value={formData.titre}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                    {errors.titre && (
                      <div className="invalid-feedback">
                        {errors.titre}
                      </div>
                    )}
                  </div>
                  
                  {/* Description */}
                  <div className="mb-4">
                    <label htmlFor="description" className="form-label fw-semibold">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      className={`form-control magal-input ${errors.description ? 'is-invalid' : ''}`}
                      placeholder="Décrivez l'événement en détail..."
                      value={formData.description}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                    <div className="form-text">
                      {formData.description.length}/1000 caractères
                    </div>
                    {errors.description && (
                      <div className="invalid-feedback">
                        {errors.description}
                      </div>
                    )}
                  </div>
                  
                  <div className="row">
                    {/* Date et heure */}
                    <div className="col-md-6 mb-4">
                      <label htmlFor="date_heure" className="form-label fw-semibold">
                        <FaClock className="me-2 text-info" />
                        Date et heure *
                      </label>
                      <input
                        type="datetime-local"
                        id="date_heure"
                        name="date_heure"
                        className={`form-control magal-input ${errors.date_heure ? 'is-invalid' : ''}`}
                        min={getMinDateTime()}
                        value={formData.date_heure}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                      {errors.date_heure && (
                        <div className="invalid-feedback">
                          {errors.date_heure}
                        </div>
                      )}
                    </div>
                    
                    {/* Capacité maximale */}
                    <div className="col-md-6 mb-4">
                      <label htmlFor="capacite_max" className="form-label fw-semibold">
                        <FaUsers className="me-2 text-success" />
                        Capacité maximale
                      </label>
                      <input
                        type="number"
                        id="capacite_max"
                        name="capacite_max"
                        className={`form-control magal-input ${errors.capacite_max ? 'is-invalid' : ''}`}
                        placeholder="Laissez vide pour illimité"
                        min="1"
                        value={formData.capacite_max}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                      <div className="form-text">
                        Laissez vide pour une capacité illimitée
                      </div>
                      {errors.capacite_max && (
                        <div className="invalid-feedback">
                          {errors.capacite_max}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Lieu */}
                  <div className="mb-4">
                    <label htmlFor="lieu" className="form-label fw-semibold">
                      <FaMapMarkerAlt className="me-2 text-warning" />
                      Lieu *
                    </label>
                    <input
                      type="text"
                      id="lieu"
                      name="lieu"
                      className={`form-control magal-input ${errors.lieu ? 'is-invalid' : ''}`}
                      placeholder="Ex: Grande Mosquée de Touba"
                      value={formData.lieu}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                    {errors.lieu && (
                      <div className="invalid-feedback">
                        {errors.lieu}
                      </div>
                    )}
                  </div>
                  
                  {/* Image */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      <FaImage className="me-2 text-magal-primary" />
                      Image de l'événement
                    </label>
                    <ImageUpload
                      currentImage={formData.image_url}
                      onImageChange={handleImageChange}
                      eventId="new"
                      disabled={loading}
                    />
                    {errors.image_url && (
                      <div className="text-danger mt-2">
                        <small>{errors.image_url}</small>
                      </div>
                    )}
                  </div>
                  
                  {/* Statut actif */}
                  <div className="mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="est_actif"
                        name="est_actif"
                        checked={formData.est_actif}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                      <label className="form-check-label" htmlFor="est_actif">
                        Événement actif et visible par les utilisateurs
                      </label>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="d-flex gap-3 justify-content-end">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="btn btn-outline-secondary"
                      disabled={loading}
                    >
                      <FaTimes className="me-2" />
                      Réinitialiser
                    </button>
                    
                                          <button
                        type="submit"
                        className="btn btn-magal-primary pulse-btn"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <FaSpinner className="fa-spin me-2" />
                            Création en cours...
                          </>
                        ) : (
                          <>
                            <FaSave className="me-2" />
                            Créer l'événement
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default NouvelEvenement;