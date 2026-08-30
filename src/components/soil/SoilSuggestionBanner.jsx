import useStore from '../../store/useStore';
import { getSoilSummary, countSoilMatches } from '../../services/soilMatcher';
import { useTranslation } from '../../i18n/useTranslation';

/** Shown above results when a soil test is active — honest tiered messaging. */
export default function SoilSuggestionBanner() {
  const { t, locale } = useTranslation();
  const soilTestResult = useStore((s) => s.soilTestResult);
  const filteredPlants = useStore((s) => s.filteredPlants);
  const plants = useStore((s) => s.plants);
  const setSoilTestResult = useStore((s) => s.setSoilTestResult);

  if (!soilTestResult) return null;

  const { strong, moderate } = countSoilMatches(plants, soilTestResult);
  const showing = filteredPlants.length;

  return (
    <div
      className="rounded-lg border border-forest/20 bg-forest/5 p-4 dark:border-forest-lighter/30 dark:bg-forest/15"
      role="status"
      aria-live="polite"
    >
      <p className="font-semibold text-forest-dark dark:text-darkbg-text">
        🌱 {t('soil.suggestionTitle')}
      </p>
      <p className="mt-1 text-sm text-muted">
        {getSoilSummary(soilTestResult, locale)}
      </p>

      {showing > 0 ? (
        <>
          <p className="mt-2 text-sm text-forest dark:text-forest-lighter">
            {t('soil.suggestionCount', { count: showing })}
          </p>
          {moderate > 0 && (
            <p className="mt-1 text-xs text-muted">
              {t('soil.suggestionModerate', { count: moderate })}
            </p>
          )}
        </>
      ) : strong === 0 && moderate > 0 ? (
        <p className="mt-2 text-sm text-forest dark:text-forest-lighter">
          {t('soil.suggestionOnlyModerate', { count: moderate })}
        </p>
      ) : (
        <p className="mt-2 text-sm text-muted">{t('soil.suggestionNone')}</p>
      )}

      <p className="mt-2 text-xs text-muted">{t('soil.suggestionHint')}</p>

      <button
        type="button"
        onClick={() => setSoilTestResult(null)}
        className="link-forest mt-3 text-sm"
      >
        {t('soil.clearFilter')}
      </button>
    </div>
  );
}
