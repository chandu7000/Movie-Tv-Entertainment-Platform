import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getContinueWatching, PLAYBACK_PROGRESS_EVENT } from '../playbackProgress';
import SectionHeader from '../../../components/ui/SectionHeader';

const ContinueWatching = () => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const refresh = () => setItems(getContinueWatching());
    refresh();
    window.addEventListener(PLAYBACK_PROGRESS_EVENT, refresh);
    return () => window.removeEventListener(PLAYBACK_PROGRESS_EVENT, refresh);
  }, []);

  if (!items.length) return null;

  return (
    <section className='mx-auto my-10 w-full max-w-[1600px] px-4 sm:px-6 lg:px-10'>
      <SectionHeader title='Continue Watching' description='Resume titles from your saved playback progress.' />
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {items.map((item) => {
          const path = item.mediaType === 'tv' ? `/watch/tv/${item.tmdbId}/${item.season}/${item.episode}` : `/watch/movie/${item.tmdbId}`;
          const percent = item.duration ? Math.min(100, Math.round((item.currentTime / item.duration) * 100)) : 0;
          return (
            <Link key={`${item.mediaType}-${item.tmdbId}-${item.season || 0}-${item.episode || 0}`} to={path} className='overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:bg-white/[0.07]'>
              <div className='aspect-video bg-neutral-900'>{item.backdrop ? <img src={item.backdrop} alt='' className='h-full w-full object-cover' /> : null}</div>
              <div className='p-4'><p className='font-bold text-white'>{item.title || 'Continue watching'}</p><div className='mt-3 h-1.5 overflow-hidden rounded-full bg-white/10'><div className='h-full bg-red-600' style={{ width: `${percent}%` }} /></div><p className='mt-2 text-xs text-neutral-500'>{percent}% watched</p></div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default ContinueWatching;
