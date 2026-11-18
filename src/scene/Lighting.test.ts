import { describe, expect, it } from 'vitest';
import { LIGHTING_STYLE } from './Lighting';

describe('乡村庭院光照风格', () => {
  it('使用左前上方的暖色主光和可见阴影范围', () => {
    expect(LIGHTING_STYLE.sunPosition[0]).toBeLessThan(0);
    expect(LIGHTING_STYLE.sunPosition[1]).toBeGreaterThan(10);
    expect(LIGHTING_STYLE.sunColor).toBe('#f6c58f');
    expect(LIGHTING_STYLE.shadowMapSize).toBeGreaterThanOrEqual(1024);
  });

  it('环境补光低于主光，避免阴影区域被照平', () => {
    expect(LIGHTING_STYLE.ambientIntensity).toBeLessThan(LIGHTING_STYLE.sunIntensity);
    expect(LIGHTING_STYLE.hemisphereIntensity).toBeLessThan(LIGHTING_STYLE.sunIntensity);
  });
});
