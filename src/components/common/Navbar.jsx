import { memo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useStore from '../../store/useStore';
import { useTranslation } from '../../i18n/useTranslation';
import ThemeToggle from './ThemeToggle';

/** Top navigation with grouped nav, theme toggle, and favorites badge. */
function Navbar() {
  const { t, locale } = useTranslation();
  const setLocale = useStore((s) => s.setLocale);
  const favorites = useStore((s) => s.favorites);
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const groups = [
    {
      label: t('nav.explore'),
      links: [
        { to: '/', label: t('nav.home') },
        { to: '/favorites', label: t('nav.favorites'), badge: favorites.length },
        { to: '/compare', label: t('nav.compare') },
      ],
    },
    {
      label: t('nav.tools'),
      links: [
        { to: '/garden-planner', label: t('nav.gardenPlanner') },
        { to: '/seed-starting', label: t('nav.seedStarting') },
        { to: '/companions', label: t('nav.companions') },
        { to: '/ipm', label: t('nav.ipm') },
        { to: '/microgreens', label: t('nav.microgreens') },
      ],
    },
    {
      label: t('nav.learnGroup'),
      links: [{ to: '/learn', label: t('nav.learn') }],
    },
  ];

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-40 border-b border-forest/10 bg-white/95 backdrop-blur dark:border-forest/20 dark:bg-darkbg-card/95">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3" aria-label="Main navigation">
        <Link to="/" className="font-display text-xl font-bold text-forest-dark dark:text-darkbg-text">
          🌿 QC Plants
        </Link>

        <button
          type="button"
          className="rounded-lg p-2 text-forest-dark md:hidden dark:text-darkbg-text"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <ul className={`${mobileOpen ? 'flex' : 'hidden'} absolute left-0 right-0 top-full flex-col gap-2 border-b border-forest/10 bg-white p-4 dark:border-forest/20 dark:bg-darkbg-card md:static md:flex md:flex-row md:items-center md:gap-1 md:border-0 md:bg-transparent md:p-0`}>
          {groups.map((group) => (
            <li key={group.label} className="md:relative md:group">
              <span className="hidden px-2 py-2 text-xs font-semibold uppercase text-forest/50 md:inline dark:text-darkbg-muted">
                {group.label}
              </span>
              <ul className="flex flex-col md:flex-row md:gap-1">
                {group.links.map(({ to, label, badge }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      className={`relative flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                        isActive(to)
                          ? 'bg-forest text-white'
                          : 'text-forest-dark hover:bg-cream dark:text-darkbg-text dark:hover:bg-darkbg'
                      }`}
                    >
                      {label}
                      {badge > 0 && (
                        <span className="rounded-full bg-red-500 px-1.5 text-xs text-white">{badge}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}

          <li className="flex items-center gap-2 md:ml-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setLocale(locale === 'en' ? 'fr' : 'en')}
              className="rounded-lg border border-forest/20 px-3 py-2 text-sm font-semibold text-forest hover:bg-cream dark:border-forest-lighter/30 dark:text-darkbg-text dark:hover:bg-darkbg"
              aria-label={t('nav.language')}
            >
              {locale === 'en' ? 'FR' : 'EN'}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default memo(Navbar);
