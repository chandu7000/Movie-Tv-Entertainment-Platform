const KEY = 'cineverse_playback_progress';
const EVENT = 'cineverse:playback-progress-updated';

const read = () => {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || '{}');
    return data && typeof data === 'object' ? data : {};
  } catch {
    return {};
  }
};

const keyFor = ({ mediaType, tmdbId, season = 0, episode = 0 }) => `${mediaType}:${tmdbId}:${season}:${episode}`;

export const getPlaybackProgress = (identity) => read()[keyFor(identity)] || null;

export const savePlaybackProgress = (identity, payload) => {
  const all = read();
  const key = keyFor(identity);
  const duration = Number(payload.duration || 0);
  const currentTime = Number(payload.currentTime || 0);
  if (!duration || currentTime / duration > 0.95) {
    delete all[key];
  } else {
    all[key] = { ...identity, ...payload, updatedAt: Date.now() };
  }
  localStorage.setItem(KEY, JSON.stringify(all));
  window.dispatchEvent(new Event(EVENT));
};

export const getContinueWatching = () => Object.values(read()).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 12);
export const clearPlaybackProgress = (identity) => {
  const all = read();
  delete all[keyFor(identity)];
  localStorage.setItem(KEY, JSON.stringify(all));
  window.dispatchEvent(new Event(EVENT));
};
export const PLAYBACK_PROGRESS_EVENT = EVENT;

export const clearAllPlaybackProgress = () => {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVENT));
};
