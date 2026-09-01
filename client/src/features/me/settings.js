const KEY = 'cineverse_settings';
const EVENT = 'cineverse:settings-updated';

export const DEFAULT_SETTINGS = {
  autoplayNextEpisode: true,
};

export const getSettings = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || '{}');
    return { ...DEFAULT_SETTINGS, ...(parsed && typeof parsed === 'object' ? parsed : {}) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
};

export const updateSetting = (name, value) => {
  const next = { ...getSettings(), [name]: value };
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EVENT));
  return next;
};

export const resetSettings = () => {
  localStorage.setItem(KEY, JSON.stringify(DEFAULT_SETTINGS));
  window.dispatchEvent(new Event(EVENT));
};

export const SETTINGS_EVENT = EVENT;
