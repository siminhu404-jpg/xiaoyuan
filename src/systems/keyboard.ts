export interface KeyState {
  w: boolean; a: boolean; s: boolean; d: boolean;
  up: boolean; down: boolean; left: boolean; right: boolean;
}

/** 键盘状态 + 相机水平朝向 → 世界 XZ 移动方向（归一化）；无按键返回 null */
export function computeMoveDir(
  keys: KeyState,
  camForward: { x: number; z: number },
): { x: number; z: number } | null {
  const fwd = Math.hypot(camForward.x, camForward.z) < 1e-6
    ? { x: 0, z: -1 }
    : (() => {
        const len = Math.hypot(camForward.x, camForward.z);
        return { x: camForward.x / len, z: camForward.z / len };
      })();
  const right = { x: -fwd.z, z: fwd.x };
  let dx = 0, dz = 0;
  if (keys.w || keys.up) { dx += fwd.x; dz += fwd.z; }
  if (keys.s || keys.down) { dx -= fwd.x; dz -= fwd.z; }
  if (keys.d || keys.right) { dx += right.x; dz += right.z; }
  if (keys.a || keys.left) { dx -= right.x; dz -= right.z; }
  const len = Math.hypot(dx, dz);
  if (len < 1e-6) return null;
  return { x: dx / len, z: dz / len };
}