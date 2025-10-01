// src/components/evenements/EvenementCard.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCalendar, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaClock,
  FaCheck,
  FaTimes,
  FaSpinner
} from 'react-icons/fa';
import evenementService from '../../services/evenementService';
import authService from '../../services/authService';

/**
 * Carte d'événement avec actions
 * 
 * Affiche :
 * - Informations essentielles de l'événement
 * - Statut d'inscription de l'utilisateur
 * - Actions d'inscription/désinscription
 * - Animations Bootstrap
 */
const EvenementCard = ({ evenement, onUpdate }) => {
  // =====================================
  // ÉTATS DU COMPOSANT
  // =====================================
  
  const [loading, setLoading] = useState(false);
  const [inscrit, setInscrit] = useState(evenement.utilisateur_inscrit || false);
  
  // =====================================
  // HELPERS
  // =====================================
  
  /**
   * Formater la date de l'événement
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  /**
   * Formater l'heure de l'événement
   */
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  /**
   * Vérifier si l'événement est passé
   */
  const isEventPasse = () => {
    return new Date(evenement.date_heure_iso) < new Date();
  };
  
  /**
   * Obtenir la classe CSS pour le statut
   */
  const getStatusClass = () => {
    if (isEventPasse()) return 'text-muted';
    if (evenement.est_complet) return 'text-danger';
    return 'text-success';
  };
  
  /**
   * Obtenir le texte du statut
   */
  const getStatusText = () => {
    if (isEventPasse()) return 'Terminé';
    if (evenement.est_complet) return 'Complet';
    return `${evenement.places_restantes || 'Illimité'} place(s) disponible(s)`;
  };
  
  // =====================================
  // GESTION DES INSCRIPTIONS
  // =====================================
  
  /**
   * Gérer l'inscription/désinscription
   */
  const handleInscriptionToggle = async () => {
    setLoading(true);
    
    try {
      if (inscrit) {
        // Se désinscrire
        const result = await evenementService.seDesinscrire(evenement.id);
        setInscrit(false);
        
        // Notifier le parent pour mettre à jour la liste
        if (onUpdate) {
          onUpdate({
            ...evenement,
            utilisateur_inscrit: false,
            nombre_inscrits: evenement.nombre_inscrits - 1,
            places_restantes: evenement.places_restantes + 1
          });
        }
        
        console.log('✅ Désinscription réussie');
      } else {
        // S'inscrire
        const result = await evenementService.sInscrire(evenement.id);
        setInscrit(true);
        
        // Mettre à jour les données
        if (onUpdate) {
          onUpdate({
            ...evenement,
            utilisateur_inscrit: true,
            nombre_inscrits: evenement.nombre_inscrits + 1,
            places_restantes: evenement.places_restantes - 1
          });
        }
        
        console.log('✅ Inscription réussie');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      // Afficher un message d'erreur à l'utilisateur
      alert(error.response?.data?.message || 'Erreur lors de l\'opération');
    } finally {
      setLoading(false);
    }
  };
  
  // =====================================
  // RENDER
  // =====================================
  
  return (
    <div className="col-lg-6 col-xl-4 mb-4">
      <div className="magal-card h-100 zoom-in">
        
        {/* Image de l'événement */}
        {evenement.image_url && (
          <img
            src={`http://localhost:8000${evenement.image_url}`}
            className="card-img-top"
            alt={evenement.titre}
            style={{ height: '200px', objectFit: 'cover' }}
            onError={(e) => {
              // Image de fallback si erreur de chargement
              e.target.src = '';
            }}
          />
        )}
        
        <div className="card-body d-flex flex-column">
          
          {/* Titre et description */}
          <h5 className="card-title text-magal-primary mb-2">
            {evenement.titre}
          </h5>
          
          <p className="card-text text-muted mb-3 flex-grow-1">
            {evenement.description.length > 120 
              ? evenement.description.substring(0, 120) + '...'
              : evenement.description
            }
          </p>
          
          {/* Informations pratiques */}
          <div className="mb-3">
            
            {/* Date et heure */}
            <div className="d-flex align-items-center mb-2">
              <FaCalendar className="text-magal-primary me-2" />
              <small className="text-muted">
                {formatDate(evenement.date_heure_iso)}
              </small>
            </div>
            
            <div className="d-flex align-items-center mb-2">
              <FaClock className="text-info me-2" />
              <small className="text-muted">
                {formatTime(evenement.date_heure_iso)}
              </small>
            </div>
            
            {/* Lieu */}
            <div className="d-flex align-items-center mb-2">
              <FaMapMarkerAlt className="text-warning me-2" />
              <small className="text-muted">{evenement.lieu}</small>
            </div>
            
            {/* Participants */}
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <FaUsers className="text-success me-2" />
                <small className="text-muted">
                  {evenement.nombre_inscrits} participant(s)
                </small>
              </div>
              
              {/* Statut */}
              <small className={getStatusClass()}>
                {getStatusText()}
              </small>
            </div>
          </div>
          
          {/* Actions */}
          <div className="mt-auto">
            
            {/* Badge d'inscription */}
            {inscrit && (
              <div className="alert alert-success py-2 mb-2" role="alert">
                <FaCheck className="me-1" />
                <small>Vous êtes inscrit(e)</small>
              </div>
            )}
            
            <div className="d-flex gap-2">
              
              {/* Bouton voir détails */}
              <Link 
                to={`/evenements/${evenement.id}`}
                className="btn btn-outline-magal-primary btn-sm flex-grow-1"
              >
                Voir détails
              </Link>
              
              {/* Bouton inscription/désinscription */}
              {!isEventPasse() && !evenement.est_complet && (
                <button
                  onClick={handleInscriptionToggle}
                  disabled={loading}
                  className={`btn btn-sm ${inscrit ? 'btn-outline-danger' : 'btn-magal-primary'}`}
                >
                  {loading ? (
                    <FaSpinner className="fa-spin" />
                  ) : inscrit ? (
                    <>
                      <FaTimes className="me-1" />
                      Se désinscrire
                    </>
                  ) : (
                    <>
                      <FaCheck className="me-1" />
                      S'inscrire
                    </>
                  )}
                </button>
              )}
              
              {/* Message si complet ou passé */}
              {(isEventPasse() || evenement.est_complet) && (
                <button className="btn btn-secondary btn-sm" disabled>
                  {isEventPasse() ? 'Terminé' : 'Complet'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvenementCard;