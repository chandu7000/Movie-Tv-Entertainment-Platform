import {
  addRecentlyViewed,
  getRecentlyViewed,
  MAX_RECENTLY_VIEWED,
} from './recentlyViewed';

describe('recently viewed history', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('keeps only the 10 most recently viewed unique titles', () => {
    for (let id = 1; id <= 11; id += 1) {
      addRecentlyViewed(null, { id, title: `Movie ${id}` }, 'movie');
    }

    const items = getRecentlyViewed();
    expect(items).toHaveLength(MAX_RECENTLY_VIEWED);
    expect(items[0].id).toBe(11);
    expect(items.at(-1).id).toBe(2);
  });

  test('viewing the same title again moves it to the front without duplicating it', () => {
    addRecentlyViewed(null, { id: 1, title: 'Movie 1' }, 'movie');
    addRecentlyViewed(null, { id: 2, title: 'Movie 2' }, 'movie');
    addRecentlyViewed(null, { id: 1, title: 'Movie 1' }, 'movie');

    const items = getRecentlyViewed();
    expect(items).toHaveLength(2);
    expect(items[0].id).toBe(1);
  });
});
