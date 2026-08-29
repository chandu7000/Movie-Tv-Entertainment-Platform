import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import RatingBadge from '../ui/RatingBadge';
import { openAuthGate } from '../../features/auth/authGateSlice';

const LandscapeCard = ({ data, media_type }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const imageURL = useSelector((state) => state.movieData.imageURL);
  const mediaType = data?.media_type ?? media_type;
  const imagePath = data?.backdrop_path || data?.poster_path;

  if (!mediaType || !data?.id) return null;

  const handleGuestClick = (event) => {
    if (user) return;
    event.preventDefault();
    dispatch(openAuthGate({ title: 'Sign in to view title details', message: 'Login or create an account to open full title details and CineVerse features.' }));
  };

  return (
    <Link to={`/${mediaType}/${data.id}`} onClick={handleGuestClick} className='group relative block aspect-video w-[300px] min-w-[300px] overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl hover:shadow-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:w-[360px] sm:min-w-[360px]'>
      {imagePath ? <img src={`${imageURL}${imagePath}`} alt={data?.title || data?.name || 'Media backdrop'} className='h-full w-full object-cover transition duration-500 group-hover:scale-105' loading='lazy' /> : <div className='flex h-full items-center justify-center text-sm text-neutral-500'>No image available</div>}
      <div className='absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent' />
      <div className='absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4'><h3 className='line-clamp-1 font-bold text-white'>{data?.title || data?.name}</h3><RatingBadge value={data?.vote_average} /></div>
    </Link>
  );
};

export default LandscapeCard;
