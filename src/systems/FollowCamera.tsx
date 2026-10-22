import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGame } from '../app/store';
import { OBSTACLES } from './obstacles';

const OFFSET = new THREE.Vector3(0, 3.2, 4.6); // 小人身后上方
const LERP = 2.5; // 相机跟随平滑系数

export default function FollowCamera() {
  const { camera } = useThree();
  const desired = new THREE.Vector3();
  const lookAt = new THREE.Vector3();

  useFrame((_, dt) => {
    const { kidPos } = useGame.getState();
    desired.set(kidPos.x + OFFSET.x, OFFSET.y, kidPos.z + OFFSET.z);
    lookAt.set(kidPos.x, 1.0, kidPos.z);

    // 射线防穿墙：从小人头部到理想相机位连线，被障碍挡住则把相机拉近
    // 简化实现：相机高度固定，只检查水平方向上是否陷入建筑圆柱内，陷入则沿连线拉近到障碍半径外
    let t = 1.0;
    const head = new THREE.Vector3(kidPos.x, 1.2, kidPos.z);
    for (const o of OBSTACLES) {
      const dx = desired.x - head.x, dz = desired.z - head.z;
      const len = Math.hypot(dx, dz);
      if (len < 1e-3) continue;
      // 点到线段最近距离（水平面）
      const px = head.x - o.x, pz = head.z - o.z;
      const dot = (px * dx + pz * dz) / (len * len);
      if (dot < 0 || dot > 1) continue;
      const cx = head.x + dx * dot - o.x, cz = head.z + dz * dot - o.z;
      const dist = Math.hypot(cx, cz);
      if (dist < o.r + 0.3) {
        // 拉近：解 t 使相机在障碍外
        const back = Math.max(0.05, dot - 0.35);
        t = Math.min(t, back / 1);
      }
    }
    const finalPos = new THREE.Vector3().lerpVectors(head, desired, t);
    finalPos.y = THREE.MathUtils.lerp(camera.position.y, finalPos.y + 0.6, 1);

    camera.position.lerp(finalPos, Math.min(1, dt * LERP));
    camera.lookAt(lookAt);
  });

  return null;
}