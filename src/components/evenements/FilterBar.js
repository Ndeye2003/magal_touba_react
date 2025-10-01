// src/components/evenements/FilterBar.js

import React from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

/**
 * Barre de filtres pour les événements
 * 
 * Permet de :
 * - Rechercher par texte
 * - Filtrer par statut et période
 * - Trier les résultats
 * - Effacer les filtres
 */
const FilterBar = ({ 
  filters, 
  onFilterChange, 
  onSearchChange, 
  onClearFilters,
  totalCount = 0
}) => {
  
  // =====================================
  // GESTIONNAIRES D'ÉVÉNEMENTS
  // =====================================
  
  /**
   * Gérer le changement de recherche textuelle
   */
  const handleSearchChange = (e) => {
    onSearchChange(e.target.value);
  };
  
  /**
   * Gérer le changement de filtre
   */
  const handleFilterChange = (filterName, value) => {
    onFilterChange({
      ...filters,
      [filterName]: value
    });
  };
  
  /**
   * Vérifier si des filtres sont actifs
   */
  const hasActiveFilters = () => {
    return filters.search || 
           filters.statut !== 'tous' || 
           filters.periode !== 'tous' ||
           filters.sort !== 'asc';
  };
  
  // =====================================
  // RENDER
  // =====================================
  
  return (
    <div className="magal-card mb-4 slide-up">
      <div className="card-body">
        
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="mb-0 text-magal-primary">
            <FaFilter className="me-2" />
            Filtres et recherche
          </h5>
          
          {/* Compteur de résultats */}
          <span className="badge bg-success">
            {totalCount} événement(s)
          </span>
        </div>
        
        <div className="row g-3">
          
          {/* Recherche textuelle */}
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FaSearch className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Rechercher un événement..."
                value={filters.search || ''}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          
          {/* Filtre par statut */}
          <div className="col-md-2">
            <select
              className="form-select"
              value={filters.statut || 'tous'}
              onChange={(e) => handleFilterChange('statut', e.target.value)}
            >
              <option value="tous">Tous les statuts</option>
              <option value="actif">Événements actifs</option>
              <option value="inactif">Événements inactifs</option>
            </select>
          </div>
          
          {/* Filtre par période */}
          <div className="col-md-2">
            <select
              className="form-select"
              value={filters.periode || 'tous'}
              onChange={(e) => handleFilterChange('periode', e.target.value)}
            >
              <option value="tous">Toutes les périodes</option>
              <option value="avenir">À venir</option>
              <option value="passes">Passés</option>
            </select>
          </div>
          
          {/* Tri */}
          <div className="col-md-2">
            <select
              className="form-select"
              value={filters.sort || 'asc'}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
            >
              <option value="asc">Date croissante</option>
              <option value="desc">Date décroissante</option>
            </select>
          </div>
        </div>
        
        {/* Actions */}
        {hasActiveFilters() && (
          <div className="mt-3 d-flex justify-content-between align-items-center">
            <div className="d-flex flex-wrap gap-2">
              
              {/* Badges des filtres actifs */}
              {filters.search && (
                <span className="badge bg-primary">
                  Recherche: "{filters.search}"
                </span>
              )}
              
              {filters.statut && filters.statut !== 'tous' && (
                <span className="badge bg-info">
                  Statut: {filters.statut}
                </span>
              )}
              
              {filters.periode && filters.periode !== 'tous' && (
                <span className="badge bg-warning text-dark">
                  Période: {filters.periode}
                </span>
              )}
              
              {filters.sort && filters.sort !== 'asc' && (
                <span className="badge bg-secondary">
                  Tri: Date décroissante
                </span>
              )}
            </div>
            
            {/* Bouton effacer filtres */}
            <button
              onClick={onClearFilters}
              className="btn btn-outline-secondary btn-sm"
            >
              <FaTimes className="me-1" />
              Effacer les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;