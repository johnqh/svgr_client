import { describe, it, expect, beforeEach } from 'vitest';
import { MockNetworkClient } from '@sudobility/di/mocks';
import { SvgrClient, SvgrApiError } from './SvgrClient';

describe('SvgrClient', () => {
  let client: SvgrClient;
  let mockNetwork: MockNetworkClient;

  beforeEach(() => {
    mockNetwork = new MockNetworkClient();
    client = new SvgrClient({
      baseUrl: 'http://localhost:3001',
      networkClient: mockNetwork,
    });
  });

  it('sends POST request to /api/v1/convert', async () => {
    const mockResponse = {
      success: true,
      data: { svg: '<svg/>', width: 100, height: 100 },
    };

    mockNetwork.setMockResponse(
      'http://localhost:3001/api/v1/convert',
      { data: mockResponse, ok: true },
      'POST',
    );

    const result = await client.convert('base64data', 'test.png');
    expect(result).toEqual(mockResponse);
    expect(mockNetwork.wasUrlCalled('http://localhost:3001/api/v1/convert', 'POST')).toBe(true);
  });

  it('includes all parameters in request body', async () => {
    mockNetwork.setMockResponse(
      'http://localhost:3001/api/v1/convert',
      { data: { success: true }, ok: true },
      'POST',
    );

    await client.convert('data', 'photo.png', 90, true);

    const lastRequest = mockNetwork.getLastRequest();
    expect(lastRequest?.body).toBe(
      JSON.stringify({
        original: 'data',
        filename: 'photo.png',
        quality: 90,
        transparentBg: true,
      }),
    );
  });

  it('throws SvgrApiError on non-ok response', async () => {
    mockNetwork.setMockResponse(
      'http://localhost:3001/api/v1/convert',
      { data: { error: 'Bad request' }, ok: false, status: 400 },
      'POST',
    );

    await expect(client.convert('bad')).rejects.toThrow(SvgrApiError);
    await expect(client.convert('bad')).rejects.toThrow('Bad request');
  });

  it('throws SvgrApiError with default message when no error field', async () => {
    mockNetwork.setMockResponse(
      'http://localhost:3001/api/v1/convert',
      { data: null, ok: false, status: 500 },
      'POST',
    );

    await expect(client.convert('bad')).rejects.toThrow('Conversion failed');
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
