import type { NetworkClient } from "@sudobility/types";
import type { BaseResponse, ConvertResult } from "@sudobility/svgr_types";

/**
 * Configuration for creating an {@link SvgrClient} instance.
 *
 * @interface SvgrClientConfig
 * @property {string} baseUrl - The base URL of the SVGR API server (e.g., `https://api.svgr.app`)
 * @property {NetworkClient} networkClient - A platform-agnostic HTTP client from `@sudobility/types`
 *   that handles authentication headers and request serialization
 *
 * @example
 * ```typescript
 * const config: SvgrClientConfig = {
 *   baseUrl: 'https://api.svgr.app',
 *   networkClient: myNetworkClient,
 * };
 * const client = new SvgrClient(config);
 * ```
 */
export interface SvgrClientConfig {
  /** The base URL of the SVGR API server (e.g., `https://api.svgr.app`) */
  baseUrl: string;
  /** Platform-agnostic HTTP client that handles auth and serialization */
  networkClient: NetworkClient;
  /**
   * Optional retry configuration for failed requests.
   * When provided, the client will retry failed network requests
   * using exponential backoff.
   */
  retry?: RetryConfig;
}

/**
 * Configuration for automatic retry of failed network requests.
 *
 * @interface RetryConfig
 * @property {number} maxRetries - Maximum number of retry attempts (default: 3)
 * @property {number} baseDelayMs - Base delay in milliseconds before first retry (default: 1000).
 *   Subsequent retries use exponential backoff: `baseDelayMs * 2^attempt`.
 * @property {number[]} [retryableStatuses] - HTTP status codes that should trigger a retry.
 *   Defaults to [408, 429, 500, 502, 503, 504].
 *
 * @example
 * ```typescript
 * const retryConfig: RetryConfig = {
 *   maxRetries: 3,
 *   baseDelayMs: 1000,
 *   retryableStatuses: [429, 500, 502, 503, 504],
 * };
 * ```
 */
export interface RetryConfig {
  /** Maximum number of retry attempts (default: 3) */
  maxRetries: number;
  /** Base delay in milliseconds before first retry (default: 1000) */
  baseDelayMs: number;
  /** HTTP status codes that should trigger a retry. Defaults to [408, 429, 500, 502, 503, 504] */
  retryableStatuses?: number[];
}

/** Default HTTP status codes considered retryable */
const DEFAULT_RETRYABLE_STATUSES = [408, 429, 500, 502, 503, 504];

/**
 * Error thrown when the SVGR API returns a non-successful HTTP response.
 *
 * Extends the built-in `Error` class with an HTTP `status` code property,
 * allowing consumers to differentiate between different error types.
 *
 * @extends Error
 * @property {number} status - The HTTP status code from the API response
 * @property {string} message - Human-readable error description
 * @property {string} name - Always `"SvgrApiError"` for type identification
 *
 * @example
 * ```typescript
 * try {
 *   await client.convert(imageData);
 * } catch (error) {
 *   if (error instanceof SvgrApiError) {
 *     console.error(`API error ${error.status}: ${error.message}`);
 *     if (error.status === 429) {
 *       // Handle rate limiting
 *     }
 *   }
 * }
 * ```
 */
export class SvgrApiError extends Error {
  constructor(
    /** The HTTP status code from the API response */
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "SvgrApiError";
  }
}

/**
 * HTTP client for the SVGR image-to-SVG conversion API.
 *
 * Provides a typed interface for calling the SVGR conversion endpoint.
 * Uses a platform-agnostic `NetworkClient` for HTTP communication,
 * making it usable in both web and React Native environments.
 *
 * @example
 * ```typescript
 * import { SvgrClient } from '@sudobility/svgr_client';
 *
 * const client = new SvgrClient({
 *   baseUrl: 'https://api.svgr.app',
 *   networkClient: myNetworkClient,
 * });
 *
 * const response = await client.convert(base64Image, 'logo.png', 7, true);
 * console.log(response.data?.svg);
 * ```
 *
 * @example
 * ```typescript
 * // With retry configuration
 * const client = new SvgrClient({
 *   baseUrl: 'https://api.svgr.app',
 *   networkClient: myNetworkClient,
 *   retry: { maxRetries: 3, baseDelayMs: 1000 },
 * });
 * ```
 */
export class SvgrClient {
  private readonly baseUrl: string;
  private readonly networkClient: NetworkClient;
  private readonly retryConfig: RetryConfig | undefined;

  constructor(config: SvgrClientConfig) {
    this.baseUrl = config.baseUrl;
    this.networkClient = config.networkClient;
    this.retryConfig = config.retry;
  }

  /**
   * Convert a raster image to SVG format.
   *
   * Sends a POST request to `/api/v1/convert` with the image data and
   * optional conversion parameters. Returns a `BaseResponse<ConvertResult>`
   * containing the SVG string and original image dimensions on success.
   *
   * @param original - Base64-encoded raster image data (PNG, JPG, WEBP, BMP, or GIF)
   * @param filename - Optional filename for metadata or audit purposes
   * @param quality - Conversion quality level from 1 to 10 (1 = smallest, 10 = highest fidelity). Default: 5
   * @param transparentBg - If true, removes the background from the SVG. Default: false
   * @returns A promise resolving to a `BaseResponse<ConvertResult>` with the SVG output
   * @throws {SvgrApiError} When the API returns a non-successful response (includes HTTP status code)
   *
   * @example
   * ```typescript
   * const response = await client.convert(
   *   'data:image/png;base64,...',
   *   'logo.png',
   *   7,
   *   true,
   * );
   * if (response.success && response.data) {
   *   console.log(response.data.svg);    // SVG string
   *   console.log(response.data.width);  // Original width in px
   *   console.log(response.data.height); // Original height in px
   * }
   * ```
   */
  async convert(
    original: string,
    filename?: string,
    quality?: number,
    transparentBg?: boolean,
  ): Promise<BaseResponse<ConvertResult>> {
    const makeRequest = () =>
      this.networkClient.post<BaseResponse<ConvertResult>>(
        `${this.baseUrl}/api/v1/convert`,
        {
          original,
          filename,
          quality,
          transparentBg,
        },
        { timeout: 30000 },
      );

    const response = this.retryConfig
      ? await this.withRetry(makeRequest, this.retryConfig)
      : await makeRequest();

    if (!response.ok || !response.data) {
      const errorData = response.data as { error?: string } | null | undefined;
      throw new SvgrApiError(
        response.status,
        errorData?.error || "Conversion failed",
      );
    }

    return response.data;
  }

  /**
   * Execute a request function with exponential backoff retry.
   *
   * @param fn - The async function to retry
   * @param config - Retry configuration
   * @returns The result of the successful request
   * @throws The last error encountered after all retries are exhausted
   */
  private async withRetry<T>(
    fn: () => Promise<{ ok: boolean; status: number } & T>,
    config: RetryConfig,
  ): Promise<{ ok: boolean; status: number } & T> {
    const retryableStatuses =
      config.retryableStatuses ?? DEFAULT_RETRYABLE_STATUSES;

    let response = await fn();

    for (let attempt = 0; attempt < config.maxRetries; attempt++) {
      if (response.ok || !retryableStatuses.includes(response.status)) {
        return response;
      }

      const delay = config.baseDelayMs * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));

      response = await fn();
    }

    return response;
  }
}
