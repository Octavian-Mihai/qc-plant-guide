import { useDraggable } from '@dnd-kit/core';
import useStore from '../../store/useStore';
import { useTranslation } from '../../i18n/useTranslation';
import { getPlantName } from '../../utils/plantHelpers';

const CATEGORY_EMOJI = {
  tree: '🌳',
  shrub: '🌿',
  perennial: '🌸',
  fruit: '🍎',
  berry: '🫐',
  vine: '🌱',
  groundcover: '🍃',
  evergreen: '🌲',
  vegetable: '🌽',
  annual: '🌻',
};

function getPlantEmoji(plant) {
  const tag = plant.tags?.find((t) => CATEGORY_EMOJI[t]);
  return CATEGORY_EMOJI[tag] || '🌱';
}

function DraggablePlant({ plant }) {
  const { locale } = useTranslation();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${plant.id}`,
    data: { plantId: plant.id },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex cursor-grab items-center gap-2 rounded-lg border border-forest/10 p-2 text-sm transition hover:bg-cream active:cursor-grabbing dark:border-forest/20 dark:text-darkbg-text dark:hover:bg-darkbg ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <span className="text-lg">{getPlantEmoji(plant)}</span>
      <span className="truncate font-medium">{getPlantName(plant, locale)}</span>
    </div>
  );
}

/** Searchable draggable plant list for garden planner. */
export default function PlantPalette({ search, onSearchChange }) {
  const { locale } = useTranslation();
  const filteredPlants = useStore((s) => s.filteredPlants);
  const query = search.toLowerCase();
  const plants = query
    ? filteredPlants.filter((p) =>
        getPlantName(p, locale).toLowerCase().includes(query)
        || p.name.toLowerCase().includes(query)
        || (p.nameFr || '').toLowerCase().includes(query)
      )
    : filteredPlants.slice(0, 20);

  return (
    <div className="card h-full">
      <input
        type="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search plants..."
        className="mb-3 w-full rounded-lg border border-forest/20 px-3 py-2 text-sm dark:border-forest/30 dark:bg-darkbg dark:text-darkbg-text"
      />
      <div className="max-h-96 space-y-1 overflow-y-auto">
        {plants.map((plant) => (
          <DraggablePlant key={plant.id} plant={plant} />
        ))}
      </div>
    </div>
  );
}

export { getPlantEmoji };
