import { FeedCard } from "../cards/FeedCard";
import type { Fingerprint } from "../../types";

export function FeedList({ fingerprints }: { fingerprints: Fingerprint[] }) {
  if (fingerprints.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 p-8 text-center text-slate-500">
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
