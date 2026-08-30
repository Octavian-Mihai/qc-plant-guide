import { memo } from 'react';
import { calculateBeginnerScore, getZoneDisplay, getPlantDescription } from '../../utils/plantHelpers';
import { generateMonthlyCalendar } from '../../utils/dateHelpers';
import { OriginBadge } from '../common/Badge';
import { useTranslation } from '../../i18n/useTranslation';

const seasonClass = {
  spring: 'season-spring',
  summer: 'season-summer',
  fall: 'season-fall',
  winter: 'season-winter',
  dormant: 'season-dormant',
};

/** Monthly care calendar — memoized static section. */
export const CalendarSection = memo(function CalendarSection({ plant }) {
  const { t } = useTranslation();
  const calendar = generateMonthlyCalendar(plant);

  return (
    <section>
      <h3 className="mb-3 text-lg font-semibold text-forest-dark">{t('plant.calendar')}</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {calendar.map(({ month, tasks, season }) => (
          <div key={month} className={`rounded-lg p-2 text-xs ${seasonClass[season]}`}>
            <p className="font-bold">{month}</p>
            <ul className="mt-1 list-inside list-disc">
              {tasks.map((task, i) => <li key={i}>{task}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
});

/** Beginner score progress bar. */
export const BeginnerScoreSection = memo(function BeginnerScoreSection({ plant }) {
  const { t } = useTranslation();
  const score = calculateBeginnerScore(plant);

  return (
    <section>
      <h3 className="mb-2 text-lg font-semibold text-forest-dark">
        {t('plant.beginnerScore')}: {score}/100
      </h3>
      <div className="h-4 overflow-hidden rounded-full bg-forest/10">
        <div
          className="h-full rounded-full bg-forest-light transition-all"
          style={{ width: `${score}%` }}
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </section>
  );
});

/** Expandable troubleshooting accordion. */
export const TroubleshootingSection = memo(function TroubleshootingSection({ plant }) {
  const { t } = useTranslation();

  return (
    <section>
      <h3 className="mb-3 text-lg font-semibold text-forest-dark">{t('plant.troubleshooting')}</h3>
      <div className="space-y-2">
        {plant.troubleshooting.map((item, i) => (
          <details key={i} className="card">
            <summary className="cursor-pointer font-medium text-forest-dark">{item.problem}</summary>
            <p className="mt-2 text-sm text-forest/80">{item.solution}</p>
          </details>
        ))}
      </div>
    </section>
  );
});

/** Quick care icons/stats card. */
export const QuickCareSection = memo(function QuickCareSection({ plant }) {
  const { t } = useTranslation();

  const items = [
    { label: t('plant.sun'), value: plant.sunRequirements },
    { label: t('plant.water'), value: plant.waterNeeds },
    { label: t('plant.soil'), value: plant.soilPreference.join(', ') },
    { label: t('plant.dormancy'), value: plant.dormancyPeriod },
    { label: t('plant.planting'), value: plant.plantingPeriod },
    { label: t('plant.bloom'), value: plant.bloomPeriod },
    { label: t('plant.harvest'), value: plant.harvestPeriod },
    { label: t('plant.zones'), value: getZoneDisplay(plant.hardinessZone) },
  ];

  return (
    <section>
      <h3 className="mb-3 text-lg font-semibold text-forest-dark">{t('plant.quickCare')}</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map(({ label, value }) => (
          <div key={label} className="rounded-lg bg-cream p-3 text-center">
            <p className="text-xs font-medium text-forest/60">{label}</p>
            <p className="mt-1 text-sm font-semibold capitalize text-forest-dark">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
});

/** Description with origin badge. */
export const DescriptionSection = memo(function DescriptionSection({ plant, locale }) {
  const { t } = useTranslation();

  return (
    <section>
      <div className="mb-2 flex items-center gap-2">
        <h3 className="text-lg font-semibold text-forest-dark">{t('plant.description')}</h3>
        <OriginBadge origin={plant.origin} />
      </div>
      <p className="leading-relaxed text-forest/80">{getPlantDescription(plant, locale)}</p>
    </section>
  );
});
