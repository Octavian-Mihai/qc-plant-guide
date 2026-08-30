import { memo } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

/** Origin and status badges for plant cards and detail views. */
function Badge({ type, children }) {
  const styles = {
    native: 'bg-forest text-white',
    adaptive: 'bg-orange-500 text-white',
    fruit: 'bg-purple-600 text-white',
    introduced: 'bg-gray-500 text-white',
    soil: 'bg-forest-lighter text-forest-dark',
    default: 'bg-forest/10 text-forest-dark',
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
