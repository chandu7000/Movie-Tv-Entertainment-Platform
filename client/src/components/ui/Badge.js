import React from 'react';

const Badge = ({ children, className = '' }) => (
  <span className={`inline-flex items-center rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-neutral-100 ring-1 ring-white/10 backdrop-blur-md ${className}`}>
    {children}
  </span>
);

export default Badge;
