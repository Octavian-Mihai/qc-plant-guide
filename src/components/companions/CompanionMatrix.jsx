import { useMemo } from 'react';
import useStore from '../../store/useStore';
import { useTranslation } from '../../i18n/useTranslation';
import { getCompanionStatus } from '../../utils/plantHelpers';

/** Interactive companion matrix — select plant A, see good/bad/neutral for others. */
export default function CompanionMatrix({ selectedId, onSelect }) {
  const { t } = useTranslation();
  const plants = useStore((s) => s.plants);

  const selected = plants.find((p) => p.id === selectedId);

  const matrix = useMemo(() => {
    if (!selected) return [];
    return plants
      .filter((p) => p.id !== selectedId)
      .slice(0, 12)
      .map((p) => ({
        plant: p,
        status: getCompanionStatus(p.id, plants, selected),
      }));
  }, [selected, selectedId, plants]);

  const statusClass = {
    good: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/40 dark:text-green-200',
    bad: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-200',
    neutral: 'bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-800 dark:text-gray-300',
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
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4" role="grid" aria-label={t('companions.matrix')}>
        {matrix.map(({ plant, status }) => (
          <div
            key={plant.id}
            className={`rounded-lg border p-2 text-center text-sm ${statusClass[status]}`}
            role="gridcell"
            aria-label={`${plant.name}: ${status}`}
          >
            <p className="font-medium truncate">{plant.name}</p>
            <p className="text-xs capitalize">{t(`companions.status.${status}`)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
