import { IncidentTable } from "../components/tables/IncidentTable";
import { useIncident } from "../hooks/useIncident";

export function IncidentPage() {
  const incidents = useIncident();

  if (incidents.isLoading) {
    return <div className="text-slate-500 dark:text-slate-400">Loading incidents...</div>;
  }
  if (incidents.isError) {
    return <div className="text-red-600">Unable to load incidents.</div>;
  }
  return (
    <div className="grid gap-4">
      <div>
        <div className="inline-flex items-center rounded-full border border-black/5 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#494fdf] shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          Incidents
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-ink dark:text-white">Open incidents</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Active issues, severity, and resolution state shown in a denser operational view.
        </p>
      </div>
      <IncidentTable incidents={incidents.data ?? []} />
    </div>
  );
}
