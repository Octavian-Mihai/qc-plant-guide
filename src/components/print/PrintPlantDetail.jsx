import { forwardRef } from 'react';
import { getZoneDisplay } from '../../utils/plantHelpers';

/** Print-optimized plant detail layout. */
const PrintPlantDetail = forwardRef(function PrintPlantDetail({ plant, description }, ref) {
  if (!plant) return null;
  return (
    <div ref={ref} className="p-8 text-black">
      <h1 className="text-2xl font-bold">{plant.name}</h1>
      <p className="italic text-gray-600">{plant.scientificName}</p>
      <p className="mt-4 leading-relaxed">{description}</p>
      <table className="mt-6 w-full border-collapse text-sm">
        <tbody>
          <tr><td className="border p-2 font-semibold">Zones</td><td className="border p-2">{getZoneDisplay(plant.hardinessZone)}</td></tr>
          <tr><td className="border p-2 font-semibold">Height</td><td className="border p-2">{plant.heightCmMin}–{plant.heightCmMax} cm</td></tr>
          <tr><td className="border p-2 font-semibold">Sun</td><td className="border p-2">{plant.sunRequirements}</td></tr>
          <tr><td className="border p-2 font-semibold">Water</td><td className="border p-2">{plant.waterNeeds}</td></tr>
          <tr><td className="border p-2 font-semibold">Cost</td><td className="border p-2">${plant.costCad} CAD</td></tr>
        </tbody>
      </table>
    </div>
  );
});

export default PrintPlantDetail;
