import '../styles/App.css';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setBannerData, setImageURL } from './movieSlice';
import { discoverMedia, getConfiguration } from '../api/tmdbApi';
import AppShell from '../components/layout/AppShell';

const addUnique = (target, items, limit, predicate = () => true) => {
  const seen = new Set(target.map((item) => `${item.media_type || 'movie'}:${item.id}`));

  for (const item of items) {
    if (target.length >= limit) break;
    if (!item?.id || !predicate(item)) continue;

    const normalized = { ...item, media_type: item.media_type || 'movie' };
    const key = `${normalized.media_type}:${normalized.id}`;
    if (seen.has(key)) continue;

    seen.add(key);
    target.push(normalized);
  }

  return target;
};

const mixBanner = (telugu, indian, global) => {
  const result = [];
  let teluguIndex = 0;
  let indianIndex = 0;
  let globalIndex = 0;

  // Fixed 20-slide target: 10 Telugu (50%), 6 other Indian (30%), 4 global (20%).
  const pattern = [
    'te', 'in', 'te', 'gl', 'te',
    'in', 'te', 'gl', 'te', 'in',
    'te', 'gl', 'in', 'te', 'in',
    'te', 'gl', 'in', 'te', 'te',
  ];

  pattern.forEach((slot) => {
    if (slot === 'te' && telugu[teluguIndex]) result.push(telugu[teluguIndex++]);
    if (slot === 'in' && indian[indianIndex]) result.push(indian[indianIndex++]);
    if (slot === 'gl' && global[globalIndex]) result.push(global[globalIndex++]);
  });

  // Only use the same recent pools for fallback, so old classics never enter the banner.
  addUnique(result, [...telugu, ...indian, ...global], 20);
  return result.slice(0, 20);
};

function App() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  useEffect(() => {
    let active = true;

    const initializeApp = async () => {
      try {
        const today = new Date();
        const recentStart = new Date(today);
        recentStart.setMonth(recentStart.getMonth() - 18);
        const formatDate = (date) => date.toISOString().slice(0, 10);
        const from = formatDate(recentStart);
        const to = formatDate(today);

        const recentParams = {
          region: 'IN',
          sort_by: 'popularity.desc',
          'primary_release_date.gte': from,
          'primary_release_date.lte': to,
          'vote_count.gte': 3,
          include_adult: false,
        };

        const [
          teluguRecentResponse,
          teluguPopularRecentResponse,
          hindiRecentResponse,
          tamilRecentResponse,
          malayalamRecentResponse,
          kannadaRecentResponse,
          globalRecentResponse,
          configurationResponse,
        ] = await Promise.all([
          discoverMedia('movie', 1, {
            ...recentParams,
            with_original_language: 'te',
            sort_by: 'primary_release_date.desc',
          }),
          discoverMedia('movie', 1, {
            ...recentParams,
            with_original_language: 'te',
          }),
          discoverMedia('movie', 1, { ...recentParams, with_original_language: 'hi' }),
          discoverMedia('movie', 1, { ...recentParams, with_original_language: 'ta' }),
          discoverMedia('movie', 1, { ...recentParams, with_original_language: 'ml' }),
          discoverMedia('movie', 1, { ...recentParams, with_original_language: 'kn' }),
          discoverMedia('movie', 1, {
            sort_by: 'popularity.desc',
            'primary_release_date.gte': from,
            'primary_release_date.lte': to,
            'vote_count.gte': 50,
            include_adult: false,
          }),
          getConfiguration(),
        ]);

        if (!active) return;

        const telugu = [];
        addUnique(telugu, teluguRecentResponse.data.results || [], 10, (item) => Boolean(item.backdrop_path));
        addUnique(telugu, teluguPopularRecentResponse.data.results || [], 10, (item) => Boolean(item.backdrop_path));

        const indian = [];
        const indianPool = [
          ...(hindiRecentResponse.data.results || []),
          ...(tamilRecentResponse.data.results || []),
          ...(malayalamRecentResponse.data.results || []),
          ...(kannadaRecentResponse.data.results || []),
        ];
        addUnique(indian, indianPool, 6, (item) => item.original_language !== 'te' && Boolean(item.backdrop_path));

        const worldwide = [];
        addUnique(
          worldwide,
          globalRecentResponse.data.results || [],
          4,
          (item) => !['te', 'hi', 'ta', 'ml', 'kn'].includes(item.original_language) && Boolean(item.backdrop_path)
        );

        dispatch(setBannerData(mixBanner(telugu, indian, worldwide)));
        dispatch(setImageURL(`${configurationResponse.data.images.secure_base_url}original`));
      } catch (error) {
        console.error('Unable to initialize CineVerse data:', error);
      }
    };

    initializeApp();
    return () => { active = false; };
  }, [dispatch]);

  return <AppShell />;
}

export default App;
