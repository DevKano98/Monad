import type { Reputation } from "../../types";

export function ReputationCard({ reputation }: { reputation: Reputation }) {
  return (
    <div className="rounded-[28px] border border-black/5 bg-white/85 p-5 shadow-[0_18px_50px_rgba(17,24,39,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03]">
      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Wallet</div>
      <div className="mt-2 break-all text-sm text-slate-600 dark:text-slate-300">{reputation.wallet_address}</div>
      <div className="mt-4 text-5xl font-semibold tracking-[-0.05em] text-ink dark:text-white">{reputation.total_score}</div>
      <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">
        {reputation.successful_fixes} successful / {reputation.failed_fixes} failed
      </div>
    </div>
  );
}
