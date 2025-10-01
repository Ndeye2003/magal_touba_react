// src/pages/EvenementDetail.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaCalendar, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaClock,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaEdit,
  FaTrash,
  FaExclamationTriangle
} from 'react-icons/fa';

import evenementService from '../services/evenementService';
import authService from '../services/authService';

/**
 * Page de détail d'un événement
 * 
 * Fonctionnalités :
 * - Affichage complet des informations
 * - Inscription/désinscription
 * - Actions admin (modifier/supprimer)
 * - Liste des participants (pour admin)
 */
const EvenementDetail = () => {
  // =====================================
  // ÉTATS DU COMPOSANT
  // =====================================
  
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [evenement, setEvenement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [inscrit, setInscrit] = useState(false);
  
  const user = authService.getUser();
  const isAdmin = authService.isAdmin();
  
  // =====================================
  // EFFETS
  // =====================================
  
  useEffect(() => {
    loadEvenement();
  }, [id]);
  
  // =====================================
  // FONCTIONS DE CHARGEMENT
  // =====================================
  
  /**
   * Charger les détails de l'événement
   */
  const loadEvenement = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await evenementService.getEvenement(id);
      setEvenement(response.data);
      setInscrit(response.data.utilisateur_inscrit || false);
      
      console.log('✅ Détails événement chargés');
      
    } catch (error) {
      console.error('❌ Erreur chargement événement:', error);
      
      if (error.response?.status === 404) {
        setError('Cet événement n\'existe pas ou a été supprimé.');
      } else {
        setError(
          error.response?.data?.message || 
          'Erreur lors du chargement de l\'événement'
        );
      }
    } finally {
      setLoading(false);
    }
  };
  
  // =====================================
  // HELPERS
  // =====================================
  
  /**
   * Formater la date complète
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  /**
   * Vérifier si l'événement est passé
   */
  const isEventPasse = () => {
    if (!evenement) return false;
    return new Date(evenement.date_heure_iso) < new Date();
  };
  
  /**
   * Obtenir la classe CSS pour le statut
   */
  const getStatusBadgeClass = () => {
    if (isEventPasse()) return 'bg-secondary';
    if (evenement?.est_complet) return 'bg-danger';
    return 'bg-success';
  };
  
  /**
   * Obtenir le texte du statut
   */
  const getStatusText = () => {
    if (isEventPasse()) return 'Terminé';
    if (evenement?.est_complet) return 'Complet';
    return 'Ouvert aux inscriptions';
  };
  
  // =====================================
  // GESTION DES ACTIONS
  // =====================================
  
  /**
   * Gérer l'inscription/désinscription
   */
  const handleInscriptionToggle = async () => {
    setActionLoading(true);
    
    try {
      if (inscrit) {
        // Se désinscrire
        await evenementService.seDesinscrire(evenement.id);
        setInscrit(false);
        
        // Mettre à jour l'événement
        setEvenement(prev => ({
          ...prev,
          utilisateur_inscrit: false,
          nombre_inscrits: prev.nombre_inscrits - 1
        }));
        
        console.log('✅ Désinscription réussie');
      } else {
        // S'inscrire
        await evenementService.sInscrire(evenement.id);
        setInscrit(true);
        
        // Mettre à jour l'événement
        setEvenement(prev => ({
          ...prev,
          utilisateur_inscrit: true,
          nombre_inscrits: prev.nombre_inscrits + 1
        }));
        
        console.log('✅ Inscription réussie');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert(error.response?.data?.message || 'Erreur lors de l\'opération');
    } finally {
      setActionLoading(false);
    }
  };
  
  /**
   * Supprimer l'événement (Admin)
   */
  const handleSupprimer = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.')) {
      return;
    }
    
    setActionLoading(true);
    
    try {
      await evenementService.supprimerEvenement(evenement.id);
      console.log('✅ Événement supprimé');
      
      // Rediriger vers la liste
      navigate('/evenements', {
        state: { message: 'Événement supprimé avec succès' }
      });
      
    } catch (error) {
      console.error('❌ Erreur suppression:', error);
      alert(error.response?.data?.message || 'Erreur lors de la suppression');
    } finally {
      setActionLoading(false);
    }
  };
  
  // =====================================
  // COMPOSANTS DE RENDU
  // =====================================
  
  /**
   * Afficher le loader
   */
  const renderLoading = () => (
    <div className="text-center py-5">
      <FaSpinner className="fa-spin text-magal-primary mb-3" size={48} />
      <h5 className="text-muted">Chargement de l'événement...</h5>
    </div>
  );
  
  /**
   * Afficher l'erreur
   */
  const renderError = () => (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="alert alert-danger magal-alert text-center" role="alert">
          <FaExclamationTriangle className="mb-3" size={48} />
          <h4>Erreur</h4>
          <p>{error}</p>
          <div className="mt-3">
            <button 
              onClick={loadEvenement}
              className="btn btn-outline-danger me-2"
            >
              Réessayer
            </button>
            <Link to="/evenements" className="btn btn-magal-primary">
              Retour à la liste
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
  
  // =====================================
  // RENDER PRINCIPAL
  // =====================================
  
  if (loading) {
    return (
      <div className="bg-light min-vh-100 py-4">
        <div className="container">
          {renderLoading()}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-light min-vh-100 py-4">
        <div className="container">
          {renderError()}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4 fade-in">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/evenements" className="text-magal-primary">
                Événements
              </Link>
            </li>
            <li className="breadcrumb-item active">
              {evenement?.titre}
            </li>
          </ol>
        </nav>
        
        {/* Bouton retour */}
        <div className="mb-4">
          <Link 
            to="/evenements"
            className="btn btn-outline-magal-primary"
          >
            <FaArrowLeft className="me-2" />
            Retour à la liste
          </Link>
        </div>
        
        <div className="row">
          
          {/* Contenu principal */}
          <div className="col-lg-8">
            <div className="magal-card slide-up">
              
              {/* Image de l'événement */}
              {evenement.image_url && (
                <img
                  src={`http://localhost:8000${evenement.image_url}`}
                  className="card-img-top"
                  alt={evenement.titre}
                  style={{ height: '300px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              
              <div className="card-body">
                
                {/* Header */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h1 className="text-magal-primary mb-2">
                      {evenement.titre}
                    </h1>
                    <span className={`badge ${getStatusBadgeClass()} fs-6`}>
                      {getStatusText()}
                    </span>
                  </div>
                  
                  {/* Actions admin */}
                  {isAdmin && (
                    <div className="dropdown">
                      <button 
                        className="btn btn-outline-secondary dropdown-toggle"
                        data-bs-toggle="dropdown"
                      >
                        Actions
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <Link 
                            to={`/admin/evenements/${evenement.id}/modifier`}
                            className="dropdown-item"
                          >
                            <FaEdit className="me-2" />
                            Modifier
                          </Link>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <button 
                            className="dropdown-item text-danger"
                            onClick={handleSupprimer}
                            disabled={actionLoading}
                          >
                            <FaTrash className="me-2" />
                            Supprimer
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                
                {/* Description */}
                <div className="mb-4">
                  <h4 className="text-magal-primary mb-3">Description</h4>
                  <p className="text-muted" style={{ lineHeight: '1.8' }}>
                    {evenement.description}
                  </p>
                </div>
                
                {/* Liste des participants (Admin) */}
                {isAdmin && evenement.inscrits && (
                  <div className="mb-4">
                    <h4 className="text-magal-primary mb-3">
                      Participants inscrits ({evenement.inscrits.length})
                    </h4>
                    
                    {evenement.inscrits.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-sm">
                          <thead>
                            <tr>
                              <th>Nom</th>
                              <th>Prénom</th>
                              <th>Email</th>
                              <th>Date d'inscription</th>
                            </tr>
                          </thead>
                          <tbody>
                            {evenement.inscrits.map((participant) => (
                              <tr key={participant.id}>
                                <td>{participant.nom}</td>
                                <td>{participant.prenom}</td>
                                <td>{participant.email}</td>
                                <td>
                                  {new Date(participant.date_inscription).toLocaleDateString('fr-FR')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted">Aucun participant inscrit pour le moment.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="col-lg-4">
            
            {/* Informations pratiques */}
            <div className="magal-card mb-4 zoom-in">
              <div className="card-body">
                <h5 className="text-magal-primary mb-3">
                  Informations pratiques
                </h5>
                
                {/* Date et heure */}
                <div className="d-flex align-items-start mb-3">
                  <FaCalendar className="text-magal-primary me-3 mt-1" />
                  <div>
                    <div className="fw-semibold">Date et heure</div>
                    <div className="text-muted">
                      {formatDate(evenement.date_heure_iso)}
                    </div>
                  </div>
                </div>
                
                {/* Lieu */}
                <div className="d-flex align-items-start mb-3">
                  <FaMapMarkerAlt className="text-warning me-3 mt-1" />
                  <div>
                    <div className="fw-semibold">Lieu</div>
                    <div className="text-muted">{evenement.lieu}</div>
                  </div>
                </div>
                
                {/* Participants */}
                <div className="d-flex align-items-start mb-3">
                  <FaUsers className="text-success me-3 mt-1" />
                  <div>
                    <div className="fw-semibold">Participants</div>
                    <div className="text-muted">
                      {evenement.nombre_inscrits} inscrit(s)
                      {evenement.capacite_max && (
                        <> sur {evenement.capacite_max} places</>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Places restantes */}
                {evenement.places_restantes !== null && (
                  <div className="alert alert-info py-2">
                    <small>
                      <strong>{evenement.places_restantes}</strong> place(s) restante(s)
                    </small>
                  </div>
                )}
              </div>
            </div>
            
            {/* Actions utilisateur */}
            <div className="magal-card">
              <div className="card-body">
                
                {/* Statut d'inscription */}
                {inscrit && (
                  <div className="alert alert-success mb-3" role="alert">
                    <FaCheck className="me-2" />
                    <strong>Vous êtes inscrit(e)</strong>
                  </div>
                )}
                
                {/* Bouton d'action */}
                {!isEventPasse() && !evenement.est_complet ? (
                  <button
                    onClick={handleInscriptionToggle}
                    disabled={actionLoading}
                    className={`btn w-100 ${inscrit ? 'btn-outline-danger' : 'btn-magal-primary'} pulse-btn`}
                  >
                    {actionLoading ? (
                      <>
                        <FaSpinner className="fa-spin me-2" />
                        {inscrit ? 'Désinscription...' : 'Inscription...'}
                      </>
                    ) : inscrit ? (
                      <>
                        <FaTimes className="me-2" />
                        Se désinscrire
                      </>
                    ) : (
                      <>
                        <FaCheck className="me-2" />
                        S'inscrire à cet événement
                      </>
                    )}
                  </button>
                ) : (
                  <div className="alert alert-secondary text-center mb-0">
                    {isEventPasse() ? (
                      <>
                        <FaClock className="me-2" />
                        Événement terminé
                      </>
                    ) : (
                      <>
                        <FaUsers className="me-2" />
                        Événement complet
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvenementDetail;