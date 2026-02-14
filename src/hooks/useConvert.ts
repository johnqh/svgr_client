import { useMutation } from "@tanstack/react-query";
import type { SvgrClient } from "../network/SvgrClient";

export function useConvert(client: SvgrClient) {
  return useMutation({
    mutationFn: ({
      original,
      filename,
      quality,
      transparentBg,
    }: {
      original: string;
      filename?: string;
      quality?: number;
      transparentBg?: boolean;
    }) => client.convert(original, filename, quality, transparentBg),
  });
}
