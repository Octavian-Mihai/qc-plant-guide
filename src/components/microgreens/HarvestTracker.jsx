import { useState, useEffect, useCallback, memo } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { daysBetween } from '../../utils/dateHelpers';

const STORAGE_KEY = 'microgreens-batches';

const VARIETIES = [
  { id: 'radish', nameEn: 'Radish', nameFr: 'Radis', days: 7 },
  { id: 'pea', nameEn: 'Pea Shoots', nameFr: 'Pousses de pois', days: 12 },
  { id: 'sunflower', nameEn: 'Sunflower', nameFr: 'Tournesol', days: 10 },
];

/** Harvest tracker with localStorage timers and browser notifications. */
function HarvestTracker() {
  const { t, locale } = useTranslation();
  const [batches, setBatches] = useState([]);
  const [selected, setSelected] = useState('radish');
  const [notifyEnabled, setNotifyEnabled] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setBatches(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  // Check batches every minute for harvest-ready notifications
  useEffect(() => {
    const interval = setInterval(() => {
      batches.forEach((batch) => {
        const variety = VARIETIES.find((v) => v.id === batch.variety);
        if (!variety) return;
        const daysLeft = variety.days - daysBetween(new Date(batch.startDate), new Date());
        if (daysLeft <= 0 && !batch.notified && notifyEnabled && Notification.permission === 'granted') {
          new Notification('Microgreens Ready!', {
            body: `${locale === 'fr' ? variety.nameFr : variety.nameEn} ${t('microgreens.readyNow')}`,
          });
          setBatches((prev) =>
            prev.map((b) => (b.id === batch.id ? { ...b, notified: true } : b))
          );
        }
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [batches, notifyEnabled, locale, t]);

  const saveBatches = useCallback((next) => {
    setBatches(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const startBatch = () => {
    const variety = VARIETIES.find((v) => v.id === selected);
    const batch = {
      id: crypto.randomUUID(),
      variety: selected,
      startDate: new Date().toISOString(),
      daysToHarvest: variety.days,
      notified: false,
    };
    saveBatches([...batches, batch]);
  };

  const requestNotify = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      setNotifyEnabled(perm === 'granted');
    }
  };

  const getDaysLeft = (batch) => {
    const variety = VARIETIES.find((v) => v.id === batch.variety);
    if (!variety) return 0;
    return Math.max(0, variety.days - daysBetween(new Date(batch.startDate), new Date()));
  };

  return (
    <section className="card">
      <h2 className="section-title">{t('microgreens.harvest')}</h2>

      <div className="mt-4 flex flex-wrap gap-3">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="input-field text-sm"
          aria-label={t('microgreens.selectVariety')}
        >
          {VARIETIES.map((v) => (
            <option key={v.id} value={v.id}>
              {locale === 'fr' ? v.nameFr : v.nameEn} ({v.days}d)
            </option>
          ))}
        </select>
        <button type="button" onClick={startBatch} className="btn-primary">
          {t('microgreens.startBatch')}
        </button>
        <button type="button" onClick={requestNotify} className="btn-secondary">
          {notifyEnabled ? t('microgreens.notifyGranted') : t('microgreens.notify')}
        </button>
      </div>

      <div className="mt-6">
        <h3 className="heading-sm">{t('microgreens.activeBatches')}</h3>
        {batches.length === 0 ? (
          <p className="mt-2 text-sm text-muted">{t('microgreens.noBatches')}</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {batches.map((batch) => {
              const variety = VARIETIES.find((v) => v.id === batch.variety);
              const daysLeft = getDaysLeft(batch);
              return (
                <li key={batch.id} className="surface-muted flex items-center justify-between rounded-lg p-3">
                  <span className="font-medium">
                    {locale === 'fr' ? variety?.nameFr : variety?.nameEn}
                  </span>
                  <span className={`text-sm font-semibold ${daysLeft === 0 ? 'text-forest dark:text-forest-lighter' : 'text-muted'}`}>
                    {daysLeft === 0 ? t('microgreens.readyNow') : t('microgreens.readyIn', { days: daysLeft })}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

export default memo(HarvestTracker);
