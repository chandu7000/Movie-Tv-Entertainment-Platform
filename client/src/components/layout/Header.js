import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { IoIosSearch } from 'react-icons/io';
import { FaArrowRight } from 'react-icons/fa6';
import logo from '../../assets/cineverse-logo.png';
import { navigation } from '../../constants/navigation';

const HeaderSearch = ({ mobile = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(urlQuery);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    const value = query.trim();

    if (value === urlQuery) return undefined;

    const timer = window.setTimeout(() => {
      if (value.length >= 2) {
        navigate(`/search?q=${encodeURIComponent(value)}`, { replace: location.pathname === '/search' });
      } else if (location.pathname === '/search') {
        navigate('/', { replace: true });
      }
    }, 450);

    return () => window.clearTimeout(timer);
  }, [location.pathname, navigate, query, urlQuery]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = query.trim();
    if (value.length >= 2) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    }
  };

  const clearSearch = () => {
    setQuery('');
    if (location.pathname === '/search') {
      navigate('/', { replace: true });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      role='search'
      className={mobile ? 'w-full' : 'ml-auto w-full max-w-[560px]'}
    >
      <label className='sr-only' htmlFor={mobile ? 'mobile-header-search' : 'desktop-header-search'}>
        Search movies and TV shows
      </label>

      <div className='group rounded-2xl bg-gradient-to-r from-white/20 via-white/5 to-blue-500/25 p-px shadow-lg shadow-black/20 transition duration-300 focus-within:from-blue-500/70 focus-within:via-sky-400/25 focus-within:to-blue-500/70'>
        <div className='flex h-12 items-center gap-2 rounded-[15px] bg-neutral-900/95 px-2 backdrop-blur-xl transition duration-300 group-focus-within:bg-neutral-900'>
          <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.07] text-neutral-300 transition duration-300 group-focus-within:bg-blue-500/15 group-focus-within:text-blue-400'>
            <IoIosSearch className='text-xl' />
          </span>

          <input
            id={mobile ? 'mobile-header-search' : 'desktop-header-search'}
            type='search'
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='Search movies & TV shows...'
            autoComplete='off'
            className='min-w-0 flex-1 bg-transparent px-1 text-sm font-semibold text-white outline-none placeholder:font-medium placeholder:text-neutral-500 [&::-webkit-search-cancel-button]:hidden'
          />

          {query ? (
            <button
              type='button'
              onClick={clearSearch}
              aria-label='Clear search'
              className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-lg font-bold text-neutral-400 transition hover:bg-white/10 hover:text-white'
            >
              ×
            </button>
          ) : null}

          <button
            type='submit'
            aria-label='Search'
            className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-neutral-950 transition duration-200 hover:bg-blue-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 active:scale-95'
          >
            <FaArrowRight className='text-sm' />
          </button>
        </div>
      </div>
    </form>
  );
};

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 h-16 transition duration-300 ${scrolled ? 'border-b border-white/10 bg-neutral-950/95 shadow-2xl shadow-black/20 backdrop-blur-xl' : 'bg-neutral-950/90 backdrop-blur-xl lg:bg-gradient-to-b lg:from-black/85 lg:to-black/30'}`}>
      <div className='mx-auto flex h-full w-full max-w-[1600px] items-center px-3 sm:px-6 lg:px-10'>
        <div className='w-full lg:hidden'>
          <HeaderSearch mobile />
        </div>

        <div className='hidden h-full w-full items-center gap-5 lg:flex'>
          <Link to='/' aria-label='CineVerse home' className='flex shrink-0 items-center gap-2.5'>
            <img src={logo} alt='CineVerse logo' className='h-10 w-10 shrink-0 object-contain drop-shadow-[0_0_12px_rgba(239,68,68,0.28)]' />
            <span className='text-xl font-black tracking-[0.08em] text-white'>CINEVERSE</span>
          </Link>

          <nav className='flex shrink-0 items-center gap-1' aria-label='Primary navigation'>
            {navigation.map((nav) => (
              <NavLink key={nav.label} to={nav.href} end={nav.end} className={({ isActive }) => `rounded-full px-3.5 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${isActive ? 'bg-white text-neutral-950' : 'text-neutral-300 hover:bg-white/10 hover:text-white'}`}>
                {nav.label}
              </NavLink>
            ))}
          </nav>

          <HeaderSearch />
        </div>
      </div>
    </header>
  );
};

export default Header;
