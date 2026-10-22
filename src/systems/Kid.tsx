import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGame } from '../app/store';
import { stepToward, resolveCollision } from './movement';
import { OBSTACLES } from './obstacles';

const SPEED = 1.5; // 米/秒，闲庭信步

export default function Kid() {
  const group = useRef<THREE.Group>(null!);
  const posRef = useRef({ x: 0, z: 17 });
  const yawRef = useRef(Math.PI); // 面朝北（-z，进院方向）
  const tRef = useRef(0);

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05); // 切后台回来防跳变
    const g = useGame.getState();
    const t = tRef.current += dt;

    if (g.target && g.phase !== 'title') {
      const { x, z, reached } = stepToward(posRef.current, g.target, SPEED, dt);
      const solved = resolveCollision(x, z, OBSTACLES);
      posRef.current = solved;
      // 每帧把位置写进 store，FollowCamera 用 getState() 非响应式读取，避免重渲染风暴
      useGame.getState().setKidPos({ x: solved.x, z: solved.z });
      // 朝向移动方向
      const dx = g.target.x - solved.x, dz = g.target.z - solved.z;
      if (Math.hypot(dx, dz) > 0.05) {
        yawRef.current = Math.atan2(dx, dz);
      }
      if (reached) {
        g.setTarget(null);
        if (g.pendingHotspot) {
          const id = g.pendingHotspot;
          g.setPendingHotspot(null);
          g.setOpenHotspot(id); // 到达物件 → 打开记忆卡
        }
      }
    } else {
      // 待机：轻微呼吸摇摆
    }

    if (group.current) {
      group.current.position.set(posRef.current.x, 0, posRef.current.z);
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y, yawRef.current, Math.min(1, dt * 10),
      );
      const bob = g.target ? Math.abs(Math.sin(t * 8)) * 0.06 : Math.sin(t * 2) * 0.01;
      group.current.position.y = bob;
    }
  });

  return (
    <group ref={group} position={[0, 0, 17]}>
      {/* 占位小人：胶囊身体+球头。正式模型（Tripo+Mixamo）后续替换 */}
      <mesh castShadow position={[0, 0.55, 0]}>
        <capsuleGeometry args={[0.22, 0.55, 4, 8]} />
        <meshLambertMaterial color="#e8582a" />
      </mesh>
      <mesh castShadow position={[0, 1.05, 0]}>
        <sphereGeometry args={[0.22, 16, 12]} />
        <meshLambertMaterial color="#f2c49b" />
      </mesh>
    </group>
  );
}