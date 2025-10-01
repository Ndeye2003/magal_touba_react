// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importer Bootstrap JS pour les composants interactifs
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Importer nos styles personnalisés
import './styles/custom.css';

// Composants communs
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Evenements from './pages/Evenements';
import EvenementDetail from './pages/EvenementDetail';
import NouvelEvenement from './pages/admin/NouvelEvenement';

import PointsInteret from './pages/PointsInteret';
import PointInteretDetail from './pages/PointInteretDetail';
import MesFavoris from './pages/MesFavoris';

/**
 * Composant principal de l'application
 * 
 * Gère :
 * - Le routage de l'application
 * - La navigation globale
 * - La structure générale des pages
 */
function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation globale */}
        <Navbar />
        
        {/* Contenu principal */}
        <main>
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Routes des événements */}
            <Route 
              path="/evenements" 
              element={
                <ProtectedRoute>
                  <Evenements />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/evenements/:id" 
              element={
                <ProtectedRoute>
                  <EvenementDetail />
                </ProtectedRoute>
              } 
            />
            
           {/* Points d'intérêt */}
            <Route 
              path="/points-interet" 
              element={
                <ProtectedRoute>
                  <PointsInteret />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/points-interet/:id" 
              element={
                <ProtectedRoute>
                  <PointInteretDetail />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/notifications" 
              element={
                <ProtectedRoute>
                  <div className="container mt-5 pt-5">
                    <h1 className="text-center">Notifications - En cours de développement</h1>
                  </div>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <div className="container mt-5 pt-5">
                    <h1 className="text-center">Profil - En cours de développement</h1>
                  </div>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/mes-inscriptions" 
              element={
                <ProtectedRoute>
                  <div className="container mt-5 pt-5">
                    <h1 className="text-center">Mes Inscriptions - En cours de développement</h1>
                  </div>
                </ProtectedRoute>
              } 
            />
            
            {/* Favoris */}
            <Route 
              path="/mes-favoris" 
              element={
                <ProtectedRoute>
                  <MesFavoris />
                </ProtectedRoute>
              } 
            />

            {/* Routes admin */}
            <Route 
              path="/admin/evenements/nouveau" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <NouvelEvenement />
                </ProtectedRoute>
              } 
            />
            
            
            {/* Route 404 */}
            <Route 
              path="*" 
              element={
                <div className="container mt-5 pt-5 text-center">
                  <h1 className="display-1">404</h1>
                  <h2>Page non trouvée</h2>
                  <p className="text-muted">La page que vous cherchez n'existe pas.</p>
                  <a href="/" className="btn btn-magal-primary">
                    Retour à l'accueil
                  </a>
                </div>
              } 
            />
          </Routes>
        </main>
        
        {/* Footer global */}
        <footer className="magal-footer text-light text-center py-4 mt-5">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <h5 className="mb-3">🕌 Magal Touba 2024</h5>
                <p className="mb-0">
                  Application développée pour accompagner les pèlerins 
                  du Grand Magal de Touba
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="mb-3">Formation Laravel/React</h6>
                <p className="mb-0">
                  Projet éducatif pour apprendre le développement 
                  d'applications web modernes
                </p>
              </div>
            </div>
            <hr className="my-3" />
            <p className="mb-0">
              © 2024 Magal Touba - Tous droits réservés
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;