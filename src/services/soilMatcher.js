/**
 * Maps soil test wizard output to compatible plant soilPreference tags.
 */

/** @typedef {import('../types').SoilPreference} SoilPreference */
/** @typedef {import('../types').SoilTestResult} SoilTestResult */

/**
 * Get compatible soil tags from wizard result.
 * @param {SoilTestResult} result
 * @returns {SoilPreference[]}
 */
export function getCompatibleSoilTags(result) {
  const tags = [result.texture];

  if (result.ph === 'acidic') tags.push('acidic');
  else if (result.ph === 'alkaline') tags.push('alkaline');
  else tags.push('loamy');

  if (result.drainage === 'good' || result.drainage === 'unknown') {
    tags.push('well-drained');
  }

  if (result.texture === 'clay') tags.push('moist');

  return [...new Set(tags)];
}

/**
 * Check if plant soil preferences match the user's soil test.
 * When drainage is poor, plants requiring well-drained are excluded.
 * @param {SoilPreference[]} plantSoils
 * @param {SoilTestResult} soilResult
 * @returns {boolean}
 */
export function matchSoilCompatibility(plantSoils, soilResult) {
  const compatible = getCompatibleSoilTags(soilResult);

  // Poor drainage excludes plants that need well-drained soil
  if (soilResult.drainage === 'poor' && plantSoils.includes('well-drained')) {
    return false;
  }

  // Plant must share at least one soil tag with compatible set
  const hasMatch = plantSoils.some((s) => compatible.includes(s));
  if (hasMatch) return true;

  // Loamy is a universal fallback for neutral soils
  if (soilResult.texture === 'loamy' && plantSoils.includes('loamy')) return true;

  return false;
}

/**
 * Human-readable summary of soil test result.
 * @param {SoilTestResult} result
 * @param {'en'|'fr'} locale
 * @returns {string}
 */
export function getSoilSummary(result, locale = 'en') {
  const textureLabels = {
    en: { sandy: 'Sandy', loamy: 'Loamy', clay: 'Clay', silty: 'Silty' },
    fr: { sandy: 'Sableux', loamy: 'Limoneux', clay: 'Argileux', silty: 'Silteux' },
  };
  const phLabels = {
    en: { acidic: 'Acidic', neutral: 'Neutral', alkaline: 'Alkaline' },
    fr: { acidic: 'Acide', neutral: 'Neutre', alkaline: 'Alcalin' },
  };
  const drainLabels = {
    en: { good: 'Good drainage', poor: 'Poor drainage', unknown: 'Unknown drainage' },
    fr: { good: 'Bon drainage', poor: 'Mauvais drainage', unknown: 'Drainage inconnu' },
  };

  const t = textureLabels[locale][result.texture];
  const p = phLabels[locale][result.ph];
  const d = drainLabels[locale][result.drainage];
  return `${t}, ${p}, ${d}`;
}
