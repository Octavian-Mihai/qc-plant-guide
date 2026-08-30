/**
 * Global Zustand store for plants, filters, UI state, and locale.
 */

import { create } from 'zustand';
import plantsData from '../data/plants.json';
import { filterPlants } from '../utils/plantHelpers';

/** @typedef {import('../types').Plant} Plant */
/** @typedef {import('../types').SoilTestResult} SoilTestResult */
/** @typedef {import('../types').Locale} Locale */
/** @typedef {import('../types').PeriodFilter} PeriodFilter */
/** @typedef {import('../types').OriginFilter} OriginFilter */

const useStore = create((set, get) => ({
  // Plant data
  plants: /** @type {Plant[]} */ (plantsData),
  filteredPlants: /** @type {Plant[]} */ (plantsData),

  // Filters
  searchQuery: '',
  zoneFilter: /** @type {number[]} */ ([]),
  periodFilter: /** @type {PeriodFilter} */ ('all'),
  originFilter: /** @type {OriginFilter} */ ('all'),
  soilTestResult: /** @type {SoilTestResult|null} */ (null),

  // UI
  currentPage: 1,
  selectedPlant: /** @type {Plant|null} */ (null),
  locale: /** @type {Locale} */ (
    typeof localStorage !== 'undefined' && localStorage.getItem('locale') === 'fr' ? 'fr' : 'en'
  ),

  setSearchQuery: (searchQuery) => {
    set({ searchQuery, currentPage: 1 });
    get().applyFilters();
  },

  setZoneFilter: (zoneFilter) => {
    set({ zoneFilter, currentPage: 1 });
    get().applyFilters();
  },

  setPeriodFilter: (periodFilter) => {
    set({ periodFilter, currentPage: 1 });
    get().applyFilters();
  },

  setOriginFilter: (originFilter) => {
    set({ originFilter, currentPage: 1 });
    get().applyFilters();
  },

  setSoilTestResult: (soilTestResult) => {
    set({ soilTestResult, currentPage: 1 });
    get().applyFilters();
  },

  applyFilters: () => {
    const state = get();
    const filtered = filterPlants(state.plants, {
      searchQuery: state.searchQuery,
      zoneFilter: state.zoneFilter,
      periodFilter: state.periodFilter,
      originFilter: state.originFilter,
      soilTestResult: state.soilTestResult,
    });
    set({ filteredPlants: filtered });
  },

  resetFilters: () => {
    set({
      searchQuery: '',
      zoneFilter: [],
      periodFilter: 'all',
      originFilter: 'all',
      soilTestResult: null,
      currentPage: 1,
    });
    get().applyFilters();
  },

  setSelectedPlant: (selectedPlant) => set({ selectedPlant }),

  setCurrentPage: (currentPage) => set({ currentPage }),

  setLocale: (locale) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('locale', locale);
    }
    set({ locale });
  },
}));

export default useStore;
