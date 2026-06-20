import { useMutation } from "@tanstack/react-query";

import { FeedList } from "../components/lists/FeedList";
import { useFeed } from "../hooks/useFeed";
import { publishFingerprint } from "../services/blockchain.service";

export function FeedPage() {
  const feed = useFeed();
  const publish = useMutation({
    mutationFn: () =>
      publishFingerprint({
        hash: "redis-timeout-node18-redis72",
        language: "nodejs",
        framework: "express",
        severity: "high"
      })
  });

  if (feed.isLoading) {
    return <div className="text-slate-500 dark:text-slate-400">Loading global feed...</div>;
  }
  if (feed.isError) {
    return <div className="text-red-600">Unable to load feed.</div>;
  }
  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center rounded-full border border-black/5 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#494fdf] shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            Global feed
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-ink dark:text-white">Global failure feed</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Published fingerprints from the shared backend, presented as a control room list instead of a plain table.
          </p>
        </div>
        <button
          className="inline-flex h-11 items-center rounded-full bg-[#494fdf] px-4 text-sm font-medium text-white shadow-[0_16px_36px_rgba(73,79,223,0.28)] transition-opacity disabled:opacity-50"
          disabled={publish.isPending}
          onClick={() => publish.mutate()}
        >
          Publish Redis sample
        </button>
      </div>
      <FeedList fingerprints={feed.data ?? []} />
    </div>
  );
}
