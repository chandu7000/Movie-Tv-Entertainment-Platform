import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { openAuthGate } from '../../features/auth/authGateSlice';

const Footer = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const links = [['Home', '/'], ['Movies', '/movie'], ['TV Shows', '/tv'], ['Discover', '/discover'], ['Search', '/search']];

  return (
    <footer className='border-t border-white/10 bg-neutral-950/95 px-4 py-10 text-sm text-neutral-400 sm:px-6 lg:px-10'>
      <div className='mx-auto flex w-full max-w-[1600px] flex-col gap-6 md:flex-row md:items-end md:justify-between'>
        <div>
          <p className='text-lg font-black tracking-tight text-white'>CineVerse</p>
          <p className='mt-2 max-w-md leading-6 text-neutral-500'>Discover movies, TV shows, trailers, cast, recommendations and more through a cinematic TMDB-powered experience.</p>
        </div>
        <div className='flex flex-wrap gap-x-5 gap-y-2 font-semibold'>
          {links.map(([label, href]) => user || href === '/' ? <Link key={href} to={href} className='transition hover:text-white'>{label}</Link> : <button key={href} type='button' onClick={() => dispatch(openAuthGate({ title: `Sign in to access ${label}`, message: 'Login or create an account to unlock CineVerse.' }))} className='transition hover:text-white'>{label}</button>)}
        </div>
      </div>
      <div className='mx-auto mt-8 w-full max-w-[1600px] border-t border-white/10 pt-5 text-xs text-neutral-600'>Created By Chandra Sekhar</div>
    </footer>
  );
};

export default Footer;
