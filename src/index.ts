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
export {
  useConvert,
  useUploadImage,
  useCreateJob,
  useJobStatus,
  useImageJobs,
  useUserImages,
  useCommunities,
  svgrKeys,
} from "./hooks";
export type { ConvertMutationParams } from "./hooks/useConvert";

// Re-export types for convenience
export type {
  Community,
  CommunityPlatform,
  CommunitiesResponse,
  ConvertRequest,
  ConvertResult,
  ConvertResponse,
  BaseResponse,
  CreateJobRequest,
  CreateJobResponse,
  ImageType,
  ImageUploadResult,
  ImageUploadResponse,
  ImageWithJobs,
  ImageListResponse,
  JobListResponse,
  JobResult,
  JobStatus,
  JobStatusResponse,
} from "@sudobility/svgr_types";
export { IMAGE_TYPES, COMMUNITY_PLATFORMS } from "@sudobility/svgr_types";
