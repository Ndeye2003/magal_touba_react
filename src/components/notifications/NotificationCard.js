// src/components/notifications/NotificationCard.js

/**
 * ========================================
 * COMPOSANT CARD DE NOTIFICATION
 * ========================================
 * 
 * Ce composant affiche une notification individuelle avec :
 * - Icône selon le type (info, success, warning, danger)
 * - Titre et message
 * - Date d'envoi formatée
 * - Lien vers l'événement si applicable
 * - Actions : marquer comme lu, supprimer (admin)
 * - Badge "Non lu" si non lue
 * 
 * PROPS :
 * ------
 * @param {Object} notification - Objet notification de l'API
 * @param {Function} onUpdate - Callback après marquage comme lu
 * @param {Function} onDelete - Callback après suppression
 * 
 * STRUCTURE NOTIFICATION :
 * -----------------------
 * {
 *   id: 15,
 *   titre: "Nouvelle conférence",
 *   message: "Une conférence a été ajoutée au programme",
 *   evenement: {              // Nullable
 *     id: 5,
 *     titre: "Conférence sur Serigne Touba"
 *   },
 *   date_envoi: "2024-10-01 14:30:00",
 *   est_lu: false,            // Statut pour l'utilisateur connecté
 *   date_lu: null             // Date de lecture (nullable)
 * }
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBell, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaInfoCircle,
  FaClock,
  FaTrash,
  FaCalendar,
  FaSpinner
} from 'react-icons/fa';
import notificationService from '../../services/notificationService';
import authService from '../../services/authService';

const NotificationCard = ({ notification, onUpdate, onDelete }) => {
  
  // =====================================
  // ÉTATS DU COMPOSANT
  // =====================================
  
  const [loading, setLoading] = useState(false);
  const isAdmin = authService.isAdmin();
  
  // =====================================
  // HELPERS - FORMATAGE & STYLE
  // =====================================
  
  /**
   * Déterminer le type de notification depuis le contenu
   * (Comme la table n'a pas de champ 'type', on peut l'inférer)
   */
  const getNotificationType = () => {
    const titre = notification.titre.toLowerCase();
    const message = notification.message.toLowerCase();
    
    if (titre.includes('urgent') || message.includes('urgent') || 
        titre.includes('annul') || message.includes('annul')) {
      return 'danger';
    }
    if (titre.includes('rappel') || message.includes('rappel')) {
      return 'warning';
    }
    if (titre.includes('nouveau') || titre.includes('ajout') || 
        message.includes('nouveau')) {
      return 'success';
    }
    return 'info';
  };
  
  /**
   * Obtenir l'icône selon le type inféré
   */
  const getTypeIcon = () => {
    const type = getNotificationType();
    
    switch (type) {
      case 'info':
        return <FaInfoCircle className="text-info" size={24} />;
      case 'success':
        return <FaCheckCircle className="text-success" size={24} />;
      case 'warning':
        return <FaExclamationTriangle className="text-warning" size={24} />;
      case 'danger':
        return <FaExclamationTriangle className="text-danger" size={24} />;
      default:
        return <FaBell className="text-primary" size={24} />;
    }
  };
  
  /**
   * Obtenir la classe CSS de bordure selon le type
   */
  const getBorderClass = () => {
    const type = getNotificationType();
    
    switch (type) {
      case 'info': return 'border-info';
      case 'success': return 'border-success';
      case 'warning': return 'border-warning';
      case 'danger': return 'border-danger';
      default: return 'border-primary';
    }
  };
  
  /**
   * Formater la date de manière relative
   * "Il y a 5 min", "Il y a 2h", "Il y a 3j", ou date complète si ancienne
   * 
   * @param {string} dateString - Date ISO "2024-10-01 14:30:00"
   * @returns {string} Date formatée
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    // Calculs
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    // Formatage conditionnel
    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    
    // Date complète pour les anciennes notifications
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };
  
  // =====================================
  // GESTIONNAIRES D'ÉVÉNEMENTS
  // =====================================
  
  /**
   * Marquer la notification comme lue
   * Appelle l'API et met à jour l'état local via callback
   */
  const handleMarquerLue = async (e) => {
    e.stopPropagation(); // Empêcher la propagation du clic
    
    // Si déjà lue, ne rien faire
    if (notification.est_lu) {
      console.log('ℹ️ Notification déjà lue');
      return;
    }
    
    setLoading(true);
    
    try {
      // Appel API
      await notificationService.marquerCommeLue(notification.id);
      
      // Mettre à jour via callback parent
      if (onUpdate) {
        onUpdate({
          ...notification,
          est_lu: true,
          date_lu: new Date().toISOString()
        });
      }
      
      console.log('✅ Notification marquée comme lue');
      
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert('Impossible de marquer comme lu');
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Supprimer la notification (Admin uniquement)
   * Demande confirmation puis appelle l'API
   */
  const handleSupprimer = async (e) => {
    e.stopPropagation(); // Empêcher la propagation
    
    // Confirmation
    if (!window.confirm('Supprimer cette notification ?')) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Appel API
      await notificationService.supprimerNotification(notification.id);
      
      // Retirer de la liste via callback
      if (onDelete) {
        onDelete(notification.id);
      }
      
      console.log('✅ Notification supprimée');
      
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert('Impossible de supprimer la notification');
    } finally {
      setLoading(false);
    }
  };
  
  // =====================================
  // RENDER
  // =====================================
  
  return (
    <div 
      className={`card mb-3 border-start border-4 ${getBorderClass()} ${
        !notification.est_lu ? 'bg-light' : ''
      } transition-all`}
      style={{ 
        cursor: notification.est_lu ? 'default' : 'pointer',
        opacity: loading ? 0.6 : 1,
        transition: 'all 0.3s ease'
      }}
      onClick={!notification.est_lu ? handleMarquerLue : undefined}
    >
      <div className="card-body">
        <div className="row align-items-start">
          
          {/* Icône */}
          <div className="col-auto">
            {getTypeIcon()}
          </div>
          
          {/* Contenu */}
          <div className="col">
            
            {/* Header : Titre + Badge */}
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h6 className="mb-0 fw-bold">
                {notification.titre}
                {!notification.est_lu && (
                  <span className="badge bg-primary ms-2">Nouveau</span>
                )}
              </h6>
              
              {/* Actions */}
              <div className="d-flex gap-2">
                
                {/* Bouton marquer comme lu */}
                {!notification.est_lu && (
                  <button
                    onClick={handleMarquerLue}
                    className="btn btn-sm btn-outline-success"
                    disabled={loading}
                    title="Marquer comme lu"
                  >
                    {loading ? (
                      <FaSpinner className="fa-spin" size={12} />
                    ) : (
                      <FaCheckCircle size={14} />
                    )}
                  </button>
                )}
                
                {/* Bouton supprimer (admin) */}
                {isAdmin && (
                  <button
                    onClick={handleSupprimer}
                    className="btn btn-sm btn-outline-danger"
                    disabled={loading}
                    title="Supprimer"
                  >
                    <FaTrash size={12} />
                  </button>
                )}
              </div>
            </div>
            
            {/* Message */}
            <p className="text-muted mb-2" style={{ fontSize: '0.95rem' }}>
              {notification.message}
            </p>
            
            {/* Footer : Date + Événement lié */}
            <div className="d-flex justify-content-between align-items-center">
              
              {/* Date */}
              <small className="text-muted">
                <FaClock className="me-1" />
                {formatDate(notification.date_envoi)}
              </small>
              
              {/* Lien vers événement si applicable */}
              {notification.evenement && (
                <Link 
                  to={`/evenements/${notification.evenement.id}`}
                  className="btn btn-sm btn-outline-primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaCalendar className="me-1" />
                  Voir l'événement
                </Link>
              )}
            </div>
            
            {/* Date de lecture (si lue) */}
            {notification.est_lu && notification.date_lu && (
              <div className="mt-2">
                <small className="text-success">
                  ✓ Lu le {new Date(notification.date_lu).toLocaleDateString('fr-FR')} à{' '}
                  {new Date(notification.date_lu).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;