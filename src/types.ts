/** TypeScript interfaces only — runtime code uses plain JS with JSDoc references to these types. */

export type PlantOrigin = 'native-qc' | 'adaptive' | 'introduced' | 'fruit-bearing';

export type SoilPreference =
  | 'sandy'
  | 'loamy'
  | 'clay'
  | 'silty'
  | 'well-drained'
  | 'acidic'
  | 'alkaline'
  | 'moist';

export type MaintenanceLevel = 'low' | 'medium' | 'high';

export type WaterNeeds = 'low' | 'medium' | 'high';

export type SunRequirement = 'full-sun' | 'partial-shade' | 'full-shade';

export type BloomColor =
  | 'red'
  | 'yellow'
  | 'blue'
  | 'white'
  | 'purple'
  | 'orange'
  | 'pink'
  | 'green';

export type FoliageColor = 'green' | 'purple' | 'variegated' | 'silver' | 'red';

export type FoliageTexture = 'fine' | 'medium' | 'coarse';

export type WildlifeType = 'butterflies' | 'bees' | 'hummingbirds' | 'birds';

export type EdiblePart = 'fruit' | 'leaves' | 'roots' | 'flowers' | 'seeds';

export type ThemeMode = 'light' | 'dark';

export interface TroubleshootingItem {
  problem: string;
  solution: string;
}

export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  descriptionFr?: string;
  origin: PlantOrigin;
  hardinessZone: number[];
  height: string;
  spread: string;
  sunRequirements: SunRequirement;
  waterNeeds: WaterNeeds;
  soilPreference: SoilPreference[];
  maintenance: MaintenanceLevel;
  plantingPeriod: string;
  bloomPeriod: string;
  harvestPeriod: string;
  dormancyPeriod: string;
  costCad: number;
  troubleshooting: TroubleshootingItem[];
  tags: string[];
  isNative: boolean;
  isFruitBearing: boolean;
  heightCmMin: number;
  heightCmMax: number;
  spacingCm: number;
  bloomColors: BloomColor[];
  foliageColor: FoliageColor;
  foliageTexture: FoliageTexture;
  wildlifeAttracts: WildlifeType[];
  edibleParts: EdiblePart[];
  medicinalUses: string[];
  droughtTolerant: boolean;
  deerResistant: boolean;
  saltTolerant: boolean;
  companionIds: string[];
  avoidIds: string[];
}

export type Locale = 'en' | 'fr';

export type PeriodFilter = 'all' | 'planting' | 'bloom' | 'harvest';

export type OriginFilter = 'all' | 'native-qc' | 'adaptive' | 'fruit-bearing';

export interface SoilTestResult {
  texture: 'sandy' | 'loamy' | 'clay' | 'silty';
  ph: 'acidic' | 'neutral' | 'alkaline';
  drainage: 'good' | 'poor' | 'unknown';
}

export interface FilterState {
  searchQuery: string;
  zoneFilter: number[];
  periodFilter: PeriodFilter;
  originFilter: OriginFilter;
  soilTestResult: SoilTestResult | null;
}

export interface AdvancedFilterState {
  bloomColors: BloomColor[];
  heightRange: [number, number];
  foliageColor: FoliageColor | 'all';
  foliageTexture: FoliageTexture | 'all';
  wildlifeFilter: WildlifeType[];
  edibleFilter: EdiblePart[];
  medicinalOnly: boolean;
  droughtFilter: boolean | null;
  deerFilter: boolean | null;
  saltFilter: boolean | null;
}

export interface GardenCell {
  row: number;
  col: number;
  plantId: string | null;
}

export type GardenBedSize = '4x4' | '4x8' | '8x8';

export interface GardenLayout {
  id: string;
  name: string;
  bedSize: GardenBedSize;
  cells: GardenCell[];
  createdAt: string;
  updatedAt: string;
}

export interface Pest {
  id: string;
  nameEn: string;
  nameFr: string;
  imageUrl: string;
  identification: { en: string; fr: string };
  affectedPlants: string[];
  naturalControls: { en: string[]; fr: string[] };
  beneficialInsects: { en: string[]; fr: string[] };
  organicTreatments: { en: string[]; fr: string[] };
  beneficialPlants: string[];
  pestType: 'insect' | 'mammal' | 'disease';
}

export interface CompanionRule {
  plantA: string;
  plantB: string;
  relationship: 'good' | 'bad' | 'neutral';
  reasonEn: string;
  reasonFr: string;
}

export interface SeedScheduleEntry {
  plantId: string;
  weeksBeforeLastFrost: number | null;
  transplantWeeksAfterLastFrost: number;
  hardeningDays: number;
  minSoilTempC: number;
  directSow: boolean;
}

export interface SeedReminder {
  id: string;
  plantId: string;
  type: 'start' | 'transplant' | 'hardening';
  date: string;
  notified: boolean;
}

export interface MicrogreenBatch {
  id: string;
  variety: string;
  startDate: string;
  daysToHarvest: number;
}

export interface CityFrostPreset {
  id: string;
  nameEn: string;
  nameFr: string;
  lastFrost: string;
  firstFrost: string;
  zone: number;
}
