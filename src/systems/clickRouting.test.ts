import { describe, expect, it } from 'vitest';
import type { Hotspot } from '../content/types';
import { getHotspotAction } from './clickRouting';

const hotspot: Hotspot = {
  id: 'gate',
  label: '新大门',
  position: [0, 18],
  standAt: [0, 19.2],
  anim: 'liftDoor',
};

describe('getHotspotAction', () => {
  it('opens the gate in place instead of moving the kid', () => {
    expect(getHotspotAction(hotspot)).toEqual({ kind: 'open', id: 'gate' });
  });

  it('walks to the rocking chair and prepares a sitting interaction', () => {
    const chair: Hotspot = {
      id: 'rocking-chair',
      label: '摇椅',
      position: [0.5, 1.25],
      standAt: [0.5, 2.7],
      anim: 'sit',
    };

    expect(getHotspotAction(chair)).toEqual({
      kind: 'sit',
      id: 'rocking-chair',
      target: { x: 0.5, z: 2.7 },
      seat: { x: 0.5, z: 1.25 },
    });
  });
});
