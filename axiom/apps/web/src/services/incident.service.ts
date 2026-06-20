import { request } from "./api";
import { isMockDataEnabled } from "./api";
import { MOCK_INCIDENTS } from "../data/mock";
import type { Incident } from "../types";

export async function getIncidents() {
  try {
    const incidents = await request<Incident[]>("/incidents");
    if (incidents.length === 0 && isMockDataEnabled()) {
      return MOCK_INCIDENTS;
    }
    return incidents;
  } catch (error) {
    if (isMockDataEnabled()) {
      return MOCK_INCIDENTS;
    }
    throw error;
  }
}

export function createIncident(payload: Pick<Incident, "title" | "description" | "severity" | "status">) {
  return request<Incident>("/incidents", { method: "POST", body: JSON.stringify(payload) });
}
