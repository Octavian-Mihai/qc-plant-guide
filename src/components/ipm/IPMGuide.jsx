import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import useStore from '../../store/useStore';
import { useTranslation } from '../../i18n/useTranslation';
import pestsData from '../../data/pests.json';

/** IPM guide with pest data, filters, and plant links. */
export default function IPMGuide() {
  const { t, locale } = useTranslation();
  const plants = useStore((s) => s.plants);
  const [filterType, setFilterType] = useState('all');
  const [filterPlant, setFilterPlant] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = useMemo(() => {
    return pestsData.filter((pest) => {
      if (filterType !== 'all' && pest.pestType !== filterType) return false;
      if (filterPlant !== 'all' && !pest.affectedPlants.includes(filterPlant)) return false;
      return true;
    });
  }, [filterType, filterPlant]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="section-title">{t('ipm.title')}</h1>
      <p className="mt-1 text-forest/70 dark:text-darkbg-muted">{t('ipm.subtitle')}</p>
      <p className="mt-2 text-xs text-forest/50 dark:text-darkbg-muted">{t('ipm.disclaimer')}</p>

      <div className="mt-6 flex flex-wrap gap-4">
        <div>
          <label htmlFor="pest-type" className="label-text mb-1 block">{t('ipm.filterType')}</label>
          <select
            id="pest-type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-lg border border-forest/20 px-3 py-2 text-sm dark:border-forest/30 dark:bg-darkbg dark:text-darkbg-text"
          >
            <option value="all">{t('ipm.allTypes')}</option>
            <option value="insect">{t('ipm.insect')}</option>
            <option value="mammal">{t('ipm.mammal')}</option>
          </select>
        </div>
        <div>
          <label htmlFor="pest-plant" className="label-text mb-1 block">{t('ipm.filterPlant')}</label>
          <select
            id="pest-plant"
            value={filterPlant}
            onChange={(e) => setFilterPlant(e.target.value)}
            className="rounded-lg border border-forest/20 px-3 py-2 text-sm dark:border-forest/30 dark:bg-darkbg dark:text-darkbg-text"
          >
            <option value="all">{t('ipm.allPlants')}</option>
            {plants.filter((p) => pestsData.some((pest) => pest.affectedPlants.includes(p.id))).map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {filtered.map((pest) => (
          <article key={pest.id} className="card">
            <button
              type="button"
              onClick={() => setExpandedId(expandedId === pest.id ? null : pest.id)}
              className="flex w-full items-center gap-4 text-left"
              aria-expanded={expandedId === pest.id}
            >
              <img
                src={pest.imageUrl}
                alt={locale === 'fr' ? pest.nameFr : pest.nameEn}
                className="h-16 w-16 rounded-lg bg-cream object-contain p-1 dark:bg-darkbg"
              />
              <div>
                <h2 className="text-lg font-semibold">{locale === 'fr' ? pest.nameFr : pest.nameEn}</h2>
                <p className="text-sm text-subtle capitalize">{pest.pestType}</p>
              </div>
            </button>

            {expandedId === pest.id && (
              <div className="mt-4 space-y-4 border-t border-forest/10 pt-4 dark:border-forest/20">
                <p className="text-sm text-subtle">{locale === 'fr' ? pest.identification.fr : pest.identification.en}</p>

                {pest.affectedPlants.length > 0 && (
                  <div>
                    <h3 className="font-semibold">{t('ipm.affectedPlants')}</h3>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {pest.affectedPlants.map((id) => {
                        const p = plants.find((pl) => pl.id === id);
                        return p ? (
                          <Link key={id} to={`/plant/${id}`} className="link-forest text-sm">
                            {p.name}
                          </Link>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold">{t('ipm.naturalControls')}</h3>
                  <ul className="mt-1 list-inside list-disc text-sm text-subtle">
                    {(locale === 'fr' ? pest.naturalControls.fr : pest.naturalControls.en).map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold">{t('ipm.organicTreatments')}</h3>
                  <ul className="mt-1 list-inside list-disc text-sm text-subtle">
                    {(locale === 'fr' ? pest.organicTreatments.fr : pest.organicTreatments.en).map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                {pest.beneficialPlants.length > 0 && (
                  <div>
                    <h3 className="font-semibold">{t('ipm.beneficialPlants')}</h3>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {pest.beneficialPlants.map((id) => {
                        const p = plants.find((pl) => pl.id === id);
                        return p ? (
                          <Link key={id} to={`/plant/${id}`} className="link-forest text-sm">
                            {p.name}
                          </Link>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
