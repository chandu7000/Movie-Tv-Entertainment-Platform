import { toMediaPayload } from './mediaPayload';

test('normalizes movie data for persisted user features', () => {
  expect(toMediaPayload({ id: 10, title: 'Movie', poster_path: '/p.jpg', release_date: '2026-01-01', vote_average: 8.2, genres: [{ id: 28 }] }, 'movie')).toEqual({ tmdbId: 10, mediaType: 'movie', title: 'Movie', posterPath: '/p.jpg', backdropPath: '', releaseDate: '2026-01-01', rating: 8.2, genreIds: [28] });
});

test('normalizes TV names and first-air dates', () => {
  const result = toMediaPayload({ id: 20, name: 'Show', first_air_date: '2026-02-02' }, 'tv');
  expect(result).toMatchObject({ tmdbId: 20, mediaType: 'tv', title: 'Show', releaseDate: '2026-02-02' });
});
