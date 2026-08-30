/**
 * Fetches plant images from Unsplash with localStorage cache (7-day TTL).
 * Falls back to placeholder SVG when no API key or on error.
 */

import placeholderSvg from '../assets/placeholder-plant.svg';

const CACHE_PREFIX = 'plant-image-';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * @param {string} plantName
 * @returns {Promise<string>}
 */
export async function fetchPlantImage(plantName) {
  const cacheKey = CACHE_PREFIX + plantName.toLowerCase().replace(/\s+/g, '-');
  const cached = getCachedImage(cacheKey);
  if (cached) return cached;

  const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  if (!accessKey) return placeholderSvg;

  try {
    const query = encodeURIComponent(`${plantName} plant garden`);
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=1&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${accessKey}` } }
    );

    if (!response.ok) return placeholderSvg;

    const data = await response.json();
    const url = data.results?.[0]?.urls?.small;
    if (!url) return placeholderSvg;

    setCachedImage(cacheKey, url);
    return url;
  } catch {
    return placeholderSvg;
  }
}

/**
 * @param {string} key
 * @returns {string|null}
 */
function getCachedImage(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { url, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(key);
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

/**
 * @param {string} key
 * @param {string} url
 */
function setCachedImage(key, url) {
  try {
    localStorage.setItem(key, JSON.stringify({ url, timestamp: Date.now() }));
  } catch {
    // localStorage full or unavailable — ignore
  }
}

export { placeholderSvg };
