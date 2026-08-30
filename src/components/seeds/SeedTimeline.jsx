import { useMemo } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { formatDate } from '../../utils/dateHelpers';

const HARDENING_SCHEDULE = [
  { day: 1, en: 'Place outdoors in shade for 1 hour', fr: 'Placer à l\'extérieur à l\'ombre pendant 1 heure' },
  { day: 2, en: '2 hours in partial shade', fr: '2 heures à mi-ombre' },
  { day: 3, en: '3 hours with brief sun exposure', fr: '3 heures avec brève exposition au soleil' },
  { day: 4, en: '4 hours, reduce watering slightly', fr: '4 heures, réduire légèrement l\'arrosage' },
  { day: 5, en: '6 hours in sun/part shade', fr: '6 heures au soleil/mi-ombre' },
  { day: 6, en: '8 hours, skip watering if soil moist', fr: '8 heures, sauter l\'arrosage si sol humide' },
  { day: 7, en: 'Full day outdoors, ready to transplant', fr: 'Journée complète dehors, prêt à transplanter' },
];

/** Visual timeline for seed starting dates. */
export default function SeedTimeline({ schedule, lastFrostDate }) {
  const { t, locale } = useTranslation();

  if (!schedule) return null;

  const events = useMemo(() => {
    const frost = new Date(lastFrostDate);
    const items = [];

    if (schedule.indoorStart) {
      items.push({ date: schedule.indoorStart, label: t('seeds.indoorStart'), type: 'start' });
    }
    if (schedule.hardeningStart) {
      items.push({ date: schedule.hardeningStart, label: t('seeds.hardeningStart'), type: 'hardening' });
    }
    if (schedule.transplantDate) {
      items.push({ date: schedule.transplantDate, label: t('seeds.transplant'), type: 'transplant' });
    }
    items.push({ date: frost, label: t('seeds.lastFrost'), type: 'frost' });

    return items.sort((a, b) => a.date - b.date);
  }, [schedule, lastFrostDate, t]);

  return (
    <div className="card">
      <h3 className="heading-sm">{t('seeds.timeline')}</h3>
      <ol className="mt-4 space-y-3">
        {events.map((event, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${
              event.type === 'frost' ? 'bg-blue-500' :
              event.type === 'transplant' ? 'bg-green-500' :
              event.type === 'hardening' ? 'bg-yellow-500' : 'bg-forest'
            }`} />
            <div>
              <p className="font-medium">{event.label}</p>
              <p className="text-sm text-forest/70 dark:text-darkbg-muted">{formatDate(event.date)}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6">
        <h4 className="font-semibold">{t('seeds.hardeningSchedule')}</h4>
        <ul className="mt-2 space-y-1 text-sm text-subtle">
          {HARDENING_SCHEDULE.map((step) => (
            <li key={step.day} className="flex gap-2">
              <span className="font-medium">{t('seeds.day', { n: step.day })}:</span>
              <span>{locale === 'fr' ? step.fr : step.en}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
