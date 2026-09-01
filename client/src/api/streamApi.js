import appApiClient from './appApiClient';

export const getStreamSources = (mediaType, tmdbId, params = {}) =>
  appApiClient.get(`/streams/${mediaType}/${tmdbId}`, { params });

export const getStreamAvailability = (mediaType, tmdbId, params = {}) =>
  appApiClient.get(`/streams/${mediaType}/${tmdbId}/availability`, { params });

export const getTvEpisodes = (tmdbId, season) =>
  appApiClient.get(`/streams/tv/${tmdbId}/episodes`, { params: { season } });

