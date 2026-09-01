import React from 'react';

const TrailerPlayer = ({ videoKey, title }) => {
  const embedUrl = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoKey)}?controls=1&rel=0&playsinline=1&cc_load_policy=1&modestbranding=1&fs=1`;

  return (
    <div className='trailer-player-shell w-full overflow-hidden bg-black shadow-2xl lg:rounded-2xl lg:border lg:border-white/10'>
      <div className='trailer-player-frame relative w-full bg-black aspect-video'>
        <iframe
          src={embedUrl}
          loading='eager'
          title={`${title} official trailer`}
          className='absolute inset-0 h-full w-full border-0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen'
          allowFullScreen
          referrerPolicy='strict-origin-when-cross-origin'
        />
      </div>
    </div>
  );
};

export default TrailerPlayer;
