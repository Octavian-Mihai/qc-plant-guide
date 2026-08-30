import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n/useTranslation';
import SoilTester from '../soil/SoilTester';

/** Deep dive soil testing guide reusing the wizard components. */
function SoilTestingGuide() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link to="/learn" className="link-forest text-sm">← {t('common.back')}</Link>
      <h1 className="section-title mt-4">{t('learn.soilTesting')}</h1>
      <p className="mt-2 text-muted">{t('learn.soilTestingDesc')}</p>

      <div className="mt-8 space-y-6">
        <div className="card prose prose-sm text-subtle dark:prose-invert">
          <h3 className="font-semibold">Why test your soil?</h3>
          <p>Quebec soils vary from sandy Laurentian highlands to heavy clay in river valleys. Knowing your texture, pH, and drainage helps you choose plants that will thrive rather than struggle.</p>
          <h3 className="mt-4 font-semibold">Three easy home tests</h3>
          <ul className="list-inside list-disc">
            <li><strong>Jar test</strong> — reveals sand, silt, and clay proportions</li>
            <li><strong>Touch test</strong> — quick ribbon test without equipment</li>
            <li><strong>pH strips</strong> — available at garden centers for $10–15</li>
          </ul>
        </div>

        <SoilTester />
      </div>
    </div>
  );
}

export default memo(SoilTestingGuide);
