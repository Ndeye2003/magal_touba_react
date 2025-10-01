// src/components/common/Navbar.js (VERSION MISE À JOUR)

/**
 * ========================================
 * NAVBAR AVEC BADGE DE NOTIFICATIONS
 * ========================================
 * 
 * Cette version mise à jour de la navbar inclut :
 * - Badge dynamique affichant le nombre de notifications non lues
 * - Rafraîchissement automatique toutes les 30 secondes
 * - Animation du badge quand nouvelles notifications
 * - Menu déroulant admin avec lien vers envoi notifications
 * 
 * CHANGEMENTS PAR RAPPORT À L'ANCIENNE VERSION :
 * ---------------------------------------------
 * ✅ Import de notificationService
 * ✅ État notificationCount mis à jour dynamiquement
 * ✅ useEffect pour polling automatique
 * ✅ Animation du badge
 * ✅ Lien admin vers envoi de notifications
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaCalendar, 
  FaMapMarkerAlt, 
  FaBell, 
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaPaperPlane
} from 'react-icons/fa';
import authService from '../../services/authService';
import notificationService from '../../services/notificationService';

const Navbar = () => {
  
  // =====================================
  // ÉTATS DU COMPOSANT
  // =====================================
  
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [previousCount, setPreviousCount] = useState(0);
  
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = authService.isAdmin();
  
  // =====================================
  // EFFETS
  // =====================================
  
  useEffect(() => {
    // Vérifier l'authentification au chargement
    checkAuthStatus();
    
    // Écouter les changements de route pour fermer le menu mobile
    setMobileMenuOpen(false);
  }, [location]);
  
  /**
   * Polling automatique des notifications toutes les 30 secondes
   */
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Charger immédiatement
    loadNotificationCount();
    
    // Puis toutes les 30 secondes
    const interval = setInterval(() => {
      loadNotificationCount();
    }, 30000); // 30 secondes
    
    // Cleanup
    return () => clearInterval(interval);
  }, [isAuthenticated]);
  
  // =====================================
  // FONCTIONS
  // =====================================
  
  /**
   * Vérifier le statut d'authentification
   */
  const checkAuthStatus = () => {
    const authenticated = authService.isAuthenticated();
    const currentUser = authService.getUser();
    
    setIsAuthenticated(authenticated);
    setUser(currentUser);
  };
  
  /**
   * Charger le nombre de notifications non lues
   * 
   * ENDPOINT : GET /api/notifications/non-lues/count
   * Réponse : { count: 5 }
   */
  const loadNotificationCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      
      // Sauvegarder l'ancien compteur pour détecter les changements
      setPreviousCount(notificationCount);
      setNotificationCount(response.count);
      
      console.log(`🔔 ${response.count} notification(s) non lue(s)`);
      
    } catch (error) {
      console.error('❌ Erreur chargement compteur notifications:', error);
      // Ne pas afficher d'erreur à l'utilisateur, juste logger
    }
  };
  
  /**
   * Gérer la déconnexion
   */
  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
      setNotificationCount(0);
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion');
    }
  };
  
  /**
   * Basculer le menu mobile
   */
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  /**
   * Vérifier si un lien est actif
   */
  const isActiveLink = (path) => {
    return location.pathname === path;
  };
  
  // =====================================
  // RENDU DES LIENS DE NAVIGATION
  // =====================================
  
  /**
   * Liens pour utilisateurs non connectés
   */
  const renderGuestLinks = () => (
    <div className="navbar-nav ms-auto">
      <Link 
        to="/login"
        className={`nav-link transition-all ${isActiveLink('/login') ? 'active' : ''}`}
      >
        <FaUser className="me-1" />
        Connexion
      </Link>
      <Link 
        to="/register"
        className="btn btn-outline-light btn-sm ms-2 transition-all"
      >
        S'inscrire
      </Link>
    </div>
  );
  
  /**
   * Liens pour utilisateurs connectés
   */
  const renderAuthenticatedLinks = () => (
    <div className="navbar-nav ms-auto align-items-center">
      
      {/* Navigation principale */}
      <Link 
        to="/"
        className={`nav-link transition-all ${isActiveLink('/') ? 'active' : ''}`}
      >
        <FaHome className="me-1" />
        Accueil
      </Link>
      
      <Link 
        to="/evenements"
        className={`nav-link transition-all ${isActiveLink('/evenements') ? 'active' : ''}`}
      >
        <FaCalendar className="me-1" />
        Événements
      </Link>
      
      <Link 
        to="/points-interet"
        className={`nav-link transition-all ${isActiveLink('/points-interet') ? 'active' : ''}`}
      >
        <FaMapMarkerAlt className="me-1" />
        Lieux
      </Link>
      
      {/* Notifications avec badge animé */}
      <Link 
        to="/notifications"
        className={`nav-link position-relative transition-all ${
          isActiveLink('/notifications') ? 'active' : ''
        }`}
      >
        <FaBell className="me-1" />
        
        {/* Badge de compteur */}
        {notificationCount > 0 && (
          <span 
            className={`position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger ${
              notificationCount > previousCount ? 'heart-animation' : ''
            }`}
            style={{
              animation: notificationCount > previousCount 
                ? 'heartBeat 0.8s ease-in-out' 
                : 'none'
            }}
          >
            {notificationCount > 9 ? '9+' : notificationCount}
            <span className="visually-hidden">notifications non lues</span>
          </span>
        )}
      </Link>
      
      {/* Menu utilisateur */}
      <div className="nav-item dropdown">
        <a 
          className="nav-link dropdown-toggle d-flex align-items-center"
          href="#"
          role="button"
          data-bs-toggle="dropdown"
        >
          <div 
            className="bg-success rounded-circle d-flex align-items-center justify-content-center me-2"
            style={{ width: '32px', height: '32px' }}
          >
            <span className="text-white fw-bold">
              {user?.prenom?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <span className="d-none d-md-inline">
            {user?.prenom} {user?.nom}
          </span>
        </a>
        
        <ul className="dropdown-menu dropdown-menu-end fade-in">
          <li>
            <Link to="/profile" className="dropdown-item">
              <FaUser className="me-2" />
              Mon Profil
            </Link>
          </li>
          <li>
            <Link to="/mes-inscriptions" className="dropdown-item">
              <FaCalendar className="me-2" />
              Mes Inscriptions
            </Link>
          </li>
          <li>
            <Link to="/mes-favoris" className="dropdown-item">
              <FaMapMarkerAlt className="me-2" />
              Mes Favoris
            </Link>
          </li>
          
          {/* Section Admin */}
          {isAdmin && (
            <>
              <li><hr className="dropdown-divider" /></li>
              <li className="dropdown-header">Administration</li>
              <li>
                <Link to="/admin/evenements/nouveau" className="dropdown-item">
                  <FaCalendar className="me-2" />
                  Créer un événement
                </Link>
              </li>
              <li>
                <Link to="/admin/points-interet/nouveau" className="dropdown-item">
                  <FaMapMarkerAlt className="me-2" />
                  Créer un lieu
                </Link>
              </li>
              <li>
                <Link to="/admin/notifications/envoyer" className="dropdown-item">
                  <FaPaperPlane className="me-2" />
                  Envoyer notification
                </Link>
              </li>
            </>
          )}
          
          <li><hr className="dropdown-divider" /></li>
          <li>
            <button 
              className="dropdown-item text-danger"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-2" />
              Se déconnecter
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
  
  // =====================================
  // RENDER PRINCIPAL
  // =====================================
  
  return (
    <nav className="navbar navbar-expand-lg magal-navbar sticky-top">
      <div className="container">
        
        {/* Logo/Brand */}
        <Link to="/" className="navbar-brand fw-bold text-white">
          <span className="me-2">🕌</span>
          Magal Touba 2024
        </Link>
        
        {/* Badge notification mobile (visible uniquement sur mobile) */}
        {isAuthenticated && notificationCount > 0 && (
          <Link 
            to="/notifications"
            className="btn btn-sm btn-light d-lg-none position-relative"
          >
            <FaBell />
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          </Link>
        )}
        
        {/* Bouton menu mobile */}
        <button
          className="navbar-toggler border-0 text-white"
          type="button"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        
        {/* Menu principal */}
        <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`}>
          {isAuthenticated ? renderAuthenticatedLinks() : renderGuestLinks()}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;