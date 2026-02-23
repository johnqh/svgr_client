# Improvement Plans for @sudobility/svgr_client

## Priority 1 - High Impact
### 1. Add JSDoc to All Exports
- Document SvgrClient class, SvgrClientConfig, SvgrApiError
- Add @example blocks for useConvert hook usage
- Document query key factory
### 2. Update CLAUDE.md API Documentation
- EntityClientConfig now uses NetworkClient, not getAuthToken
- convert() takes individual params, not a ConvertRequest object

## Priority 2 - Medium Impact
### 3. Add Progress Tracking
- Conversion can take time for large files
- Add progress callback support to SvgrClient.convert()
- Expose progress state in useConvert hook
### 4. Add Retry Logic
- Network failures during conversion should retry
- Add configurable retry count and backoff

## Priority 3 - Nice to Have
### 5. Add Batch Conversion Support
- Convert multiple files in one operation
- Parallel upload with progress tracking
### 6. Add Response Caching
- Cache successful conversions by file hash
- Avoid re-converting identical files
