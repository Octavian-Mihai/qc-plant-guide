import { memo } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

const OptionCard = memo(function OptionCard({ selected, onClick, title, color }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`card flex items-center gap-3 transition ${
        selected ? 'border-forest ring-2 ring-forest-light' : 'hover:border-forest/30'
      }`}
      aria-pressed={selected}
    >
      {color && <span className="h-8 w-8 rounded-full border border-forest/20" style={{ backgroundColor: color }} />}
      <span className="font-semibold text-forest-dark">{title}</span>
    </button>
  );
});

/** pH strip color guide for acidity testing. */
function PHTest({ texture, ph, onTextureChange, onPhChange }) {
  const { t } = useTranslation();

  const textures = [
    { value: 'sandy', label: t('soil.textureSandy') },
    { value: 'loamy', label: t('soil.textureLoamy') },
    { value: 'clay', label: t('soil.textureClay') },
    { value: 'silty', label: t('soil.textureSilty') },
  ];

  const phOptions = [
    { value: 'acidic', label: t('soil.phAcidic'), color: '#FF6B6B' },
    { value: 'neutral', label: t('soil.phNeutral'), color: '#51CF66' },
    { value: 'alkaline', label: t('soil.phAlkaline'), color: '#339AF0' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-cream p-4 text-sm text-forest/80">
        <p className="font-medium text-forest-dark">pH strip guide:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Dip strip in soil-water mixture for 30 seconds</li>
          <li>Compare color to chart on strip package</li>
          <li>Red/orange = acidic · Green = neutral · Blue/purple = alkaline</li>
        </ul>
      </div>

      <div>
        <p className="mb-2 font-medium text-forest-dark">pH result:</p>
        <div className="grid gap-2">
          {phOptions.map((opt) => (
            <OptionCard
              key={opt.value}
              selected={ph === opt.value}
              onClick={() => onPhChange(opt.value)}
              title={opt.label}
              color={opt.color}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 font-medium text-forest-dark">Also note texture:</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {textures.map((opt) => (
            <OptionCard
              key={opt.value}
              selected={texture === opt.value}
              onClick={() => onTextureChange(opt.value)}
              title={opt.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(PHTest);
