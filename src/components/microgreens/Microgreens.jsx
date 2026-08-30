import { memo } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import Timeline from './Timeline';
import ShoppingList from './ShoppingList';
import HarvestTracker from './HarvestTracker';

const TOP3 = [
  { key: 'radish', days: 7 },
  { key: 'pea', days: '10–14' },
  { key: 'sunflower', days: 10 },
];

/** Microgreens 101 page with timeline, shopping list, and harvest tracker. */
function Microgreens() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <header className="text-center">
        <h1 className="section-title">{t('microgreens.title')}</h1>
        <p className="mt-2 text-forest/70">{t('microgreens.subtitle')}</p>
      </header>

      {/* Beginner's Top 3 */}
      <section className="grid gap-4 sm:grid-cols-3">
        {TOP3.map(({ key, days }) => (
          <div key={key} className="card text-center">
            <h3 className="font-display text-lg font-semibold text-forest-dark">
              {t(`microgreens.${key}`)}
            </h3>
            <p className="mt-2 text-sm text-forest/70">{t(`microgreens.${key}Desc`)}</p>
            <p className="mt-2 text-xs font-medium text-forest">{days} days</p>
          </div>
        ))}
      </section>

      <Timeline />
      <ShoppingList />
      <HarvestTracker />
    </div>
  );
}

export default memo(Microgreens);
