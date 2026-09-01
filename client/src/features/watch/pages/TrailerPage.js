import React from 'react';
import { Link, useParams } from 'react-router-dom';
import useFetchDetails from '../../../hooks/useFetchDetails';
import Skeleton from '../../../components/ui/Skeleton';
import TrailerPlayer from '../components/TrailerPlayer';

const TrailerPage = () => {
  const { mediaType, id, videoKey } = useParams();
  const safeMediaType = mediaType === 'tv' ? 'tv' : 'movie';
  const { data: details, loading } = useFetchDetails(`/${safeMediaType}/${id}`);

  if (loading && !details) {
    return <div className='mx-auto w-full max-w-[1400px] px-0 py-0 lg:px-10 lg:py-8'><Skeleton className='aspect-video w-full' /></div>;
  }

  const title = details?.title || details?.name || 'Trailer';

  return (
    <div className='trailer-page mx-auto w-full max-w-[1400px] px-0 py-0 lg:px-10 lg:py-8'>
      <div className='mb-3 flex flex-wrap items-end justify-between gap-3 px-3 pt-3 sm:px-5 sm:pt-5 lg:mb-5 lg:px-0 lg:pt-0'>
        <div>
          <p className='text-xs font-black uppercase tracking-[0.24em] text-red-500'>Official Trailer</p>
          <h1 className='mt-2 text-2xl font-black text-white sm:text-3xl'>{title}</h1>
        </div>
        <Link to={`/${safeMediaType}/${id}`} className='text-sm font-bold text-neutral-400 hover:text-white'>Back to Details</Link>
      </div>

      <TrailerPlayer videoKey={videoKey} title={title} />

      <div className='mx-3 mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:mx-5 sm:mt-5 lg:mx-0 lg:mt-6 lg:p-5'>
        <p className='text-sm leading-6 text-neutral-400'>Trailer playback stays inside CineVerse using a privacy-enhanced video embed.</p>
      </div>
    </div>
  );
};

export default TrailerPage;
