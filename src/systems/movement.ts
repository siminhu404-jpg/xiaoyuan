import { WALK_BOUNDS } from '../scene/layout';

export interface Obstacle {
  x: number;
  z: number;
  r: number;
  /** Optional axis-aligned solid rectangle, already expanded by the character radius. */
  halfWidth?: number;
  halfDepth?: number;
}

const EPS = 1e-4;

export function clampToWalkArea(x: number, z: number): { x: number; z: number } {
  return {
    x: Math.min(WALK_BOUNDS.maxX, Math.max(WALK_BOUNDS.minX, x)),
    z: Math.min(WALK_BOUNDS.maxZ, Math.max(WALK_BOUNDS.minZ, z)),
  };
}

function isBlocked(x: number, z: number, obstacle: Obstacle) {
  const dx = x - obstacle.x;
  const dz = z - obstacle.z;
  if (obstacle.halfWidth !== undefined && obstacle.halfDepth !== undefined) {
    return Math.abs(dx) < obstacle.halfWidth && Math.abs(dz) < obstacle.halfDepth;
  }
  return Math.hypot(dx, dz) < obstacle.r;
}

function collisionCandidates(x: number, z: number, obstacle: Obstacle) {
  if (obstacle.halfWidth !== undefined && obstacle.halfDepth !== undefined) {
    return [
      { x: obstacle.x - obstacle.halfWidth, z },
      { x: obstacle.x + obstacle.halfWidth, z },
      { x, z: obstacle.z - obstacle.halfDepth },
      { x, z: obstacle.z + obstacle.halfDepth },
    ];
  }

  const dx = x - obstacle.x;
  const dz = z - obstacle.z;
  const distance = Math.hypot(dx, dz);
  if (distance < EPS) return [{ x: obstacle.x + obstacle.r, z: obstacle.z }];
  const scale = obstacle.r / distance;
  return [{ x: obstacle.x + dx * scale, z: obstacle.z + dz * scale }];
}

export function resolveCollision(x: number, z: number, obstacles: readonly Obstacle[]): { x: number; z: number } {
  let px = x, pz = z;
  // A target can sit inside overlapping shapes (e.g. the edge of a pergola and a field).
  // Pick an exit that is clear of all obstacles instead of pushing back and forth between them.
  for (let pass = 0; pass < obstacles.length; pass += 1) {
    let changed = false;
    for (const obstacle of obstacles) {
      if (!isBlocked(px, pz, obstacle)) continue;
      const candidates = collisionCandidates(px, pz, obstacle);
      const clear = candidates.filter((candidate) =>
        obstacles.every((other) => !isBlocked(candidate.x, candidate.z, other)),
      );
      const options = clear.length > 0 ? clear : candidates;
      const next = options.reduce((best, candidate) => (
        Math.hypot(candidate.x - px, candidate.z - pz)
          < Math.hypot(best.x - px, best.z - pz) ? candidate : best
      ));
      px = next.x;
      pz = next.z;
      changed = true;
    }
    if (!changed) break;
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