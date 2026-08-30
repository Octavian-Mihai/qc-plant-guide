import { useDroppable } from '@dnd-kit/core';
import useStore from '../../store/useStore';
import { getPlantEmoji } from './PlantPalette';

function GridCell({ row, col, plantId, span, isOvercrowded, onSelect, isSelected }) {
  const { setNodeRef, isOver } = useDroppable({ id: `cell-${row}-${col}`, data: { row, col } });
  const plants = useStore((s) => s.plants);
  const plant = plantId ? plants.find((p) => p.id === plantId) : null;

  return (
    <div
      ref={setNodeRef}
      onClick={() => onSelect(row, col)}
      className={`relative flex min-h-[60px] items-center justify-center rounded border text-xs text-forest-dark transition dark:text-darkbg-text ${
        isOver ? 'border-forest bg-forest/10 dark:bg-forest/20' : 'border-forest/20 dark:border-forest/30'
      } ${isOvercrowded ? 'bg-red-100 dark:bg-red-900/30' : 'bg-white dark:bg-darkbg'} ${
        isSelected ? 'ring-2 ring-forest' : ''
      }`}
      style={{ gridColumn: span > 1 ? `span ${span}` : undefined, gridRow: span > 1 ? `span ${span}` : undefined }}
      role="gridcell"
      aria-label={plant ? plant.name : `Cell ${row + 1}, ${col + 1}`}
    >
      {plant && (
        <div className="text-center">
          <span className="text-lg">{getPlantEmoji(plant)}</span>
          <p className="truncate px-1">{plant.name.slice(0, 10)}</p>
        </div>
      )}
    </div>
  );
}

/** CSS grid garden bed with drag-drop cells. */
export default function GardenBedGrid({ layout, overcrowdedCells, selectedCell, onSelectCell, rows, cols }) {
  const getCell = (row, col) => layout.cells.find((c) => c.row === row && c.col === col);

  return (
    <div
      className="grid gap-1"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      role="grid"
      aria-label="Garden bed grid"
    >
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
          const cell = getCell(row, col);
          const key = `${row}-${col}`;
          return (
            <GridCell
              key={key}
              row={row}
              col={col}
              plantId={cell?.plantId || null}
              span={1}
              isOvercrowded={overcrowdedCells.has(key)}
              onSelect={onSelectCell}
              isSelected={selectedCell?.row === row && selectedCell?.col === col}
            />
          );
        })
      )}
    </div>
  );
}
