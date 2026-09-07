import { useQuery } from "@tanstack/react-query";
import type { SvgrClient } from "../network/SvgrClient.js";
import { svgrKeys } from "./query-keys.js";

export function useUserImages(client: SvgrClient, enabled = true) {
  return useQuery({
    queryKey: [...svgrKeys.all, "images"] as const,
    queryFn: () => client.getUserImages(),
    enabled,
  });
}
