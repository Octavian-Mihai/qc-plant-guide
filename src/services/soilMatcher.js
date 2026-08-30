/**
 * Maps soil test wizard output to compatible plant soilPreference tags.
 * Uses scored matching: strong (recommended), moderate (may tolerate), none.
 */

/** @typedef {import('../types').SoilPreference} SoilPreference */
/** @typedef {import('../types').SoilTestResult} SoilTestResult */
/** @typedef {'strong' | 'moderate' | 'none'} SoilMatchTier */

/**
 * Get compatible soil tags from wizard result.
 * @param {SoilTestResult} result
 * @returns {SoilPreference[]}
 */
export function getCompatibleSoilTags(result) {
  const tags = [result.texture];

  if (result.ph === 'acidic') tags.push('acidic');
  else if (result.ph === 'alkaline') tags.push('alkaline');

  if (result.drainage === 'good' || result.drainage === 'unknown') {
    tags.push('well-drained');
  }

  if (result.texture === 'clay') tags.push('moist');
  if (result.texture === 'sandy') tags.push('sandy');

  return [...new Set(tags)];
}

/**
 * Count overlapping tags between plant preferences and compatible set.
 * @param {SoilPreference[]} plantSoils
 * @param {SoilTestResult} soilResult
 * @returns {number}
 */
export function getSoilMatchScore(plantSoils, soilResult) {
  if (soilResult.drainage === 'poor' && plantSoils.includes('well-drained')) {
    return 0;
  }

  const compatible = getCompatibleSoilTags(soilResult);
  return plantSoils.filter((s) => compatible.includes(s)).length;
}

/**
 * Classify how well a plant matches the user's soil profile.
 *
 * Strong: texture matches AND (2+ tag overlap OR all plant prefs satisfied)
 * Moderate: 1 tag overlap only
 * None: no overlap or drainage conflict
 *
 * @param {SoilPreference[]} plantSoils
 * @param {SoilTestResult} soilResult
 * @returns {SoilMatchTier}
 */
export function getSoilMatchTier(plantSoils, soilResult) {
  const score = getSoilMatchScore(plantSoils, soilResult);
  if (score === 0) return 'none';

  const compatible = getCompatibleSoilTags(soilResult);
  const textureMatch = plantSoils.includes(soilResult.texture);
  const allPrefsMet = plantSoils.every((s) => compatible.includes(s));

  // Silty soil behaves like loamy for many plants
  const textureOk =
    textureMatch ||
    (soilResult.texture === 'silty' && plantSoils.includes('loamy')) ||
    (soilResult.texture === 'loamy' && plantSoils.includes('silty'));

  if (textureOk && (score >= 2 || allPrefsMet)) return 'strong';
  if (score >= 1) return 'moderate';
  return 'none';
}

/**
 * Strong matches only — used for filtering the main results grid.
 * @param {SoilPreference[]} plantSoils
 * @param {SoilTestResult} soilResult
 * @returns {boolean}
 */
export function matchSoilCompatibility(plantSoils, soilResult) {
  return getSoilMatchTier(plantSoils, soilResult) === 'strong';
}

/**
 * @param {import('../types').Plant[]} plants
 * @param {SoilTestResult} soilResult
 * @returns {{ strong: number; moderate: number; total: number }}
 */
export function countSoilMatches(plants, soilResult) {
  let strong = 0;
  let moderate = 0;
  for (const plant of plants) {
    const tier = getSoilMatchTier(plant.soilPreference, soilResult);
    if (tier === 'strong') strong += 1;
    else if (tier === 'moderate') moderate += 1;
  }
  return { strong, moderate, total: plants.length };
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
