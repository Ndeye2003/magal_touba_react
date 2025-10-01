// src/services/authService.js

import api, { setAuthToken } from './api';
import { AUTH_CONSTANTS } from '../utils/constants';

/**
 * Service d'authentification
 * 
 * Centralise toutes les opérations liées à l'authentification :
 * - Connexion/Déconnexion
 * - Inscription
 * - Gestion des tokens
 * - Informations utilisateur
 */

class AuthService {
  
  // =====================================
  // CONNEXION
  // =====================================
  
  /**
   * Connecter un utilisateur
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe
   * @returns {Promise} Promesse avec les données utilisateur
   */
  async login(email, password) {
    try {
      console.log('🔑 Tentative de connexion pour:', email);
      
      const response = await api.post('/auth/login', {
        email,
        password
      });
      
      const { user, access_token } = response.data;
      
      // Sauvegarder le token et les infos utilisateur
      this.setAuthData(user, access_token);
      
      console.log('✅ Connexion réussie pour:', user.email);
      return { user, token: access_token };
      
    } catch (error) {
      console.error('❌ Erreur de connexion:', error.response?.data?.message);
      throw this.handleAuthError(error);
    }
  }
  
  // =====================================
  // INSCRIPTION
  // =====================================
  
  /**
   * Inscrire un nouvel utilisateur
   * @param {Object} userData - Données d'inscription
   * @returns {Promise} Promesse avec les données utilisateur
   */
  async register(userData) {
    try {
      console.log('📝 Tentative d\'inscription pour:', userData.email);
      
      const response = await api.post('/auth/register', userData);
      
      const { user, access_token } = response.data;
      
      // Sauvegarder automatiquement après inscription
      this.setAuthData(user, access_token);
      
      console.log('✅ Inscription réussie pour:', user.email);
      return { user, token: access_token };
      
    } catch (error) {
      console.error('❌ Erreur d\'inscription:', error.response?.data);
      throw this.handleAuthError(error);
    }
  }
  
  // =====================================
  // DÉCONNEXION
  // =====================================
  
  /**
   * Déconnecter l'utilisateur
   */
  async logout() {
    try {
      // Notifier le serveur de la déconnexion
      await api.post('/auth/logout');
      console.log('👋 Déconnexion côté serveur réussie');
    } catch (error) {
      console.warn('⚠️ Erreur lors de la déconnexion serveur (pas grave)');
    }
    
    // Nettoyer les données locales dans tous les cas
    this.clearAuthData();
    console.log('🧹 Données d\'authentification nettoyées');
  }
  
  // =====================================
  // GESTION DES DONNÉES D'AUTH
  // =====================================
  
  /**
   * Sauvegarder les données d'authentification
   * @param {Object} user - Informations utilisateur
   * @param {string} token - Token JWT
   */
  setAuthData(user, token) {
    // Sauvegarder dans localStorage
    localStorage.setItem(AUTH_CONSTANTS.TOKEN_KEY, token);
    localStorage.setItem(AUTH_CONSTANTS.USER_KEY, JSON.stringify(user));
    
    // Configurer le token pour Axios
    setAuthToken(token);
    
    console.log('💾 Données d\'authentification sauvegardées');
  }
  
  /**
   * Nettoyer les données d'authentification
   */
  clearAuthData() {
    localStorage.removeItem(AUTH_CONSTANTS.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONSTANTS.USER_KEY);
    setAuthToken(null);
  }
  
  // =====================================
  // GETTERS
  // =====================================
  
  /**
   * Obtenir le token actuel
   * @returns {string|null} Token JWT ou null
   */
  getToken() {
    return localStorage.getItem(AUTH_CONSTANTS.TOKEN_KEY);
  }
  
  /**
   * Obtenir les informations utilisateur
   * @returns {Object|null} Objet utilisateur ou null
   */
  getUser() {
    const userJson = localStorage.getItem(AUTH_CONSTANTS.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }
  
  /**
   * Vérifier si l'utilisateur est connecté
   * @returns {boolean} True si connecté
   */
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }
  
  /**
   * Vérifier si l'utilisateur est admin
   * @returns {boolean} True si admin
   */
  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  }
  
  // =====================================
  // PROFIL UTILISATEUR
  // =====================================
  
  /**
   * Récupérer le profil utilisateur depuis le serveur
   * @returns {Promise} Profil utilisateur mis à jour
   */
  async getProfile() {
    try {
      const response = await api.get('/auth/profile');
      const user = response.data.user;
      
      // Mettre à jour les données locales
      localStorage.setItem(AUTH_CONSTANTS.USER_KEY, JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du profil');
      throw this.handleAuthError(error);
    }
  }
  
  /**
   * Rafraîchir le token JWT
   * @returns {Promise} Nouveau token
   */
  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh');
      const { access_token } = response.data;
      
      // Mettre à jour le token
      localStorage.setItem(AUTH_CONSTANTS.TOKEN_KEY, access_token);
      setAuthToken(access_token);
      
      console.log('🔄 Token rafraîchi avec succès');
      return access_token;
      
    } catch (error) {
      console.error('❌ Erreur lors du rafraîchissement du token');
      // En cas d'erreur, déconnecter l'utilisateur
      this.clearAuthData();
      throw error;
    }
  }
  
  // =====================================
  // GESTION D'ERREURS
  // =====================================
  
  /**
   * Traiter les erreurs d'authentification
   * @param {Error} error - Erreur reçue
   * @returns {Error} Erreur formatée
   */
  handleAuthError(error) {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          return new Error(data.message || 'Identifiants incorrects');
        case 422:
          // Erreurs de validation
          const validationErrors = data.errors || {};
          const firstError = Object.values(validationErrors)[0];
          return new Error(firstError ? firstError[0] : 'Données invalides');
        case 429:
          return new Error('Trop de tentatives. Réessayez plus tard.');
        default:
          return new Error(data.message || 'Erreur inconnue');
      }
    }
    
    return new Error('Erreur de connexion. Vérifiez votre internet.');
  }
}

// Créer une instance unique (Singleton)
const authService = new AuthService();
export default authService;