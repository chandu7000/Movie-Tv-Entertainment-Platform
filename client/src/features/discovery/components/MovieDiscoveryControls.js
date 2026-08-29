import React from 'react';

const fieldClass = 'min-h-10 rounded-xl border border-white/10 bg-neutral-900 px-3 text-sm text-white outline-none transition focus:border-white/30 focus:ring-2 focus:ring-white/10';

const MovieDiscoveryControls = ({ filters, genres, onChange, onReset }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, index) => currentYear - index);

  return (
    <div className='mb-7 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm'>
      <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-5'>
        <label className='flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wide text-neutral-500'>
          Genre
          <select className={fieldClass} value={filters.genre} onChange={(event) => onChange('genre', event.target.value)}>
            <option value=''>All genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>
        </label>

        <label className='flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wide text-neutral-500'>
          Release year
          <select className={fieldClass} value={filters.year} onChange={(event) => onChange('year', event.target.value)}>
            <option value=''>Any year</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </label>

        <label className='flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wide text-neutral-500'>
          Minimum rating
          <select className={fieldClass} value={filters.rating} onChange={(event) => onChange('rating', event.target.value)}>
            <option value=''>Any rating</option>
            <option value='5'>5+</option>
            <option value='6'>6+</option>
            <option value='7'>7+</option>
            <option value='8'>8+</option>
          </select>
        </label>

        <label className='flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wide text-neutral-500'>
          Language
          <select className={fieldClass} value={filters.language} onChange={(event) => onChange('language', event.target.value)}>
            <option value=''>Any language</option>
            <option value='en'>English</option>
            <option value='hi'>Hindi</option>
            <option value='te'>Telugu</option>
            <option value='ta'>Tamil</option>
            <option value='ko'>Korean</option>
            <option value='ja'>Japanese</option>
            <option value='es'>Spanish</option>
          </select>
        </label>

        <label className='flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wide text-neutral-500'>
          Sort by
          <select className={fieldClass} value={filters.sort} onChange={(event) => onChange('sort', event.target.value)}>
            <option value='popularity.desc'>Popularity</option>
            <option value='primary_release_date.desc'>Release date</option>
            <option value='vote_average.desc'>Rating</option>
          </select>
        </label>
      </div>

      <div className='mt-4 flex justify-end'>
        <button
          type='button'
          onClick={onReset}
          className='rounded-xl px-3 py-2 text-sm font-bold text-neutral-400 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60'
        >
          Reset filters
        </button>
      </div>
    </div>
  );
};

export default MovieDiscoveryControls;
