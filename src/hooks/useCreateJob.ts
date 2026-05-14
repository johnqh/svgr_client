import { useMutation } from "@tanstack/react-query";
import type { CreateJobRequest } from "@sudobility/svgr_types";
import type { SvgrClient } from "../network/SvgrClient";

export function useCreateJob(client: SvgrClient) {
  return useMutation({
    mutationFn: (request: CreateJobRequest) => client.createJob(request),
  });
}
