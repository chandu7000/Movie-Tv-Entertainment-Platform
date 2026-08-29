import React, { useRef, useState } from 'react';
import Card from './Card';
import LandscapeCard from './LandscapeCard';
import { FaAngleLeft, FaAngleRight, FaEllipsis } from 'react-icons/fa6';
import SectionHeader from '../ui/SectionHeader';
import IconButton from '../ui/IconButton';
import Skeleton from '../ui/Skeleton';
import ErrorState from '../ui/ErrorState';
import EmptyState from '../ui/EmptyState';

const HorizontalScrollCard = ({ data = [], heading, trending, media_type, variant = 'poster', loading = false, error = null, onRetry, onRemoveItem }) => {
  const containerRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(null);
  const scrollBy = (distance) => containerRef.current?.scrollBy({ left: distance, behavior: 'smooth' });
  const isLandscape = variant === 'landscape';

  const renderCard = (item, index) => {
    const key = `${item.id}-${item.media_type || media_type || 'media'}-${index}`;
    const card = isLandscape
      ? <LandscapeCard data={item} media_type={media_type} />
      : <Card data={item} index={index + 1} trending={trending} media_type={media_type} />;

    if (!onRemoveItem) return <React.Fragment key={key}>{card}</React.Fragment>;

    return (
      <div key={key} className='relative'>
        {card}
        <button
          type='button'
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setOpenMenu((current) => current === key ? null : key);
          }}
          className='absolute right-2 top-2 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white shadow-lg backdrop-blur-md transition hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70'
          aria-label={`More options for ${item.title || item.name || 'title'}`}
          aria-expanded={openMenu === key}
        >
          <FaEllipsis />
        </button>

        {openMenu === key ? (
          <div className='absolute right-2 top-12 z-40 min-w-[120px] rounded-xl border border-white/10 bg-neutral-950/95 p-1.5 shadow-2xl backdrop-blur-xl'>
            <button
              type='button'
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setOpenMenu(null);
                onRemoveItem(item);
              }}
              className='w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-300 transition hover:bg-red-500/10 hover:text-red-200'
            >
              Remove
            </button>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <section className='container mx-auto my-10 px-4 lg:px-10'>
      <SectionHeader title={heading} />
      {loading ? <div className='grid grid-flow-col gap-4 overflow-hidden'>{Array.from({ length: isLandscape ? 4 : 6 }).map((_, i) => <Skeleton key={i} className={isLandscape ? 'h-52 w-[360px]' : 'h-80 w-[230px]'} />)}</div> : null}
      {!loading && error ? <ErrorState message={`Unable to load ${heading.toLowerCase()}.`} onRetry={onRetry} /> : null}
      {!loading && !error && !data.length ? <EmptyState title={`No ${heading.toLowerCase()} available`} message='There is no content to show in this section right now.' /> : null}
      {!loading && !error && data.length ? (
        <div className='relative'>
          <div ref={containerRef} className={`scrollBar-none relative z-10 grid grid-flow-col gap-4 overflow-x-auto scroll-smooth ${isLandscape ? 'grid-cols-[repeat(auto-fit,300px)] sm:grid-cols-[repeat(auto-fit,360px)]' : 'grid-cols-[repeat(auto-fit,230px)]'}`}>
            {data.map(renderCard)}
          </div>
          <div className='pointer-events-none absolute inset-0 hidden items-center justify-between lg:flex'>
            <IconButton onClick={() => scrollBy(-500)} className='pointer-events-auto -ml-5 shadow-xl' aria-label={`Scroll ${heading} left`}><FaAngleLeft /></IconButton>
            <IconButton onClick={() => scrollBy(500)} className='pointer-events-auto -mr-5 shadow-xl' aria-label={`Scroll ${heading} right`}><FaAngleRight /></IconButton>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default HorizontalScrollCard;
