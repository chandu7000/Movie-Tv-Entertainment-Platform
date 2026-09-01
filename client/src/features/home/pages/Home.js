import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import BannerHome from '../components/BannerHome';
import HorizontalScrollCard from '../../../components/media/HorizontalScrollCard';
import useFetch from '../../../hooks/useFetch';
import ContinueWatching from '../../history/components/ContinueWatching';
import { getRecentlyViewed, removeRecentlyViewed, RECENTLY_VIEWED_EVENT } from '../../history/recentlyViewed';

const formatDate = (date) => date.toISOString().slice(0, 10);

const Home = () => {
  const trendingData = useSelector((state) => state.movieData.bannerData);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const releaseWindow = useMemo(() => {
    const today = new Date();
    const from = new Date(today);
    from.setDate(from.getDate() - 120);

    return {
      from: formatDate(from),
      to: formatDate(today),
    };
  }, []);

  const popularMovies = useFetch('/movie/popular');
  const popularTv = useFetch('/tv/popular');
  const topRated = useFetch('/movie/top_rated');
  const upcoming = useFetch('/movie/upcoming');
  const onTheAir = useFetch('/tv/on_the_air');

  const newReleases = useFetch(
    `/discover/movie?sort_by=primary_release_date.desc&primary_release_date.gte=${releaseWindow.from}&primary_release_date.lte=${releaseWindow.to}&vote_count.gte=10&include_adult=false`
  );

  const indianMovies = useFetch('/discover/movie?region=IN&sort_by=popularity.desc&include_adult=false');
  const bollywoodMovies = useFetch('/discover/movie?with_original_language=hi&region=IN&sort_by=popularity.desc&include_adult=false');
  const recentTeluguMovies = useFetch(`/discover/movie?with_original_language=te&region=IN&sort_by=primary_release_date.desc&primary_release_date.gte=${releaseWindow.from}&primary_release_date.lte=${releaseWindow.to}&vote_count.gte=3&include_adult=false`);
  const teluguMovies = useFetch('/discover/movie?with_original_language=te&region=IN&sort_by=popularity.desc&include_adult=false');
  const tamilMovies = useFetch('/discover/movie?with_original_language=ta&region=IN&sort_by=popularity.desc&include_adult=false');
  const malayalamMovies = useFetch('/discover/movie?with_original_language=ml&region=IN&sort_by=popularity.desc&include_adult=false');
  const kannadaMovies = useFetch('/discover/movie?with_original_language=kn&region=IN&sort_by=popularity.desc&include_adult=false');
  const hollywoodMovies = useFetch('/discover/movie?with_original_language=en&sort_by=popularity.desc&include_adult=false');
  const dubbedAndInternational = useFetch('/discover/movie?region=IN&sort_by=popularity.desc&include_adult=false&language=te-IN');
  const globalTrending = useFetch('/trending/all/week');

  const refreshRecentlyViewed = useCallback(() => setRecentlyViewed(getRecentlyViewed()), []);
  const handleRemoveRecentlyViewed = useCallback((item) => removeRecentlyViewed(null, item.id, item.media_type), []);

  useEffect(() => {
    refreshRecentlyViewed();
    window.addEventListener(RECENTLY_VIEWED_EVENT, refreshRecentlyViewed);
    return () => window.removeEventListener(RECENTLY_VIEWED_EVENT, refreshRecentlyViewed);
  }, [refreshRecentlyViewed]);

  return (
    <div>
      <BannerHome />
      <ContinueWatching />

      {recentlyViewed.length ? (
        <HorizontalScrollCard
          data={recentlyViewed}
          heading='Recently Viewed'
          onRemoveItem={handleRemoveRecentlyViewed}
        />
      ) : null}

      <HorizontalScrollCard data={recentTeluguMovies.data} loading={recentTeluguMovies.loading} error={recentTeluguMovies.error} onRetry={recentTeluguMovies.retry} heading='Telugu New Releases' media_type='movie' variant='landscape' />
      <HorizontalScrollCard data={teluguMovies.data} loading={teluguMovies.loading} error={teluguMovies.error} onRetry={teluguMovies.retry} heading='Telugu Trending Now' media_type='movie' />
      <HorizontalScrollCard data={dubbedAndInternational.data} loading={dubbedAndInternational.loading} error={dubbedAndInternational.error} onRetry={dubbedAndInternational.retry} heading='Popular Dubbed & Regional' media_type='movie' />
      <HorizontalScrollCard data={newReleases.data} loading={newReleases.loading} error={newReleases.error} onRetry={newReleases.retry} heading='New & Noteworthy' media_type='movie' variant='landscape' />
      <HorizontalScrollCard data={indianMovies.data} loading={indianMovies.loading} error={indianMovies.error} onRetry={indianMovies.retry} heading='Popular Across India' media_type='movie' />
      <HorizontalScrollCard data={bollywoodMovies.data} loading={bollywoodMovies.loading} error={bollywoodMovies.error} onRetry={bollywoodMovies.retry} heading='Hindi Cinema Highlights' media_type='movie' />
      <HorizontalScrollCard data={tamilMovies.data} loading={tamilMovies.loading} error={tamilMovies.error} onRetry={tamilMovies.retry} heading='Tamil Cinema Highlights' media_type='movie' />
      <HorizontalScrollCard data={malayalamMovies.data} loading={malayalamMovies.loading} error={malayalamMovies.error} onRetry={malayalamMovies.retry} heading='Malayalam Cinema Highlights' media_type='movie' />
      <HorizontalScrollCard data={kannadaMovies.data} loading={kannadaMovies.loading} error={kannadaMovies.error} onRetry={kannadaMovies.retry} heading='Kannada Cinema Highlights' media_type='movie' />
      <HorizontalScrollCard data={hollywoodMovies.data} loading={hollywoodMovies.loading} error={hollywoodMovies.error} onRetry={hollywoodMovies.retry} heading='International Hits' media_type='movie' />

      <HorizontalScrollCard data={globalTrending.data} loading={globalTrending.loading} error={globalTrending.error} onRetry={globalTrending.retry} heading='Trending Now' trending />
      <HorizontalScrollCard data={popularMovies.data} loading={popularMovies.loading} error={popularMovies.error} onRetry={popularMovies.retry} heading='Most Popular Movies' media_type='movie' />
      <HorizontalScrollCard data={popularTv.data} loading={popularTv.loading} error={popularTv.error} onRetry={popularTv.retry} heading='Popular TV Series' media_type='tv' />
      <HorizontalScrollCard data={topRated.data} loading={topRated.loading} error={topRated.error} onRetry={topRated.retry} heading='Top Rated Movies' media_type='movie' />
      <HorizontalScrollCard data={upcoming.data} loading={upcoming.loading} error={upcoming.error} onRetry={upcoming.retry} heading='Upcoming Movies' media_type='movie' variant='landscape' />
      <HorizontalScrollCard data={onTheAir.data} loading={onTheAir.loading} error={onTheAir.error} onRetry={onTheAir.retry} heading='Currently Airing' media_type='tv' />
    </div>
  );
};

export default Home;
