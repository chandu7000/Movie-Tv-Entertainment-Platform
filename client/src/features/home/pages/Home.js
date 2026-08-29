import React from 'react';
import { useSelector } from 'react-redux';
import BannerHome from '../components/BannerHome';
import HorizontalScrollCard from '../../../components/media/HorizontalScrollCard';
import useFetch from '../../../hooks/useFetch';
import PersonalizedRecommendations from '../../recommendations/components/PersonalizedRecommendations';
import GuestHomeLock from '../../auth/GuestHomeLock';

const HomeSections = ({ trendingData, popularMovies, popularTv, topRated, upcoming, nowPlaying, onTheAir }) => (
  <>
    <HorizontalScrollCard data={trendingData} heading='Trending Today' trending />
    <HorizontalScrollCard data={popularMovies.data} loading={popularMovies.loading} error={popularMovies.error} onRetry={popularMovies.retry} heading='Popular Movies' media_type='movie' />
    <HorizontalScrollCard data={nowPlaying.data} loading={nowPlaying.loading} error={nowPlaying.error} onRetry={nowPlaying.retry} heading='Now Playing' media_type='movie' variant='landscape' />
    <HorizontalScrollCard data={popularTv.data} loading={popularTv.loading} error={popularTv.error} onRetry={popularTv.retry} heading='Popular TV Shows' media_type='tv' />
    <HorizontalScrollCard data={topRated.data} loading={topRated.loading} error={topRated.error} onRetry={topRated.retry} heading='Top Rated' media_type='movie' />
    <HorizontalScrollCard data={upcoming.data} loading={upcoming.loading} error={upcoming.error} onRetry={upcoming.retry} heading='Upcoming Releases' media_type='movie' variant='landscape' />
    <HorizontalScrollCard data={onTheAir.data} loading={onTheAir.loading} error={onTheAir.error} onRetry={onTheAir.retry} heading='On The Air' media_type='tv' />
    <PersonalizedRecommendations />
  </>
);

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  const trendingData = useSelector((state) => state.movieData.bannerData);
  const popularMovies = useFetch('/movie/popular');
  const popularTv = useFetch('/tv/popular');
  const topRated = useFetch('/movie/top_rated');
  const upcoming = useFetch('/movie/upcoming');
  const nowPlaying = useFetch('/movie/now_playing');
  const onTheAir = useFetch('/tv/on_the_air');

  const sections = <HomeSections {...{ trendingData, popularMovies, popularTv, topRated, upcoming, nowPlaying, onTheAir }} />;

  return (
    <div>
      <BannerHome />
      {user ? sections : <GuestHomeLock>{sections}</GuestHomeLock>}
    </div>
  );
};

export default Home;
