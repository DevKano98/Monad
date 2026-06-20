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
    return <div className="text-slate-500">Loading global feed...</div>;
  }
  if (feed.isError) {
    return <div className="text-red-600">Unable to load feed.</div>;
  }
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Global failure feed</h1>
        <button
          className="rounded-md bg-signal px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
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
