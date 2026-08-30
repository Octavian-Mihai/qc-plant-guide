import { forwardRef } from 'react';

/** Print-optimized monthly calendar. */
const PrintCalendar = forwardRef(function PrintCalendar({ calendar, plantName }, ref) {
  return (
    <div ref={ref} className="p-8 text-black">
      <h1 className="text-xl font-bold">{plantName} — Planting Calendar</h1>
      <table className="mt-4 w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border p-2 text-left">Month</th>
            <th className="border p-2 text-left">Tasks</th>
          </tr>
        </thead>
        <tbody>
          {calendar?.map(({ month, tasks }) => (
            <tr key={month}>
              <td className="border p-2 font-semibold">{month}</td>
              <td className="border p-2">{tasks.join('; ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default PrintCalendar;
