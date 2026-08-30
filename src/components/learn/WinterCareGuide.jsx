import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n/useTranslation';

const SECTIONS = ['mulch', 'wrap', 'snow', 'water'];

/** Winter care guide for Quebec gardens. */
function WinterCareGuide() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/learn" className="text-sm text-forest underline">← {t('common.back')}</Link>
      <h1 className="section-title mt-4">{t('winter.title')}</h1>
      <p className="mt-2 text-forest/70">{t('winter.subtitle')}</p>

      <div className="mt-8 space-y-4">
        {SECTIONS.map((key) => (
          <div key={key} className="card">
            <h2 className="font-display text-lg font-semibold text-forest-dark">{t(`winter.${key}`)}</h2>
            <p className="mt-2 leading-relaxed text-forest/80">{t(`winter.${key}Text`)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(WinterCareGuide);
