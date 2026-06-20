import type { Fingerprint } from "../../types";

export function FeedCard({ fingerprint }: { fingerprint: Fingerprint }) {
  return (
    <article className="rounded-md border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold">{fingerprint.error_type}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {fingerprint.language} / {fingerprint.framework}
          </p>
          <p className="mt-1 font-mono text-xs text-slate-500">{fingerprint.hash}</p>
        </div>
        <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-caution dark:bg-amber-950">
          {fingerprint.severity}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>{fingerprint.match_count} matches</span>
        <span>{fingerprint.monad_tx_hash ?? "Pending Monad receipt"}</span>
      </div>
    </article>
  );
}
