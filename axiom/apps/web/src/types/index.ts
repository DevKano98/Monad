export type Severity = "critical" | "high" | "medium" | "low";

export interface Incident {
  id: string;
  title: string;
  description?: string;
  severity: Severity;
  status: "open" | "investigating" | "resolved";
  created_at: string;
  updated_at: string;
}

export interface Fingerprint {
  id: string;
  incident_id: string;
  hash: string;
  language: string;
  framework: string;
  severity: Severity;
  monad_tx_hash?: string;
  created_at: string;
  updated_at: string;
}

export interface Fix {
  id: string;
  fingerprint_id: string;
  title: string;
  description: string;
  wallet_address: string;
  upvotes: number;
  downvotes: number;
  reputation_score: number;
  monad_tx_hash?: string;
  created_at: string;
  updated_at: string;
}

export interface Reputation {
  id: string;
  wallet_address: string;
  total_score: number;
  successful_fixes: number;
  failed_fixes: number;
  updated_at: string;
}
