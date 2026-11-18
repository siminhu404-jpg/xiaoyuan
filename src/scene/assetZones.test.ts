import { describe, expect, it } from 'vitest';
import { getAssetZone } from './assetZones';

describe('asset loading zones', () => {
  it('maps the player position to the three courtyard zones', () => {
    expect(getAssetZone(19.2)).toBe('frontyard');
    expect(getAssetZone(5.9)).toBe('corridor');
    expect(getAssetZone(-2)).toBe('corridor');
    expect(getAssetZone(-2.1)).toBe('backyard');
  });
});
