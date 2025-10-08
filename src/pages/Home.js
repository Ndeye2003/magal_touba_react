// src/pages/Home.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCalendar, 
  FaMapMarkerAlt, 
  FaBell, 
  FaUsers,
  FaArrowRight,
  FaStar
} from 'react-icons/fa';
import authService from '../services/authService';

/**
 * Page d'accueil avec design moderne et animations
 * 
 * Affichage conditionnel selon l'état d'authentification :
 * - Visiteur : Présentation de l'application
 * - Utilisateur connecté : Dashboard personnalisé
 */
const Home = () => {
  // =====================================
  // ÉTATS DU COMPOSANT
  // =====================================
  
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState({
    evenements: 0,
    inscriptions: 0,
    favoris: 0,
    notifications: 0
  });
  
  // =====================================
  // EFFETS
  // =====================================
  
  useEffect(() => {
    // Vérifier l'authentification
    const authenticated = authService.isAuthenticated();
    const currentUser = authService.getUser();
    
    setIsAuthenticated(authenticated);
    setUser(currentUser);
    
    if (authenticated) {
      loadUserStats();
    }
  }, []);
  
  /**
   * Charger les statistiques utilisateur
   * (Sera implémenté avec les vraies API plus tard)
   */
  const loadUserStats = async () => {
    // TODO: Appels API réels
    setStats({
      evenements: 12,
      inscriptions: 3,
      favoris: 7,
      notifications: 2
    });
  };
  
  // =====================================
  // RENDER POUR VISITEURS
  // =====================================
  
  const renderWelcomeSection = () => (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        
        {/* Hero Section */}
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="fade-in">
              <h1 className="display-4 fw-bold text-magal-primary mb-4">
                Bienvenue au Magal Touba 2026
              </h1>
              <p className="lead text-muted mb-4">
                Votre compagnon numérique pour vivre pleinement le Grand Magal de Touba. 
                Découvrez les événements, explorez les lieux saints et restez connecté 
                avec la communauté mouride.
              </p>
              
              <div className="d-flex flex-wrap gap-3">
                <Link to="/register" className="btn btn-magal-primary btn-lg pulse-btn">
                  Rejoignez-nous
                  <FaArrowRight className="ms-2" />
                </Link>
                <Link to="/login" className="btn btn-outline-success btn-lg">
                  Se connecter
                </Link>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6">
            <div className="text-center slide-up">
              <div className="display-1 mb-4">🕌</div>
              <p className="text-muted">
                "Celui qui visite Touba avec foi et sincérité, 
                sa visite équivaut à un pèlerinage à La Mecque"
              </p>
              <small className="text-success fw-semibold">- Cheikh Ahmadou Bamba</small>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="row mt-5 pt-5">
          <div className="col-12">
            <h2 className="text-center text-magal-primary mb-5">
              Fonctionnalités de l'Application
            </h2>
          </div>
          
          <div className="col-md-4 mb-4">
            <div className="magal-card text-center h-100 zoom-in">
              <div className="card-body p-4">
                <div className="text-magal-primary mb-3">
                  <FaCalendar size={48} />
                </div>
                <h5 className="card-title">Événements</h5>
                <p className="card-text text-muted">
                  Découvrez le programme complet du Magal : conférences, 
                  prières collectives, cérémonies spirituelles.
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-md-4 mb-4">
            <div className="magal-card text-center h-100 zoom-in" style={{ animationDelay: '0.2s' }}>
              <div className="card-body p-4">
                <div className="text-magal-primary mb-3">
                  <FaMapMarkerAlt size={48} />
                </div>
                <h5 className="card-title">Lieux Saints</h5>
                <p className="card-text text-muted">
                  Explorez la Grande Mosquée, les centres de santé, 
                  hébergements et tous les services utiles.
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-md-4 mb-4">
            <div className="magal-card text-center h-100 zoom-in" style={{ animationDelay: '0.4s' }}>
              <div className="card-body p-4">
                <div className="text-magal-primary mb-3">
                  <FaBell size={48} />
                </div>
                <h5 className="card-title">Notifications</h5>
                <p className="card-text text-muted">
                  Recevez les informations importantes en temps réel : 
                  changements d'horaires, alertes, annonces.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // =====================================
  // RENDER POUR UTILISATEURS CONNECTÉS
  // =====================================
  
  const renderDashboard = () => (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        
        {/* Welcome Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="magal-card fade-in">
              <div className="card-body p-4">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h2 className="text-magal-primary mb-2">
                      Assalamou Alaykoum, {user?.prenom} ! 🕌
                    </h2>
                    <p className="text-muted mb-0">
                      Bienvenue sur votre espace personnel Magal Touba 2026
                    </p>
                  </div>
                  <div className="col-md-4 text-end">
                    <div className="bg-success text-white rounded p-3">
                      <div className="h4 mb-0">Touba</div>
                      <small>Ville Sainte</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-3 col-sm-6 mb-3">
            <div className="magal-card slide-up">
              <div className="card-body text-center">
                <div className="text-primary mb-2">
                  <FaCalendar size={32} />
                </div>
                <div className="h4 mb-1">{stats.evenements}</div>
                <small className="text-muted">Événements disponibles</small>
              </div>
            </div>
          </div>
          
          <div className="col-md-3 col-sm-6 mb-3">
            <div className="magal-card slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="card-body text-center">
                <div className="text-success mb-2">
                  <FaUsers size={32} />
                </div>
                <div className="h4 mb-1">{stats.inscriptions}</div>
                <small className="text-muted">Mes inscriptions</small>
              </div>
            </div>
          </div>
          
          <div className="col-md-3 col-sm-6 mb-3">
            <div className="magal-card slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="card-body text-center">
                <div className="text-warning mb-2">
                  <FaStar size={32} />
                </div>
                <div className="h4 mb-1">{stats.favoris}</div>
                <small className="text-muted">Lieux favoris</small>
              </div>
            </div>
          </div>
          
          <div className="col-md-3 col-sm-6 mb-3">
            <div className="magal-card slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="card-body text-center">
                <div className="text-info mb-2">
                  <FaBell size={32} />
                </div>
                <div className="h4 mb-1">{stats.notifications}</div>
                <small className="text-muted">Notifications</small>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="row">
          <div className="col-md-8 mb-4">
            <div className="magal-card">
              <div className="card-header bg-transparent">
                <h5 className="mb-0 text-magal-primary">Actions Rapides</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Link 
                      to="/evenements" 
                      className="btn btn-outline-primary w-100 py-3 transition-all"
                    >
                      <FaCalendar className="mb-2 d-block" size={24} />
                      Explorer les Événements
                    </Link>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <Link 
                      to="/points-interet" 
                      className="btn btn-outline-success w-100 py-3 transition-all"
                    >
                      <FaMapMarkerAlt className="mb-2 d-block" size={24} />
                      Découvrir les Lieux
                    </Link>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <Link 
                      to="/mes-inscriptions" 
                      className="btn btn-outline-info w-100 py-3 transition-all"
                    >
                      <FaUsers className="mb-2 d-block" size={24} />
                      Mes Inscriptions
                    </Link>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <Link 
                      to="/mes-favoris" 
                      className="btn btn-outline-warning w-100 py-3 transition-all"
                    >
                      <FaStar className="mb-2 d-block" size={24} />
                      Mes Favoris
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-4 mb-4">
            <div className="magal-card">
              <div className="card-header bg-transparent">
                <h5 className="mb-0 text-magal-primary">Citation </h5>
              </div>
              <div className="card-body text-center">
                <blockquote className="blockquote">
                  <p className="mb-3">
                    "Prie Dieu comme si tu devais mourir demain,mais travail comme si tu ne devais jamais mourir"
                  </p>
                  <footer className="blockquote-footer">
                    <cite title="Source">Cheikh Ahmadou Bamba</cite>
                  </footer>
                </blockquote>
                
                <div className="text-center mt-4">
                  <span className="display-6">🤲</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // =====================================
  // RENDER PRINCIPAL
  // =====================================
  
  return isAuthenticated ? renderDashboard() : renderWelcomeSection();
};

export default Home;
