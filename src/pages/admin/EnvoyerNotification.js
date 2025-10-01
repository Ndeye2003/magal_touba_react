// src/pages/admin/EnvoyerNotification.js

/**
 * ========================================
 * PAGE ADMIN - ENVOI DE NOTIFICATIONS
 * ========================================
 * 
 * Cette page permet aux administrateurs d'envoyer des notifications
 * de manière ciblée ou globale.
 * 
 * FONCTIONNALITÉS :
 * ----------------
 * ✅ Envoyer à TOUS les utilisateurs
 * ✅ Envoyer aux INSCRITS d'un événement spécifique
 * ✅ Lier une notification à un événement
 * ✅ Validation en temps réel
 * ✅ Prévisualisation avant envoi
 * ✅ Compteur de destinataires estimés
 * 
 * ENDPOINTS UTILISÉS :
 * -------------------
 * POST /api/notifications/envoyer-a-tous
 * POST /api/notifications/envoyer-aux-inscrits
 * GET /api/evenements (pour liste déroulante)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaPaperPlane, 
  FaUsers, 
  FaCalendar,
  FaArrowLeft,
  FaSpinner,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaEye
} from 'react-icons/fa';
import notificationService from '../../services/notificationService';
import evenementService from '../../services/evenementService';

const EnvoyerNotification = () => {
  
  // =====================================
  // ÉTATS DU COMPOSANT
  // =====================================
  
  const navigate = useNavigate();
  
  // Données du formulaire
  const [formData, setFormData] = useState({
    titre: '',
    message: '',
    type_envoi: 'tous', // 'tous' | 'inscrits'
    evenement_id: '' // ID de l'événement pour envoi ciblé OU lien
  });
  
  // Liste des événements (pour sélection)
  const [evenements, setEvenements] = useState([]);
  
  // États UI
  const [loading, setLoading] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [touched, setTouched] = useState({});
  
  // Statistiques
  const [estimatedRecipients, setEstimatedRecipients] = useState(0);
  
  // =====================================
  // EFFETS
  // =====================================
  
  /**
   * Charger la liste des événements au montage
   */
  useEffect(() => {
    loadEvenements();
  }, []);
  
  /**
   * Mettre à jour le nombre estimé de destinataires
   */
  useEffect(() => {
    updateEstimatedRecipients();
  }, [formData.type_envoi, formData.evenement_id, evenements]);
  
  // =====================================
  // FONCTIONS DE CHARGEMENT
  // =====================================
  
  /**
   * Charger la liste des événements actifs
   */
  const loadEvenements = async () => {
    setLoadingEvents(true);
    
    try {
      const response = await evenementService.getEvenements({
        per_page: 100, // Charger tous les événements
        statut: 'actif'
      });
      
      setEvenements(response.data);
      console.log(`✅ ${response.data.length} événement(s) chargé(s)`);
      
    } catch (error) {
      console.error('❌ Erreur chargement événements:', error);
    } finally {
      setLoadingEvents(false);
    }
  };
  
  /**
   * Calculer le nombre estimé de destinataires
   */
  const updateEstimatedRecipients = () => {
    if (formData.type_envoi === 'tous') {
      // Tous les utilisateurs (à obtenir via une API stats)
      setEstimatedRecipients(150); // Valeur par défaut
    } else if (formData.type_envoi === 'inscrits' && formData.evenement_id) {
      // Nombre d'inscrits à l'événement sélectionné
      const selectedEvent = evenements.find(
        e => e.id === parseInt(formData.evenement_id)
      );
      setEstimatedRecipients(selectedEvent?.nombre_inscrits || 0);
    } else {
      setEstimatedRecipients(0);
    }
  };
  
  // =====================================
  // GESTION DU FORMULAIRE
  // =====================================
  
  /**
   * Gérer les changements dans les champs
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur du champ
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  /**
   * Gérer le blur (perte de focus)
   */
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };
  
  /**
   * Validation du formulaire
   */
  const validateForm = () => {
    const newErrors = {};
    
    // Titre obligatoire
    if (!formData.titre.trim()) {
      newErrors.titre = 'Le titre est obligatoire';
    } else if (formData.titre.length < 5) {
      newErrors.titre = 'Le titre doit contenir au moins 5 caractères';
    } else if (formData.titre.length > 100) {
      newErrors.titre = 'Le titre ne peut pas dépasser 100 caractères';
    }
    
    // Message obligatoire
    if (!formData.message.trim()) {
      newErrors.message = 'Le message est obligatoire';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Le message doit contenir au moins 10 caractères';
    } else if (formData.message.length > 500) {
      newErrors.message = 'Le message ne peut pas dépasser 500 caractères';
    }
    
    // Événement obligatoire si envoi aux inscrits
    if (formData.type_envoi === 'inscrits' && !formData.evenement_id) {
      newErrors.evenement_id = 'Veuillez sélectionner un événement';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  /**
   * Soumettre le formulaire
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!validateForm()) {
      console.log('❌ Validation échouée');
      return;
    }
    
    setLoading(true);
    setSuccess('');
    setErrors({});
    
    try {
      let response;
      
      // Préparer les données
      const notificationData = {
        titre: formData.titre,
        message: formData.message,
        evenement_id: formData.evenement_id || null
      };
      
      // Envoyer selon le type
      if (formData.type_envoi === 'tous') {
        console.log('📢 Envoi à tous les utilisateurs...');
        response = await notificationService.envoyerATous(notificationData);
      } else {
        console.log(`📨 Envoi aux inscrits de l'événement ${formData.evenement_id}...`);
        response = await notificationService.envoyerAuxInscrits(
          formData.evenement_id,
          notificationData
        );
      }
      
      // Succès
      setSuccess(
        `✅ Notification envoyée avec succès à ${response.count} utilisateur(s) !`
      );
      
      // Réinitialiser le formulaire après 2 secondes
      setTimeout(() => {
        setFormData({
          titre: '',
          message: '',
          type_envoi: 'tous',
          evenement_id: ''
        });
        setTouched({});
      }, 2000);
      
    } catch (error) {
      console.error('❌ Erreur envoi:', error);
      setErrors({
        general: error.response?.data?.message || 'Erreur lors de l\'envoi'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // =====================================
  // COMPOSANTS DE RENDU
  // =====================================
  
  /**
   * Afficher la prévisualisation
   */
  const renderPreview = () => {
    if (!showPreview) return null;
    
    return (
      <div className="card border-primary mb-4">
        <div className="card-header bg-primary text-white">
          <h6 className="mb-0">
            <FaEye className="me-2" />
            Prévisualisation de la notification
          </h6>
        </div>
        <div className="card-body">
          <h5 className="card-title">{formData.titre || 'Titre de la notification'}</h5>
          <p className="card-text">{formData.message || 'Contenu du message...'}</p>
          
          <div className="mt-3">
            <small className="text-muted">
              <FaUsers className="me-1" />
              Sera envoyée à <strong>{estimatedRecipients}</strong> utilisateur(s)
            </small>
          </div>
          
          {formData.evenement_id && (
            <div className="mt-2">
              <small className="text-muted">
                <FaCalendar className="me-1" />
                Liée à l'événement : {
                  evenements.find(e => e.id === parseInt(formData.evenement_id))?.titre
                }
              </small>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // =====================================
  // RENDER PRINCIPAL
  // =====================================
  
  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 fade-in">
          <div>
            <h1 className="text-primary mb-2">
              <FaPaperPlane className="me-2" />
              Envoyer une Notification
            </h1>
            <p className="text-muted">
              Communiquez avec les utilisateurs du Magal Touba
            </p>
          </div>
          <button
            onClick={() => navigate('/notifications')}
            className="btn btn-outline-secondary"
          >
            <FaArrowLeft className="me-2" />
            Retour
          </button>
        </div>
        
        {/* Messages */}
        {errors.general && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <FaExclamationTriangle className="me-2" />
            {errors.general}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setErrors({})}
            ></button>
          </div>
        )}
        
        {success && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <FaCheck className="me-2" />
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="row">
            
            {/* Colonne formulaire */}
            <div className="col-lg-8">
              
              {/* Type d'envoi */}
              <div className="card border-0 shadow-sm mb-4 slide-up">
                <div className="card-header bg-transparent border-0 pt-4">
                  <h5 className="mb-0 text-primary">
                    <FaUsers className="me-2" />
                    Destinataires
                  </h5>
                </div>
                <div className="card-body p-4">
                  
                  <div className="row g-3">
                    <div className="col-md-6">
                      <input
                        type="radio"
                        className="btn-check"
                        name="type_envoi"
                        id="type-tous"
                        value="tous"
                        checked={formData.type_envoi === 'tous'}
                        onChange={handleInputChange}
                      />
                      <label
                        className="btn btn-outline-primary w-100 py-3"
                        htmlFor="type-tous"
                      >
                        <FaUsers className="d-block mb-2" size={24} />
                        <strong>Tous les utilisateurs</strong>
                        <br />
                        <small>Notification globale</small>
                      </label>
                    </div>
                    
                    <div className="col-md-6">
                      <input
                        type="radio"
                        className="btn-check"
                        name="type_envoi"
                        id="type-inscrits"
                        value="inscrits"
                        checked={formData.type_envoi === 'inscrits'}
                        onChange={handleInputChange}
                      />
                      <label
                        className="btn btn-outline-success w-100 py-3"
                        htmlFor="type-inscrits"
                      >
                        <FaCalendar className="d-block mb-2" size={24} />
                        <strong>Inscrits à un événement</strong>
                        <br />
                        <small>Notification ciblée</small>
                      </label>
                    </div>
                  </div>
                  
                  {/* Sélection événement (si type inscrits) */}
                  {formData.type_envoi === 'inscrits' && (
                    <div className="mt-3">
                      <label htmlFor="evenement_id" className="form-label fw-semibold">
                        Sélectionner un événement *
                      </label>
                      <select
                        id="evenement_id"
                        name="evenement_id"
                        className={`form-select form-select-lg ${
                          errors.evenement_id ? 'is-invalid' : ''
                        }`}
                        value={formData.evenement_id}
                        onChange={handleInputChange}
                        disabled={loading || loadingEvents}
                      >
                        <option value="">-- Choisir un événement --</option>
                        {evenements.map(event => (
                          <option key={event.id} value={event.id}>
                            {event.titre} ({event.nombre_inscrits || 0} inscrit(s))
                          </option>
                        ))}
                      </select>
                      {errors.evenement_id && (
                        <div className="invalid-feedback">{errors.evenement_id}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Contenu de la notification */}
              <div className="card border-0 shadow-sm mb-4 slide-up">
                <div className="card-header bg-transparent border-0 pt-4">
                  <h5 className="mb-0 text-primary">
                    <FaPaperPlane className="me-2" />
                    Contenu de la notification
                  </h5>
                </div>
                <div className="card-body p-4">
                  
                  {/* Titre */}
                  <div className="mb-4">
                    <label htmlFor="titre" className="form-label fw-semibold">
                      Titre de la notification *
                    </label>
                    <input
                      type="text"
                      id="titre"
                      name="titre"
                      className={`form-control form-control-lg ${
                        touched.titre ? (errors.titre ? 'is-invalid' : 'is-valid') : ''
                      }`}
                      placeholder="Ex: Changement d'horaire"
                      value={formData.titre}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('titre')}
                      disabled={loading}
                      maxLength={100}
                    />
                    {errors.titre && (
                      <div className="invalid-feedback">{errors.titre}</div>
                    )}
                    <small className="text-muted">
                      {formData.titre.length}/100 caractères
                    </small>
                  </div>
                  
                  {/* Message */}
                  <div className="mb-4">
                    <label htmlFor="message" className="form-label fw-semibold">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      className={`form-control ${
                        touched.message ? (errors.message ? 'is-invalid' : 'is-valid') : ''
                      }`}
                      rows="5"
                      placeholder="Écrivez votre message ici..."
                      value={formData.message}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('message')}
                      disabled={loading}
                      maxLength={500}
                    />
                    {errors.message && (
                      <div className="invalid-feedback">{errors.message}</div>
                    )}
                    <small className="text-muted">
                      {formData.message.length}/500 caractères
                    </small>
                  </div>
                  
                  {/* Lien événement optionnel */}
                  {formData.type_envoi === 'tous' && (
                    <div className="mb-3">
                      <label htmlFor="evenement_id_link" className="form-label fw-semibold">
                        Lier à un événement (optionnel)
                      </label>
                      <select
                        id="evenement_id_link"
                        name="evenement_id"
                        className="form-select"
                        value={formData.evenement_id}
                        onChange={handleInputChange}
                        disabled={loading || loadingEvents}
                      >
                        <option value="">-- Aucun événement lié --</option>
                        {evenements.map(event => (
                          <option key={event.id} value={event.id}>
                            {event.titre}
                          </option>
                        ))}
                      </select>
                      <small className="text-muted">
                        Les utilisateurs pourront accéder directement à l'événement
                      </small>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Sidebar - Résumé et actions */}
            <div className="col-lg-4">
              
              {/* Résumé */}
              <div className="card border-0 shadow-sm mb-4 zoom-in sticky-top" style={{ top: '20px' }}>
                <div className="card-header bg-transparent border-0 pt-4">
                  <h5 className="mb-0 text-primary">
                    📊 Résumé de l'envoi
                  </h5>
                </div>
                <div className="card-body p-4">
                  
                  {/* Statistiques */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">Type d'envoi</span>
                      <strong>
                        {formData.type_envoi === 'tous' ? 'Global' : 'Ciblé'}
                      </strong>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">Destinataires</span>
                      <span className="badge bg-primary fs-6">
                        {estimatedRecipients}
                      </span>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">Événement lié</span>
                      <strong>
                        {formData.evenement_id ? (
                          <FaCheck className="text-success" />
                        ) : (
                          <FaTimes className="text-muted" />
                        )}
                      </strong>
                    </div>
                  </div>
                  
                  <hr />
                  
                  {/* Bouton prévisualisation */}
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="btn btn-outline-info w-100 mb-3"
                    disabled={!formData.titre || !formData.message}
                  >
                    <FaEye className="me-2" />
                    {showPreview ? 'Masquer' : 'Prévisualiser'}
                  </button>
                  
                  {/* Bouton envoi */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 mb-2"
                    disabled={loading || estimatedRecipients === 0}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="fa-spin me-2" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="me-2" />
                        Envoyer la notification
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => navigate('/notifications')}
                    className="btn btn-outline-secondary w-100"
                    disabled={loading}
                  >
                    Annuler
                  </button>
                  
                  {/* Avertissement */}
                  <div className="alert alert-warning mt-3 py-2 mb-0">
                    <small>
                      ⚠️ L'envoi est immédiat et irréversible
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
        
        {/* Prévisualisation */}
        {renderPreview()}
      </div>
    </div>
  );
};

export default EnvoyerNotification;