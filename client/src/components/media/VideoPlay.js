import React from 'react';
import useFetchDetails from '../../hooks/useFetchDetails';
import ErrorState from '../ui/ErrorState';
import Skeleton from '../ui/Skeleton';
import Modal from '../ui/Modal';

const VideoPlay = ({ data, close, media_type }) => {
  const { data: videoData, loading, error } = useFetchDetails(
    `/${media_type}/${data?.id}/videos`
  );

  const video = videoData?.results?.find(
    (item) => item.site === 'YouTube' && item.type === 'Trailer'
  ) || videoData?.results?.find((item) => item.site === 'YouTube');

  return (
    <Modal close={close} label='Trailer player' className='aspect-video max-w-screen-lg'>
      {loading ? (
        <Skeleton className='h-full w-full rounded-none' />
      ) : error ? (
        <div className='flex h-full items-center justify-center p-6'>
          <ErrorState message='Unable to load the trailer right now.' />
        </div>
      ) : video?.key ? (
        <iframe
          src={`https://www.youtube.com/embed/${video.key}`}
          className='h-full w-full'
          title={`Video Player - ${video.name || 'Trailer'}`}
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
        />
      ) : (
        <div className='flex h-full items-center justify-center px-6 text-center text-neutral-400'>
          No trailer is available for this title.
        </div>
      )}
    </Modal>
  );
};

export default VideoPlay;
