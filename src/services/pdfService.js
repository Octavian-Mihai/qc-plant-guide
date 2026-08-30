/**
 * PDF export service using jsPDF and jspdf-autotable.
 */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/** @typedef {import('../types').Plant} Plant */
/** @typedef {import('../types').GardenLayout} GardenLayout */

/**
 * @param {Plant} plant
 * @param {string} description
 */
export function exportPlantDetailPDF(plant, description) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(plant.name, 14, 20);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(plant.scientificName, 14, 28);
  doc.setTextColor(0);

  const lines = doc.splitTextToSize(description, 180);
  doc.text(lines, 14, 38);

  autoTable(doc, {
    startY: 38 + lines.length * 6 + 4,
    head: [['Attribute', 'Value']],
    body: [
      ['Zones', plant.hardinessZone.join(', ')],
      ['Height', `${plant.heightCmMin}–${plant.heightCmMax} cm`],
      ['Sun', plant.sunRequirements],
      ['Water', plant.waterNeeds],
      ['Soil', plant.soilPreference.join(', ')],
      ['Cost', `$${plant.costCad} CAD`],
    ],
  });

  doc.save(`${plant.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
}

/**
 * @param {{ month: string; tasks: string[] }[]} calendar
 * @param {string} plantName
 */
export function exportCalendarPDF(calendar, plantName) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`${plantName} — Planting Calendar`, 14, 20);

  autoTable(doc, {
    startY: 28,
    head: [['Month', 'Tasks']],
    body: calendar.map(({ month, tasks }) => [month, tasks.join('; ')]),
  });

  doc.save(`${plantName.replace(/\s+/g, '-').toLowerCase()}-calendar.pdf`);
}

/**
 * @param {Plant[]} plants
 * @param {string} title
 */
export function exportShoppingListPDF(plants, title = 'Shopping List') {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(title, 14, 20);

  autoTable(doc, {
    startY: 28,
    head: [['Plant', 'Zones', 'Est. Cost']],
    body: plants.map((p) => [p.name, p.hardinessZone.join(', '), `$${p.costCad}`]),
  });

  const total = plants.reduce((sum, p) => sum + p.costCad, 0);
  doc.text(`Total: $${total} CAD`, 14, doc.lastAutoTable.finalY + 10);
  doc.save('shopping-list.pdf');
}

/**
 * @param {GardenLayout} layout
 * @param {Plant[]} plants
 * @param {number} gridSize
 */
export function exportGardenLayoutPDF(layout, plants, gridSize) {
  const doc = new jsPDF('landscape');
  const [rows, cols] = layout.bedSize === '4x4' ? [4, 4] : layout.bedSize === '4x8' ? [4, 8] : [8, 8];
  const cellW = 240 / cols;
  const cellH = 120 / rows;

  doc.setFontSize(14);
  doc.text(`${layout.name} (${layout.bedSize})`, 14, 15);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = layout.cells.find((cl) => cl.row === r && cl.col === c);
      const plant = cell?.plantId ? plants.find((p) => p.id === cell.plantId) : null;
      const x = 14 + c * cellW;
      const y = 22 + r * cellH;
      doc.rect(x, y, cellW - 2, cellH - 2);
      if (plant) {
        doc.setFontSize(7);
        doc.text(plant.name.slice(0, 12), x + 2, y + cellH / 2);
      }
    }
  }

  const placedIds = [...new Set(layout.cells.filter((c) => c.plantId).map((c) => c.plantId))];
  const placed = placedIds.map((id) => plants.find((p) => p.id === id)).filter(Boolean);

  autoTable(doc, {
    startY: 22 + rows * cellH + 8,
    head: [['Plant', 'Spacing']],
    body: placed.map((p) => [p.name, `${p.spacingCm} cm`]),
  });

  doc.save(`${layout.name.replace(/\s+/g, '-').toLowerCase()}-garden.pdf`);
}

/**
 * @param {Plant[]} plants
 */
export function exportComparePDF(plants) {
  const doc = new jsPDF('landscape');
  doc.setFontSize(14);
  doc.text('Plant Comparison', 14, 15);

  const rows = ['Height', 'Zones', 'Sun', 'Water', 'Deer Resistant', 'Cost'];
  autoTable(doc, {
    startY: 22,
    head: [['Attribute', ...plants.map((p) => p.name.slice(0, 15))]],
    body: [
      ['Height', ...plants.map((p) => `${p.heightCmMin}-${p.heightCmMax}cm`)],
      ['Zones', ...plants.map((p) => p.hardinessZone.join(','))],
      ['Sun', ...plants.map((p) => p.sunRequirements)],
      ['Water', ...plants.map((p) => p.waterNeeds)],
      ['Deer Resistant', ...plants.map((p) => (p.deerResistant ? 'Yes' : 'No'))],
      ['Cost', ...plants.map((p) => `$${p.costCad}`)],
    ],
  });

  doc.save('plant-comparison.pdf');
}
