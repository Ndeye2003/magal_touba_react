// src/pages/Notifications.js

/**
 * ========================================
 * PAGE DES NOTIFICATIONS UTILISATEUR
 * ========================================
 * 
 * Cette page affiche toutes les notifications de l'utilisateur connecté
 * avec les fonctionnalités suivantes :
 * 
 * FONCTIONNALITÉS :
 * ----------------
 * ✅ Liste paginée des notifications
 * ✅ Filtres : Toutes / Non lues / Lues
 * ✅ Bouton "Tout marquer comme lu"
 * ✅ Compteur de notifications non lues
 * ✅ Animation au chargement
 * ✅ Marquage individuel comme lu
 * ✅ Gestion des états vides
 * ✅ Gestion des erreurs
 * 
 * STRUCTURE DE L'API :
 * -------------------
 * GET /api/notifications?statut=non-lues&page=1
 * 
 * Réponse :
 * {
 *   data: [ { id, titre, message, evenement, date_envoi, est_lu, date_lu } ],
 *   pagination: { current_page, total, per_page, last_page }
 * }
 */

import React, { useState, useEffect } from 'react';
import { 
  FaBell, 
  FaSpinner, 
  FaExclamationTriangle,
  FaCheckCircle,
  FaFilter,
  FaInbox
} from 'react-icons/fa';
import notificationService from '../services/notificationService';
import NotificationCard from '../components/notifications/NotificationCard';

const Notifications = () => {
  
  // =====================================
  // ÉTATS DU COMPOSANT
  // =====================================
  
  // Données
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Pagination
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  });
  
  // Filtres
  const [activeFilter, setActiveFilter] = useState('toutes'); // 'toutes' | 'non-lues' | 'lues'
  const [currentPage, setCurrentPage] = useState(1);
  
  // États UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [markingAllRead, setMarkingAllRead] = useState(false);
  
  // =====================================
  // EFFETS - CHARGEMENT DES DONNÉES
  // =====================================
  
  /**
   * Charger les notifications au montage et quand filtres changent
   */
  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, [activeFilter, currentPage]);
  
  /**
   * Charger les notifications depuis l'API
   */
  const loadNotifications = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Préparer les paramètres
      const params = {
        page: currentPage,
        per_page: 10
      };
      
      // Ajouter le filtre de statut si nécessaire
      if (activeFilter !== 'toutes') {
        params.statut = activeFilter;
      }
      
      console.log('📥 Chargement des notifications...', params);
      
      // Appel API
      const response = await notificationService.getNotifications(params);
      
      setNotifications(response.data);
      setPagination(response.pagination);
      
      console.log(`✅ ${response.data.length} notification(s) chargée(s)`);
      
    } catch (error) {
      console.error('❌ Erreur chargement notifications:', error);
      setError(
        error.response?.data?.message || 
        'Erreur lors du chargement des notifications'
      );
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Charger le compteur de notifications non lues
   */
  const loadUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.count);
      
      console.log(`🔔 ${response.count} notification(s) non lue(s)`);
    } catch (error) {
      console.error('❌ Erreur compteur:', error);
    }
  };
  
  // =====================================
  // GESTIONNAIRES D'ÉVÉNEMENTS
  // =====================================
  
  /**
   * Changer le filtre actif
   */
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1); // Reset à la page 1
  };
  
  /**
   * Changer de page
   */
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  /**
   * Marquer toutes les notifications comme lues
   */
  const handleMarquerToutesLues = async () => {
    if (!window.confirm('Marquer toutes les notifications comme lues ?')) {
      return;
    }
    
    setMarkingAllRead(true);
    
    try {
      const response = await notificationService.marquerToutesCommeLues();
      
      // Recharger les données
      await loadNotifications();
      await loadUnreadCount();
      
      console.log(`✅ ${response.count} notification(s) marquée(s)`);
      
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert('Erreur lors du marquage global');
    } finally {
      setMarkingAllRead(false);
    }
  };
  
  /**
   * Callback après mise à jour d'une notification
   */
  const handleNotificationUpdate = (updatedNotification) => {
    // Mettre à jour la notification dans la liste locale
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === updatedNotification.id ? updatedNotification : notif
      )
    );
    
    // Décrémenter le compteur si elle était non lue
    if (!updatedNotification.est_lu) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };
  
  /**
   * Callback après suppression d'une notification (Admin)
   */
  const handleNotificationDelete = (notificationId) => {
    // Retirer de la liste locale
    setNotifications(prev =>
      prev.filter(notif => notif.id !== notificationId)
    );
    
    // Recharger le compteur
    loadUnreadCount();
  };
  
  // =====================================
  // COMPOSANTS DE RENDU
  // =====================================
  
  /**
   * Afficher le loader pendant le chargement
   */
  const renderLoading = () => (
    <div className="text-center py-5">
      <FaSpinner className="fa-spin text-primary mb-3" size={48} />
      <h5 className="text-muted">Chargement des notifications...</h5>
    </div>
  );
  
  /**
   * Afficher l'erreur
   */
  const renderError = () => (
    <div className="alert alert-danger magal-alert" role="alert">
      <FaExclamationTriangle className="me-2" />
      {error}
      <div className="mt-2">
        <button 
          onClick={loadNotifications}
          className="btn btn-outline-danger btn-sm"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
  
  /**
   * Afficher le message "aucune notification"
   */
  const renderEmpty = () => (
    <div className="text-center py-5">
      <div className="display-1 mb-3">
        <FaInbox className="text-muted" />
      </div>
      <h4 className="text-muted mb-3">Aucune notification</h4>
      <p className="text-muted mb-4">
        {activeFilter === 'non-lues' 
          ? 'Vous avez tout lu ! 🎉'
          : activeFilter === 'lues'
          ? 'Aucune notification lue pour le moment'
          : 'Vous n\'avez pas encore de notifications'
        }
      </p>
      
      {activeFilter !== 'toutes' && (
        <button 
          onClick={() => handleFilterChange('toutes')}
          className="btn btn-outline-primary"
        >
          Voir toutes les notifications
        </button>
      )}
    </div>
  );
  
  /**
   * Afficher la pagination
   */
  const renderPagination = () => {
    if (pagination.last_page <= 1) return null;
    
    return (
      <nav className="d-flex justify-content-center mt-4">
        <ul className="pagination">
          
          {/* Bouton précédent */}
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button 
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Précédent
            </button>
          </li>
          
          {/* Pages */}
          {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(page => (
            <li 
              key={page}
              className={`page-item ${page === currentPage ? 'active' : ''}`}
            >
              <button 
                className="page-link"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            </li>
          ))}
          
          {/* Bouton suivant */}
          <li className={`page-item ${currentPage === pagination.last_page ? 'disabled' : ''}`}>
            <button 
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.last_page}
            >
              Suivant
            </button>
          </li>
        </ul>
      </nav>
    );
  };
  
  // =====================================
  // RENDER PRINCIPAL
  // =====================================
  
  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        
        {/* Header */}
        <div className="row mb-4">
          <div className="col-md-8">
            <h1 className="text-primary mb-2 fade-in">
              <FaBell className="me-2" />
              Mes Notifications
            </h1>
            <p className="text-muted">
              Restez informé des actualités du Magal Touba 2024
            </p>
          </div>
          
          {/* Compteur + Actions */}
          <div className="col-md-4 text-md-end">
            {unreadCount > 0 && (
              <div className="mb-2">
                <span className="badge bg-danger fs-6">
                  {unreadCount} non lue(s)
                </span>
              </div>
            )}
            
            {notifications.length > 0 && unreadCount > 0 && (
              <button
                onClick={handleMarquerToutesLues}
                className="btn btn-outline-success btn-sm"
                disabled={markingAllRead}
              >
                {markingAllRead ? (
                  <>
                    <FaSpinner className="fa-spin me-2" />
                    Marquage...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="me-2" />
                    Tout marquer comme lu
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        
        {/* Filtres */}
        <div className="card border-0 shadow-sm mb-4 slide-up">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="mb-0 text-primary">
                <FaFilter className="me-2" />
                Filtrer les notifications
              </h6>
              
              <span className="badge bg-secondary">
                {pagination.total} notification(s)
              </span>
            </div>
            
            <div className="btn-group w-100" role="group">
              <button
                type="button"
                className={`btn ${activeFilter === 'toutes' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => handleFilterChange('toutes')}
              >
                Toutes
              </button>
              <button
                type="button"
                className={`btn ${activeFilter === 'non-lues' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => handleFilterChange('non-lues')}
              >
                Non lues
                {unreadCount > 0 && (
                  <span className="badge bg-danger ms-2">{unreadCount}</span>
                )}
              </button>
              <button
                type="button"
                className={`btn ${activeFilter === 'lues' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => handleFilterChange('lues')}
              >
                Lues
              </button>
            </div>
          </div>
        </div>
        
        {/* Contenu principal */}
        {loading ? (
          renderLoading()
        ) : error ? (
          renderError()
        ) : notifications.length === 0 ? (
          renderEmpty()
        ) : (
          <>
            {/* Liste des notifications */}
            <div className="zoom-in">
              {notifications.map((notification, index) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onUpdate={handleNotificationUpdate}
                  onDelete={handleNotificationDelete}
                  style={{ animationDelay: `${index * 0.05}s` }}
                />
              ))}
            </div>
            
            {/* Pagination */}
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};

export default Notifications;