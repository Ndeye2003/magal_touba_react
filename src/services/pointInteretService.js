// src/services/pointInteretService.js

import api from './api';

/**
 * Service pour la gestion des points d'intérêt et favoris
 * 
 * Centralise toutes les opérations :
 * - CRUD des points d'intérêt
 * - Gestion des favoris
 * - Filtres et recherche
 */

class PointInteretService {
  
  // =====================================
  // CONSULTATION DES POINTS D'INTÉRÊT
  // =====================================
  
  /**
   * Récupérer la liste des points d'intérêt avec filtres
   */
  async getPointsInteret(params = {}) {
    try {
      const response = await api.get('/points-interet', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des points d\'intérêt:', error);
      throw error;
    }
  }
  
  /**
   * Récupérer un point d'intérêt par son ID
   */
  async getPointInteret(id) {
    try {
      const response = await api.get(`/points-interet/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du point d\'intérêt:', error);
      throw error;
    }
  }
  
  // =====================================
  // GESTION DES FAVORIS
  // =====================================
  
  /**
   * Ajouter un point d'intérêt aux favoris
   */
  async ajouterAuxFavoris(pointInteretId) {
    try {
      const response = await api.post(`/points-interet/${pointInteretId}/favori`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux favoris:', error);
      throw error;
    }
  }
  
  /**
   * Retirer un point d'intérêt des favoris
   */
  async retirerDesFavoris(pointInteretId) {
    try {
      const response = await api.delete(`/points-interet/${pointInteretId}/favori`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du retrait des favoris:', error);
      throw error;
    }
  }
  
  /**
   * Récupérer les favoris de l'utilisateur connecté
   */
  async getMesFavoris(params = {}) {
    try {
      const response = await api.get('/mes-favoris', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des favoris:', error);
      throw error;
    }
  }
  
  // =====================================
  // GESTION ADMIN (CRUD)
  // =====================================
  
  /**
   * Créer un nouveau point d'intérêt (Admin)
   */
  async creerPointInteret(pointData) {
    try {
      const response = await api.post('/points-interet', pointData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du point d\'intérêt:', error);
      throw error;
    }
  }
  
  /**
   * Modifier un point d'intérêt (Admin)
   */
  async modifierPointInteret(id, pointData) {
    try {
      const response = await api.put(`/points-interet/${id}`, pointData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la modification du point d\'intérêt:', error);
      throw error;
    }
  }
  
  /**
   * Supprimer un point d'intérêt (Admin)
   */
  async supprimerPointInteret(id) {
    try {
      const response = await api.delete(`/points-interet/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression du point d\'intérêt:', error);
      throw error;
    }
  }
}

// Instance unique
const pointInteretService = new PointInteretService();
export default pointInteretService;