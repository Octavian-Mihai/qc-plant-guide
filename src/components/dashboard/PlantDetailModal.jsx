import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import useStore from '../../store/useStore';
import { fetchPlantImage, placeholderSvg } from '../../services/imageService';
import { useTranslation } from '../../i18n/useTranslation';
import { getPlantDescription } from '../../utils/plantHelpers';
import { generateMonthlyCalendar } from '../../utils/dateHelpers';
import { exportPlantDetailPDF, exportCalendarPDF } from '../../services/pdfService';
import LoadingSpinner from '../common/LoadingSpinner';
import FavoriteButton from '../common/FavoriteButton';
import PrintPlantDetail from '../print/PrintPlantDetail';
import PrintCalendar from '../print/PrintCalendar';
import {
  CalendarSection,
  BeginnerScoreSection,
  TroubleshootingSection,
  QuickCareSection,
  DescriptionSection,
  AttributeChipsSection,
} from './PlantDetailSections';

/** Full-page overlay modal for plant details. */
export default function PlantDetailModal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, locale } = useTranslation();
  const plants = useStore((s) => s.plants);
  const setSelectedPlant = useStore((s) => s.setSelectedPlant);
  const addToCompare = useStore((s) => s.addToCompare);

  const plant = plants.find((p) => p.id === id);
  const [imageUrl, setImageUrl] = useState(null);
  const [copied, setCopied] = useState(false);
  const printDetailRef = useRef(null);
  const printCalendarRef = useRef(null);
  const handlePrintDetail = useReactToPrint({ contentRef: printDetailRef });
  const handlePrintCalendar = useReactToPrint({ contentRef: printCalendarRef });

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
      window.prompt('Copy link:', url);
    }
  }, [id]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleClose]);

  if (!plant) return <LoadingSpinner />;

  const description = getPlantDescription(plant, locale);
  const calendar = generateMonthlyCalendar(plant);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={plant.name}
    >
      <div className="relative my-8 w-full max-w-3xl rounded-2xl bg-white shadow-2xl dark:bg-darkbg-card">
        <div className="relative aspect-[16/7] overflow-hidden rounded-t-2xl bg-cream dark:bg-darkbg">
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
          <div className="absolute right-4 top-4 flex gap-2">
            <FavoriteButton plantId={plant.id} className="bg-white/90 text-xl dark:bg-darkbg-card/90" />
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full bg-white/90 p-2 text-forest-dark hover:bg-white dark:bg-darkbg-card/90 dark:text-darkbg-text"
              aria-label={t('plant.close')}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="space-y-6 p-6">
          <DescriptionSection plant={plant} locale={locale} />
          <AttributeChipsSection plant={plant} />
          <BeginnerScoreSection plant={plant} />
          <QuickCareSection plant={plant} />
          <CalendarSection plant={plant} />
          <TroubleshootingSection plant={plant} />

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={handleShare} className="btn-primary">
              {copied ? t('plant.copied') : t('plant.share')}
            </button>
            <button type="button" onClick={() => addToCompare(plant.id)} className="btn-secondary">
              {t('compare.add')}
            </button>
            <Link to={`/companions`} className="btn-secondary">{t('companions.viewForPlant')}</Link>
            <button type="button" onClick={handlePrintDetail} className="btn-secondary">{t('print.print')}</button>
            <button type="button" onClick={() => exportPlantDetailPDF(plant, description)} className="btn-secondary">
              {t('print.exportPdf')}
            </button>
            <button type="button" onClick={handlePrintCalendar} className="btn-secondary">{t('print.printCalendar')}</button>
            <button type="button" onClick={() => exportCalendarPDF(calendar, plant.name)} className="btn-secondary">
              {t('print.exportCalendarPdf')}
            </button>
          </div>
        </div>
      </div>

      <div className="hidden">
        <PrintPlantDetail ref={printDetailRef} plant={plant} description={description} />
        <PrintCalendar ref={printCalendarRef} calendar={calendar} plantName={plant.name} />
      </div>
    </div>
  );
}
