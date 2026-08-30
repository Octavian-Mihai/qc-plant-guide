import { useTranslation } from '../../i18n/useTranslation';
import { CELL_SIZE_CM } from '../../utils/plantHelpers';

/** Shows required spacing when a plant is selected. */
export default function SpacingCalculator({ plant }) {
  const { t } = useTranslation();

  if (!plant) {
    return (
      <div className="card text-sm text-forest/60 dark:text-darkbg-muted">
        {t('garden.selectPlant')}
      </div>
    );
  }

  const cellsNeeded = Math.ceil(plant.spacingCm / CELL_SIZE_CM);

  return (
    <div className="card">
      <h3 className="font-semibold text-forest-dark dark:text-darkbg-text">{t('garden.spacing')}</h3>
      <dl className="mt-2 space-y-1 text-sm">
        <div className="flex justify-between">
          <dt className="text-forest/70 dark:text-darkbg-muted">{t('garden.plant')}</dt>
          <dd className="font-medium">{plant.name}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-forest/70 dark:text-darkbg-muted">{t('garden.requiredSpacing')}</dt>
          <dd className="font-medium">{plant.spacingCm} cm</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-forest/70 dark:text-darkbg-muted">{t('garden.gridCells')}</dt>
          <dd className="font-medium">{cellsNeeded}×{cellsNeeded}</dd>
        </div>
      </dl>
    </div>
  );
}
