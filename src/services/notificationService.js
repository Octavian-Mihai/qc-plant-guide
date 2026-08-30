/**
 * Shared browser notification service for microgreens and seed reminders.
 */

const STORAGE_KEY = 'qc-notifications-enabled';

/** @returns {boolean} */
export function isNotificationEnabled() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

/** @param {boolean} enabled */
export function setNotificationEnabled(enabled) {
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
  } catch { /* ignore */ }
}

/** @returns {Promise<boolean>} */
export async function requestNotificationPermission() {
  if (!('Notification' in window)) return false;
  const perm = await Notification.requestPermission();
  const granted = perm === 'granted';
  setNotificationEnabled(granted);
  return granted;
}

/**
 * @param {string} title
 * @param {string} body
 * @param {string} [tag]
 */
export function sendNotification(title, body, tag) {
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  if (!isNotificationEnabled()) return;
  new Notification(title, { body, tag });
}

/**
 * Check reminders and fire notifications for due items.
 * @param {{ id: string; date: string; notified: boolean; title: string; body: string }[]} reminders
 * @param {(id: string) => void} onNotified
 */
export function checkReminders(reminders, onNotified) {
  if (!isNotificationEnabled() || Notification.permission !== 'granted') return;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  reminders.forEach((reminder) => {
    if (reminder.notified) return;
    const due = new Date(reminder.date);
    due.setHours(0, 0, 0, 0);
    if (due <= today) {
      sendNotification(reminder.title, reminder.body, reminder.id);
      onNotified(reminder.id);
    }
  });
}

/** Start hourly reminder check interval. */
export function startReminderInterval(checkFn) {
  checkFn();
  const interval = setInterval(checkFn, 60 * 60 * 1000);
  return () => clearInterval(interval);
}
