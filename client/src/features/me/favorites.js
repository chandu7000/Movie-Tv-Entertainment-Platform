const KEY = 'cineverse_favorites';
const EVENT = 'cineverse:favorites-updated';

const read = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const write = (items) => {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVENT));
};

export const getFavorites = () => read();

export const isFavorite = (id, mediaType) => read().some(
  (item) => String(item.id) === String(id) && item.media_type === mediaType
);

export const toggleFavorite = (media, mediaType) => {
  if (!media?.id) return false;
  const items = read();
  const exists = items.some((item) => String(item.id) === String(media.id) && item.media_type === mediaType);

  if (exists) {
    write(items.filter((item) => !(String(item.id) === String(media.id) && item.media_type === mediaType)));
    return false;
  }

  const item = {
    id: media.id,
    media_type: mediaType,
    title: media.title,
    name: media.name,
    poster_path: media.poster_path,
    backdrop_path: media.backdrop_path,
    vote_average: media.vote_average,
    vote_count: media.vote_count,
    release_date: media.release_date,
    first_air_date: media.first_air_date,
    addedAt: Date.now(),
  };

  write([item, ...items]);
  return true;
};

export const clearFavorites = () => write([]);
export const FAVORITES_EVENT = EVENT;
