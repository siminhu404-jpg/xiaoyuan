import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { stripHorizontalRootMotion } from './characterAnimation';

describe('角色根位移处理', () => {
  it('坐下动画保留骨盆垂直位移，只清除水平位移', () => {
    const clip = new THREE.AnimationClip('sit.001', 1, [
      new THREE.VectorKeyframeTrack(
        'mixamorig:Hips.position',
        [0, 0.5, 1],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
      ),
    ]);

    const sanitized = stripHorizontalRootMotion(clip, true);
    expect(Array.from((sanitized.tracks[0] as THREE.VectorKeyframeTrack).values)).toEqual([
      expect.closeTo(0), expect.closeTo(2), expect.closeTo(0),
      expect.closeTo(0), expect.closeTo(5), expect.closeTo(0),
      expect.closeTo(0), expect.closeTo(8), expect.closeTo(0),
    ]);
  });
});
