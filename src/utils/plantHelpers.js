/**
 * Plant filtering, sorting, and scoring utilities.
 * Native Quebec plants are always sorted first per project requirements.
 */

/** @typedef {import('../types').Plant} Plant */
/** @typedef {import('../types').FilterState} FilterState */
/** @typedef {import('../types').SoilTestResult} SoilTestResult */

import { matchSoilCompatibility } from '../services/soilMatcher';

const ORIGIN_ORDER = { 'native-qc': 0, adaptive: 1, 'fruit-bearing': 2, introduced: 3 };

/**
 * Filter plants by search, zone, period, origin, and optional soil test.
 * @param {Plant[]} plants
 * @param {FilterState} filters
 * @returns {Plant[]}
 */
export function filterPlants(plants, filters) {
  const { searchQuery, zoneFilter, periodFilter, originFilter, soilTestResult } = filters;
  const query = searchQuery.trim().toLowerCase();

  let result = plants.filter((plant) => {
    // Text search across name, scientific name, tags, description
    if (query) {
      const haystack = [
        plant.name,
        plant.scientificName,
        plant.description,
        ...(plant.tags || []),
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    // Zone filter — plant must overlap at least one selected zone
    if (zoneFilter.length > 0) {
      const matchesZone = plant.hardinessZone.some((z) => zoneFilter.includes(z));
      if (!matchesZone) return false;
    }

    // Origin filter
    if (originFilter !== 'all') {
      if (originFilter === 'native-qc' && plant.origin !== 'native-qc') return false;
      if (originFilter === 'adaptive' && plant.origin !== 'adaptive') return false;
      if (originFilter === 'fruit-bearing' && !plant.isFruitBearing) return false;
    }

    // Period filter — check if current month falls in planting/bloom/harvest window
    if (periodFilter !== 'all') {
      const periodField =
        periodFilter === 'planting'
          ? plant.plantingPeriod
          : periodFilter === 'bloom'
            ? plant.bloomPeriod
            : plant.harvestPeriod;
      if (!isInSeason(periodField)) return false;
    }

    // Soil test is optional — skip when null
    if (soilTestResult) {
      if (!matchSoilCompatibility(plant.soilPreference, soilTestResult)) return false;
    }

    return true;
  });

  return sortPlants(result, query);
}

/**
 * Sort plants: native-qc first, then adaptive, fruit-bearing, introduced.
 * Secondary sort by name relevance when searching.
 * @param {Plant[]} plants
 * @param {string} [query]
 * @returns {Plant[]}
 */
export function sortPlants(plants, query = '') {
  return [...plants].sort((a, b) => {
    const originDiff = (ORIGIN_ORDER[a.origin] ?? 99) - (ORIGIN_ORDER[b.origin] ?? 99);
    if (originDiff !== 0) return originDiff;

    if (query) {
      const aScore = nameMatchScore(a, query);
      const bScore = nameMatchScore(b, query);
      if (aScore !== bScore) return bScore - aScore;
    }

    return a.name.localeCompare(b.name);
  });
}

/**
 * @param {Plant} plant
 * @param {string} query
 * @returns {number}
 */
function nameMatchScore(plant, query) {
  const name = plant.name.toLowerCase();
  if (name === query) return 100;
  if (name.startsWith(query)) return 80;
  if (name.includes(query)) return 50;
  return 0;
}

/**
 * Format zone array for display, e.g. [3,4,5] → "Zones 3-5"
 * @param {number[]} zones
 * @returns {string}
 */
export function getZoneDisplay(zones) {
  if (!zones || zones.length === 0) return 'Unknown';
  const sorted = [...zones].sort((a, b) => a - b);
  if (sorted.length === 1) return `Zone ${sorted[0]}`;
  const isConsecutive = sorted.every((z, i) => i === 0 || z === sorted[i - 1] + 1);
  if (isConsecutive) return `Zones ${sorted[0]}-${sorted[sorted.length - 1]}`;
  return `Zones ${sorted.join(', ')}`;
}

/**
 * Beginner score 0–100: lower maintenance/water needs and wider hardiness = easier.
 * @param {Plant} plant
 * @returns {number}
 */
export function calculateBeginnerScore(plant) {
  let score = 50;

  const maintenanceScores = { low: 25, medium: 15, high: 5 };
  score += maintenanceScores[plant.maintenance] ?? 10;

  const waterScores = { low: 15, medium: 10, high: 5 };
  score += waterScores[plant.waterNeeds] ?? 5;

  if (plant.sunRequirements === 'full-sun') score += 10;
  else if (plant.sunRequirements === 'partial-shade') score += 15;

  const zoneSpan = plant.hardinessZone.length;
  score += Math.min(zoneSpan * 3, 15);

  if (plant.isNative) score += 10;

  return Math.min(100, Math.max(0, score));
}

/**
 * Check if current month falls within a period string like "May-June" or "Apr-Oct".
 * @param {string} periodStr
 * @returns {boolean}
 */
export function isInSeason(periodStr) {
  if (!periodStr || periodStr.toLowerCase() === 'n/a' || periodStr === '—') return false;

  const monthMap = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
    january: 0, february: 1, march: 2, april: 3, june: 5,
    july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
  };

  const currentMonth = new Date().getMonth();
  const parts = periodStr.split(/[-–—to]+/i).map((p) => p.trim().toLowerCase());

  const months = parts
    .map((p) => {
      const key = Object.keys(monthMap).find((k) => p.startsWith(k));
      return key ? monthMap[key] : null;
    })
    .filter((m) => m !== null);

  if (months.length === 0) return true;
  if (months.length === 1) return currentMonth === months[0];

  const [start, end] = months;
  if (start <= end) return currentMonth >= start && currentMonth <= end;
  // Wraps year boundary (e.g. Nov-Mar)
  return currentMonth >= start || currentMonth <= end;
}

/**
 * Get localized plant description with French fallback to English.
 * @param {Plant} plant
 * @param {'en'|'fr'} locale
 * @returns {string}
 */
export function getPlantDescription(plant, locale) {
  if (locale === 'fr' && plant.descriptionFr) return plant.descriptionFr;
  return plant.description;
}
