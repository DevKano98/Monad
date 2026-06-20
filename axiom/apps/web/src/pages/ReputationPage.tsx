import { useState } from "react";

import { ReputationCard } from "../components/cards/ReputationCard";
import { ReputationLeaderboard } from "../components/lists/ReputationLeaderboard";
import { useReputation } from "../hooks/useReputation";

export function ReputationPage() {
  const [wallet, setWallet] = useState("");
  const reputation = useReputation(wallet);

  return (
    <div className="grid gap-6">
      <div>
        <div className="inline-flex items-center rounded-full border border-black/5 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#494fdf] shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          Reputation
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-ink dark:text-white">Wallet reputation</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Inspect trust score history for a wallet or fall back to the leaderboard when no address is selected.
        </p>
      </div>
      <input
        className="h-12 w-full max-w-xl rounded-full border border-black/10 bg-white px-4 text-sm text-ink shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-[#494fdf] dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
        value={wallet}
        onChange={(event) => setWallet(event.target.value)}
        aria-label="Wallet address"
        placeholder="Paste a wallet address"
      />
      {reputation.data ? <ReputationCard reputation={reputation.data} /> : <ReputationLeaderboard />}
    </div>
  );
}
