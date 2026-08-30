import { useState, useCallback, useMemo } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import useStore from '../../store/useStore';
import { useTranslation } from '../../i18n/useTranslation';
import PlantPalette, { getPlantEmoji } from './PlantPalette';
import GardenBedGrid from './GardenBedGrid';
import SpacingCalculator from './SpacingCalculator';
import CompanionHints from './CompanionHints';
import { getBedDimensions, getCellSpan, getCompanionStatus, CELL_SIZE_CM } from '../../utils/plantHelpers';
import { exportGardenLayoutPDF } from '../../services/pdfService';

/** @typedef {import('../../types').GardenLayout} GardenLayout */
/** @typedef {import('../../types').GardenBedSize} GardenBedSize */

function createEmptyLayout(bedSize, name) {
  const { rows, cols } = getBedDimensions(bedSize);
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ row: r, col: c, plantId: null });
    }
  }
  const now = new Date().toISOString();
  return { id: crypto.randomUUID(), name, bedSize, cells, createdAt: now, updatedAt: now };
}

/** Garden layout planner with drag-drop grid. */
export default function GardenPlanner() {
  const { t } = useTranslation();
  const plants = useStore((s) => s.plants);
  const gardenLayouts = useStore((s) => s.gardenLayouts);
  const saveGardenLayout = useStore((s) => s.saveGardenLayout);
  const deleteGardenLayout = useStore((s) => s.deleteGardenLayout);
  const activeLayoutId = useStore((s) => s.activeLayoutId);
  const setActiveLayoutId = useStore((s) => s.setActiveLayoutId);

  const [bedSize, setBedSize] = useState(/** @type {GardenBedSize} */ ('4x4'));
  const [layout, setLayout] = useState(() => createEmptyLayout('4x4', t('garden.defaultName')));
  const [paletteSearch, setPaletteSearch] = useState('');
  const [selectedCell, setSelectedCell] = useState(null);
  const [activeDragPlant, setActiveDragPlant] = useState(null);
  const [hints, setHints] = useState([]);

  const { rows, cols } = getBedDimensions(layout.bedSize);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const selectedPlant = useMemo(() => {
    if (!selectedCell) return null;
    const cell = layout.cells.find((c) => c.row === selectedCell.row && c.col === selectedCell.col);
    return cell?.plantId ? plants.find((p) => p.id === cell.plantId) : null;
  }, [selectedCell, layout.cells, plants]);

  const overcrowdedCells = useMemo(() => {
    const overcrowded = new Set();
    layout.cells.forEach((cell) => {
      if (!cell.plantId) return;
      const plant = plants.find((p) => p.id === cell.plantId);
      if (!plant) return;
      const span = getCellSpan(plant.spacingCm, CELL_SIZE_CM);
      for (let dr = 0; dr < span; dr++) {
        for (let dc = 0; dc < span; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = cell.row + dr;
          const nc = cell.col + dc;
          const neighbor = layout.cells.find((c) => c.row === nr && c.col === nc);
          if (neighbor?.plantId && neighbor.plantId !== cell.plantId) {
            overcrowded.add(`${cell.row}-${cell.col}`);
            overcrowded.add(`${nr}-${nc}`);
          }
        }
      }
    });
    return overcrowded;
  }, [layout.cells, plants]);

  const checkCompanionHints = useCallback((row, col, plantId) => {
    const placed = plants.find((p) => p.id === plantId);
    if (!placed) return;
    const newHints = [];
    const neighbors = [
      [row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1],
    ];
    neighbors.forEach(([nr, nc]) => {
      const neighbor = layout.cells.find((c) => c.row === nr && c.col === nc);
      if (!neighbor?.plantId) return;
      const status = getCompanionStatus(neighbor.plantId, plants, placed);
      const neighborPlant = plants.find((p) => p.id === neighbor.plantId);
      if (status !== 'neutral' && neighborPlant) {
        newHints.push({
          status,
          message: status === 'good'
            ? t('garden.goodCompanion', { a: placed.name, b: neighborPlant.name })
            : t('garden.badCompanion', { a: placed.name, b: neighborPlant.name }),
        });
      }
    });
    setHints(newHints);
  }, [layout.cells, plants, t]);

  const handleDragEnd = (event) => {
    setActiveDragPlant(null);
    const { active, over } = event;
    if (!over || !active.data.current?.plantId) return;

    const match = String(over.id).match(/^cell-(\d+)-(\d+)$/);
    if (!match) return;

    const row = Number(match[1]);
    const col = Number(match[2]);
    const plantId = active.data.current.plantId;

    setLayout((prev) => ({
      ...prev,
      cells: prev.cells.map((c) =>
        c.row === row && c.col === col ? { ...c, plantId } : c
      ),
      updatedAt: new Date().toISOString(),
    }));
    checkCompanionHints(row, col, plantId);
    setSelectedCell({ row, col });
  };

  const handleBedSizeChange = (size) => {
    setBedSize(size);
    setLayout(createEmptyLayout(size, layout.name));
    setHints([]);
  };

  const handleSave = () => {
    const name = window.prompt(t('garden.savePrompt'), layout.name);
    if (!name) return;
    const toSave = { ...layout, name, updatedAt: new Date().toISOString() };
    setLayout(toSave);
    saveGardenLayout(toSave);
  };

  const handleLoad = (layoutId) => {
    const saved = gardenLayouts.find((l) => l.id === layoutId);
    if (saved) {
      setLayout(saved);
      setBedSize(saved.bedSize);
      setActiveLayoutId(saved.id);
      setHints([]);
    }
  };

  const handleExportPDF = () => {
    exportGardenLayoutPDF(layout, plants, CELL_SIZE_CM);
  };

  const handleClearCell = () => {
    if (!selectedCell) return;
    setLayout((prev) => ({
      ...prev,
      cells: prev.cells.map((c) =>
        c.row === selectedCell.row && c.col === selectedCell.col ? { ...c, plantId: null } : c
      ),
    }));
    setHints([]);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="section-title">{t('garden.title')}</h1>
          <p className="mt-1 text-forest/70 dark:text-darkbg-muted">{t('garden.subtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={handleSave} className="btn-secondary">{t('garden.save')}</button>
          <button type="button" onClick={handleExportPDF} className="btn-secondary">{t('print.exportPdf')}</button>
          {selectedCell && (
            <button type="button" onClick={handleClearCell} className="btn-secondary">{t('garden.clearCell')}</button>
          )}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(['4x4', '4x8', '8x8']).map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => handleBedSizeChange(size)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              bedSize === size ? 'filter-chip-active' : 'filter-chip'
            }`}
          >
            {size} ({t('garden.bed')})
          </button>
        ))}
      </div>

      {gardenLayouts.length > 0 && (
        <div className="mb-4">
          <label htmlFor="load-layout" className="label-text mr-2">{t('garden.load')}</label>
          <select
            id="load-layout"
            value={activeLayoutId || ''}
            onChange={(e) => handleLoad(e.target.value)}
            className="rounded-lg border border-forest/20 px-3 py-2 text-sm dark:border-forest/30 dark:bg-darkbg dark:text-darkbg-text"
          >
            <option value="">{t('garden.selectLayout')}</option>
            {gardenLayouts.map((l) => (
              <option key={l.id} value={l.id}>{l.name} ({l.bedSize})</option>
            ))}
          </select>
          {activeLayoutId && (
            <button
              type="button"
              onClick={() => deleteGardenLayout(activeLayoutId)}
              className="ml-2 text-sm text-red-500 underline"
            >
              {t('garden.delete')}
            </button>
          )}
        </div>
      )}

      <DndContext
        sensors={sensors}
        onDragStart={(e) => {
          const plantId = e.active.data.current?.plantId;
          setActiveDragPlant(plantId ? plants.find((p) => p.id === plantId) : null);
        }}
        onDragEnd={handleDragEnd}
      >
        <div className="grid gap-6 lg:grid-cols-[280px_1fr_240px]">
          <PlantPalette search={paletteSearch} onSearchChange={setPaletteSearch} />

          <div className="card">
            <h2 className="mb-3 font-semibold">{layout.name} — {layout.bedSize}</h2>
            <GardenBedGrid
              layout={layout}
              overcrowdedCells={overcrowdedCells}
              selectedCell={selectedCell}
              onSelectCell={setSelectedCell}
              rows={rows}
              cols={cols}
            />
            {overcrowdedCells.size > 0 && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{t('garden.overcrowded')}</p>
            )}
          </div>

          <div className="space-y-4">
            <SpacingCalculator plant={selectedPlant} />
            <CompanionHints hints={hints} />
          </div>
        </div>

        <DragOverlay>
          {activeDragPlant && (
            <div className="rounded-lg border border-forest/20 bg-white p-2 shadow-lg dark:border-forest/30 dark:bg-darkbg-card dark:text-darkbg-text">
              <span className="text-lg">{getPlantEmoji(activeDragPlant)}</span>
              <span className="ml-2 text-sm">{activeDragPlant.name}</span>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
