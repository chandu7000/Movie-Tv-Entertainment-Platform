import tmdbClient from './tmdbClient';

export const getTrending = () => tmdbClient.get('/trending/all/week');
export const getTrendingToday = () => tmdbClient.get('/trending/all/day');
export const getConfiguration = () => tmdbClient.get('/configuration');
export const getList = (endpoint, config = {}) => tmdbClient.get(endpoint, config);
export const getDetails = (endpoint, config = {}) => tmdbClient.get(endpoint, config);

export const getMovieGenres = () => tmdbClient.get('/genre/movie/list');
export const getTvGenres = () => tmdbClient.get('/genre/tv/list');

export const getMovieCategory = (category = 'popular', page = 1) =>
  tmdbClient.get(`/movie/${category}`, { params: { page } });

export const getTvCategory = (category = 'popular', page = 1) =>
  tmdbClient.get(`/tv/${category}`, { params: { page } });

export const discoverMedia = (mediaType, page = 1, params = {}) =>
  tmdbClient.get(`/discover/${mediaType}`, { params: { page, ...params } });

export const searchMulti = (query, page = 1) =>
  tmdbClient.get('/search/multi', { params: { query, page, include_adult: false } });
