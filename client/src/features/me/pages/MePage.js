import React from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight, FaClockRotateLeft, FaHeart, FaPlay, FaSliders } from 'react-icons/fa6';

const items = [
  { label: 'Watch History', description: 'Review your 10 most recently viewed titles', href: '/me/history', icon: <FaClockRotateLeft /> },
  { label: 'Favorites', description: 'Your saved movies, series and shows', href: '/me/favorites', icon: <FaHeart /> },
  { label: 'Continue Watching', description: 'Pick up where you left off', href: '/me/continue', icon: <FaPlay /> },
  { label: 'Settings', description: 'Playback preferences and on-device data', href: '/me/settings', icon: <FaSliders /> },
];

const MePage = () => (
  <div className='mx-auto w-full max-w-[760px] px-3 pb-28 pt-5 sm:px-6 sm:pt-8 lg:px-10 lg:pb-12'>
    <div className='mb-5'>
      <p className='text-xs font-black uppercase tracking-[0.22em] text-blue-400'>Your library</p>
      <h1 className='mt-1 text-2xl font-black text-white sm:text-3xl'>My CineVerse</h1>
      <p className='mt-1 text-sm text-neutral-500'>Your watch activity, favorites and preferences stay on this device. No account required.</p>
    </div>

    <div className='overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]'>
      {items.map((item, index) => (
        <Link key={item.href} to={item.href} className={`flex min-h-20 items-center gap-3 px-4 py-3 transition hover:bg-white/[0.05] ${index ? 'border-t border-white/10' : ''}`}>
          <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-base text-blue-300'>{item.icon}</span>
          <span className='min-w-0 flex-1'>
            <span className='block font-extrabold text-white'>{item.label}</span>
            <span className='mt-0.5 block text-xs text-neutral-500'>{item.description}</span>
          </span>
          <FaChevronRight className='shrink-0 text-sm text-neutral-600' />
        </Link>
      ))}
    </div>
  </div>
);

export default MePage;
