// Network
export {
  SvgrClient,
  SvgrApiError,
  type SvgrClientConfig,
} from "./network/SvgrClient";

// Hooks
export { useConvert, svgrKeys } from "./hooks";

// Re-export types for convenience
export type {
  ConvertRequest,
  ConvertResult,
  ConvertResponse,
  BaseResponse,
} from "@sudobility/svgr_types";
