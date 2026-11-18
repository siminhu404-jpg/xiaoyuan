import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { stripRootMotion } from './PetDog';

describe('边牧行走动画', () => {
  it('移除根节点位移，避免动画把小狗带离跟随坐标', () => {
    const clip = new THREE.AnimationClip('walk', -1, [
      new THREE.VectorKeyframeTrack('tripo::Root.position', [0, 1], [0, 0, 0, 1, 0, 0]),
      new THREE.QuaternionKeyframeTrack('tripo::Root.quaternion', [0, 1], [0, 0, 0, 1, 0, 0, 0, 1]),
    ]);

    const stripped = stripRootMotion(clip);

    expect(stripped.tracks.map((track) => track.name)).toEqual(['tripo::Root.quaternion']);
  });
});
