/**
 * Query key factory for SVGR-related TanStack Query cache keys.
 *
 * Provides a hierarchical key structure for consistent cache invalidation.
 * All keys are `as const` tuples for type-safe query key matching.
 *
 * @example
 * ```typescript
 * import { svgrKeys } from '@sudobility/svgr_client';
 * import { useQueryClient } from '@tanstack/react-query';
 *
 * const queryClient = useQueryClient();
 *
 * // Invalidate all SVGR-related queries
 * queryClient.invalidateQueries({ queryKey: svgrKeys.all });
 *
 * // Invalidate only convert-related queries
 * queryClient.invalidateQueries({ queryKey: svgrKeys.convert() });
 * ```
 */
export const svgrKeys = {
  /** Base key for all SVGR queries: `["svgr"]` */
  all: ["svgr"] as const,
  /** Key for conversion queries: `["svgr", "convert"]` */
  convert: () => [...svgrKeys.all, "convert"] as const,
};
