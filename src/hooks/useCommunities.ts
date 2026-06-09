import { useQuery } from "@tanstack/react-query";
import type { SvgrClient } from "../network/SvgrClient";
import { svgrKeys } from "./query-keys";

export function useCommunities(
  client: SvgrClient,
  language: string,
  enabled = true,
) {
  return useQuery({
    queryKey: svgrKeys.communities(language),
    queryFn: () => client.getCommunities(language),
    enabled,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}
