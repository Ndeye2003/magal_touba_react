// src/utils/constants.js

/**
 * Constantes utilisées dans toute l'application
 * 
 * Centraliser les constantes permet :
 * - D'éviter les erreurs de frappe
 * - De modifier facilement les valeurs
 * - D'avoir une source unique de vérité
 */

// =====================================
// CONSTANTES D'AUTHENTIFICATION
// =====================================

export const AUTH_CONSTANTS = {
  TOKEN_KEY: 'magal_touba_token',
  USER_KEY: 'magal_touba_user',
  TOKEN_EXPIRES_IN: 60 * 60 * 1000, // 1 heure en millisecondes
};

// =====================================
// TYPES D'ÉVÉNEMENTS
// =====================================

export const EVENEMENT_TYPES = {
  conference: 'Conférence',
  priere: 'Prière',
  ceremonie: 'Cérémonie',
  visite: 'Visite guidée',
  autre: 'Autre'
};

// =====================================
// TYPES DE POINTS D'INTÉRÊT
// =====================================

export const POINT_INTERET_TYPES = {
  mosquee: 'Mosquée',
  sante: 'Centre de santé',
  hebergement: 'Hébergement',
  restauration: 'Restauration',
  transport: 'Transport',
  autre: 'Autre'
};

// =====================================
// COULEURS POUR LES TYPES
// =====================================

export const TYPE_COLORS = {
  mosquee: 'success',      // Vert
  sante: 'danger',         // Rouge
  hebergement: 'primary',  // Bleu
  restauration: 'warning', // Jaune/Orange
  transport: 'info',       // Cyan
  autre: 'secondary'       // Gris
};

// =====================================
// MESSAGES D'ERREUR
// =====================================

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion. Vérifiez votre internet.',
  SERVER_ERROR: 'Erreur serveur. Réessayez plus tard.',
  UNAUTHORIZED: 'Session expirée. Veuillez vous reconnecter.',
  FORBIDDEN: 'Accès refusé.',
  NOT_FOUND: 'Ressource non trouvée.',
  VALIDATION_ERROR: 'Données invalides.'
};

// =====================================
// MESSAGES DE SUCCÈS
// =====================================

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Connexion réussie !',
  REGISTER_SUCCESS: 'Inscription réussie !',
  PROFILE_UPDATED: 'Profil mis à jour.',
  LOGOUT_SUCCESS: 'Déconnexion réussie.'
};

// =====================================
// ROUTES DE L'APPLICATION
// =====================================

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  EVENEMENTS: '/evenements',
  EVENEMENT_DETAIL: '/evenements/:id',
  POINTS_INTERET: '/points-interet',
  POINT_DETAIL: '/points-interet/:id',
  MES_FAVORIS: '/mes-favoris',
  MES_INSCRIPTIONS: '/mes-inscriptions',
  NOTIFICATIONS: '/notifications',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_EVENEMENTS: '/admin/evenements',
  ADMIN_POINTS: '/admin/points-interet',
  ADMIN_NOTIFICATIONS: '/admin/notifications'
};

// =====================================
// CONFIGURATION PAGINATION
// =====================================

export const PAGINATION = {
  DEFAULT_PER_PAGE: 10,
  MAX_PER_PAGE: 50
};