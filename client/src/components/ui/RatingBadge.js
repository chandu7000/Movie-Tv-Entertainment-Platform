import React from 'react';

const RatingBadge = ({ value, className = '', showLabel = false }) => {
  const rating = Number(value || 0);

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-2.5 py-1 text-xs font-bold text-amber-200 ring-1 ring-amber-300/20 backdrop-blur ${className}`}
      aria-label={`Rating ${rating.toFixed(1)} out of 10`}
    >
      <span aria-hidden='true'>★</span>
      {showLabel ? <span>Rating</span> : null}
      <span>{rating.toFixed(1)}</span>
    </span>
  );
};

export default RatingBadge;
