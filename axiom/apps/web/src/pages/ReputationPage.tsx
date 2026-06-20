import { useState } from "react";

import { ReputationCard } from "../components/cards/ReputationCard";
import { ReputationLeaderboard } from "../components/lists/ReputationLeaderboard";
import { useReputation } from "../hooks/useReputation";

export function ReputationPage() {
  const [wallet, setWallet] = useState("");
  const reputation = useReputation(wallet);

  return (
    <div className="grid gap-6">
      <input
        className="h-10 w-96 rounded-md border border-slate-300 px-3 dark:border-slate-700 dark:bg-slate-900"
        value={wallet}
        onChange={(event) => setWallet(event.target.value)}
        aria-label="Wallet address"
      />
      {reputation.data ? <ReputationCard reputation={reputation.data} /> : <ReputationLeaderboard />}
    </div>
  );
}
