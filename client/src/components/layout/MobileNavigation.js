import React from 'react';
import { mobileNavigation } from '../../constants/navigation';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { openAuthGate } from '../../features/auth/authGateSlice';

const MobileNavigation = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const requireAuth = (label) => dispatch(openAuthGate({
    title: `Sign in to access ${label}`,
    message: 'Login or create an account to unlock the full CineVerse experience.',
  }));

  return (
    <nav className='fixed inset-x-3 bottom-3 z-50 rounded-2xl border border-white/10 bg-neutral-950/90 p-1 shadow-2xl shadow-black/50 backdrop-blur-xl lg:hidden' aria-label='Mobile navigation'>
      <div className='grid grid-cols-4 gap-1 text-neutral-400'>
        {mobileNavigation.map((nav) => user || nav.href === '/' ? (
          <NavLink key={`${nav.label}-mobile-navigation`} to={nav.href} end={nav.end} className={({ isActive }) => `flex min-h-12 flex-col items-center justify-center rounded-xl px-2 py-1.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${isActive ? 'bg-white text-neutral-950' : 'hover:bg-white/10 hover:text-white'}`}>
            <div className='text-lg'>{nav.icon}</div><p className='mt-0.5 text-[10px] font-bold sm:text-xs'>{nav.label}</p>
          </NavLink>
        ) : (
          <button key={`${nav.label}-mobile-navigation`} type='button' onClick={() => requireAuth(nav.label)} className='flex min-h-12 flex-col items-center justify-center rounded-xl px-2 py-1.5 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60'>
            <div className='text-lg'>{nav.icon}</div><p className='mt-0.5 text-[10px] font-bold sm:text-xs'>{nav.label}</p>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavigation;
