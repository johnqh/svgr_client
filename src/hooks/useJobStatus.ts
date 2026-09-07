import { useQuery } from "@tanstack/react-query";
import type { SvgrClient } from "../network/SvgrClient.js";
import { svgrKeys } from "./query-keys.js";

export function useJobStatus(client: SvgrClient, jobId: string | null) {
  return useQuery({
    queryKey: svgrKeys.job(jobId ?? ""),
    queryFn: () => client.getJobStatus(jobId ?? ""),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data?.data?.status;
      if (status === "done" || status === "error") return false;
      return 2500;
    },
  });
}
