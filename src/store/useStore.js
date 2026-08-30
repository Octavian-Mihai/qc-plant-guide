/**
 * Global Zustand store for plants, filters, UI state, locale, and V2 features.
 */

import { create } from 'zustand';
import plantsData from '../data/plants.json';
import { filterPlants } from '../utils/plantHelpers';

/** @typedef {import('../types').Plant} Plant */
/** @typedef {import('../types').SoilTestResult} SoilTestResult */
/** @typedef {import('../types').Locale} Locale */
/** @typedef {import('../types').PeriodFilter} PeriodFilter */
/** @typedef {import('../types').OriginFilter} OriginFilter */
/** @typedef {import('../types').AdvancedFilterState} AdvancedFilterState */
/** @typedef {import('../types').GardenLayout} GardenLayout */
/** @typedef {import('../types').SeedReminder} SeedReminder */
/** @typedef {import('../types').ThemeMode} ThemeMode */

const STORAGE_KEYS = {
  favorites: 'qc-favorites',
  gardenLayouts: 'qc-garden-layouts',
  seedReminders: 'qc-seed-reminders',
  theme: 'qc-theme',
  compareList: 'qc-compare-list',
};

/** @template T @param {string} key @param {T} fallback @returns {T} */
function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/** @param {string} key @param {unknown} value */
function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* ignore */ }
}

/** @type {AdvancedFilterState} */
const defaultAdvancedFilters = {
  bloomColors: [],
  heightRange: [0, 4000],
  foliageColor: 'all',
  foliageTexture: 'all',
  wildlifeFilter: [],
  edibleFilter: [],
  medicinalOnly: false,
  droughtFilter: null,
  deerFilter: null,
  saltFilter: null,
};

/** @param {ThemeMode} theme */
function applyThemeClass(theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

const initialTheme = /** @type {ThemeMode} */ (
  typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEYS.theme) === 'dark' ? 'dark' : 'light'
);
applyThemeClass(initialTheme);

const useStore = create((set, get) => ({
  plants: /** @type {Plant[]} */ (plantsData),
  filteredPlants: /** @type {Plant[]} */ (plantsData),

  searchQuery: '',
  zoneFilter: /** @type {number[]} */ ([]),
  periodFilter: /** @type {PeriodFilter} */ ('all'),
  originFilter: /** @type {OriginFilter} */ ('all'),
  soilTestResult: /** @type {SoilTestResult|null} */ (null),
  advancedFilters: { ...defaultAdvancedFilters },

  currentPage: 1,
  selectedPlant: /** @type {Plant|null} */ (null),
  locale: /** @type {Locale} */ (
    typeof localStorage !== 'undefined' && localStorage.getItem('locale') === 'fr' ? 'fr' : 'en'
  ),

  favorites: /** @type {string[]} */ (loadJSON(STORAGE_KEYS.favorites, [])),
  compareList: /** @type {string[]} */ (loadJSON(STORAGE_KEYS.compareList, [])),
  gardenLayouts: /** @type {GardenLayout[]} */ (loadJSON(STORAGE_KEYS.gardenLayouts, [])),
  activeLayoutId: /** @type {string|null} */ (null),
  seedCityId: 'montreal',
  seedSchedules: /** @type {SeedReminder[]} */ (loadJSON(STORAGE_KEYS.seedReminders, [])),
  theme: initialTheme,

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

  setAdvancedFilters: (partial) => {
    set((s) => ({ advancedFilters: { ...s.advancedFilters, ...partial }, currentPage: 1 }));
    get().applyFilters();
  },

  resetAdvancedFilters: () => {
    set({ advancedFilters: { ...defaultAdvancedFilters }, currentPage: 1 });
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
      advancedFilters: state.advancedFilters,
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
      advancedFilters: { ...defaultAdvancedFilters },
      currentPage: 1,
    });
    get().applyFilters();
  },

  setSelectedPlant: (selectedPlant) => set({ selectedPlant }),
  setCurrentPage: (currentPage) => set({ currentPage }),

  setLocale: (locale) => {
    if (typeof localStorage !== 'undefined') localStorage.setItem('locale', locale);
    set({ locale });
  },

  toggleFavorite: (plantId) => {
    set((s) => {
      const favorites = s.favorites.includes(plantId)
        ? s.favorites.filter((id) => id !== plantId)
        : [...s.favorites, plantId];
      saveJSON(STORAGE_KEYS.favorites, favorites);
      return { favorites };
    });
  },

  mergeFavorites: (ids) => {
    set((s) => {
      const favorites = [...new Set([...s.favorites, ...ids])];
      saveJSON(STORAGE_KEYS.favorites, favorites);
      return { favorites };
    });
  },

  isFavorite: (plantId) => get().favorites.includes(plantId),

  addToCompare: (plantId) => {
    set((s) => {
      if (s.compareList.includes(plantId)) return s;
      const compareList = s.compareList.length >= 3
        ? [...s.compareList.slice(1), plantId]
        : [...s.compareList, plantId];
      saveJSON(STORAGE_KEYS.compareList, compareList);
      return { compareList };
    });
  },

  removeFromCompare: (plantId) => {
    set((s) => {
      const compareList = s.compareList.filter((id) => id !== plantId);
      saveJSON(STORAGE_KEYS.compareList, compareList);
      return { compareList };
    });
  },

  clearCompare: () => {
    saveJSON(STORAGE_KEYS.compareList, []);
    set({ compareList: [] });
  },

  saveGardenLayout: (layout) => {
    set((s) => {
      const idx = s.gardenLayouts.findIndex((l) => l.id === layout.id);
      const gardenLayouts = idx >= 0
        ? s.gardenLayouts.map((l) => (l.id === layout.id ? layout : l))
        : [...s.gardenLayouts, layout];
      saveJSON(STORAGE_KEYS.gardenLayouts, gardenLayouts);
      return { gardenLayouts, activeLayoutId: layout.id };
    });
  },

  deleteGardenLayout: (layoutId) => {
    set((s) => {
      const gardenLayouts = s.gardenLayouts.filter((l) => l.id !== layoutId);
      saveJSON(STORAGE_KEYS.gardenLayouts, gardenLayouts);
      return {
        gardenLayouts,
        activeLayoutId: s.activeLayoutId === layoutId ? null : s.activeLayoutId,
      };
    });
  },

  setActiveLayoutId: (activeLayoutId) => set({ activeLayoutId }),
  setSeedCityId: (seedCityId) => set({ seedCityId }),

  addSeedReminder: (reminder) => {
    set((s) => {
      const seedSchedules = [...s.seedSchedules, reminder];
      saveJSON(STORAGE_KEYS.seedReminders, seedSchedules);
      return { seedSchedules };
    });
  },

  markSeedReminderNotified: (reminderId) => {
    set((s) => {
      const seedSchedules = s.seedSchedules.map((r) =>
        r.id === reminderId ? { ...r, notified: true } : r
      );
      saveJSON(STORAGE_KEYS.seedReminders, seedSchedules);
      return { seedSchedules };
    });
  },

  setTheme: (theme) => {
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEYS.theme, theme);
    applyThemeClass(theme);
    set({ theme });
  },

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(next);
  },
}));

export default useStore;
