import { useQuery } from "@tanstack/react-query";
import type { SvgrClient } from "../network/SvgrClient";
import { svgrKeys } from "./query-keys";

export function useImageJobs(client: SvgrClient, imageId: string | null) {
  return useQuery({
    queryKey: svgrKeys.imageJobs(imageId ?? ""),
    queryFn: () => client.getJobsForImage(imageId ?? ""),
    enabled: !!imageId,
  });
}
