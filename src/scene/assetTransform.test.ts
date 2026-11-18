import { describe, expect, it } from 'vitest';
import { getCenterOffset, getFitWidthScale } from './assetTransform';

describe('getCenterOffset', () => {
  it('returns the offset that centers an asset on the local x axis', () => {
    expect(getCenterOffset(-0.2, 1.4)).toBeCloseTo(-0.6);
  });

  it('returns zero for an already centered asset', () => {
    expect(getCenterOffset(-0.9, 0.9)).toBe(0);
  });
});

describe('getFitWidthScale', () => {
  it('scales a fitted door leaf to the opening width', () => {
    expect(getFitWidthScale(1.619, 1.8)).toBeCloseTo(1.1118, 3);
  });
});
