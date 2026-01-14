/**
 * ===================================
 * REUSABLE BUTTON COMPONENT
 * Smart Tourist Safety Monitoring System
 * ===================================
 */

import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  disabled = false, 
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Variant styles using global palette
  const variants = {
    primary: 'bg-global-indigo text-white hover:bg-global-indigo/90 focus:ring-global-indigo',
    secondary: 'bg-global-surface text-global-text border-2 border-global-indigo hover:bg-global-indigo/10 focus:ring-global-indigo',
    success: 'bg-global-success text-white hover:bg-global-success/90 focus:ring-global-success',
    error: 'bg-global-error text-white hover:bg-global-error/90 focus:ring-global-error',
    ghost: 'bg-transparent text-global-indigo hover:bg-global-indigo/10 focus:ring-global-indigo',
    google: 'bg-white text-global-text border border-gray-300 hover:bg-gray-50 focus:ring-gray-400 shadow-sm',
  };

  // Size styles
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
