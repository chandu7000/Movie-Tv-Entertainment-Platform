import React from 'react';

const Skeleton = ({ className = '' }) => (
  <div aria-hidden='true' className={`animate-pulse rounded-xl bg-white/10 ${className}`} />
);

export default Skeleton;
