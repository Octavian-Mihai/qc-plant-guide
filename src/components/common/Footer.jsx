import { memo } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

/** Site footer with Quebec frost date reminder. */
function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto border-t border-forest/10 bg-forest-dark py-8 text-offwhite">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <p className="font-display text-lg font-semibold">{t('footer.tagline')}</p>
        <p className="mt-2 text-sm text-forest-lighter">{t('footer.frostNote')}</p>
        <p className="mt-4 text-xs opacity-70">© {new Date().getFullYear()} Quebec Plant Zone Guide</p>
      </div>
    </footer>
  );
}

export default memo(Footer);
