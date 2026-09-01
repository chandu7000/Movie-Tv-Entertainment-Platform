import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import RatingBadge from '../ui/RatingBadge';
import MediaPlaceholder from '../ui/MediaPlaceholder';

const LandscapeCard = ({ data, media_type }) => {
  const imageURL = useSelector((state) => state.movieData.imageURL);
  const mediaType = data?.media_type ?? media_type;
  const imagePath = data?.poster_path || data?.backdrop_path;

  if (!mediaType || !data?.id) return null;

  return (
    <Link to={`/${mediaType}/${data.id}`} className='group relative block aspect-[2/3] w-[calc((100vw-3rem)/3)] min-w-[calc((100vw-3rem)/3)] overflow-hidden rounded-xl sm:aspect-video sm:w-[360px] sm:min-w-[360px] sm:rounded-2xl border border-white/10 bg-neutral-900 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl hover:shadow-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:w-[360px] sm:min-w-[360px]'>
      {imagePath ? <img src={`${imageURL}${imagePath}`} alt={data?.title || data?.name || 'Media backdrop'} className='h-full w-full object-cover transition duration-500 group-hover:scale-105' loading='lazy' /> : <MediaPlaceholder title={data?.title || data?.name || 'CineVerse title'} compact />}
      <div className='absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent' />
      <div className='absolute inset-x-0 bottom-0 flex items-end justify-between gap-1 p-1.5 sm:gap-3 sm:p-4'><h3 className='line-clamp-2 text-[10px] font-extrabold leading-tight text-white sm:line-clamp-1 sm:text-base'>{data?.title || data?.name}</h3><RatingBadge value={data?.vote_average} voteCount={data?.vote_count} /></div>
    </Link>
  );
};

export default LandscapeCard;
