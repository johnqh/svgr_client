import type { BaseResponse, ConvertResult } from '@sudobility/svgr_types';

export interface SvgrClientConfig {
  baseUrl: string;
}

export class SvgrApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'SvgrApiError';
  }
}

export class SvgrClient {
  private baseUrl: string;

  constructor(config: SvgrClientConfig) {
    this.baseUrl = config.baseUrl;
  }

  async convert(
    original: string,
    filename?: string,
  ): Promise<BaseResponse<ConvertResult>> {
    const response = await fetch(`${this.baseUrl}/api/v1/convert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ original, filename }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: 'Unknown error' }));
      throw new SvgrApiError(
        response.status,
        (error as { error?: string }).error || 'Conversion failed',
      );
    }

    return response.json();
  }
}
