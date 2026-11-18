import * as THREE from 'three';

const ROOT_POSITION_TRACK = /Hips\.position$/;

/** Remove root translation so gameplay owns world position; sitting keeps vertical motion. */
export function stripHorizontalRootMotion(clip: THREE.AnimationClip, preserveVertical = false) {
  const sanitized = clip.clone();
  sanitized.tracks = sanitized.tracks.flatMap((track) => {
    if (!ROOT_POSITION_TRACK.test(track.name)) return [track];
    if (!preserveVertical) return [];

    const verticalOnly = track.clone() as THREE.VectorKeyframeTrack;
    for (let index = 0; index < verticalOnly.values.length; index += 3) {
      verticalOnly.values[index] = 0;
      verticalOnly.values[index + 2] = 0;
    }
    return [verticalOnly];
  });
  return sanitized;
}
