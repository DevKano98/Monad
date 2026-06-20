import type { Reputation } from "../../types";

export function ReputationCard({ reputation }: { reputation: Reputation }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="text-sm text-slate-500">{reputation.wallet_address}</div>
      <div className="mt-2 text-3xl font-semibold">{reputation.total_score}</div>
      <div className="mt-2 text-sm text-slate-500">
        {reputation.successful_fixes} successful / {reputation.failed_fixes} failed
      </div>
    </div>
  );
}
