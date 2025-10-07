// src/pages/MesFavoris.js

import React, { useState, useEffect } from 'react';
import { FaHeart, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

import pointInteretService from '../services/pointInteretService';
import PointInteretCard from '../components/points-interet/PointInteretCard';
import TypeFilter from '../components/points-interet/TypeFilter';

/**
 * Page des favoris personnels de l'utilisateur
 * 
 * Fonctionnalités :
 * - Liste des lieux favoris
 * - Filtres par type
 * - Retrait en temps réel
 * - Message si aucun favori
 */
const MesFavoris = () => {
  
  // =====================================
  // ÉTATS DU COMPOSANT
  // =====================================
  
  const [favoris, setFavoris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeType, setActiveType] = useState('tous');
  
  // =====================================
  // EFFETS
  // =====================================
  
  useEffect(() => {
    loadFavoris();
  }, [activeType]);
  
  // =====================================
  // FONCTIONS DE CHARGEMENT
  // =====================================
  
  /**
   * Charger les favoris de l'utilisateur
   */
  const loadFavoris = async () => {
    setLoading(true);
    setError('');
    
    try {
      const params = {};
      
      // Filtre par type si actif
      if (activeType !== 'tous') {
        params.type = activeType;
      }
      
      const response = await pointInteretService.getMesFavoris(params);
      
      setFavoris(response.data);
      
      console.log(`✅ ${response.data.length} favoris chargés`);
      
    } catch (error) {
      console.error('❌ Erreur chargement favoris:', error);
      setError(
        error.response?.data?.message || 
        'Erreur lors du chargement de vos favoris'
      );
    } finally {
      setLoading(false);
    }
  };
  
  // =====================================
  // GESTIONNAIRES D'ÉVÉNEMENTS
  // =====================================
  
  /**
   * Mettre à jour après retrait d'un favori
   * Supprime le lieu de la liste affichée
   */
  const handleFavoriUpdate = (updatedPoint) => {
    if (!updatedPoint.est_dans_mes_favoris) {
      // Retirer de la liste locale
      setFavoris(prev => prev.filter(fav => fav.id !== updatedPoint.id));
    }
  };
  
  // =====================================
  // RENDER
  // =====================================
  
  if (loading) {
    return (
      <div className="bg-light min-vh-100 py-4">
        <div className="container">
          <div className="text-center py-5">
            <FaSpinner className="fa-spin text-magal-primary mb-3" size={48} />
            <h5 className="text-muted">Chargement de vos favoris...</h5>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-light min-vh-100 py-4">
        <div className="container">
          <div className="alert alert-danger magal-alert" role="alert">
            <FaExclamationTriangle className="me-2" />
            {error}
            <div className="mt-2">
              <button 
                onClick={loadFavoris}
                className="btn btn-outline-danger btn-sm"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="text-magal-primary mb-2 fade-in">
              <FaHeart className="text-danger me-2" />
              Mes Favoris
            </h1>
            <p className="text-muted">
              Vos lieux préférés pour le Magal Touba 2026
            </p>
          </div>
        </div>
        
        {/* Afficher filtres seulement s'il y a des favoris */}
        {favoris.length > 0 && (
          <>
            <TypeFilter
              activeType={activeType}
              onTypeChange={setActiveType}
            />
            
            <div className="mb-4">
              <h6 className="text-muted">
                {favoris.length} favori(s)
              </h6>
            </div>
          </>
        )}
        
        {/* Liste ou message vide */}
        {favoris.length === 0 ? (
          <div className="text-center py-5">
            <div className="display-1 mb-3">
              <FaHeart className="text-muted" />
            </div>
            <h4 className="text-muted mb-3">Aucun favori</h4>
            <p className="text-muted mb-4">
              Explorez les points d'intérêt et ajoutez vos lieux préférés en cliquant sur le cœur
            </p>
            <a href="/points-interet" className="btn btn-magal-primary">
              Découvrir les lieux
            </a>
          </div>
        ) : (
          <div className="row">
            {favoris.map((favori) => (
              <PointInteretCard
                key={favori.id}
                pointInteret={favori}
                onUpdate={handleFavoriUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MesFavoris;
