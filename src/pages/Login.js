// src/pages/Login.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import authService from '../services/authService';
import { SUCCESS_MESSAGES } from '../utils/constants';

/**
 * Page de connexion
 * 
 * Permet aux utilisateurs de se connecter avec :
 * - Animation d'apparition fluide
 * - Validation en temps réel
 * - Gestion des erreurs
 * - Design moderne et responsive
 */
const Login = () => {
  // =====================================
  // ÉTATS DU COMPOSANT
  // =====================================
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  
  // =====================================
  // EFFETS
  // =====================================
  
  useEffect(() => {
    // Rediriger si déjà connecté
    if (authService.isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);
  
  // =====================================
  // GESTION DU FORMULAIRE
  // =====================================
  
  /**
   * Gérer les changements dans les champs
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer les messages d'erreur quand l'utilisateur tape
    if (error) setError('');
    if (success) setSuccess('');
  };
  
  /**
   * Soumettre le formulaire de connexion
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation côté client
    if (!formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Tentative de connexion
      await authService.login(formData.email, formData.password);
      
      // Succès
      setSuccess(SUCCESS_MESSAGES.LOGIN_SUCCESS);
      
      // Redirection après un petit délai pour voir le message
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // =====================================
  // RENDER
  // =====================================
  
  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            
            {/* Card principale avec animation */}
            <div className="magal-card fade-in">
              <div className="card-body p-5">
                
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <span className="display-4">🕌</span>
                  </div>
                  <h2 className="text-magal-primary mb-2">Connexion</h2>
                  <p className="text-muted">
                    Connectez-vous à votre compte Magal Touba
                  </p>
                </div>
                
                {/* Messages de feedback */}
                {error && (
                  <div className="alert alert-danger magal-alert" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="alert alert-success magal-alert" role="alert">
                    <i className="fas fa-check-circle me-2"></i>
                    {success}
                  </div>
                )}
                
                {/* Formulaire */}
                <form onSubmit={handleSubmit} className="slide-up">
                  
                  {/* Champ Email */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">
                      <FaEnvelope className="me-2 text-magal-primary" />
                      Adresse email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control magal-input"
                      placeholder="Entrez votre email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={loading}
                      autoComplete="email"
                    />
                  </div>
                  
                  {/* Champ Mot de passe */}
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold">
                      <FaLock className="me-2 text-magal-primary" />
                      Mot de passe
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        className="form-control magal-input"
                        placeholder="Entrez votre mot de passe"
                        value={formData.password}
                        onChange={handleInputChange}
                        disabled={loading}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  
                  {/* Bouton de soumission */}
                  <button
                    type="submit"
                    className="btn btn-magal-primary w-100 pulse-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="magal-spinner me-2" role="status">
                          <span className="visually-hidden">Chargement...</span>
                        </div>
                        Connexion en cours...
                      </>
                    ) : (
                      'Se connecter'
                    )}
                  </button>
                </form>
                
                {/* Lien vers inscription */}
                <div className="text-center mt-4">
                  <p className="text-muted">
                    Pas encore de compte ?{' '}
                    <Link 
                      to="/register" 
                      className="text-magal-primary text-decoration-none fw-semibold"
                    >
                      S'inscrire ici
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;