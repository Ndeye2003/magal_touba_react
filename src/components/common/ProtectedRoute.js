// src/components/common/ProtectedRoute.js

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../../services/authService';

/**
 * Composant pour protéger les routes authentifiées
 * 
 * Redirige vers la page de connexion si l'utilisateur
 * n'est pas authentifié, en mémorisant la page demandée
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const location = useLocation();
  
  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    // Rediriger vers login en sauvegardant la page demandée
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Si route admin uniquement, vérifier le rôle
  if (adminOnly) {
    const isAdmin = authService.isAdmin();
    if (!isAdmin) {
      // Rediriger vers l'accueil si pas admin
      return <Navigate to="/" replace />;
    }
  }
  
  // Utilisateur autorisé, afficher le contenu
  return children;
};

export default ProtectedRoute;