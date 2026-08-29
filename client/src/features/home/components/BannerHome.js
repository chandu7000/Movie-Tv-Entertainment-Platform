import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaAngleLeft, FaAngleRight, FaPlay } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import RatingBadge from '../../../components/ui/RatingBadge';
import IconButton from '../../../components/ui/IconButton';
import GenreChip from '../../../components/ui/GenreChip';
import VideoPlay from '../../../components/media/VideoPlay';
import useFetchDetails from '../../../hooks/useFetchDetails';
import { openAuthGate } from '../../auth/authGateSlice';

const BannerHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const bannerData = useSelector((state) => state.movieData.bannerData);
  const imageURL = useSelector((state) => state.movieData.imageURL);

  const [currentSlide, setCurrentSlide] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [playVideo, setPlayVideo] = useState(false);

  const slideCount = bannerData.length;

  const slides = useMemo(() => {
    if (!slideCount) return [];
    if (slideCount === 1) return bannerData;
    return [bannerData[slideCount - 1], ...bannerData, bannerData[0]];
  }, [bannerData, slideCount]);

  const currentImage = useMemo(() => {
    if (!slideCount) return 0;
    if (slideCount === 1) return 0;
    if (currentSlide === 0) return slideCount - 1;
    if (currentSlide === slideCount + 1) return 0;
    return Math.min(Math.max(currentSlide - 1, 0), slideCount - 1);
  }, [currentSlide, slideCount]);

  const currentData = bannerData[currentImage];
  const mediaType = currentData?.media_type || 'movie';
  const detailsEndpoint = currentData?.id ? `/${mediaType}/${currentData.id}` : '';
  const { data: detailsData } = useFetchDetails(detailsEndpoint);

  const runtime = useMemo(() => {
    const minutes = Number(detailsData?.runtime || detailsData?.episode_run_time?.[0] || 0);
    if (!minutes) return null;

    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;

    return `${hours ? `${hours}h ` : ''}${remainder}m`;
  }, [detailsData]);

  const requireAuth = (action) => dispatch(openAuthGate({
    title: `Sign in to ${action}`,
    message: 'Login or create an account to watch trailers, open title details and unlock the full CineVerse experience.',
  }));

  const handleTrailer = () => {
    if (!user) return requireAuth('watch trailers');
    setPlayVideo(true);
  };

  const handleDetails = (data) => {
    if (!user) return requireAuth('view title details');
    navigate(`/${data.media_type}/${data.id}`);
  };

  const handleNext = () => {
    if (slideCount <= 1) return;

    setPlayVideo(false);
    setTransitionEnabled(true);
    setCurrentSlide((previous) => Math.min(previous + 1, slideCount + 1));
  };

  const handlePrevious = () => {
    if (slideCount <= 1) return;

    setPlayVideo(false);
    setTransitionEnabled(true);
    setCurrentSlide((previous) => Math.max(previous - 1, 0));
  };

  const goToSlide = (index) => {
    if (index === currentImage) return;

    setPlayVideo(false);
    setTransitionEnabled(true);
    setCurrentSlide(slideCount === 1 ? 0 : index + 1);
  };

  const handleTransitionEnd = () => {
    if (slideCount <= 1) return;

    if (currentSlide === slideCount + 1) {
      setTransitionEnabled(false);
      setCurrentSlide(1);
    } else if (currentSlide === 0) {
      setTransitionEnabled(false);
      setCurrentSlide(slideCount);
    }
  };

  useEffect(() => {
    setTransitionEnabled(false);
    setCurrentSlide(slideCount > 1 ? 1 : 0);
  }, [slideCount]);

  useEffect(() => {
    if (transitionEnabled || slideCount <= 1) return undefined;

    let secondFrame;

    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => setTransitionEnabled(true));
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame) window.cancelAnimationFrame(secondFrame);
    };
  }, [transitionEnabled, slideCount]);

  useEffect(() => {
    if (slideCount <= 1 || playVideo) return undefined;

    const interval = setInterval(() => {
      setTransitionEnabled(true);
      setCurrentSlide((previous) => Math.min(previous + 1, slideCount + 1));
    }, 7000);

    return () => clearInterval(interval);
  }, [slideCount, playVideo]);

  if (!slideCount) {
    return (
      <div className='h-[68vh] min-h-[500px] w-full animate-pulse bg-neutral-900' />
    );
  }

  return (
    <section className='relative w-full overflow-hidden'>
      <div
        className='flex h-[78vh] min-h-[540px] max-h-[860px]'
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
          transition: transitionEnabled
            ? 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1)'
            : 'none',
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {slides.map((data, index) => {
          const logicalIndex = slideCount === 1
            ? 0
            : index === 0
              ? slideCount - 1
              : index === slideCount + 1
                ? 0
                : index - 1;

          const isCurrent = logicalIndex === currentImage;

          return (
            <article
              key={`${data.id}-banner-${index}`}
              className='relative min-h-full min-w-full overflow-hidden'
              aria-hidden={!isCurrent}
            >
              {data.backdrop_path ? (
                <img
                  src={`${imageURL}${data.backdrop_path}`}
                  alt={data?.title || data?.name || 'Featured title'}
                  className='h-full w-full object-cover object-center'
                />
              ) : null}

              <div className='pointer-events-none absolute inset-0 bg-black/25' />
              <div className='pointer-events-none absolute inset-y-0 left-0 w-[42%] bg-gradient-to-r from-neutral-950/75 via-neutral-950/35 to-transparent' />
              <div className='pointer-events-none absolute inset-y-0 right-0 w-[30%] bg-gradient-to-l from-neutral-950/55 via-neutral-950/20 to-transparent' />
              <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/20' />

              <div className='absolute inset-0 z-[2] flex items-end'>
                <div className='mx-auto w-full max-w-[1600px] px-4 pb-20 sm:px-16 md:px-20 lg:px-24 lg:pb-24 xl:px-28'>
                  <div className='max-w-3xl'>
                    <div className='mb-3 flex flex-wrap items-center gap-2'>
                      <Badge>
                        {data.media_type === 'tv' ? 'TV Series' : 'Movie'}
                      </Badge>

                      <RatingBadge value={data.vote_average} />

                      {(data.release_date || data.first_air_date) ? (
                        <span className='text-sm font-semibold text-neutral-300'>
                          {moment(data.release_date || data.first_air_date).format('YYYY')}
                        </span>
                      ) : null}

                      {isCurrent && runtime ? (
                        <span className='text-sm font-semibold text-neutral-300'>
                          {runtime}
                        </span>
                      ) : null}
                    </div>

                    <h1 className='max-w-3xl text-4xl font-black tracking-tight text-white drop-shadow-2xl sm:text-5xl lg:text-7xl'>
                      {data?.title || data?.name}
                    </h1>

                    {isCurrent && detailsData?.genres?.length ? (
                      <div className='mt-4 flex flex-wrap gap-2'>
                        {detailsData.genres.slice(0, 4).map((genre) => (
                          <GenreChip key={genre.id}>
                            {genre.name}
                          </GenreChip>
                        ))}
                      </div>
                    ) : null}

                    <p className='mt-4 line-clamp-3 max-w-2xl text-sm leading-6 text-neutral-200 sm:text-base lg:text-lg lg:leading-7'>
                      {data.overview || 'Discover this featured title on CineVerse.'}
                    </p>

                    <div className='mt-6 flex flex-wrap gap-3'>
                      <Button onClick={handleTrailer} className='px-5 py-2.5'>
                        <FaPlay className='text-sm' />
                        Watch Trailer
                      </Button>

                      <Button
                        variant='secondary'
                        className='px-5 py-2.5'
                        onClick={() => handleDetails(data)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {slideCount > 1 ? (
        <div className='pointer-events-none absolute inset-y-0 left-0 right-0 z-10 hidden items-center justify-between sm:flex'>
          <IconButton
            onClick={handlePrevious}
            variant='glass'
            className='pointer-events-auto ml-3 lg:ml-4'
            aria-label='Previous featured title'
          >
            <FaAngleLeft />
          </IconButton>

          <IconButton
            onClick={handleNext}
            variant='glass'
            className='pointer-events-auto mr-3 lg:mr-4'
            aria-label='Next featured title'
          >
            <FaAngleRight />
          </IconButton>
        </div>
      ) : null}

      {slideCount > 1 ? (
        <div className='absolute bottom-5 left-1/2 z-20 flex max-w-[94vw] -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-black/40 px-3 py-2 backdrop-blur-md'>
          <span
            className='min-w-[42px] text-center text-[11px] font-semibold tabular-nums text-white/75'
            aria-live='polite'
          >
            {String(currentImage + 1).padStart(2, '0')} / {String(slideCount).padStart(2, '0')}
          </span>

          <div
            className='flex items-center gap-1'
            role='tablist'
            aria-label='Featured titles'
          >
            {bannerData.map((item, index) => (
              <button
                key={`${item.id}-hero-indicator`}
                type='button'
                onClick={() => goToSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentImage === index
                    ? 'w-5 bg-white'
                    : 'w-2 bg-white/35 hover:bg-white/60'
                }`}
                aria-label={`Show featured title ${index + 1} of ${slideCount}`}
                aria-selected={currentImage === index}
                role='tab'
              />
            ))}
          </div>
        </div>
      ) : null}

      {playVideo && currentData && user ? (
        <VideoPlay
          data={currentData}
          close={() => setPlayVideo(false)}
          media_type={mediaType}
        />
      ) : null}
    </section>
  );
};

export default BannerHome;