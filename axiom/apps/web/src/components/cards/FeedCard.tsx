import type { Fingerprint } from "../../types";

export function FeedCard({ fingerprint }: { fingerprint: Fingerprint }) {
  return (
    <article className="rounded-[28px] border border-black/5 bg-white/85 p-5 shadow-[0_18px_50px_rgba(17,24,39,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold tracking-[-0.01em] text-ink dark:text-white">{fingerprint.error_type}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {fingerprint.language} / {fingerprint.framework}
          </p>
          <p className="mt-2 font-mono text-xs text-slate-500 dark:text-slate-400">{fingerprint.hash}</p>
        </div>
        <span className="rounded-full bg-[#ec7e00]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#c26600] dark:text-[#ffbb70]">
          {fingerprint.severity}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{fingerprint.match_count} matches</span>
        <span>{fingerprint.monad_tx_hash ?? "Pending Monad receipt"}</span>
      </div>
    </article>
  );
}
