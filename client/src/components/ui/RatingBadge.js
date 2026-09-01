import React from 'react';

const RatingBadge = ({ value, className = '', showLabel = false, voteCount }) => {
  const rating = Number(value);
  const votes = voteCount == null ? null : Number(voteCount);
  const hasMeaningfulRating = Number.isFinite(rating) && rating > 0 && (votes == null || votes > 0);

  if (!hasMeaningfulRating) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-2.5 py-1 text-xs font-bold text-neutral-300 ring-1 ring-white/10 backdrop-blur ${className}`}
        aria-label='Not rated'
      >
        <span>{showLabel ? 'Not Rated' : 'NR'}</span>
      </span>
    );
  }

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
