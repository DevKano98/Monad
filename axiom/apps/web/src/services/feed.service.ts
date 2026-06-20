import { request } from "./api";
import { isMockDataEnabled } from "./api";
import { MOCK_FINGERPRINTS } from "../data/mock";
import type { Fingerprint } from "../types";

export async function getFeed() {
  try {
    const feed = await request<Fingerprint[]>("/feed");
    if (feed.length === 0 && isMockDataEnabled()) {
      return MOCK_FINGERPRINTS;
    }
    return feed;
  } catch (error) {
    if (isMockDataEnabled()) {
      return MOCK_FINGERPRINTS;
    }
    throw error;
  }
}
