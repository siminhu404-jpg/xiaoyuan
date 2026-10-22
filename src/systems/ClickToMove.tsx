import { useMemo } from 'react';
import type { ReactNode } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { useGame } from '../app/store';
import { hotspots } from '../content/data';

const DRAG_THRESHOLD_PX = 8;

/**
 * 包裹全场景的点击层：group 上的 handler 会递归射线所有子节点，
 * intersections[0] 即真实命中物（地面/物件/建筑），再按 userData/name 路由。
 */
export default function ClickToMove({
  children,
  onGroundClick,
}: {
  children: ReactNode;
  onGroundClick?: (p: { x: number; z: number }) => void;
}) {
  const down = useMemo(() => ({ x: 0, y: 0 }), []);

  const handleDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    down.x = e.clientX ?? 0;
    down.y = e.clientY ?? 0;
  };
  const handleUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation(); // 只处理最近命中，避免多个交点重复触发
    const dx = (e.clientX ?? 0) - down.x, dy = (e.clientY ?? 0) - down.y;
    if (Math.hypot(dx, dy) > DRAG_THRESHOLD_PX) return; // 拖动视角，不算点击
    const hit = e.intersections[0];
    if (!hit) return;
    const obj = hit.object;
    const hid = obj.userData?.hotspotId as string | undefined;
    if (hid) {
      const h = hotspots.find((x) => x.id === hid);
      if (!h) return;
      useGame.getState().setPendingHotspot(h.id);
      useGame.getState().setTarget({ x: h.standAt[0], z: h.standAt[1] });
    } else if (obj.name === 'ground') {
      useGame.getState().setPendingHotspot(null);
      useGame.getState().setTarget({ x: hit.point.x, z: hit.point.z });
      onGroundClick?.({ x: hit.point.x, z: hit.point.z });
    }
    // 命中天空（无交集）或普通建筑体块：无反应
  };

  return (
    <group onPointerDown={handleDown} onPointerUp={handleUp}>
      {children}
    </group>
  );
}