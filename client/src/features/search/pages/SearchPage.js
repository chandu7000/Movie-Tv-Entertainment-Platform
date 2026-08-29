import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from '../../../components/media/Card';
import { getTrendingToday, searchMulti } from '../../../api/tmdbApi';
import EmptyState from '../../../components/ui/EmptyState';
import ErrorState from '../../../components/ui/ErrorState';
import SectionHeader from '../../../components/ui/SectionHeader';
import Skeleton from '../../../components/ui/Skeleton';
import PersonCard from '../../../components/media/PersonCard';
import { useSelector } from 'react-redux';

const SEARCH_HISTORY_KEY = 'cineverse_recent_searches';

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Movies', value: 'movie' },
  { label: 'TV Shows', value: 'tv' },
  { label: 'People', value: 'person' },
];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const imageURL = useSelector((state) => state.movieData.imageURL);

  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'all';

  const [input, setInput] = useState(query);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    setInput(query);
  }, [query]);

  useEffect(() => {
    try {
      setRecentSearches(
        JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || '[]')
      );
    } catch {
      setRecentSearches([]);
    }

    getTrendingToday()
      .then((response) =>
        setTrending((response.data.results || []).slice(0, 8))
      )
      .catch(() => setTrending([]));
  }, []);

  useEffect(() => {
    if (input.trim() === query) return undefined;

    const timer = window.setTimeout(() => {
      const value = input.trim();

      const next = new URLSearchParams(searchParams);

      if (value.length >= 2) {
        next.set('q', value);
      } else if (!value) {
        next.delete('q');
      } else {
        return;
      }

      next.delete('page');

      setSearchParams(next, { replace: true });
    }, 650);

    return () => window.clearTimeout(timer);
  }, [input, query, searchParams, setSearchParams]);

  useEffect(() => {
    setPage(1);
    setData([]);
    setTotalPage(0);
    setError(null);
  }, [query]);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      const cleanQuery = query.trim();

      if (cleanQuery.length < 2) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await searchMulti(cleanQuery, page);

        if (!active) return;

        const results = response.data.results || [];

        setData((previous) => {
          const next =
            page === 1
              ? results
              : [...previous, ...results];

          return Array.from(
            new Map(
              next.map((item) => [
                `${item.media_type}-${item.id}`,
                item,
              ])
            ).values()
          );
        });

        setTotalPage(
          Math.min(response.data.total_pages || 0, 500)
        );

        if (page === 1) {
          setRecentSearches((previous) => {
            const nextRecent = [
              cleanQuery,
              ...previous.filter(
                (item) =>
                  item.toLowerCase() !== cleanQuery.toLowerCase()
              ),
            ].slice(0, 6);

            localStorage.setItem(
              SEARCH_HISTORY_KEY,
              JSON.stringify(nextRecent)
            );

            return nextRecent;
          });
        }
      } catch (requestError) {
        if (active) {
          setError(requestError);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [query, page]);

  useEffect(() => {
    const handleScroll = () => {
      const reachedBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 250;

      if (
        reachedBottom &&
        query &&
        !loading &&
        page < totalPage
      ) {
        setPage((previous) => previous + 1);
      }
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () =>
      window.removeEventListener('scroll', handleScroll);
  }, [loading, page, query, totalPage]);

  const filteredData = useMemo(
    () =>
      data.filter(
        (item) =>
          type === 'all' || item.media_type === type
      ),
    [data, type]
  );

  const updateType = (nextType) => {
    const next = new URLSearchParams(searchParams);

    if (nextType === 'all') {
      next.delete('type');
    } else {
      next.set('type', nextType);
    }

    setSearchParams(next);
  };

  const chooseSearch = (value) => {
    setInput(value);

    const next = new URLSearchParams(searchParams);
    next.set('q', value);
    next.delete('page');

    setSearchParams(next);
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  };

  return (
    <div className='py-10'>
      <div className='mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10'>

        <div className='mx-auto mb-8 max-w-3xl'>
          <label
            className='sr-only'
            htmlFor='cineverse-search'
          >
            Search movies, TV shows and people
          </label>

          <input
            id='cineverse-search'
            type='search'
            placeholder='Search movies, TV shows and people...'
            onChange={(event) => setInput(event.target.value)}
            value={input}
            autoFocus={!query}
            className='w-full rounded-2xl border border-white/10 bg-neutral-900/90 px-5 py-4 text-base text-white outline-none backdrop-blur placeholder:text-neutral-500 focus:border-white/30'
          />
        </div>

        <SectionHeader
          title={
            query
              ? `Search results for “${query}”`
              : 'Search CineVerse'
          }
          description={
            query
              ? `${filteredData.length} loaded ${
                  type === 'all'
                    ? 'results'
                    : filters
                        .find((item) => item.value === type)
                        ?.label.toLowerCase()
                }`
              : 'Find movies, TV shows and people from TMDB.'
          }
        />

        {query ? (
          <div className='mb-6 flex gap-2 overflow-x-auto pb-1'>
            {filters.map((filter) => (
              <button
                type='button'
                key={filter.value}
                onClick={() => updateType(filter.value)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${
                  type === filter.value
                    ? 'bg-white text-neutral-950'
                    : 'border border-white/10 bg-white/[0.04] text-neutral-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        ) : (
          <div className='grid gap-7 lg:grid-cols-2'>

            <section className='rounded-2xl border border-white/10 bg-white/[0.03] p-5'>
              <div className='mb-4 flex items-center justify-between gap-3'>
                <h2 className='text-lg font-black text-white'>
                  Recent searches
                </h2>

                {recentSearches.length ? (
                  <button
                    type='button'
                    onClick={clearRecent}
                    className='text-xs font-bold text-neutral-500 hover:text-white'
                  >
                    Clear
                  </button>
                ) : null}
              </div>

              {recentSearches.length ? (
                <div className='flex flex-wrap gap-2'>
                  {recentSearches.map((item) => (
                    <button
                      key={item}
                      type='button'
                      onClick={() => chooseSearch(item)}
                      className='rounded-full border border-white/10 px-3 py-2 text-sm text-neutral-300 hover:bg-white/10 hover:text-white'
                    >
                      {item}
                    </button>
                  ))}
                </div>
              ) : (
                <p className='text-sm text-neutral-500'>
                  Your searches will appear here.
                </p>
              )}
            </section>

            <section className='rounded-2xl border border-white/10 bg-white/[0.03] p-5'>
              <h2 className='mb-4 text-lg font-black text-white'>
                Trending searches
              </h2>

              <div className='flex flex-wrap gap-2'>
                {trending.map((item) => {
                  const label = item.title || item.name;

                  return label ? (
                    <button
                      key={`${item.media_type}-${item.id}`}
                      type='button'
                      onClick={() => chooseSearch(label)}
                      className='rounded-full border border-white/10 px-3 py-2 text-sm text-neutral-300 hover:bg-white/10 hover:text-white'
                    >
                      {label}
                    </button>
                  ) : null;
                })}
              </div>
            </section>
          </div>
        )}

        {error && data.length === 0 ? (
          <ErrorState message='Unable to load search results right now.' />
        ) : null}

        {query &&
        !loading &&
        !error &&
        filteredData.length === 0 ? (
          <EmptyState
            title='No results found'
            message='Try another search or result type.'
          />
        ) : null}

        {type === 'person' ? (
          <div className='grid grid-cols-[repeat(auto-fit,130px)] justify-center gap-6 lg:justify-start'>
            {filteredData.map((person) => (
              <PersonCard
                key={`person-${person.id}`}
                person={person}
                imageURL={imageURL}
              />
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-[repeat(auto-fit,230px)] justify-center gap-5 lg:justify-start'>
            {filteredData
              .filter(
                (item) => item.media_type !== 'person'
              )
              .map((searchData) => (
                <Card
                  data={searchData}
                  key={`${searchData.media_type}-${searchData.id}-search-section`}
                  media_type={searchData.media_type}
                />
              ))}
          </div>
        )}

        {type === 'all' &&
        filteredData.some(
          (item) => item.media_type === 'person'
        ) ? (
          <section className='mt-10'>
            <h2 className='mb-5 text-xl font-black text-white'>
              People
            </h2>

            <div className='grid grid-cols-[repeat(auto-fit,130px)] justify-center gap-6 lg:justify-start'>
              {filteredData
                .filter(
                  (item) => item.media_type === 'person'
                )
                .map((person) => (
                  <PersonCard
                    key={`all-person-${person.id}`}
                    person={person}
                    imageURL={imageURL}
                  />
                ))}
            </div>
          </section>
        ) : null}

        {loading && data.length === 0 ? (
          <div className='grid grid-cols-[repeat(auto-fit,230px)] justify-center gap-5 lg:justify-start'>
            {Array.from({ length: 8 }).map(
              (_, index) => (
                <Skeleton
                  key={`search-skeleton-${index}`}
                  className='h-80 w-[230px]'
                />
              )
            )}
          </div>
        ) : null}

        {loading && data.length > 0 ? (
          <p className='py-8 text-center text-sm font-semibold text-neutral-500'>
            Loading more results…
          </p>
        ) : null}

      </div>
    </div>
  );
};

export default SearchPage;