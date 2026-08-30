import { memo } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

/** Accessible loading spinner for async image/data loads. */
function LoadingSpinner({ size = 'md' }) {
  const { t } = useTranslation();
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };

  return (
    <div className="flex items-center justify-center p-8" role="status" aria-label={t('common.loading')}>
      <div
        className={`${sizes[size]} animate-spin rounded-full border-4 border-forest/20 border-t-forest`}
      />
    </div>
  );
}

export default memo(LoadingSpinner);
