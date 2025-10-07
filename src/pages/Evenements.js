// src/pages/Evenements.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

import evenementService from '../services/evenementService';
import authService from '../services/authService';
import EvenementCard from '../components/evenements/EvenementCard';
import FilterBar from '../components/evenements/FilterBar';

/**
 * Page principale des événements
 * 
 * Fonctionnalités :
 * - Liste des événements avec pagination
 * - Filtres et recherche
 * - Actions d'inscription
 * - Gestion admin (bouton créer)
 */
const Evenements = () => {
  // =====================================
  // ÉTATS DU COMPOSANT
  // =====================================
  
  const [evenements, setEvenements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  });
  
  // États pour les filtres
  const [filters, setFilters] = useState({
    search: '',
    statut: 'tous',
    periode: 'tous',
    sort: 'asc',
    per_page: 9 // 3x3 grid
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const user = authService.getUser();
  const isAdmin = authService.isAdmin();
  
  // =====================================
  // EFFETS
  // =====================================
  
  // Charger les événements au montage et quand les filtres changent
  useEffect(() => {
    loadEvenements();
  }, [filters, currentPage]);
  
  // =====================================
  // FONCTIONS DE CHARGEMENT
  // =====================================
  
  /**
   * Charger la liste des événements
   */
  const loadEvenements = async () => {
    setLoading(true);
    setError('');
    
    try {
      const params = {
        ...filters,
        page: currentPage
      };
      
      // Nettoyer les paramètres vides
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === 'tous') {
          delete params[key];
        }
      });
      
      const response = await evenementService.getEvenements(params);
      
      setEvenements(response.data);
      setPagination(response.pagination);
      
      console.log('✅ Événements chargés:', response.data.length);
      
    } catch (error) {
      console.error('❌ Erreur chargement événements:', error);
      setError(
        error.response?.data?.message || 
        'Erreur lors du chargement des événements'
      );
    } finally {
      setLoading(false);
    }
  };
  
  // =====================================
  // GESTIONNAIRES D'ÉVÉNEMENTS
  // =====================================
  
  /**
   * Gérer le changement de filtres
   */
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Retourner à la première page
  };
  
  /**
   * Gérer le changement de recherche
   */
  const handleSearchChange = (searchValue) => {
    setFilters(prev => ({
      ...prev,
      search: searchValue
    }));
    setCurrentPage(1);
  };
  
  /**
   * Effacer tous les filtres
   */
  const handleClearFilters = () => {
    setFilters({
      search: '',
      statut: 'tous',
      periode: 'tous',
      sort: 'asc',
      per_page: 9
    });
    setCurrentPage(1);
  };
  
  /**
   * Gérer la mise à jour d'un événement (après inscription/désinscription)
   */
  const handleEvenementUpdate = (updatedEvenement) => {
    setEvenements(prev => 
      prev.map(evenement => 
        evenement.id === updatedEvenement.id 
          ? updatedEvenement 
          : evenement
      )
    );
  };
  
  /**
   * Gérer le changement de page
   */
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll vers le haut
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // =====================================
  // COMPOSANTS DE RENDU
  // =====================================
  
  /**
   * Afficher le loader
   */
  const renderLoading = () => (
    <div className="text-center py-5">
      <FaSpinner className="fa-spin text-magal-primary mb-3" size={48} />
      <h5 className="text-muted">Chargement des événements...</h5>
    </div>
  );
  
  /**
   * Afficher l'erreur
   */
  const renderError = () => (
    <div className="alert alert-danger magal-alert" role="alert">
      <FaExclamationTriangle className="me-2" />
      {error}
      <div className="mt-2">
        <button 
          onClick={loadEvenements}
          className="btn btn-outline-danger btn-sm"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
  
  /**
   * Afficher le message "aucun résultat"
   */
  const renderEmpty = () => (
    <div className="text-center py-5">
      <div className="display-1 mb-3">📅</div>
      <h4 className="text-muted mb-3">Aucun événement trouvé</h4>
      <p className="text-muted mb-4">
        {filters.search || filters.statut !== 'tous' || filters.periode !== 'tous' 
          ? 'Essayez de modifier vos critères de recherche'
          : 'Il n\'y a pas encore d\'événements programmés'
        }
      </p>
      
      {(filters.search || filters.statut !== 'tous' || filters.periode !== 'tous') && (
        <button 
          onClick={handleClearFilters}
          className="btn btn-outline-magal-primary"
        >
          Voir tous les événements
        </button>
      )}
    </div>
  );
  
  /**
   * Afficher la pagination
   */
  const renderPagination = () => {
    if (pagination.last_page <= 1) return null;
    
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(pagination.last_page, currentPage + 2);
    
    return (
      <nav className="d-flex justify-content-center mt-4">
        <ul className="pagination">
          
          {/* Bouton précédent */}
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button 
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Précédent
            </button>
          </li>
          
          {/* Première page */}
          {startPage > 1 && (
            <>
              <li className="page-item">
                <button 
                  className="page-link"
                  onClick={() => handlePageChange(1)}
                >
                  1
                </button>
              </li>
              {startPage > 2 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
            </>
          )}
          
          {/* Pages visibles */}
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
            const page = startPage + i;
            return (
              <li 
                key={page}
                className={`page-item ${page === currentPage ? 'active' : ''}`}
              >
                <button 
                  className="page-link"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              </li>
            );
          })}
          
          {/* Dernière page */}
          {endPage < pagination.last_page && (
            <>
              {endPage < pagination.last_page - 1 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
              <li className="page-item">
                <button 
                  className="page-link"
                  onClick={() => handlePageChange(pagination.last_page)}
                >
                  {pagination.last_page}
                </button>
              </li>
            </>
          )}
          
          {/* Bouton suivant */}
          <li className={`page-item ${currentPage === pagination.last_page ? 'disabled' : ''}`}>
            <button 
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.last_page}
            >
              Suivant
            </button>
          </li>
        </ul>
      </nav>
    );
  };
  
  // =====================================
  // RENDER PRINCIPAL
  // =====================================
  
  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        
        {/* Header */}
        <div className="row mb-4">
          <div className="col-md-8">
            <h1 className="text-magal-primary mb-2 fade-in">
              📅 Événements du Magal Touba 2026
            </h1>
            <p className="text-muted">
              Découvrez et participez aux événements spirituels et culturels
            </p>
          </div>
          
          {/* Actions admin */}
          {isAdmin && (
            <div className="col-md-4 text-md-end">
              <Link 
                to="/admin/evenements/nouveau"
                className="btn btn-magal-primary pulse-btn"
              >
                <FaPlus className="me-2" />
                Créer un événement
              </Link>
            </div>
          )}
        </div>
        
        {/* Barre de filtres */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          onClearFilters={handleClearFilters}
          totalCount={pagination.total}
        />
        
        {/* Contenu principal */}
        {loading ? (
          renderLoading()
        ) : error ? (
          renderError()
        ) : evenements.length === 0 ? (
          renderEmpty()
        ) : (
          <>
            {/* Liste des événements */}
            <div className="row">
              {evenements.map((evenement, index) => (
                <EvenementCard
                  key={evenement.id}
                  evenement={evenement}
                  onUpdate={handleEvenementUpdate}
                  style={{ 
                    animationDelay: `${index * 0.1}s` 
                  }}
                />
              ))}
            </div>
            
            {/* Pagination */}
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};

export default Evenements;
