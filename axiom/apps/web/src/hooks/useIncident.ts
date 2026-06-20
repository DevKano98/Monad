import { useQuery } from "@tanstack/react-query";

import { getIncidents } from "../services/incident.service";

export function useIncident() {
  return useQuery({ queryKey: ["incidents"], queryFn: getIncidents });
}
