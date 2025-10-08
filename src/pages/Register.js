// src/pages/Register.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaPhone, 
  FaEye, 
  FaEyeSlash,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import authService from '../services/authService';
import { SUCCESS_MESSAGES } from '../utils/constants';

/**
 * Page d'inscription
 * 
 * Permet aux nouveaux utilisateurs de créer un compte avec :
 * - Validation en temps réel
 * - Indicateurs de force du mot de passe
 * - Animations fluides
 * - Design responsive
 */
const Register = () => {
  // =====================================
  // ÉTATS DU COMPOSANT
  // =====================================
  
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    password_confirmation: '',
    telephone: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
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
  
  // Calculer la force du mot de passe
  useEffect(() => {
    const calculatePasswordStrength = () => {
      const password = formData.password;
      let strength = 0;
      
      if (password.length >= 8) strength += 1;
      if (/[A-Z]/.test(password)) strength += 1;
      if (/[a-z]/.test(password)) strength += 1;
      if (/[0-9]/.test(password)) strength += 1;
      if (/[^A-Za-z0-9]/.test(password)) strength += 1;
      
      setPasswordStrength(strength);
    };
    
    calculatePasswordStrength();
  }, [formData.password]);
  
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
    
    // Effacer l'erreur spécifique à ce champ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    if (success) setSuccess('');
  };
  
  /**
   * Valider le formulaire côté client
   */
  const validateForm = () => {
    const newErrors = {};
    
    // Nom
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est obligatoire';
    } else if (formData.nom.length < 2) {
      newErrors.nom = 'Le nom doit contenir au moins 2 caractères';
    }
    
    // Prénom
    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est obligatoire';
    } else if (formData.prenom.length < 2) {
      newErrors.prenom = 'Le prénom doit contenir au moins 2 caractères';
    }
    
    // Email
    if (!formData.email) {
      newErrors.email = 'L\'email est obligatoire';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    // Mot de passe
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est obligatoire';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }
    
    // Confirmation mot de passe
    if (!formData.password_confirmation) {
      newErrors.password_confirmation = 'Veuillez confirmer le mot de passe';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Les mots de passe ne correspondent pas';
    }
    
    // Téléphone (optionnel mais si renseigné, doit être valide)
    if (formData.telephone && !/^(\+221|00221|221)?[7][0-8][0-9]{7}$/.test(formData.telephone)) {
      newErrors.telephone = 'Format de téléphone sénégalais invalide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  /**
   * Soumettre le formulaire d'inscription
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation côté client
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setErrors({});
    setSuccess('');
    
    try {
      // Tentative d'inscription
      await authService.register(formData);
      
      // Succès
      setSuccess(SUCCESS_MESSAGES.REGISTER_SUCCESS);
      
      // Redirection après un délai
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      if (error.message.includes('validation')) {
        // Erreurs de validation du serveur
        setErrors({ general: error.message });
      } else {
        setErrors({ general: error.message });
      }
    } finally {
      setLoading(false);
    }
  };
  
  // =====================================
  // HELPERS
  // =====================================
  
  /**
   * Obtenir la couleur de la barre de force du mot de passe
   */
  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return 'danger';
      case 2: return 'warning';
      case 3: return 'info';
      case 4:
      case 5: return 'success';
      default: return 'secondary';
    }
  };
  
  /**
   * Obtenir le texte de la force du mot de passe
   */
  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0: return '';
      case 1: return 'Très faible';
      case 2: return 'Faible';
      case 3: return 'Moyen';
      case 4: return 'Fort';
      case 5: return 'Très fort';
      default: return '';
    }
  };
  
  // =====================================
  // RENDER
  // =====================================
  
  return (
    <div className="min-vh-100 d-flex align-items-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-7">
            
            {/* Card principale */}
            <div className="magal-card fade-in">
              <div className="card-body p-5">
                
               {/* Header */}
            <div className="text-center mb-4">
              <div className="mb-3">
                <span className="display-4">🕌</span>
              </div>
              <h2 className="text-magal-primary mb-2">Inscription</h2>
              <p className="text-muted">
                Créez votre compte pour le Magal Touba 2026
              </p>
            </div>
            
            {/* Messages de feedback */}
            {errors.general && (
              <div className="alert alert-danger magal-alert" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {errors.general}
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
              <div className="row">
                
                {/* Nom */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="nom" className="form-label fw-semibold">
                    <FaUser className="me-2 text-magal-primary" />
                    Nom *
                  </label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    className={`form-control magal-input ${errors.nom ? 'is-invalid' : ''}`}
                    placeholder="Votre nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  {errors.nom && (
                    <div className="invalid-feedback">
                      <FaTimes className="me-1" />
                      {errors.nom}
                    </div>
                  )}
                </div>
                
                {/* Prénom */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="prenom" className="form-label fw-semibold">
                    <FaUser className="me-2 text-magal-primary" />
                    Prénom *
                  </label>
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    className={`form-control magal-input ${errors.prenom ? 'is-invalid' : ''}`}
                    placeholder="Votre prénom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  {errors.prenom && (
                    <div className="invalid-feedback">
                      <FaTimes className="me-1" />
                      {errors.prenom}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Email */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">
                  <FaEnvelope className="me-2 text-magal-primary" />
                  Adresse email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-control magal-input ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="votre.email@exemple.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  autoComplete="email"
                />
                {errors.email && (
                  <div className="invalid-feedback">
                    <FaTimes className="me-1" />
                    {errors.email}
                  </div>
                )}
              </div>
              
              {/* Téléphone */}
              <div className="mb-3">
                <label htmlFor="telephone" className="form-label fw-semibold">
                  <FaPhone className="me-2 text-magal-primary" />
                  Téléphone (optionnel)
                </label>
                <input
                  type="tel"
                  id="telephone"
                  name="telephone"
                  className={`form-control magal-input ${errors.telephone ? 'is-invalid' : ''}`}
                  placeholder="762430235"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                {errors.telephone && (
                  <div className="invalid-feedback">
                    <FaTimes className="me-1" />
                    {errors.telephone}
                  </div>
                )}
              </div>
              
              {/* Mot de passe */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-semibold">
                  <FaLock className="me-2 text-magal-primary" />
                  Mot de passe *
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className={`form-control magal-input ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="Choisissez un mot de passe "
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={loading}
                    autoComplete="new-password"
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
                
                {/* Barre de force du mot de passe */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="progress" style={{ height: '4px' }}>
                      <div
                        className={`progress-bar bg-${getPasswordStrengthColor()}`}
                        role="progressbar"
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>
                    <small className={`text-${getPasswordStrengthColor()}`}>
                      {getPasswordStrengthText()}
                    </small>
                  </div>
                )}
                
                {errors.password && (
                  <div className="invalid-feedback d-block">
                    <FaTimes className="me-1" />
                    {errors.password}
                  </div>
                )}
              </div>
              
              {/* Confirmation mot de passe */}
              <div className="mb-4">
                <label htmlFor="password_confirmation" className="form-label fw-semibold">
                  <FaLock className="me-2 text-magal-primary" />
                  Confirmer le mot de passe *
                </label>
                <div className="input-group">
                  <input
                    type={showPasswordConfirm ? "text" : "password"}
                    id="password_confirmation"
                    name="password_confirmation"
                    className={`form-control magal-input ${errors.password_confirmation ? 'is-invalid' : ''}`}
                    placeholder="Veuillez confirmer votre mot de passe"
                    value={formData.password_confirmation}
                    onChange={handleInputChange}
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    disabled={loading}
                  >
                    {showPasswordConfirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                
                {/* Indicateur de correspondance */}
                {formData.password_confirmation && (
                  <div className="mt-1">
                    {formData.password === formData.password_confirmation ? (
                      <small className="text-success">
                        <FaCheck className="me-1" />
                        Les mots de passe correspondent
                      </small>
                    ) : (
                      <small className="text-danger">
                        <FaTimes className="me-1" />
                        Les mots de passe ne correspondent pas
                      </small>
                    )}
                  </div>
                )}
                
                {errors.password_confirmation && (
                  <div className="invalid-feedback d-block">
                    <FaTimes className="me-1" />
                    {errors.password_confirmation}
                  </div>
                )}
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
                    Inscription en cours...
                  </>
                ) : (
                  'Créer un compte'
                )}
              </button>
            </form>
            
            {/* Lien vers connexion */}
            <div className="text-center mt-4">
              <p className="text-muted">
                Déjà un compte ?{' '}
                <Link 
                  to="/login" 
                  className="text-magal-primary text-decoration-none fw-semibold"
                >
                  Se connecter ici
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>);
};
export default Register;
