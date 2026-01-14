/**
 * ===================================
 * REUSABLE CARD COMPONENT
 * Smart Tourist Safety Monitoring System
 * ===================================
 */

import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  padding = 'md',
  hover = false,
  ...props 
}) => {
  const paddingSizes = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`
        bg-global-surface 
        rounded-xl 
        shadow-sm
        border border-gray-100
        ${paddingSizes[padding]}
        ${hover ? 'hover:shadow-md transition-shadow duration-200' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
