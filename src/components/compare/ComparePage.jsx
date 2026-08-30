import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useStore from '../../store/useStore';
import { useTranslation } from '../../i18n/useTranslation';
import { calculateBeginnerScore, getZoneDisplay } from '../../utils/plantHelpers';
import { exportComparePDF } from '../../services/pdfService';

const ROWS = [
  { key: 'name', labelKey: 'compare.name' },
  { key: 'zones', labelKey: 'compare.zones' },
  { key: 'height', labelKey: 'compare.height' },
  { key: 'sun', labelKey: 'compare.sun' },
  { key: 'water', labelKey: 'compare.water' },
  { key: 'soil', labelKey: 'compare.soil' },
  { key: 'bloom', labelKey: 'compare.bloom' },
  { key: 'wildlife', labelKey: 'compare.wildlife' },
  { key: 'deer', labelKey: 'compare.deer' },
  { key: 'cost', labelKey: 'compare.cost' },
  { key: 'beginner', labelKey: 'compare.beginner' },
];

/** Side-by-side comparison table for up to 3 plants. */
export default function ComparePage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const plants = useStore((s) => s.plants);
  const compareList = useStore((s) => s.compareList);

  const ids = useMemo(() => {
    const fromUrl = searchParams.get('ids')?.split(',').filter(Boolean) || [];
    return fromUrl.length > 0 ? fromUrl.slice(0, 3) : compareList.slice(0, 3);
  }, [searchParams, compareList]);

  const compared = ids.map((id) => plants.find((p) => p.id === id)).filter(Boolean);

  const getValue = (plant, key) => {
    switch (key) {
      case 'name': return plant.name;
      case 'zones': return getZoneDisplay(plant.hardinessZone);
      case 'height': return `${plant.heightCmMin}–${plant.heightCmMax} cm`;
      case 'sun': return plant.sunRequirements;
      case 'water': return plant.waterNeeds;
      case 'soil': return plant.soilPreference.join(', ');
      case 'bloom': return plant.bloomColors?.join(', ') || '—';
      case 'wildlife': return plant.wildlifeAttracts?.join(', ') || '—';
      case 'deer': return plant.deerResistant ? t('compare.yes') : t('compare.no');
      case 'cost': return `$${plant.costCad} CAD`;
      case 'beginner': return `${calculateBeginnerScore(plant)}/100`;
      default: return '—';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="section-title">{t('compare.title')}</h1>
          <p className="mt-1 text-forest/70 dark:text-darkbg-muted">{t('compare.subtitle')}</p>
        </div>
        {compared.length > 0 && (
          <button type="button" onClick={() => exportComparePDF(compared)} className="btn-secondary">
            {t('print.exportPdf')}
          </button>
        )}
      </div>

      {compared.length === 0 ? (
        <div className="card text-center">
          <p className="text-forest/60 dark:text-darkbg-muted">{t('compare.empty')}</p>
          <Link to="/" className="btn-primary mt-4 inline-block">{t('compare.browse')}</Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-forest/20 dark:border-forest/30">
                <th className="p-3 text-left font-semibold dark:text-darkbg-text">{t('compare.attribute')}</th>
                {compared.map((p) => (
                  <th key={p.id} className="p-3 text-left font-semibold dark:text-darkbg-text">
                    <Link to={`/plant/${p.id}`} className="text-forest hover:underline dark:text-forest-lighter">{p.name}</Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map(({ key, labelKey }) => (
                <tr key={key} className="border-b border-forest/10 dark:border-forest/20">
                  <td className="p-3 font-medium text-forest/70 dark:text-darkbg-muted">{t(labelKey)}</td>
                  {compared.map((p) => (
                    <td key={p.id} className="p-3 capitalize dark:text-darkbg-text">{getValue(p, key)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
