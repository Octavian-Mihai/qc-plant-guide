/**
 * One-time script to extend plants.json with V2 schema fields.
 * Run: node scripts/extendPlants.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const plantsPath = join(__dirname, '../src/data/plants.json');
const plants = JSON.parse(readFileSync(plantsPath, 'utf8'));

function parseHeightCm(heightStr) {
  if (!heightStr) return { min: 30, max: 60 };
  const normalized = heightStr.toLowerCase().replace(/,/g, '.');
  const rangeMatch = normalized.match(/([\d.]+)\s*[-–]\s*([\d.]+)\s*(m|cm|ft)?/);
  const singleMatch = normalized.match(/([\d.]+)\s*(m|cm|ft)?/);

  const toCm = (val, unit) => {
    if (unit === 'm' || (!unit && val < 50)) return Math.round(val * 100);
    if (unit === 'ft') return Math.round(val * 30.48);
    return Math.round(val);
  };

  if (rangeMatch) {
    const unit = rangeMatch[3] || (parseFloat(rangeMatch[1]) < 50 ? 'm' : 'cm');
    return {
      min: toCm(parseFloat(rangeMatch[1]), unit),
      max: toCm(parseFloat(rangeMatch[2]), unit),
    };
  }
  if (singleMatch) {
    const unit = singleMatch[2] || (parseFloat(singleMatch[1]) < 50 ? 'm' : 'cm');
    const val = toCm(parseFloat(singleMatch[1]), unit);
    return { min: val, max: val };
  }
  return { min: 30, max: 60 };
}

function getSpacing(tags, heightMax) {
  if (tags.includes('tree')) return 300;
  if (tags.includes('vine')) return 90;
  if (tags.includes('shrub') || tags.includes('berry')) return 120;
  if (tags.includes('groundcover')) return 30;
  if (heightMax > 200) return 300;
  if (heightMax > 100) return 150;
  if (heightMax > 60) return 60;
  return 45;
}

const PLANT_OVERRIDES = {
  'Sugar Maple': { bloomColors: ['yellow', 'green'], wildlifeAttracts: ['birds'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: false, droughtTolerant: false, saltTolerant: false, edibleParts: [], medicinalUses: [], companionIds: ['Red Oak', 'White Pine', 'Serviceberry'], avoidIds: [] },
  'Red Oak': { bloomColors: ['yellow', 'green'], wildlifeAttracts: ['birds'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: false, droughtTolerant: true, saltTolerant: false, edibleParts: [], medicinalUses: [], companionIds: ['Sugar Maple', 'White Pine'], avoidIds: [] },
  'White Pine': { bloomColors: ['green'], wildlifeAttracts: ['birds'], foliageColor: 'green', foliageTexture: 'fine', deerResistant: true, droughtTolerant: false, saltTolerant: false, edibleParts: [], medicinalUses: [], companionIds: ['Red Oak', 'Sugar Maple'], avoidIds: [] },
  'Balsam Fir': { bloomColors: ['green'], wildlifeAttracts: ['birds'], foliageColor: 'green', foliageTexture: 'fine', deerResistant: true, droughtTolerant: false, saltTolerant: false, edibleParts: [], medicinalUses: ['respiratory aid'], companionIds: ['Paper Birch'], avoidIds: [] },
  'Paper Birch': { bloomColors: ['green', 'yellow'], wildlifeAttracts: ['birds'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: false, droughtTolerant: false, saltTolerant: false, edibleParts: [], medicinalUses: [], companionIds: ['Balsam Fir', 'Wild Bergamot'], avoidIds: [] },
  'Trembling Aspen': { bloomColors: ['green'], wildlifeAttracts: ['birds'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: false, droughtTolerant: true, saltTolerant: false, edibleParts: [], medicinalUses: [], companionIds: ['Serviceberry'], avoidIds: [] },
  'Red Osier Dogwood': { bloomColors: ['white'], wildlifeAttracts: ['birds', 'butterflies'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: true, droughtTolerant: false, saltTolerant: true, edibleParts: [], medicinalUses: [], companionIds: ['Wild Rose', 'Serviceberry'], avoidIds: [] },
  'Staghorn Sumac': { bloomColors: ['green', 'red'], wildlifeAttracts: ['birds', 'butterflies'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: true, droughtTolerant: true, saltTolerant: true, edibleParts: ['fruit'], medicinalUses: ['anti-inflammatory'], companionIds: ['Wild Bergamot'], avoidIds: [] },
  'Serviceberry': { bloomColors: ['white'], wildlifeAttracts: ['birds', 'bees'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: false, droughtTolerant: false, saltTolerant: false, edibleParts: ['fruit'], medicinalUses: [], companionIds: ['Wild Rose', 'Red Osier Dogwood'], avoidIds: [] },
  'Chokecherry': { bloomColors: ['white'], wildlifeAttracts: ['birds', 'bees'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: false, droughtTolerant: true, saltTolerant: false, edibleParts: ['fruit'], medicinalUses: [], companionIds: ['Wild Rose'], avoidIds: [] },
  'Highbush Cranberry': { bloomColors: ['white'], wildlifeAttracts: ['birds', 'bees'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: false, droughtTolerant: false, saltTolerant: false, edibleParts: ['fruit'], medicinalUses: [], companionIds: ['Wild Rose'], avoidIds: [] },
  'Nannyberry': { bloomColors: ['white'], wildlifeAttracts: ['birds', 'bees'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: false, droughtTolerant: false, saltTolerant: false, edibleParts: ['fruit'], medicinalUses: [], companionIds: ['Wild Rose'], avoidIds: [] },
  'Wild Rose': { bloomColors: ['pink'], wildlifeAttracts: ['bees', 'birds'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: true, droughtTolerant: true, saltTolerant: false, edibleParts: ['flowers', 'fruit'], medicinalUses: ['anti-inflammatory'], companionIds: ['Serviceberry', 'Chokecherry'], avoidIds: [] },
  'Blue Flag Iris': { bloomColors: ['blue', 'purple'], wildlifeAttracts: ['bees', 'hummingbirds'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: true, droughtTolerant: false, saltTolerant: false, edibleParts: [], medicinalUses: [], companionIds: ['Cardinal Flower'], avoidIds: [] },
  'Cardinal Flower': { bloomColors: ['red'], wildlifeAttracts: ['hummingbirds', 'butterflies'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: true, droughtTolerant: false, saltTolerant: false, edibleParts: [], medicinalUses: [], companionIds: ['Blue Flag Iris', 'Wild Bergamot'], avoidIds: [] },
  'Joe-Pye Weed': { bloomColors: ['pink', 'purple'], wildlifeAttracts: ['butterflies', 'bees'], foliageColor: 'green', foliageTexture: 'coarse', deerResistant: true, droughtTolerant: false, saltTolerant: false, edibleParts: [], medicinalUses: ['anti-inflammatory'], companionIds: ['New England Aster', 'Goldenrod'], avoidIds: [] },
  'Black-Eyed Susan': { bloomColors: ['yellow'], wildlifeAttracts: ['butterflies', 'bees'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: true, droughtTolerant: true, saltTolerant: true, edibleParts: [], medicinalUses: [], companionIds: ['Coneflower', 'Goldenrod'], avoidIds: [] },
  'Wild Bergamot': { bloomColors: ['purple', 'pink'], wildlifeAttracts: ['bees', 'butterflies', 'hummingbirds'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: true, droughtTolerant: true, saltTolerant: false, edibleParts: ['leaves'], medicinalUses: ['antiseptic'], companionIds: ['New England Aster', 'Goldenrod', 'Cardinal Flower'], avoidIds: [] },
  'Butterfly Milkweed': { bloomColors: ['orange'], wildlifeAttracts: ['butterflies', 'bees'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: true, droughtTolerant: true, saltTolerant: false, edibleParts: [], medicinalUses: [], companionIds: ['Black-Eyed Susan', 'Coneflower'], avoidIds: [] },
  'New England Aster': { bloomColors: ['purple', 'pink'], wildlifeAttracts: ['butterflies', 'bees'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: true, droughtTolerant: false, saltTolerant: false, edibleParts: [], medicinalUses: [], companionIds: ['Goldenrod', 'Wild Bergamot', 'Joe-Pye Weed'], avoidIds: [] },
  'Goldenrod': { bloomColors: ['yellow'], wildlifeAttracts: ['bees', 'butterflies'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: true, droughtTolerant: true, saltTolerant: false, edibleParts: [], medicinalUses: ['anti-inflammatory'], companionIds: ['New England Aster', 'Wild Bergamot', 'Joe-Pye Weed'], avoidIds: [] },
  'Virginia Creeper': { bloomColors: ['green'], wildlifeAttracts: ['birds'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: true, droughtTolerant: true, saltTolerant: false, edibleParts: ['fruit'], medicinalUses: [], companionIds: ['Wild Strawberry'], avoidIds: [] },
  'Wild Strawberry': { bloomColors: ['white'], wildlifeAttracts: ['bees', 'birds'], foliageColor: 'green', foliageTexture: 'fine', deerResistant: false, droughtTolerant: true, saltTolerant: false, edibleParts: ['fruit', 'leaves'], medicinalUses: [], companionIds: ['Virginia Creeper'], avoidIds: [] },
  'Lowbush Blueberry': { bloomColors: ['white', 'pink'], wildlifeAttracts: ['bees', 'birds'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: true, droughtTolerant: false, saltTolerant: false, edibleParts: ['fruit'], medicinalUses: ['antioxidant'], companionIds: ['Wild Bergamot'], avoidIds: [] },
  'Bunchberry': { bloomColors: ['white'], wildlifeAttracts: ['birds'], foliageColor: 'green', foliageTexture: 'fine', deerResistant: true, droughtTolerant: false, saltTolerant: false, edibleParts: ['fruit'], medicinalUses: [], companionIds: [], avoidIds: [] },
  'Haskap': { bloomColors: ['yellow', 'white'], wildlifeAttracts: ['bees', 'birds'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: false, droughtTolerant: false, saltTolerant: false, edibleParts: ['fruit'], medicinalUses: ['antioxidant'], companionIds: ['Serviceberry'], avoidIds: [] },
  'Hardy Kiwi': { bloomColors: ['white'], wildlifeAttracts: ['bees'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: false, droughtTolerant: false, saltTolerant: false, edibleParts: ['fruit'], medicinalUses: [], companionIds: ['Concord Grape'], avoidIds: [] },
  'Sea Buckthorn': { bloomColors: ['yellow'], wildlifeAttracts: ['bees', 'birds'], foliageColor: 'silver', foliageTexture: 'fine', deerResistant: true, droughtTolerant: true, saltTolerant: true, edibleParts: ['fruit', 'leaves'], medicinalUses: ['antioxidant'], companionIds: [], avoidIds: [] },
  'Rugosa Rose': { bloomColors: ['pink', 'white'], wildlifeAttracts: ['bees', 'birds'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: true, droughtTolerant: true, saltTolerant: true, edibleParts: ['flowers', 'fruit'], medicinalUses: [], companionIds: ['Lavender'], avoidIds: [] },
  'Russian Sage': { bloomColors: ['purple', 'blue'], wildlifeAttracts: ['bees', 'butterflies'], foliageColor: 'silver', foliageTexture: 'fine', deerResistant: true, droughtTolerant: true, saltTolerant: true, edibleParts: [], medicinalUses: [], companionIds: ['Sedum', 'Coneflower'], avoidIds: [] },
  'Sedum': { bloomColors: ['pink', 'red'], wildlifeAttracts: ['bees', 'butterflies'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: true, droughtTolerant: true, saltTolerant: true, edibleParts: [], medicinalUses: [], companionIds: ['Russian Sage', 'Coneflower'], avoidIds: [] },
  'Daylilies': { bloomColors: ['orange', 'yellow', 'red'], wildlifeAttracts: ['hummingbirds', 'butterflies'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: false, droughtTolerant: true, saltTolerant: true, edibleParts: ['flowers'], medicinalUses: [], companionIds: ['Peonies', 'Shasta Daisy'], avoidIds: [] },
  'Peonies': { bloomColors: ['pink', 'red', 'white'], wildlifeAttracts: ['bees'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: true, droughtTolerant: false, saltTolerant: false, edibleParts: [], medicinalUses: [], companionIds: ['Daylilies', 'Bearded Iris'], avoidIds: [] },
  'Bearded Iris': { bloomColors: ['purple', 'blue', 'white'], wildlifeAttracts: ['bees'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: true, droughtTolerant: true, saltTolerant: false, edibleParts: [], medicinalUses: [], companionIds: ['Peonies', 'Daylilies'], avoidIds: [] },
  'Oriental Poppy': { bloomColors: ['red', 'orange', 'pink'], wildlifeAttracts: ['bees'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: true, droughtTolerant: true, saltTolerant: false, edibleParts: [], medicinalUses: [], companionIds: ['Russian Sage'], avoidIds: [] },
  'Lupine': { bloomColors: ['blue', 'purple', 'pink'], wildlifeAttracts: ['bees', 'butterflies'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: true, droughtTolerant: false, saltTolerant: false, edibleParts: [], medicinalUses: [], companionIds: ['Delphinium'], avoidIds: [] },
  'Delphinium': { bloomColors: ['blue', 'purple'], wildlifeAttracts: ['bees', 'hummingbirds'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: true, droughtTolerant: false, saltTolerant: false, edibleParts: [], medicinalUses: [], companionIds: ['Lupine', 'Peonies'], avoidIds: [] },
  'Shasta Daisy': { bloomColors: ['white', 'yellow'], wildlifeAttracts: ['bees', 'butterflies'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: true, droughtTolerant: true, saltTolerant: false, edibleParts: [], medicinalUses: [], companionIds: ['Daylilies', 'Coneflower'], avoidIds: [] },
  'Coneflower': { bloomColors: ['purple', 'pink'], wildlifeAttracts: ['bees', 'butterflies'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: true, droughtTolerant: true, saltTolerant: false, edibleParts: ['leaves'], medicinalUses: ['immune support'], companionIds: ['Black-Eyed Susan', 'Goldenrod', 'Sedum'], avoidIds: [] },
  'Russian Hawthorn': { bloomColors: ['white', 'pink'], wildlifeAttracts: ['birds', 'bees'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: false, droughtTolerant: true, saltTolerant: false, edibleParts: ['fruit'], medicinalUses: [], companionIds: ['Siberian Crabapple'], avoidIds: [] },
  'Siberian Crabapple': { bloomColors: ['pink', 'white'], wildlifeAttracts: ['bees', 'birds'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: false, droughtTolerant: true, saltTolerant: false, edibleParts: ['fruit'], medicinalUses: [], companionIds: ['Russian Hawthorn'], avoidIds: [] },
  'Ussurian Pear': { bloomColors: ['white'], wildlifeAttracts: ['bees', 'birds'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: false, droughtTolerant: true, saltTolerant: false, edibleParts: ['fruit'], medicinalUses: [], companionIds: ['Siberian Crabapple'], avoidIds: [] },
  'Amur Maple': { bloomColors: ['yellow', 'green'], wildlifeAttracts: ['birds'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: false, droughtTolerant: true, saltTolerant: true, edibleParts: [], medicinalUses: [], companionIds: ['Korean Lilac'], avoidIds: [] },
  'Korean Lilac': { bloomColors: ['purple', 'pink'], wildlifeAttracts: ['bees', 'butterflies'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: false, droughtTolerant: true, saltTolerant: false, edibleParts: [], medicinalUses: [], companionIds: ['Amur Maple', 'Dwarf Korean Lilac'], avoidIds: [] },
  'Dwarf Korean Lilac': { bloomColors: ['purple', 'pink'], wildlifeAttracts: ['bees', 'butterflies'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: false, droughtTolerant: true, saltTolerant: false, edibleParts: [], medicinalUses: [], companionIds: ['Korean Lilac'], avoidIds: [] },
  'Honeycrisp Apple': { bloomColors: ['white', 'pink'], wildlifeAttracts: ['bees', 'birds'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: false, droughtTolerant: false, saltTolerant: false, edibleParts: ['fruit'], medicinalUses: [], companionIds: ['McIntosh Apple', 'Bartlett Pear'], avoidIds: [] },
  'McIntosh Apple': { bloomColors: ['white', 'pink'], wildlifeAttracts: ['bees', 'birds'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: false, droughtTolerant: false, saltTolerant: false, edibleParts: ['fruit'], medicinalUses: [], companionIds: ['Honeycrisp Apple', 'Montmorency Cherry'], avoidIds: [] },
  'Valley Land Apple': { bloomColors: ['white', 'pink'], wildlifeAttracts: ['bees', 'birds'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: false, droughtTolerant: false, saltTolerant: false, edibleParts: ['fruit'], medicinalUses: [], companionIds: ['McIntosh Apple'], avoidIds: [] },
  'Montmorency Cherry': { bloomColors: ['white'], wildlifeAttracts: ['bees', 'birds'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: false, droughtTolerant: false, saltTolerant: false, edibleParts: ['fruit'], medicinalUses: [], companionIds: ['McIntosh Apple', 'Nanking Cherry'], avoidIds: [] },
  'Nanking Cherry': { bloomColors: ['white', 'pink'], wildlifeAttracts: ['bees', 'birds'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: false, droughtTolerant: true, saltTolerant: false, edibleParts: ['fruit'], medicinalUses: [], companionIds: ['Montmorency Cherry', 'Evans Cherry'], avoidIds: [] },
  'Evans Cherry': { bloomColors: ['white'], wildlifeAttracts: ['bees', 'birds'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: false, droughtTolerant: false, saltTolerant: false, edibleParts: ['fruit'], medicinalUses: [], companionIds: ['Nanking Cherry', 'Montmorency Cherry'], avoidIds: [] },
  'Redhaven Peach': { bloomColors: ['pink'], wildlifeAttracts: ['bees'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: false, droughtTolerant: false, saltTolerant: false, edibleParts: ['fruit'], medicinalUses: [], companionIds: ['Bartlett Pear'], avoidIds: [] },
  'Bartlett Pear': { bloomColors: ['white'], wildlifeAttracts: ['bees', 'birds'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: false, droughtTolerant: false, saltTolerant: false, edibleParts: ['fruit'], medicinalUses: [], companionIds: ['Honeycrisp Apple', 'Flemish Beauty Pear'], avoidIds: [] },
  'Flemish Beauty Pear': { bloomColors: ['white'], wildlifeAttracts: ['bees', 'birds'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: false, droughtTolerant: false, saltTolerant: false, edibleParts: ['fruit'], medicinalUses: [], companionIds: ['Bartlett Pear'], avoidIds: [] },
  'Red Raspberry': { bloomColors: ['white'], wildlifeAttracts: ['bees', 'birds'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: false, droughtTolerant: false, saltTolerant: false, edibleParts: ['fruit'], medicinalUses: ['antioxidant'], companionIds: ['Golden Raspberry', 'Highbush Blueberry'], avoidIds: [] },
  'Golden Raspberry': { bloomColors: ['white'], wildlifeAttracts: ['bees', 'birds'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: false, droughtTolerant: false, saltTolerant: false, edibleParts: ['fruit'], medicinalUses: ['antioxidant'], companionIds: ['Red Raspberry'], avoidIds: [] },
  'Black Raspberry': { bloomColors: ['white'], wildlifeAttracts: ['bees', 'birds'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: false, droughtTolerant: false, saltTolerant: false, edibleParts: ['fruit'], medicinalUses: ['antioxidant'], companionIds: ['Red Raspberry'], avoidIds: [] },
  'June-bearing Strawberry': { bloomColors: ['white'], wildlifeAttracts: ['bees'], foliageColor: 'green', foliageTexture: 'fine', deerResistant: false, droughtTolerant: false, saltTolerant: false, edibleParts: ['fruit'], medicinalUses: [], companionIds: ['Everbearing Strawberry', 'Wild Strawberry'], avoidIds: [] },
  'Everbearing Strawberry': { bloomColors: ['white'], wildlifeAttracts: ['bees'], foliageColor: 'green', foliageTexture: 'fine', deerResistant: false, droughtTolerant: false, saltTolerant: false, edibleParts: ['fruit'], medicinalUses: [], companionIds: ['June-bearing Strawberry'], avoidIds: [] },
  'Highbush Blueberry': { bloomColors: ['white', 'pink'], wildlifeAttracts: ['bees', 'birds'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: true, droughtTolerant: false, saltTolerant: false, edibleParts: ['fruit'], medicinalUses: ['antioxidant'], companionIds: ['Red Raspberry', 'Half-High Blueberry'], avoidIds: [] },
  'Half-High Blueberry': { bloomColors: ['white', 'pink'], wildlifeAttracts: ['bees', 'birds'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: true, droughtTolerant: false, saltTolerant: false, edibleParts: ['fruit'], medicinalUses: ['antioxidant'], companionIds: ['Highbush Blueberry'], avoidIds: [] },
  'Concord Grape': { bloomColors: ['green'], wildlifeAttracts: ['bees', 'birds'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: false, droughtTolerant: false, saltTolerant: false, edibleParts: ['fruit'], medicinalUses: [], companionIds: ['Valiant Grape', 'Hardy Kiwi'], avoidIds: [] },
  'Valiant Grape': { bloomColors: ['green'], wildlifeAttracts: ['bees', 'birds'], foliageColor: 'green', foliageTexture: 'medium', deerResistant: false, droughtTolerant: false, saltTolerant: false, edibleParts: ['fruit'], medicinalUses: [], companionIds: ['Concord Grape'], avoidIds: [] },
};

const nameToId = Object.fromEntries(plants.map((p) => [p.name, p.id]));

const extended = plants.map((plant) => {
  const { min, max } = parseHeightCm(plant.height);
  const tags = plant.tags || [];
  const spacingCm = getSpacing(tags, max);
  const override = PLANT_OVERRIDES[plant.name] || {
    bloomColors: tags.includes('pollinator') ? ['yellow'] : ['white'],
    wildlifeAttracts: tags.includes('pollinator') ? ['bees', 'butterflies'] : tags.includes('edible') ? ['birds', 'bees'] : [],
    foliageColor: tags.includes('evergreen') ? 'green' : 'green',
    foliageTexture: tags.includes('succulent') ? 'medium' : tags.includes('tree') ? 'medium' : 'medium',
    deerResistant: tags.includes('native') && !tags.includes('fruit'),
    droughtTolerant: tags.includes('drought tolerant') || plant.waterNeeds === 'low',
    saltTolerant: false,
    edibleParts: tags.includes('edible') || plant.isFruitBearing ? ['fruit'] : [],
    medicinalUses: [],
    companionIds: [],
    avoidIds: [],
  };

  const companionIds = (override.companionIds || [])
    .map((n) => nameToId[n])
    .filter(Boolean);
  const avoidIds = (override.avoidIds || [])
    .map((n) => nameToId[n])
    .filter(Boolean);

  return {
    ...plant,
    heightCmMin: min,
    heightCmMax: max,
    spacingCm,
    bloomColors: override.bloomColors,
    foliageColor: override.foliageColor,
    foliageTexture: override.foliageTexture,
    wildlifeAttracts: override.wildlifeAttracts,
    edibleParts: override.edibleParts,
    medicinalUses: override.medicinalUses,
    droughtTolerant: override.droughtTolerant,
    deerResistant: override.deerResistant,
    saltTolerant: override.saltTolerant,
    companionIds,
    avoidIds,
  };
});

writeFileSync(plantsPath, JSON.stringify(extended, null, 2) + '\n');
console.log(`Extended ${extended.length} plants with V2 fields.`);
