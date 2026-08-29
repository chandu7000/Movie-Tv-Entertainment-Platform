const MAX_RECENTLY_VIEWED = 12;
const RECENTLY_VIEWED_PREFIX = 'cineverse_recently_viewed';

const getIdentity = (user) => user?._id || user?.id || user?.email || 'user';
const getStorageKey = (user) => `${RECENTLY_VIEWED_PREFIX}:${String(getIdentity(user)).toLowerCase()}`;

const normalizeMedia = (data, mediaType) => ({
  id: Number(data?.id),
  media_type: mediaType,
  title: data?.title || undefined,
  name: data?.name || undefined,
  poster_path: data?.poster_path || '',
  backdrop_path: data?.backdrop_path || '',
  release_date: data?.release_date || '',
  first_air_date: data?.first_air_date || '',
  vote_average: Number(data?.vote_average || 0),
});

export const getRecentlyViewed = (user) => {
  if (!user) return [];

  try {
    const items = JSON.parse(sessionStorage.getItem(getStorageKey(user)) || '[]');
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
};

export const addRecentlyViewed = (user, data, mediaType) => {
  if (!user || !data?.id || !mediaType) return [];

  const current = getRecentlyViewed(user);
  const item = normalizeMedia(data, mediaType);
  const next = [
    item,
    ...current.filter((entry) => !(Number(entry.id) === item.id && entry.media_type === mediaType)),
  ].slice(0, MAX_RECENTLY_VIEWED);

  sessionStorage.setItem(getStorageKey(user), JSON.stringify(next));
  window.dispatchEvent(new Event('cineverse:recently-viewed-updated'));
  return next;
};

export const removeRecentlyViewed = (user, id, mediaType) => {
  if (!user || !id) return [];

  const next = getRecentlyViewed(user).filter(
    (entry) => !(Number(entry.id) === Number(id) && (!mediaType || entry.media_type === mediaType))
  );

  sessionStorage.setItem(getStorageKey(user), JSON.stringify(next));
  window.dispatchEvent(new Event('cineverse:recently-viewed-updated'));
  return next;
};
