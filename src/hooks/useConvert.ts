import { useMutation } from '@tanstack/react-query';
import type { SvgrClient } from '../network/SvgrClient';

export function useConvert(client: SvgrClient) {
  return useMutation({
    mutationFn: ({
      original,
      filename,
    }: {
      original: string;
      filename?: string;
    }) => client.convert(original, filename),
  });
}
