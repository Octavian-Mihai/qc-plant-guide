import { useState, useEffect, useCallback } from 'react';
import useStore from '../../store/useStore';
import { useTranslation } from '../../i18n/useTranslation';
import { BLOOM_COLOR_HEX } from '../../utils/plantHelpers';

const ZONES = [2, 3, 4, 5];
const PERIODS = ['all', 'planting', 'bloom', 'harvest'];
const ORIGINS = ['all', 'native-qc', 'adaptive', 'fruit-bearing'];
const BLOOM_COLORS = ['red', 'yellow', 'blue', 'white', 'purple', 'orange', 'pink', 'green'];
const WILDLIFE = ['butterflies', 'bees', 'hummingbirds', 'birds'];
const EDIBLE = ['fruit', 'leaves', 'roots', 'flowers', 'seeds'];
const FOLIAGE_COLORS = ['green', 'purple', 'variegated', 'silver', 'red'];
const FOLIAGE_TEXTURES = ['fine', 'medium', 'coarse'];

/** Filter controls with debounced search and advanced accordion. */
export default function FilterBar() {
  const { t } = useTranslation();
  const {
    searchQuery, zoneFilter, periodFilter, originFilter, advancedFilters,
    setSearchQuery, setZoneFilter, setPeriodFilter, setOriginFilter,
    setAdvancedFilters, resetAdvancedFilters, resetFilters,
  } = useStore();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [advancedOpen, setAdvancedOpen] = useState(false);

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

  const toggleArrayFilter = (key, value) => {
    const current = advancedFilters[key] || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setAdvancedFilters({ [key]: next });
  };

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
    <div className="card space-y-4 dark:bg-darkbg-card" aria-label="Plant filters">
      <input
        type="search"
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        placeholder={t('filters.search')}
        className="w-full rounded-lg border border-forest/20 px-4 py-2 text-forest-dark focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest-light dark:border-forest/30 dark:bg-darkbg dark:text-darkbg-text"
        aria-label={t('filters.search')}
      />

      <div className="flex flex-wrap gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-forest-dark dark:text-darkbg-text">{t('filters.zone')}</label>
          <div className="flex flex-wrap gap-1">
            {ZONES.map((zone) => (
              <button
                key={zone}
                type="button"
                onClick={() => toggleZone(zone)}
                className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                  zoneFilter.includes(zone)
                    ? 'filter-chip-active'
                    : 'filter-chip'
                }`}
                aria-pressed={zoneFilter.includes(zone)}
              >
                {zone}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-forest-dark dark:text-darkbg-text">{t('filters.period')}</label>
          <div className="flex flex-wrap gap-1">
            {PERIODS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriodFilter(p)}
                className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                  periodFilter === p
                    ? 'filter-chip-active'
                    : 'filter-chip'
                }`}
                aria-pressed={periodFilter === p}
              >
                {periodLabels[p]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="origin-filter" className="mb-1 block text-sm font-medium text-forest-dark dark:text-darkbg-text">
            {t('filters.origin')}
          </label>
          <select
            id="origin-filter"
            value={originFilter}
            onChange={(e) => setOriginFilter(e.target.value)}
            className="rounded-lg border border-forest/20 px-3 py-2 text-sm text-forest-dark dark:border-forest/30 dark:bg-darkbg dark:text-darkbg-text"
            aria-label={t('filters.origin')}
          >
            {ORIGINS.map((o) => (
              <option key={o} value={o}>{originLabels[o]}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setAdvancedOpen(!advancedOpen)}
          className="flex w-full items-center justify-between rounded-lg bg-forest/5 px-4 py-2 text-sm font-semibold text-forest-dark dark:bg-forest/10 dark:text-darkbg-text"
          aria-expanded={advancedOpen}
        >
          {t('filters.advanced.title')}
          <span>{advancedOpen ? '▲' : '▼'}</span>
        </button>

        {advancedOpen && (
          <div className="mt-3 space-y-4 rounded-lg border border-forest/10 p-4 dark:border-forest/20" role="region" aria-label={t('filters.advanced.title')}>
            <div>
              <label className="label-text mb-2 block">{t('filters.advanced.bloomColor')}</label>
              <div className="flex flex-wrap gap-2">
                {BLOOM_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => toggleArrayFilter('bloomColors', color)}
                    className={`h-8 w-8 rounded-full border-2 transition ${
                      advancedFilters.bloomColors.includes(color) ? 'border-forest scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: BLOOM_COLOR_HEX[color] }}
                    aria-label={t(`filters.advanced.colors.${color}`)}
                    aria-pressed={advancedFilters.bloomColors.includes(color)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="label-text mb-2 block">
                {t('filters.advanced.height')}: {advancedFilters.heightRange[0]}–{advancedFilters.heightRange[1]} cm
              </label>
              <div className="flex gap-4">
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={advancedFilters.heightRange[0]}
                  onChange={(e) => setAdvancedFilters({ heightRange: [Number(e.target.value), advancedFilters.heightRange[1]] })}
                  className="flex-1"
                  aria-label={t('filters.advanced.heightMin')}
                />
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={advancedFilters.heightRange[1]}
                  onChange={(e) => setAdvancedFilters({ heightRange: [advancedFilters.heightRange[0], Number(e.target.value)] })}
                  className="flex-1"
                  aria-label={t('filters.advanced.heightMax')}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div>
                <label htmlFor="foliage-color" className="label-text mb-1 block">{t('filters.advanced.foliageColor')}</label>
                <select
                  id="foliage-color"
                  value={advancedFilters.foliageColor}
                  onChange={(e) => setAdvancedFilters({ foliageColor: e.target.value })}
                  className="rounded-lg border border-forest/20 px-3 py-2 text-sm dark:border-forest/30 dark:bg-darkbg dark:text-darkbg-text"
                >
                  <option value="all">{t('filters.advanced.all')}</option>
                  {FOLIAGE_COLORS.map((c) => (
                    <option key={c} value={c}>{t(`filters.advanced.foliageColors.${c}`)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="foliage-texture" className="label-text mb-1 block">{t('filters.advanced.foliageTexture')}</label>
                <select
                  id="foliage-texture"
                  value={advancedFilters.foliageTexture}
                  onChange={(e) => setAdvancedFilters({ foliageTexture: e.target.value })}
                  className="rounded-lg border border-forest/20 px-3 py-2 text-sm dark:border-forest/30 dark:bg-darkbg dark:text-darkbg-text"
                >
                  <option value="all">{t('filters.advanced.all')}</option>
                  {FOLIAGE_TEXTURES.map((c) => (
                    <option key={c} value={c}>{t(`filters.advanced.foliageTextures.${c}`)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label-text mb-2 block">{t('filters.advanced.wildlifeLabel')}</label>
              <div className="flex flex-wrap gap-2">
                {WILDLIFE.map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => toggleArrayFilter('wildlifeFilter', w)}
                    className={`rounded-full px-3 py-1 text-sm ${
                      advancedFilters.wildlifeFilter.includes(w) ? 'filter-chip-active' : 'filter-chip'
                    }`}
                    aria-pressed={advancedFilters.wildlifeFilter.includes(w)}
                  >
                    {t(`filters.advanced.wildlife.${w}`)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label-text mb-2 block">{t('filters.advanced.edibleLabel')}</label>
              <div className="flex flex-wrap gap-2">
                {EDIBLE.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => toggleArrayFilter('edibleFilter', e)}
                    className={`rounded-full px-3 py-1 text-sm ${
                      advancedFilters.edibleFilter.includes(e) ? 'filter-chip-active' : 'filter-chip'
                    }`}
                    aria-pressed={advancedFilters.edibleFilter.includes(e)}
                  >
                    {t(`filters.advanced.edible.${e}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm dark:text-darkbg-text">
                <input
                  type="checkbox"
                  checked={advancedFilters.medicinalOnly}
                  onChange={(e) => setAdvancedFilters({ medicinalOnly: e.target.checked })}
                />
                {t('filters.advanced.medicinalOnly')}
              </label>
              {[
                { key: 'droughtFilter', label: t('filters.advanced.droughtTolerant') },
                { key: 'deerFilter', label: t('filters.advanced.deerResistant') },
                { key: 'saltFilter', label: t('filters.advanced.saltTolerant') },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 text-sm dark:text-darkbg-text">
                  <input
                    type="checkbox"
                    checked={advancedFilters[key] === true}
                    onChange={(e) => setAdvancedFilters({ [key]: e.target.checked ? true : null })}
                  />
                  {label}
                </label>
              ))}
            </div>

            <button type="button" onClick={resetAdvancedFilters} className="link-forest text-sm">
              {t('filters.advanced.reset')}
            </button>
          </div>
        )}
      </div>

      <button type="button" onClick={resetFilters} className="link-forest text-sm">
        {t('filters.reset')}
      </button>
    </div>
  );
}
