import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGame } from '../app/store';
import { computeMoveDir } from './keyboard';
import type { KeyState } from './keyboard';

const AHEAD = 1.2; // 键盘目标点在小人前方 1.2m，持续刷新

const KEY_MAP: Record<string, keyof KeyState> = {
  KeyW: 'w', KeyA: 'a', KeyS: 's', KeyD: 'd',
  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
};

const IDLE: KeyState = {
  w: false, a: false, s: false, d: false,
  up: false, down: false, left: false, right: false,
};

/**
 * 桌面键盘行走：作为 movement 系统的又一 target 来源（与点击同路径）。
 * 每次帧向小人身前 1.2m 的相机相对方向 setTarget，松键即停。
 * 仅在 play 相位工作；移动端无键盘 → 监听器惰性，不受影响。
 */
export default function KeyboardMove() {
  const { camera } = useThree();
  const keysRef = useRef<KeyState>(IDLE);
  const dirVec = useRef(new THREE.Vector3()); // 复用，帧循环零分配
  const wasKeyboardRef = useRef(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent, down: boolean) => {
      const k = KEY_MAP[e.code];
      if (!k) return;
      e.preventDefault();
      keysRef.current[k] = down;
    };
    const kd = (e: KeyboardEvent) => onKey(e, true);
    const ku = (e: KeyboardEvent) => onKey(e, false);
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);
    return () => {
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup', ku);
    };
  }, []);

  useFrame(() => {
    const g = useGame.getState();
    if (g.phase !== 'play') return; // 与 ClickToMove 同一相位闸门

    camera.getWorldDirection(dirVec.current);
    const dir = computeMoveDir(keysRef.current, {
      x: dirVec.current.x,
      z: dirVec.current.z,
    });

    if (dir) {
      if (g.pendingHotspot) g.setPendingHotspot(null); // 键盘接管时取消物件走向（与地面点击一致）
      g.setTarget({ x: g.kidPos.x + dir.x * AHEAD, z: g.kidPos.z + dir.z * AHEAD });
      wasKeyboardRef.current = true;
    } else if (wasKeyboardRef.current) {
      // 仅当目标由键盘设置时才停止，避免误取消用户刚点击的物件走向
      g.setTarget(null);
      wasKeyboardRef.current = false;
    }
  });
  return null;
}