import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaSave, 
  FaMapMarkerAlt, 
  FaPhone,
  FaHome,
  FaInfoCircle,
  FaSpinner,
  FaCheck,
  FaTimes
} from 'react-icons/fa';

// Simuler les services (à remplacer par les vrais imports)
const pointInteretService = {
  creerPointInteret: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { data: { id: 1, ...data } };
  },
  modifierPointInteret: async (id, data) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { data: { id, ...data } };
  },
  getPointInteret: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: {
        id,
        nom: 'Grande Mosquée de Touba',
        type: 'mosquee',
        adresse: 'Touba, Sénégal',
        latitude: '14.8500',
        longitude: '-15.8833',
        description: 'La Grande Mosquée de Touba est l\'un des plus grands monuments religieux d\'Afrique.',
        numero_urgence: '+221 77 123 45 67',
        image_url: null
      }
    };
  }
};

const POINT_INTERET_TYPES = {
  mosquee: 'Mosquée',
  sante: 'Centre de santé',
  hebergement: 'Hébergement',
  restauration: 'Restauration',
  transport: 'Transport',
  autre: 'Autre'
};

const TYPE_COLORS = {
  mosquee: 'success',
  sante: 'danger',
  hebergement: 'primary',
  restauration: 'warning',
  transport: 'info',
  autre: 'secondary'
};

const PointInteretForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // États du formulaire
  const [formData, setFormData] = useState({
    nom: '',
    type: 'mosquee',
    adresse: '',
    latitude: '',
    longitude: '',
    description: '',
    numero_urgence: '',
    image_url: null
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [touched, setTouched] = useState({});

  // Charger les données en mode édition
  useEffect(() => {
    if (isEditMode) {
      loadPointInteret();
    }
  }, [id]);

  const loadPointInteret = async () => {
    setLoadingData(true);
    try {
      const response = await pointInteretService.getPointInteret(id);
      setFormData(response.data);
    } catch (error) {
      setErrors({ general: 'Erreur lors du chargement des données' });
    } finally {
      setLoadingData(false);
    }
  };

  // Gestion des changements
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleImageChange = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      image_url: imageUrl
    }));
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est obligatoire';
    } else if (formData.nom.length < 3) {
      newErrors.nom = 'Le nom doit contenir au moins 3 caractères';
    }

    if (!formData.type) {
      newErrors.type = 'Le type est obligatoire';
    }

    if (!formData.adresse.trim()) {
      newErrors.adresse = 'L\'adresse est obligatoire';
    }

    if (formData.latitude && isNaN(formData.latitude)) {
      newErrors.latitude = 'Latitude invalide';
    }

    if (formData.longitude && isNaN(formData.longitude)) {
      newErrors.longitude = 'Longitude invalide';
    }

    if (formData.numero_urgence && !/^(\+221|00221|221)?[7][0-8][0-9]{7}$/.test(formData.numero_urgence.replace(/\s/g, ''))) {
      newErrors.numero_urgence = 'Numéro invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccess('');
    setErrors({});

    try {
      if (isEditMode) {
        await pointInteretService.modifierPointInteret(id, formData);
        setSuccess('Point d\'intérêt modifié avec succès !');
      } else {
        await pointInteretService.creerPointInteret(formData);
        setSuccess('Point d\'intérêt créé avec succès !');
      }

      setTimeout(() => {
        navigate('/points-interet');
      }, 1500);

    } catch (error) {
      setErrors({ 
        general: error.response?.data?.message || 'Erreur lors de l\'enregistrement' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Obtenir l'icône du type
  const getTypeIcon = (type) => {
    const icons = {
      mosquee: '🕌',
      sante: '🏥',
      hebergement: '🏨',
      restauration: '🍽️',
      transport: '🚌',
      autre: '📍'
    };
    return icons[type] || '📍';
  };

  if (loadingData) {
    return (
      <div className="bg-light min-vh-100 py-4">
        <div className="container">
          <div className="text-center py-5">
            <FaSpinner className="fa-spin text-primary mb-3" size={48} />
            <h5 className="text-muted">Chargement...</h5>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 fade-in">
          <div>
            <h1 className="text-success mb-2">
              {isEditMode ? '✏️ Modifier' : '➕ Créer'} un Point d'Intérêt
            </h1>
            <p className="text-muted">
              {isEditMode ? 'Modifiez les informations' : 'Ajoutez un nouveau lieu pour le Magal'}
            </p>
          </div>
          <button
            onClick={() => navigate('/points-interet')}
            className="btn btn-outline-secondary"
          >
            <FaArrowLeft className="me-2" />
            Retour
          </button>
        </div>

        {/* Messages */}
        {errors.general && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <FaTimes className="me-2" />
            {errors.general}
            <button type="button" className="btn-close" onClick={() => setErrors({})}>
            </button>
          </div>
        )}

        {success && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <FaCheck className="me-2" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row">
            
            {/* Colonne principale */}
            <div className="col-lg-8">
              
              {/* Informations de base */}
              <div className="card border-0 shadow-sm mb-4 slide-up">
                <div className="card-header bg-transparent border-0 pt-4">
                  <h5 className="mb-0 text-success">
                    <FaInfoCircle className="me-2" />
                    Informations de base
                  </h5>
                </div>
                <div className="card-body p-4">
                  
                  {/* Nom */}
                  <div className="mb-4">
                    <label htmlFor="nom" className="form-label fw-semibold">
                      Nom du lieu *
                    </label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      className={`form-control form-control-lg ${
                        touched.nom ? (errors.nom ? 'is-invalid' : 'is-valid') : ''
                      }`}
                      placeholder="Ex: Grande Mosquée de Touba"
                      value={formData.nom}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('nom')}
                      disabled={loading}
                    />
                    {errors.nom && (
                      <div className="invalid-feedback">{errors.nom}</div>
                    )}
                  </div>

                  {/* Type */}
                  <div className="mb-4">
                    <label htmlFor="type" className="form-label fw-semibold">
                      Type de lieu *
                    </label>
                    <div className="row g-2">
                      {Object.entries(POINT_INTERET_TYPES).map(([key, label]) => (
                        <div key={key} className="col-6 col-md-4">
                          <input
                            type="radio"
                            className="btn-check"
                            name="type"
                            id={`type-${key}`}
                            value={key}
                            checked={formData.type === key}
                            onChange={handleInputChange}
                            disabled={loading}
                          />
                          <label
                            className={`btn btn-outline-${TYPE_COLORS[key]} w-100`}
                            htmlFor={`type-${key}`}
                          >
                            <span className="me-1">{getTypeIcon(key)}</span>
                            {label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <label htmlFor="description" className="form-label fw-semibold">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      className="form-control"
                      rows="4"
                      placeholder="Décrivez ce lieu..."
                      value={formData.description}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                    <small className="text-muted">
                      {formData.description.length} caractères
                    </small>
                  </div>
                </div>
              </div>

              {/* Localisation */}
              <div className="card border-0 shadow-sm mb-4 slide-up">
                <div className="card-header bg-transparent border-0 pt-4">
                  <h5 className="mb-0 text-success">
                    <FaMapMarkerAlt className="me-2" />
                    Localisation
                  </h5>
                </div>
                <div className="card-body p-4">
                  
                  {/* Adresse */}
                  <div className="mb-4">
                    <label htmlFor="adresse" className="form-label fw-semibold">
                      Adresse complète *
                    </label>
                    <input
                      type="text"
                      id="adresse"
                      name="adresse"
                      className={`form-control ${
                        touched.adresse ? (errors.adresse ? 'is-invalid' : 'is-valid') : ''
                      }`}
                      placeholder="Ex: Avenue Cheikh Ahmadou Bamba, Touba"
                      value={formData.adresse}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('adresse')}
                      disabled={loading}
                    />
                    {errors.adresse && (
                      <div className="invalid-feedback">{errors.adresse}</div>
                    )}
                  </div>

                  {/* Coordonnées GPS */}
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="latitude" className="form-label fw-semibold">
                        Latitude
                      </label>
                      <input
                        type="text"
                        id="latitude"
                        name="latitude"
                        className={`form-control ${errors.latitude ? 'is-invalid' : ''}`}
                        placeholder="Ex: 14.8500"
                        value={formData.latitude}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                      {errors.latitude && (
                        <div className="invalid-feedback">{errors.latitude}</div>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="longitude" className="form-label fw-semibold">
                        Longitude
                      </label>
                      <input
                        type="text"
                        id="longitude"
                        name="longitude"
                        className={`form-control ${errors.longitude ? 'is-invalid' : ''}`}
                        placeholder="Ex: -15.8833"
                        value={formData.longitude}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                      {errors.longitude && (
                        <div className="invalid-feedback">{errors.longitude}</div>
                      )}
                    </div>
                  </div>

                  <div className="alert alert-info py-2">
                    <small>
                      💡 Vous pouvez utiliser Google Maps pour obtenir les coordonnées GPS
                    </small>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="card border-0 shadow-sm mb-4 slide-up">
                <div className="card-header bg-transparent border-0 pt-4">
                  <h5 className="mb-0 text-success">
                    <FaPhone className="me-2" />
                    Contact
                  </h5>
                </div>
                <div className="card-body p-4">
                  <div className="mb-3">
                    <label htmlFor="numero_urgence" className="form-label fw-semibold">
                      Numéro de téléphone
                    </label>
                    <input
                      type="tel"
                      id="numero_urgence"
                      name="numero_urgence"
                      className={`form-control ${errors.numero_urgence ? 'is-invalid' : ''}`}
                      placeholder="Ex: +221 77 123 45 67"
                      value={formData.numero_urgence}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                    {errors.numero_urgence && (
                      <div className="invalid-feedback">{errors.numero_urgence}</div>
                    )}
                    <small className="text-muted">
                      Format sénégalais attendu
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              
              {/* Image */}
              <div className="card border-0 shadow-sm mb-4 zoom-in sticky-top" style={{ top: '20px' }}>
                <div className="card-header bg-transparent border-0 pt-4">
                  <h5 className="mb-0 text-success">
                    <FaHome className="me-2" />
                    Image du lieu
                  </h5>
                </div>
                <div className="card-body p-4">
                  {/* Simulation du composant ImageUpload */}
                  <div className="border-2 border-dashed rounded p-4 text-center" style={{ borderColor: '#dee2e6', minHeight: '200px' }}>
                    {formData.image_url ? (
                      <div className="position-relative">
                        <img 
                          src={formData.image_url} 
                          alt="Prévisualisation" 
                          className="img-fluid rounded mb-2"
                          style={{ maxHeight: '200px', objectFit: 'cover' }}
                        />
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleImageChange(null)}
                        >
                          Supprimer
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="mb-3 text-muted" style={{ fontSize: '3rem' }}>🖼️</div>
                        <p className="text-muted mb-2">Ajouter une image</p>
                        <small className="text-muted">
                          JPG, PNG ou WebP<br />
                          Maximum 5MB
                        </small>
                      </div>
                    )}
                  </div>
                  <small className="text-muted d-block mt-2">
                    💡 Une image attractive aide les utilisateurs
                  </small>
                </div>
              </div>

              {/* Actions */}
              <div className="card border-0 shadow-sm zoom-in">
                <div className="card-body p-4">
                  <div className="d-grid gap-2">
                    <button
                      type="submit"
                      className="btn btn-success btn-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <FaSpinner className="fa-spin me-2" />
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <FaSave className="me-2" />
                          {isEditMode ? 'Modifier' : 'Créer'} le lieu
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => navigate('/points-interet')}
                      disabled={loading}
                    >
                      Annuler
                    </button>
                  </div>

                  <div className="alert alert-warning mt-3 py-2 mb-0">
                    <small>
                      ⚠️ Les champs avec * sont obligatoires
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PointInteretForm;