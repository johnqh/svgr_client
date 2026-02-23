import type { NetworkClient } from "@sudobility/types";
import type { BaseResponse, ConvertResult } from "@sudobility/svgr_types";

export interface SvgrClientConfig {
  baseUrl: string;
  networkClient: NetworkClient;
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
  private readonly baseUrl: string;
  private readonly networkClient: NetworkClient;

  constructor(config: SvgrClientConfig) {
    this.baseUrl = config.baseUrl;
    this.networkClient = config.networkClient;
  }

  async convert(
    original: string,
    filename?: string,
    quality?: number,
    transparentBg?: boolean,
  ): Promise<BaseResponse<ConvertResult>> {
    const response = await this.networkClient.post<BaseResponse<ConvertResult>>(
      `${this.baseUrl}/api/v1/convert`,
      {
        original,
        filename,
        quality,
        transparentBg,
      },
    );

    if (!response.ok || !response.data) {
      const errorData = response.data as { error?: string } | null | undefined;
      throw new SvgrApiError(
        response.status,
        errorData?.error || "Conversion failed",
      );
    }

    return response.data;
  }
}
