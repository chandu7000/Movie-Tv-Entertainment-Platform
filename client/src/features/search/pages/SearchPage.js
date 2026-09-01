import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import Card from '../../../components/media/Card';
import EmptyState from '../../../components/ui/EmptyState';
import ErrorState from '../../../components/ui/ErrorState';
import SectionHeader from '../../../components/ui/SectionHeader';
import Skeleton from '../../../components/ui/Skeleton';
import { searchMulti } from '../../../api/tmdbApi';

const normalizeText = (value = '') =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const compactText = (value = '') => normalizeText(value).replace(/\s+/g, '');

const mediaTitleMatches = (item, query) => {
  const normalizedQuery = normalizeText(query);
  const compactQuery = compactText(query);

  if (!normalizedQuery || !compactQuery) return false;

  return [item?.title, item?.original_title, item?.name, item?.original_name]
    .filter(Boolean)
    .some((title) => {
      const normalizedTitle = normalizeText(title);
      const compactTitle = compactText(title);
      return normalizedTitle.includes(normalizedQuery) || compactTitle.includes(compactQuery);
    });
};

const getMediaRelevanceScore = (item, query) => {
  const normalizedQuery = normalizeText(query);
  const compactQuery = compactText(query);
  let bestScore = 0;

  [item?.title, item?.original_title, item?.name, item?.original_name]
    .filter(Boolean)
    .forEach((title) => {
      const normalizedTitle = normalizeText(title);
      const compactTitle = compactText(title);
      let score = 0;

      if (normalizedTitle === normalizedQuery) score = 1000;
      else if (normalizedTitle.startsWith(`${normalizedQuery} `)) score = 900;
      else if (normalizedTitle.startsWith(normalizedQuery)) score = 850;
      else if (normalizedTitle.includes(` ${normalizedQuery} `)) score = 800;
      else if (normalizedTitle.includes(normalizedQuery)) score = 760;
      else if (compactTitle.startsWith(compactQuery)) score = 720;
      else if (compactTitle.includes(compactQuery)) score = 680;

      bestScore = Math.max(bestScore, score);
    });

  return bestScore;
};

const getMetadataQualityScore = (item) => {
  let score = 0;
  if (item?.poster_path) score += 30;
  if (item?.backdrop_path) score += 15;
  if (Number(item?.vote_average) > 0) score += 12;
  if (Number(item?.vote_count) >= 10) score += 10;
  if (Number(item?.vote_count) >= 100) score += 8;
  if (item?.release_date || item?.first_air_date) score += 8;
  if (item?.overview) score += 5;
  score += Math.min(Number(item?.popularity || 0) / 20, 12);
  return score;
};

const sortSearchResults = (a, b, query) =>
  getMediaRelevanceScore(b, query) - getMediaRelevanceScore(a, query) ||
  getMetadataQualityScore(b) - getMetadataQualityScore(a) ||
  (b.popularity || 0) - (a.popularity || 0);

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').trim();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setPage(1);
    setData([]);
    setTotalPage(0);
    setError(null);
  }, [query]);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      if (query.length < 2) return;

      try {
        setLoading(true);
        setError(null);
        const response = await searchMulti(query, page);
        if (!active) return;

        const matchingTitles = (response.data.results || [])
          .filter((item) => item?.media_type === 'movie' || item?.media_type === 'tv')
          .filter((item) => mediaTitleMatches(item, query))
          .sort((a, b) => sortSearchResults(a, b, query));

        setData((previous) => {
          const next = page === 1 ? matchingTitles : [...previous, ...matchingTitles];
          return Array.from(
            new Map(next.map((item) => [`${item.media_type}:${item.id}`, item])).values()
          );
        });

        setTotalPage(Math.min(response.data.total_pages || 0, 20));
      } catch (requestError) {
        if (active) setError(requestError);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, [page, query]);

  useEffect(() => {
    const handleScroll = () => {
      const reachedBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 250;

      if (reachedBottom && query.length >= 2 && !loading && page < totalPage) {
        setPage((previous) => previous + 1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, page, query, totalPage]);

  const titles = useMemo(
    () =>
      [...data].sort((a, b) => sortSearchResults(a, b, query)),
    [data, query]
  );

  if (query.length < 2) {
    return <Navigate to='/' replace />;
  }

  return (
    <div className='py-6 sm:py-10'>
      <div className='mx-auto w-full max-w-[1600px] px-3 sm:px-6 lg:px-10'>
        <SectionHeader
          title={`Titles matching “${query}”`}
          description={`${titles.length} matching ${titles.length === 1 ? 'title' : 'titles'}`}
        />

        {error && data.length === 0 ? (
          <ErrorState message='Unable to load search results right now.' />
        ) : null}

        {!loading && !error && titles.length === 0 ? (
          <EmptyState
            title='No Titles Found'
            message='Try a title name from a movie, TV series, show or anime.'
          />
        ) : null}

        <div className='grid grid-cols-3 gap-1.5 sm:grid-cols-[repeat(auto-fit,230px)] sm:justify-center sm:gap-5 lg:justify-start'>
          {titles.map((item) => (
            <Card
              data={item}
              key={`${item.media_type}-${item.id}-search`}
              media_type={item.media_type}
            />
          ))}
        </div>

        {loading && data.length === 0 ? (
          <div className='grid grid-cols-3 gap-1.5 sm:grid-cols-[repeat(auto-fit,230px)] sm:justify-center sm:gap-5 lg:justify-start'>
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={`search-skeleton-${index}`} className='aspect-[2/3] w-full sm:h-80 sm:w-[230px]' />
            ))}
          </div>
        ) : null}

        {loading && data.length > 0 ? (
          <p className='py-8 text-center text-sm font-semibold text-neutral-500'>
            Loading more titles…
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default SearchPage;
