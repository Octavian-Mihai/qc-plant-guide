import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useStore from '../../store/useStore';
import { useTranslation } from '../../i18n/useTranslation';
import PlantCard from '../common/PlantCard';
import { exportShoppingListPDF } from '../../services/pdfService';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import PrintShoppingList from '../print/PrintShoppingList';

/** Favorites page with shareable wishlist URL. */
export default function FavoritesPage() {
  const { t } = useTranslation();
  const favorites = useStore((s) => s.favorites);
  const mergeFavorites = useStore((s) => s.mergeFavorites);
  const plants = useStore((s) => s.plants);
  const [searchParams, setSearchParams] = useSearchParams();
  const [copied, setCopied] = useState(false);
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({ contentRef: printRef });

  const favoritePlants = plants.filter((p) => favorites.includes(p.id));

  useEffect(() => {
    const share = searchParams.get('share');
    if (share) {
      const ids = share.split(',').filter(Boolean);
      if (ids.length > 0 && window.confirm(t('favorites.mergeConfirm'))) {
        mergeFavorites(ids);
        setSearchParams({});
      }
    }
  }, [searchParams, mergeFavorites, setSearchParams, t]);

  const handleShare = async () => {
    const url = `${window.location.origin}/favorites?share=${favorites.join(',')}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy link:', url);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="section-title">{t('favorites.title')}</h1>
          <p className="mt-1 text-forest/70 dark:text-darkbg-muted">{t('favorites.subtitle')}</p>
        </div>
        {favoritePlants.length > 0 && (
          <div className="flex gap-2">
            <button type="button" onClick={handleShare} className="btn-secondary">
              {copied ? t('favorites.copied') : t('favorites.share')}
            </button>
            <button type="button" onClick={() => exportShoppingListPDF(favoritePlants, t('favorites.title'))} className="btn-secondary">
              {t('print.exportPdf')}
            </button>
            <button type="button" onClick={handlePrint} className="btn-primary">{t('print.print')}</button>
          </div>
        )}
      </div>

      {favoritePlants.length === 0 ? (
        <div className="card text-center">
          <p className="text-forest/60 dark:text-darkbg-muted">{t('favorites.empty')}</p>
          <Link to="/" className="btn-primary mt-4 inline-block">{t('favorites.browse')}</Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favoritePlants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      )}

      <div className="hidden">
        <PrintShoppingList ref={printRef} plants={favoritePlants} title={t('favorites.title')} />
      </div>
    </div>
  );
}
