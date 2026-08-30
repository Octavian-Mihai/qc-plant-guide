import { useMemo, useState } from 'react';
import useStore from '../../store/useStore';
import { useTranslation } from '../../i18n/useTranslation';
import { getCompanionPair, getPlantName } from '../../utils/plantHelpers';

const STATUS_ORDER = { good: 0, bad: 1, neutral: 2 };

/** Interactive companion matrix — select plant A, see good/bad/neutral for others. */
export default function CompanionMatrix({ selectedId, onSelect }) {
  const { t, locale } = useTranslation();
  const plants = useStore((s) => s.plants);
  const [query, setQuery] = useState('');
  const [showNeutrals, setShowNeutrals] = useState(false);

  const selected = plants.find((p) => p.id === selectedId);

  const matrix = useMemo(() => {
    if (!selected) return [];
    return plants
      .filter((p) => p.id !== selectedId)
      .map((p) => {
        const pair = getCompanionPair(selected, p, plants);
        return { plant: p, ...pair };
      });
  }, [selected, selectedId, plants]);

  const counts = useMemo(() => {
    const good = matrix.filter((m) => m.status === 'good').length;
    const avoid = matrix.filter((m) => m.status === 'bad').length;
    const neutral = matrix.filter((m) => m.status === 'neutral').length;
    return { good, avoid, neutral };
  }, [matrix]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return matrix
      .filter((m) => {
        const matchesQuery = !q
          || getPlantName(m.plant, locale).toLowerCase().includes(q)
          || m.plant.name.toLowerCase().includes(q)
          || (m.plant.nameFr || '').toLowerCase().includes(q)
          || m.plant.scientificName.toLowerCase().includes(q);
        if (!matchesQuery) return false;
        if (!q && !showNeutrals && m.status === 'neutral') return false;
        return true;
      })
      .sort((a, b) => {
        const rank = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
        if (rank !== 0) return rank;
        return getPlantName(a.plant, locale).localeCompare(getPlantName(b.plant, locale), locale);
      });
  }, [matrix, query, showNeutrals, locale]);

  const statusClass = {
    good: 'bg-green-100 text-green-800 border-green-300 hover:ring-2 hover:ring-green-400 dark:bg-green-900/40 dark:text-green-200 dark:border-green-700',
    bad: 'bg-red-100 text-red-800 border-red-300 hover:ring-2 hover:ring-red-400 dark:bg-red-900/40 dark:text-red-200 dark:border-red-700',
    neutral: 'bg-gray-100 text-gray-600 border-gray-300 hover:ring-2 hover:ring-gray-400 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
  };

  return (
    <div>
      <select
        value={selectedId}
        onChange={(e) => onSelect(e.target.value)}
        className="mb-4 w-full max-w-md rounded-lg border border-forest/20 px-3 py-2 dark:border-forest/30 dark:bg-darkbg dark:text-darkbg-text"
        aria-label={t('companions.selectPlant')}
      >
        {plants.map((p) => (
          <option key={p.id} value={p.id}>{getPlantName(p, locale)}</option>
        ))}
      </select>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('companions.searchPlants')}
          className="w-full max-w-md rounded-lg border border-forest/20 px-3 py-2 text-sm dark:border-forest/30 dark:bg-darkbg dark:text-darkbg-text"
          aria-label={t('companions.searchPlants')}
        />
        <label className="flex cursor-pointer items-center gap-2 text-sm text-forest-dark dark:text-darkbg-text">
          <input
            type="checkbox"
            checked={showNeutrals}
            onChange={(e) => setShowNeutrals(e.target.checked)}
          />
          {t('companions.showNeutrals')}
        </label>
      </div>

      {selected && (
        <p className="mb-3 text-sm text-muted" aria-live="polite">
          {t('companions.counts', {
            good: counts.good,
            avoid: counts.avoid,
            neutral: counts.neutral,
          })}
        </p>
      )}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4" role="grid" aria-label={t('companions.matrix')}>
        {visible.map(({ plant, status, reasonEn, reasonFr }) => {
          const reason = locale === 'fr' ? reasonFr : reasonEn;
          const displayName = getPlantName(plant, locale);
          return (
            <button
              type="button"
              key={plant.id}
              onClick={() => onSelect(plant.id)}
              className={`rounded-lg border p-2 text-center text-sm transition ${statusClass[status]}`}
              role="gridcell"
              aria-label={`${displayName}: ${t(`companions.status.${status}`)}`}
              title={reason || undefined}
            >
              <p className="font-medium truncate">{displayName}</p>
              <p className="text-xs capitalize">{t(`companions.status.${status}`)}</p>
              {reason ? <p className="mt-1 line-clamp-2 text-[11px] leading-snug opacity-80">{reason}</p> : null}
            </button>
          );
        })}
      </div>

      {visible.length === 0 && (
        <p className="mt-2 text-sm text-muted">{t('companions.noMatrixResults')}</p>
      )}
    </div>
  );
}
