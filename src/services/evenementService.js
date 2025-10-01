// src/services/evenementService.js

import api from './api';

/**
 * Service pour la gestion des événements
 * 
 * Centralise toutes les opérations liées aux événements :
 * - CRUD des événements
 * - Inscriptions
 * - Filtres et recherche
 */

class EvenementService {
  
  // =====================================
  // CONSULTATION DES ÉVÉNEMENTS
  // =====================================
  
  /**
   * Récupérer la liste des événements avec filtres
   * @param {Object} params - Paramètres de filtrage
   * @returns {Promise} Liste des événements
   */
  async getEvenements(params = {}) {
    try {
      const response = await api.get('/evenements', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
      throw error;
    }
  }
  
  /**
   * Récupérer un événement par son ID
   * @param {number} id - ID de l'événement
   * @returns {Promise} Détails de l'événement
   */
  async getEvenement(id) {
    try {
      const response = await api.get(`/evenements/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'événement:', error);
      throw error;
    }
  }
  
  // =====================================
  // INSCRIPTIONS AUX ÉVÉNEMENTS
  // =====================================
  
  /**
   * S'inscrire à un événement
   * @param {number} evenementId - ID de l'événement
   * @returns {Promise} Résultat de l'inscription
   */
  async sInscrire(evenementId) {
    try {
      const response = await api.post(`/evenements/${evenementId}/inscription`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  }
  
  /**
   * Se désinscrire d'un événement
   * @param {number} evenementId - ID de l'événement
   * @returns {Promise} Résultat de la désinscription
   */
  async seDesinscrire(evenementId) {
    try {
      const response = await api.delete(`/evenements/${evenementId}/inscription`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la désinscription:', error);
      throw error;
    }
  }
  
  /**
   * Récupérer les inscriptions de l'utilisateur connecté
   * @returns {Promise} Liste des inscriptions
   */
  async getMesInscriptions() {
    try {
      const response = await api.get('/mes-inscriptions');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des inscriptions:', error);
      throw error;
    }
  }
  
  // =====================================
  // GESTION ADMIN (CRUD)
  // =====================================
  
  /**
   * Créer un nouvel événement (Admin)
   * @param {Object} evenementData - Données de l'événement
   * @returns {Promise} Événement créé
   */
  async creerEvenement(evenementData) {
    try {
      const response = await api.post('/evenements', evenementData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement:', error);
      throw error;
    }
  }
  
  /**
   * Modifier un événement (Admin)
   * @param {number} id - ID de l'événement
   * @param {Object} evenementData - Nouvelles données
   * @returns {Promise} Événement modifié
   */
  async modifierEvenement(id, evenementData) {
    try {
      const response = await api.put(`/evenements/${id}`, evenementData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la modification de l\'événement:', error);
      throw error;
    }
  }
  
  /**
   * Supprimer un événement (Admin)
   * @param {number} id - ID de l'événement
   * @returns {Promise} Confirmation de suppression
   */
  async supprimerEvenement(id) {
    try {
      const response = await api.delete(`/evenements/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'événement:', error);
      throw error;
    }
  }
}

// Créer une instance unique
const evenementService = new EvenementService();
export default evenementService;