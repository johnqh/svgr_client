import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SvgrClient, SvgrApiError } from './SvgrClient';

describe('SvgrClient', () => {
  let client: SvgrClient;

  beforeEach(() => {
    client = new SvgrClient({ baseUrl: 'http://localhost:3001' });
    vi.restoreAllMocks();
  });

  it('sends POST request to /api/v1/convert', async () => {
    const mockResponse = {
      success: true,
      data: { svg: '<svg/>', width: 100, height: 100 },
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }),
    );

    const result = await client.convert('base64data', 'test.png');
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3001/api/v1/convert',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  });

  it('includes filename in request body when provided', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      }),
    );

    await client.convert('data', 'photo.png');
    const body = JSON.parse(
      (vi.mocked(fetch).mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body).toEqual({ original: 'data', filename: 'photo.png' });
  });

  it('throws SvgrApiError on non-ok response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Bad request' }),
      }),
    );

    await expect(client.convert('bad')).rejects.toThrow(SvgrApiError);
    await expect(client.convert('bad')).rejects.toThrow('Bad request');
  });

  it('handles non-JSON error responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('not json')),
      }),
    );

    await expect(client.convert('bad')).rejects.toThrow(SvgrApiError);
  });
});

describe('SvgrApiError', () => {
  it('includes status code', () => {
    const error = new SvgrApiError(404, 'Not found');
    expect(error.status).toBe(404);
    expect(error.message).toBe('Not found');
    expect(error.name).toBe('SvgrApiError');
  });
});
