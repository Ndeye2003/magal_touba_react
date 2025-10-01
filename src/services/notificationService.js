// src/services/notificationService.js

/**
 * ========================================
 * SERVICE DE GESTION DES NOTIFICATIONS
 * ========================================
 * 
 * Ce service centralise toutes les interactions avec l'API Laravel
 * concernant les notifications du Magal Touba.
 * 
 * STRUCTURE DE LA BASE DE DONNÉES :
 * ---------------------------------
 * Table `notifications` :
 *   - id: Identifiant unique
 *   - titre: Titre de la notification
 *   - message: Contenu du message
 *   - evenement_id: ID de l'événement lié (nullable)
 *   - date_envoi: Date d'envoi de la notification
 * 
 * Table `notification_user` (Pivot Many-to-Many) :
 *   - notification_id: Référence vers la notification
 *   - user_id: Référence vers l'utilisateur
 *   - est_lu: Statut de lecture (boolean)
 *   - date_lu: Date de lecture (nullable)
 * 
 * FONCTIONNALITÉS :
 * ----------------
 * ✅ Lister les notifications de l'utilisateur connecté
 * ✅ Compter les notifications non lues
 * ✅ Marquer une notification comme lue
 * ✅ Marquer toutes les notifications comme lues
 * ✅ [ADMIN] Envoyer une notification à tous les utilisateurs
 * ✅ [ADMIN] Envoyer une notification aux inscrits d'un événement
 * ✅ [ADMIN] Supprimer une notification
 */

import api from './api';

class NotificationService {
  
  // =====================================
  // CONSULTATION DES NOTIFICATIONS
  // =====================================
  
  /**
   * Récupérer la liste des notifications de l'utilisateur connecté
   * 
   * ENDPOINT : GET /api/notifications
   * 
   * @param {Object} params - Paramètres de filtrage
   * @param {number} params.page - Numéro de page (pagination)
   * @param {number} params.per_page - Nombre d'éléments par page
   * @param {string} params.statut - Filtrer par statut : 'lues' | 'non-lues' | 'toutes'
   * 
   * @returns {Promise<Object>} Réponse avec structure :
   * {
   *   data: [
   *     {
   *       id: 1,
   *       titre: "Nouvelle conférence",
   *       message: "Une conférence a été ajoutée...",
   *       evenement: { id: 5, titre: "..." }, // Si lié à un événement
   *       date_envoi: "2024-10-01 14:30:00",
   *       est_lu: false,                      // Statut pour l'utilisateur
   *       date_lu: null                       // Date de lecture
   *     }
   *   ],
   *   pagination: {
   *     current_page: 1,
   *     total: 25,
   *     per_page: 10,
   *     last_page: 3
   *   }
   * }
   * 
   * @throws {Error} Si erreur réseau ou serveur
   * 
   * EXEMPLE D'UTILISATION :
   * -----------------------
   * const notifications = await notificationService.getNotifications({
   *   page: 1,
   *   per_page: 10,
   *   statut: 'non-lues'
   * });
   */
  async getNotifications(params = {}) {
    try {
      console.log('📥 Récupération des notifications...', params);
      
      const response = await api.get('/notifications', { params });
      
      console.log(`✅ ${response.data.data.length} notifications récupérées`);
      return response.data;
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des notifications:', error);
      throw error;
    }
  }
  
  /**
   * Obtenir le nombre de notifications non lues
   * 
   * ENDPOINT : GET /api/notifications/non-lues/count
   * 
   * @returns {Promise<Object>} Réponse avec structure :
   * {
   *   count: 5  // Nombre de notifications non lues
   * }
   * 
   * EXEMPLE D'UTILISATION :
   * -----------------------
   * const { count } = await notificationService.getUnreadCount();
   * console.log(`${count} notifications non lues`);
   */
  async getUnreadCount() {
    try {
      const response = await api.get('/notifications/non-lues/count');
      console.log(`🔔 ${response.data.count} notification(s) non lue(s)`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors du comptage des notifications:', error);
      throw error;
    }
  }
  
  // =====================================
  // ACTIONS UTILISATEUR
  // =====================================
  
  /**
   * Marquer une notification spécifique comme lue
   * 
   * ENDPOINT : POST /api/notifications/{id}/marquer-comme-lue
   * 
   * Cette action met à jour la table pivot `notification_user` :
   * - est_lu = true
   * - date_lu = maintenant
   * 
   * @param {number} notificationId - ID de la notification
   * 
   * @returns {Promise<Object>} Réponse avec structure :
   * {
   *   success: true,
   *   message: "Notification marquée comme lue"
   * }
   * 
   * @throws {Error} Si la notification n'existe pas ou n'appartient pas à l'utilisateur
   * 
   * EXEMPLE D'UTILISATION :
   * -----------------------
   * await notificationService.marquerCommeLue(15);
   */
  async marquerCommeLue(notificationId) {
    try {
      console.log(`📖 Marquage de la notification ${notificationId} comme lue...`);
      
      const response = await api.post(
        `/notifications/${notificationId}/marquer-comme-lue`
      );
      
      console.log('✅ Notification marquée comme lue');
      return response.data;
      
    } catch (error) {
      console.error('❌ Erreur lors du marquage comme lu:', error);
      throw error;
    }
  }
  
  /**
   * Marquer TOUTES les notifications de l'utilisateur comme lues
   * 
   * ENDPOINT : POST /api/notifications/marquer-toutes-comme-lues
   * 
   * Met à jour en masse tous les enregistrements dans `notification_user`
   * où user_id = utilisateur connecté et est_lu = false
   * 
   * @returns {Promise<Object>} Réponse avec structure :
   * {
   *   success: true,
   *   message: "12 notifications marquées comme lues",
   *   count: 12  // Nombre de notifications mises à jour
   * }
   * 
   * EXEMPLE D'UTILISATION :
   * -----------------------
   * const result = await notificationService.marquerToutesCommeLues();
   * console.log(`${result.count} notifications marquées`);
   */
  async marquerToutesCommeLues() {
    try {
      console.log('📚 Marquage de toutes les notifications comme lues...');
      
      const response = await api.post('/notifications/marquer-toutes-comme-lues');
      
      console.log(`✅ ${response.data.count} notification(s) marquée(s) comme lue(s)`);
      return response.data;
      
    } catch (error) {
      console.error('❌ Erreur lors du marquage global:', error);
      throw error;
    }
  }
  
  // =====================================
  // ACTIONS ADMIN UNIQUEMENT
  // =====================================
  
  /**
   * [ADMIN] Envoyer une notification à TOUS les utilisateurs
   * 
   * ENDPOINT : POST /api/notifications/envoyer-a-tous
   * ACCÈS : Administrateurs uniquement
   * 
   * Crée une notification et l'associe automatiquement à tous les
   * utilisateurs dans la table `notification_user`
   * 
   * @param {Object} notificationData - Données de la notification
   * @param {string} notificationData.titre - Titre (requis)
   * @param {string} notificationData.message - Message (requis)
   * @param {number} [notificationData.evenement_id] - ID événement lié (optionnel)
   * 
   * @returns {Promise<Object>} Réponse avec structure :
   * {
   *   success: true,
   *   message: "Notification envoyée à 150 utilisateurs",
   *   notification: {
   *     id: 23,
   *     titre: "...",
   *     message: "...",
   *     ...
   *   },
   *   count: 150  // Nombre d'utilisateurs notifiés
   * }
   * 
   * @throws {Error} Si non admin ou données invalides
   * 
   * EXEMPLE D'UTILISATION :
   * -----------------------
   * await notificationService.envoyerATous({
   *   titre: "Changement d'horaire",
   *   message: "La conférence du soir est avancée à 18h",
   *   evenement_id: 5
   * });
   */
  async envoyerATous(notificationData) {
    try {
      console.log('📢 Envoi de notification globale...');
      
      const response = await api.post(
        '/notifications/envoyer-a-tous', 
        notificationData
      );
      
      console.log(`✅ Notification envoyée à ${response.data.count} utilisateur(s)`);
      return response.data;
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi global:', error);
      throw error;
    }
  }
  
  /**
   * [ADMIN] Envoyer une notification aux inscrits d'un événement
   * 
   * ENDPOINT : POST /api/notifications/envoyer-aux-inscrits
   * ACCÈS : Administrateurs uniquement
   * 
   * Envoie une notification uniquement aux utilisateurs inscrits
   * à un événement spécifique (table `inscriptions`)
   * 
   * @param {number} evenementId - ID de l'événement cible
   * @param {Object} notificationData - Données de la notification
   * @param {string} notificationData.titre - Titre (requis)
   * @param {string} notificationData.message - Message (requis)
   * 
   * @returns {Promise<Object>} Réponse avec structure :
   * {
   *   success: true,
   *   message: "Notification envoyée à 45 inscrits",
   *   notification: { ... },
   *   count: 45  // Nombre d'inscrits notifiés
   * }
   * 
   * EXEMPLE D'UTILISATION :
   * -----------------------
   * await notificationService.envoyerAuxInscrits(5, {
   *   titre: "Rappel : Conférence demain",
   *   message: "N'oubliez pas la conférence prévue demain à 14h"
   * });
   */
  async envoyerAuxInscrits(evenementId, notificationData) {
    try {
      console.log(`📨 Envoi aux inscrits de l'événement ${evenementId}...`);
      
      const response = await api.post('/notifications/envoyer-aux-inscrits', {
        evenement_id: evenementId,
        ...notificationData
      });
      
      console.log(`✅ Notification envoyée à ${response.data.count} inscrit(s)`);
      return response.data;
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi ciblé:', error);
      throw error;
    }
  }
  
  /**
   * [ADMIN] Supprimer une notification
   * 
   * ENDPOINT : DELETE /api/notifications/{id}
   * ACCÈS : Administrateurs uniquement
   * 
   * Supprime la notification ET tous ses enregistrements associés
   * dans `notification_user` (cascade)
   * 
   * @param {number} notificationId - ID de la notification
   * 
   * @returns {Promise<Object>} Réponse avec structure :
   * {
   *   success: true,
   *   message: "Notification supprimée"
   * }
   * 
   * EXEMPLE D'UTILISATION :
   * -----------------------
   * await notificationService.supprimerNotification(23);
   */
  async supprimerNotification(notificationId) {
    try {
      console.log(`🗑️ Suppression de la notification ${notificationId}...`);
      
      const response = await api.delete(`/notifications/${notificationId}`);
      
      console.log('✅ Notification supprimée');
      return response.data;
      
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      throw error;
    }
  }
}

// =====================================
// EXPORT SINGLETON
// =====================================

/**
 * Instance unique du service (pattern Singleton)
 * Garantit qu'il n'y a qu'une seule instance dans toute l'application
 */
const notificationService = new NotificationService();

export default notificationService;