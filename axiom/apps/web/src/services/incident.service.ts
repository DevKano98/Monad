import { request } from "./api";
import type { Incident } from "../types";

export function getIncidents() {
  return request<Incident[]>("/incidents");
}

export function createIncident(payload: Pick<Incident, "title" | "description" | "severity" | "status">) {
  return request<Incident>("/incidents", { method: "POST", body: JSON.stringify(payload) });
}
