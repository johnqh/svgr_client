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
│   ├── SvgrClient.ts            # HTTP client class
│   └── SvgrClient.test.ts       # Client tests
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

HTTP client constructed with `{ baseUrl, getToken }`:
- `baseUrl` -- API server URL (e.g., `https://api.svgr.app`)
- `getToken` -- async callback that returns a Bearer token (or null for anonymous)
- `convert(request)` -- POSTs to `/api/v1/convert` with Bearer auth, sends `ConvertRequest`, returns `ConvertResponse`

### useConvert Hook

TanStack Query `useMutation` wrapper around `SvgrClient.convert()`. Returns standard mutation object with `mutate`/`mutateAsync`.

### Query Keys

`svgrKeys` factory for cache key management.

## Peer Dependencies

- `react` ^18 || ^19
- `@tanstack/react-query` ^5

## Direct Dependencies

- `@sudobility/svgr_types` -- shared API contract types

## Architecture

```
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

- **`SvgrClient` class** is constructed with `{ baseUrl, getToken }` where `getToken` is an async function returning a Bearer token (or null for anonymous access)
- **`useConvert` mutation hook** wraps `SvgrClient.convert()` using TanStack React Query's `useMutation`
- **`svgrKeys` query key factory** provides consistent cache keys for React Query
- **`SvgrApiError`** extends `Error` with a `status` code property for HTTP error handling
- Only one API endpoint is used: `POST /api/v1/convert`
- ESM-only build output (no CJS)

## Gotchas

- **`getToken` is optional** -- anonymous conversion is allowed. When `getToken` returns null or is not provided, requests are sent without an Authorization header.
- **Throws `SvgrApiError` on HTTP errors** -- consumers must catch this specific error type to get the HTTP status code. A generic `Error` catch will miss the `status` property.
- **Only one endpoint** -- `POST /api/v1/convert`. Credit/consumable endpoints are handled by a separate consumables client, not this package.
- **`exactOptionalPropertyTypes`** is enabled in tsconfig -- be careful with optional properties (cannot assign `undefined` to optional fields without explicitly including `undefined` in the type).
- Peer dependencies on React 18/19 and TanStack React Query 5 -- consumers must provide these.

## Testing

- **Command**: `bun test` (runs Vitest)
- Tests are in `src/network/SvgrClient.test.ts` and `src/hooks/query-keys.test.ts`
- Client tests verify HTTP request formation, auth header inclusion, and error handling
- Query key tests verify the key factory produces correct cache keys
- Mock `fetch` for client tests rather than hitting a real server
