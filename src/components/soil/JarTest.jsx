import { memo } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

/** Visual button card for wizard choices. */
const OptionCard = memo(function OptionCard({ selected, onClick, title, description }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`card w-full text-left transition ${
        selected ? 'border-forest ring-2 ring-forest-light' : 'hover:border-forest/30'
      }`}
      aria-pressed={selected}
    >
      <h4 className="font-semibold text-forest-dark">{title}</h4>
      {description && <p className="mt-1 text-sm text-forest/70">{description}</p>}
    </button>
  );
});

/** Jar test step — observe soil layers after settling. */
function JarTest({ texture, ph, onTextureChange, onPhChange }) {
  const { t } = useTranslation();

  const textures = [
    { value: 'sandy', label: t('soil.textureSandy') },
    { value: 'loamy', label: t('soil.textureLoamy') },
    { value: 'clay', label: t('soil.textureClay') },
    { value: 'silty', label: t('soil.textureSilty') },
  ];

  const phOptions = [
    { value: 'acidic', label: t('soil.phAcidic') },
    { value: 'neutral', label: t('soil.phNeutral') },
    { value: 'alkaline', label: t('soil.phAlkaline') },
  ];

  return (
    <div className="space-y-6">
      {/* Jar test diagram */}
      <div className="mx-auto flex max-w-xs items-end justify-center gap-4">
        <div className="relative h-48 w-20 rounded-b-lg border-2 border-forest/30 bg-white">
          <div className="absolute bottom-0 h-[30%] w-full bg-amber-700/60" title="Sand layer" />
          <div className="absolute bottom-[30%] h-[20%] w-full bg-amber-500/50" title="Silt layer" />
          <div className="absolute bottom-[50%] h-[35%] w-full bg-amber-800/40" title="Clay layer" />
          <div className="absolute top-2 h-[15%] w-full bg-blue-100/50" title="Water layer" />
        </div>
        <ol className="text-sm text-forest/80">
          <li>1. Fill jar ⅓ with soil</li>
          <li>2. Add water, shake well</li>
          <li>3. Wait 24 hours</li>
          <li>4. Measure layer proportions</li>
        </ol>
      </div>

      <div>
        <p className="mb-2 font-medium text-forest-dark">Texture result:</p>
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

      <div>
        <p className="mb-2 font-medium text-forest-dark">pH (optional strip test):</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {phOptions.map((opt) => (
            <OptionCard
              key={opt.value}
              selected={ph === opt.value}
              onClick={() => onPhChange(opt.value)}
              title={opt.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(JarTest);
