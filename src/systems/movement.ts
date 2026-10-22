import { WALK_BOUNDS } from '../scene/layout';

export interface Obstacle { x: number; z: number; r: number }

const EPS = 1e-4;

export function clampToWalkArea(x: number, z: number): { x: number; z: number } {
  return {
    x: Math.min(WALK_BOUNDS.maxX, Math.max(WALK_BOUNDS.minX, x)),
    z: Math.min(WALK_BOUNDS.maxZ, Math.max(WALK_BOUNDS.minZ, z)),
  };
}

export function resolveCollision(x: number, z: number, obstacles: readonly Obstacle[]): { x: number; z: number } {
  let px = x, pz = z;
  for (const o of obstacles) {
    const dx = px - o.x, dz = pz - o.z;
    const dist = Math.hypot(dx, dz);
    if (dist < o.r) {
      if (dist < EPS) { px = o.x + o.r; continue; } // 正中心：往东推
      px = o.x + (dx / dist) * o.r;
      pz = o.z + (dz / dist) * o.r;
    }
  }
  return clampToWalkArea(px, pz);
}

/** 每帧推进；目标距离小于一步时贴齐并标记 reached */
export function stepToward(
  from: { x: number; z: number }, to: { x: number; z: number },
  speed: number, dt: number,
): { x: number; z: number; reached: boolean } {
  const dx = to.x - from.x, dz = to.z - from.z;
  const dist = Math.hypot(dx, dz);
  const step = speed * dt;
  if (dist <= step || dist < EPS) return { x: to.x, z: to.z, reached: true };
  return { x: from.x + (dx / dist) * step, z: from.z + (dz / dist) * step, reached: false };
}