import { memo } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

/** Origin and status badges for plant cards and detail views. */
function Badge({ type, children }) {
  const styles = {
    native: 'bg-forest text-white dark:bg-forest-light',
    adaptive: 'bg-orange-500 text-white dark:bg-orange-600',
    fruit: 'bg-purple-600 text-white dark:bg-purple-500',
    introduced: 'bg-gray-500 text-white dark:bg-gray-600',
    soil: 'bg-forest-lighter text-forest-dark dark:bg-forest/30 dark:text-darkbg-text',
    default: 'bg-forest/10 text-forest-dark dark:bg-forest/20 dark:text-darkbg-text',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${styles[type] || styles.default}`}
    >
      {children}
    </span>
  );
}

/** Pre-configured origin badge based on plant origin field. */
export const OriginBadge = memo(function OriginBadge({ origin }) {
  const { t } = useTranslation();

  if (origin === 'native-qc') return <Badge type="native">{t('badges.native')}</Badge>;
  if (origin === 'adaptive') return <Badge type="adaptive">{t('badges.adaptive')}</Badge>;
  if (origin === 'fruit-bearing') return <Badge type="fruit">{t('badges.fruit')}</Badge>;
  return null;
});

export default memo(Badge);
