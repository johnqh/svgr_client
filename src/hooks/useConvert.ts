import { useMutation } from "@tanstack/react-query";
import type { SvgrClient } from "../network/SvgrClient";

export function useConvert(client: SvgrClient) {
  return useMutation({
    mutationFn: ({
      original,
      filename,
      quality,
    }: {
      original: string;
      filename?: string;
      quality?: number;
    }) => client.convert(original, filename, quality),
  });
}
