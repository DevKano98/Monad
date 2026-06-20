import { FeedCard } from "../cards/FeedCard";
import type { Fingerprint } from "../../types";

export function FeedList({ fingerprints }: { fingerprints: Fingerprint[] }) {
  if (fingerprints.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-black/10 bg-white/70 p-8 text-center text-slate-500 shadow-[0_18px_50px_rgba(17,24,39,0.04)] dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400">
        No fingerprints published yet.
      </div>
    );
  }
  return (
    <div className="grid gap-3">
      {fingerprints.map((fingerprint) => (
        <FeedCard key={fingerprint.id} fingerprint={fingerprint} />
      ))}
    </div>
  );
}
