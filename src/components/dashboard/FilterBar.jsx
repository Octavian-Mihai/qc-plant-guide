import { useState, useEffect, useCallback } from 'react';
import useStore from '../../store/useStore';
import { useTranslation } from '../../i18n/useTranslation';

const ZONES = [2, 3, 4, 5];
const PERIODS = ['all', 'planting', 'bloom', 'harvest'];
const ORIGINS = ['all', 'native-qc', 'adaptive', 'fruit-bearing'];

/** Filter controls with debounced search (300ms). */
export default function FilterBar() {
  const { t } = useTranslation();
  const {
    searchQuery, zoneFilter, periodFilter, originFilter,
    setSearchQuery, setZoneFilter, setPeriodFilter, setOriginFilter, resetFilters,
  } = useStore();

  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Debounce search input — waits 300ms after typing stops
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(localSearch), 300);
    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery]);

  const toggleZone = useCallback(
    (zone) => {
      const next = zoneFilter.includes(zone)
        ? zoneFilter.filter((z) => z !== zone)
        : [...zoneFilter, zone];
      setZoneFilter(next);
    },
    [zoneFilter, setZoneFilter]
  );

  const periodLabels = {
    all: t('filters.periodAll'),
    planting: t('filters.periodPlanting'),
    bloom: t('filters.periodBloom'),
    harvest: t('filters.periodHarvest'),
  };

  const originLabels = {
    all: t('filters.originAll'),
    'native-qc': t('filters.originNative'),
    adaptive: t('filters.originAdaptive'),
    'fruit-bearing': t('filters.originFruit'),
  };

  return (
    <div className="card space-y-4" aria-label="Plant filters">
      {/* Search */}
      <input
        type="search"
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        placeholder={t('filters.search')}
        className="w-full rounded-lg border border-forest/20 px-4 py-2 text-forest-dark focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest-light"
        aria-label={t('filters.search')}
      />

      <div className="flex flex-wrap gap-4">
        {/* Zone multi-select */}
        <div>
          <label className="mb-1 block text-sm font-medium text-forest-dark">{t('filters.zone')}</label>
          <div className="flex flex-wrap gap-1">
            {ZONES.map((zone) => (
              <button
                key={zone}
                type="button"
                onClick={() => toggleZone(zone)}
                className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                  zoneFilter.includes(zone)
                    ? 'bg-forest text-white'
                    : 'bg-forest/10 text-forest-dark hover:bg-forest/20'
                }`}
                aria-pressed={zoneFilter.includes(zone)}
              >
                {zone}
              </button>
            ))}
          </div>
        </div>

        {/* Period toggle group */}
        <div>
          <label className="mb-1 block text-sm font-medium text-forest-dark">{t('filters.period')}</label>
          <div className="flex flex-wrap gap-1">
            {PERIODS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriodFilter(p)}
                className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                  periodFilter === p
                    ? 'bg-forest text-white'
                    : 'bg-forest/10 text-forest-dark hover:bg-forest/20'
                }`}
                aria-pressed={periodFilter === p}
              >
                {periodLabels[p]}
              </button>
            ))}
          </div>
        </div>

        {/* Origin dropdown */}
        <div>
          <label htmlFor="origin-filter" className="mb-1 block text-sm font-medium text-forest-dark">
            {t('filters.origin')}
          </label>
          <select
            id="origin-filter"
            value={originFilter}
            onChange={(e) => setOriginFilter(e.target.value)}
            className="rounded-lg border border-forest/20 px-3 py-2 text-sm text-forest-dark"
            aria-label={t('filters.origin')}
          >
            {ORIGINS.map((o) => (
              <option key={o} value={o}>{originLabels[o]}</option>
            ))}
          </select>
        </div>
      </div>

      <button type="button" onClick={resetFilters} className="text-sm text-forest underline hover:text-forest-light">
        {t('filters.reset')}
      </button>
    </div>
  );
}
