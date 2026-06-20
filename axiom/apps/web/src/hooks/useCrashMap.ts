import { useQuery } from "@tanstack/react-query";

import { getCrashMap } from "../services/map.service";

export function useCrashMap() {
  return useQuery({ queryKey: ["crash-map"], queryFn: getCrashMap });
}
