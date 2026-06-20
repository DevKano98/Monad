import type { Incident } from "../../types";

export function IncidentTable({ incidents }: { incidents: Incident[] }) {
  return (
    <div className="overflow-hidden rounded-[32px] border border-black/5 bg-white/85 shadow-[0_18px_50px_rgba(17,24,39,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03]">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50/90 text-slate-500 dark:bg-white/[0.03]">
          <tr>
            <th className="px-5 py-4 font-semibold uppercase tracking-[0.22em]">Incident</th>
            <th className="px-5 py-4 font-semibold uppercase tracking-[0.22em]">Severity</th>
            <th className="px-5 py-4 font-semibold uppercase tracking-[0.22em]">Status</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr key={incident.id} className="border-t border-slate-100/90 dark:border-white/10">
              <td className="px-5 py-4 font-medium text-ink dark:text-white">{incident.title}</td>
              <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{incident.severity}</td>
              <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{incident.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
