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
  error_type: string;
  language: string;
  framework: string;
  severity: Severity;
  match_count: number;
  latitude?: number | null;
  longitude?: number | null;
  region?: string | null;
  country?: string | null;
  blast_radius: number;
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
  onchain_fix_id?: number | null;
  upvotes: number;
  downvotes: number;
  reputation_score: number;
  monad_tx_hash?: string;
  created_at: string;
  updated_at: string;
}

export interface CrashMapPoint {
  id: string;
  fingerprint_id: string;
  fingerprint_hash: string;
  error_type: string;
  severity: Severity;
  match_count: number;
  known_fix_count: number;
  latitude?: number | null;
  longitude?: number | null;
  region: string;
  country?: string | null;
  blast_radius: number;
  monad_tx_hash?: string | null;
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
