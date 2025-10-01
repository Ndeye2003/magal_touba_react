// src/components/points-interet/PointInteretCard.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaMapMarkerAlt, 
  FaHeart, 
  FaRegHeart,
  FaPhone,
  FaUsers,
  FaSpinner
} from 'react-icons/fa';
import pointInteretService from '../../services/pointInteretService';
import { POINT_INTERET_TYPES, TYPE_COLORS } from '../../utils/constants';

/**
 * Carte de point d'intérêt avec système de favoris animé
 * 
 * Fonctionnalités :
 * - Affichage des informations essentielles
 * - Cœur animé pour ajouter/retirer des favoris
 * - Badge du type avec couleur
 * - Image avec fallback
 */
const PointInteretCard = ({ pointInteret, onUpdate }) => {
  // =====================================
  // ÉTATS DU COMPOSANT
  // =====================================
  
  const [loading, setLoading] = useState(false);
  const [enFavori, setEnFavori] = useState(pointInteret.est_dans_mes_favoris || false);
  const [nombreFavoris, setNombreFavoris] = useState(pointInteret.nombre_favoris || 0);
  
  // =====================================
  // HELPERS
  // =====================================
  
  /**
   * Obtenir la classe de couleur pour le badge de type
   */
  const getBadgeColor = () => {
    return TYPE_COLORS[pointInteret.type] || 'secondary';
  };
  
  /**
   * Obtenir l'icône selon le type
   */
  const getTypeIcon = () => {
    const icons = {
      mosquee: '🕌',
      sante: '🏥',
      hebergement: '🏨',
      restauration: '🍽️',
      transport: '🚌',
      autre: '📍'
    };
    return icons[pointInteret.type] || '📍';
  };
  
  // =====================================
  // GESTION DES FAVORIS
  // =====================================
  
  /**
   * Basculer le statut favori
   */
  const handleFavoriToggle = async (e) => {
    e.preventDefault(); // Empêcher la navigation
    e.stopPropagation();
    
    setLoading(true);
    
    try {
      if (enFavori) {
        // Retirer des favoris
        await pointInteretService.retirerDesFavoris(pointInteret.id);
        setEnFavori(false);
        setNombreFavoris(prev => Math.max(0, prev - 1));
        
        console.log('✅ Retiré des favoris');
      } else {
        // Ajouter aux favoris
        await pointInteretService.ajouterAuxFavoris(pointInteret.id);
        setEnFavori(true);
        setNombreFavoris(prev => prev + 1);
        
        console.log('✅ Ajouté aux favoris');
      }
      
      // Notifier le parent si nécessaire
      if (onUpdate) {
        onUpdate({
          ...pointInteret,
          est_dans_mes_favoris: !enFavori,
          nombre_favoris: !enFavori ? nombreFavoris + 1 : nombreFavoris - 1
        });
      }
      
    } catch (error) {
      console.error('❌ Erreur favori:', error);
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
      <Link 
        to={`/points-interet/${pointInteret.id}`}
        className="text-decoration-none"
      >
        <div className="magal-card h-100 zoom-in position-relative">
          
          {/* Badge du type */}
          <div className="position-absolute top-0 start-0 m-3" style={{ zIndex: 1 }}>
            <span className={`badge bg-${getBadgeColor()} fs-6`}>
              {getTypeIcon()} {pointInteret.type_libelle}
            </span>
          </div>
          
          {/* Bouton favori */}
          <div className="position-absolute top-0 end-0 m-3" style={{ zIndex: 1 }}>
            <button
              onClick={handleFavoriToggle}
              disabled={loading}
              className="btn btn-light rounded-circle shadow-sm"
              style={{ width: '40px', height: '40px' }}
              title={enFavori ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              {loading ? (
                <FaSpinner className="fa-spin text-muted" />
              ) : enFavori ? (
                <FaHeart className="text-danger" style={{ animation: 'pulse 0.3s' }} />
              ) : (
                <FaRegHeart className="text-muted" />
              )}
            </button>
          </div>
          
          {/* Image du lieu */}
          {pointInteret.image_url && (
            <img
              src={pointInteret.image_url}
              className="card-img-top"
              alt={pointInteret.nom}
              style={{ height: '200px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          
          <div className="card-body">
            
            {/* Nom du lieu */}
            <h5 className="card-title text-magal-primary mb-2">
              {pointInteret.nom}
            </h5>
            
            {/* Description */}
            {pointInteret.description && (
              <p className="card-text text-muted mb-3">
                {pointInteret.description.length > 100 
                  ? pointInteret.description.substring(0, 100) + '...'
                  : pointInteret.description
                }
              </p>
            )}
            
            {/* Informations */}
            <div className="mb-3">
              
              {/* Adresse */}
              {pointInteret.adresse && (
                <div className="d-flex align-items-start mb-2">
                  <FaMapMarkerAlt className="text-warning me-2 mt-1" size={14} />
                  <small className="text-muted">{pointInteret.adresse}</small>
                </div>
              )}
              
              {/* Numéro d'urgence */}
              {pointInteret.numero_urgence && (
                <div className="d-flex align-items-center mb-2">
                  <FaPhone className="text-success me-2" size={14} />
                  <small className="text-muted">{pointInteret.numero_urgence}</small>
                </div>
              )}
              
              {/* Nombre de favoris */}
              <div className="d-flex align-items-center">
                <FaUsers className="text-info me-2" size={14} />
                <small className="text-muted">
                  {nombreFavoris} personne(s) aiment ce lieu
                </small>
              </div>
            </div>
            
            {/* Bouton voir détails */}
            <div className="d-grid">
              <button className="btn btn-outline-magal-primary btn-sm">
                Voir les détails
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PointInteretCard;