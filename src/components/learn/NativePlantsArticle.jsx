import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n/useTranslation';

const NATIVE_PLANTS = [
  'Sugar Maple', 'Serviceberry', 'Wild Bergamot', 'Black-Eyed Susan',
  'Lowbush Blueberry', 'Cardinal Flower', 'Goldenrod', 'Wild Rose',
];

const INVASIVE_PLANTS = [
  'Purple Loosestrife', 'Japanese Knotweed', 'Garlic Mustard',
  'Phragmites (Common Reed)', 'Dog-Strangling Vine', 'Buckthorn',
];

/** Native vs invasive plants article for Quebec gardeners. */
function NativePlantsArticle() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/learn" className="link-forest text-sm">← {t('common.back')}</Link>
      <h1 className="section-title mt-4">{t('native.title')}</h1>
      <p className="mt-2 text-muted">{t('native.subtitle')}</p>

      <div className="card mt-8">
        <h2 className="font-display text-xl font-semibold">{t('native.whyNative')}</h2>
        <p className="mt-2 leading-relaxed text-subtle">{t('native.whyNativeText')}</p>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="card">
          <h3 className="font-semibold text-forest dark:text-forest-lighter">{t('native.nativeList')}</h3>
          <ul className="mt-3 space-y-1">
            {NATIVE_PLANTS.map((name) => (
              <li key={name} className="flex items-center gap-2 text-sm">
                <span className="text-forest dark:text-forest-lighter">✓</span> {name}
              </li>
            ))}
          </ul>
        </div>

        <div className="card border-red-200 bg-red-50 dark:border-red-800/50 dark:bg-red-950/40">
          <h3 className="font-semibold text-red-800 dark:text-red-300">{t('native.invasiveList')}</h3>
          <p className="mt-1 text-xs text-red-700 dark:text-red-400">{t('native.invasiveWarning')}</p>
          <ul className="mt-3 space-y-1">
            {INVASIVE_PLANTS.map((name) => (
              <li key={name} className="flex items-center gap-2 text-sm text-red-900 dark:text-red-300">
                <span>✕</span> {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default memo(NativePlantsArticle);
