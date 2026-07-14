import React from 'react';

const GlassHeading = ({ children, className = '' }) => {
  return (
    <div className={`glass-box inline-block w-auto px-8 py-4 ${className}`}>
      {children}
    </div>
  );
};

export default GlassHeading;