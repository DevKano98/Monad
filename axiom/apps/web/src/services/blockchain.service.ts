import { request } from "./api";

export function publishFingerprint(payload: {
  hash: string;
  language: string;
  framework: string;
  severity: string;
}) {
  return request<{ tx_hash: string }>("/blockchain/publish-fingerprint", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
