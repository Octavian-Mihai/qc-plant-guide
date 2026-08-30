import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useStore from '../../store/useStore';
import { useTranslation } from '../../i18n/useTranslation';

/** Top navigation with bilingual language toggle. */
function Navbar() {
  const { t, locale } = useTranslation();
  const setLocale = useStore((s) => s.setLocale);
  const location = useLocation();

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/microgreens', label: t('nav.microgreens') },
    { to: '/learn', label: t('nav.learn') },
  ];

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-40 border-b border-forest/10 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3" aria-label="Main navigation">
        <Link to="/" className="font-display text-xl font-bold text-forest-dark">
          🌿 QC Plants
        </Link>

        <ul className="flex items-center gap-1 sm:gap-4">
          {links.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive(to) ? 'bg-forest text-white' : 'text-forest-dark hover:bg-cream'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}

          {/* Bilingual toggle — stores preference in Zustand + localStorage */}
          <li>
            <button
              type="button"
              onClick={() => setLocale(locale === 'en' ? 'fr' : 'en')}
              className="rounded-lg border border-forest/20 px-3 py-2 text-sm font-semibold text-forest hover:bg-cream"
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
