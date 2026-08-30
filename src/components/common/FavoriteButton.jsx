import { memo } from 'react';
import useStore from '../../store/useStore';
import { useTranslation } from '../../i18n/useTranslation';

/** Heart toggle for favorites on cards and detail modal. */
function FavoriteButton({ plantId, className = '' }) {
  const favorites = useStore((s) => s.favorites);
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const { t } = useTranslation();
  const isFav = favorites.includes(plantId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(plantId);
      }}
      className={`rounded-full p-1.5 transition hover:scale-110 ${isFav ? 'text-red-500' : 'text-forest/40 hover:text-red-400 dark:text-darkbg-muted dark:hover:text-red-400'} ${className}`}
      aria-label={isFav ? t('favorites.remove') : t('favorites.add')}
      aria-pressed={isFav}
    >
      {isFav ? '♥' : '♡'}
    </button>
  );
}

export default memo(FavoriteButton);
