import React from 'react';

const Card = ({ children, title, subtitle, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300 ${className}`}>
      {title && (
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {title}
        </h3>
      )}
      {subtitle && (
        <p className="text-gray-600 mb-4">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
};

export default Card;