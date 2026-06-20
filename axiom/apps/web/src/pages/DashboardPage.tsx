import { FeedList } from "../components/lists/FeedList";
import { ReputationLeaderboard } from "../components/lists/ReputationLeaderboard";
import { CrashMap } from "../components/map/CrashMap";
import { useCrashMap } from "../hooks/useCrashMap";
import { useFeed } from "../hooks/useFeed";
import { useIncident } from "../hooks/useIncident";

export function DashboardPage() {
  const feed = useFeed();
  const incidents = useIncident();
  const crashMap = useCrashMap();

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[28px] border border-black/5 bg-white/85 p-5 shadow-[0_18px_50px_rgba(17,24,39,0.06)] dark:border-white/10 dark:bg-white/[0.03]">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Published fingerprints</div>
          <div className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-ink dark:text-white">{feed.data?.length ?? 0}</div>
        </div>
        <div className="rounded-[28px] border border-black/5 bg-white/85 p-5 shadow-[0_18px_50px_rgba(17,24,39,0.06)] dark:border-white/10 dark:bg-white/[0.03]">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Open incidents</div>
          <div className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-ink dark:text-white">{incidents.data?.length ?? 0}</div>
        </div>
        <div className="rounded-[28px] border border-[#494fdf]/10 bg-gradient-to-br from-[#494fdf] to-[#3a40c4] p-5 text-white shadow-[0_18px_50px_rgba(73,79,223,0.32)]">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">Monad network</div>
          <div className="mt-3 text-4xl font-semibold tracking-[-0.04em]">Testnet</div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <FeedList fingerprints={feed.data ?? []} />
        <ReputationLeaderboard />
      </section>

      <section className="rounded-[32px] border border-black/5 bg-white/85 p-5 shadow-[0_18px_50px_rgba(17,24,39,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03]">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold tracking-[-0.02em] text-ink dark:text-white">Realtime crash map</h2>
            <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">Approximate ingest locations from the shared backend feed.</p>
          </div>
          <span className="rounded-full border border-black/5 bg-slate-50 px-3 py-1 text-sm text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
            {crashMap.data?.length ?? 0} points
          </span>
        </div>
        <CrashMap points={crashMap.data ?? []} compact />
      </section>
    </div>
  );
}
