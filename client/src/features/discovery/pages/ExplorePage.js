import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import Card from '../../../components/media/Card';
import {
  discoverMedia,
  getMovieCategory,
  getMovieGenres,
  getTvCategory,
  getTvGenres,
} from '../../../api/tmdbApi';
import EmptyState from '../../../components/ui/EmptyState';
import ErrorState from '../../../components/ui/ErrorState';
import SectionHeader from '../../../components/ui/SectionHeader';
import Skeleton from '../../../components/ui/Skeleton';
import MovieDiscoveryControls from '../components/MovieDiscoveryControls';
import TvDiscoveryControls from '../components/TvDiscoveryControls';

const movieCategories = [
  { label: 'Popular', value: 'popular' },
  { label: 'Now Playing', value: 'now_playing' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Top Rated', value: 'top_rated' },
];

const tvCategories = [
  { label: 'Popular', value: 'popular' },
  { label: 'Airing Today', value: 'airing_today' },
  { label: 'On The Air', value: 'on_the_air' },
  { label: 'Top Rated', value: 'top_rated' },
];

const ExplorePage = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const mediaType = location.pathname.startsWith('/tv') ? 'tv' : 'movie';
  const isMovie = mediaType === 'movie';
  const categories = isMovie ? movieCategories : tvCategories;

  const [pageNo, setPageNo] = useState(1);
  const [data, setData] = useState([]);
  const [totalPage, setTotalPageNo] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [genres, setGenres] = useState([]);

  const category = searchParams.get('category') || 'popular';
  const filters = useMemo(() => ({
    genre: searchParams.get('genre') || '',
    year: searchParams.get('year') || '',
    rating: searchParams.get('rating') || '',
    language: searchParams.get('language') || '',
    sort: searchParams.get('sort') || 'popularity.desc',
  }), [searchParams]);

  useEffect(() => {
    let active = true;
    const request = isMovie ? getMovieGenres() : getTvGenres();
    request.then((response) => {
      if (active) setGenres(response.data.genres || []);
    }).catch(() => {
      if (active) setGenres([]);
    });
    return () => { active = false; };
  }, [isMovie]);

  useEffect(() => {
    setPageNo(1);
    setData([]);
    setTotalPageNo(0);
  }, [mediaType, category, filters.genre, filters.year, filters.rating, filters.language, filters.sort]);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        let response;

        if (category !== 'discover') {
          response = isMovie
            ? await getMovieCategory(category, pageNo)
            : await getTvCategory(category, pageNo);
        } else {
          const params = {
            ...(filters.genre ? { with_genres: filters.genre } : {}),
            ...(filters.year ? { [isMovie ? 'primary_release_year' : 'first_air_date_year']: filters.year } : {}),
            ...(filters.rating ? { 'vote_average.gte': filters.rating, 'vote_count.gte': 50 } : {}),
            ...(filters.language ? { with_original_language: filters.language } : {}),
            sort_by: filters.sort,
          };
          response = await discoverMedia(mediaType, pageNo, params);
        }

        if (!active) return;
        const results = response.data.results || [];
        setData((previous) => {
          const next = pageNo === 1 ? results : [...previous, ...results];
          return Array.from(new Map(next.map((item) => [item.id, item])).values());
        });
        setTotalPageNo(Math.min(response.data.total_pages || 0, 500));
      } catch (requestError) {
        if (active) setError(requestError);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchData();
    return () => { active = false; };
  }, [mediaType, isMovie, category, pageNo, filters]);

  useEffect(() => {
    const handleScroll = () => {
      const reachedBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 300;
      if (reachedBottom && !loading && pageNo < totalPage) setPageNo((previous) => previous + 1);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, pageNo, totalPage]);

  const selectCategory = (nextCategory) => setSearchParams({ category: nextCategory });

  const updateFilter = (name, value) => {
    const next = new URLSearchParams(searchParams);
    next.set('category', 'discover');
    if (value) next.set(name, value);
    else next.delete(name);
    setSearchParams(next);
  };

  const resetFilters = () => setSearchParams({ category: 'popular' });
  const categoryLabel = categories.find((item) => item.value === category)?.label || 'Popular';
  const heading = category === 'discover'
    ? `Discover ${isMovie ? 'Movies' : 'TV Shows'}`
    : `${categoryLabel} ${isMovie ? 'Movies' : 'TV Shows'}`;

  return (
    <section className='px-3 py-6 sm:px-6 sm:py-10 lg:px-10'>
      <div className='mx-auto w-full max-w-[1600px]'>
        <SectionHeader
          title={heading}
          description={isMovie
            ? 'Browse movie categories or refine results with genre, year, rating, language and sorting.'
            : 'Explore TV-specific categories and refine series by genre, first-air year, rating and language.'}
        />

        <div className='mb-5 flex gap-2 overflow-x-auto pb-1'>
          {categories.map((item) => (
            <button
              key={item.value}
              type='button'
              onClick={() => selectCategory(item.value)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                category === item.value
                  ? 'bg-white text-neutral-950'
                  : 'border border-white/10 bg-white/[0.04] text-neutral-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {isMovie ? (
          <MovieDiscoveryControls filters={filters} genres={genres} onChange={updateFilter} onReset={resetFilters} />
        ) : (
          <TvDiscoveryControls filters={filters} genres={genres} onChange={updateFilter} onReset={resetFilters} />
        )}

        {error && data.length === 0 ? <ErrorState message={`Unable to load ${isMovie ? 'movies' : 'TV shows'} right now.`} /> : null}
        {!error && !loading && data.length === 0 ? (
          <EmptyState title='No titles found' message='Try another category or reset the current filters.' />
        ) : null}

        <div className='grid grid-cols-3 gap-1.5 sm:grid-cols-[repeat(auto-fit,230px)] sm:justify-center sm:gap-5 lg:justify-start'>
          {data.map((item) => (
            <Card data={item} key={`${item.id}-${mediaType}-explore-section`} media_type={mediaType} />
          ))}
          {loading && data.length === 0
            ? Array.from({ length: 10 }).map((_, index) => <Skeleton key={`explore-skeleton-${index}`} className='aspect-[2/3] w-full sm:h-80 sm:w-[230px]' />)
            : null}
        </div>

        {loading && data.length > 0 ? (
          <p className='py-8 text-center text-sm font-semibold text-neutral-500'>Loading more titles…</p>
        ) : null}
      </div>
    </section>
  );
};

export default ExplorePage;
