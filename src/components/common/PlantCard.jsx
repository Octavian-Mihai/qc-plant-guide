import { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPlantImage, placeholderSvg } from '../../services/imageService';
import { getZoneDisplay, getPlantAttributeChips } from '../../utils/plantHelpers';
import { OriginBadge } from './Badge';
import FavoriteButton from './FavoriteButton';
import useStore from '../../store/useStore';
import { getSoilMatchTier } from '../../services/soilMatcher';
import { useTranslation } from '../../i18n/useTranslation';
import Badge from './Badge';

/** Individual plant card in the results grid. */
const PlantCard = memo(function PlantCard({ plant }) {
  const [imageUrl, setImageUrl] = useState(null);
  const soilTestResult = useStore((s) => s.soilTestResult);
  const addToCompare = useStore((s) => s.addToCompare);
  const { t } = useTranslation();

  useEffect(() => {
    let cancelled = false;
    fetchPlantImage(plant.name).then((url) => {
      if (!cancelled) setImageUrl(url);
    });
    return () => { cancelled = true; };
  }, [plant.name]);

  const soilTier =
    soilTestResult && getSoilMatchTier(plant.soilPreference, soilTestResult);

  const chips = getPlantAttributeChips(plant, 'en', t).slice(0, 3);

  return (
    <div className="group card relative flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-md dark:bg-darkbg-card">
      <Link to={`/plant/${plant.id}`} className="flex flex-1 flex-col" aria-label={plant.name}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-cream dark:bg-darkbg">
          <img
            src={imageUrl || placeholderSvg}
            alt={plant.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            <OriginBadge origin={plant.origin} />
            {soilTier === 'strong' && <Badge type="soil">✓ {t('badges.soilMatch')}</Badge>}
          </div>
          <div className="absolute right-2 top-2">
            <FavoriteButton plantId={plant.id} className="bg-white/80 dark:bg-darkbg-card/80" />
          </div>
        </div>

        <div className="mt-3 flex flex-1 flex-col">
          <h3 className="font-display text-lg font-semibold text-forest-dark dark:text-darkbg-text">{plant.name}</h3>
          <p className="text-xs italic text-forest/70 dark:text-darkbg-muted">{plant.scientificName}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-forest/80 dark:text-darkbg-muted">
            <span>{getZoneDisplay(plant.hardinessZone)}</span>
            <span>·</span>
            <span>{plant.heightCmMin}–{plant.heightCmMax} cm</span>
            <span>·</span>
            <span>${plant.costCad} CAD</span>
          </div>
          {chips.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {chips.map((chip, i) => (
                <span key={i} className="rounded-full bg-forest/10 px-2 py-0.5 text-xs dark:bg-forest/20 dark:text-darkbg-text">
                  {chip.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
      <button
        type="button"
        onClick={() => addToCompare(plant.id)}
        className="mt-2 w-full rounded-lg border border-forest/20 py-1 text-xs font-medium text-forest hover:bg-cream dark:border-forest/30 dark:text-forest-lighter dark:hover:bg-darkbg"
      >
        {t('compare.add')}
      </button>
    </div>
  );
});

export default PlantCard;
