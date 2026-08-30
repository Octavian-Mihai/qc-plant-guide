import { useState, useEffect, useMemo } from 'react';
import useStore from '../../store/useStore';
import { useTranslation } from '../../i18n/useTranslation';
import { CITY_FROST_PRESETS } from '../../utils/dateHelpers';
import seedScheduleData from '../../data/seedSchedule.json';
import SeedTimeline from './SeedTimeline';
import SoilTempGuide from './SoilTempGuide';
import {
  requestNotificationPermission,
  startReminderInterval,
  isNotificationEnabled,
} from '../../services/notificationService';

function parseFrostDate(str, year = new Date().getFullYear()) {
  const [month, day] = str.split(' ');
  const months = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  return new Date(year, months[month], parseInt(day, 10));
}

function computeSchedule(entry, lastFrost) {
  const frost = parseFrostDate(lastFrost);
  const result = { indoorStart: null, hardeningStart: null, transplantDate: null };

  if (entry.weeksBeforeLastFrost) {
    result.indoorStart = new Date(frost);
    result.indoorStart.setDate(result.indoorStart.getDate() - entry.weeksBeforeLastFrost * 7);
  }

  result.transplantDate = new Date(frost);
  result.transplantDate.setDate(result.transplantDate.getDate() + entry.transplantWeeksAfterLastFrost * 7);

  if (entry.hardeningDays > 0) {
    result.hardeningStart = new Date(result.transplantDate);
    result.hardeningStart.setDate(result.hardeningStart.getDate() - entry.hardeningDays);
  }

  return result;
}

/** Seed starting tool with frost-based timeline and notifications. */
export default function SeedStarting() {
  const { t, locale } = useTranslation();
  const plants = useStore((s) => s.plants);
  const seedCityId = useStore((s) => s.seedCityId);
  const setSeedCityId = useStore((s) => s.setSeedCityId);
  const seedSchedules = useStore((s) => s.seedSchedules);
  const addSeedReminder = useStore((s) => s.addSeedReminder);
  const markSeedReminderNotified = useStore((s) => s.markSeedReminderNotified);

  const [selectedPlantId, setSelectedPlantId] = useState('');
  const [observedTemp, setObservedTemp] = useState('');
  const [notifyEnabled, setNotifyEnabled] = useState(isNotificationEnabled());

  const city = CITY_FROST_PRESETS.find((c) => c.id === seedCityId) || CITY_FROST_PRESETS[0];

  const seedPlants = useMemo(() => {
    const ids = new Set(seedScheduleData.map((s) => s.plantId));
    return plants.filter((p) => ids.has(p.id));
  }, [plants]);

  const entry = seedScheduleData.find((s) => s.plantId === selectedPlantId);
  const selectedPlant = plants.find((p) => p.id === selectedPlantId);

  const schedule = useMemo(() => {
    if (!entry) return null;
    return computeSchedule(entry, city.lastFrost);
  }, [entry, city.lastFrost]);

  useEffect(() => {
    const cleanup = startReminderInterval(() => {
      const reminders = seedSchedules.map((r) => {
        const plant = plants.find((p) => p.id === r.plantId);
        return {
          ...r,
          title: t('seeds.reminderTitle'),
          body: `${plant?.name || ''} — ${t(`seeds.reminder.${r.type}`)}`,
        };
      });
      reminders.forEach((r) => {
        if (r.notified) return;
        const due = new Date(r.date);
        due.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (due <= today && notifyEnabled) {
          markSeedReminderNotified(r.id);
        }
      });
    });
    return cleanup;
  }, [seedSchedules, plants, t, notifyEnabled, markSeedReminderNotified]);

  const handleScheduleReminders = () => {
    if (!entry || !selectedPlant || !schedule) return;
    const reminders = [];
    if (schedule.indoorStart) {
      reminders.push({ id: crypto.randomUUID(), plantId: selectedPlantId, type: 'start', date: schedule.indoorStart.toISOString(), notified: false });
    }
    if (schedule.hardeningStart) {
      reminders.push({ id: crypto.randomUUID(), plantId: selectedPlantId, type: 'hardening', date: schedule.hardeningStart.toISOString(), notified: false });
    }
    if (schedule.transplantDate) {
      reminders.push({ id: crypto.randomUUID(), plantId: selectedPlantId, type: 'transplant', date: schedule.transplantDate.toISOString(), notified: false });
    }
    reminders.forEach(addSeedReminder);
    alert(t('seeds.remindersSet'));
  };

  const handleNotify = async () => {
    const granted = await requestNotificationPermission();
    setNotifyEnabled(granted);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="section-title">{t('seeds.title')}</h1>
      <p className="mt-1 text-forest/70 dark:text-darkbg-muted">{t('seeds.subtitle')}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="card">
            <label htmlFor="seed-city" className="label-text mb-1 block">{t('seeds.selectCity')}</label>
            <select
              id="seed-city"
              value={seedCityId}
              onChange={(e) => setSeedCityId(e.target.value)}
              className="w-full rounded-lg border border-forest/20 px-3 py-2 dark:border-forest/30 dark:bg-darkbg dark:text-darkbg-text"
            >
              {CITY_FROST_PRESETS.map((c) => (
                <option key={c.id} value={c.id}>{locale === 'fr' ? c.nameFr : c.nameEn}</option>
              ))}
            </select>
            <p className="mt-2 text-sm text-subtle">{t('seeds.lastFrost')}: <strong>{city.lastFrost}</strong></p>
          </div>

          <div className="card">
            <label htmlFor="seed-plant" className="label-text mb-1 block">{t('seeds.selectPlant')}</label>
            <select
              id="seed-plant"
              value={selectedPlantId}
              onChange={(e) => setSelectedPlantId(e.target.value)}
              className="w-full rounded-lg border border-forest/20 px-3 py-2 dark:border-forest/30 dark:bg-darkbg dark:text-darkbg-text"
            >
              <option value="">{t('seeds.choosePlant')}</option>
              {seedPlants.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {entry && (
            <SoilTempGuide
              minTemp={entry.minSoilTempC}
              observedTemp={observedTemp}
              onObservedChange={setObservedTemp}
            />
          )}

          <div className="flex gap-2">
            <button type="button" onClick={handleScheduleReminders} disabled={!selectedPlantId} className="btn-primary">
              {t('seeds.scheduleReminders')}
            </button>
            <button type="button" onClick={handleNotify} className="btn-secondary">
              {notifyEnabled ? t('seeds.notifyGranted') : t('seeds.notify')}
            </button>
          </div>
        </div>

        <div>
          {schedule && selectedPlant && (
            <SeedTimeline schedule={schedule} lastFrostDate={parseFrostDate(city.lastFrost)} />
          )}
        </div>
      </div>

      {seedSchedules.length > 0 && (
        <section className="mt-8 card">
          <h2 className="font-semibold">{t('seeds.activeReminders')}</h2>
          <ul className="mt-2 space-y-2">
            {seedSchedules.map((r) => {
              const plant = plants.find((p) => p.id === r.plantId);
              return (
                <li key={r.id} className="flex justify-between text-sm">
                  <span>{plant?.name} — {t(`seeds.reminder.${r.type}`)}</span>
                  <span className={r.notified ? 'text-muted' : 'font-medium'}>
                    {new Date(r.date).toLocaleDateString()} {r.notified && '✓'}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
