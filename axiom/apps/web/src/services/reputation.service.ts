import { request } from "./api";
import type { Reputation } from "../types";

export function getReputation(walletAddress: string) {
  return request<Reputation>(`/reputation/${walletAddress}`);
}
