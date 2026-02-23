# SVGR Client

API client SDK for SVGR with React Query hooks.

**npm**: `@sudobility/svgr_client` (public)

## Tech Stack

- **Language**: TypeScript (very strict: `exactOptionalPropertyTypes`)
- **Runtime**: Bun
- **Package Manager**: Bun (do not use npm/yarn/pnpm for installing dependencies)
- **Build**: TypeScript compiler (ESM)
- **Test**: Vitest
- **React**: React 18/19
- **Data Fetching**: TanStack React Query 5

## Project Structure

```
src/
├── index.ts                     # Main exports
├── network/
│   ├── SvgrClient.ts            # HTTP client class with retry support
│   └── SvgrClient.test.ts       # Client tests (including retry tests)
└── hooks/
    ├── index.ts                 # Hook exports
    ├── useConvert.ts            # useMutation wrapper for convert
    ├── query-keys.ts            # Query key factory
    └── query-keys.test.ts       # Query key tests
```

## Commands

```bash
bun run build        # Build to dist/
bun run clean        # Remove dist/
bun run dev          # Watch mode
bun test             # Run tests
bun run lint         # Run ESLint
bun run typecheck    # TypeScript check
bun run verify       # All checks + build (use before commit)
```

## Key Concepts

### SvgrClient

HTTP client constructed with `SvgrClientConfig`:
- `baseUrl` -- API server URL (e.g., `https://api.svgr.app`)
- `networkClient` -- a `NetworkClient` from `@sudobility/types` that handles authentication and HTTP communication
- `retry` -- optional `RetryConfig` for automatic retry with exponential backoff
- `convert(original, filename?, quality?, transparentBg?)` -- POSTs to `/api/v1/convert`, returns `BaseResponse<ConvertResult>`

### RetryConfig

Optional retry configuration for failed network requests:
- `maxRetries` -- maximum number of retry attempts (e.g., 3)
- `baseDelayMs` -- base delay in ms before first retry (e.g., 1000). Uses exponential backoff: `baseDelayMs * 2^attempt`
- `retryableStatuses` -- HTTP status codes to retry on (defaults to `[408, 429, 500, 502, 503, 504]`)

### useConvert Hook

TanStack Query `useMutation` wrapper around `SvgrClient.convert()`. Accepts a `ConvertMutationParams` object with `{ original, filename?, quality?, transparentBg? }`. Returns standard mutation object with `mutate`/`mutateAsync`.

### Query Keys

`svgrKeys` factory for cache key management:
- `svgrKeys.all` -- `["svgr"]` base key for all SVGR queries
- `svgrKeys.convert()` -- `["svgr", "convert"]` key for conversion queries

## Exports

### Classes
- `SvgrClient` -- HTTP client for SVGR API
- `SvgrApiError` -- Error class with HTTP `status` property

### Hooks
- `useConvert` -- TanStack Query mutation hook for conversions
- `svgrKeys` -- Query key factory

### Types
- `SvgrClientConfig` -- Configuration for `SvgrClient` constructor
- `RetryConfig` -- Retry configuration for failed requests
- `ConvertMutationParams` -- Parameters for the `useConvert` mutation

### Re-exports from `@sudobility/svgr_types`
- `ConvertRequest`, `ConvertResult`, `ConvertResponse`, `BaseResponse`

## Peer Dependencies

- `@sudobility/types` ^1.9.54 -- provides `NetworkClient` interface
- `react` ^18 || ^19
- `@tanstack/react-query` ^5

## Direct Dependencies

- `@sudobility/svgr_types` -- shared API contract types

## Architecture

```
@sudobility/types (NetworkClient)
    ^
    |
svgr_types
    ^
    |
svgr_client (this package)
    ^
    |
svgr_lib, svgr_app, svgr_app_rn
```

## Related Projects

- **svgr_types** (`/Users/johnhuang/projects/svgr_types`) -- Shared type definitions; this package imports `ConvertRequest`, `ConvertResult`, `ConvertResponse`
- **svgr_api** (`/Users/johnhuang/projects/svgr_api`) -- The backend server this client calls
- **svgr_lib** (`/Users/johnhuang/projects/svgr_lib`) -- Shared business logic; depends on this package for API calls via `useConvert`
- **svgr_app** (`/Users/johnhuang/projects/svgr_app`) -- Web app; uses this package directly and via svgr_lib
- **svgr_app_rn** (`/Users/johnhuang/projects/svgr_app_rn`) -- React Native app; uses this package directly and via svgr_lib

## Coding Patterns

- **`SvgrClient` class** is constructed with `{ baseUrl, networkClient, retry? }` where `networkClient` is a `NetworkClient` from `@sudobility/types` that handles authentication headers and request serialization
- **`convert()` takes individual parameters** -- `convert(original, filename?, quality?, transparentBg?)`, not a `ConvertRequest` object
- **`useConvert` mutation hook** wraps `SvgrClient.convert()` using TanStack React Query's `useMutation`, accepting a `ConvertMutationParams` object
- **`svgrKeys` query key factory** provides consistent cache keys for React Query
- **`SvgrApiError`** extends `Error` with a `status` code property for HTTP error handling
- **Retry with exponential backoff** -- optional `RetryConfig` on `SvgrClientConfig` enables automatic retries for transient failures
- Only one API endpoint is used: `POST /api/v1/convert`
- ESM-only build output (no CJS)

## Gotchas

- **Uses `NetworkClient`, not `getToken`** -- authentication is handled by the `NetworkClient` implementation, not by this package. The old `getToken` pattern is no longer used.
- **`convert()` takes individual params, not a request object** -- the method signature is `convert(original, filename?, quality?, transparentBg?)`, not `convert(request: ConvertRequest)`.
- **Throws `SvgrApiError` on HTTP errors** -- consumers must catch this specific error type to get the HTTP status code. A generic `Error` catch will miss the `status` property.
- **Only one endpoint** -- `POST /api/v1/convert`. Credit/consumable endpoints are handled by a separate consumables client, not this package.
- **`exactOptionalPropertyTypes`** is enabled in tsconfig -- be careful with optional properties (cannot assign `undefined` to optional fields without explicitly including `undefined` in the type).
- Peer dependencies on React 18/19, TanStack React Query 5, and `@sudobility/types` -- consumers must provide these.
- **`removeComments: true`** in tsconfig -- JSDoc comments are stripped from the JS output but preserved in `.d.ts` declaration files.

## Testing

- **Command**: `bun test` (runs Vitest)
- Tests are in `src/network/SvgrClient.test.ts` and `src/hooks/query-keys.test.ts`
- Client tests verify HTTP request formation, error handling, and retry behavior
- Query key tests verify the key factory produces correct cache keys
- Uses `MockNetworkClient` from `@sudobility/di/mocks` for mocking HTTP requests
