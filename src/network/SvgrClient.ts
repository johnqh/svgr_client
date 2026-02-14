import type { BaseResponse, ConvertResult } from "@sudobility/svgr_types";

export interface SvgrClientConfig {
  baseUrl: string;
  getToken?: () => Promise<string | null>;
}

export class SvgrApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "SvgrApiError";
  }
}

export class SvgrClient {
  private baseUrl: string;
  private getToken: (() => Promise<string | null>) | undefined;

  constructor(config: SvgrClientConfig) {
    this.baseUrl = config.baseUrl;
    this.getToken = config.getToken;
  }

  async convert(
    original: string,
    filename?: string,
    quality?: number,
    transparentBg?: boolean,
  ): Promise<BaseResponse<ConvertResult>> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.getToken) {
      const token = await this.getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${this.baseUrl}/api/v1/convert`, {
      method: "POST",
      headers,
      body: JSON.stringify({ original, filename, quality, transparentBg }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new SvgrApiError(
        response.status,
        (error as { error?: string }).error || "Conversion failed",
      );
    }

    return response.json();
  }
}
