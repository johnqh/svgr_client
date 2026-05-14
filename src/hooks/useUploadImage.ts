import { useMutation } from "@tanstack/react-query";
import type { SvgrClient } from "../network/SvgrClient";

export function useUploadImage(client: SvgrClient) {
  return useMutation({
    mutationFn: (
      file: File | { buffer: ArrayBuffer; filename: string; mimeType: string },
    ) => client.uploadImage(file),
  });
}
