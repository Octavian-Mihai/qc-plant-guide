import { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { CITY_FROST_PRESETS, getPlantingWindow } from '../../utils/dateHelpers';
import { useTranslation } from '../../i18n/useTranslation';

/** Frost date calculator with Quebec city presets. */
function FrostDateCalculator() {
  const { t, locale } = useTranslation();
  const [cityId, setCityId] = useState('montreal');

  const city = CITY_FROST_PRESETS.find((c) => c.id === cityId) || CITY_FROST_PRESETS[0];
  const { frostFreeDays } = getPlantingWindow(city);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/learn" className="text-sm text-forest underline">← {t('common.back')}</Link>
      <h1 className="section-title mt-4">{t('frost.title')}</h1>
      <p className="mt-2 text-forest/70">{t('frost.subtitle')}</p>

      <div className="card mt-8">
        <label htmlFor="city-select" className="block text-sm font-medium text-forest-dark">
          {t('frost.selectCity')}
        </label>
        <select
          id="city-select"
          value={cityId}
          onChange={(e) => setCityId(e.target.value)}
          className="mt-2 w-full rounded-lg border border-forest/20 px-3 py-2"
        >
          {CITY_FROST_PRESETS.map((c) => (
            <option key={c.id} value={c.id}>
              {locale === 'fr' ? c.nameFr : c.nameEn} (Zone {c.zone})
            </option>
          ))}
        </select>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-cream p-4 text-center">
            <p className="text-xs font-medium text-forest/60">{t('frost.lastFrost')}</p>
            <p className="mt-1 text-xl font-bold text-forest-dark">{city.lastFrost}</p>
          </div>
          <div className="rounded-lg bg-cream p-4 text-center">
            <p className="text-xs font-medium text-forest/60">{t('frost.firstFrost')}</p>
            <p className="mt-1 text-xl font-bold text-forest-dark">{city.firstFrost}</p>
          </div>
          <div className="rounded-lg bg-cream p-4 text-center">
            <p className="text-xs font-medium text-forest/60">{t('frost.frostFree')}</p>
            <p className="mt-1 text-xl font-bold text-forest-dark">~{frostFreeDays}</p>
          </div>
        </div>

        <div className="mt-6 space-y-2 text-sm text-forest/80">
          <p>✓ {t('frost.safePlant')}</p>
          <p>✓ {t('frost.protect')}</p>
        </div>
      </div>
    </div>
  );
}

export default memo(FrostDateCalculator);
