import { memo } from 'react';
import useStore from '../../store/useStore';
import { useTranslation } from '../../i18n/useTranslation';

/** Dark/light theme toggle for navbar. */
function ThemeToggle() {
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-lg border border-forest/20 px-3 py-2 text-sm font-semibold text-forest transition hover:bg-cream dark:border-forest-lighter/30 dark:text-darkbg-text dark:hover:bg-darkbg"
      aria-label={t('theme.toggle')}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}

export default memo(ThemeToggle);
