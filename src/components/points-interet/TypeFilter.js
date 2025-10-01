// src/components/points-interet/TypeFilter.js

import React from 'react';
import { POINT_INTERET_TYPES, TYPE_COLORS } from '../../utils/constants';

/**
 * Filtre par type de point d'intérêt avec badges colorés
 */
const TypeFilter = ({ activeType, onTypeChange, counts = {} }) => {
  
  // Types avec leurs informations
  const types = [
    { key: 'tous', label: 'Tous', icon: '📍', color: 'primary' },
    { key: 'mosquee', label: POINT_INTERET_TYPES.mosquee, icon: '🕌', color: TYPE_COLORS.mosquee },
    { key: 'sante', label: POINT_INTERET_TYPES.sante, icon: '🏥', color: TYPE_COLORS.sante },
    { key: 'hebergement', label: POINT_INTERET_TYPES.hebergement, icon: '🏨', color: TYPE_COLORS.hebergement },
    { key: 'restauration', label: POINT_INTERET_TYPES.restauration, icon: '🍽️', color: TYPE_COLORS.restauration },
    { key: 'transport', label: POINT_INTERET_TYPES.transport, icon: '🚌', color: TYPE_COLORS.transport },
    { key: 'autre', label: POINT_INTERET_TYPES.autre, icon: '📌', color: TYPE_COLORS.autre }
  ];
  
  return (
    <div className="d-flex flex-wrap gap-2 mb-4 slide-up">
      {types.map((type) => {
        const isActive = activeType === type.key;
        const count = counts[type.key] || 0;
        
        return (
          <button
            key={type.key}
            onClick={() => onTypeChange(type.key)}
            className={`btn btn-sm transition-all ${
              isActive 
                ? `btn-${type.color} shadow` 
                : `btn-outline-${type.color}`
            }`}
            style={{
              minWidth: '100px',
              transform: isActive ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            <span className="me-1">{type.icon}</span>
            {type.label}
            {count > 0 && (
              <span className="badge bg-light text-dark ms-2">
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default TypeFilter;