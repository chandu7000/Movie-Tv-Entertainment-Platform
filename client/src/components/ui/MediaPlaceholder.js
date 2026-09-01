import React from 'react';
import { FaClapperboard } from 'react-icons/fa6';

const MediaPlaceholder = ({ title = 'CineVerse', compact = false, className = '' }) => (
  <div
    className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-800 via-neutral-950 to-black ${className}`}
    aria-label={`Artwork unavailable for ${title}`}
  >
    <div className='absolute -left-12 -top-12 h-36 w-36 rounded-full bg-blue-500/10 blur-3xl' />
    <div className='absolute -bottom-16 -right-12 h-40 w-40 rounded-full bg-red-500/10 blur-3xl' />
    <div className='relative flex max-w-[85%] flex-col items-center text-center'>
      <span className={`flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-neutral-300 shadow-xl ${compact ? 'h-10 w-10 text-base' : 'h-14 w-14 text-xl'}`}>
        <FaClapperboard />
      </span>
      {!compact ? <p className='mt-3 line-clamp-2 text-sm font-bold text-neutral-300'>{title}</p> : null}
      <p className={`${compact ? 'mt-1 text-[10px]' : 'mt-1.5 text-xs'} font-semibold uppercase tracking-[0.18em] text-neutral-600`}>Artwork unavailable</p>
    </div>
  </div>
);

export default MediaPlaceholder;
