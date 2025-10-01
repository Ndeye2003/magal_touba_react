// src/components/common/TestAPI.js

import React, { useState } from 'react';
import api from '../../services/api';

/**
 * Composant de test pour vérifier que l'API fonctionne
 * 
 * Ce composant permet de tester rapidement la connexion
 * avec notre API Laravel sans avoir besoin d'interface complète
 */
const TestAPI = () => {
  // État pour stocker le résultat du test
  const [result, setResult] = useState('');
  
  // État pour gérer le chargement
  const [loading, setLoading] = useState(false);

  /**
   * Tester la connexion avec l'API
   */
  const testConnection = async () => {
    setLoading(true);
    setResult('');

    try {
      // Test simple : essayer de récupérer des données
      // Note: Cette route n'existe pas encore, c'est juste pour tester
      const response = await api.get('/test');
      
      setResult(`✅ Connexion réussie ! Status: ${response.status}`);
    } catch (error) {
      if (error.response) {
        // Le serveur a répondu avec une erreur
        setResult(`❌ Erreur serveur: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        // Pas de réponse du serveur
        setResult(`🌐 Serveur inaccessible. Vérifiez que Laravel est démarré sur http://localhost:8000`);
      } else {
        // Autre erreur
        setResult(`💥 Erreur: ${error.message}`);
      }
    }

    setLoading(false);
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">🧪 Test de connexion API</h5>
            </div>
            <div className="card-body text-center">
              <p className="text-muted">
                Testez la connexion avec votre API Laravel
              </p>
              
              <button
                className="btn btn-primary"
                onClick={testConnection}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Test en cours...
                  </>
                ) : (
                  'Tester la connexion'
                )}
              </button>

              {result && (
                <div className="alert alert-info mt-3" role="alert">
                  <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
                    {result}
                  </pre>
                </div>
              )}

              <div className="mt-3">
                <small className="text-muted">
                  <strong>Instructions :</strong><br />
                  1. Démarrez votre serveur Laravel: <code>php artisan serve</code><br />
                  2. Cliquez sur "Tester la connexion"<br />
                  3. Vérifiez les messages dans la console du navigateur (F12)
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAPI;