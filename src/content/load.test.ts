import { describe, expect, it } from 'vitest';
import { getHotspotMap } from './load';

const validHotspot = {
  id: 'gate', label: '新大门',
  position: [0, 18] as const, standAt: [0, 16.5] as const,
  anim: 'liftDoor',
  memory: { title: '回家', text: '每次回来...', photo: 'gate-2020.webp' },
};

describe('getHotspotMap', () => {
  it('接受合法数据', () => {
    const m = getHotspotMap({ hotspots: [validHotspot] });
    expect(m.hotspots).toHaveLength(1);
    expect(m.hotspots[0].label).toBe('新大门');
  });
  it('photo 可省略', () => {
    const { memory, ...noPhoto } = validHotspot;
    const m = getHotspotMap({ hotspots: [{ ...noPhoto, memory: { title: 't', text: 'x' } }] });
    expect(m.hotspots[0].memory?.photo).toBeUndefined();
  });
  it('拒绝未知 id', () => {
    expect(() => getHotspotMap({ hotspots: [{ ...validHotspot, id: 'moon' as never }] })).toThrow(/id/);
  });
  it('拒绝未知 anim', () => {
    expect(() => getHotspotMap({ hotspots: [{ ...validHotspot, anim: 'spin' as never }] })).toThrow(/anim/);
  });
  it('拒绝缺失 label', () => {
    const { label, ...noLabel } = validHotspot;
    expect(() => getHotspotMap({ hotspots: [noLabel] })).toThrow(/label/);
  });
  it('拒绝重复 id', () => {
    expect(() => getHotspotMap({ hotspots: [validHotspot, validHotspot] })).toThrow(/gate/);
  });
});