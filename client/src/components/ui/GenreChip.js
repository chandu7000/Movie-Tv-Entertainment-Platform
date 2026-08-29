import React from 'react';

const GenreChip = ({ children, className = '' }) => (
  <span className={`inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-neutral-200 ${className}`}>
    {children}
  </span>
);

export default GenreChip;
