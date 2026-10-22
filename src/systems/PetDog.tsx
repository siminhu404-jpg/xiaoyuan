import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGame } from '../app/store';
import { resolveCollision } from './movement';
import { OBSTACLES } from './obstacles';

const FOLLOW_MIN = 1.8;  // 距主人超过此距离开始跟随
const RUN_DIST = 4;      // 超过此距离切换小跑（更快）
const SPEED_WALK = 2.6;  // 跟随步速（略快于小人的 1.5，能追上）
const SPEED_RUN = 3.4;
const STOP_SLACK = 1.1;  // 距主人小于此距离时滑停（避免贴脸抖动）

/**
 * 边牧「小黑」：跟随小人的宠物狗。
 * 每帧读 store 的 kidPos + target（非响应式），朝主人身后 0.9m 的跟随点移动；
 * 碰撞复用 resolveCollision，帧循环零分配；主人不动时原地摇尾巴。
 */
export default function PetDog() {
  const g = useRef<THREE.Group>(null!);
  const tail = useRef<THREE.Mesh>(null!);
  const pos = useRef({ x: 0.9, z: 18 }); // 出生在门口主人（0,17）旁边
  const yaw = useRef(Math.PI);
  const t = useRef(0);

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05); // 切后台防跳变（与 Kid 一致）
    const s = useGame.getState();
    const t2 = t.current += dt;
    if (!g.current) return;

    // 跟随点 = 主人身后 0.9m（沿主人当前朝向的反方向）
    // 主人朝向由移动方向推算：有 target 时用目标方向，否则用记录的 yaw
    let hx = s.kidPos.x, hz = s.kidPos.z;
    if (s.target) {
      const dx = s.target.x - s.kidPos.x, dz = s.target.z - s.kidPos.z;
      const len = Math.hypot(dx, dz);
      if (len > 0.05) { hx = s.kidPos.x - (dx / len) * 0.9; hz = s.kidPos.z - (dz / len) * 0.9; }
    }

    const dx = hx - pos.current.x, dz = hz - pos.current.z;
    const dist = Math.hypot(dx, dz);
    let moving = false;
    if (dist > FOLLOW_MIN) {
      // 追向跟随点
      const speed = dist > RUN_DIST ? SPEED_RUN : SPEED_WALK;
      const step = Math.min(speed * dt, dist);
      const nx = pos.current.x + (dx / dist) * step;
      const nz = pos.current.z + (dz / dist) * step;
      const solved = resolveCollision(nx, nz, OBSTACLES);
      pos.current = solved;
      yaw.current = Math.atan2(dx, dz);
      moving = true;
    } else if (dist > STOP_SLACK) {
      // 缓冲带内缓慢贴近
      const step = Math.min(0.8 * dt, dist - STOP_SLACK);
      const nx = pos.current.x + (dx / dist) * step;
      const nz = pos.current.z + (dz / dist) * step;
      const solved = resolveCollision(nx, nz, OBSTACLES);
      pos.current = solved;
      yaw.current = Math.atan2(dx, dz);
      moving = true;
    }
    // dist <= STOP_SLACK: 原地待命（摇尾巴）

    g.current.position.set(pos.current.x, 0, pos.current.z);
    // 朝向平滑转向移动方向
    g.current.rotation.y = THREE.MathUtils.lerp(
      g.current.rotation.y, yaw.current, Math.min(1, dt * 10),
    );
    // 跑动起伏 + 待机呼吸、摇尾
    const bob = moving ? Math.abs(Math.sin(t2 * 10)) * 0.05 : Math.sin(t2 * 2) * 0.008;
    g.current.position.y = bob;
    if (tail.current) {
      tail.current.rotation.y = moving
        ? Math.sin(t2 * 14) * 0.5   // 跑动时快摆
        : Math.sin(t2 * 3) * 0.35;  // 待机慢摇
    }
  });

  return (
    <group ref={g} position={[0.9, 0, 18]}>
      {/* 占位边牧：黑白配色。正式模型（Tripo）后续替换，见 docs/ASSETS.md */}
      <mesh castShadow position={[0, 0.32, 0]}>
        <capsuleGeometry args={[0.16, 0.4, 4, 8]} />
        <meshLambertMaterial color="#2b2b2b" />
      </mesh>
      <mesh castShadow position={[0, 0.52, 0.22]}>
        <sphereGeometry args={[0.13, 12, 10]} />
        <meshLambertMaterial color="#2b2b2b" />
      </mesh>
      {/* 口鼻白毛 */}
      <mesh position={[0, 0.47, 0.32]}>
        <sphereGeometry args={[0.07, 10, 8]} />
        <meshLambertMaterial color="#f5f5f0" />
      </mesh>
      {/* 耳朵×2 */}
      <mesh castShadow position={[-0.08, 0.62, 0.2]} rotation={[0, 0, -0.3]}>
        <coneGeometry args={[0.05, 0.14, 4]} />
        <meshLambertMaterial color="#2b2b2b" />
      </mesh>
      <mesh castShadow position={[0.08, 0.62, 0.2]} rotation={[0, 0, 0.3]}>
        <coneGeometry args={[0.05, 0.14, 4]} />
        <meshLambertMaterial color="#2b2b2b" />
      </mesh>
      {/* 胸前白毛 */}
      <mesh position={[0, 0.3, 0.14]}>
        <sphereGeometry args={[0.11, 10, 8]} />
        <meshLambertMaterial color="#f5f5f0" />
      </mesh>
      {/* 尾巴：白毛，跑动时高频率摆动 */}
      <mesh ref={tail} position={[0, 0.42, -0.26]} rotation={[0.6, 0, 0]}>
        <capsuleGeometry args={[0.035, 0.22, 4, 6]} />
        <meshLambertMaterial color="#f5f5f0" />
      </mesh>
      {/* 四条腿由胶囊身体近似，跑动 bob 表现步态；正式模型后移除 */}
    </group>
  );
}
