import { useState, useMemo } from 'react';
import useStore from '../../store/useStore';
import { useTranslation } from '../../i18n/useTranslation';
import companionsData from '../../data/companions.json';
import CompanionMatrix from './CompanionMatrix';

/** Companion planting page with matrix, allelopathic, three sisters, pollinator combos. */
export default function CompanionPlanting() {
  const { t, locale } = useTranslation();
  const plants = useStore((s) => s.plants);
  const [selectedId, setSelectedId] = useState(plants[0]?.id || '');

  const selected = plants.find((p) => p.id === selectedId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="section-title">{t('companions.title')}</h1>
      <p className="mt-1 text-forest/70 dark:text-darkbg-muted">{t('companions.subtitle')}</p>

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold dark:text-darkbg-text">{t('companions.matrix')}</h2>
        <CompanionMatrix selectedId={selectedId} onSelect={setSelectedId} />
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold dark:text-darkbg-text">{t('companions.allelopathic')}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {companionsData.allelopathic.map((item) => (
            <div key={item.id} className="card">
              <h3 className="font-semibold">{locale === 'fr' ? item.nameFr : item.nameEn}</h3>
              <p className="mt-2 text-sm text-subtle">
                {locale === 'fr' ? item.effectFr : item.effectEn}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold dark:text-darkbg-text">{t('companions.threeSisters')}</h2>
        <div className="card">
          <svg viewBox="0 0 400 200" className="mx-auto w-full max-w-md" aria-label={t('companions.threeSisters')}>
            <circle cx="200" cy="100" r="80" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
            <text x="200" y="60" textAnchor="middle" className="fill-forest-dark text-sm font-semibold dark:fill-darkbg-text">
              {locale === 'fr' ? companionsData.threeSisters.corn.nameFr : companionsData.threeSisters.corn.nameEn}
            </text>
            <text x="200" y="80" textAnchor="middle" className="fill-forest/70 text-xs dark:fill-darkbg-muted">
              {locale === 'fr' ? companionsData.threeSisters.corn.roleFr : companionsData.threeSisters.corn.roleEn}
            </text>
            <circle cx="130" cy="130" r="35" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
            <text x="130" y="135" textAnchor="middle" className="fill-forest-dark text-xs font-semibold dark:fill-darkbg-text">
              {locale === 'fr' ? companionsData.threeSisters.beans.nameFr : companionsData.threeSisters.beans.nameEn}
            </text>
            <circle cx="270" cy="130" r="35" fill="#ffedd5" stroke="#ea580c" strokeWidth="2" />
            <text x="270" y="135" textAnchor="middle" className="fill-forest-dark text-xs font-semibold dark:fill-darkbg-text">
              {locale === 'fr' ? companionsData.threeSisters.squash.nameFr : companionsData.threeSisters.squash.nameEn}
            </text>
          </svg>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold dark:text-darkbg-text">{t('companions.pollinator')}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {companionsData.pollinatorCombos.map((combo) => (
            <div key={combo.id} className="card">
              <h3 className="font-semibold">{locale === 'fr' ? combo.nameFr : combo.nameEn}</h3>
              <p className="mt-1 text-sm text-muted">
                {locale === 'fr' ? combo.descriptionFr : combo.descriptionEn}
              </p>
              <ul className="mt-2 list-inside list-disc text-sm text-subtle">
                {combo.plantIds.map((id) => {
                  const p = plants.find((pl) => pl.id === id);
                  return p ? <li key={id}>{p.name}</li> : null;
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold dark:text-darkbg-text">{t('companions.succession')}</h2>
        {companionsData.successionChains.map((chain) => (
          <div key={chain.id} className="card">
            <h3 className="font-semibold">{locale === 'fr' ? chain.nameFr : chain.nameEn}</h3>
            <div className="mt-4 flex flex-wrap gap-4">
              {chain.steps.map((step, i) => (
                <div key={i} className="surface-muted min-w-[180px] flex-1 rounded-lg p-3">
                  <p className="text-xs font-medium text-muted">{locale === 'fr' ? step.seasonFr : step.seasonEn}</p>
                  <p className="font-semibold">{locale === 'fr' ? step.cropFr : step.cropEn}</p>
                  <p className="text-xs text-muted">{locale === 'fr' ? step.weeksFr : step.weeksEn}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {selected && (
        <section className="mt-8">
          <h2 className="mb-2 text-xl font-semibold dark:text-darkbg-text">{t('companions.forPlant', { name: selected.name })}</h2>
          <div className="flex flex-wrap gap-2">
            {selected.companionIds?.map((id) => {
              const p = plants.find((pl) => pl.id === id);
              return p ? (
                <span key={id} className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800 dark:bg-green-900/40 dark:text-green-200">
                  ✓ {p.name}
                </span>
              ) : null;
            })}
            {selected.avoidIds?.map((id) => {
              const p = plants.find((pl) => pl.id === id);
              return p ? (
                <span key={id} className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-800 dark:bg-red-900/40 dark:text-red-200">
                  ✗ {p.name}
                </span>
              ) : null;
            })}
          </div>
        </section>
      )}
    </div>
  );
}
