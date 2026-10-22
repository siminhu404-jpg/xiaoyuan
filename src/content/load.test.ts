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
  it('拒绝根对象非对象/热点非数组', () => {
    expect(() => getHotspotMap(null)).toThrow(/hotspots 数组/);
    expect(() => getHotspotMap({ hotspots: 'not-an-array' })).toThrow(/hotspots 数组/);
  });
  it('拒绝非法 position', () => {
    expect(() => getHotspotMap({ hotspots: [{ ...validHotspot, position: ['a', 'b'] }] })).toThrow(/position/);
    expect(() => getHotspotMap({ hotspots: [{ ...validHotspot, position: [0] }] })).toThrow(/position/);
    expect(() => getHotspotMap({ hotspots: [{ ...validHotspot, position: [0, 'x'] }] })).toThrow(/position/);
  });
  it('拒绝非法 standAt', () => {
    expect(() => getHotspotMap({ hotspots: [{ ...validHotspot, standAt: [0] }] })).toThrow(/standAt/);
    expect(() => getHotspotMap({ hotspots: [{ ...validHotspot, standAt: ['a', 'b'] }] })).toThrow(/standAt/);
  });
  it('拒绝 memory.title 为空', () => {
    expect(() =>
      getHotspotMap({ hotspots: [{ ...validHotspot, memory: { title: '', text: 'x' } }] }),
    ).toThrow(/memory\.title/);
  });
  it('拒绝 memory.text 为空', () => {
    expect(() =>
      getHotspotMap({ hotspots: [{ ...validHotspot, memory: { title: 't', text: '' } }] }),
    ).toThrow(/memory\.text/);
  });
  it('拒绝 memory.photo 非字符串', () => {
    expect(() =>
      getHotspotMap({ hotspots: [{ ...validHotspot, memory: { title: 't', text: 'x', photo: 5 } }] }),
    ).toThrow(/memory\.photo/);
  });
});