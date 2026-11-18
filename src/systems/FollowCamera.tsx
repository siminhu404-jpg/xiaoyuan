import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGame } from '../app/store';
import { GRAYBOX_CAMERA } from '../scene/layout';
import { OBSTACLES } from './obstacles';

const DESKTOP_CAMERA = {
  height: GRAYBOX_CAMERA.height,
  distance: GRAYBOX_CAMERA.distance,
  lookAtHeight: 1.05,
  lift: 0.45,
} as const;

const MOBILE_CAMERA = {
  height: 4.35,
  distance: 7.4,
  lookAtHeight: 1.0,
  lift: 0.4,
} as const;

const MOBILE_BREAKPOINT = 700;
const LERP = 3.2;

export default function FollowCamera() {
  const { camera, size } = useThree();
  const desired = new THREE.Vector3();
  const lookAt = new THREE.Vector3();

  useFrame((_, dt) => {
    const { kidPos } = useGame.getState();
    const profile = size.width < MOBILE_BREAKPOINT ? MOBILE_CAMERA : DESKTOP_CAMERA;
    desired.set(kidPos.x, profile.height, kidPos.z + profile.distance);
    lookAt.set(kidPos.x, profile.lookAtHeight, kidPos.z);

    // 射线防穿墙：从小人头部到理想相机位连线，被障碍挡住则把相机拉近
    let t = 1.0;
    const head = new THREE.Vector3(kidPos.x, 1.2, kidPos.z);
    for (const o of OBSTACLES) {
      const dx = desired.x - head.x, dz = desired.z - head.z;
      const len = Math.hypot(dx, dz);
      if (len < 1e-3) continue;
      const px = head.x - o.x, pz = head.z - o.z;
      const dot = (px * dx + pz * dz) / (len * len);
      if (dot < 0 || dot > 1) continue;
      const cx = head.x + dx * dot - o.x, cz = head.z + dz * dot - o.z;
      const dist = Math.hypot(cx, cz);
      if (dist < o.r + 0.3) {
        const back = Math.max(0.05, dot - 0.35);
        t = Math.min(t, back);
      }
    }
    const finalPos = new THREE.Vector3().lerpVectors(head, desired, t);
    finalPos.y = profile.height + profile.lift;

    camera.position.lerp(finalPos, Math.min(1, dt * LERP));
    camera.lookAt(lookAt);
  });

  return null;
}
