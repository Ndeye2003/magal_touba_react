// src/pages/PointsInteret.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaSpinner, FaExclamationTriangle, FaSearch } from 'react-icons/fa';

import pointInteretService from '../services/pointInteretService';
import authService from '../services/authService';
import PointInteretCard from '../components/points-interet/PointInteretCard';
import TypeFilter from '../components/points-interet/TypeFilter';

/**
 * Page principale des points d'intérêt
 * 
 * Fonctionnalités :
 * - Liste des lieux avec pagination
 * - Filtres par type avec badges animés
 * - Recherche textuelle
 * - Gestion des favoris
 */
const PointsInteret = () => {
  // =====================================
  // ÉTATS DU COMPOSANT
  // =====================================
  
  const [pointsInteret, setPointsInteret] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 9,
    total: 0
  });
  
  // Filtres
  const [activeType, setActiveType] = useState('tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const isAdmin = authService.isAdmin();
  
  // =====================================
  // EFFETS
  // =====================================
  
  useEffect(() => {
    loadPointsInteret();
  }, [activeType, searchQuery, currentPage]);
  
  // =====================================
  // FONCTIONS DE CHARGEMENT
  // =====================================
  
  /**
   * Charger la liste des points d'intérêt
   */
  const loadPointsInteret = async () => {
    setLoading(true);
    setError('');
    
    try {
      const params = {
        page: currentPage,
        per_page: 9
      };
      
      // Ajouter les filtres si actifs
      if (activeType !== 'tous') {
        params.type = activeType;
      }
      
      if (searchQuery.trim()) {
        params.search = searchQuery;
      }
      
      const response = await pointInteretService.getPointsInteret(params);
      
      setPointsInteret(response.data);
      setPagination(response.pagination);
      
      console.log('✅ Points d\'intérêt chargés:', response.data.length);
      
    } catch (error) {
      console.error('❌ Erreur chargement:', error);
      setError(
        error.response?.data?.message || 
        'Erreur lors du chargement des points d\'intérêt'
      );
    } finally {
      setLoading(false);
    }
  };
  
  // =====================================
  // GESTIONNAIRES D'ÉVÉNEMENTS
  // =====================================
  
  /**
   * Changer le type actif
   */
  const handleTypeChange = (type) => {
    setActiveType(type);
    setCurrentPage(1);
  };
  
  /**
   * Changer la recherche
   */
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  
  /**
   * Mettre à jour un point d'intérêt (après favori)
   */
  const handlePointUpdate = (updatedPoint) => {
    setPointsInteret(prev => 
      prev.map(point => 
        point.id === updatedPoint.id ? updatedPoint : point
      )
    );
  };
  
  /**
   * Changer de page
   */
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // =====================================
  // COMPOSANTS DE RENDU
  // =====================================
  
  /**
   * Loader
   */
  const renderLoading = () => (
    <div className="text-center py-5">
      <FaSpinner className="fa-spin text-magal-primary mb-3" size={48} />
      <h5 className="text-muted">Chargement des lieux...</h5>
    </div>
  );
  
  /**
   * Erreur
   */
  const renderError = () => (
    <div className="alert alert-danger magal-alert" role="alert">
      <FaExclamationTriangle className="me-2" />
      {error}
      <div className="mt-2">
        <button 
          onClick={loadPointsInteret}
          className="btn btn-outline-danger btn-sm"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
  
  /**
   * Aucun résultat
   */
  const renderEmpty = () => (
    <div className="text-center py-5">
      <div className="display-1 mb-3">🗺️</div>
      <h4 className="text-muted mb-3">Aucun lieu trouvé</h4>
      <p className="text-muted mb-4">
        {searchQuery || activeType !== 'tous' 
          ? 'Essayez de modifier vos critères de recherche'
          : 'Il n\'y a pas encore de points d\'intérêt enregistrés'
        }
      </p>
      
      {(searchQuery || activeType !== 'tous') && (
        <button 
          onClick={() => {
            setSearchQuery('');
            setActiveType('tous');
          }}
          className="btn btn-outline-magal-primary"
        >
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );
  
  /**
   * Pagination
   */
  const renderPagination = () => {
    if (pagination.last_page <= 1) return null;
    
    return (
      <nav className="d-flex justify-content-center mt-4">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button 
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Précédent
            </button>
          </li>
          
          {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(page => (
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
          ))}
          
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
              🗺️ Points d'Intérêt - Magal Touba 2026
            </h1>
            <p className="text-muted">
              Découvrez les lieux essentiels pour votre pèlerinage
            </p>
          </div>
          
          {/* Actions admin */}
          {isAdmin && (
            <div className="col-md-4 text-md-end">
              <Link 
                to="/admin/points-interet/nouveau"
                className="btn btn-magal-primary pulse-btn"
              >
                <FaPlus className="me-2" />
                Ajouter un lieu
              </Link>
            </div>
          )}
        </div>
        
        {/* Barre de recherche */}
        <div className="magal-card mb-4 slide-up">
          <div className="card-body">
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FaSearch className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Rechercher un lieu (nom, adresse, description)..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
        
        {/* Filtres par type */}
        <TypeFilter
          activeType={activeType}
          onTypeChange={handleTypeChange}
        />
        
        {/* Compteur de résultats */}
        <div className="mb-4">
          <h6 className="text-muted">
            {pagination.total} lieu(x) trouvé(s)
          </h6>
        </div>
        
        {/* Contenu principal */}
        {loading ? (
          renderLoading()
        ) : error ? (
          renderError()
        ) : pointsInteret.length === 0 ? (
          renderEmpty()
        ) : (
          <>
            {/* Liste des points */}
            <div className="row">
              {pointsInteret.map((point, index) => (
                <PointInteretCard
                  key={point.id}
                  pointInteret={point}
                  onUpdate={handlePointUpdate}
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

export default PointsInteret;
