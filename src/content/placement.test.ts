import { describe, expect, it } from 'vitest';
import hotspots from '../../content/hotspots.json';
import { WALK_BOUNDS } from '../scene/layout';

describe('hotspot graybox placement', () => {
  it('每个热点有可行走的站立点', () => {
    for (const hotspot of hotspots.hotspots) {
      const [x, z] = hotspot.standAt;
      expect(x, `${hotspot.id}.standAt.x`).toBeGreaterThanOrEqual(WALK_BOUNDS.minX);
      expect(x, `${hotspot.id}.standAt.x`).toBeLessThanOrEqual(WALK_BOUNDS.maxX);
      expect(z, `${hotspot.id}.standAt.z`).toBeGreaterThanOrEqual(WALK_BOUNDS.minZ);
      expect(z, `${hotspot.id}.standAt.z`).toBeLessThanOrEqual(WALK_BOUNDS.maxZ);
    }
  });

  it('保留外门到堂屋的空间层次', () => {
    const byId = Object.fromEntries(hotspots.hotspots.map((hotspot) => [hotspot.id, hotspot]));
    expect(byId.gate.position[1]).toBeGreaterThan(byId['old-door'].position[1]);
    expect(byId['old-door'].position[1]).toBeGreaterThan(byId['main-room'].position[1]);
  });
});