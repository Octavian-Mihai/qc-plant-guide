import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n/useTranslation';
import SoilTester from '../soil/SoilTester';
import FilterBar from './FilterBar';
import ResultsGrid from './ResultsGrid';

/** Main homepage: hero, soil wizard, filters, and plant grid. */
export default function Dashboard() {
  const { t } = useTranslation();
  const resultsRef = useRef(null);

  const scrollToResults = () => resultsRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div>
      {/* Hero section */}
      <section className="bg-gradient-to-br from-forest to-forest-light px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-display text-4xl font-bold md:text-5xl">{t('hero.title')}</h1>
          <p className="mt-4 text-lg text-forest-lighter">{t('hero.subtitle')}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href="#soil-tester" className="btn-primary bg-white text-forest hover:bg-cream">
              {t('hero.cta')}
            </a>
            <button type="button" onClick={scrollToResults} className="btn-secondary border-white text-white hover:bg-white/10">
              {t('hero.skipSoil')}
            </button>
            <Link to="/microgreens" className="btn-secondary border-white text-white hover:bg-white/10">
              {t('nav.microgreens')}
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
        <SoilTester onSkip={scrollToResults} />

        <div ref={resultsRef}>
          <FilterBar />
          <div className="mt-6">
            <ResultsGrid />
          </div>
        </div>
      </div>
    </div>
  );
}
