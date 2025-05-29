import React from 'react';

export const ResponsiveIndicator = () => {
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-neutral-dark text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
        <span className="mobile:hidden">default (&lt;320px)</span>
        <span className="hidden mobile:inline tablet:hidden">mobile (≥320px)</span>
        <span className="hidden tablet:inline desktop:hidden">tablet (≥769px)</span>
        <span className="hidden desktop:inline">desktop (≥1025px)</span>
      </div>
    </div>
  );
}; 