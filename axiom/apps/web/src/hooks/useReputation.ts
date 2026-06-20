import { useQuery } from "@tanstack/react-query";

import { getReputation } from "../services/reputation.service";

export function useReputation(walletAddress: string) {
  return useQuery({
    queryKey: ["reputation", walletAddress],
    queryFn: () => getReputation(walletAddress),
    enabled: walletAddress.length > 0
  });
}
