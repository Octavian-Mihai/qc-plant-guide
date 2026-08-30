import { useState, useEffect, memo, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
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

function PrintMicrogreensList({ items, locale, ref }) {
  return (
    <div ref={ref} className="p-8 text-black">
      <h1 className="text-xl font-bold">Microgreens Shopping List</h1>
      <ul className="mt-4 list-disc pl-6">
        {items.map((item) => (
          <li key={item.id}>{locale === 'fr' ? item.labelFr : item.labelEn}</li>
        ))}
      </ul>
    </div>
  );
}

/** Checkbox shopping list with print support. */
function ShoppingList() {
  const { t, locale } = useTranslation();
  const [checked, setChecked] = useState({});
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({ contentRef: printRef });

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
        <div className="flex gap-2">
          <button type="button" onClick={toggleAll} className="link-forest text-sm">
            {t('microgreens.addAll')}
          </button>
          <button type="button" onClick={handlePrint} className="btn-secondary text-sm">{t('print.print')}</button>
        </div>
      </div>
      <ul className="mt-4 space-y-2">
        {DEFAULT_ITEMS.map((item) => (
          <li key={item.id}>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-cream dark:hover:bg-darkbg">
              <input
                type="checkbox"
                checked={!!checked[item.id]}
                onChange={() => toggle(item.id)}
                className="h-5 w-5 rounded border-forest/30 text-forest focus:ring-forest-light"
              />
              <span className={checked[item.id] ? 'text-forest/50 line-through dark:text-darkbg-muted' : 'text-forest-dark dark:text-darkbg-text'}>
                {locale === 'fr' ? item.labelFr : item.labelEn}
              </span>
            </label>
          </li>
        ))}
      </ul>
      <div className="hidden">
        <PrintMicrogreensList ref={printRef} items={DEFAULT_ITEMS} locale={locale} />
      </div>
    </section>
  );
}

export default memo(ShoppingList);
