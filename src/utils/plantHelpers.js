/**
 * Plant filtering, sorting, and scoring utilities.
 */

/** @typedef {import('../types').Plant} Plant */
/** @typedef {import('../types').FilterState} FilterState */
/** @typedef {import('../types').AdvancedFilterState} AdvancedFilterState */
/** @typedef {import('../types').SoilTestResult} SoilTestResult */

import { matchSoilCompatibility, getSoilMatchScore } from '../services/soilMatcher';
import companionData from '../data/companions.json';

const ORIGIN_ORDER = { 'native-qc': 0, adaptive: 1, 'fruit-bearing': 2, introduced: 3 };

/**
 * @typedef {FilterState & { advancedFilters?: AdvancedFilterState }} ExtendedFilters
 */

/**
 * Filter plants by search, zone, period, origin, soil test, and advanced filters.
 * @param {Plant[]} plants
 * @param {ExtendedFilters} filters
 * @returns {Plant[]}
 */
export function filterPlants(plants, filters) {
  const { searchQuery, zoneFilter, periodFilter, originFilter, soilTestResult, advancedFilters } = filters;
  const query = searchQuery.trim().toLowerCase();

  let result = plants.filter((plant) => {
    if (query) {
      const haystack = [
        plant.name,
        plant.nameFr,
        plant.scientificName,
        plant.description,
        ...(plant.tags || []),
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    if (zoneFilter.length > 0) {
      const matchesZone = plant.hardinessZone.some((z) => zoneFilter.includes(z));
      if (!matchesZone) return false;
    }

    if (originFilter !== 'all') {
      if (originFilter === 'native-qc' && plant.origin !== 'native-qc') return false;
      if (originFilter === 'adaptive' && plant.origin !== 'adaptive') return false;
      if (originFilter === 'fruit-bearing' && !plant.isFruitBearing) return false;
    }

    if (periodFilter !== 'all') {
      const periodField =
        periodFilter === 'planting'
          ? plant.plantingPeriod
          : periodFilter === 'bloom'
            ? plant.bloomPeriod
            : plant.harvestPeriod;
      if (!isInSeason(periodField)) return false;
    }

    if (soilTestResult) {
      if (!matchSoilCompatibility(plant.soilPreference, soilTestResult)) return false;
    }

    if (advancedFilters) {
      if (advancedFilters.bloomColors.length > 0) {
        const overlap = plant.bloomColors?.some((c) => advancedFilters.bloomColors.includes(c));
        if (!overlap) return false;
      }

      const [hMin, hMax] = advancedFilters.heightRange;
      // Skip height filter when at default "show all" range (0–4000 cm)
      const heightFilterActive = hMin > 0 || hMax < 4000;
      if (heightFilterActive && (plant.heightCmMax < hMin || plant.heightCmMin > hMax)) {
        return false;
      }

      if (advancedFilters.foliageColor !== 'all' && plant.foliageColor !== advancedFilters.foliageColor) {
        return false;
      }

      if (advancedFilters.foliageTexture !== 'all' && plant.foliageTexture !== advancedFilters.foliageTexture) {
        return false;
      }

      if (advancedFilters.wildlifeFilter.length > 0) {
        const overlap = plant.wildlifeAttracts?.some((w) => advancedFilters.wildlifeFilter.includes(w));
        if (!overlap) return false;
      }

      if (advancedFilters.edibleFilter.length > 0) {
        const overlap = plant.edibleParts?.some((e) => advancedFilters.edibleFilter.includes(e));
        if (!overlap) return false;
      }

      if (advancedFilters.medicinalOnly && (!plant.medicinalUses || plant.medicinalUses.length === 0)) {
        return false;
      }

      if (advancedFilters.droughtFilter !== null && plant.droughtTolerant !== advancedFilters.droughtFilter) {
        return false;
      }

      if (advancedFilters.deerFilter !== null && plant.deerResistant !== advancedFilters.deerFilter) {
        return false;
      }

      if (advancedFilters.saltFilter !== null && plant.saltTolerant !== advancedFilters.saltFilter) {
        return false;
      }
    }

    return true;
  });

  return sortPlants(result, query, soilTestResult);
}

/**
 * @param {Plant[]} plants
 * @param {string} query
 * @param {SoilTestResult|null} [soilTestResult]
 */
export function sortPlants(plants, query = '', soilTestResult = null) {
  return [...plants].sort((a, b) => {
    if (soilTestResult) {
      const scoreDiff =
        getSoilMatchScore(b.soilPreference, soilTestResult) -
        getSoilMatchScore(a.soilPreference, soilTestResult);
      if (scoreDiff !== 0) return scoreDiff;
    }

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

function nameMatchScore(plant, query) {
  const names = [plant.name, plant.nameFr].filter(Boolean).map((n) => n.toLowerCase());
  if (names.some((n) => n === query)) return 100;
  if (names.some((n) => n.startsWith(query))) return 80;
  if (names.some((n) => n.includes(query))) return 50;
  return 0;
}

export function getZoneDisplay(zones) {
  if (!zones || zones.length === 0) return 'Unknown';
  const sorted = [...zones].sort((a, b) => a - b);
  if (sorted.length === 1) return `Zone ${sorted[0]}`;
  const isConsecutive = sorted.every((z, i) => i === 0 || z === sorted[i - 1] + 1);
  if (isConsecutive) return `Zones ${sorted[0]}-${sorted[sorted.length - 1]}`;
  return `Zones ${sorted.join(', ')}`;
}

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
  return currentMonth >= start || currentMonth <= end;
}

export function getPlantDescription(plant, locale) {
  if (locale === 'fr' && plant.descriptionFr) return plant.descriptionFr;
  return plant.description;
}

/** Localized common name; falls back to English `name`. */
export function getPlantName(plant, locale) {
  if (locale === 'fr' && plant?.nameFr) return plant.nameFr;
  return plant?.name || '';
}

/** @param {Plant} plant @param {'en'|'fr'} locale @param {Function} t */
export function getPlantAttributeChips(plant, locale, t) {
  const chips = [];
  if (plant.deerResistant) chips.push({ label: t('filters.advanced.deerResistant'), type: 'tolerance' });
  if (plant.droughtTolerant) chips.push({ label: t('filters.advanced.droughtTolerant'), type: 'tolerance' });
  if (plant.saltTolerant) chips.push({ label: t('filters.advanced.saltTolerant'), type: 'tolerance' });
  plant.bloomColors?.forEach((c) => chips.push({ label: t(`filters.advanced.colors.${c}`), type: 'bloom' }));
  plant.wildlifeAttracts?.forEach((w) => chips.push({ label: t(`filters.advanced.wildlife.${w}`), type: 'wildlife' }));
  plant.edibleParts?.forEach((e) => chips.push({ label: t(`filters.advanced.edible.${e}`), type: 'edible' }));
  return chips;
}

/**
 * Find a companions.json rule for a pair (order-independent).
 * @param {string} idA
 * @param {string} idB
 * @param {import('../types').CompanionRule[]} [rules]
 */
function findCompanionRule(idA, idB, rules = companionData.rules) {
  return rules.find(
    (r) =>
      (r.plantA === idA && r.plantB === idB) ||
      (r.plantA === idB && r.plantB === idA)
  );
}

/**
 * Bidirectional companion pair with optional rule reason.
 * Good if A lists B, B lists A, or a rule says good.
 * Avoid if either side lists the other in avoidIds or a rule says bad.
 * Avoid wins over good when both apply.
 * @param {Plant|string} plantA
 * @param {Plant|string} plantB
 * @param {Plant[]} plants
 * @param {import('../types').CompanionRule[]} [rules]
 * @returns {{ status: 'good'|'bad'|'neutral', reasonEn: string, reasonFr: string }}
 */
export function getCompanionPair(plantA, plantB, plants, rules = companionData.rules) {
  const empty = { status: /** @type {const} */ ('neutral'), reasonEn: '', reasonFr: '' };
  const resolve = (ref) => {
    if (!ref) return null;
    if (typeof ref === 'string') return plants.find((p) => p.id === ref) || { id: ref, companionIds: [], avoidIds: [] };
    return ref;
  };
  const a = resolve(plantA);
  const b = resolve(plantB);
  if (!a?.id || !b?.id || a.id === b.id) return empty;

  const rule = findCompanionRule(a.id, b.id, rules);
  const listedAvoid =
    a.avoidIds?.includes(b.id) || b.avoidIds?.includes(a.id) || rule?.relationship === 'bad';
  const listedGood =
    a.companionIds?.includes(b.id) || b.companionIds?.includes(a.id) || rule?.relationship === 'good';

  if (listedAvoid) {
    return {
      status: 'bad',
      reasonEn: rule?.reasonEn || '',
      reasonFr: rule?.reasonFr || '',
    };
  }
  if (listedGood) {
    return {
      status: 'good',
      reasonEn: rule?.reasonEn || '',
      reasonFr: rule?.reasonFr || '',
    };
  }
  return empty;
}

/**
 * Bidirectional companion status for garden planner and matrix.
 * @param {string} plantId
 * @param {Plant[]} plants
 * @param {Plant} placed
 */
export function getCompanionStatus(plantId, plants, placed) {
  if (!placed || placed.id === plantId) return 'neutral';
  return getCompanionPair(placed, plantId, plants).status;
}

const MONTH_KEYS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/** @param {string} periodStr @returns {string[]} month keys such as 'jul' */
export function getBloomMonthKeys(periodStr) {
  if (!periodStr || periodStr.toLowerCase() === 'n/a' || periodStr === '—') return [];

  const monthMap = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
    january: 0, february: 1, march: 2, april: 3, june: 5,
    july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
  };

  const parts = periodStr.split(/[-–—to]+/i).map((p) => p.trim().toLowerCase());
  const months = parts
    .map((p) => {
      const key = Object.keys(monthMap).find((k) => p.startsWith(k));
      return key ? monthMap[key] : null;
    })
    .filter((m) => m !== null);

  if (months.length === 0) return [];
  if (months.length === 1) return [MONTH_KEYS[months[0]]];

  const [start, end] = months;
  const keys = [];
  let cur = start;
  for (let i = 0; i < 12; i++) {
    keys.push(MONTH_KEYS[cur]);
    if (cur === end) break;
    cur = (cur + 1) % 12;
  }
  return keys;
}

/**
 * Prefill a 4×4 Three Sisters bed: squash at corners, corn in the center, beans around corn.
 * @param {string} cornId
 * @param {string} beansId
 * @param {string} squashId
 * @param {string} name
 * @returns {import('../types').GardenLayout}
 */
export function createThreeSistersLayout(cornId, beansId, squashId, name) {
  const bedSize = /** @type {const} */ ('4x4');
  const pattern = [
    [squashId, beansId, beansId, squashId],
    [beansId, cornId, cornId, beansId],
    [beansId, cornId, cornId, beansId],
    [squashId, beansId, beansId, squashId],
  ];
  const cells = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      cells.push({ row: r, col: c, plantId: pattern[r][c] });
    }
  }
  const now = new Date().toISOString();
  const id = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `three-sisters-${now}`;
  return { id, name, bedSize, cells, createdAt: now, updatedAt: now };
}

/** @param {import('../types').GardenBedSize} bedSize */
export function getBedDimensions(bedSize) {
  if (bedSize === '4x4') return { rows: 4, cols: 4 };
  if (bedSize === '4x8') return { rows: 4, cols: 8 };
  return { rows: 8, cols: 8 };
}

/** @param {number} spacingCm @param {number} cellSizeCm */
export function getCellSpan(spacingCm, cellSizeCm = 30) {
  return Math.max(1, Math.ceil(spacingCm / cellSizeCm));
}

export const CELL_SIZE_CM = 30;

export const BLOOM_COLOR_HEX = {
  red: '#ef4444',
  yellow: '#eab308',
  blue: '#3b82f6',
  white: '#f8fafc',
  purple: '#a855f7',
  orange: '#f97316',
  pink: '#ec4899',
  green: '#22c55e',
};
