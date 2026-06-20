import { request } from "./api";
import type { CrashMapPoint } from "../types";

export function getCrashMap() {
  return request<CrashMapPoint[]>("/map/crashes");
}
