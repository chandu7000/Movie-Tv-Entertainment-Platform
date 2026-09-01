const RECENT_KEY = 'cineverse_recently_viewed';
const UPDATE_EVENT = 'cineverse:recently-viewed-updated';
export const MAX_RECENTLY_VIEWED = 10;

const readItems = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENTLY_VIEWED) : [];
  } catch {
    return [];
  }
};

const writeItems = (items) => {
  const trimmed = items.slice(0, MAX_RECENTLY_VIEWED);
  localStorage.setItem(RECENT_KEY, JSON.stringify(trimmed));
  window.dispatchEvent(new Event(UPDATE_EVENT));
};

export const addRecentlyViewed = (_user, media, mediaType) => {
  if (!media?.id) return;

  const item = {
    id: media.id,
    media_type: mediaType,
    title: media.title,
    name: media.name,
    poster_path: media.poster_path,
    backdrop_path: media.backdrop_path,
    vote_average: media.vote_average,
    release_date: media.release_date,
    first_air_date: media.first_air_date,
    viewedAt: Date.now(),
  };

  const next = [
    item,
    ...readItems().filter(
      (entry) => !(String(entry.id) === String(item.id) && entry.media_type === item.media_type)
    ),
  ];

  writeItems(next);
};

export const getRecentlyViewed = () => readItems();

export const removeRecentlyViewed = (_user, id, mediaType) =>
  writeItems(
    readItems().filter(
      (item) => !(String(item.id) === String(id) && item.media_type === mediaType)
    )
  );

export const RECENTLY_VIEWED_EVENT = UPDATE_EVENT;

export const clearRecentlyViewed = () => writeItems([]);
