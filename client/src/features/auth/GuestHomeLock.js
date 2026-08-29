import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import Button from '../../components/ui/Button';

const GuestHomeLock = ({ children }) => {
  const navigate = useNavigate();

  return (
    <section className='relative'>
      <div className='sticky top-20 z-30 flex justify-center px-4 pt-7 sm:px-6 lg:px-10'>
        <div className='w-full max-w-2xl rounded-3xl border border-white/15 bg-neutral-950/95 p-6 text-center shadow-2xl shadow-black/60 backdrop-blur-xl sm:p-8'>
          <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-neutral-950'>
            <FaLock aria-hidden='true' />
          </div>
          <p className='mt-4 text-xs font-black uppercase tracking-[0.25em] text-neutral-500'>Guest Preview</p>
          <h2 className='mt-2 text-2xl font-black text-white sm:text-3xl'>Unlock the full CineVerse experience</h2>
          <p className='mx-auto mt-3 max-w-xl text-sm leading-6 text-neutral-400'>Browse the preview below, then sign in or create an account to open titles, search, watch trailers and use personalized features.</p>
          <div className='mt-6 flex flex-wrap justify-center gap-3'>
            <Button onClick={() => navigate('/login')}>Login</Button>
            <Button variant='secondary' onClick={() => navigate('/register')}>Create Account</Button>
          </div>
        </div>
      </div>

      <div className='pointer-events-none -mt-2 select-none opacity-45 blur-[4px]' aria-hidden='true'>
        {children}
      </div>
      <div className='pointer-events-none absolute inset-0 top-0 bg-gradient-to-b from-transparent via-neutral-950/5 to-neutral-950/35' />
    </section>
  );
};

export default GuestHomeLock;
