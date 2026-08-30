import { forwardRef } from 'react';
import { getZoneDisplay } from '../../utils/plantHelpers';

/** Print-optimized shopping list. */
const PrintShoppingList = forwardRef(function PrintShoppingList({ plants, title = 'Shopping List' }, ref) {
  const total = plants.reduce((sum, p) => sum + p.costCad, 0);
  return (
    <div ref={ref} className="p-8 text-black">
      <h1 className="text-xl font-bold">{title}</h1>
      <table className="mt-4 w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border p-2 text-left">Plant</th>
            <th className="border p-2 text-left">Zones</th>
            <th className="border p-2 text-right">Est. Cost</th>
          </tr>
        </thead>
        <tbody>
          {plants.map((p) => (
            <tr key={p.id}>
              <td className="border p-2">{p.name}</td>
              <td className="border p-2">{getZoneDisplay(p.hardinessZone)}</td>
              <td className="border p-2 text-right">${p.costCad}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2} className="border p-2 font-bold">Total</td>
            <td className="border p-2 text-right font-bold">${total} CAD</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
});

export default PrintShoppingList;
