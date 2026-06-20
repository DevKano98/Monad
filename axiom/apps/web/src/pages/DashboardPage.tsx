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
      <section className="grid grid-cols-3 gap-4">
        <div className="rounded-md bg-white p-4 dark:bg-slate-900">
          <div className="text-sm text-slate-500">Published fingerprints</div>
          <div className="mt-2 text-3xl font-semibold">{feed.data?.length ?? 0}</div>
        </div>
        <div className="rounded-md bg-white p-4 dark:bg-slate-900">
          <div className="text-sm text-slate-500">Open incidents</div>
          <div className="mt-2 text-3xl font-semibold">{incidents.data?.length ?? 0}</div>
        </div>
        <div className="rounded-md bg-white p-4 dark:bg-slate-900">
          <div className="text-sm text-slate-500">Monad network</div>
          <div className="mt-2 text-3xl font-semibold">Testnet</div>
        </div>
      </section>
      <section className="grid grid-cols-[1fr_360px] gap-6">
        <FeedList fingerprints={feed.data ?? []} />
        <ReputationLeaderboard />
      </section>
      <section className="rounded-md border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold">Realtime crash map</h2>
            <p className="text-sm text-slate-500">Approximate ingest locations from the shared backend feed.</p>
          </div>
          <span className="text-sm text-slate-500">{crashMap.data?.length ?? 0} points</span>
        </div>
        <CrashMap points={crashMap.data ?? []} compact />
      </section>
    </div>
  );
}
