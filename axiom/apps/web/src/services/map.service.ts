import { request } from "./api";
import { isMockDataEnabled } from "./api";
import { MOCK_CRASH_MAP_POINTS } from "../data/mock";
import type { CrashMapPoint } from "../types";

export async function getCrashMap() {
  try {
    const points = await request<CrashMapPoint[]>("/map/crashes");
    if (points.length === 0 && isMockDataEnabled()) {
      return MOCK_CRASH_MAP_POINTS;
    }
    return points;
  } catch (error) {
    if (isMockDataEnabled()) {
      return MOCK_CRASH_MAP_POINTS;
    }
    throw error;
  }
}
