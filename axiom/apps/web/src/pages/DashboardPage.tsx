import { FeedList } from "../components/lists/FeedList";
import { ReputationLeaderboard } from "../components/lists/ReputationLeaderboard";
import { useFeed } from "../hooks/useFeed";
import { useIncident } from "../hooks/useIncident";

export function DashboardPage() {
  const feed = useFeed();
  const incidents = useIncident();

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
    </div>
  );
}
