import { CrashMap } from "../components/map/CrashMap";
import { useCrashMap } from "../hooks/useCrashMap";

export function MapPage() {
  const map = useCrashMap();

  return (
    <div className="grid gap-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Crash map</h1>
          <p className="mt-1 text-sm text-slate-500">Approximate ingest locations plotted from backend POST responses and live feed updates.</p>
        </div>
        <div className="text-sm text-slate-500">{map.data?.length ?? 0} active signals</div>
      </div>
      <CrashMap points={map.data ?? []} />
    </div>
  );
}
