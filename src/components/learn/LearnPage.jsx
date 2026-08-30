import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n/useTranslation';

const ARTICLES = [
  { to: '/learn/zones', titleKey: 'learn.zones', descKey: 'learn.zonesDesc', icon: '🗺️' },
  { to: '/learn/planting', titleKey: 'learn.planting', descKey: 'learn.plantingDesc', icon: '📅' },
  { to: '/learn/soil-testing', titleKey: 'learn.soilTesting', descKey: 'learn.soilTestingDesc', icon: '🧪' },
  { to: '/learn/native-plants', titleKey: 'learn.nativePlants', descKey: 'learn.nativePlantsDesc', icon: '🌿' },
  { to: '/learn/winter-care', titleKey: 'learn.winterCare', descKey: 'learn.winterCareDesc', icon: '❄️' },
];

/** Education center hub with article cards. */
function LearnPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="section-title">{t('learn.title')}</h1>
        <p className="mt-2 text-muted">{t('learn.subtitle')}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {ARTICLES.map(({ to, titleKey, descKey, icon }) => (
          <Link
            key={to}
            to={to}
            className="card flex flex-col transition hover:-translate-y-1 hover:shadow-md"
          >
            <span className="text-3xl">{icon}</span>
            <h2 className="mt-2 font-display text-lg font-semibold">{t(titleKey)}</h2>
            <p className="mt-1 flex-1 text-sm text-muted">{t(descKey)}</p>
            <span className="mt-3 text-sm font-medium text-forest dark:text-forest-lighter">{t('common.learnMore')} →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default memo(LearnPage);
