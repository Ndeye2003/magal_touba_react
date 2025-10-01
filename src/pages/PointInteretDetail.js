// src/pages/PointInteretDetail.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaMapMarkerAlt, 
  FaPhone,
  FaUsers,
  FaHeart,
  FaRegHeart,
  FaSpinner,
  FaEdit,
  FaTrash,
  FaExclamationTriangle
} from 'react-icons/fa';

import pointInteretService from '../services/pointInteretService';
import authService from '../services/authService';
import { TYPE_COLORS } from '../utils/constants';

/**
 * Page de détail d'un point d'intérêt
 * 
 * Fonctionnalités :
 * - Affichage complet des informations
 * - Gestion favoris
 * - Actions admin (modifier/supprimer)
 * - Liste des utilisateurs qui aiment (admin)
 */
const PointInteretDetail = () => {
  
  // =====================================
  // ÉTATS DU COMPOSANT
  // =====================================
  
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [pointInteret, setPointInteret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [enFavori, setEnFavori] = useState(false);
  
  const isAdmin = authService.isAdmin();
  
  // =====================================
  // EFFETS
  // =====================================
  
  useEffect(() => {
    loadPointInteret();
  }, [id]);
  
  // =====================================
  // CHARGEMENT
  // =====================================
  
  const loadPointInteret = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await pointInteretService.getPointInteret(id);
      setPointInteret(response.data);
      setEnFavori(response.data.est_dans_mes_favoris || false);
      
      console.log('✅ Détails chargés');
      
    } catch (error) {
      console.error('❌ Erreur:', error);
      
      if (error.response?.status === 404) {
        setError('Ce lieu n\'existe pas ou a été supprimé.');
      } else {
        setError(error.response?.data?.message || 'Erreur de chargement');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // =====================================
  // HELPERS
  // =====================================
  
  const getBadgeColor = () => {
    return TYPE_COLORS[pointInteret?.type] || 'secondary';
  };
  
  const getTypeIcon = () => {
    const icons = {
      mosquee: '🕌',
      sante: '🏥',
      hebergement: '🏨',
      restauration: '🍽️',
      transport: '🚌',
      autre: '📍'
    };
    return icons[pointInteret?.type] || '📍';
  };
  
  // =====================================
  // ACTIONS
  // =====================================
  
  const handleFavoriToggle = async () => {
    setActionLoading(true);
    
    try {
      if (enFavori) {
        await pointInteretService.retirerDesFavoris(pointInteret.id);
        setEnFavori(false);
        setPointInteret(prev => ({
          ...prev,
          nombre_favoris: Math.max(0, prev.nombre_favoris - 1)
        }));
      } else {
        await pointInteretService.ajouterAuxFavoris(pointInteret.id);
        setEnFavori(true);
        setPointInteret(prev => ({
          ...prev,
          nombre_favoris: prev.nombre_favoris + 1
        }));
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur');
    } finally {
      setActionLoading(false);
    }
  };
  
  const handleSupprimer = async () => {
    if (!window.confirm('Supprimer ce lieu ?')) return;
    
    setActionLoading(true);
    
    try {
      await pointInteretService.supprimerPointInteret(pointInteret.id);
      navigate('/points-interet', {
        state: { message: 'Lieu supprimé' }
      });
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur');
    } finally {
      setActionLoading(false);
    }
  };
  
  // =====================================
  // RENDER
  // =====================================
  
  if (loading) {
    return (
      <div className="bg-light min-vh-100 py-4">
        <div className="container">
          <div className="text-center py-5">
            <FaSpinner className="fa-spin text-magal-primary mb-3" size={48} />
            <h5 className="text-muted">Chargement...</h5>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-light min-vh-100 py-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="alert alert-danger magal-alert text-center">
                <FaExclamationTriangle className="mb-3" size={48} />
                <h4>Erreur</h4>
                <p>{error}</p>
                <div className="mt-3">
                  <button 
                    onClick={loadPointInteret}
                    className="btn btn-outline-danger me-2"
                  >
                    Réessayer
                  </button>
                  <Link to="/points-interet" className="btn btn-magal-primary">
                    Retour
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        
        {/* Breadcrumb */}
        <nav className="mb-4 fade-in">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/points-interet" className="text-magal-primary">
                Points d'intérêt
              </Link>
            </li>
            <li className="breadcrumb-item active">
              {pointInteret?.nom}
            </li>
          </ol>
        </nav>
        
        {/* Bouton retour */}
        <div className="mb-4">
          <Link 
            to="/points-interet"
            className="btn btn-outline-magal-primary"
          >
            <FaArrowLeft className="me-2" />
            Retour
          </Link>
        </div>
        
        <div className="row">
          
          {/* Contenu principal */}
          <div className="col-lg-8">
            <div className="magal-card slide-up">
              
              {/* Image */}
              {pointInteret.image_url && (
                <img
                  src={pointInteret.image_url}
                  className="card-img-top"
                  alt={pointInteret.nom}
                  style={{ height: '300px', objectFit: 'cover' }}
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
              
              <div className="card-body">
                
                {/* Header */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h1 className="text-magal-primary mb-2">
                      {getTypeIcon()} {pointInteret.nom}
                    </h1>
                    <span className={`badge bg-${getBadgeColor()} fs-6`}>
                      {pointInteret.type_libelle}
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
                            to={`/admin/points-interet/${pointInteret.id}/modifier`}
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
                {pointInteret.description && (
                  <div className="mb-4">
                    <h4 className="text-magal-primary mb-3">Description</h4>
                    <p className="text-muted" style={{ lineHeight: '1.8' }}>
                      {pointInteret.description}
                    </p>
                  </div>
                )}
                
                {/* Liste utilisateurs (Admin) */}
                {isAdmin && pointInteret.utilisateurs_favoris && (
                  <div className="mb-4">
                    <h4 className="text-magal-primary mb-3">
                      Utilisateurs qui aiment ({pointInteret.utilisateurs_favoris.length})
                    </h4>
                    
                    {pointInteret.utilisateurs_favoris.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-sm">
                          <thead>
                            <tr>
                              <th>Nom</th>
                              <th>Prénom</th>
                              <th>Email</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pointInteret.utilisateurs_favoris.map((user) => (
                              <tr key={user.id}>
                                <td>{user.nom}</td>
                                <td>{user.prenom}</td>
                                <td>{user.email}</td>
                                <td>
                                  {new Date(user.date_ajout_favoris).toLocaleDateString('fr-FR')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted">Aucun utilisateur</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="col-lg-4">
            
            {/* Informations */}
            <div className="magal-card mb-4 zoom-in">
              <div className="card-body">
                <h5 className="text-magal-primary mb-3">
                  Informations pratiques
                </h5>
                
                {/* Adresse */}
                {pointInteret.adresse && (
                  <div className="d-flex align-items-start mb-3">
                    <FaMapMarkerAlt className="text-warning me-3 mt-1" />
                    <div>
                      <div className="fw-semibold">Adresse</div>
                      <div className="text-muted">{pointInteret.adresse}</div>
                    </div>
                  </div>
                )}
                
                {/* Téléphone */}
                {pointInteret.numero_urgence && (
                  <div className="d-flex align-items-start mb-3">
                    <FaPhone className="text-success me-3 mt-1" />
                    <div>
                      <div className="fw-semibold">Contact</div>
                      <a href={`tel:${pointInteret.numero_urgence}`} className="text-decoration-none">
                        {pointInteret.numero_urgence}
                      </a>
                    </div>
                  </div>
                )}
                
                {/* Popularité */}
                <div className="d-flex align-items-start">
                  <FaUsers className="text-info me-3 mt-1" />
                  <div>
                    <div className="fw-semibold">Popularité</div>
                    <div className="text-muted">
                      {pointInteret.nombre_favoris} personne(s)
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action favori */}
            <div className="magal-card">
              <div className="card-body">
                
                {enFavori && (
                  <div className="alert alert-success mb-3">
                    <FaHeart className="me-2" />
                    <strong>Dans vos favoris</strong>
                  </div>
                )}
                
                <button
                  onClick={handleFavoriToggle}
                  disabled={actionLoading}
                  className={`btn w-100 ${enFavori ? 'btn-outline-danger' : 'btn-magal-primary'} pulse-btn`}
                >
                  {actionLoading ? (
                    <>
                      <FaSpinner className="fa-spin me-2" />
                      {enFavori ? 'Retrait...' : 'Ajout...'}
                    </>
                  ) : enFavori ? (
                    <>
                      <FaHeart className="me-2" />
                      Retirer
                    </>
                  ) : (
                    <>
                      <FaRegHeart className="me-2" />
                      Ajouter aux favoris
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointInteretDetail;