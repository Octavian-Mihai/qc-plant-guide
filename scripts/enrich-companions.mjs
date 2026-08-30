/**
 * One-off enrichment: fill companionIds/avoidIds and add catalog plants
 * for the companion planting page. Run from repo root: node scripts/enrich-companions.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const plantsPath = join(root, 'src/data/plants.json');

const ID = {
  blackWalnut: '7c4e9a12-3b8f-4d21-9e56-a1c8f0b247d3',
  sunflower: '2f8d1c90-6e4a-4b73-8c15-d9e3a7f5b042',
  corn: '5a1b8e34-9c2d-4f67-b0e8-3d4c6a9f1e75',
  poleBeans: '8d3c6f21-4a9b-4e18-9d52-c7b0e4f8a163',
  winterSquash: '1e7f4a90-2b5c-4d83-a6e1-9f8c3b5d2074',
};

const plants = JSON.parse(readFileSync(plantsPath, 'utf8'));
const byName = Object.fromEntries(plants.map((p) => [p.name, p]));
const idOf = (name) => {
  const p = byName[name];
  if (!p) throw new Error(`Missing plant: ${name}`);
  return p.id;
};

const extraGood = {
  'Sugar Maple': ['Paper Birch', 'Bunchberry', 'Wild Strawberry'],
  'Red Oak': ['Serviceberry', 'Lowbush Blueberry', 'Bunchberry'],
  'White Pine': ['Balsam Fir', 'Bunchberry', 'Lowbush Blueberry'],
  'Balsam Fir': ['White Pine', 'Bunchberry', 'Paper Birch'],
  'Paper Birch': ['Trembling Aspen', 'Bunchberry', 'White Pine'],
  'Trembling Aspen': ['Paper Birch', 'Red Osier Dogwood', 'Serviceberry'],
  'Red Osier Dogwood': ['Highbush Cranberry', 'Nannyberry', 'Wild Strawberry'],
  'Staghorn Sumac': ['Wild Rose', 'Black-Eyed Susan', 'Goldenrod'],
  'Serviceberry': ['Highbush Cranberry', 'Wild Strawberry', 'Honeycrisp Apple'],
  'Chokecherry': ['Serviceberry', 'Highbush Cranberry', 'Nannyberry'],
  'Highbush Cranberry': ['Serviceberry', 'Nannyberry', 'Wild Rose'],
  'Nannyberry': ['Highbush Cranberry', 'Serviceberry', 'Red Osier Dogwood'],
  'Wild Rose': ['Highbush Cranberry', 'Rugosa Rose', 'Serviceberry'],
  'Blue Flag Iris': ['Joe-Pye Weed', 'Cardinal Flower', 'Red Osier Dogwood'],
  'Cardinal Flower': ['Joe-Pye Weed', 'Wild Bergamot', 'Blue Flag Iris'],
  'Joe-Pye Weed': ['Wild Bergamot', 'Butterfly Milkweed', 'New England Aster'],
  'Black-Eyed Susan': ['Wild Bergamot', 'Butterfly Milkweed', 'New England Aster'],
  'Wild Bergamot': ['Butterfly Milkweed', 'Black-Eyed Susan', 'Coneflower'],
  'Butterfly Milkweed': ['New England Aster', 'Goldenrod', 'Wild Bergamot'],
  'New England Aster': ['Black-Eyed Susan', 'Coneflower', 'Goldenrod'],
  'Goldenrod': ['Butterfly Milkweed', 'Black-Eyed Susan', 'Coneflower'],
  'Virginia Creeper': ['Serviceberry', 'Wild Strawberry', 'Red Osier Dogwood'],
  'Wild Strawberry': ['Serviceberry', 'June-bearing Strawberry', 'Bunchberry'],
  'Lowbush Blueberry': ['Highbush Blueberry', 'Bunchberry', 'White Pine'],
  'Bunchberry': ['White Pine', 'Paper Birch', 'Wild Strawberry', 'Sugar Maple'],
  'Haskap': ['Honeycrisp Apple', 'Lowbush Blueberry', 'Serviceberry'],
  'Hardy Kiwi': ['Valiant Grape', 'Concord Grape'],
  'Sea Buckthorn': ['Russian Sage', 'Sedum', 'Rugosa Rose'],
  'Rugosa Rose': ['Wild Rose', 'Sea Buckthorn', 'Russian Sage'],
  'Russian Sage': ['Sedum', 'Coneflower', 'Black-Eyed Susan'],
  'Sedum': ['Russian Sage', 'Daylilies', 'Black-Eyed Susan'],
  'Daylilies': ['Oriental Poppy', 'Coneflower', 'Shasta Daisy'],
  'Peonies': ['Delphinium', 'Korean Lilac', 'Bearded Iris'],
  'Bearded Iris': ['Oriental Poppy', 'Shasta Daisy', 'Peonies'],
  'Oriental Poppy': ['Daylilies', 'Peonies', 'Bearded Iris'],
  'Lupine': ['Wild Bergamot', 'Coneflower', 'Delphinium'],
  'Delphinium': ['Shasta Daisy', 'Lupine', 'Peonies'],
  'Shasta Daisy': ['Wild Bergamot', 'Coneflower', 'Daylilies'],
  'Coneflower': ['Wild Bergamot', 'Butterfly Milkweed', 'Honeycrisp Apple'],
  'Russian Hawthorn': ['Korean Lilac', 'Siberian Crabapple'],
  'Siberian Crabapple': ['Honeycrisp Apple', 'Ussurian Pear', 'McIntosh Apple'],
  'Ussurian Pear': ['Bartlett Pear', 'Siberian Crabapple'],
  'Amur Maple': ['Dwarf Korean Lilac', 'Korean Lilac'],
  'Korean Lilac': ['Peonies', 'Dwarf Korean Lilac', 'Amur Maple'],
  'Dwarf Korean Lilac': ['Amur Maple', 'Peonies', 'Korean Lilac'],
  'Honeycrisp Apple': ['Valley Land Apple', 'Serviceberry', 'Coneflower', 'June-bearing Strawberry'],
  'McIntosh Apple': ['Valley Land Apple', 'Siberian Crabapple', 'Serviceberry'],
  'Valley Land Apple': ['Honeycrisp Apple', 'McIntosh Apple', 'Serviceberry'],
  'Montmorency Cherry': ['Evans Cherry', 'Nanking Cherry'],
  'Nanking Cherry': ['Wild Rose', 'Evans Cherry'],
  'Evans Cherry': ['Montmorency Cherry', 'Nanking Cherry'],
  'Redhaven Peach': ['Bartlett Pear', 'Honeycrisp Apple'],
  'Bartlett Pear': ['Ussurian Pear', 'Flemish Beauty Pear'],
  'Flemish Beauty Pear': ['Bartlett Pear', 'Ussurian Pear'],
  'Red Raspberry': ['Black Raspberry', 'June-bearing Strawberry', 'Golden Raspberry'],
  'Golden Raspberry': ['Black Raspberry', 'Red Raspberry'],
  'Black Raspberry': ['Golden Raspberry', 'Red Raspberry'],
  'June-bearing Strawberry': ['Honeycrisp Apple', 'Red Raspberry', 'Wild Strawberry'],
  'Everbearing Strawberry': ['Wild Strawberry', 'June-bearing Strawberry'],
  'Highbush Blueberry': ['Lowbush Blueberry', 'Half-High Blueberry'],
  'Half-High Blueberry': ['Lowbush Blueberry', 'Highbush Blueberry'],
  'Concord Grape': ['Valiant Grape', 'Hardy Kiwi'],
  'Valiant Grape': ['Concord Grape', 'Hardy Kiwi'],
};

const extraAvoid = {
  'Sugar Maple': ['Black Walnut'],
  'Red Oak': ['Black Walnut'],
  'White Pine': ['Russian Sage'],
  'Balsam Fir': ['Russian Sage'],
  'Paper Birch': ['Black Walnut'],
  'Trembling Aspen': ['Black Walnut'],
  'Red Osier Dogwood': ['Russian Sage'],
  'Staghorn Sumac': ['Blue Flag Iris'],
  'Serviceberry': ['Black Walnut'],
  'Chokecherry': ['Black Walnut'],
  'Highbush Cranberry': ['Black Walnut'],
  'Nannyberry': ['Black Walnut'],
  'Wild Rose': ['Black Walnut'],
  'Blue Flag Iris': ['Russian Sage', 'Sedum', 'Sea Buckthorn'],
  'Cardinal Flower': ['Russian Sage', 'Sedum', 'Sunflower'],
  'Joe-Pye Weed': ['Russian Sage', 'Sedum'],
  'Black-Eyed Susan': ['Sunflower'],
  'Wild Bergamot': ['Sunflower'],
  'Butterfly Milkweed': ['Sunflower'],
  'New England Aster': ['Sunflower'],
  'Goldenrod': ['Sunflower'],
  'Virginia Creeper': ['Black Walnut'],
  'Wild Strawberry': ['Sunflower', 'Black Walnut'],
  'Lowbush Blueberry': ['Black Walnut', 'Russian Sage'],
  'Bunchberry': ['Sunflower', 'Russian Sage'],
  'Haskap': ['Black Walnut'],
  'Hardy Kiwi': ['Black Walnut'],
  'Sea Buckthorn': ['Blue Flag Iris', 'Joe-Pye Weed'],
  'Rugosa Rose': ['Black Walnut'],
  'Russian Sage': ['Lowbush Blueberry', 'Highbush Blueberry', 'Half-High Blueberry', 'Blue Flag Iris'],
  'Sedum': ['Blue Flag Iris', 'Joe-Pye Weed', 'Sunflower'],
  'Daylilies': ['Sunflower'],
  'Peonies': ['Black Walnut', 'Sunflower'],
  'Bearded Iris': ['Sunflower'],
  'Oriental Poppy': ['Sunflower'],
  'Lupine': ['Sunflower'],
  'Delphinium': ['Sunflower'],
  'Shasta Daisy': ['Sunflower'],
  'Coneflower': ['Sunflower'],
  'Russian Hawthorn': ['Black Walnut'],
  'Siberian Crabapple': ['Black Walnut'],
  'Ussurian Pear': ['Black Walnut'],
  'Amur Maple': ['Black Walnut'],
  'Korean Lilac': ['Black Walnut'],
  'Dwarf Korean Lilac': ['Black Walnut'],
  'Honeycrisp Apple': ['Black Walnut'],
  'McIntosh Apple': ['Black Walnut'],
  'Valley Land Apple': ['Black Walnut'],
  'Montmorency Cherry': ['Black Walnut'],
  'Nanking Cherry': ['Black Walnut'],
  'Evans Cherry': ['Black Walnut'],
  'Redhaven Peach': ['Black Walnut'],
  'Bartlett Pear': ['Black Walnut'],
  'Flemish Beauty Pear': ['Black Walnut'],
  'Red Raspberry': ['Black Walnut'],
  'Golden Raspberry': ['Black Walnut'],
  'Black Raspberry': ['Black Walnut'],
  'June-bearing Strawberry': ['Sunflower', 'Black Walnut'],
  'Everbearing Strawberry': ['Sunflower', 'Black Walnut'],
  'Highbush Blueberry': ['Black Walnut', 'Russian Sage'],
  'Half-High Blueberry': ['Black Walnut', 'Russian Sage'],
  'Concord Grape': ['Black Walnut'],
  'Valiant Grape': ['Black Walnut'],
};

const nameToId = (name) => {
  if (name === 'Black Walnut') return ID.blackWalnut;
  if (name === 'Sunflower') return ID.sunflower;
  if (name === 'Corn') return ID.corn;
  if (name === 'Pole Beans') return ID.poleBeans;
  if (name === 'Winter Squash') return ID.winterSquash;
  return idOf(name);
};

function mergeIds(arr, extra) {
  return [...new Set([...(arr || []), ...extra])];
}

for (const p of plants) {
  const goodNames = extraGood[p.name] || [];
  const avoidNames = extraAvoid[p.name] || [];
  p.companionIds = mergeIds(p.companionIds, goodNames.map(nameToId));
  p.avoidIds = mergeIds(p.avoidIds, avoidNames.map(nameToId));
}

const TROUBLE = [
  { problem: 'Yellowing leaves', solution: 'Check soil moisture and nutrient levels; adjust watering schedule.' },
  { problem: 'Pest damage', solution: 'Inspect regularly; use insecticidal soap or introduce beneficial insects.' },
  { problem: 'Slow growth', solution: 'Ensure adequate sunlight and amend soil with compost in spring.' },
];

const newPlants = [
  {
    id: ID.blackWalnut,
    name: 'Black Walnut',
    scientificName: 'Juglans nigra',
    origin: 'native-qc',
    isNative: true,
    isFruitBearing: true,
    hardinessZone: [4, 5, 6],
    height: '20-30 m',
    spread: '15-25 m',
    sunRequirements: 'full-sun',
    waterNeeds: 'medium',
    soilPreference: ['loamy', 'well-drained'],
    maintenance: 'low',
    plantingPeriod: 'Apr-May',
    bloomPeriod: 'May-Jun',
    harvestPeriod: 'Sep-Oct',
    dormancyPeriod: 'Nov-Mar',
    costCad: 55,
    tags: ['tree', 'native', 'allelopathic', 'nut'],
    description:
      'Black Walnut is a stately eastern native that produces edible nuts and valuable timber, but it releases juglone from roots, leaves, and hulls. In Quebec, keep fruit trees, blueberries, and many garden crops well outside the drip line — often 15 m or more. Evergreens such as White Pine and Balsam Fir tolerate juglone better than apples or pears. Plant in full sun on deep, well-drained loam in zones 4–6. Fallen leaves and hulls should be composted separately. A reference species for allelopathy planning rather than a mixed orchard tree.',
    descriptionFr:
      'Le noyer noir est un grand arbre natif qui produit des noix comestibles mais libère de la juglone, toxique pour de nombreux fruitiers et petits fruits. Au Québec, éloignez pommiers, poiriers, cerisiers et bleuets de sa zone racinaire.',
    troubleshooting: TROUBLE,
    heightCmMin: 2000,
    heightCmMax: 3000,
    spacingCm: 1500,
    bloomColors: ['green', 'yellow'],
    foliageColor: 'green',
    foliageTexture: 'coarse',
    wildlifeAttracts: ['birds'],
    edibleParts: ['seeds'],
    medicinalUses: [],
    droughtTolerant: true,
    deerResistant: false,
    saltTolerant: false,
    companionIds: [idOf('White Pine'), idOf('Balsam Fir'), idOf('Staghorn Sumac')],
    avoidIds: [
      idOf('Honeycrisp Apple'), idOf('McIntosh Apple'), idOf('Valley Land Apple'),
      idOf('Bartlett Pear'), idOf('Flemish Beauty Pear'), idOf('Ussurian Pear'), idOf('Siberian Crabapple'),
      idOf('Montmorency Cherry'), idOf('Nanking Cherry'), idOf('Evans Cherry'), idOf('Redhaven Peach'),
      idOf('Lowbush Blueberry'), idOf('Highbush Blueberry'), idOf('Half-High Blueberry'),
      idOf('Concord Grape'), idOf('Valiant Grape'),
    ],
  },
  {
    id: ID.sunflower,
    name: 'Sunflower',
    scientificName: 'Helianthus annuus',
    origin: 'adaptive',
    isNative: false,
    isFruitBearing: true,
    hardinessZone: [3, 4, 5, 6],
    height: '1.5-3 m',
    spread: '0.4-0.8 m',
    sunRequirements: 'full-sun',
    waterNeeds: 'medium',
    soilPreference: ['loamy', 'sandy', 'well-drained'],
    maintenance: 'low',
    plantingPeriod: 'May-Jun',
    bloomPeriod: 'Jul-Sep',
    harvestPeriod: 'Sep-Oct',
    dormancyPeriod: 'Oct-Apr',
    costCad: 8,
    tags: ['annual', 'pollinator', 'allelopathic', 'edible'],
    description:
      'Garden sunflower is a Quebec-hardy annual sown after May 10 when soil has warmed. Tall cultivars shade and leach allelopathic compounds that can stunt nearby small perennials and strawberries — site them on the north or east edge of beds, not among compact natives. Birds and bees use the late-summer bloom; harvest heads before the first hard frost (often by October 10 in southern Quebec). Direct-sow in full sun. Not a perennial; replant each year after last frost.',
    descriptionFr:
      'Le tournesol est un annuel rustique au Québec, semé après le 10 mai. Ses composés allélopathiques peuvent inhiber les petites vivaces et fraisiers voisins; planter en bordure. Récolter avant le 10 octobre.',
    troubleshooting: TROUBLE,
    heightCmMin: 150,
    heightCmMax: 300,
    spacingCm: 45,
    bloomColors: ['yellow', 'orange'],
    foliageColor: 'green',
    foliageTexture: 'coarse',
    wildlifeAttracts: ['bees', 'birds', 'butterflies'],
    edibleParts: ['seeds'],
    medicinalUses: [],
    droughtTolerant: true,
    deerResistant: false,
    saltTolerant: false,
    companionIds: [idOf('Staghorn Sumac'), idOf('Sea Buckthorn')],
    avoidIds: [
      idOf('Wild Strawberry'), idOf('Bunchberry'), idOf('Sedum'), idOf('Blue Flag Iris'),
      idOf('Cardinal Flower'), idOf('Oriental Poppy'), idOf('Bearded Iris'), idOf('Shasta Daisy'),
      idOf('Lupine'), idOf('Delphinium'), idOf('June-bearing Strawberry'), idOf('Everbearing Strawberry'),
      ID.corn, ID.poleBeans,
    ],
  },
  {
    id: ID.corn,
    name: 'Corn',
    scientificName: 'Zea mays',
    origin: 'introduced',
    isNative: false,
    isFruitBearing: true,
    hardinessZone: [4, 5],
    height: '1.8-2.5 m',
    spread: '0.4-0.6 m',
    sunRequirements: 'full-sun',
    waterNeeds: 'high',
    soilPreference: ['loamy', 'well-drained'],
    maintenance: 'medium',
    plantingPeriod: 'May-Jun',
    bloomPeriod: 'Jul-Aug',
    harvestPeriod: 'Aug-Sep',
    dormancyPeriod: 'Oct-Apr',
    costCad: 6,
    tags: ['annual', 'vegetable', 'three-sisters'],
    description:
      'Quebec-hardy sweet or flint corn for short-season gardens (zones 4–5). Direct-sow after May 10 when soil is at least 15°C; plant in blocks for pollination, not single rows. In the Three Sisters polyculture, corn is the trellis for pole beans. Harvest ears before the average first frost around October 10. Needs full sun, rich loam, and steady water. Choose early varieties (70–80 days) for southern and central Quebec.',
    descriptionFr:
      'Maïs rustique pour la saison courte du Québec (zones 4–5). Semer après le 10 mai en blocs pour la pollinisation. Tuteur des haricots dans les trois sœurs. Récolter avant le 10 octobre.',
    troubleshooting: TROUBLE,
    heightCmMin: 180,
    heightCmMax: 250,
    spacingCm: 30,
    bloomColors: ['yellow', 'green'],
    foliageColor: 'green',
    foliageTexture: 'coarse',
    wildlifeAttracts: ['birds'],
    edibleParts: ['seeds'],
    medicinalUses: [],
    droughtTolerant: false,
    deerResistant: false,
    saltTolerant: false,
    companionIds: [ID.poleBeans, ID.winterSquash],
    avoidIds: [ID.sunflower, ID.blackWalnut],
  },
  {
    id: ID.poleBeans,
    name: 'Pole Beans',
    scientificName: 'Phaseolus vulgaris',
    origin: 'introduced',
    isNative: false,
    isFruitBearing: true,
    hardinessZone: [4, 5, 6],
    height: '1.8-3 m',
    spread: '0.3-0.5 m',
    sunRequirements: 'full-sun',
    waterNeeds: 'medium',
    soilPreference: ['loamy', 'well-drained'],
    maintenance: 'low',
    plantingPeriod: 'May-Jun',
    bloomPeriod: 'Jul-Aug',
    harvestPeriod: 'Jul-Sep',
    dormancyPeriod: 'Oct-Apr',
    costCad: 5,
    tags: ['annual', 'vegetable', 'three-sisters', 'nitrogen-fixer'],
    description:
      'Pole beans climb corn stalks in the Three Sisters planting and fix nitrogen for corn and squash. Sow after May 10 in Quebec once nights stay above 10°C. Choose early climbing cultivars suited to zones 4–5. Harvest pods through summer and clear vines before October 10 frost. Full sun and well-drained loam; avoid soggy clay. Do not plant beside allelopathic sunflowers.',
    descriptionFr:
      'Haricots à rames qui grimpent sur le maïs et fixent l\'azote pour les trois sœurs. Semer après le 10 mai au Québec; récolter avant le 10 octobre. Éviter le voisinage du tournesol.',
    troubleshooting: TROUBLE,
    heightCmMin: 180,
    heightCmMax: 300,
    spacingCm: 20,
    bloomColors: ['white', 'purple'],
    foliageColor: 'green',
    foliageTexture: 'medium',
    wildlifeAttracts: ['bees'],
    edibleParts: ['fruit', 'seeds'],
    medicinalUses: [],
    droughtTolerant: false,
    deerResistant: false,
    saltTolerant: false,
    companionIds: [ID.corn, ID.winterSquash],
    avoidIds: [ID.sunflower],
  },
  {
    id: ID.winterSquash,
    name: 'Winter Squash',
    scientificName: 'Cucurbita maxima',
    origin: 'introduced',
    isNative: false,
    isFruitBearing: true,
    hardinessZone: [4, 5],
    height: '0.4-0.6 m',
    spread: '2-4 m',
    sunRequirements: 'full-sun',
    waterNeeds: 'high',
    soilPreference: ['loamy', 'well-drained'],
    maintenance: 'medium',
    plantingPeriod: 'May-Jun',
    bloomPeriod: 'Jul-Aug',
    harvestPeriod: 'Sep-Oct',
    dormancyPeriod: 'Oct-Apr',
    costCad: 7,
    tags: ['annual', 'vegetable', 'three-sisters'],
    description:
      'Winter squash (buttercup, hubbard, or similar short-season types) is the living mulch of the Three Sisters: large leaves shade soil and suppress weeds around corn and beans. Transplant or direct-sow after May 10 in Quebec; fruit must mature before the October 10 frost window. Full sun, rich moist loam, and room to sprawl. Cure fruits in a warm dry spot for winter storage. Zone 4–5 hardy as an annual crop only.',
    descriptionFr:
      'Courge d\'hiver à saison courte, paillis vivant des trois sœurs. Planter après le 10 mai au Québec et récolter avant le 10 octobre. Grandes feuilles qui ombragent le sol.',
    troubleshooting: TROUBLE,
    heightCmMin: 40,
    heightCmMax: 60,
    spacingCm: 90,
    bloomColors: ['yellow', 'orange'],
    foliageColor: 'green',
    foliageTexture: 'coarse',
    wildlifeAttracts: ['bees'],
    edibleParts: ['fruit', 'seeds'],
    medicinalUses: [],
    droughtTolerant: false,
    deerResistant: false,
    saltTolerant: false,
    companionIds: [ID.corn, ID.poleBeans],
    avoidIds: [ID.blackWalnut, ID.sunflower],
  },
];

const existingIds = new Set(plants.map((p) => p.id));
for (const np of newPlants) {
  if (!existingIds.has(np.id)) plants.push(np);
}

const allById = Object.fromEntries(plants.map((p) => [p.id, p]));

function addUnique(arr, id) {
  if (!arr.includes(id)) arr.push(id);
}

for (const p of plants) {
  for (const cid of p.companionIds || []) {
    const other = allById[cid];
    if (other) addUnique(other.companionIds || (other.companionIds = []), p.id);
  }
  for (const aid of p.avoidIds || []) {
    const other = allById[aid];
    if (other) addUnique(other.avoidIds || (other.avoidIds = []), p.id);
  }
}

for (const p of plants) {
  p.companionIds = (p.companionIds || []).filter((id) => id !== p.id);
  p.avoidIds = (p.avoidIds || []).filter((id) => id !== p.id);
  const avoid = new Set(p.avoidIds);
  p.companionIds = p.companionIds.filter((id) => !avoid.has(id));
}

writeFileSync(plantsPath, `${JSON.stringify(plants, null, 2)}\n`);

const emptyAvoid = plants.filter((p) => !p.avoidIds?.length).map((p) => p.name);
const emptyComp = plants.filter((p) => !p.companionIds?.length).map((p) => p.name);
console.log('plants', plants.length);
console.log('empty companionIds', emptyComp);
console.log('empty avoidIds', emptyAvoid);
console.log('IDs', ID);
