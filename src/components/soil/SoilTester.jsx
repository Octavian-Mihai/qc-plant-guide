import { useState, useCallback } from 'react';
import useStore from '../../store/useStore';
import { getSoilSummary, countSoilMatches } from '../../services/soilMatcher';
import { useTranslation } from '../../i18n/useTranslation';
import JarTest from './JarTest';
import TouchTest from './TouchTest';
import PHTest from './pHTest';

/**
 * 3-step soil testing wizard: method → results → drainage.
 * Output calls setSoilTestResult + applyFilters on the store.
 */
export default function SoilTester({ onSkip, onComplete }) {
  const { t, locale } = useTranslation();
  const setSoilTestResult = useStore((s) => s.setSoilTestResult);
  const soilTestResult = useStore((s) => s.soilTestResult);
  const plants = useStore((s) => s.plants);
  const filteredPlants = useStore((s) => s.filteredPlants);

  const [step, setStep] = useState(1);
  const [method, setMethod] = useState(null);
  const [texture, setTexture] = useState(null);
  const [ph, setPh] = useState('neutral');
  const [drainage, setDrainage] = useState(null);

  const handleApply = useCallback(() => {
    if (!texture || !drainage) return;
    setSoilTestResult({ texture, ph, drainage });
    setStep(4);
    // Scroll to results after store updates (next tick)
    requestAnimationFrame(() => onComplete?.());
  }, [texture, ph, drainage, setSoilTestResult, onComplete]);

  const handleSkip = () => {
    setSoilTestResult(null);
    onSkip?.();
  };

  const methods = [
    { id: 'jar', label: t('soil.jar'), desc: t('soil.jarDesc') },
    { id: 'touch', label: t('soil.touch'), desc: t('soil.touchDesc') },
    { id: 'ph', label: t('soil.ph'), desc: t('soil.phDesc') },
  ];

  const drainageOptions = [
    { value: 'good', label: t('soil.drainageGood') },
    { value: 'poor', label: t('soil.drainagePoor') },
    { value: 'unknown', label: t('soil.drainageUnknown') },
  ];

  return (
    <section id="soil-tester" className="card mx-auto max-w-3xl">
      <h2 className="section-title">{t('soil.title')}</h2>
      <p className="mt-2 text-muted">{t('soil.subtitle')}</p>

      {/* Step indicators */}
      <div className="mt-4 flex gap-2" aria-label="Wizard progress">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full ${step >= s ? 'bg-forest dark:bg-forest-lighter' : 'bg-forest/20 dark:bg-forest/30'}`}
          />
        ))}
      </div>

      <div className="mt-6">
        {step === 1 && (
          <>
            <p className="mb-4 font-medium">{t('soil.step1')}</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {methods.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => { setMethod(m.id); setStep(2); }}
                  className={`card text-left transition hover:border-forest/30 ${
                    method === m.id ? 'border-forest ring-2 ring-forest-light' : ''
                  }`}
                >
                  <h4 className="font-semibold">{m.label}</h4>
                  <p className="mt-1 text-sm text-muted">{m.desc}</p>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className="mb-4 font-medium">{t('soil.step2')}</p>
            {method === 'jar' && (
              <JarTest texture={texture} ph={ph} onTextureChange={setTexture} onPhChange={setPh} />
            )}
            {method === 'touch' && (
              <TouchTest texture={texture} ph={ph} onTextureChange={setTexture} onPhChange={setPh} />
            )}
            {method === 'ph' && (
              <PHTest texture={texture} ph={ph} onTextureChange={setTexture} onPhChange={setPh} />
            )}
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="btn-secondary">{t('soil.back')}</button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!texture}
                className="btn-primary disabled:opacity-50"
              >
                {t('soil.next')}
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <p className="mb-4 font-medium">{t('soil.step3')}</p>
            <div className="grid gap-2">
              {drainageOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDrainage(opt.value)}
                  className={`card text-left transition ${
                    drainage === opt.value ? 'border-forest ring-2 ring-forest-light' : 'hover:border-forest/30'
                  }`}
                  aria-pressed={drainage === opt.value}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setStep(2)} className="btn-secondary">{t('soil.back')}</button>
              <button
                type="button"
                onClick={handleApply}
                disabled={!drainage}
                className="btn-primary disabled:opacity-50"
              >
                {t('soil.apply')}
              </button>
            </div>
          </>
        )}

        {(step === 4 || soilTestResult) && soilTestResult && (
          <div className="rounded-lg bg-forest/5 p-4 dark:bg-forest/10">
            <p className="font-semibold">✓ {t('soil.result')}</p>
            <p className="mt-1 text-forest dark:text-forest-lighter">{getSoilSummary(soilTestResult, locale)}</p>
            <p className="mt-2 text-sm text-muted">
              {filteredPlants.length > 0
                ? t('soil.suggestionCount', { count: filteredPlants.length })
                : countSoilMatches(plants, soilTestResult).moderate > 0
                  ? t('soil.suggestionOnlyModerate', {
                      count: countSoilMatches(plants, soilTestResult).moderate,
                    })
                  : t('soil.suggestionNone')}
            </p>
            {filteredPlants.length > 0 && (
              <button
                type="button"
                onClick={() => onComplete?.()}
                className="btn-primary mt-3"
              >
                {t('soil.viewSuggestions')}
              </button>
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleSkip}
        className="link-forest mt-4 text-sm"
      >
        {t('soil.skip')}
      </button>
    </section>
  );
}
