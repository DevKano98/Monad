import { useQuery } from "@tanstack/react-query";

import { getFeed } from "../services/feed.service";

export function useFeed() {
  return useQuery({ queryKey: ["feed"], queryFn: getFeed });
}
