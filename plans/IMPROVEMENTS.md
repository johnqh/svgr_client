# Improvement Plans for @sudobility/svgr_client

## Priority 1 - High Impact
### 1. Add JSDoc to All Exports ✅
- Document SvgrClient class, SvgrClientConfig, SvgrApiError
- Add @example blocks for useConvert hook usage
- Document query key factory
- Added JSDoc with @example blocks to: SvgrClient, SvgrClientConfig, SvgrApiError, useConvert, ConvertMutationParams, svgrKeys, RetryConfig
- Added module-level JSDoc to index.ts
### 2. Update CLAUDE.md API Documentation ✅
- EntityClientConfig now uses NetworkClient, not getAuthToken
- convert() takes individual params, not a ConvertRequest object
- Updated Key Concepts, Coding Patterns, Gotchas, and Exports sections
- Added RetryConfig documentation
- Fixed outdated getToken references throughout

## Priority 2 - Medium Impact
### 3. Add Progress Tracking
- Conversion can take time for large files
- Add progress callback support to SvgrClient.convert()
- Expose progress state in useConvert hook
- **Status**: Skipped -- requires architectural changes to NetworkClient interface (progress callbacks not supported by the platform-agnostic NetworkClient from @sudobility/types)
### 4. Add Retry Logic ✅
- Network failures during conversion should retry
- Add configurable retry count and backoff
- Implemented RetryConfig with maxRetries, baseDelayMs, and retryableStatuses
- Uses exponential backoff: baseDelayMs * 2^attempt
- Default retryable statuses: [408, 429, 500, 502, 503, 504]
- Non-retryable status codes (e.g. 400, 401, 403) fail immediately
- Added tests for retry behavior

## Priority 3 - Nice to Have
### 5. Add Batch Conversion Support
- Convert multiple files in one operation
- Parallel upload with progress tracking
- **Status**: Skipped -- requires new API endpoint on svgr_api and architectural changes across multiple packages
### 6. Add Response Caching
- Cache successful conversions by file hash
- Avoid re-converting identical files
- **Status**: Skipped -- requires file hashing infrastructure and cache storage strategy; TanStack Query already provides query-level caching for consumers
