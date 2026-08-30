import { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPlantImage, placeholderSvg } from '../../services/imageService';
import { getZoneDisplay } from '../../utils/plantHelpers';
import { OriginBadge } from './Badge';
import useStore from '../../store/useStore';
import { matchSoilCompatibility } from '../../services/soilMatcher';
import { useTranslation } from '../../i18n/useTranslation';
import Badge from './Badge';

/** Individual plant card in the results grid. Memoized to avoid re-renders during scroll. */
const PlantCard = memo(function PlantCard({ plant }) {
  const [imageUrl, setImageUrl] = useState(null);
  const soilTestResult = useStore((s) => s.soilTestResult);
  const { t } = useTranslation();

  useEffect(() => {
    let cancelled = false;
    fetchPlantImage(plant.name).then((url) => {
      if (!cancelled) setImageUrl(url);
    });
    return () => { cancelled = true; };
  }, [plant.name]);

  const soilMatch =
    soilTestResult && matchSoilCompatibility(plant.soilPreference, soilTestResult);

  return (
    <Link
      to={`/plant/${plant.id}`}
      className="group card flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-md"
      aria-label={plant.name}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-cream">
        <img
          src={imageUrl || placeholderSvg}
          alt={plant.name}
          className="h-full w-full object-cover transition group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          <OriginBadge origin={plant.origin} />
          {soilMatch && <Badge type="soil">✓ {t('badges.soilMatch')}</Badge>}
        </div>
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <h3 className="font-display text-lg font-semibold text-forest-dark">{plant.name}</h3>
        <p className="text-xs italic text-forest/70">{plant.scientificName}</p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-forest/80">
          <span>{getZoneDisplay(plant.hardinessZone)}</span>
          <span>·</span>
          <span>{plant.height}</span>
          <span>·</span>
          <span>${plant.costCad} CAD</span>
        </div>
      </div>
    </Link>
  );
});

export default PlantCard;
