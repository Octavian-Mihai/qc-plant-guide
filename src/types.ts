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
