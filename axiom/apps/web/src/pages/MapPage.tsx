import { CrashMap } from "../components/map/CrashMap";
import { useCrashMap } from "../hooks/useCrashMap";

export function MapPage() {
  const map = useCrashMap();
  const signalCount = map.data?.length ?? 0;

  return (
    <div className="grid gap-6">
      <section className="relative overflow-hidden rounded-[32px] border border-black/5 bg-white/85 p-6 shadow-[0_24px_80px_rgba(17,24,39,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03] lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(73,79,223,0.14),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(230,30,73,0.1),_transparent_24%)] dark:bg-[radial-gradient(circle_at_top_right,_rgba(73,79,223,0.22),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(230,30,73,0.14),_transparent_24%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_auto] lg:items-end">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-[#494fdf]/15 bg-[#494fdf]/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#494fdf] dark:border-white/10 dark:bg-white/[0.04] dark:text-white/80">
              Spatial telemetry
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-ink dark:text-white lg:text-6xl">
              Crash map
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 lg:text-lg">
              Approximate ingest locations plotted from backend POST responses and live feed updates. The map is unchanged; the framing now puts the signal on a proper stage.
            </p>
          </div>
          <div className="grid min-w-[220px] gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-2xl border border-black/5 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Signals</div>
              <div className="mt-2 text-2xl font-semibold text-ink dark:text-white">{signalCount}</div>
            </div>
            <div className="rounded-2xl border border-black/5 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Coverage</div>
              <div className="mt-2 text-2xl font-semibold text-ink dark:text-white">Global</div>
            </div>
            <div className="rounded-2xl border border-black/5 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Mode</div>
              <div className="mt-2 text-2xl font-semibold text-ink dark:text-white">Live</div>
            </div>
          </div>
        </div>
      </section>

      <CrashMap points={map.data ?? []} />
    </div>
  );
}
