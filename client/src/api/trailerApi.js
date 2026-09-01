import tmdbClient from './tmdbClient';

export const getResolvedTrailer = (mediaType, id) =>
  tmdbClient.get(`/trailer/${mediaType}/${id}`);
