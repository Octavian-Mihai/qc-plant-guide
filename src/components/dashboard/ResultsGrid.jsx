import { useEffect, useRef, useCallback } from 'react';
import useStore from '../../store/useStore';
import PlantCard from '../common/PlantCard';
import { useTranslation } from '../../i18n/useTranslation';

const PAGE_SIZE = 12;

/** Responsive grid with Intersection Observer infinite scroll. */
export default function ResultsGrid() {
  const { t } = useTranslation();
  const filteredPlants = useStore((s) => s.filteredPlants);
  const currentPage = useStore((s) => s.currentPage);
  const setCurrentPage = useStore((s) => s.setCurrentPage);

  const sentinelRef = useRef(null);
  const visible = filteredPlants.slice(0, currentPage * PAGE_SIZE);
  const hasMore = visible.length < filteredPlants.length;

  const loadMore = useCallback(() => {
    if (hasMore) setCurrentPage(currentPage + 1);
  }, [hasMore, currentPage, setCurrentPage]);

  // Intersection Observer triggers next page load when sentinel enters viewport
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  if (filteredPlants.length === 0) {
    return (
      <div className="py-16 text-center text-muted">
        <p className="text-lg">{t('filters.noResults')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((plant) => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </div>
      {hasMore && (
        <div ref={sentinelRef} className="py-8 text-center text-sm text-muted">
          Loading more...
        </div>
      )}
    </>
  );
}
