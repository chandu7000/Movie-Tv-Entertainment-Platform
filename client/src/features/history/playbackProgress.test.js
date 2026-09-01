import { getContinueWatching, getPlaybackProgress, savePlaybackProgress } from './playbackProgress';

describe('local playback progress', () => {
  beforeEach(() => localStorage.clear());
  test('stores unfinished playback locally', () => {
    const identity = { mediaType: 'movie', tmdbId: 12, season: 0, episode: 0 };
    savePlaybackProgress(identity, { currentTime: 30, duration: 120, title: 'Demo' });
    expect(getPlaybackProgress(identity).currentTime).toBe(30);
    expect(getContinueWatching()).toHaveLength(1);
  });
  test('removes nearly completed playback', () => {
    const identity = { mediaType: 'movie', tmdbId: 12, season: 0, episode: 0 };
    savePlaybackProgress(identity, { currentTime: 119, duration: 120, title: 'Demo' });
    expect(getPlaybackProgress(identity)).toBeNull();
  });
});
