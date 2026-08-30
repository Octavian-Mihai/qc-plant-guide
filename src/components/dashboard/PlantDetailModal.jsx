import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useStore from '../../store/useStore';
import { fetchPlantImage, placeholderSvg } from '../../services/imageService';
import { useTranslation } from '../../i18n/useTranslation';
import LoadingSpinner from '../common/LoadingSpinner';
import {
  CalendarSection,
  BeginnerScoreSection,
  TroubleshootingSection,
  QuickCareSection,
  DescriptionSection,
} from './PlantDetailSections';

/** Full-page overlay modal for plant details. Opens via card click or /plant/:id route. */
export default function PlantDetailModal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, locale } = useTranslation();
  const plants = useStore((s) => s.plants);
  const setSelectedPlant = useStore((s) => s.setSelectedPlant);

  const plant = plants.find((p) => p.id === id);
  const [imageUrl, setImageUrl] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (plant) {
      setSelectedPlant(plant);
      fetchPlantImage(plant.name).then(setImageUrl);
    }
    return () => setSelectedPlant(null);
  }, [plant, setSelectedPlant]);

  const handleClose = useCallback(() => navigate('/'), [navigate]);

  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}/plant/${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      window.prompt('Copy link:', url);
    }
  }, [id]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleClose]);

  if (!plant) return <LoadingSpinner />;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={plant.name}
    >
      <div className="relative my-8 w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
        {/* Header image */}
        <div className="relative aspect-[16/7] overflow-hidden rounded-t-2xl bg-cream">
          <img
            src={imageUrl || placeholderSvg}
            alt={plant.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <h2 className="font-display text-3xl font-bold">{plant.name}</h2>
            <p className="italic opacity-90">{plant.scientificName}</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-forest-dark hover:bg-white"
            aria-label={t('plant.close')}
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 p-6">
          <DescriptionSection plant={plant} locale={locale} />
          <BeginnerScoreSection plant={plant} />
          <QuickCareSection plant={plant} />
          <CalendarSection plant={plant} />
          <TroubleshootingSection plant={plant} />

          <button type="button" onClick={handleShare} className="btn-primary">
            {copied ? t('plant.copied') : t('plant.share')}
          </button>
        </div>
      </div>
    </div>
  );
}
