import { describe, expect, it } from 'vitest';
import { WALL_SURFACE_STYLE } from './CourtyardMaterials';

describe('墙面风格', () => {
  it('墙面使用低对比度的大块纹理，避免板材感', () => {
    expect(WALL_SURFACE_STYLE.tileWidth).toBeGreaterThanOrEqual(24);
    expect(WALL_SURFACE_STYLE.tileHeight).toBeGreaterThanOrEqual(18);
    expect(WALL_SURFACE_STYLE.grout).toBe('#d9cdbb');
    expect(WALL_SURFACE_STYLE.lineWidth).toBeLessThanOrEqual(1);
  });
});
