// src/services/api.js

import axios from 'axios';

/**
 * Configuration de base d'Axios pour notre API Laravel
 * 
 * Cette configuration centralise :
 * - L'URL de base de notre API
 * - Les headers communs
 * - La gestion automatique des tokens JWT
 * - Les intercepteurs pour les erreurs
 */
// URL de base de notre API Laravel

// const BASE_URL = 'http://localhost:8000/api';
const BASE_URL = 'https://magal-touba-service-main-wb2l6a.laravel.cloud/api';

// Créer une instance Axios avec configuration personnalisée
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // Timeout de 10 secondes
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// =====================================
// INTERCEPTEURS DE REQUÊTE
// =====================================

/**
 * Intercepteur qui s'exécute AVANT chaque requête
 * Il ajoute automatiquement le token JWT si disponible
 */
api.interceptors.request.use(
  (config) => {
    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem('magal_touba_token');
    
    if (token) {
      // Ajouter le token dans le header Authorization
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token ajouté à la requête:', config.url);
    }
    
    console.log('📤 Requête envoyée:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Erreur dans la requête:', error);
    return Promise.reject(error);
  }
);

// =====================================
// INTERCEPTEURS DE RÉPONSE
// =====================================

/**
 * Intercepteur qui s'exécute APRÈS chaque réponse
 * Il gère automatiquement les erreurs courantes
 */
api.interceptors.response.use(
  (response) => {
    // Réponse réussie (status 200-299)
    console.log('✅ Réponse reçue:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Erreur dans la réponse:', error.response?.status, error.config?.url);
    
    // Gestion des erreurs spécifiques
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Token expiré ou invalide
          console.log('🚫 Token invalide, redirection vers login');
          localStorage.removeItem('magal_touba_token');
          localStorage.removeItem('magal_touba_user');
          window.location.href = '/login';
          break;
          
        case 403:
          // Accès refusé
          console.log('🚫 Accès refusé');
          break;
          
        case 404:
          // Ressource non trouvée
          console.log('🔍 Ressource non trouvée');
          break;
          
        case 422:
          // Erreurs de validation
          console.log('📝 Erreurs de validation:', error.response.data.errors);
          break;
          
        case 500:
          // Erreur serveur
          console.log('💥 Erreur serveur');
          break;
          
        default:
          console.log('❓ Erreur inconnue:', error.response.status);
      }
    } else if (error.request) {
      // Pas de réponse du serveur (réseau, timeout...)
      console.error('🌐 Erreur réseau ou serveur inaccessible');
    }
    
    return Promise.reject(error);
  }
);

// =====================================
// FONCTIONS UTILITAIRES
// =====================================

/**
 * Définir le token d'authentification
 * @param {string} token - Token JWT
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('magal_touba_token', token);
    console.log('💾 Token sauvegardé');
  } else {
    localStorage.removeItem('magal_touba_token');
    console.log('🗑️ Token supprimé');
  }
};

/**
 * Obtenir le token d'authentification
 * @returns {string|null} Token JWT ou null
 */
export const getAuthToken = () => {
  return localStorage.getItem('magal_touba_token');
};

/**
 * Vérifier si l'utilisateur est connecté
 * @returns {boolean} True si connecté
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token; // Convertit en boolean
};

// Exporter l'instance configurée
export default api;