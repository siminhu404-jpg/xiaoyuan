import { useMemo } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { useGame } from '../app/store';
import { hotspots } from '../content/data';

const DRAG_THRESHOLD_PX = 8;

export default function ClickToMove({ onGroundClick }: { onGroundClick?: (p: { x: number; z: number }) => void }) {
  const down = useMemo(() => ({ x: 0, y: 0 }), []);

  const handleDown = (e: ThreeEvent<PointerEvent>) => { down.x = e.clientX ?? 0; down.y = e.clientY ?? 0; };
  const handleUp = (e: ThreeEvent<PointerEvent>) => {
    const dx = (e.clientX ?? 0) - down.x, dy = (e.clientY ?? 0) - down.y;
    if (Math.hypot(dx, dy) > DRAG_THRESHOLD_PX) return; // 拖动视角，不算点击
    const obj = e.intersections[0]?.object;
    if (!obj) return;
    const hid = obj.userData?.hotspotId as string | undefined;
    if (hid) {
      const h = hotspots.find((x) => x.id === hid);
      if (!h) return;
      useGame.getState().setPendingHotspot(h.id);
      useGame.getState().setTarget({ x: h.standAt[0], z: h.standAt[1] });
    } else if (obj.name === 'ground') {
      const p = e.intersections[0].point;
      useGame.getState().setPendingHotspot(null);
      useGame.getState().setTarget({ x: p.x, z: p.z });
      onGroundClick?.({ x: p.x, z: p.z });
    }
  };

  return (
    <mesh
      name="click-capture"
      visible={false}
      position={[0, 0, 0]}
      onPointerDown={handleDown}
      onPointerUp={handleUp}
    >
      <planeGeometry args={[80, 80]} />
    </mesh>
  );
}