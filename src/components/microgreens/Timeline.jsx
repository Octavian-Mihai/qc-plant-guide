import { memo } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import day1 from '../../assets/microgreens-timeline-images/day-1.svg';
import day2 from '../../assets/microgreens-timeline-images/day-2.svg';
import day3 from '../../assets/microgreens-timeline-images/day-3.svg';
import day4 from '../../assets/microgreens-timeline-images/day-4.svg';
import day5 from '../../assets/microgreens-timeline-images/day-5.svg';
import day6 from '../../assets/microgreens-timeline-images/day-6.svg';
import day7 from '../../assets/microgreens-timeline-images/day-7.svg';

const IMAGES = [day1, day2, day3, day4, day5, day6, day7];

const STEPS_EN = [
  'Soak seeds (if needed) and prepare tray with 2 cm moist soil or growing mat.',
  'Spread seeds evenly — don\'t overcrowd. Press gently into medium.',
  'Cover with lid or damp cloth. Keep in dark, warm spot (18–22°C).',
  'Remove cover when seeds sprout. Move to bright indirect light.',
  'Water from bottom daily. Avoid soggy conditions.',
  'Move to full light. Watch for vibrant green color developing.',
  'Harvest with scissors just above soil line. Rinse and enjoy!',
];

const STEPS_FR = [
  'Trempez les graines si nécessaire. Préparez un plateau avec 2 cm de terre humide.',
  'Répartissez les graines uniformément. Pressez légèrement.',
  'Couvrez avec un couvercle ou un tissu humide. Gardez au chaud (18–22°C).',
  'Retirez le couvercle quand les graines germent. Placez en lumière indirecte.',
  'Arrosez par le bas quotidiennement. Évitez le excès d\'eau.',
  'Placez en pleine lumière. Observez la couleur verte vibrante.',
  'Récoltez avec des ciseaux au-dessus du sol. Rincez et dégustez!',
];

/** 7-day visual microgreens growing timeline with progress indicator. */
function Timeline() {
  const { t, locale } = useTranslation();
  const steps = locale === 'fr' ? STEPS_FR : STEPS_EN;

  return (
    <section className="card">
      <h2 className="section-title">{t('microgreens.timeline')}</h2>
      <div className="mt-6 space-y-4">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${
                i < 7 ? 'bg-forest' : 'bg-forest/30'
              }`}>
                {i + 1}
              </div>
              {i < 6 && <div className="w-0.5 flex-1 bg-forest/20 dark:bg-forest/30" />}
            </div>
            <div className="flex-1 pb-4">
              <img src={IMAGES[i]} alt={`Day ${i + 1}`} className="mb-2 h-16 w-24 rounded object-cover" />
              <p className="text-sm text-subtle">{step}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default memo(Timeline);
