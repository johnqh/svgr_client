/**
 * @module @sudobility/svgr_client
 *
 * API client SDK for SVGR with React Query hooks.
 *
 * Provides a typed HTTP client ({@link SvgrClient}) for calling the SVGR
 * image-to-SVG conversion API, along with TanStack Query hooks ({@link useConvert})
 * for seamless React integration.
 *
 * @example
 * ```typescript
 * import { SvgrClient, useConvert, svgrKeys } from '@sudobility/svgr_client';
 * ```
 */

// Network
export {
  SvgrClient,
  SvgrApiError,
  type SvgrClientConfig,
  type RetryConfig,
} from "./network/SvgrClient";

// Hooks
export { useConvert, svgrKeys } from "./hooks";
export type { ConvertMutationParams } from "./hooks/useConvert";

// Re-export types for convenience
export type {
  ConvertRequest,
  ConvertResult,
  ConvertResponse,
  BaseResponse,
} from "@sudobility/svgr_types";
