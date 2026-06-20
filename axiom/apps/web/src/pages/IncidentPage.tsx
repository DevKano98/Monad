import { IncidentTable } from "../components/tables/IncidentTable";
import { useIncident } from "../hooks/useIncident";

export function IncidentPage() {
  const incidents = useIncident();

  if (incidents.isLoading) {
    return <div className="text-slate-500">Loading incidents...</div>;
  }
  if (incidents.isError) {
    return <div className="text-red-600">Unable to load incidents.</div>;
  }
  return <IncidentTable incidents={incidents.data ?? []} />;
}
