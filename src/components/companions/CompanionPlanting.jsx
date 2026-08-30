import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useStore from '../../store/useStore';
import { useTranslation } from '../../i18n/useTranslation';
import companionsData from '../../data/companions.json';
import CompanionMatrix from './CompanionMatrix';
import { getBloomMonthKeys, getCompanionPair, createThreeSistersLayout, getPlantName } from '../../utils/plantHelpers';

const SISTERS = ['corn', 'beans', 'squash'];
const WALNUT_ID = companionsData.allelopathic.find((a) => a.id === 'black-walnut')?.plantId;
const SUNFLOWER_ID = companionsData.allelopathic.find((a) => a.id === 'sunflower')?.plantId;

function QuebecBlurb({ text }) {
  return (
    <p className="mb-4 rounded-lg border border-forest/10 bg-cream/60 px-3 py-2 text-sm text-subtle dark:border-forest/20 dark:bg-darkbg">
      {text}
    </p>
  );
}

function Feedback({ message }) {
  if (!message) return null;
  return (
    <p className="mt-2 text-sm font-medium text-green-700 dark:text-green-300" role="status">
      {message}
    </p>
  );
}

/** Companion planting page with matrix, allelopathic, three sisters, pollinator combos. */
export default function CompanionPlanting() {
  const { t, locale } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const plants = useStore((s) => s.plants);
  const mergeFavorites = useStore((s) => s.mergeFavorites);
  const addToCompare = useStore((s) => s.addToCompare);
  const setPendingGardenLayout = useStore((s) => s.setPendingGardenLayout);

  const plantFromQuery = searchParams.get('plant');
  const [selectedId, setSelectedId] = useState(
    () => (plantFromQuery && plants.some((p) => p.id === plantFromQuery) ? plantFromQuery : plants[0]?.id || '')
  );

  useEffect(() => {
    if (plantFromQuery && plants.some((p) => p.id === plantFromQuery) && plantFromQuery !== selectedId) {
      setSelectedId(plantFromQuery);
    }
  }, [plantFromQuery, plants, selectedId]);

  const handleSelect = (id) => {
    setSelectedId(id);
    setSearchParams({ plant: id }, { replace: true });
  };

  const selected = plants.find((p) => p.id === selectedId);

  const pairChips = useMemo(() => {
    if (!selected) return { good: [], bad: [] };
    const good = [];
    const bad = [];
    plants.forEach((p) => {
      if (p.id === selected.id) return;
      const { status } = getCompanionPair(selected, p, plants);
      if (status === 'good') good.push(p);
      if (status === 'bad') bad.push(p);
    });
    return { good, bad };
  }, [selected, plants]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="section-title">{t('companions.title')}</h1>
      <p className="mt-1 text-forest/70 dark:text-darkbg-muted">{t('companions.subtitle')}</p>

      <section className="mt-8">
        <h2 className="mb-2 text-xl font-semibold dark:text-darkbg-text">{t('companions.matrix')}</h2>
        <p className="mb-4 text-sm text-muted">{t('companions.clickCellHint')}</p>
        <CompanionMatrix selectedId={selectedId} onSelect={handleSelect} />
      </section>

      <AllelopathySection plants={plants} locale={locale} t={t} />
      <ThreeSistersSection
        plants={plants}
        locale={locale}
        t={t}
        mergeFavorites={mergeFavorites}
        setPendingGardenLayout={setPendingGardenLayout}
        navigate={navigate}
      />
      <PollinatorSection
        plants={plants}
        locale={locale}
        t={t}
        mergeFavorites={mergeFavorites}
        addToCompare={addToCompare}
        navigate={navigate}
      />
      <SuccessionSection
        plants={plants}
        locale={locale}
        t={t}
        mergeFavorites={mergeFavorites}
      />

      {selected && (
        <section className="mt-8">
          <h2 className="mb-2 text-xl font-semibold dark:text-darkbg-text">{t('companions.forPlant', { name: getPlantName(selected, locale) })}</h2>
          <div className="flex flex-wrap gap-2">
            {pairChips.good.map((p) => (
              <Link
                key={p.id}
                to={`/plant/${p.id}`}
                className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800 dark:bg-green-900/40 dark:text-green-200"
              >
                ✓ {getPlantName(p, locale)}
              </Link>
            ))}
            {pairChips.bad.map((p) => (
              <Link
                key={p.id}
                to={`/plant/${p.id}`}
                className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-800 dark:bg-red-900/40 dark:text-red-200"
              >
                ✗ {getPlantName(p, locale)}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function AllelopathySection({ plants, locale, t }) {
  const [pickedId, setPickedId] = useState(plants[0]?.id || '');
  const picked = plants.find((p) => p.id === pickedId);
  const walnut = plants.find((p) => p.id === WALNUT_ID);
  const sunflower = plants.find((p) => p.id === SUNFLOWER_ID);

  const walnutPair = picked && walnut ? getCompanionPair(picked, walnut, plants) : null;
  const sunPair = picked && sunflower ? getCompanionPair(picked, sunflower, plants) : null;

  const walnutAffected = plants.filter((p) => {
    if (!walnut || p.id === walnut.id) return false;
    return getCompanionPair(walnut, p, plants).status === 'bad';
  });
  const sunAffected = plants.filter((p) => {
    if (!sunflower || p.id === sunflower.id) return false;
    return getCompanionPair(sunflower, p, plants).status === 'bad';
  });

  return (
    <section className="mt-8">
      <h2 className="mb-2 text-xl font-semibold dark:text-darkbg-text">{t('companions.allelopathic')}</h2>
      <QuebecBlurb text={t('companions.allelopathicWhy')} />

      <label className="mb-3 block max-w-md">
        <span className="mb-1 block text-sm font-medium">{t('companions.pickPlant')}</span>
        <select
          value={pickedId}
          onChange={(e) => setPickedId(e.target.value)}
          className="w-full rounded-lg border border-forest/20 px-3 py-2 dark:border-forest/30 dark:bg-darkbg dark:text-darkbg-text"
        >
          {plants.map((p) => (
            <option key={p.id} value={p.id}>{getPlantName(p, locale)}</option>
          ))}
        </select>
      </label>

      {picked && (
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <SafetyCard
            species={walnut}
            pair={walnutPair}
            locale={locale}
            t={t}
          />
          <SafetyCard
            species={sunflower}
            pair={sunPair}
            locale={locale}
            t={t}
          />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {companionsData.allelopathic.map((item) => {
          const affected = item.id === 'black-walnut' ? walnutAffected : sunAffected;
          return (
            <div key={item.id} className="card">
              <h3 className="font-semibold">
                {item.plantId ? (
                  <Link to={`/plant/${item.plantId}`} className="link-forest">{locale === 'fr' ? item.nameFr : item.nameEn}</Link>
                ) : (locale === 'fr' ? item.nameFr : item.nameEn)}
              </h3>
              <p className="mt-2 text-sm text-subtle">
                {locale === 'fr' ? item.effectFr : item.effectEn}
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">{t('companions.affectedPlants')}</p>
              <ul className="mt-1 flex flex-wrap gap-1">
                {affected.map((p) => (
                  <li key={p.id}>
                    <Link to={`/plant/${p.id}`} className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-800 dark:bg-red-900/30 dark:text-red-200">
                      {getPlantName(p, locale)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SafetyCard({ species, pair, locale, t }) {
  if (!species || !pair) return null;
  const unsafe = pair.status === 'bad';
  const reason = locale === 'fr' ? pair.reasonFr : pair.reasonEn;
  return (
    <div className={`rounded-lg border p-3 ${unsafe ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20' : 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20'}`}>
      <p className="text-sm font-semibold">
        {unsafe
          ? t('companions.unsafeNear', { name: getPlantName(species, locale) })
          : t('companions.safeNear', { name: getPlantName(species, locale) })}
      </p>
      {reason ? <p className="mt-1 text-xs text-subtle">{reason}</p> : null}
      <Link to={`/plant/${species.id}`} className="mt-1 inline-block text-xs link-forest">{getPlantName(species, locale)}</Link>
    </div>
  );
}

function ThreeSistersSection({ plants, locale, t, mergeFavorites, setPendingGardenLayout, navigate }) {
  const [active, setActive] = useState('corn');
  const [feedback, setFeedback] = useState('');
  const data = companionsData.threeSisters;
  const crop = data[active];
  const plant = plants.find((p) => p.id === crop?.plantId);
  const sisterIds = SISTERS.map((k) => data[k].plantId).filter(Boolean);

  const addFavorites = () => {
    mergeFavorites(sisterIds);
    setFeedback(t('companions.addedToFavorites'));
  };

  const openPlanner = () => {
    const layout = createThreeSistersLayout(
      data.corn.plantId,
      data.beans.plantId,
      data.squash.plantId,
      t('companions.threeSistersLayoutName')
    );
    setPendingGardenLayout(layout);
    navigate('/garden-planner?prefill=three-sisters');
  };

  return (
    <section className="mt-8">
      <h2 className="mb-2 text-xl font-semibold dark:text-darkbg-text">{t('companions.threeSisters')}</h2>
      <QuebecBlurb text={t('companions.threeSistersWhy')} />
      <div className="card">
        <svg viewBox="0 0 400 220" className="mx-auto w-full max-w-md" role="img" aria-label={t('companions.threeSisters')}>
          <title>{t('companions.threeSisters')}</title>
          <circle
            cx="200" cy="90" r="70"
            fill={active === 'corn' ? '#fde68a' : '#fef3c7'}
            stroke="#d97706"
            strokeWidth={active === 'corn' ? 4 : 2}
            className="cursor-pointer"
            onClick={() => setActive('corn')}
            role="button"
            tabIndex={0}
            aria-pressed={active === 'corn'}
            aria-label={locale === 'fr' ? data.corn.nameFr : data.corn.nameEn}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive('corn'); } }}
          />
          <text x="200" y="85" textAnchor="middle" className="pointer-events-none fill-forest-dark text-sm font-semibold dark:fill-darkbg-text">
            {locale === 'fr' ? data.corn.nameFr : data.corn.nameEn}
          </text>
          <circle
            cx="120" cy="160" r="42"
            fill={active === 'beans' ? '#86efac' : '#dcfce7'}
            stroke="#16a34a"
            strokeWidth={active === 'beans' ? 4 : 2}
            className="cursor-pointer"
            onClick={() => setActive('beans')}
            role="button"
            tabIndex={0}
            aria-pressed={active === 'beans'}
            aria-label={locale === 'fr' ? data.beans.nameFr : data.beans.nameEn}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive('beans'); } }}
          />
          <text x="120" y="165" textAnchor="middle" className="pointer-events-none fill-forest-dark text-xs font-semibold dark:fill-darkbg-text">
            {locale === 'fr' ? data.beans.nameFr : data.beans.nameEn}
          </text>
          <circle
            cx="280" cy="160" r="42"
            fill={active === 'squash' ? '#fdba74' : '#ffedd5'}
            stroke="#ea580c"
            strokeWidth={active === 'squash' ? 4 : 2}
            className="cursor-pointer"
            onClick={() => setActive('squash')}
            role="button"
            tabIndex={0}
            aria-pressed={active === 'squash'}
            aria-label={locale === 'fr' ? data.squash.nameFr : data.squash.nameEn}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive('squash'); } }}
          />
          <text x="280" y="165" textAnchor="middle" className="pointer-events-none fill-forest-dark text-xs font-semibold dark:fill-darkbg-text">
            {locale === 'fr' ? data.squash.nameFr : data.squash.nameEn}
          </text>
        </svg>

        <div className="mt-4 rounded-lg surface-muted p-4">
          <h3 className="font-semibold">
            {plant ? <Link to={`/plant/${plant.id}`} className="link-forest">{getPlantName(plant, locale)}</Link> : (locale === 'fr' ? crop.nameFr : crop.nameEn)}
          </h3>
          <p className="mt-1 text-sm"><span className="font-medium">{t('companions.role')}:</span> {locale === 'fr' ? crop.roleFr : crop.roleEn}</p>
          <p className="mt-1 text-sm"><span className="font-medium">{t('companions.qcTiming')}:</span> {locale === 'fr' ? crop.timingFr : crop.timingEn}</p>
          <p className="mt-2 text-xs text-muted">{locale === 'fr' ? data.timingFr : data.timingEn}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="btn-secondary" onClick={addFavorites}>{t('companions.addTheseThree')}</button>
          <button type="button" className="btn-primary" onClick={openPlanner}>{t('companions.openGardenPlanner')}</button>
        </div>
        <Feedback message={feedback} />
      </div>
    </section>
  );
}

function PollinatorSection({ plants, locale, t, mergeFavorites, addToCompare, navigate }) {
  const [feedback, setFeedback] = useState('');

  const addCombo = (ids) => {
    mergeFavorites(ids);
    setFeedback(t('companions.addedToFavorites'));
  };

  const compareCombo = (ids) => {
    ids.slice(0, 3).forEach((id) => addToCompare(id));
    navigate(`/compare?ids=${ids.slice(0, 3).join(',')}`);
  };

  return (
    <section className="mt-8">
      <h2 className="mb-2 text-xl font-semibold dark:text-darkbg-text">{t('companions.pollinator')}</h2>
      <QuebecBlurb text={t('companions.pollinatorWhy')} />
      <div className="grid gap-4 sm:grid-cols-2">
        {companionsData.pollinatorCombos.map((combo) => {
          const comboPlants = combo.plantIds.map((id) => plants.find((pl) => pl.id === id)).filter(Boolean);
          return (
            <div key={combo.id} className="card">
              <h3 className="font-semibold">{locale === 'fr' ? combo.nameFr : combo.nameEn}</h3>
              <p className="mt-1 text-sm text-muted">
                {locale === 'fr' ? combo.descriptionFr : combo.descriptionEn}
              </p>
              <ul className="mt-3 space-y-2">
                {comboPlants.map((p) => (
                  <li key={p.id}>
                    <Link to={`/plant/${p.id}`} className="font-medium link-forest">{getPlantName(p, locale)}</Link>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {getBloomMonthKeys(p.bloomPeriod).map((m) => (
                        <span key={m} className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] text-amber-900 dark:bg-amber-900/40 dark:text-amber-100">
                          {t(`companions.months.${m}`)}
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" className="btn-secondary text-xs" onClick={() => addCombo(combo.plantIds)}>
                  {t('companions.addCombo')}
                </button>
                <button type="button" className="btn-secondary text-xs" onClick={() => compareCombo(combo.plantIds)}>
                  {t('companions.compareThese')}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <Feedback message={feedback} />
    </section>
  );
}

function SuccessionSection({ plants, locale, t, mergeFavorites }) {
  const [feedback, setFeedback] = useState('');

  const addSequence = (chain) => {
    const ids = chain.steps.flatMap((s) => s.plantIds || []);
    mergeFavorites(ids);
    setFeedback(t('companions.addedToFavorites'));
  };

  return (
    <section className="mt-8">
      <h2 className="mb-2 text-xl font-semibold dark:text-darkbg-text">{t('companions.succession')}</h2>
      <QuebecBlurb text={t('companions.successionWhy')} />
      {companionsData.successionChains.map((chain) => (
        <div key={chain.id} className="card mb-4">
          <h3 className="font-semibold">{locale === 'fr' ? chain.nameFr : chain.nameEn}</h3>
          <div className="mt-4 flex flex-wrap gap-4">
            {chain.steps.map((step, i) => (
              <div key={i} className="surface-muted min-w-[180px] flex-1 rounded-lg p-3">
                <p className="text-xs font-medium text-muted">{locale === 'fr' ? step.seasonFr : step.seasonEn}</p>
                <p className="font-semibold">{locale === 'fr' ? step.cropFr : step.cropEn}</p>
                <p className="text-xs text-muted">{locale === 'fr' ? step.weeksFr : step.weeksEn}</p>
                <ul className="mt-2 space-y-1">
                  {(step.plantIds || []).map((id) => {
                    const p = plants.find((pl) => pl.id === id);
                    return p ? (
                      <li key={id}>
                        <Link to={`/plant/${id}`} className="text-sm link-forest">{getPlantName(p, locale)}</Link>
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>
            ))}
          </div>
          <button type="button" className="btn-secondary mt-3 text-xs" onClick={() => addSequence(chain)}>
            {t('companions.addSequence')}
          </button>
        </div>
      ))}
      <Feedback message={feedback} />
    </section>
  );
}
