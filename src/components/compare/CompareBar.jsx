import { Link } from 'react-router-dom';
import useStore from '../../store/useStore';
import { useTranslation } from '../../i18n/useTranslation';

/** Sticky bar when 1–3 plants are in compare list. */
export default function CompareBar() {
  const compareList = useStore((s) => s.compareList);
  const plants = useStore((s) => s.plants);
  const removeFromCompare = useStore((s) => s.removeFromCompare);
  const clearCompare = useStore((s) => s.clearCompare);
  const { t } = useTranslation();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-forest/20 bg-white/95 p-3 shadow-lg backdrop-blur dark:border-forest/30 dark:bg-darkbg-card/95">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-forest-dark dark:text-darkbg-text">{t('compare.barTitle')}</span>
          {compareList.map((id) => {
            const plant = plants.find((p) => p.id === id);
            if (!plant) return null;
            return (
              <span key={id} className="flex items-center gap-1 rounded-full bg-forest/10 px-3 py-1 text-sm dark:bg-forest/20 dark:text-darkbg-text">
                {plant.name}
                <button type="button" onClick={() => removeFromCompare(id)} className="text-muted hover:text-red-500 dark:hover:text-red-400" aria-label={t('compare.remove')}>×</button>
              </span>
            );
          })}
        </div>
        <div className="flex gap-2">
          <Link to={`/compare?ids=${compareList.join(',')}`} className="btn-primary text-sm">
            {t('compare.view')} ({compareList.length}/3)
          </Link>
          <button type="button" onClick={clearCompare} className="btn-secondary text-sm">{t('compare.clear')}</button>
        </div>
      </div>
    </div>
  );
}
