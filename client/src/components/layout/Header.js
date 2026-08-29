import React, { useEffect, useState } from 'react';
import logo from '../../assets/cineverse-logo.png';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { IoIosSearch } from 'react-icons/io';
import { FaRegUserCircle } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import { navigation } from '../../constants/navigation';
import IconButton from '../ui/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import { openAuthGate } from '../../features/auth/authGateSlice';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const requireAuth = (feature = 'this feature') => {
    dispatch(openAuthGate({
      title: `Sign in to access ${feature}`,
      message: 'Login or create an account to unlock CineVerse movies, TV shows, search, trailers and personalized features.',
    }));
  };

  const handleSearch = () => {
    if (!user) {
      requireAuth('Search');
      return;
    }

    navigate('/search');
  };

  const firstName = user?.name?.trim()?.split(' ')[0] || 'User';

  return (
    <header className={`fixed inset-x-0 top-0 z-50 h-16 transition duration-300 ${scrolled ? 'border-b border-white/10 bg-neutral-950/90 shadow-2xl shadow-black/20 backdrop-blur-xl' : 'bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm'}`}>
      <div className='mx-auto flex h-full w-full max-w-[1600px] items-center gap-5 px-4 sm:px-6 lg:px-10'>

        <Link
          to='/'
          aria-label='CineVerse home'
          className='flex shrink-0 items-center gap-2'
        >
          <img
            src={logo}
            alt='CineVerse logo'
            className='h-10 w-10 rounded-full object-cover shadow-lg shadow-red-950/30'
          />

          <span className='hidden text-sm font-black uppercase tracking-[0.2em] text-white xl:inline'>
            CineVerse
          </span>
        </Link>

        <nav
          className='hidden items-center gap-1 lg:flex'
          aria-label='Primary navigation'
        >
          {navigation.map((nav) =>
            nav.href === '/search' ? (
              user ? (
                <NavLink
                  key={nav.label}
                  to={nav.href}
                  className={({ isActive }) =>
                    `rounded-full px-3.5 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                      isActive
                        ? 'bg-white text-neutral-950'
                        : 'text-neutral-300 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  {nav.label}
                </NavLink>
              ) : (
                <button
                  key={nav.label}
                  type='button'
                  onClick={() => requireAuth(nav.label)}
                  className='rounded-full px-3.5 py-2 text-sm font-bold text-neutral-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60'
                >
                  {nav.label}
                </button>
              )
            ) : user || nav.href === '/' ? (
              <NavLink
                key={nav.label}
                to={nav.href}
                end={nav.end}
                className={({ isActive }) =>
                  `rounded-full px-3.5 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                    isActive
                      ? 'bg-white text-neutral-950'
                      : 'text-neutral-300 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                {nav.label}
              </NavLink>
            ) : (
              <button
                key={nav.label}
                type='button'
                onClick={() => requireAuth(nav.label)}
                className='rounded-full px-3.5 py-2 text-sm font-bold text-neutral-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60'
              >
                {nav.label}
              </button>
            )
          )}
        </nav>

        <div className='ml-auto flex items-center gap-2 sm:gap-3'>

          <IconButton
            className='lg:hidden'
            variant='glass'
            aria-label='Open search'
            onClick={handleSearch}
          >
            <IoIosSearch />
          </IconButton>

          {user ? (
            <div className='hidden items-center gap-2 md:flex'>

              <span className='mr-1 whitespace-nowrap text-sm font-bold text-white'>
                Hi, {firstName}
              </span>

              <Link
                to='/watchlist'
                className='rounded-full px-3 py-2 text-sm font-bold text-neutral-300 transition hover:bg-white/10 hover:text-white'
              >
                Watchlist
              </Link>

              <Link
                to='/favorites'
                className='rounded-full px-3 py-2 text-sm font-bold text-neutral-300 transition hover:bg-white/10 hover:text-white'
              >
                Favorites
              </Link>

              <Link
                to='/settings'
                className='flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-bold text-neutral-300 transition hover:bg-white/10 hover:text-white'
              >
                <FiSettings />

                <span className='hidden xl:inline'>
                  Settings
                </span>
              </Link>

            </div>
          ) : (
            <div className='hidden items-center gap-2 md:flex'>

              <Link
                to='/login'
                className='rounded-full px-3 py-2 text-sm font-bold text-neutral-300 hover:text-white'
              >
                Login
              </Link>

              <Link
                to='/register'
                className='rounded-full bg-white px-4 py-2 text-sm font-black text-neutral-950 hover:bg-neutral-200'
              >
                Register
              </Link>

            </div>
          )}

          {user ? (
            <IconButton
              className='md:hidden'
              variant='glass'
              aria-label='Open profile'
              onClick={() => navigate('/profile')}
            >
              <FaRegUserCircle />
            </IconButton>
          ) : null}

        </div>
      </div>
    </header>
  );
};

export default Header;