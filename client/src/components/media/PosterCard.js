import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Badge from '../ui/Badge';
import RatingBadge from '../ui/RatingBadge';
import MediaPlaceholder from '../ui/MediaPlaceholder';

const PosterCard = ({ data, trending, index, media_type }) => {
  const imageURL = useSelector((state) => state.movieData.imageURL);
  const mediaType = data?.media_type ?? media_type;
  const releaseDate = data?.release_date || data?.first_air_date;
  const imagePath = data?.poster_path || data?.backdrop_path;

  if (!mediaType || !data?.id) return null;

  return (
    <Link to={`/${mediaType}/${data.id}`} className='group relative block aspect-[2/3] w-[calc((100vw-3rem)/3)] min-w-[calc((100vw-3rem)/3)] max-w-[calc((100vw-3rem)/3)] overflow-hidden rounded-xl sm:h-80 sm:w-full sm:min-w-[230px] sm:max-w-[230px] sm:rounded-2xl border border-white/10 bg-neutral-900 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl hover:shadow-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60' aria-label={`Open ${data?.title || data?.name || 'title'} details`}>
      {imagePath ? <img src={`${imageURL}${imagePath}`} alt={data?.title || data?.name || 'Media poster'} className='h-full w-full object-cover transition duration-500 group-hover:scale-105' loading='lazy' /> : <MediaPlaceholder title={data?.title || data?.name || 'CineVerse title'} />}
      <div className='absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent' />
      {trending ? <div className='absolute left-1.5 top-1.5 hidden sm:block sm:left-3 sm:top-3'><Badge>#{index} Trending</Badge></div> : null}
      <div className='absolute inset-x-0 bottom-0 p-1.5 sm:p-3'><h3 className='line-clamp-2 text-[10px] font-extrabold leading-tight text-white sm:line-clamp-1 sm:text-base'>{data?.title || data?.name}</h3><div className='mt-1 flex items-center justify-between gap-1 text-[9px] text-neutral-300 sm:gap-2 sm:text-xs'><p>{releaseDate ? moment(releaseDate).format('YYYY') : 'TBA'}</p><RatingBadge value={data?.vote_average} voteCount={data?.vote_count} /></div></div>
    </Link>
  );
};

export default PosterCard;
