import { useTranslation } from '../../i18n/useTranslation';

/** Toast/badge for companion planting hints on placement. */
export default function CompanionHints({ hints }) {
  const { t } = useTranslation();

  if (!hints || hints.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-forest-dark dark:text-darkbg-text">{t('garden.companionHints')}</h3>
      {hints.map((hint, i) => (
        <div
          key={i}
          className={`rounded-lg px-3 py-2 text-sm ${
            hint.status === 'good'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
              : hint.status === 'bad'
                ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
          }`}
          role="status"
        >
          {hint.status === 'good' && '✓ '}
          {hint.status === 'bad' && '✗ '}
          {hint.message}
        </div>
      ))}
    </div>
  );
}
