import React from 'react';

const PersonCard = ({ person, imageURL }) => {
  if (!person?.profile_path) return null;

  return (
    <article className='group w-24 text-center'>
      <div className='h-24 w-24 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 transition duration-300 group-hover:-translate-y-1 group-hover:border-white/20'>
        <img
          src={`${imageURL}${person.profile_path}`}
          alt={person?.name || 'Cast member'}
          className='h-full w-full object-cover transition duration-500 group-hover:scale-105'
          loading='lazy'
        />
      </div>
      <p className='mt-2 line-clamp-2 text-xs font-semibold text-neutral-200'>{person?.name}</p>
      {person?.character ? <p className='mt-0.5 line-clamp-1 text-[11px] text-neutral-500'>{person.character}</p> : null}
    </article>
  );
};

export default PersonCard;
