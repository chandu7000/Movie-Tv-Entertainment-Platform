import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTrashCan } from 'react-icons/fa6';
import PosterCard from '../../../components/media/PosterCard';
import { getFavorites, clearFavorites, FAVORITES_EVENT } from '../favorites';
import { getRecentlyViewed, clearRecentlyViewed, RECENTLY_VIEWED_EVENT } from '../../history/recentlyViewed';
import { getContinueWatching, clearAllPlaybackProgress, PLAYBACK_PROGRESS_EVENT } from '../../history/playbackProgress';

const configFor = (pathname) => {
  if (pathname.endsWith('/favorites')) return { type: 'favorites', title: 'Favorites', description: 'Your saved movies, series and shows.' };
  if (pathname.endsWith('/continue')) return { type: 'continue', title: 'Continue Watching', description: 'Pick up where you left off.' };
  return { type: 'history', title: 'Watch History', description: 'Your 10 most recently viewed titles.' };
};

const MeCollectionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const config = useMemo(() => configFor(location.pathname), [location.pathname]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const read = () => {
      if (config.type === 'favorites') setItems(getFavorites());
      else if (config.type === 'continue') setItems(getContinueWatching());
      else setItems(getRecentlyViewed());
    };
    read();
    const eventName = config.type === 'favorites' ? FAVORITES_EVENT : config.type === 'continue' ? PLAYBACK_PROGRESS_EVENT : RECENTLY_VIEWED_EVENT;
    window.addEventListener(eventName, read);
    return () => window.removeEventListener(eventName, read);
  }, [config.type]);

  const clear = () => {
    if (config.type === 'favorites') clearFavorites();
    else if (config.type === 'continue') clearAllPlaybackProgress();
    else clearRecentlyViewed();
  };

  return (
    <div className='mx-auto w-full max-w-[1200px] px-3 pb-28 pt-5 sm:px-6 sm:pt-8 lg:px-10 lg:pb-12'>
      <div className='mb-5 flex items-start justify-between gap-3'>
        <div>
          <button type='button' onClick={() => navigate('/me')} className='mb-3 inline-flex items-center gap-2 text-sm font-bold text-neutral-400 transition hover:text-white'><FaArrowLeft /> Back</button>
          <h1 className='text-2xl font-black text-white sm:text-3xl'>{config.title}</h1>
          <p className='mt-1 text-sm text-neutral-500'>{config.description}</p>
        </div>
        {items.length ? <button type='button' onClick={clear} className='mt-8 inline-flex h-9 items-center gap-2 rounded-xl border border-white/10 px-3 text-xs font-bold text-neutral-400 transition hover:bg-white/5 hover:text-white'><FaTrashCan /> Clear</button> : null}
      </div>

      {!items.length ? <div className='rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-5 py-12 text-center text-sm text-neutral-500'>Nothing here yet. Titles will appear as you use CineVerse.</div> : null}

      {config.type === 'continue' && items.length ? (
        <div className='space-y-2'>
          {items.map((item) => {
            const path = item.mediaType === 'tv' ? `/watch/tv/${item.tmdbId}/${item.season}/${item.episode}` : `/watch/movie/${item.tmdbId}`;
            const percent = item.duration ? Math.min(100, Math.round((item.currentTime / item.duration) * 100)) : 0;
            return <Link key={`${item.mediaType}-${item.tmdbId}-${item.season || 0}-${item.episode || 0}`} to={path} className='flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition hover:bg-white/[0.06]'><div className='h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-900'>{item.backdrop ? <img src={item.backdrop} alt='' className='h-full w-full object-cover' /> : null}</div><div className='min-w-0 flex-1'><p className='line-clamp-1 font-bold text-white'>{item.title || 'Continue Watching'}</p><div className='mt-2 h-1.5 overflow-hidden rounded-full bg-white/10'><div className='h-full bg-blue-500' style={{ width: `${percent}%` }} /></div><p className='mt-1 text-xs text-neutral-500'>{percent}% complete</p></div></Link>;
          })}
        </div>
      ) : null}

      {config.type !== 'continue' && items.length ? (
        <div className='grid grid-cols-3 gap-1.5 sm:grid-cols-[repeat(auto-fit,230px)] sm:justify-start sm:gap-5'>
          {items.map((item) => <PosterCard key={`${item.media_type}-${item.id}`} data={item} media_type={item.media_type} />)}
        </div>
      ) : null}
    </div>
  );
};

export default MeCollectionPage;
