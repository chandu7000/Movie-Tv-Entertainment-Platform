import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiSettings, FiLogOut } from 'react-icons/fi';
import { FaRegUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import { logout } from '../../auth/authSlice';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className='py-10'>
      <div className='mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-10'>

        <div className='mb-8 flex items-center gap-3'>
          <div className='flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]'>
            <FiSettings className='text-xl text-white' />
          </div>

          <div>
            <h1 className='text-2xl font-black text-white sm:text-3xl'>
              Settings
            </h1>
            <p className='mt-1 text-sm text-neutral-400'>
              Manage your CineVerse account and application preferences.
            </p>
          </div>
        </div>

        <section className='rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6'>
          <h2 className='mb-5 text-lg font-black text-white'>
            Account
          </h2>

          <div className='flex items-center gap-4'>
            <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]'>
              <FaRegUserCircle className='text-2xl text-neutral-300' />
            </div>

            <div className='min-w-0'>
              <p className='truncate font-bold text-white'>
                {user?.name || 'CineVerse User'}
              </p>

              {user?.email ? (
                <p className='truncate text-sm text-neutral-400'>
                  {user.email}
                </p>
              ) : null}
            </div>
          </div>

          <button
            type='button'
            onClick={() => navigate('/profile')}
            className='mt-5 rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-neutral-300 transition hover:bg-white/10 hover:text-white'
          >
            Open Profile
          </button>
        </section>

        <section className='mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6'>
          <h2 className='text-lg font-black text-white'>
            Preferences
          </h2>

          <p className='mt-2 text-sm leading-6 text-neutral-400'>
            More CineVerse settings such as appearance, playback and notification preferences can be added here later.
          </p>
        </section>

        <section className='mt-6 rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-5 sm:p-6'>
          <h2 className='text-lg font-black text-white'>
            Session
          </h2>

          <p className='mt-2 text-sm leading-6 text-neutral-400'>
            Sign out of your current CineVerse account on this device.
          </p>

          <Button
            variant='secondary'
            className='mt-5'
            onClick={handleLogout}
          >
            <FiLogOut />
            Logout
          </Button>
        </section>

      </div>
    </div>
  );
};

export default SettingsPage;