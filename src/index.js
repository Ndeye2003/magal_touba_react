// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';

// Import Bootstrap CSS (IMPORTANT : avant nos styles)
import 'bootstrap/dist/css/bootstrap.min.css';

// Import de nos styles personnalisés
import './styles/custom.css';
import './index.css';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);