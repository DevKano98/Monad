import type { Incident } from "../../types";

export function IncidentCard({ incident }: { incident: Incident }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex justify-between gap-4">
        <h3 className="font-semibold">{incident.title}</h3>
        <span className="text-sm text-slate-500">{incident.status}</span>
      </div>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{incident.description}</p>
    </div>
  );
}
