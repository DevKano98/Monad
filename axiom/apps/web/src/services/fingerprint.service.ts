import { request } from "./api";
import type { Fingerprint } from "../types";

export function getFingerprints() {
  return request<Fingerprint[]>("/fingerprints");
}
