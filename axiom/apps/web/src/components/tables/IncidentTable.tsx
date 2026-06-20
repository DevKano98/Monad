import type { Incident } from "../../types";

export function IncidentTable({ incidents }: { incidents: Incident[] }) {
  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800">
          <tr>
            <th className="px-4 py-3">Incident</th>
            <th className="px-4 py-3">Severity</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr key={incident.id} className="border-t border-slate-100 dark:border-slate-800">
              <td className="px-4 py-3">{incident.title}</td>
              <td className="px-4 py-3">{incident.severity}</td>
              <td className="px-4 py-3">{incident.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
