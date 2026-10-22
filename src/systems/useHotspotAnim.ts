import { useRef } from 'react';
import type { Group } from 'three';
import { useFrame } from '@react-three/fiber';
import { useGame } from '../app/store';
import type { AnimKind } from '../content/types';
import type { HotspotId } from '../content/types';

/**
 * 监听 store：openHotspot === id 时，在 DURATION 内按 anim 类型驱动 groupRef。
 * 返回 ref 挂到物件根 group 上。
 */
export function useHotspotAnim(id: HotspotId, anim: AnimKind) {
  const ref = useRef<Group>(null!);
  const clock = useRef<number | null>(null);

  useFrame((_, dt) => {
    const g = useGame.getState();
    const active = g.openHotspot === id;
    if (active && clock.current === null) clock.current = 0;
    if (!active && clock.current !== null && clock.current > 0.5) {
      // 早合上：复位姿态后再清空时钟，避免 props 卡在扭曲位姿
      const grp = ref.current;
      if (grp) resetGroup(grp, anim);
      clock.current = null;
    }
    if (clock.current === null) return;
    clock.current += dt;
    const t = clock.current;
    const grp = ref.current;
    if (!grp) return;

    switch (anim) {
      case 'shake': // 3 秒内衰减摇摆
        grp.rotation.z = Math.sin(t * 18) * 0.08 * Math.max(0, 1 - t / 3);
        break;
      case 'wobble':
        grp.rotation.x = Math.sin(t * 4) * 0.15 * Math.max(0, 1 - t / 3);
        break;
      case 'ripple': {
        const s = 1 + Math.sin(t * 6) * 0.04 * Math.max(0, 1 - t / 3);
        grp.scale.set(s, 1, s);
        break;
      }
      case 'liftDoor': // 门开到 70°
        grp.rotation.y = -Math.min(1, t / 0.8) * (Math.PI * 0.39);
        break;
      case 'curtain':
        grp.scale.y = 1 + Math.sin(t * 9) * 0.06 * Math.max(0, 1 - t / 2.5);
        break;
      case 'lightFlow': {
        const m = (grp.children[0] as {
          material?: { opacity: number; emissiveIntensity?: number; transparent?: boolean };
        });
        if (m?.material) {
          m.material.transparent = true;
          m.material.opacity = 0.5 + Math.sin(t * 2.4) * 0.35;
        }
        break;
      }
      // 猫的动效在 Cats.tsx 内部实现（需要多只协调），此处跳过
      case 'catLazy': case 'catAlert': case 'catFriendly': break;
      case 'water': case 'particles': break; // 粒子动效在专属组件实现
    }
    if (t > 3.5) { // 复位
      resetGroup(grp, anim);
    }
  });

  /**
   * 复位 group 到初始姿态；lightFlow 额外恢复材质 opacity。
   */
  function resetGroup(grp: Group, animKind: AnimKind) {
    grp.rotation.z = 0; grp.rotation.x = 0; grp.scale.set(1, 1, 1); grp.rotation.y = 0;
    if (animKind === 'lightFlow') {
      const m = (grp.children[0] as {
        material?: { opacity?: number };
      })?.material;
      if (m && typeof m.opacity === 'number') m.opacity = 0.18;
    }
  }

  return ref;
}