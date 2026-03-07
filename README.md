# @sudobility/svgr_client

API client SDK for SVGR with TanStack React Query hooks.

## Installation

```bash
bun add @sudobility/svgr_client
```

## Usage

```typescript
import { SvgrClient, useConvert } from "@sudobility/svgr_client";

// Direct client usage
const client = new SvgrClient({ baseUrl: "https://api.svgr.app", networkClient });
const result = await client.convert(base64Image, "photo.png", 5, true);

// React hook usage
const { mutateAsync } = useConvert(client);
await mutateAsync({ original: base64Image, filename: "photo.png", quality: 5 });
```

## API

### SvgrClient

Constructed with `{ baseUrl, networkClient, retry? }`. Single endpoint: `POST /api/v1/convert`.

### Hooks

- `useConvert(client)` -- TanStack Query mutation for image-to-SVG conversion
- `svgrKeys` -- Query key factory for cache management

### Types

- `SvgrClientConfig`, `RetryConfig`, `ConvertMutationParams`, `SvgrApiError`

## Development

```bash
bun run build        # Build ESM
bun test             # Run tests
bun run verify       # All checks + build
```

## Related Packages

- `svgr_types` -- Shared type definitions
- `svgr_lib` -- Shared business logic
- `svgr_api` -- Backend API server
- `svgr_app` -- Web app
- `svgr_app_rn` -- React Native app

## License

BUSL-1.1
