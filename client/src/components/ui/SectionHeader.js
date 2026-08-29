import React from 'react';

const SectionHeader = ({ title, description }) => (
  <div className='mb-4 flex items-end justify-between gap-4'>
    <div>
      <h2 className='text-xl font-bold tracking-tight text-white lg:text-2xl'>{title}</h2>
      {description ? <p className='mt-1 text-sm text-neutral-400'>{description}</p> : null}
    </div>
  </div>
);

export default SectionHeader;
