import { request } from "./api";
import type { Fingerprint } from "../types";

export function getFeed() {
  return request<Fingerprint[]>("/feed");
}
