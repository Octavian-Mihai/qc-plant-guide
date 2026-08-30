/**
 * Date helpers for Quebec gardening calendar.
 * Last frost ~May 10, first frost ~Oct 10 (Southern/Central QC defaults).
 */

/** @typedef {import('../types').Plant} Plant */
/** @typedef {import('../types').CityFrostPreset} CityFrostPreset */

export const QUEBEC_LAST_FROST = { month: 4, day: 10 }; // May 10 (0-indexed month)
export const QUEBEC_FIRST_FROST = { month: 9, day: 10 }; // Oct 10

/** @type {CityFrostPreset[]} */
export const CITY_FROST_PRESETS = [
  { id: 'montreal', nameEn: 'Montreal', nameFr: 'Montréal', lastFrost: 'May 10', firstFrost: 'Oct 10', zone: 5 },
  { id: 'quebec-city', nameEn: 'Quebec City', nameFr: 'Québec', lastFrost: 'May 15', firstFrost: 'Oct 5', zone: 4 },
  { id: 'sherbrooke', nameEn: 'Sherbrooke', nameFr: 'Sherbrooke', lastFrost: 'May 20', firstFrost: 'Oct 1', zone: 4 },
  { id: 'trois-rivieres', nameEn: 'Trois-Rivières', nameFr: 'Trois-Rivières', lastFrost: 'May 12', firstFrost: 'Oct 8', zone: 5 },
  { id: 'gatineau', nameEn: 'Gatineau', nameFr: 'Gatineau', lastFrost: 'May 8', firstFrost: 'Oct 12', zone: 5 },
];

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Parse a month abbreviation from period strings.
 * @param {string} str
 * @returns {number|null}
 */
function parseMonth(str) {
  const idx = MONTH_NAMES.findIndex((m) => str.toLowerCase().startsWith(m.toLowerCase()));
  return idx >= 0 ? idx : null;
}

/**
 * Generate a 12-month care calendar for a plant based on its metadata.
 * @param {Plant} plant
 * @returns {{ month: string; tasks: string[]; season: string }[]}
 */
export function generateMonthlyCalendar(plant) {
  const calendar = MONTH_NAMES.map((month, index) => {
    const tasks = [];
    let season = 'dormant';

    if (index >= 2 && index <= 4) season = 'spring';
    else if (index >= 5 && index <= 7) season = 'summer';
    else if (index >= 8 && index <= 9) season = 'fall';
    else season = 'winter';

    const plantingStart = parseMonth(plant.plantingPeriod.split(/[-–]/)[0]?.trim() || '');
    const plantingEnd = parseMonth(plant.plantingPeriod.split(/[-–]/)[1]?.trim() || plant.plantingPeriod.split(/[-–]/)[0]?.trim() || '');
    const bloomStart = parseMonth(plant.bloomPeriod.split(/[-–]/)[0]?.trim() || '');
    const bloomEnd = parseMonth(plant.bloomPeriod.split(/[-–]/)[1]?.trim() || '');
    const harvestStart = parseMonth(plant.harvestPeriod.split(/[-–]/)[0]?.trim() || '');
    const harvestEnd = parseMonth(plant.harvestPeriod.split(/[-–]/)[1]?.trim() || '');

    if (plantingStart !== null && (plantingEnd !== null ? index >= plantingStart && index <= plantingEnd : index === plantingStart)) {
      tasks.push('Planting window');
    }
    if (bloomStart !== null && bloomEnd !== null && index >= bloomStart && index <= bloomEnd) {
      tasks.push('Bloom period');
    }
    if (harvestStart !== null && harvestEnd !== null && index >= harvestStart && index <= harvestEnd) {
      tasks.push('Harvest time');
    }

    // Frost-sensitive tasks around Quebec frost dates
    if (index === 4) tasks.push('Wait until after May 10 for frost-sensitive planting');
    if (index === 9) tasks.push('Protect before Oct 10 first frost');

    if (plant.dormancyPeriod && plant.dormancyPeriod !== '—') {
      const dormStart = parseMonth(plant.dormancyPeriod.split(/[-–]/)[0]?.trim() || '');
      const dormEnd = parseMonth(plant.dormancyPeriod.split(/[-–]/)[1]?.trim() || '');
      if (dormStart !== null && dormEnd !== null) {
        if (dormStart <= dormEnd ? index >= dormStart && index <= dormEnd : index >= dormStart || index <= dormEnd) {
          tasks.push('Dormant period');
          season = 'dormant';
        }
      }
    }

    if (tasks.length === 0) {
      if (season === 'winter') tasks.push('Monitor for snow damage');
      else if (season === 'spring') tasks.push('Prepare soil, check for pests');
      else if (season === 'summer') tasks.push('Water and weed as needed');
      else tasks.push('Mulch and prepare for winter');
    }

    return { month, tasks, season };
  });

  return calendar;
}

/**
 * Days between two dates.
 * @param {Date} from
 * @param {Date} to
 * @returns {number}
 */
export function daysBetween(from, to) {
  const ms = to.getTime() - from.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

/**
 * Format a date for display.
 * @param {Date|string} date
 * @returns {string}
 */
export function formatDate(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * Calculate planting window days from last frost.
 * @param {CityFrostPreset} city
 * @returns {{ safePlantDate: string; frostFreeDays: number }}
 */
export function getPlantingWindow(city) {
  const frostFreeDays = 152; // Approx May 10 - Oct 10
  return {
    safePlantDate: city.lastFrost,
    frostFreeDays,
  };
}
