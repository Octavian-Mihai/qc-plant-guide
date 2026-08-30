import { useState, useEffect, memo } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

const STORAGE_KEY = 'microgreens-shopping-list';

const DEFAULT_ITEMS = [
  { id: 'tray', labelEn: 'Shallow growing tray with drainage holes', labelFr: 'Plateau peu profond avec drainage' },
  { id: 'soil', labelEn: 'Seed starting mix or coconut coir', labelFr: 'Mélange à semis ou fibre de coco' },
  { id: 'seeds', labelEn: 'Microgreen seeds (radish, pea, sunflower)', labelFr: 'Graines de micropousses (radis, pois, tournesol)' },
  { id: 'spray', labelEn: 'Spray bottle for misting', labelFr: 'Bouteille vaporisatrice' },
  { id: 'scissors', labelEn: 'Clean scissors for harvesting', labelFr: 'Ciseaux propres pour la récolte' },
  { id: 'light', labelEn: 'Grow light or sunny windowsill', labelFr: 'Lampe de culture ou rebord ensoleillé' },
];

/** Checkbox shopping list persisted in localStorage. */
function ShoppingList() {
  const { t, locale } = useTranslation();
  const [checked, setChecked] = useState({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setChecked(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const toggle = (id) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const toggleAll = () => {
    const allChecked = DEFAULT_ITEMS.every((item) => checked[item.id]);
    const next = {};
    DEFAULT_ITEMS.forEach((item) => { next[item.id] = !allChecked; });
    setChecked(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  return (
    <section className="card">
      <div className="flex items-center justify-between">
        <h2 className="section-title">{t('microgreens.shopping')}</h2>
        <button type="button" onClick={toggleAll} className="text-sm text-forest underline">
          {t('microgreens.addAll')}
        </button>
      </div>
      <ul className="mt-4 space-y-2">
        {DEFAULT_ITEMS.map((item) => (
          <li key={item.id}>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-cream">
              <input
                type="checkbox"
                checked={!!checked[item.id]}
                onChange={() => toggle(item.id)}
                className="h-5 w-5 rounded border-forest/30 text-forest focus:ring-forest-light"
              />
              <span className={checked[item.id] ? 'text-forest/50 line-through' : 'text-forest-dark'}>
                {locale === 'fr' ? item.labelFr : item.labelEn}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default memo(ShoppingList);
