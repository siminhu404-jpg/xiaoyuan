import { describe, expect, it } from 'vitest';
import { COURTYARD_PROP_PLACEMENTS, getPumpWaterState } from './CourtyardProps';
import { getHotspotAction } from '../../systems/clickRouting';
import type { Hotspot } from '../../content/types';

describe('内院生活道具布局', () => {
  it('把生活道具放在内院两侧，不堵住主通道', () => {
    expect(COURTYARD_PROP_PLACEMENTS.bed).toEqual([-5.6, -6.4]);
    expect(COURTYARD_PROP_PLACEMENTS.pumpWell).toEqual([5.6, -4.8]);
    expect(COURTYARD_PROP_PLACEMENTS.bowl).toEqual([5.8, -4.05]);
    expect(COURTYARD_PROP_PLACEMENTS.bucket).toEqual([6.5, -5.5]);
  });
});

describe('压水井交互', () => {
  it('点击压水井时直接触发压水，而不是让人物先走过去', () => {
    const hotspot: Hotspot = {
      id: 'pump-well',
      label: '压水井',
      position: [5.6, -4.8],
      standAt: [4.6, -4.8],
      anim: 'water',
    };

    expect(getHotspotAction(hotspot)).toEqual({ kind: 'pump', id: 'pump-well' });
  });

  it('压水动作在短时间内产生水流，随后停止', () => {
    expect(getPumpWaterState(0, 0.3)).toBe('active');
    expect(getPumpWaterState(1.1, 1)).toBe('idle');
  });
});
