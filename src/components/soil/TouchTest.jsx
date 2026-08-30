import { memo } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

const OptionCard = memo(function OptionCard({ selected, onClick, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`card w-full text-left transition ${
        selected ? 'border-forest ring-2 ring-forest-light' : 'hover:border-forest/30'
      }`}
      aria-pressed={selected}
    >
      <span className="font-semibold">{title}</span>
    </button>
  );
});

/** Ribbon/squeeze test for soil texture without equipment. */
function TouchTest({ texture, ph, onTextureChange, onPhChange }) {
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
      <div className="surface-muted rounded-lg p-4 text-sm text-subtle">
        <p className="font-medium">Ribbon test instructions:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Moisten a handful of soil until it feels like a wrung-out sponge</li>
          <li>Squeeze it into a ball, then try to form a ribbon between thumb and finger</li>
          <li>No ribbon = sandy · Short ribbon = loamy · Long ribbon = clay · Smooth = silty</li>
        </ul>
      </div>

      <div>
        <p className="mb-2 font-medium">Texture result:</p>
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
        <p className="mb-2 font-medium">pH estimate:</p>
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

export default memo(TouchTest);
