import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n/useTranslation';

const ZONE_DATA = [
  { zone: 2, color: '#1B4332', y: 20 },
  { zone: 3, color: '#2D6A4F', y: 80 },
  { zone: 4, color: '#40916C', y: 140 },
  { zone: 5, color: '#52B788', y: 200 },
];

/** SVG zone map color-coded for Southern/Central Quebec zones 2–5. */
function ZoneMap() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/learn" className="link-forest text-sm">← {t('common.back')}</Link>
      <h1 className="section-title mt-4">{t('zones.title')}</h1>
      <p className="mt-2 text-muted">{t('zones.subtitle')}</p>

      <div className="card mt-8">
        <svg viewBox="0 0 400 280" className="mx-auto w-full max-w-lg" aria-label="Quebec zone map">
          {/* Simplified Quebec outline */}
          <path
            d="M80,40 L320,30 L350,120 L340,240 L120,260 L60,180 Z"
            className="fill-offwhite stroke-forest-dark dark:fill-darkbg-card dark:stroke-darkbg-text"
            strokeWidth="2"
          />
          {ZONE_DATA.map(({ zone, color, y }) => (
            <g key={zone}>
              <rect x="100" y={y} width="200" height="50" rx="8" fill={color} opacity="0.8" />
              <text x="200" y={y + 30} textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
                Zone {zone}
              </text>
            </g>
          ))}
          <text x="200" y="270" textAnchor="middle" className="fill-forest-dark dark:fill-darkbg-text" fontSize="12">
            Southern & Central Quebec
          </text>
        </svg>

        <ul className="mt-6 space-y-2">
          <li className="flex items-center gap-2"><span className="h-4 w-4 rounded" style={{ background: '#1B4332' }} /> {t('zones.zone2')}</li>
          <li className="flex items-center gap-2"><span className="h-4 w-4 rounded" style={{ background: '#2D6A4F' }} /> {t('zones.zone3')}</li>
          <li className="flex items-center gap-2"><span className="h-4 w-4 rounded" style={{ background: '#40916C' }} /> {t('zones.zone4')}</li>
          <li className="flex items-center gap-2"><span className="h-4 w-4 rounded" style={{ background: '#52B788' }} /> {t('zones.zone5')}</li>
        </ul>
      </div>
    </div>
  );
}

export default memo(ZoneMap);
