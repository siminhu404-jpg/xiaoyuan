import { describe, expect, it } from 'vitest';
import { GATE_POS, LANDMARKS, SCENE_BOUNDS, SECTIONS, WALK_BOUNDS, WALK_LANES } from './layout';

const distance = (a: readonly [number, number], b: readonly [number, number]) =>
  Math.hypot(a[0] - b[0], a[1] - b[1]);

describe('灰盒空间布局', () => {
  it('保持从南到北的两进院落顺序', () => {
    expect(GATE_POS[1]).toBeGreaterThan(LANDMARKS.innerGate[1]);
    expect(LANDMARKS.innerGate[1]).toBeGreaterThan(LANDMARKS.mainRoom[1]);
    expect(LANDMARKS.mainRoom[1]).toBeGreaterThanOrEqual(SCENE_BOUNDS.minZ);
  });

  it('所有核心锚点落在场地内', () => {
    for (const [name, [x, z]] of Object.entries(LANDMARKS)) {
      expect(x, `${name}.x`).toBeGreaterThanOrEqual(SCENE_BOUNDS.minX);
      expect(x, `${name}.x`).toBeLessThanOrEqual(SCENE_BOUNDS.maxX);
      expect(z, `${name}.z`).toBeGreaterThanOrEqual(SCENE_BOUNDS.minZ);
      expect(z, `${name}.z`).toBeLessThanOrEqual(SCENE_BOUNDS.maxZ);
    }
  });

  it('主通道在内院门和堂屋之间保留可行走宽度', () => {
    expect(WALK_LANES.main.width).toBeGreaterThanOrEqual(2.2);
    expect(distance(WALK_LANES.main.from, WALK_LANES.main.to)).toBeGreaterThan(10);
    expect(SECTIONS.corridor.zMin).toBeLessThan(SECTIONS.corridor.zMax);
    expect(WALK_BOUNDS.minX).toBeLessThan(0);
    expect(WALK_BOUNDS.maxX).toBeGreaterThan(0);
  });
});