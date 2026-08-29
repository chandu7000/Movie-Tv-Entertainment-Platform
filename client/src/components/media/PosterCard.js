import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Badge from '../ui/Badge';
import RatingBadge from '../ui/RatingBadge';
import { openAuthGate } from '../../features/auth/authGateSlice';

const PosterCard = ({ data, trending, index, media_type }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const imageURL = useSelector((state) => state.movieData.imageURL);
  const mediaType = data?.media_type ?? media_type;
  const releaseDate = data?.release_date || data?.first_air_date;
  const imagePath = data?.poster_path || data?.backdrop_path;

  if (!mediaType || !data?.id) return null;

  const handleGuestClick = (event) => {
    if (user) return;
    event.preventDefault();
    dispatch(openAuthGate({
      title: 'Sign in to view title details',
      message: 'Login or create an account to open full movie and TV details, trailers, ratings and personalized features.',
    }));
  };

  return (
    <Link to={`/${mediaType}/${data.id}`} onClick={handleGuestClick} className='group relative block h-80 w-full min-w-[230px] max-w-[230px] overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl hover:shadow-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60' aria-label={`Open ${data?.title || data?.name || 'title'} details`}>
      {imagePath ? <img src={`${imageURL}${imagePath}`} alt={data?.title || data?.name || 'Media poster'} className='h-full w-full object-cover transition duration-500 group-hover:scale-105' loading='lazy' /> : <div className='flex h-full w-full items-center justify-center bg-neutral-900 px-4 text-center text-sm text-neutral-500'>No image available</div>}
      <div className='absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent' />
      {trending ? <div className='absolute left-3 top-3'><Badge>#{index} Trending</Badge></div> : null}
      <div className='absolute inset-x-0 bottom-0 p-3'>
        <h3 className='line-clamp-1 text-base font-bold text-white'>{data?.title || data?.name}</h3>
        <div className='mt-1 flex items-center justify-between gap-2 text-xs text-neutral-300'><p>{releaseDate ? moment(releaseDate).format('YYYY') : 'TBA'}</p><RatingBadge value={data?.vote_average} /></div>
      </div>
    </Link>
  );
};

export default PosterCard;
