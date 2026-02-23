import { useMutation } from "@tanstack/react-query";
import type { SvgrClient } from "../network/SvgrClient";

/**
 * Parameters for the {@link useConvert} mutation hook.
 *
 * @interface ConvertMutationParams
 * @property {string} original - Base64-encoded raster image data (PNG, JPG, WEBP, BMP, or GIF)
 * @property {string} [filename] - Optional filename for metadata or audit purposes
 * @property {number} [quality] - Conversion quality level from 1 to 10. Default: 5
 * @property {boolean} [transparentBg] - If true, removes the background from the SVG. Default: false
 */
export interface ConvertMutationParams {
  /** Base64-encoded raster image data (PNG, JPG, WEBP, BMP, or GIF) */
  original: string;
  /** Optional filename for metadata or audit purposes */
  filename?: string;
  /** Conversion quality level from 1 to 10 (1 = smallest, 10 = highest fidelity). Default: 5 */
  quality?: number;
  /** If true, removes the background from the SVG. Default: false */
  transparentBg?: boolean;
}

/**
 * TanStack Query mutation hook for converting raster images to SVG.
 *
 * Wraps {@link SvgrClient.convert} in a `useMutation` hook, providing
 * loading state, error handling, and cache integration via TanStack Query.
 *
 * @param client - An initialized {@link SvgrClient} instance
 * @returns A TanStack Query mutation result object with `mutate`, `mutateAsync`,
 *   `isPending`, `isError`, `data`, `error`, and other standard mutation properties
 *
 * @example
 * ```tsx
 * import { useConvert } from '@sudobility/svgr_client';
 *
 * function ConvertButton({ client }: { client: SvgrClient }) {
 *   const convert = useConvert(client);
 *
 *   const handleConvert = () => {
 *     convert.mutate({
 *       original: base64ImageData,
 *       filename: 'logo.png',
 *       quality: 7,
 *       transparentBg: true,
 *     });
 *   };
 *
 *   if (convert.isPending) return <p>Converting...</p>;
 *   if (convert.isError) return <p>Error: {convert.error.message}</p>;
 *   if (convert.data?.data) return <div>{convert.data.data.svg}</div>;
 *
 *   return <button onClick={handleConvert}>Convert</button>;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Using mutateAsync for async/await flow
 * const convert = useConvert(client);
 * try {
 *   const result = await convert.mutateAsync({ original: imageData });
 *   console.log(result.data?.svg);
 * } catch (error) {
 *   if (error instanceof SvgrApiError) {
 *     console.error(`HTTP ${error.status}: ${error.message}`);
 *   }
 * }
 * ```
 */
export function useConvert(client: SvgrClient) {
  return useMutation({
    mutationFn: ({
      original,
      filename,
      quality,
      transparentBg,
    }: ConvertMutationParams) =>
      client.convert(original, filename, quality, transparentBg),
  });
}
