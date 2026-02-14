import { describe, it, expect } from 'vitest';
import { svgrKeys } from './query-keys';

describe('svgrKeys', () => {
  it('has all key as base', () => {
    expect(svgrKeys.all).toEqual(['svgr']);
  });

  it('convert key extends all', () => {
    expect(svgrKeys.convert()).toEqual(['svgr', 'convert']);
  });
});
