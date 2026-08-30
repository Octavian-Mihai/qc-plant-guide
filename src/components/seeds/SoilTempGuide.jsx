import { useTranslation } from '../../i18n/useTranslation';

/** Soil temperature guide with manual input. */
export default function SoilTempGuide({ minTemp, observedTemp, onObservedChange }) {
  const { t } = useTranslation();
  const met = observedTemp !== '' && Number(observedTemp) >= minTemp;

  return (
    <div className="card">
      <h3 className="font-semibold">{t('seeds.soilTemp')}</h3>
      <p className="mt-1 text-sm text-forest/70 dark:text-darkbg-muted">{t('seeds.soilTempHint')}</p>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span>{t('seeds.minRequired')}</span>
          <span className="font-semibold">{minTemp}°C</span>
        </div>

        <div>
          <label htmlFor="observed-temp" className="mb-1 block text-sm font-medium">{t('seeds.observedTemp')}</label>
          <input
            id="observed-temp"
            type="number"
            value={observedTemp}
            onChange={(e) => onObservedChange(e.target.value)}
            placeholder="e.g. 12"
            className="w-full rounded-lg border border-forest/20 px-3 py-2 text-sm dark:border-forest/30 dark:bg-darkbg dark:text-darkbg-text"
          />
        </div>

        {observedTemp !== '' && (
          <div className={`rounded-lg px-3 py-2 text-sm font-medium ${
            met
              ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200'
          }`}>
            {met ? t('seeds.tempMet') : t('seeds.tempNotMet')}
          </div>
        )}
      </div>
    </div>
  );
}
