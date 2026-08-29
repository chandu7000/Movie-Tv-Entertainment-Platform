import React from 'react';
import Button from '../../../components/ui/Button';

const languageOptions = [
  { label: 'All languages', value: '' },
  { label: 'English', value: 'en' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Telugu', value: 'te' },
  { label: 'Tamil', value: 'ta' },
  { label: 'Korean', value: 'ko' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Spanish', value: 'es' },
];

const selectClass = 'w-full rounded-xl border border-white/10 bg-neutral-900 px-3 py-2.5 text-sm text-neutral-200 outline-none transition focus:border-white/30';

const TvDiscoveryControls = ({ filters, genres, onChange, onReset }) => (
  <div className='mb-7 rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur sm:p-5'>
    <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-5'>
      <label className='text-xs font-bold uppercase tracking-wider text-neutral-500'>
        Genre
        <select className={`${selectClass} mt-2 normal-case`} value={filters.genre} onChange={(e) => onChange('genre', e.target.value)}>
          <option value=''>All genres</option>
          {genres.map((genre) => <option key={genre.id} value={genre.id}>{genre.name}</option>)}
        </select>
      </label>

      <label className='text-xs font-bold uppercase tracking-wider text-neutral-500'>
        First air year
        <input
          className={`${selectClass} mt-2 normal-case`}
          type='number'
          min='1950'
          max={new Date().getFullYear() + 2}
          placeholder='Any year'
          value={filters.year}
          onChange={(e) => onChange('year', e.target.value)}
        />
      </label>

      <label className='text-xs font-bold uppercase tracking-wider text-neutral-500'>
        Minimum rating
        <select className={`${selectClass} mt-2 normal-case`} value={filters.rating} onChange={(e) => onChange('rating', e.target.value)}>
          <option value=''>Any rating</option>
          <option value='6'>6+</option>
          <option value='7'>7+</option>
          <option value='8'>8+</option>
          <option value='9'>9+</option>
        </select>
      </label>

      <label className='text-xs font-bold uppercase tracking-wider text-neutral-500'>
        Language
        <select className={`${selectClass} mt-2 normal-case`} value={filters.language} onChange={(e) => onChange('language', e.target.value)}>
          {languageOptions.map((option) => <option key={option.value || 'all'} value={option.value}>{option.label}</option>)}
        </select>
      </label>

      <label className='text-xs font-bold uppercase tracking-wider text-neutral-500'>
        Sort by
        <select className={`${selectClass} mt-2 normal-case`} value={filters.sort} onChange={(e) => onChange('sort', e.target.value)}>
          <option value='popularity.desc'>Popularity</option>
          <option value='vote_average.desc'>Rating</option>
          <option value='first_air_date.desc'>First air date</option>
          <option value='name.asc'>Title A–Z</option>
        </select>
      </label>
    </div>
    <div className='mt-4 flex justify-end'>
      <Button variant='secondary' onClick={onReset}>Reset TV filters</Button>
    </div>
  </div>
);

export default TvDiscoveryControls;
